import CustomerPage from "@/features/cutomer/page/CustomerPage";
import SellerPage from "@/features/seller/page/SellerPage";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminReportsPage from "@/features/report/pages/AdminReportsPage";
import AdminReportsCountPage from "@/features/report/pages/AdminReportsCountPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "sellers", element: <SellerPage /> },
          { path: "customers", element: <CustomerPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "reports/count", element: <AdminReportsCountPage /> },
        ],
      },
    ],
  },
]);

export default function MainRoutes() {
  return <RouterProvider router={router} />;
}
