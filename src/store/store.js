import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "@/store/features/adminSlice";
import adminReportReducer from "@/store/features/adminReportSlice";
import adminReportsCountReducer from "@/store/features/adminReportsCountSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    adminReport: adminReportReducer,
    adminReportsCount: adminReportsCountReducer,
  },
});
