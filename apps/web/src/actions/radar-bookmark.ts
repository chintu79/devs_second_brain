"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTagNames, buildTagCreate } from "@/lib/tags";
import type { Repository } from "@/lib/mock-data";

export async function getBookmarkedRepoIds() {
  const session = await auth();
  if (!session?.user?.id) return new Set<string>();
  const bookmarks = await prisma.radarBookmark.findMany({
    where: { userId: session.user.id },
    select: { repoId: true },
  });
  return new Set(bookmarks.map((b) => b.repoId));
}

export async function getBookmarkedRepos(): Promise<Repository[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const bookmarks = await prisma.radarBookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { repoData: true },
  });
  const repos: Repository[] = [];
  for (const b of bookmarks) {
    try {
      const parsed = JSON.parse(b.repoData);
      repos.push({ ...parsed, bookmarked: true, saved: false });
    } catch { /* skip corrupt entries */ }
  }
  return repos;
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

export async function getSavedRepoIds() {
  const session = await auth();
  if (!session?.user?.id) return new Set<string>();
  const resources = await prisma.resource.findMany({
    where: { userId: session.user.id, url: { not: null as unknown as string } },
    select: { url: true },
  });
  return new Set(resources.map((r) => r.url));
}

export async function saveRepoToResources(repo: Repository) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const existing = await prisma.resource.findFirst({
    where: { userId: session.user.id, url: repo.url },
  });
  if (existing) return { error: "Already saved as resource" };

  const tagNames = [...new Set([...(repo.topics || []), repo.language].filter(Boolean))];

  try {
    await prisma.resource.create({
      data: {
        title: `${repo.owner}/${repo.name}`,
        url: repo.url,
        category: repo.category || "Other",
        notes: repo.description,
        reason: `Imported from OS Radar — ${repo.growthIndicator} · ${repo.stars} stars`,
        userId: session.user.id,
        tags: buildTagCreate(tagNames, session.user.id),
      },
    });
    revalidatePath("/resources");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save" };
  }
}
