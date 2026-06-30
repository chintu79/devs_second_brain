"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ItemType = "resource" | "note" | "prompt" | "project";

export interface LinkItem {
  id: string;
  type: ItemType;
  title: string;
}

export interface ReferenceGroup {
  type: ItemType;
  items: LinkItem[];
}

export async function batchCreateReferences(
  fromType: ItemType,
  fromId: string,
  links: { type: ItemType; id: string }[]
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const uid = session.user.id;

  try {
    const existing = await prisma.reference.findMany({
      where: { fromType, fromId, userId: uid },
      select: { toType: true, toId: true },
    });
    const existingKeys = new Set(existing.map((r) => `${r.toType}:${r.toId}`));

    const toCreate = links
      .filter((l) => !(l.type === fromType && l.id === fromId))
      .filter((l) => !existingKeys.has(`${l.type}:${l.id}`))
      .map((l) => ({
        fromType,
        fromId,
        toType: l.type,
        toId: l.id,
        userId: uid,
      }));

    if (toCreate.length > 0) {
      await prisma.reference.createMany({ data: toCreate });
    }

    revalidatePath(`/${fromType}s/${fromId}`);
    return { success: true };
  } catch {
    return { error: "Failed to create references" };
  }
}

export async function getReferences(itemType: ItemType, itemId: string): Promise<ReferenceGroup[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const [outgoing, incoming] = await Promise.all([
    prisma.reference.findMany({
      where: { fromType: itemType, fromId: itemId, userId: session.user.id },
    }),
    prisma.reference.findMany({
      where: { toType: itemType, toId: itemId, userId: session.user.id },
    }),
  ]);

  const refs: { type: ItemType; id: string }[] = [];

  for (const r of outgoing) {
    refs.push({ type: r.toType as ItemType, id: r.toId });
  }
  for (const r of incoming) {
    refs.push({ type: r.fromType as ItemType, id: r.fromId });
  }

  const grouped: Record<string, LinkItem[]> = {};
  const unique = new Set<string>();

  for (const ref of refs) {
    const key = `${ref.type}:${ref.id}`;
    if (unique.has(key)) continue;
    unique.add(key);
    if (!grouped[ref.type]) grouped[ref.type] = [];
    grouped[ref.type].push({ id: ref.id, type: ref.type, title: "" });
  }

  const types = Object.keys(grouped) as ItemType[];
  await Promise.all(
    types.map(async (t) => {
      const ids = grouped[t].map((i) => i.id);
      const items = await fetchItemsByType(t, ids);
      const map = new Map(items.map((i: { id: string; title: string }) => [i.id, i.title]));
      grouped[t] = grouped[t].map((i) => ({ ...i, title: map.get(i.id) || "Unknown" }));
    })
  );

  return (Object.entries(grouped) as [ItemType, LinkItem[]][]).map(([type, items]) => ({
    type,
    items,
  }));
}

async function fetchItemsByType(type: ItemType, ids: string[]): Promise<{ id: string; title: string }[]> {
  switch (type) {
    case "resource":
      return prisma.resource.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    case "note":
      return prisma.note.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    case "prompt":
      return prisma.prompt.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    case "project":
      return prisma.project.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
  }
}

export async function searchLinkItems(query: string): Promise<LinkItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  if (!query.trim()) return [];

  const q = query.trim();

  const [resources, notes, prompts, projects] = await Promise.all([
    prisma.resource.findMany({ where: { userId: session.user.id, title: { contains: q, mode: "insensitive" } }, select: { id: true, title: true }, take: 5 }),
    prisma.note.findMany({ where: { userId: session.user.id, title: { contains: q, mode: "insensitive" } }, select: { id: true, title: true }, take: 5 }),
    prisma.prompt.findMany({ where: { userId: session.user.id, title: { contains: q, mode: "insensitive" } }, select: { id: true, title: true }, take: 5 }),
    prisma.project.findMany({ where: { userId: session.user.id, title: { contains: q, mode: "insensitive" } }, select: { id: true, title: true }, take: 5 }),
  ]);

  return [
    ...resources.map((r) => ({ ...r, type: "resource" as ItemType })),
    ...notes.map((n) => ({ ...n, type: "note" as ItemType })),
    ...prompts.map((p) => ({ ...p, type: "prompt" as ItemType })),
    ...projects.map((p) => ({ ...p, type: "project" as ItemType })),
  ];
}
