
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './sidebar';
import { Header } from './header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      {/* This div wraps the header and the main content area. 
          It's a flex item of SidebarProvider's root, and flex-1 makes it take remaining horizontal space.
          It's flex-col so Header and main stack vertically. */}
      <div className="flex flex-1 flex-col"> 
        <Header />
        {/* This main tag holds the actual page content. 
            It's flex-1 within its parent (the div above) to take available vertical space.
            overflow-y-auto allows content to scroll if it exceeds viewport height.
            Padding provides spacing around the page content. */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
