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
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const yearAgo = new Date(now);
  yearAgo.setDate(yearAgo.getDate() - 365);

  const [totalResources, totalPrompts, totalNotes, totalProjects, todayResources, todayPrompts, todayNotes, todayProjects, weekResources, weekPrompts, weekNotes, weekProjects, resourceCategories, promptCategories, noteCategories, projectStatuses, tags, recentActivity, recentUpdates] = await Promise.all([
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

    // Only last 30 days of createdAt for activity chart
    prisma.resource.findMany({ where: { userId, createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true } }),
    prisma.note.findMany({ where: { userId, updatedAt: { gte: thirtyDaysAgo } }, select: { createdAt: true, updatedAt: true } }),
  ]);

  // Activity by day (last 30 days)
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }

  for (const r of recentActivity) {
    const key = r.createdAt.toISOString().slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, dayMap.get(key)! + 1);
  }
  for (const r of recentUpdates) {
    const key = r.createdAt.toISOString().slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, dayMap.get(key)! + 1);
    const updKey = r.updatedAt.toISOString().slice(0, 10);
    if (dayMap.has(updKey)) dayMap.set(updKey, dayMap.get(updKey)! + 1);
  }

  const activity = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));

  // Streak: check last 365 days of activity. 
  // We traverse backwards from today. Need to check if there were ANY items created/updated
  // on each day. Since we only fetched 30 days, the streak will be incomplete if >30.
  // For longer streaks, fetch the year's data more efficiently.
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if ((dayMap.get(key) || 0) > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  // If streak is 30+, we hit the boundary of our 30-day window
  // Fetch older data to check if streak continues
  if (streak >= 30) {
    const oldestDate = new Date(now);
    oldestDate.setDate(oldestDate.getDate() - 31);
    const olderResources = await prisma.resource.findMany({ where: { userId, createdAt: { lt: oldestDate, gte: yearAgo } }, take: 500, select: { createdAt: true }, orderBy: { createdAt: "desc" } });
    const olderPrompts = await prisma.prompt.findMany({ where: { userId, createdAt: { lt: oldestDate, gte: yearAgo } }, take: 500, select: { createdAt: true }, orderBy: { createdAt: "desc" } });
    const olderNotes = await prisma.note.findMany({ where: { userId, updatedAt: { lt: oldestDate, gte: yearAgo } }, take: 500, select: { createdAt: true, updatedAt: true }, orderBy: { updatedAt: "desc" } });
    const olderProjects = await prisma.project.findMany({ where: { userId, createdAt: { lt: oldestDate, gte: yearAgo } }, take: 500, select: { createdAt: true }, orderBy: { createdAt: "desc" } });

    const olderDates = new Set<string>();
    for (const r of olderResources) olderDates.add(r.createdAt.toISOString().slice(0, 10));
    for (const p of olderPrompts) olderDates.add(p.createdAt.toISOString().slice(0, 10));
    for (const n of olderNotes) {
      olderDates.add(n.createdAt.toISOString().slice(0, 10));
      olderDates.add(n.updatedAt.toISOString().slice(0, 10));
    }
    for (const p of olderProjects) olderDates.add(p.createdAt.toISOString().slice(0, 10));

    for (let i = 31; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (olderDates.has(key)) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Category distribution (from groupBy)
  const catMap = new Map<string, number>();
  for (const c of resourceCategories) catMap.set(c.category, c._count);
  for (const c of promptCategories) catMap.set(c.category, (catMap.get(c.category) || 0) + c._count);
  for (const c of noteCategories) catMap.set(c.category, (catMap.get(c.category) || 0) + c._count);

  const categories = Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Tag usage
  const tagUsage = tags
    .map((t) => ({
      name: t.name,
      count: t._count.resources + t._count.prompts + t._count.notes + t._count.projects,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Vault type distribution
  const byType = [
    { name: "Resources", value: totalResources },
    { name: "Prompts", value: totalPrompts },
    { name: "Notes", value: totalNotes },
    { name: "Projects", value: totalProjects },
  ].filter((t) => t.value > 0);

  // Project status breakdown
  const projectStatusesList = projectStatuses.map((p) => ({ name: p.status, count: p._count }));

  return {
      totals: { resources: totalResources, prompts: totalPrompts, notes: totalNotes, projects: totalProjects, total: totalResources + totalPrompts + totalNotes + totalProjects },
      activity,
      categories,
      tagUsage,
      byType,
      projectStatuses: projectStatusesList,
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
