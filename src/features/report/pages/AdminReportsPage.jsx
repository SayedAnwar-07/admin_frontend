import { useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FileWarning, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import GlobalErrorMessage from "@/components/shared/GlobalErrorMessage";

import {
  clearAdminReportsError,
  clearAdminReportStatusError,
  deleteAdminReport,
  fetchAdminReports,
  updateAdminReportStatus,
} from "@/store/features/adminReportSlice";

import AdminReportTable from "../components/AdminReportTable";
import ReportStats from "../components/ReportStats";

export default function AdminReportsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ==========================================================================
  // Redux
  // ==========================================================================

  const {
    reports,
    count,

    reportsLoading,
    reportsError,

    statusUpdatingReportId,
    statusUpdateError,

    deletingReportId,
    deleteReportError,
  } = useSelector((state) => state.adminReport);

  // ==========================================================================
  // Fetch reports
  // ==========================================================================

  useEffect(() => {
    dispatch(fetchAdminReports());

    return () => {
      dispatch(clearAdminReportsError());
      dispatch(clearAdminReportStatusError());
    };
  }, [dispatch]);

  // ==========================================================================
  // Statistics
  // ==========================================================================

  const statistics = useMemo(() => {
    const pending = reports.filter(
      (report) => report.status === "pending",
    ).length;

    const underReview = reports.filter(
      (report) => report.status === "under_review",
    ).length;

    const resolved = reports.filter(
      (report) => report.status === "resolved",
    ).length;

    return {
      total: count || reports.length,

      pending,

      underReview,

      resolved,
    };
  }, [reports, count]);

  // ==========================================================================
  // View report
  // ==========================================================================

  const handleViewReport = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  // ==========================================================================
  // Update status
  // ==========================================================================

  const handleStatusChange = async (reportId, status) => {
    dispatch(clearAdminReportStatusError());

    try {
      await dispatch(
        updateAdminReportStatus({
          reportId,
          status,
        }),
      ).unwrap();
    } catch {
      // Error is already handled by Redux.
    }
  };

  // ==========================================================================
  // Delete report
  // ==========================================================================

  const handleDeleteReport = async (report) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this report from ${
        report.reporter?.full_name || "this customer"
      }?`,
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteAdminReport(report.id));
  };

  // ==========================================================================
  // Refresh
  // ==========================================================================

  const handleRefresh = () => {
    dispatch(clearAdminReportsError());
    dispatch(clearAdminReportStatusError());

    dispatch(fetchAdminReports());
  };

  // ==========================================================================
  // Initial loading
  // ==========================================================================

  if (reportsLoading && !reports.length) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-7 animate-spin" />

          <p className="text-sm">Loading reports...</p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // Page
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* ================================================================== */}
      {/* Page header */}
      {/* ================================================================== */}

      <div className="rounded-xl border bg-background px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-start gap-3">
          <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 sm:flex">
            <FileWarning className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Report Management
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage all customer service reports from the admin
              panel.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Stats */}
      {/* ================================================================== */}

      <ReportStats
        total={statistics.total}
        pending={statistics.pending}
        underReview={statistics.underReview}
        resolved={statistics.resolved}
      />

      {/* ================================================================== */}
      {/* Report list */}
      {/* ================================================================== */}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Report List</h2>

            <p className="text-sm text-muted-foreground">
              Full report information for admin review and control.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={reportsLoading}
            onClick={handleRefresh}
          >
            {reportsLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Refresh
          </Button>
        </div>

        {/* ================================================================ */}
        {/* Errors */}
        {/* ================================================================ */}

        {reportsError && <GlobalErrorMessage error={reportsError} />}

        {statusUpdateError && <GlobalErrorMessage error={statusUpdateError} />}

        {deleteReportError && <GlobalErrorMessage error={deleteReportError} />}

        {/* ================================================================ */}
        {/* Table */}
        {/* ================================================================ */}

        <AdminReportTable
          reports={reports}
          statusUpdatingReportId={statusUpdatingReportId}
          deletingReportId={deletingReportId}
          onStatusChange={handleStatusChange}
          onView={handleViewReport}
          onDelete={handleDeleteReport}
        />
      </section>
    </div>
  );
}
