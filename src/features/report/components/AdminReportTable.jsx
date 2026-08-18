import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ReportStatusChanger from "./ReportStatusChanger";
import ReportMessageDialog from "./ReportMessageDialog";
import ReportImageDialog from "./ReportImageDialog";

// ============================================================================
// Helpers
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// ============================================================================
// Admin report table
// ============================================================================

export default function AdminReportTable({
  reports = [],

  statusUpdatingReportId = null,

  deletingReportId = null,

  onStatusChange,

  onDelete,
}) {
  // ==========================================================================
  // Empty state
  // ==========================================================================

  if (!reports.length) {
    return (
      <div className="rounded-xl border bg-background px-6 py-14 text-center shadow-sm">
        <p className="font-medium">No reports found.</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Customer service reports will appear here.
        </p>
      </div>
    );
  }

  // ==========================================================================
  // Table
  // ==========================================================================

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          {/* ============================================================= */}
          {/* Header */}
          {/* ============================================================= */}

          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>

              <TableHead>Service</TableHead>

              <TableHead>Seller</TableHead>

              <TableHead className="min-w-55">Report</TableHead>

              <TableHead>Submitted</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* ============================================================= */}
          {/* Body */}
          {/* ============================================================= */}

          <TableBody>
            {reports.map((report) => {
              const isStatusUpdating = statusUpdatingReportId === report.id;

              const isDeleting = deletingReportId === report.id;

              const seller = report.service?.seller;

              return (
                <TableRow key={report.id}>
                  {/* ===================================================== */}
                  {/* Reporter */}
                  {/* ===================================================== */}

                  <TableCell>
                    <div className="min-w-35">
                      <p className="font-medium">
                        {report.reporter?.full_name || "Unknown customer"}
                      </p>

                      <p className="mt-0.5 max-w-45 truncate text-xs text-muted-foreground">
                        {report.reporter?.email || "—"}
                      </p>
                    </div>
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Service */}
                  {/* ===================================================== */}

                  <TableCell>
                    <div className="min-w-37.5">
                      <p className="font-medium">
                        {report.service?.service_display_name ||
                          report.service?.service_name ||
                          "—"}
                      </p>

                      <p className="mt-0.5 max-w-45 truncate text-xs text-muted-foreground">
                        {report.service?.brand_display_name ||
                          report.service?.brand_name ||
                          "—"}
                      </p>
                    </div>
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Seller */}
                  {/* ===================================================== */}

                  <TableCell>
                    <div className="min-w-37.5">
                      <p className="font-medium">{seller?.full_name || "—"}</p>

                      <p className="mt-0.5 max-w-45 truncate text-xs text-muted-foreground">
                        {seller?.email ||
                          seller?.contact_number ||
                          seller?.whatsapp_number ||
                          "—"}
                      </p>
                    </div>
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Message */}
                  {/* ===================================================== */}

                  <TableCell>
                    <p
                      className="max-w-70 text-sm leading-5 text-muted-foreground"
                      title={report.message || undefined}
                    >
                      <TableCell>
                        <ReportMessageDialog message={report.message} />
                      </TableCell>
                    </p>
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Created */}
                  {/* ===================================================== */}

                  <TableCell>
                    <div className="min-w-36 text-sm text-muted-foreground">
                      {formatDate(report.created_at)}
                    </div>
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Status */}
                  {/* ===================================================== */}

                  <TableCell>
                    <ReportStatusChanger
                      status={report.status}
                      disabled={isStatusUpdating}
                      onStatusChange={(status) =>
                        onStatusChange?.(report.id, status)
                      }
                    />
                  </TableCell>

                  {/* ===================================================== */}
                  {/* Actions */}
                  {/* ===================================================== */}

                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* Image preview */}

                      <ReportImageDialog
                        imageUrl={report.image_url}
                        disabled={isDeleting}
                      />

                      {/* Delete */}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        title="Delete report"
                        disabled={isDeleting || isStatusUpdating}
                        onClick={() => onDelete?.(report)}
                      >
                        {isDeleting ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}

                        <span className="sr-only">Delete report</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
