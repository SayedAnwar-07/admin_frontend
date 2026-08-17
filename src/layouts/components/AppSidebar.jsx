import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarBrand from "./SidebarBrand";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-4">
        <SidebarBrand />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
