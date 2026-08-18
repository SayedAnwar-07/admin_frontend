import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/store/constant/api";
import getApiErrorPayload from "@/store/constant/getApiErrorPayload";

// ============================================================================
// API URLs
// ============================================================================

const ADMIN_REPORTS_URL = "/reports/admin/";

// ============================================================================
// Helpers
// ============================================================================

const normalizeReportList = (data) => {
  // Backend without DRF pagination
  if (Array.isArray(data)) {
    return {
      reports: data,
      count: data.length,
      next: null,
      previous: null,
    };
  }

  // Backend with DRF pagination
  if (Array.isArray(data?.results)) {
    return {
      reports: data.results,
      count: data.count ?? data.results.length,
      next: data.next ?? null,
      previous: data.previous ?? null,
    };
  }

  return {
    reports: [],
    count: 0,
    next: null,
    previous: null,
  };
};

// ============================================================================
// Fetch all admin reports
// ============================================================================

export const fetchAdminReports = createAsyncThunk(
  "adminReport/fetchAdminReports",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_REPORTS_URL);

      return normalizeReportList(response.data);
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

// ============================================================================
// Fetch single admin report
// ============================================================================

export const fetchAdminReportDetail = createAsyncThunk(
  "adminReport/fetchAdminReportDetail",

  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reports/admin/${reportId}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

// ============================================================================
// Update report status
// ============================================================================

export const updateAdminReportStatus = createAsyncThunk(
  "adminReport/updateAdminReportStatus",

  async ({ reportId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reports/admin/${reportId}/status/`, {
        status,
      });

      /*
       * Your backend status serializer currently returns
       * only:
       *
       * {
       *   status: "resolved"
       * }
       *
       * So we return reportId ourselves so Redux knows
       * which report should be updated locally.
       */
      return {
        reportId,
        status: response.data?.status ?? status,
      };
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

// ============================================================================
// Delete report
// ============================================================================

export const deleteAdminReport = createAsyncThunk(
  "adminReport/deleteAdminReport",

  async (reportId, { rejectWithValue }) => {
    try {
      await api.delete(`/reports/admin/${reportId}/delete/`);

      return reportId;
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

// ============================================================================
// Initial state
// ============================================================================

const initialState = {
  // --------------------------------------------------------------------------
  // Report list
  // --------------------------------------------------------------------------

  reports: [],

  count: 0,

  next: null,

  previous: null,

  // --------------------------------------------------------------------------
  // Selected report
  // --------------------------------------------------------------------------

  selectedReport: null,

  // --------------------------------------------------------------------------
  // Loading states
  // --------------------------------------------------------------------------

  reportsLoading: false,

  reportDetailLoading: false,

  statusUpdating: false,

  deletingReport: false,

  // Track which report is currently being changed/deleted.
  statusUpdatingReportId: null,

  deletingReportId: null,

  // --------------------------------------------------------------------------
  // Errors
  // --------------------------------------------------------------------------

  reportsError: null,

  reportDetailError: null,

  statusUpdateError: null,

  deleteReportError: null,
};

// ============================================================================
// Slice
// ============================================================================

const adminReportSlice = createSlice({
  name: "adminReport",

  initialState,

  reducers: {
    // ------------------------------------------------------------------------
    // Clear selected report
    // ------------------------------------------------------------------------

    clearSelectedAdminReport: (state) => {
      state.selectedReport = null;

      state.reportDetailError = null;
    },

    // ------------------------------------------------------------------------
    // Clear list error
    // ------------------------------------------------------------------------

    clearAdminReportsError: (state) => {
      state.reportsError = null;
    },

    // ------------------------------------------------------------------------
    // Clear detail error
    // ------------------------------------------------------------------------

    clearAdminReportDetailError: (state) => {
      state.reportDetailError = null;
    },

    // ------------------------------------------------------------------------
    // Clear status update error
    // ------------------------------------------------------------------------

    clearAdminReportStatusError: (state) => {
      state.statusUpdateError = null;
    },

    // ------------------------------------------------------------------------
    // Clear delete error
    // ------------------------------------------------------------------------

    clearAdminReportDeleteError: (state) => {
      state.deleteReportError = null;
    },

    // ------------------------------------------------------------------------
    // Clear all report errors
    // ------------------------------------------------------------------------

    clearAdminReportErrors: (state) => {
      state.reportsError = null;

      state.reportDetailError = null;

      state.statusUpdateError = null;

      state.deleteReportError = null;
    },

    // ------------------------------------------------------------------------
    // Reset entire report state
    // ------------------------------------------------------------------------

    resetAdminReports: () => initialState,
  },

  // ==========================================================================
  // Async thunk states
  // ==========================================================================

  extraReducers: (builder) => {
    builder

      // ======================================================================
      // Fetch all reports
      // ======================================================================

      .addCase(fetchAdminReports.pending, (state) => {
        state.reportsLoading = true;

        state.reportsError = null;
      })

      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.reportsLoading = false;

        state.reports = action.payload.reports;

        state.count = action.payload.count;

        state.next = action.payload.next;

        state.previous = action.payload.previous;

        state.reportsError = null;
      })

      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.reportsLoading = false;

        state.reportsError = action.payload || {
          detail: "Unable to load reports.",
        };
      })

      // ======================================================================
      // Fetch report detail
      // ======================================================================

      .addCase(fetchAdminReportDetail.pending, (state) => {
        state.reportDetailLoading = true;

        state.reportDetailError = null;

        /*
         * Prevent old report information from
         * flashing while loading another report.
         */
        state.selectedReport = null;
      })

      .addCase(fetchAdminReportDetail.fulfilled, (state, action) => {
        state.reportDetailLoading = false;

        state.selectedReport = action.payload;

        state.reportDetailError = null;
      })

      .addCase(fetchAdminReportDetail.rejected, (state, action) => {
        state.reportDetailLoading = false;

        state.selectedReport = null;

        state.reportDetailError = action.payload || {
          detail: "Unable to load report details.",
        };
      })

      // ======================================================================
      // Update report status
      // ======================================================================

      .addCase(updateAdminReportStatus.pending, (state, action) => {
        state.statusUpdating = true;

        state.statusUpdatingReportId = action.meta.arg.reportId;

        state.statusUpdateError = null;
      })

      .addCase(updateAdminReportStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;

        state.statusUpdatingReportId = null;

        state.statusUpdateError = null;

        const { reportId, status } = action.payload;

        // ------------------------------------------------
        // Update report inside list
        // ------------------------------------------------

        const report = state.reports.find((item) => item.id === reportId);

        if (report) {
          report.status = status;
        }

        // ------------------------------------------------
        // Update currently selected report
        // ------------------------------------------------

        if (state.selectedReport?.id === reportId) {
          state.selectedReport.status = status;
        }
      })

      .addCase(updateAdminReportStatus.rejected, (state, action) => {
        state.statusUpdating = false;

        state.statusUpdatingReportId = null;

        state.statusUpdateError = action.payload || {
          detail: "Unable to update report status.",
        };
      })

      // ======================================================================
      // Delete report
      // ======================================================================

      .addCase(deleteAdminReport.pending, (state, action) => {
        state.deletingReport = true;

        state.deletingReportId = action.meta.arg;

        state.deleteReportError = null;
      })

      .addCase(deleteAdminReport.fulfilled, (state, action) => {
        state.deletingReport = false;

        state.deletingReportId = null;

        state.deleteReportError = null;

        const reportId = action.payload;

        // ------------------------------------------------
        // Remove from report list
        // ------------------------------------------------

        state.reports = state.reports.filter(
          (report) => report.id !== reportId,
        );

        // ------------------------------------------------
        // Keep count correct
        // ------------------------------------------------

        if (state.count > 0) {
          state.count -= 1;
        }

        // ------------------------------------------------
        // Clear selected report if deleted
        // ------------------------------------------------

        if (state.selectedReport?.id === reportId) {
          state.selectedReport = null;
        }
      })

      .addCase(deleteAdminReport.rejected, (state, action) => {
        state.deletingReport = false;

        state.deletingReportId = null;

        state.deleteReportError = action.payload || {
          detail: "Unable to delete report.",
        };
      });
  },
});

// ============================================================================
// Actions
// ============================================================================

export const {
  clearSelectedAdminReport,

  clearAdminReportsError,

  clearAdminReportDetailError,

  clearAdminReportStatusError,

  clearAdminReportDeleteError,

  clearAdminReportErrors,

  resetAdminReports,
} = adminReportSlice.actions;

// ============================================================================
// Reducer
// ============================================================================

export default adminReportSlice.reducer;
