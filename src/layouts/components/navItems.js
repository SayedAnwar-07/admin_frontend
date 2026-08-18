import {
  LayoutDashboard,
  Store,
  Users,
  FileWarning,
  Settings,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    to: "",
    icon: LayoutDashboard,
  },
  {
    label: "Sellers",
    to: "/sellers",
    icon: Store,
  },
  {
    label: "Customers",
    to: "/customers",
    icon: Users,
  },
  {
    label: "Reports",
    to: "/reports",
    icon: FileWarning,
  },
  {
    label: "Report Count",
    to: "/reports/count",
    icon: FileWarning,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];
