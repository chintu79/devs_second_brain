"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createCapture } from "@/lib/capture-pipeline";
import { requireAuth } from "@/lib/action-utils";

export async function quickCapture(url: string, note?: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const result = await createCapture(userId, {
      source: "web",
      type: "reference",
      payload: { url, note },
    });

    revalidatePath("/knowledge");
    return { success: true, ...result };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to capture" };
  }
}

export async function getCaptureStatus(itemId: string): Promise<string | null> {
  const userId = await requireAuth();
  if (!userId) return null;
  try {
    const capture = await prisma.capture.findFirst({
      where: { knowledgeItemId: itemId, userId },
      select: { status: true },
    });
    return capture?.status ?? null;
  } catch {
    return null;
  }
}

export async function quickNote(content: string, title?: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    const result = await createCapture(userId, {
      source: "web",
      type: "note",
      payload: { content, title },
    });

    revalidatePath("/knowledge");
    return { success: true, ...result };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to capture" };
  }
}
