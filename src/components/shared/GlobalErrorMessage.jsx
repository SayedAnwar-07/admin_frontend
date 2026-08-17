import { getApiErrorMessage } from "@/store/constant/getApiErrorMessage";

const getDisplayMessage = (error) => {
  if (!error) {
    return null;
  }

  if (typeof error === "string") {
    return error;
  }

  // Axios error
  if (error?.response) {
    return getApiErrorMessage(error);
  }

  // Backend/Redux error payload
  if (typeof error?.detail === "string") {
    return error.detail;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  if (Array.isArray(error?.non_field_errors) && error.non_field_errors.length) {
    return error.non_field_errors.join(" ");
  }

  if (typeof error === "object") {
    for (const value of Object.values(error)) {
      if (Array.isArray(value) && value.length) {
        return value.join(" ");
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  return "Something went wrong. Please try again.";
};

export default function GlobalErrorMessage({ error, className = "" }) {
  if (!error) {
    return null;
  }

  const message = getDisplayMessage(error);

  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 ${className}`}
    >
      {message}
    </div>
  );
}
