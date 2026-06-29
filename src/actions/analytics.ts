"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getAnalytics() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const yearAgo = new Date(now);
  yearAgo.setDate(yearAgo.getDate() - 365);

  const [totalResources, totalPrompts, totalNotes, totalProjects, todayResources, todayPrompts, todayNotes, todayProjects, weekResources, weekPrompts, weekNotes, weekProjects, resourceCategories, promptCategories, noteCategories, projectStatuses, tags, allResources, allPrompts, allNotes, allProjects, dailyEntries] = await Promise.all([
    prisma.resource.count({ where: { userId } }),
    prisma.prompt.count({ where: { userId } }),
    prisma.note.count({ where: { userId } }),
    prisma.project.count({ where: { userId } }),

    prisma.resource.count({ where: { userId, createdAt: { gte: startOfDay } } }),
    prisma.prompt.count({ where: { userId, createdAt: { gte: startOfDay } } }),
    prisma.note.count({ where: { userId, createdAt: { gte: startOfDay } } }),
    prisma.project.count({ where: { userId, createdAt: { gte: startOfDay } } }),

    prisma.resource.count({ where: { userId, createdAt: { gte: startOfWeek } } }),
    prisma.prompt.count({ where: { userId, createdAt: { gte: startOfWeek } } }),
    prisma.note.count({ where: { userId, createdAt: { gte: startOfWeek } } }),
    prisma.project.count({ where: { userId, createdAt: { gte: startOfWeek } } }),

    prisma.resource.groupBy({ by: ["category"], where: { userId }, _count: true }),
    prisma.prompt.groupBy({ by: ["category"], where: { userId }, _count: true }),
    prisma.note.groupBy({ by: ["category"], where: { userId }, _count: true }),
    prisma.project.groupBy({ by: ["status"], where: { userId }, _count: true }),

    prisma.tag.findMany({ where: { userId }, take: 50, include: { _count: { select: { resources: true, prompts: true, notes: true, projects: true } } } }),

    // All items from the last year for heatmap + streak
    prisma.resource.findMany({ where: { userId, createdAt: { gte: yearAgo } }, select: { createdAt: true } }),
    prisma.prompt.findMany({ where: { userId, createdAt: { gte: yearAgo } }, select: { createdAt: true } }),
    prisma.note.findMany({ where: { userId, createdAt: { gte: yearAgo } }, select: { createdAt: true, updatedAt: true } }),
    prisma.project.findMany({ where: { userId, createdAt: { gte: yearAgo } }, select: { createdAt: true } }),
    prisma.dailyEntry.findMany({ where: { userId, createdAt: { gte: yearAgo } }, select: { date: true } }),
  ]);

  // Group by day for all 365 days
  const dayMap = new Map<string, number>();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }

  for (const r of allResources) { const k = r.createdAt.toISOString().slice(0, 10); if (dayMap.has(k)) dayMap.set(k, dayMap.get(k)! + 1); }
  for (const r of allPrompts) { const k = r.createdAt.toISOString().slice(0, 10); if (dayMap.has(k)) dayMap.set(k, dayMap.get(k)! + 1); }
  for (const r of allNotes) { const k = r.createdAt.toISOString().slice(0, 10); if (dayMap.has(k)) dayMap.set(k, dayMap.get(k)! + 1); const uk = r.updatedAt.toISOString().slice(0, 10); if (dayMap.has(uk)) dayMap.set(uk, dayMap.get(uk)! + 1); }
  for (const r of allProjects) { const k = r.createdAt.toISOString().slice(0, 10); if (dayMap.has(k)) dayMap.set(k, dayMap.get(k)! + 1); }
  for (const r of dailyEntries) { const k = r.date.toISOString().slice(0, 10); if (dayMap.has(k)) dayMap.set(k, dayMap.get(k)! + 1); }

  const activity = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));

  // Streak
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if ((dayMap.get(key) || 0) > 0) streak++;
    else if (i > 0) break;
  }

  const catMap = new Map<string, number>();
  for (const c of resourceCategories) catMap.set(c.category, c._count);
  for (const c of promptCategories) catMap.set(c.category, (catMap.get(c.category) || 0) + c._count);
  for (const c of noteCategories) catMap.set(c.category, (catMap.get(c.category) || 0) + c._count);
  const categories = Array.from(catMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  const tagUsage = tags.map((t) => ({ name: t.name, count: t._count.resources + t._count.prompts + t._count.notes + t._count.projects })).sort((a, b) => b.count - a.count).slice(0, 20);

  const byType = [
    { name: "Resources", value: totalResources },
    { name: "Prompts", value: totalPrompts },
    { name: "Notes", value: totalNotes },
    { name: "Projects", value: totalProjects },
  ].filter((t) => t.value > 0);

  return {
      totals: { resources: totalResources, prompts: totalPrompts, notes: totalNotes, projects: totalProjects, total: totalResources + totalPrompts + totalNotes + totalProjects },
      activity,
      categories,
      tagUsage,
      byType,
      projectStatuses: projectStatuses.map((p) => ({ name: p.status, count: p._count })),
      streak,
      todayCounts: { resources: todayResources, prompts: todayPrompts, notes: todayNotes, projects: todayProjects },
      weekCounts: { resources: weekResources, prompts: weekPrompts, notes: weekNotes, projects: weekProjects },
    };
  } catch {
    return {
      totals: { resources: 0, prompts: 0, notes: 0, projects: 0, total: 0 },
      activity: [], categories: [], tagUsage: [], byType: [], projectStatuses: [],
      streak: 0,
      todayCounts: { resources: 0, prompts: 0, notes: 0, projects: 0 },
      weekCounts: { resources: 0, prompts: 0, notes: 0, projects: 0 },
    };
  }
}
