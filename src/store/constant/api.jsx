import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL is not configured.");
}

// ── API paths ─────────────────────────────────────────────────────────────────

const CSRF_URL = "/users/csrf/";

const ADMIN_LOGIN_URL = "/users/amar-admin/login/";

// IMPORTANT:
// Normal users and admins both use the same
// HttpOnly-cookie refresh endpoint.
const TOKEN_REFRESH_URL = "/users/token/refresh/";

// Admin protected API prefixes.
//
// Reports are also admin-only even though
// they are not under /users/amar-admin/.
const ADMIN_API_PREFIXES = ["/users/amar-admin/", "/reports/admin/"];

// ── Axios instances ───────────────────────────────────────────────────────────

// Main API client used throughout admin application.
const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Clean client.
//
// IMPORTANT:
// Do not attach the api interceptors to this client.
//
// It is used for:
//
// - CSRF request
// - refresh request
//
// This prevents refresh loops.
const authClient = axios.create({
  baseURL,
  withCredentials: true,
});

// ── Runtime state ─────────────────────────────────────────────────────────────

let csrfToken = null;

let csrfRequestPromise = null;

let refreshRequestPromise = null;

let redirectingToLogin = false;

// ── Storage helpers ───────────────────────────────────────────────────────────

const getAccessToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const saveAccessToken = (accessToken) => {
  if (!accessToken) {
    return;
  }

  try {
    localStorage.setItem("accessToken", accessToken);

    /*
     * Legacy cleanup.
     *
     * Refresh JWT must NEVER be stored
     * inside localStorage.
     *
     * Backend stores refresh token
     * inside HttpOnly cookie.
     */
    localStorage.removeItem("refreshToken");
  } catch {
    // Ignore browser storage errors.
  }
};

const clearAuthStorage = () => {
  try {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("user");
  } catch {
    // Ignore browser storage errors.
  }
};

// Delete refresh token saved by
// older frontend implementation.
try {
  localStorage.removeItem("refreshToken");
} catch {
  // Ignore browser storage errors.
}

// ── Navigation helper ─────────────────────────────────────────────────────────

const redirectToLogin = () => {
  if (redirectingToLogin) {
    return;
  }

  if (window.location.pathname === "/login") {
    return;
  }

  redirectingToLogin = true;

  window.location.replace("/login");
};

// ── Session invalidation ──────────────────────────────────────────────────────

const invalidateAdminSession = () => {
  csrfToken = null;

  clearAuthStorage();

  redirectToLogin();
};

// ── Request helpers ───────────────────────────────────────────────────────────

const SAFE_METHODS = new Set(["get", "head", "options"]);

const isUnsafeMethod = (method = "get") => {
  return !SAFE_METHODS.has(method.toLowerCase());
};

const isAdminApiRequest = (url = "") => {
  return ADMIN_API_PREFIXES.some((prefix) => url.includes(prefix));
};

const removeContentType = (headers) => {
  if (!headers) {
    return;
  }

  if (typeof headers.delete === "function") {
    headers.delete("Content-Type");

    return;
  }

  delete headers["Content-Type"];

  delete headers["content-type"];
};

const setHeader = (headers, headerName, value) => {
  if (!headers) {
    return;
  }

  if (typeof headers.set === "function") {
    headers.set(headerName, value);

    return;
  }

  headers[headerName] = value;
};

// ── Error helpers ─────────────────────────────────────────────────────────────

