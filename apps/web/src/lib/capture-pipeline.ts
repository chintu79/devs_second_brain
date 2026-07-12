import prisma from "@/lib/prisma";
import { defaultAIService, type AIService } from "@/lib/ai-service";

const CATEGORIES = ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"];

export interface CaptureInput {
  source: string;
  type: string;
  payload: {
    url?: string;
    title?: string;
    description?: string;
    selectedText?: string;
    content?: string;
    note?: string;
  };
  collectionIds?: string[];
}

export interface CaptureResult {
  captureId: string;
  knowledgeItemId: string;
  status: string;
  duplicate?: boolean;
}

export async function createCapture(userId: string, input: CaptureInput, ai: AIService = defaultAIService): Promise<CaptureResult> {
  const { source, type, payload } = input;

  if (type === "reference" && !payload.url) {
    throw new Error("URL is required for reference captures");
  }

  if (payload.url) {
    const existing = await prisma.knowledgeItem.findFirst({
      where: { userId, url: payload.url, status: "active" },
      select: { id: true },
    });
    if (existing) {
      return { captureId: existing.id, knowledgeItemId: existing.id, status: "ready", duplicate: true };
    }
  }

  const domain = payload.url
    ? new URL(payload.url).hostname.replace("www.", "")
    : null;

  const title = payload.title || payload.url || "Untitled";
  const contentForAI = [payload.title, payload.selectedText, payload.description].filter(Boolean).join("\n\n");

  let knowledgeType = "link";
  let knowledgeContent: string | null = null;
  if (type === "note") { knowledgeType = "note"; knowledgeContent = payload.content || null; }
  if (type === "document") { knowledgeType = "document"; knowledgeContent = payload.content || null; }

  const item = await prisma.knowledgeItem.create({
    data: {
      type: knowledgeType,
      title,
      url: payload.url || null,
      content: knowledgeContent,
      notes: payload.note || null,
      domain,
      userId,
    },
  });

  await prisma.capture.create({
    data: {
      source,
      type,
      status: "processing",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: payload as any,
      knowledgeItemId: item.id,
      userId,
    },
  });

  if (input.collectionIds?.length) {
    const valid = await prisma.collection.findMany({
      where: { id: { in: input.collectionIds }, userId },
      select: { id: true },
    });
    if (valid.length > 0) {
      await prisma.knowledgeCollection.createMany({
        data: valid.map((c) => ({ itemId: item.id, collectionId: c.id })),
      });
    }
  }

  enrichCapture(item.id, title, contentForAI, userId, payload.note);

  return {
    captureId: item.id,
    knowledgeItemId: item.id,
    status: "processing",
  };
}

export async function enrichCapture(
  itemId: string, title: string, content: string, userId: string, userNote: string | undefined,
  ai: AIService = defaultAIService
) {
  try {
    const [aiTags, category, summary] = await Promise.all([
      ai.suggestTags(title, content).catch(() => [] as string[]),
      ai.suggestCategory(title, content, CATEGORIES).catch(() => ""),
      ai.summarizeContent(content).catch(() => ""),
    ]);

    const finalTags = aiTags.slice(0, 5).filter(Boolean);
    const tagConnects = await Promise.all(
      finalTags.map(async (name) => {
        const tag = await prisma.tag.upsert({
          where: { name_userId: { name, userId } },
          create: { name, userId },
          update: {},
        });
        return { tagId: tag.id };
      })
    );

    const notesParts = [summary, userNote].filter(Boolean);
    const notes = notesParts.length > 0 ? notesParts.join("\n\n") : null;

    await prisma.knowledgeItem.update({
      where: { id: itemId },
      data: {
        summary: summary || null,
        notes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { category: category || "other", aiGenerated: true } as any,
        tags: tagConnects.length > 0 ? { create: tagConnects } : undefined,
      },
    });

    await prisma.capture.update({
      where: { knowledgeItemId: itemId },
      data: {
        status: "ready",
        steps: JSON.stringify([
          { name: "ai-summary", status: "done", endedAt: new Date().toISOString() },
          { name: "auto-labels", status: "done", endedAt: new Date().toISOString() },
        ]),
      },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "AI enrichment failed";
    await prisma.capture.update({
      where: { knowledgeItemId: itemId },
      data: { status: "failed", error: errorMessage },
    }).catch(() => {});
  }
}
