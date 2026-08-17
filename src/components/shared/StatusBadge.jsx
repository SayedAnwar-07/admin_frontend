import clsx from "clsx";

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-md px-3 py-1 text-xs font-medium capitalize",
        status === "active" && "bg-green-100 text-green-700",
        status === "inactive" && "bg-red-100 text-red-700",
        status === "pending" && "bg-yellow-100 text-yellow-700",
      )}
    >
      {status}
    </span>
  );
}
