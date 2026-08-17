import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/store/features/adminSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});
