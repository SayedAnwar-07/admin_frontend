export default function StatCard({ title, value, valueClassName = "" }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</h3>
    </div>
  );
}
