import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated, adminUser } = useSelector((state) => state.admin);

  const isAdminLoggedIn =
    isAuthenticated && Boolean(adminUser) && adminUser?.is_staff === true;

  if (isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden flex-col justify-between border-r border-border bg-muted/30 p-10 lg:flex">
          <div>
            <div className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
              Admin Dashboard
            </div>

            <div className="mt-10 max-w-xl">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
                Secure access for your management panel
              </h1>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Sign in with your admin account to manage sellers, customers,
                settings, and dashboard operations.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <p className="text-sm font-medium text-foreground">
              Secure admin access
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your session uses secure token authentication with an HttpOnly
              refresh cookie.
            </p>
          </div>
        </div>

        {/* LOGIN */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-semibold tracking-tight">
                Admin Login
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Only authorized administrators can access the dashboard.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
