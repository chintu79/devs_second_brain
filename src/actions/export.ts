"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function exportVault() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const [resources, prompts, notes, projects, tags] = await Promise.all([
      prisma.resource.findMany({
        where: { userId: session.user.id },
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.prompt.findMany({
        where: { userId: session.user.id },
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.note.findMany({
        where: { userId: session.user.id },
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.findMany({
        where: { userId: session.user.id },
        include: { tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tag.findMany({
        where: { userId: session.user.id },
        orderBy: { name: "asc" },
      }),
    ]);

    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tags: tags.map((t) => ({ name: t.name })),
      resources: resources.map((r) => ({
        title: r.title,
        url: r.url,
        category: r.category,
        notes: r.notes,
        reason: r.reason,
        favorite: r.favorite,
        tags: r.tags.map((rt) => rt.tag.name),
        createdAt: r.createdAt.toISOString(),
      })),
      prompts: prompts.map((p) => ({
        title: p.title,
        prompt: p.prompt,
        category: p.category,
        useCase: p.useCase,
        favorite: p.favorite,
        tags: p.tags.map((pt) => pt.tag.name),
        createdAt: p.createdAt.toISOString(),
      })),
      notes: notes.map((n) => ({
        title: n.title,
        content: n.content,
        category: n.category,
        favorite: n.favorite,
        archived: n.archived,
        tags: n.tags.map((nt) => nt.tag.name),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        status: p.status,
        techStack: p.techStack,
        planMd: p.planMd,
        favorite: p.favorite,
        tags: p.tags.map((pt) => pt.tag.name),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    };

    return { data: JSON.stringify(data, null, 2) };
  } catch (e: any) {
    return { error: e.message || "Export failed" };
  }
}
