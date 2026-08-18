export default function ReportStats({
  total = 0,
  pending = 0,
  underReview = 0,
  resolved = 0,
}) {
  const stats = [
    {
      label: "Total Reports",
      value: total,
      valueClassName: "text-foreground",
    },
    {
      label: "Pending Reports",
      value: pending,
      valueClassName: "text-amber-600",
    },
    {
      label: "Under Review",
      value: underReview,
      valueClassName: "text-blue-600",
    },
    {
      label: "Resolved Reports",
      value: resolved,
      valueClassName: "text-emerald-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border bg-background px-5 py-5 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>

          <p className={`mt-2 text-2xl font-semibold ${stat.valueClassName}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
