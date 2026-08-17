export default function PageHeader({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground md:text-base">
        {subtitle}
      </p>
    </div>
  );
}
