export default function SidebarUser() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
        ST
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Saeed Tamim</p>
        <p className="truncate text-xs text-muted-foreground">Administrator</p>
      </div>
    </div>
  );
}
