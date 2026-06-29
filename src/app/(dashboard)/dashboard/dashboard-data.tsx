import prisma, { safeQuery } from "@/lib/prisma";
import { getAnalytics } from "@/actions/analytics";
import { DashboardMain } from "@/components/dashboard/dashboard-main";

const SEVEN_DAYS = new Date(Date.now() - 7 * 86400000);
const THIRTY_DAYS = new Date(Date.now() - 30 * 86400000);

export async function DashboardMainSection({
  userId, plan,
}: {
  userId: string | undefined; plan: string | null;
}) {
  if (!userId) return null;

  const [
    analytics, resources, prompts, notes, projects,
    staleProjectRows, staleNoteRows,
  ] = await Promise.all([
    safeQuery("analytics", () => getAnalytics(), null),
    safeQuery("dash.resources", () => prisma.resource.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, title: true, createdAt: true },
    }), []),
    safeQuery("dash.prompts", () => prisma.prompt.findMany({
      where: { userId }, orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, title: true, createdAt: true, lastUsedAt: true },
    }), []),
    safeQuery("dash.notes", () => prisma.note.findMany({
      where: { userId }, orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    }), []),
    safeQuery("dash.projects", () => prisma.project.findMany({
      where: { userId, status: { notIn: ["archived"] } }, orderBy: { updatedAt: "desc" }, take: 5,
      select: { id: true, title: true, status: true, createdAt: true, updatedAt: true },
    }), []),
    safeQuery("stale.projects", () => prisma.project.findMany({
      where: { userId, updatedAt: { lt: SEVEN_DAYS }, status: { notIn: ["archived", "done"] } },
      select: { id: true, title: true, updatedAt: true },
    }), []),
    safeQuery("stale.notes", () => prisma.note.findMany({
      where: { userId, updatedAt: { lt: THIRTY_DAYS } },
      select: { id: true, title: true, updatedAt: true },
    }), []),
  ]);

  const continueItems = [
    ...resources.map((r) => ({ id: r.id, title: r.title, type: "resource" as const, updatedAt: r.createdAt })),
    ...prompts.map((p) => ({ id: p.id, title: p.title, type: "prompt" as const, updatedAt: p.lastUsedAt ?? p.createdAt })),
    ...notes.map((n) => ({ id: n.id, title: n.title, type: "note" as const, updatedAt: n.updatedAt })),
    ...projects.map((p) => ({ id: p.id, title: p.title, type: "project" as const, updatedAt: p.updatedAt })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 3);

  const recentItems = [
    ...resources.map((r) => ({ id: r.id, title: r.title, type: "resource" as const, href: `/resources?id=${r.id}`, createdAt: r.createdAt })),
    ...prompts.map((p) => ({ id: p.id, title: p.title, type: "prompt" as const, href: `/prompts?id=${p.id}`, createdAt: p.createdAt })),
    ...notes.map((n) => ({ id: n.id, title: n.title, type: "note" as const, href: `/notes?id=${n.id}`, createdAt: n.createdAt })),
    ...projects.map((p) => ({ id: p.id, title: p.title, type: "project" as const, href: `/projects?id=${p.id}`, createdAt: p.createdAt })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  const hasAnalytics = analytics !== null && !("error" in analytics);
  const todayCounts = hasAnalytics
    ? { resources: analytics!.todayCounts.resources, prompts: analytics!.todayCounts.prompts, notes: analytics!.todayCounts.notes, projects: analytics!.todayCounts.projects }
    : { resources: 0, prompts: 0, notes: 0, projects: 0 };

  return (
    <DashboardMain
      continueItems={continueItems}
      todayCounts={todayCounts}
      staleProjects={staleProjectRows}
      staleNotes={staleNoteRows}
      recentItems={recentItems}
      plan={plan}
      analytics={hasAnalytics ? {
        totalResources: analytics!.totals.resources,
        totalNotes: analytics!.totals.notes,
        totalPrompts: analytics!.totals.prompts,
        totalProjects: analytics!.totals.projects,
        streak: analytics!.streak,
      } : null}
    />
  );
}
