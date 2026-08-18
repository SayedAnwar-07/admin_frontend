import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/store/constant/api";
import getApiErrorMessage from "@/store/constant/getApiErrorMessage";
import getApiErrorPayload from "@/store/constant/getApiErrorPayload";

// ── API URLs ──────────────────────────────────────────────────────────────────

const ADMIN_API = "/users/amar-admin";
const USERS_API = "/users";

// ── Storage helpers ───────────────────────────────────────────────────────────

const getStoredAccessToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const getStoredAdminUser = () => {
  try {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
      return null;
    }

    const user = JSON.parse(rawUser);

    // AdminLoginSerializer authorizes using is_staff.
    // role === "admin" is kept only as a compatibility fallback.
    const isAdmin = user?.is_staff === true;

    return isAdmin ? user : null;
  } catch {
    return null;
  }
};

const saveAdminSession = (accessToken, user) => {
  try {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Never store refresh JWT in browser storage.
    // Refresh token is stored in the HttpOnly cookie.
    localStorage.removeItem("refreshToken");
  } catch {
    // Ignore browser storage errors.
  }
};

const clearAdminAuthStorage = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch {
    // Ignore browser storage errors.
  }
};

// Remove refresh token left by the old implementation.
try {
  localStorage.removeItem("refreshToken");
} catch {
  // Ignore browser storage errors.
}

// ── Error helpers ─────────────────────────────────────────────────────────────

const createAdminError = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  return {
    message: getApiErrorMessage(error, fallback),
    payload: getApiErrorPayload(error),
  };
};

const getRejectedMessage = (action, fallback) => {
  return action.payload?.message || fallback;
};

const getRejectedPayload = (action) => {
  return action.payload?.payload || null;
};

// ── Response helpers ──────────────────────────────────────────────────────────

const normalizeUserList = (data) => {
  if (Array.isArray(data)) {
    return {
      results: data,
      count: data.length,
      next: null,
      previous: null,
    };
  }

  if (Array.isArray(data?.results)) {
    return {
      results: data.results,
      count: data.count ?? data.results.length,
      next: data.next ?? null,
      previous: data.previous ?? null,
    };
  }

  return {
    results: [],
    count: 0,
    next: null,
    previous: null,
  };
};

// ── Admin Login ────────────────────────────────────────────────────────────────

