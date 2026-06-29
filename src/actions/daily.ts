"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function upsertDailyEntry(date: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const dayStart = new Date(date + "T00:00:00.000Z");
  const dayEnd = new Date(dayStart.getTime() + 86400000);

  try {
    if (!prisma.dailyEntry) return { error: "Daily entry model not available" };

    const existing = await prisma.dailyEntry.findFirst({
      where: { userId: session.user.id, date: { gte: dayStart, lt: dayEnd } },
      select: { id: true },
    });

    if (existing) {
      await prisma.dailyEntry.update({ where: { id: existing.id }, data: { content } });
    } else {
      await prisma.dailyEntry.create({ data: { userId: session.user.id, date: dayStart, content } });
    }

    revalidatePath("/log");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("daily entry save error:", e);
    return { error: "Failed to save entry" };
  }
}

export async function getDailyEntries(year: number, month: number) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  try {
    if (!prisma.dailyEntry) return [];
    const entries = await prisma.dailyEntry.findMany({
      where: { userId: session.user.id, date: { gte: start, lt: end } },
      orderBy: { date: "asc" },
      select: { date: true, content: true },
    });
    return entries;
  } catch (e) {
    console.error("daily entries fetch error:", e);
    return [];
  }
}
