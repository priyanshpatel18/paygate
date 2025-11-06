"use client";

import {
  BarChart3,
  Code2,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { bricolageGrotesque } from "@/fonts";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My APIs",
    url: "/apis",
    icon: Code2,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
] as const;

// Main Sidebar Component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center gap-3 px-2 py-4">
              <span className={`text-3xl font-semibold ${bricolageGrotesque.className}`}>Paygate</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <NavMain items={NAV_ITEMS} />
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-3 py-4">
        <div className="flex items-center gap-3 px-2 py-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Navigation Menu Component
function NavMain({
  items,
}: {
  items: readonly {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/" && pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="h-11"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}