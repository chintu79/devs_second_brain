import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAnalytics } from "@/actions/analytics";
import { DashboardContent } from "./dashboard-content";
import { DashboardGreeting } from "./dashboard-greeting";
import { DashboardMainSection } from "./dashboard-data";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const userId = session?.user?.id;

  let plan: string | null = null;
  let streak = 0;
  if (userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [entry, analytics] = await Promise.all([
      prisma.dailyEntry.findFirst({
        where: { userId, date: { gte: today, lt: tomorrow } },
        select: { content: true },
      }),
      getAnalytics(),
    ]);
    plan = entry?.content ?? null;
    streak = analytics && !("error" in analytics) ? analytics.streak : 0;
  }

  return (
    <div data-accent="dashboard" className="h-full overflow-y-auto">
      <DashboardContent>
        <DashboardGreeting userName={userName} streak={streak} />
        <DashboardMainSection userId={userId} plan={plan} />
      </DashboardContent>
    </div>
  );
}
