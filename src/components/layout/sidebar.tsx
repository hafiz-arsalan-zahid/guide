
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
  // SidebarTrigger, // SidebarTrigger is usually in the Header
  useSidebar, // Import useSidebar to get the open state
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() { // Renamed to AppSidebar
  const pathname = usePathname();
  const { open, state } = useSidebar(); // Get sidebar state (open for logic, state for CSS group selectors)

  return (
    <UISidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary">
          <Image src="https://placehold.co/32x32.png" alt="App Logo" width={32} height={32} className="rounded-sm" data-ai-hint="logo abstract" />
          <span className={cn("transition-opacity duration-300", open ? "opacity-100" : "opacity-0 max-w-0 overflow-hidden group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:opacity-100")}>
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent asChild>
        <ScrollArea className="flex-1">
          <SidebarMenu 
            className={cn(
              // Apply p-2 when collapsed (state is 'collapsed' via group/peer)
              "group-data-[state=collapsed]/peer:p-2", 
              // Apply p-2 and lg:p-4 when expanded (state is 'expanded' via group/peer)
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
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
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
      {/* SidebarFooter can be added here if needed */}
    </UISidebar>
  );
}
