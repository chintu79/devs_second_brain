import prisma from "@/lib/prisma";
import { buildTagCreate, parseTagNames } from "@/lib/tags";
import { suggestCategory, suggestTags, summarizeContent, suggestTechnologies, suggestDifficulty, suggestKeywords } from "@/lib/ai";
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
    const { url, title, description, reason, selectedText, siteType } = body;
    if (!url || !title) return corsResponse({ error: "URL and title are required" }, 400, request);

    const content = [title, description, selectedText].filter(Boolean).join("\n\n");
    const categories = ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"];

    const [aiCategory, aiTags, summary, technologies, difficulty, keywords] = await Promise.all([
      suggestCategory(title, content, categories).catch(() => ""),
      suggestTags(title, content).catch(() => [] as string[]),
      summarizeContent(content).catch(() => ""),
      suggestTechnologies(content).catch(() => [] as string[]),
      suggestDifficulty(content).catch(() => ""),
      suggestKeywords(content).catch(() => [] as string[]),
    ]);

    const category = body.category || aiCategory || "other";
    const tagNames = body.tags?.length ? parseTagNames(body.tags) : [...aiTags, ...technologies.map(t => t.toLowerCase().replace(/[^a-z0-9-#]/g, ""))].slice(0, 8);
    const notesContent = [summary, body.notes].filter(Boolean).join("\n\n");

    const resource = await prisma.resource.create({
      data: {
        title, url, category,
        notes: notesContent || null,
        reason: reason || null,
        userId,
        tags: buildTagCreate(tagNames, userId),
      },
    });

    return corsResponse({
      success: true, id: resource.id,
      ai: { summary, tags: aiTags, category: aiCategory, technologies, difficulty, keywords },
    }, 200, request);
  } catch (e: unknown) {
    return corsResponse(
      { error: e instanceof Error ? e.message : "Failed to save resource" },
      500, request
    );
  }
}
