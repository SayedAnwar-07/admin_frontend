import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "under_review",
    label: "Under Review",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "dismissed",
    label: "Dismissed",
  },
];

export default function ReportStatusChanger({
  status,
  disabled = false,
  onStatusChange,
}) {
  const handleChange = (newStatus) => {
    if (disabled || !newStatus || newStatus === status) {
      return;
    }

    onStatusChange(newStatus);
  };

  return (
    <Select value={status} disabled={disabled} onValueChange={handleChange}>
      <SelectTrigger className="h-8 w-40">
        {disabled ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin" />

            <span className="text-xs">Updating...</span>
          </div>
        ) : (
          <SelectValue placeholder="Select status" />
        )}
      </SelectTrigger>

      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${getStatusDotClass(
                  option.value,
                )}`}
              />

              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const getStatusDotClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-500";

    case "under_review":
      return "bg-blue-500";

    case "resolved":
      return "bg-emerald-500";

    case "dismissed":
      return "bg-red-500";

    default:
      return "bg-gray-400";
  }
};
