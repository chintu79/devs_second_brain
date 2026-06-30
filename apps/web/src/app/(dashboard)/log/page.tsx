import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getDailyEntries } from "@/actions/daily";
import { DailyLogClient } from "./daily-log-client";

export default async function LogPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const now = new Date();

  const initialEntries = await getDailyEntries(now.getFullYear(), now.getMonth() + 1);

  let todayActivity = { resources: [] as { id: string; title: string; createdAt: Date }[], prompts: [] as { id: string; title: string; createdAt: Date }[], notes: [] as { id: string; title: string; createdAt: Date }[], projects: [] as { id: string; title: string; createdAt: Date }[] };

  if (userId) {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [resources, prompts, notes, projects] = await Promise.all([
      prisma.resource.findMany({ where: { userId, createdAt: { gte: todayStart, lt: tomorrow } }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, createdAt: true } }),
      prisma.prompt.findMany({ where: { userId, createdAt: { gte: todayStart, lt: tomorrow } }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, createdAt: true } }),
      prisma.note.findMany({ where: { userId, createdAt: { gte: todayStart, lt: tomorrow } }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, createdAt: true } }),
      prisma.project.findMany({ where: { userId, createdAt: { gte: todayStart, lt: tomorrow } }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, title: true, createdAt: true } }),
    ]);
    todayActivity = { resources, prompts, notes, projects };
  }

  return (
    <div data-accent="notes" className="absolute inset-0 flex overflow-hidden">
      <DailyLogClient initialEntries={initialEntries} todayActivity={todayActivity} />
    </div>
  );
}