export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${ADMIN_API}/login/`, loginData);

      const { access, user } = response.data ?? {};

      if (!access) {
        return rejectWithValue({
          message: "Admin login did not return an access token.",
          payload: {
            detail: "Admin login did not return an access token.",
          },
        });
      }

      if (!user) {
        return rejectWithValue({
          message: "Admin login did not return user information.",
          payload: {
            detail: "Admin login did not return user information.",
          },
        });
      }

      /*
       * Backend AdminLoginSerializer uses is_staff as the
       * authoritative admin permission.
       *
       * role === "admin" is only a compatibility fallback.
       */
      const isAdmin = user.is_staff === true || user.role === "admin";

      if (!isAdmin) {
        clearAdminAuthStorage();

        return rejectWithValue({
          message: "This account does not have admin access.",
          payload: {
            detail: "This account does not have admin access.",
          },
        });
      }

      saveAdminSession(access, user);

      return {
        ...response.data,
        access,
        user,
      };
    } catch (error) {
      return rejectWithValue(
        createAdminError(error, "Unable to log in to the admin account."),
      );
    }
  },
);

// ── Fetch Sellers ──────────────────────────────────────────────────────────────

export const fetchAllSellers = createAsyncThunk(
  "admin/fetchAllSellers",
  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.get(`${ADMIN_API}/sellers/`, {
        params,
        signal,
      });

      return normalizeUserList(response.data);
    } catch (error) {
      return rejectWithValue(
        createAdminError(error, "Unable to load sellers."),
      );
    }
  },
);

// ── Fetch Customers ────────────────────────────────────────────────────────────

export const fetchAllCustomers = createAsyncThunk(
  "admin/fetchAllCustomers",
  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.get(`${ADMIN_API}/customers/`, {
        params,
        signal,
      });

      return normalizeUserList(response.data);
    } catch (error) {
      return rejectWithValue(
        createAdminError(error, "Unable to load customers."),
      );
    }
  },
);

// ── Delete User ────────────────────────────────────────────────────────────────

export const deleteUserByAdmin = createAsyncThunk(
  "admin/deleteUserByAdmin",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue({
        message: "User ID is required.",
        payload: {
          detail: "User ID is required.",
        },
      });
    }

    try {
      const response = await api.delete(
        `${ADMIN_API}/${encodeURIComponent(userId)}/delete/`,
      );

      return {
        userId,
        message: response.data?.message || "User deleted successfully.",
      };
    } catch (error) {
      return rejectWithValue(
        createAdminError(error, "Unable to delete this user."),
      );
    }
  },
);

// ── Admin Logout - Current Device ──────────────────────────────────────────────

export const adminLogout = createAsyncThunk("admin/adminLogout", async () => {
  try {
    /*
     * No refresh token is sent in JSON.
     *
     * Backend reads refresh token from the HttpOnly cookie.
     * withCredentials=true in api.js sends the cookie.
     */
    await api.post(`${USERS_API}/logout/`, {});
  } catch {
    /*
     * Logout locally even when server/network request fails.
     */
  } finally {
    clearAdminAuthStorage();
  }

  return true;
});

// ── Admin Logout - All Devices ─────────────────────────────────────────────────

export const adminLogoutAll = createAsyncThunk(
  "admin/adminLogoutAll",
  async () => {
    try {
      /*
       * This endpoint requires authentication.
       *
       * If the access token has expired, api.js will:
       *
       * 1. use HttpOnly refresh cookie
       * 2. get a new access token
       * 3. retry this request automatically
       */
      await api.post(`${USERS_API}/logout/all/`, {});
    } catch {
      /*
       * Always remove frontend session.
       */
    } finally {
      clearAdminAuthStorage();
    }

    return true;
  },
);

// ── Initial State ──────────────────────────────────────────────────────────────

const initialAccessToken = getStoredAccessToken();
const initialAdminUser = getStoredAdminUser();

const initialState = {
  adminUser: initialAdminUser,
  accessToken: initialAccessToken,

  isAuthenticated: Boolean(initialAccessToken && initialAdminUser),

  // Seller data
  sellers: [],
  sellersCount: 0,
  sellersNext: null,
  sellersPrevious: null,

  // Customer data
  customers: [],
  customersCount: 0,
  customersNext: null,
  customersPrevious: null,

  // General loading
  loading: false,

  // Individual request loading
  loginLoading: false,
  sellersLoading: false,
  customersLoading: false,
  deleteLoading: false,

  // Useful when multiple users are displayed.
  deletingUserId: null,

  successMessage: null,

  // String kept for compatibility with existing admin UI.
  error: null,

  // Structured DRF error data.
  errorPayload: null,
};

// ── Shared reducers helpers ────────────────────────────────────────────────────

const resetAdminSessionState = (state) => {
  state.adminUser = null;
  state.accessToken = null;
  state.isAuthenticated = false;

  state.sellers = [];
  state.sellersCount = 0;
  state.sellersNext = null;
  state.sellersPrevious = null;

  state.customers = [];
  state.customersCount = 0;
  state.customersNext = null;
  state.customersPrevious = null;

  state.loading = false;
  state.loginLoading = false;
  state.sellersLoading = false;
  state.customersLoading = false;
  state.deleteLoading = false;
  state.deletingUserId = null;

  state.error = null;
  state.errorPayload = null;
};

// ── Slice ──────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.errorPayload = null;
    },

    clearAdminSuccessMessage: (state) => {
      state.successMessage = null;
    },

    clearAdminState: (state) => {
      state.loading = false;
      state.loginLoading = false;
      state.sellersLoading = false;
      state.customersLoading = false;
      state.deleteLoading = false;
      state.deletingUserId = null;

      state.error = null;
      state.errorPayload = null;
      state.successMessage = null;
    },

    forceAdminLogout: (state) => {
      clearAdminAuthStorage();

      resetAdminSessionState(state);

      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ────────────────────────────────────────────────────────────────────────
      // Admin Login
      // ────────────────────────────────────────────────────────────────────────

      .addCase(adminLogin.pending, (state) => {
        state.loginLoading = true;

        state.error = null;
        state.errorPayload = null;
        state.successMessage = null;
      })

      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loginLoading = false;

        state.adminUser = action.payload.user;
        state.accessToken = action.payload.access;

        state.isAuthenticated = true;

        state.error = null;
        state.errorPayload = null;

        state.successMessage = "Admin login successful.";
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.loginLoading = false;

        state.adminUser = null;
        state.accessToken = null;
        state.isAuthenticated = false;

        state.error = getRejectedMessage(action, "Admin login failed.");

        state.errorPayload = getRejectedPayload(action);

        state.successMessage = null;

        clearAdminAuthStorage();
      })

      // ────────────────────────────────────────────────────────────────────────
      // Fetch Sellers
      // ────────────────────────────────────────────────────────────────────────

      .addCase(fetchAllSellers.pending, (state) => {
        state.sellersLoading = true;

        state.error = null;
        state.errorPayload = null;
      })

      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.sellersLoading = false;

        state.sellers = action.payload.results;
        state.sellersCount = action.payload.count;
        state.sellersNext = action.payload.next;
        state.sellersPrevious = action.payload.previous;

        state.error = null;
        state.errorPayload = null;
      })

      .addCase(fetchAllSellers.rejected, (state, action) => {
        state.sellersLoading = false;

        state.error = getRejectedMessage(action, "Failed to fetch sellers.");

        state.errorPayload = getRejectedPayload(action);
      })

      // ────────────────────────────────────────────────────────────────────────
      // Fetch Customers
      // ────────────────────────────────────────────────────────────────────────

      .addCase(fetchAllCustomers.pending, (state) => {
        state.customersLoading = true;

        state.error = null;
        state.errorPayload = null;
      })

      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;

        state.customers = action.payload.results;
        state.customersCount = action.payload.count;
        state.customersNext = action.payload.next;
        state.customersPrevious = action.payload.previous;

        state.error = null;
        state.errorPayload = null;
      })

      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.customersLoading = false;

        state.error = getRejectedMessage(action, "Failed to fetch customers.");

        state.errorPayload = getRejectedPayload(action);
      })

      // ────────────────────────────────────────────────────────────────────────
      // Delete User
      // ────────────────────────────────────────────────────────────────────────

      .addCase(deleteUserByAdmin.pending, (state, action) => {
        state.deleteLoading = true;
        state.deletingUserId = action.meta.arg;

        state.error = null;
        state.errorPayload = null;
        state.successMessage = null;
      })

      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deletingUserId = null;

        const deletedId = String(action.payload.userId);

        const sellerExisted = state.sellers.some(
          (user) => String(user.id) === deletedId,
        );

        const customerExisted = state.customers.some(
          (user) => String(user.id) === deletedId,
        );

        state.sellers = state.sellers.filter(
          (user) => String(user.id) !== deletedId,
        );

        state.customers = state.customers.filter(
          (user) => String(user.id) !== deletedId,
        );

        if (sellerExisted) {
          state.sellersCount = Math.max(0, state.sellersCount - 1);
        }

        if (customerExisted) {
          state.customersCount = Math.max(0, state.customersCount - 1);
        }

        state.successMessage = action.payload.message;

        state.error = null;
        state.errorPayload = null;
      })

      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deletingUserId = null;

        state.error = getRejectedMessage(action, "Failed to delete user.");

        state.errorPayload = getRejectedPayload(action);
      })

      // ────────────────────────────────────────────────────────────────────────
      // Logout Current Device
      // ────────────────────────────────────────────────────────────────────────

      .addCase(adminLogout.pending, (state) => {
        state.loading = true;

        state.error = null;
        state.errorPayload = null;
        state.successMessage = null;
      })

      .addCase(adminLogout.fulfilled, (state) => {
        resetAdminSessionState(state);

        state.successMessage = "Logged out successfully.";
      })

      // ────────────────────────────────────────────────────────────────────────
      // Logout All Devices
      // ────────────────────────────────────────────────────────────────────────

      .addCase(adminLogoutAll.pending, (state) => {
        state.loading = true;

        state.error = null;
        state.errorPayload = null;
        state.successMessage = null;
      })

      .addCase(adminLogoutAll.fulfilled, (state) => {
        resetAdminSessionState(state);

        state.successMessage = "Logged out from all devices.";
      });
  },
});

// ── Actions ───────────────────────────────────────────────────────────────────

export const {
  clearAdminError,
  clearAdminSuccessMessage,
  clearAdminState,
  forceAdminLogout,
} = adminSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectAdmin = (state) => state.admin;

export const selectAdminUser = (state) => state.admin.adminUser;

export const selectAdminAuthenticated = (state) => state.admin.isAuthenticated;

export const selectAdminSellers = (state) => state.admin.sellers;

export const selectAdminCustomers = (state) => state.admin.customers;

export const selectAdminError = (state) => state.admin.error;

export const selectAdminErrorPayload = (state) => state.admin.errorPayload;

export const selectAdminLoginLoading = (state) => state.admin.loginLoading;

export const selectAdminSellersLoading = (state) => state.admin.sellersLoading;

export const selectAdminCustomersLoading = (state) =>
  state.admin.customersLoading;

export const selectAdminDeleteLoading = (state) => state.admin.deleteLoading;

export const selectAdminDeletingUserId = (state) => state.admin.deletingUserId;

export default adminSlice.reducer;
