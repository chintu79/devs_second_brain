import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardShell>
          <main className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              <div className="flex-1 min-w-0 p-5 lg:p-6 pb-20">
                {children}
              </div>
            </div>
          </main>
        </DashboardShell>
      </div>
    </div>
  );
}
