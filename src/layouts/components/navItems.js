import {
  LayoutDashboard,
  Store,
  Users,
  FileWarning,
  TriangleAlert,
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
    label: "Reported Services",
    to: "/reports/count",
    icon: TriangleAlert,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];
