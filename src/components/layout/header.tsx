"use client";

import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/config/app";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30"> {/* z-index adjusted */}
      {/* SidebarTrigger for mobile and to toggle desktop icon mode */}
      <SidebarTrigger className="md:hidden" /> 
      {/* 
        The SidebarTrigger below can be used for desktop if you want a persistent button 
        even when the sidebar is fully expanded. For icon-mode toggle, the ui/sidebar handles it.
        If you want an explicit button in the header for desktop, uncomment and style as needed.
      */}
      {/* <SidebarTrigger className="hidden md:flex" />  */}
      
      <div className="w-full flex-1">
        {/* Optional: Add a global search bar if needed in the future
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search features..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
        */}
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Image src="https://placehold.co/32x32.png" width={32} height={32} alt="User Avatar" className="rounded-full" data-ai-hint="avatar person" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ahmad's Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
