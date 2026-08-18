import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/store/constant/api";
import getApiErrorPayload from "@/store/constant/getApiErrorPayload";

const ADMIN_SERVICES_URL = "/admin/services/";

const normalizeServiceList = (data) => {
  if (Array.isArray(data)) {
    return {
      services: data,
      count: data.length,
      next: null,
      previous: null,
    };
  }

  if (Array.isArray(data?.results)) {
    return {
      services: data.results,
      count: data.count ?? data.results.length,
      next: data.next ?? null,
      previous: data.previous ?? null,
    };
  }

  return {
    services: [],
    count: 0,
    next: null,
    previous: null,
  };
};

export const fetchAdminReportsCount = createAsyncThunk(
  "adminReportsCount/fetchAdminReportsCount",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ADMIN_SERVICES_URL);

      return normalizeServiceList(response.data);
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

export const fetchAdminServiceReportDetail = createAsyncThunk(
  "adminReportsCount/fetchAdminServiceReportDetail",

  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/services/${serviceId}/`);

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorPayload(error));
    }
  },
);

const initialState = {
  services: [],

  count: 0,

  next: null,

  previous: null,

  selectedService: null,

  loading: false,

  detailLoading: false,

  error: null,

  detailError: null,
};

const adminReportsCountSlice = createSlice({
  name: "adminReportsCount",

  initialState,

  reducers: {
    clearAdminReportsCountError: (state) => {
      state.error = null;
    },

    clearAdminServiceReportDetail: (state) => {
      state.selectedService = null;
      state.detailError = null;
    },

    resetAdminReportsCount: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchAdminReportsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminReportsCount.fulfilled, (state, action) => {
        state.loading = false;

        state.services = action.payload.services;

        state.count = action.payload.count;

        state.next = action.payload.next;

        state.previous = action.payload.previous;

        state.error = null;
      })

      .addCase(fetchAdminReportsCount.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          detail: "Unable to load service report counts.",
        };
      })

      .addCase(fetchAdminServiceReportDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedService = null;
      })

      .addCase(fetchAdminServiceReportDetail.fulfilled, (state, action) => {
        state.detailLoading = false;

        state.selectedService = action.payload;

        state.detailError = null;
      })

      .addCase(fetchAdminServiceReportDetail.rejected, (state, action) => {
        state.detailLoading = false;

        state.selectedService = null;

        state.detailError = action.payload || {
          detail: "Unable to load service details.",
        };
      });
  },
});

export const {
  clearAdminReportsCountError,
  clearAdminServiceReportDetail,
  resetAdminReportsCount,
} = adminReportsCountSlice.actions;

export default adminReportsCountSlice.reducer;
