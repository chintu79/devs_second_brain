"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getAnalytics() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  const [resources, prompts, notes, projects, tags] = await Promise.all([
    prisma.resource.findMany({ where: { userId }, select: { createdAt: true, category: true } }),
    prisma.prompt.findMany({ where: { userId }, select: { createdAt: true, category: true } }),
    prisma.note.findMany({ where: { userId }, select: { createdAt: true, updatedAt: true, category: true } }),
    prisma.project.findMany({ where: { userId }, select: { createdAt: true, status: true } }),
    prisma.tag.findMany({ where: { userId }, include: { _count: { select: { resources: true, prompts: true, notes: true, projects: true } } } }),
  ]);

  // Total counts
  const totals = {
    resources: resources.length,
    prompts: prompts.length,
    notes: notes.length,
    projects: projects.length,
    total: resources.length + prompts.length + notes.length + projects.length,
  };

  // Activity by day (last 30 days)
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }

  const allItems = [
    ...resources.map((r) => r.createdAt),
    ...prompts.map((p) => p.createdAt),
    ...notes.flatMap((n) => [n.createdAt, n.updatedAt]),
    ...projects.map((p) => p.createdAt),
  ];

  for (const date of allItems) {
    const key = date.toISOString().slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, dayMap.get(key)! + 1);
  }

  const activity = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));

  // Streak: consecutive days with activity going backwards from today
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

  // Today and this week counts (inline calculation)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const todayCounts = {
    resources: resources.filter((r) => r.createdAt >= startOfDay).length,
    prompts: prompts.filter((p) => p.createdAt >= startOfDay).length,
    notes: notes.filter((n) => n.createdAt >= startOfDay).length,
    projects: projects.filter((p) => p.createdAt >= startOfDay).length,
  };

  const weekCounts = {
    resources: resources.filter((r) => r.createdAt >= startOfWeek).length,
    prompts: prompts.filter((p) => p.createdAt >= startOfWeek).length,
    notes: notes.filter((n) => n.createdAt >= startOfWeek).length,
    projects: projects.filter((p) => p.createdAt >= startOfWeek).length,
  };

  // Category distribution
  const catMap = new Map<string, number>();
  for (const r of resources) catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
  for (const p of prompts) catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
  for (const n of notes) catMap.set(n.category, (catMap.get(n.category) || 0) + 1);

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
    { name: "Resources", value: resources.length },
    { name: "Prompts", value: prompts.length },
    { name: "Notes", value: notes.length },
    { name: "Projects", value: projects.length },
  ].filter((t) => t.value > 0);

  // Project status breakdown
  const statusMap = new Map<string, number>();
  for (const p of projects) statusMap.set(p.status, (statusMap.get(p.status) || 0) + 1);
  const projectStatuses = Array.from(statusMap.entries()).map(([name, count]) => ({ name, count }));

  return {
    totals,
    activity,
    categories,
    tagUsage,
    byType,
    projectStatuses,
    streak,
    todayCounts,
    weekCounts,
  };
}
