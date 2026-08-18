import { useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  AlertTriangle,
  FileWarning,
  Loader2,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import GlobalErrorMessage from "@/components/shared/GlobalErrorMessage";

import {
  clearAdminReportsCountError,
  fetchAdminReportsCount,
} from "@/store/features/adminReportsCountSlice";

import AdminReportsCountTable from "../components/AdminReportsCountTable";

export default function AdminReportsCountPage() {
  const dispatch = useDispatch();

  const { services, count, loading, error } = useSelector(
    (state) => state.adminReportsCount,
  );

  useEffect(() => {
    dispatch(fetchAdminReportsCount());

    return () => {
      dispatch(clearAdminReportsCountError());
    };
  }, [dispatch]);

  const statistics = useMemo(() => {
    const totalReports = services.reduce(
      (total, service) => total + Number(service.report_count || 0),
      0,
    );

    const servicesWithReports = services.filter(
      (service) => Number(service.report_count || 0) > 0,
    ).length;

    const highReportServices = services.filter(
      (service) => Number(service.report_count || 0) >= 3,
    ).length;

    return {
      totalServices: count || services.length,

      totalReports,

      servicesWithReports,

      highReportServices,
    };
  }, [services, count]);

  const handleRefresh = () => {
    dispatch(clearAdminReportsCountError());

    dispatch(fetchAdminReportsCount());
  };

  if (loading && !services.length) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-7 animate-spin" />

          <p className="text-sm">Loading service reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-background px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-start gap-3">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 sm:flex">
            <ShieldAlert className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Service Report Overview
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor report counts for every service and identify services that
              require admin attention.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBox
          title="Total Services"
          value={statistics.totalServices}
          icon={<FileWarning className="size-5 text-muted-foreground" />}
        />

        <StatBox
          title="Total Reports"
          value={statistics.totalReports}
          icon={<ShieldAlert className="size-5 text-muted-foreground" />}
        />

        <StatBox
          title="Services Reported"
          value={statistics.servicesWithReports}
          icon={<AlertTriangle className="size-5 text-muted-foreground" />}
        />

        <StatBox
          title="3+ Reports"
          value={statistics.highReportServices}
          icon={<AlertTriangle className="size-5 text-muted-foreground" />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Service Report Counts</h2>

            <p className="text-sm text-muted-foreground">
              Report statistics grouped by individual event service.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleRefresh}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 size-4" />
            )}
            Refresh
          </Button>
        </div>

        {error && <GlobalErrorMessage error={error} />}

        <AdminReportsCountTable services={services} />
      </section>
    </div>
  );
}

function StatBox({ title, value, icon }) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
      </div>
    </div>
  );
}
