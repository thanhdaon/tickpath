import { ReactNode } from "react";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { Notification } from "~/components/layout/notification";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full">
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center border-b py-1.5 px-5 h-10">
              <SidebarTrigger />
              <Notification />
            </div>
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
