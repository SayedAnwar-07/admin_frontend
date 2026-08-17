import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const location = useLocation();

  const { isAuthenticated, adminUser } = useSelector((state) => state.admin);

  const hasToken = Boolean(localStorage.getItem("accessToken"));
  const isLoggedIn = isAuthenticated || (hasToken && adminUser);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
