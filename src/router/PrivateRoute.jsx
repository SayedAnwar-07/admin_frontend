import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const location = useLocation();

  const { isAuthenticated, adminUser } = useSelector((state) => state.admin);

  let hasAccessToken = false;

  try {
    hasAccessToken = Boolean(localStorage.getItem("accessToken"));
  } catch {
    hasAccessToken = false;
  }

  const isAdmin = adminUser?.is_staff === true;

  const isLoggedIn = isAuthenticated && hasAccessToken && isAdmin;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
