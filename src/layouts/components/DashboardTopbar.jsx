import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardTopbar() {
  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
      <SidebarTrigger className="shrink-0" />

      <div className="hidden md:flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-muted/40 px-3">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background transition hover:bg-accent">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
