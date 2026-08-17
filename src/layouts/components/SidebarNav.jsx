import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "./navItems";

export default function SidebarNav() {
  const location = useLocation();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;

        return (
          <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link to={item.to} className="flex items-center gap-3">
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
