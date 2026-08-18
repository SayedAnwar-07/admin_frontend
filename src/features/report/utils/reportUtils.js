export const REPORT_STATUS = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },

  under_review: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },

  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },

  dismissed: {
    label: "Dismissed",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export const getReportStatus = (status) => {
  return (
    REPORT_STATUS[status] || {
      label: status || "Unknown",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    }
  );
};

export const formatReportDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};
