import { LayoutDashboard, Store, Users, Settings } from "lucide-react";

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
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];
