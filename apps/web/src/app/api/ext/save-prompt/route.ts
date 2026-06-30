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
    const { prompt, title } = body;
    if (!prompt) return corsResponse({ error: "Prompt is required" }, 400, request);

    const [aiTags, aiCategory] = await Promise.all([
      suggestTags(title || prompt, prompt).catch(() => []),
      suggestCategory(title || prompt, prompt, ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"]).catch(() => ""),
    ]);

    const promptRecord = await prisma.prompt.create({
      data: {
        prompt,
        title: title || prompt.slice(0, 100),
        useCase: "general",
        category: aiCategory || "other",
        userId,
        tags: buildTagCreate(aiTags.slice(0, 5), userId),
      },
    });

    return corsResponse({ success: true, id: promptRecord.id, ai: { tags: aiTags, category: aiCategory } }, 200, request);
  } catch (e: unknown) {
    return corsResponse({ error: e instanceof Error ? e.message : "Failed to save prompt" }, 500, request);
  }
}
