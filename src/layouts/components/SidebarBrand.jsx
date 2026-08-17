export default function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
        <div className="grid grid-cols-2 gap-0.5">
          <span className="h-1.5 w-1.5 rounded-sm bg-primary" />
          <span className="h-1.5 w-1.5 rounded-sm bg-primary" />
          <span className="h-1.5 w-1.5 rounded-sm bg-primary" />
          <span className="h-1.5 w-1.5 rounded-sm bg-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">Eventra BD</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
    </div>
  );
}
