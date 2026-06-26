import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardShell>
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="h-full p-5 lg:p-6 pb-20 overflow-y-auto">
              {children}
            </div>
          </main>
        </DashboardShell>
      </div>
    </div>
  );
}
