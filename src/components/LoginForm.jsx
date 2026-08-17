import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { adminLogin, clearAdminError } from "@/store/features/adminSlice";

import GlobalErrorMessage from "@/components/shared/GlobalErrorMessage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loginLoading, error, isAuthenticated, adminUser } = useSelector(
    (state) => state.admin,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  // ── Clear errors when leaving page ────────────────────────────────────────

  useEffect(() => {
    return () => {
      dispatch(clearAdminError());
    };
  }, [dispatch]);

  // ── Redirect existing admin session ───────────────────────────────────────

  useEffect(() => {
    const isAdmin =
      isAuthenticated && Boolean(adminUser) && adminUser?.is_staff === true;

    if (isAdmin) {
      navigate(redirectTo, {
        replace: true,
      });
    }
  }, [isAuthenticated, adminUser, navigate, redirectTo]);

  // ── Input ─────────────────────────────────────────────────────────────────

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (localError) {
      setLocalError("");
    }

    if (error) {
      dispatch(clearAdminError());
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLocalError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      setLocalError("Email address is required.");
      return;
    }

    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    const resultAction = await dispatch(
      adminLogin({
        email,
        password,
      }),
    );

    if (adminLogin.fulfilled.match(resultAction)) {
      navigate(redirectTo, {
        replace: true,
      });
    }
  };

  // ── Error ─────────────────────────────────────────────────────────────────

  const displayError = localError || error;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      {/* HEADER */}
      <div className="border-b border-border px-6 py-6">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" />

          <span className="text-sm font-medium">Protected Access</span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Sign in to dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your admin email and password to continue.
        </p>
      </div>

      {/* FORM */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              disabled={loginLoading}
              className="h-11"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loginLoading}
                className="h-11 pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                disabled={loginLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          <GlobalErrorMessage error={displayError} className="rounded-lg" />

          {/* LOGIN */}
          <Button type="submit" className="h-11 w-full" disabled={loginLoading}>
            {loginLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
