import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const getReportCountStyle = (count) => {
  const reportCount = Number(count || 0);

  if (reportCount >= 10) {
    return {
      className: "border-red-200 bg-red-50 text-red-700",
      label: "Critical Review",
    };
  }

  if (reportCount >= 5) {
    return {
      className: "border-orange-200 bg-orange-50 text-orange-700",
      label: "High Risk",
    };
  }

  if (reportCount >= 3) {
    return {
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
      label: "Needs Attention",
    };
  }

  if (reportCount >= 1) {
    return {
      className: "border-blue-200 bg-blue-50 text-blue-700",
      label: "Under Review",
    };
  }

  return {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    label: "No Issues",
  };
};

export default function AdminReportsCountTable({ services = [], onView }) {
  if (!services.length) {
    return (
      <div className="rounded-xl border bg-background px-6 py-14 text-center shadow-sm">
        <p className="font-medium">No services found.</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Service report statistics will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>

              <TableHead>Seller</TableHead>

              <TableHead>Rating</TableHead>

              <TableHead>Reports</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Created</TableHead>

              {onView && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service) => {
              const reportCount = Number(service.report_count || 0);

              const reportState = getReportCountStyle(reportCount);

              return (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="min-w-37.5">
                      <p className="font-medium">
                        {service.brand_display_name ||
                          service.brand_name ||
                          "—"}
                      </p>

                      <p className="mt-0.5 max-w-45 truncate text-xs text-muted-foreground">
                        Service :{" "}
                        {service.service_display_name ||
                          service.service_name ||
                          "—"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-40">
                      <p className="font-medium">
                        {service.seller_name || "—"}
                      </p>

                      <p className="mt-0.5 max-w-50 truncate text-xs text-muted-foreground">
                        {service.seller_email || "—"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-medium">
                      {service.rating ?? "0.00"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-base font-semibold">
                      {reportCount}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${reportState.className}`}
                    >
                      {reportCount > 0 ? (
                        <AlertTriangle className="size-3" />
                      ) : (
                        <CheckCircle2 className="size-3" />
                      )}

                      {reportState.label}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="min-w-36 text-sm text-muted-foreground">
                      {formatDate(service.created_at)}
                    </div>
                  </TableCell>

                  {onView && (
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          title="View service"
                          onClick={() => onView(service.id)}
                        >
                          <Eye className="size-4" />

                          <span className="sr-only">View service</span>
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
