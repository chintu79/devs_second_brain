"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getBookmarkedRepoIds() {
  const session = await auth();
  if (!session?.user?.id) return new Set<string>();
  const bookmarks = await prisma.radarBookmark.findMany({
    where: { userId: session.user.id },
    select: { repoId: true },
  });
  return new Set(bookmarks.map((b) => b.repoId));
}

export async function toggleBookmark(repoId: string, repoData: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const existing = await prisma.radarBookmark.findUnique({
    where: { repoId_userId: { repoId, userId: session.user.id } },
  });
  if (existing) {
    await prisma.radarBookmark.delete({ where: { id: existing.id } });
    return false;
  }
  await prisma.radarBookmark.create({
    data: { repoId, userId: session.user.id, repoData },
  });
  return true;
}
