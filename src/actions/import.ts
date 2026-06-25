"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ImportPayload {
  version?: number;
  tags?: { name: string }[];
  resources?: {
    title: string;
    url: string;
    category: string;
    notes?: string | null;
    reason?: string | null;
    favorite?: boolean;
    tags?: string[];
    createdAt?: string;
  }[];
  prompts?: {
    title: string;
    prompt: string;
    category: string;
    useCase: string;
    favorite?: boolean;
    tags?: string[];
    createdAt?: string;
  }[];
  notes?: {
    title: string;
    content: string;
    category: string;
    favorite?: boolean;
    archived?: boolean;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }[];
  projects?: {
    title: string;
    description: string;
    status: string;
    techStack?: string[];
    planMd?: string;
    favorite?: boolean;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  }[];
}

export async function importVault(json: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  let payload: ImportPayload;
  try {
    payload = JSON.parse(json);
  } catch {
    return { error: "Invalid JSON" };
  }

  if (!payload.version) return { error: "Unsupported format" };

  const userId = session.user.id;
  let imported = 0;

  try {
    await prisma.$transaction(async (tx) => {
      // Ensure tags exist
      if (payload.tags) {
        for (const t of payload.tags) {
          await tx.tag.upsert({
            where: { name_userId: { name: t.name, userId } },
            create: { name: t.name, userId },
            update: {},
          });
        }
      }

      // Import resources
      if (payload.resources) {
        for (const r of payload.resources) {
          const created = await tx.resource.create({
            data: {
              title: r.title,
              url: r.url,
              category: r.category,
              notes: r.notes || null,
              reason: r.reason || null,
              favorite: r.favorite || false,
              userId,
              createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
            },
          });
          if (r.tags) {
            for (const name of r.tags) {
              const tag = await tx.tag.upsert({
                where: { name_userId: { name, userId } },
                create: { name, userId },
                update: {},
              });
              await tx.resourceTag.create({
                data: { resourceId: created.id, tagId: tag.id },
              });
            }
          }
          imported++;
        }
      }

      // Import prompts
      if (payload.prompts) {
        for (const p of payload.prompts) {
          const created = await tx.prompt.create({
            data: {
              title: p.title,
              prompt: p.prompt,
              category: p.category,
              useCase: p.useCase,
              favorite: p.favorite || false,
              userId,
              createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            },
          });
          if (p.tags) {
            for (const name of p.tags) {
              const tag = await tx.tag.upsert({
                where: { name_userId: { name, userId } },
                create: { name, userId },
                update: {},
              });
              await tx.promptTag.create({
                data: { promptId: created.id, tagId: tag.id },
              });
            }
          }
          imported++;
        }
      }

      // Import notes
      if (payload.notes) {
        for (const n of payload.notes) {
          const created = await tx.note.create({
            data: {
              title: n.title,
              content: n.content,
              category: n.category,
              favorite: n.favorite || false,
              archived: n.archived || false,
              userId,
              createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
              updatedAt: n.updatedAt ? new Date(n.updatedAt) : new Date(),
            },
          });
          if (n.tags) {
            for (const name of n.tags) {
              const tag = await tx.tag.upsert({
                where: { name_userId: { name, userId } },
                create: { name, userId },
                update: {},
              });
              await tx.noteTag.create({
                data: { noteId: created.id, tagId: tag.id },
              });
            }
          }
          imported++;
        }
      }

      // Import projects
      if (payload.projects) {
        for (const p of payload.projects) {
          const created = await tx.project.create({
            data: {
              title: p.title,
              description: p.description,
              status: p.status,
              techStack: p.techStack || [],
              planMd: p.planMd || "",
              favorite: p.favorite || false,
              userId,
              createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
              updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            },
          });
          if (p.tags) {
            for (const name of p.tags) {
              const tag = await tx.tag.upsert({
                where: { name_userId: { name, userId } },
                create: { name, userId },
                update: {},
              });
              await tx.projectTag.create({
                data: { projectId: created.id, tagId: tag.id },
              });
            }
          }
          imported++;
        }
      }
    });

    revalidatePath("/resources");
    revalidatePath("/prompts");
    revalidatePath("/notes");
    revalidatePath("/projects");
    revalidatePath("/tags");
    return { success: true, count: imported };
  } catch (e: any) {
    return { error: e.message || "Import failed" };
  }
}
