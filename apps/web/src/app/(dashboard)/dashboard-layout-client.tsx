"use client";

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardNavbar />
      <div className="flex flex-1 min-w-0 pt-[120px]">
        <div className="flex flex-1 flex-col min-w-0">
          <DashboardShell>
            <main className="flex-1 overflow-x-hidden">
              <div className="relative h-full p-5 lg:p-6 overflow-y-auto">
                {children}
              </div>
            </main>
          </DashboardShell>
        </div>
      </div>
    </div>
  );
}
