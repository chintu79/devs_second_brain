import { NextResponse } from "next/server";
import { suggestCategory, suggestTags, summarizeContent, suggestTechnologies, suggestDifficulty, suggestKeywords } from "@/lib/ai";
import { authenticateUser } from "../auth";

export async function POST(request: Request) {
  const userId = await authenticateUser(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, type } = body;
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const categories = type === "note"
      ? ["personal", "technical", "learning", "meeting", "idea", "other"]
      : type === "prompt"
        ? ["coding", "debugging", "architecture", "testing", "docs", "other"]
        : ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"];

    const [category, tags, summary, technologies, difficulty, keywords] = await Promise.all([
      suggestCategory(title || "", content, categories).catch(() => ""),
      suggestTags(title || "", content).catch(() => [] as string[]),
      summarizeContent(content).catch(() => ""),
      suggestTechnologies(content).catch(() => [] as string[]),
      suggestDifficulty(content).catch(() => ""),
      suggestKeywords(content).catch(() => [] as string[]),
    ]);

    return NextResponse.json({ category, tags, summary, technologies, difficulty, keywords });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI enrichment failed" },
      { status: 500 }
    );
  }
}
