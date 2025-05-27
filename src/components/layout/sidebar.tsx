"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_ITEMS } from "@/config/app";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();

  const renderNavItems = () => (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary hover:bg-sidebar-accent",
              isActive && "bg-sidebar-accent text-sidebar-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary">
              <Image src="https://placehold.co/32x32.png" alt="App Logo" width={32} height={32} className="rounded-sm" data-ai-hint="logo abstract" />
              <span>{APP_NAME}</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            {renderNavItems()}
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar Trigger (placed in Header) - This is a conceptual placement. Actual trigger is in Header.tsx */}
    </>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const renderNavItems = () => (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col bg-background">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <Image src="https://placehold.co/32x32.png" alt="App Logo" width={32} height={32} className="rounded-sm" data-ai-hint="logo abstract" />
            <span>{APP_NAME}</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 mt-5">
         {renderNavItems()}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
