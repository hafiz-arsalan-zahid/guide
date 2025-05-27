
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { APP_NAME, NAV_ITEMS } from "@/config/app";
import { cn } from "@/lib/utils";
import {
  Sidebar as UISidebar, // Alias to avoid name collision
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, 
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() { 
  const pathname = usePathname();
  const { open } = useSidebar(); 

  return (
    <UISidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary">
          <Image src="https://placehold.co/32x32.png" alt="App Logo" width={32} height={32} className="rounded-sm" data-ai-hint="logo abstract"/>
          <span className={cn("transition-opacity duration-300", open ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:opacity-100")}>
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent asChild>
        <ScrollArea className="flex-1">
          <SidebarMenu 
            className={cn(
              // Apply p-2 when collapsed 
              "group-data-[state=collapsed]/peer:p-2", 
              // Apply p-2 and lg:p-4 when expanded 
              "group-data-[state=expanded]/peer:p-2 group-data-[state=expanded]/peer:lg:p-4"
            )}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={{ children: item.label, side: "right", hidden: open }}
                      className={cn(
                        "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent",
                        isActive && "bg-sidebar-accent text-sidebar-primary font-semibold"
                        // Icon size is now handled by sidebarMenuButtonVariants in ui/sidebar.tsx
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" /> {/* Adjusted icon size if needed, but variant handles it */}
                      <span className={cn("truncate transition-opacity duration-300", open ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden")}>
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </UISidebar>
  );
}