const getResponseMessage = (error) => {
  const data = error?.response?.data;

  if (!data) {
    return "";
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "";
};

const isAdminPermissionDenied = (error, originalRequest) => {
  if (error?.response?.status !== 403) {
    return false;
  }

  if (!isAdminApiRequest(originalRequest?.url)) {
    return false;
  }

  // Login errors should be displayed
  // normally on login page.
  if (originalRequest?.url?.includes(ADMIN_LOGIN_URL)) {
    return false;
  }

  // Refresh failure is handled by
  // refreshAccessToken().
  if (originalRequest?.url?.includes(TOKEN_REFRESH_URL)) {
    return false;
  }

  const message = getResponseMessage(error).toLowerCase();

  /*
   * Do NOT logout for every 403.
   *
   * CSRF failures can also return 403.
   *
   * Logout only when backend clearly says
   * the authenticated user no longer has
   * admin permission.
   */
  return (
    message.includes("admin access only") ||
    message.includes("you do not have permission")
  );
};

// ── CSRF handling ─────────────────────────────────────────────────────────────

const requestCsrfToken = async (forceRefresh = false) => {
  if (csrfToken && !forceRefresh) {
    return csrfToken;
  }

  /*
   * If multiple unsafe requests happen
   * at the same time, they all wait for
   * one CSRF request.
   */
  if (csrfRequestPromise) {
    return csrfRequestPromise;
  }

  if (forceRefresh) {
    csrfToken = null;
  }

  csrfRequestPromise = authClient
    .get(CSRF_URL, {
      headers: {
        "Cache-Control": "no-cache",

        Pragma: "no-cache",
      },
    })
    .then((response) => {
      const receivedToken = response.data?.csrfToken;

      if (!receivedToken) {
        throw new Error("CSRF token was not returned by the server.");
      }

      csrfToken = receivedToken;

      return receivedToken;
    })
    .finally(() => {
      csrfRequestPromise = null;
    });

  return csrfRequestPromise;
};

// ── Refresh-token handling ────────────────────────────────────────────────────

const performRefreshRequest = async (currentCsrfToken) => {
  return authClient.post(
    TOKEN_REFRESH_URL,

    {},

    {
      headers: {
        "Content-Type": "application/json",

        "X-CSRFToken": currentCsrfToken,

        "Cache-Control": "no-cache",
      },
    },
  );
};

const refreshAccessToken = async () => {
  let currentCsrfToken = await requestCsrfToken();

  let response;

  try {
    response = await performRefreshRequest(currentCsrfToken);
  } catch (error) {
    /*
     * A stale CSRF token can return
     * HTTP 403.
     *
     * Get a fresh CSRF token and retry
     * the refresh request exactly once.
     */
    if (error?.response?.status !== 403) {
      throw error;
    }

    csrfToken = null;

    currentCsrfToken = await requestCsrfToken(true);

    response = await performRefreshRequest(currentCsrfToken);
  }

  const newAccessToken = response.data?.access;

  if (!newAccessToken) {
    throw new Error("Token refresh endpoint did not return an access token.");
  }

  saveAccessToken(newAccessToken);

  return newAccessToken;
};

// ── Request interceptor ───────────────────────────────────────────────────────

api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};

    // ─────────────────────────────────────────────────────────────────────────
    // Access JWT
    // ─────────────────────────────────────────────────────────────────────────

    const accessToken = getAccessToken();

    if (accessToken && !config.headers.Authorization) {
      setHeader(
        config.headers,

        "Authorization",

        `Bearer ${accessToken}`,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CSRF
    // ─────────────────────────────────────────────────────────────────────────

    if (isUnsafeMethod(config.method) && !config._skipCsrf) {
      const currentCsrfToken = await requestCsrfToken();

      setHeader(
        config.headers,

        "X-CSRFToken",

        currentCsrfToken,
      );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Content-Type
    // ─────────────────────────────────────────────────────────────────────────

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData) {
      /*
       * Never manually set:
       *
       * multipart/form-data
       *
       * Browser automatically creates
       * the multipart boundary.
       */
      removeContentType(config.headers);
    } else if (config.data !== undefined && config.data !== null) {
      setHeader(
        config.headers,

        "Content-Type",

        "application/json",
      );
    }

    return config;
  },

  (error) => Promise.reject(error),
);

// ── Refresh exclusions ────────────────────────────────────────────────────────

const REFRESH_EXCLUDED_PATHS = [
  CSRF_URL,

  ADMIN_LOGIN_URL,

  TOKEN_REFRESH_URL,

  "/users/login/",

  "/users/register/",

  "/users/verify-otp/",

  "/users/forgot-password/",

  "/users/reset-password/",

  "/users/logout/",
];

const shouldSkipRefresh = (url = "") => {
  return REFRESH_EXCLUDED_PATHS.some((path) => url.includes(path));
};

// ── Response interceptor ──────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error?.config;

    const response = error?.response;

    /*
     * Network error, CORS error,
     * timeout, connection failure, etc.
     */
    if (!response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = response.status;

    // ─────────────────────────────────────────────────────────────────────────
    // Admin permission removed
    // ─────────────────────────────────────────────────────────────────────────

    if (isAdminPermissionDenied(error, originalRequest)) {
      invalidateAdminSession();

      return Promise.reject(error);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CSRF failure
    // ─────────────────────────────────────────────────────────────────────────

    if (status === 403 && isUnsafeMethod(originalRequest.method)) {
      /*
       * Cached token may be stale.
       *
       * Clear it so the next unsafe request
       * obtains a fresh one.
       */
      csrfToken = null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Only HTTP 401 triggers JWT refresh
    // ─────────────────────────────────────────────────────────────────────────

    if (status !== 401) {
      return Promise.reject(error);
    }

    /*
     * Never try to refresh requests
     * that are authentication endpoints
     * themselves.
     */
    if (
      originalRequest._skipAuthRefresh ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    /*
     * Each failed request may be
     * retried only once.
     *
     * If the retried request again
     * returns 401, the session is no
     * longer valid.
     */
    if (originalRequest._retry) {
      invalidateAdminSession();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * If several requests return 401
       * simultaneously, perform exactly
       * ONE refresh request.
       *
       * Every failed request waits on
       * this same Promise.
       */
      if (!refreshRequestPromise) {
        refreshRequestPromise = refreshAccessToken().finally(() => {
          refreshRequestPromise = null;
        });
      }

      const newAccessToken = await refreshRequestPromise;

      originalRequest.headers = originalRequest.headers ?? {};

      setHeader(
        originalRequest.headers,

        "Authorization",

        `Bearer ${newAccessToken}`,
      );

      /*
       * Retry the original request
       * using the freshly-issued
       * access token.
       */
      return api(originalRequest);
    } catch (refreshError) {
      /*
       * Refresh session is truly
       * unusable:
       *
       * - cookie missing
       * - cookie expired
       * - token blacklisted
       * - token invalid
       * - token_version changed
       *
       * Now logout is correct.
       */
      invalidateAdminSession();

      return Promise.reject(refreshError);
    }
  },
);

export default api;
