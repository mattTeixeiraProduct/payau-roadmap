"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PayLogo } from "@/components/ui/pay-logo";
import Link from "next/link";
import { GanttChartSquareIcon, LayoutList } from "lucide-react";
import { usePathname } from "next/navigation";

const AppSidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      href: "/",
      icon: GanttChartSquareIcon,
      label: "Roadmap",
      active: pathname === "/",
    },
    {
      href: "/backlog",
      icon: LayoutList,
      label: "Backlog",
      active: pathname === "/backlog",
    },
  ];

  const sidebarMenuItems = sidebarItems.map((item) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild isActive={item.active}>
        <Link href={item.href}>
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <PayLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{sidebarMenuItems}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
