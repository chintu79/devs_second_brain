import prisma from "@/lib/prisma";
import { buildTagCreate, parseTagNames } from "@/lib/tags";
import { suggestTags, suggestCategory } from "@/lib/ai";
import { authenticateUser } from "../auth";
import { corsResponse, corsHeaders } from "../cors";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const userId = await authenticateUser(request);
  if (!userId) return corsResponse({ error: "Unauthorized" }, 401, request);

  try {
    const body = await request.json();
    const { content, title } = body;
    if (!content) return corsResponse({ error: "Content is required" }, 400, request);

    const [aiTags, aiCategory] = await Promise.all([
      suggestTags(title || content, content).catch(() => []),
      suggestCategory(title || content, content, ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"]).catch(() => ""),
    ]);

    const note = await prisma.note.create({
      data: {
        content,
        title: title || null,
        category: aiCategory || "other",
        userId,
        tags: buildTagCreate(aiTags.slice(0, 5), userId),
      },
    });

    return corsResponse({ success: true, id: note.id, ai: { tags: aiTags, category: aiCategory } }, 200, request);
  } catch (e: unknown) {
    return corsResponse({ error: e instanceof Error ? e.message : "Failed to save note" }, 500, request);
  }
}
