
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/config/app";
import { cn } from "@/lib/utils";
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

// New Code-Based SVG Logo
function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-8 text-sidebar-primary", className)} // Use sidebar-primary for logo color
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FocusFlow Logo"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V11H7V13H11V17H13V13H17V11H13V7Z"
      />
       {/* Simple abstract flow/focus representation */}
      <circle cx="12" cy="12" r="3" opacity="0.6" />
      <path d="M12 5V9M12 15V19M19 12H15M9 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}


export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <UISidebar collapsible="icon" className="border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3 font-semibold text-sidebar-primary-foreground">
          <AppLogo />
          <span className={cn("transition-opacity duration-200 ease-in-out", open ? "opacity-100 delay-150" : "opacity-0 max-w-0 overflow-hidden")}>
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent asChild className="mt-2">
        <ScrollArea className="flex-1">
          <SidebarMenu
            className={cn(
              "group-data-[state=collapsed]/peer:p-2",
              "group-data-[state=expanded]/peer:px-3 group-data-[state=expanded]/peer:py-2"
            )}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href} className="mb-1 last:mb-0">
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={{ children: item.label, side: "right", hidden: open, className: "bg-card text-card-foreground border-border" }}
                      className={cn(
                        "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent",
                        isActive && "bg-sidebar-accent text-sidebar-primary-foreground font-semibold shadow-sm",
                        "group-data-[state=collapsed]/peer:w-10 group-data-[state=collapsed]/peer:h-10 group-data-[state=collapsed]/peer:p-0 group-data-[state=collapsed]/peer:justify-center",
                        "group-data-[state=expanded]/peer:h-10" // Ensure expanded buttons maintain height
                      )}
                       size="default" // Explicitly set to ensure consistent padding internally
                    >
                      <item.icon className={cn(
                        "shrink-0",
                        "group-data-[state=collapsed]/peer:h-5 group-data-[state=collapsed]/peer:w-5",
                        "group-data-[state=expanded]/peer:h-5 group-data-[state=expanded]/peer:w-5"
                      )} />
                      <span className={cn(
                        "truncate transition-opacity duration-200 ease-in-out", 
                        open ? "opacity-100 delay-100" : "opacity-0 max-w-0 overflow-hidden"
                        )}>
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
