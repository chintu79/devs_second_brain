import { auth } from "@/lib/auth";
import { DashboardContent, DashboardSection } from "./dashboard-content";
import { DashboardGreeting } from "./dashboard-greeting";
import { DashboardQuickActions } from "./quick-actions";
import { DashboardPrimarySection, DashboardGraphSection } from "./dashboard-data";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const userId = session?.user?.id;

  return (
    <div data-accent="dashboard" className="h-full pr-4 overflow-y-auto">
      <DashboardContent>
        <DashboardSection>
          <DashboardGreeting userName={userName} />
        </DashboardSection>

        <DashboardSection>
          <DashboardQuickActions />
        </DashboardSection>

        <DashboardPrimarySection userId={userId} />

        <DashboardGraphSection userId={userId} />
      </DashboardContent>
    </div>
  );
}
