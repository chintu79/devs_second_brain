import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free";

function scoreRelevance(query: string, item: {
  type: string; title: string; tags: string[]; description?: string; content?: string; url?: string;
}): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let score = 0;
  const haystack = [item.title, ...item.tags, item.description || "", item.content || "", item.url || ""]
    .join(" ").toLowerCase();

  for (const word of words) {
    if (haystack.includes(word)) score += 1;
  }
  if (item.title.toLowerCase().includes(q)) score += 3;
  if (item.tags.some((t) => q.includes(t.toLowerCase()) || t.toLowerCase().includes(q))) score += 2;
  return score;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message, history = [] } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response("Message required", { status: 400 });
  }

  const userId = session.user.id;

  const [resources, prompts, notes, projects] = await Promise.all([
    prisma.resource.findMany({ where: { userId }, ...includeTags }),
    prisma.prompt.findMany({ where: { userId }, ...includeTags }),
    prisma.note.findMany({ where: { userId }, ...includeTags }),
    prisma.project.findMany({ where: { userId }, ...includeTags }),
  ]);

  const flatResources = flattenListTags(resources).map((r: any) => ({
    type: "resource" as const, id: r.id, title: r.title, tags: r.tags,
    description: r.category, content: r.notes, url: r.url,
  }));
  const flatPrompts = flattenListTags(prompts).map((p: any) => ({
    type: "prompt" as const, id: p.id, title: p.title, tags: p.tags,
    description: p.category, content: p.prompt,
  }));
  const flatNotes = flattenListTags(notes).map((n: any) => ({
    type: "note" as const, id: n.id, title: n.title, tags: n.tags,
    description: n.category, content: n.content,
  }));
  const flatProjects = flattenListTags(projects).map((p: any) => ({
    type: "project" as const, id: p.id, title: p.title, tags: p.tags,
    description: p.description, content: p.planMd,
  }));

  const allItems = [...flatResources, ...flatPrompts, ...flatNotes, ...flatProjects];
  const scored = allItems
    .map((item) => ({ item, score: scoreRelevance(message, item as any) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const context = scored.length > 0
    ? scored.map((s, i) => {
        const item = s.item;
        const snippet = (item.content || item.description || "").slice(0, 300);
        const urlStr = item.type === "resource" && item.url ? `\nURL: ${item.url}` : "";
        return `[${i + 1}] ${item.type.toUpperCase()}: ${item.title}\nTags: ${item.tags.join(", ") || "none"}\n${snippet ? `Content: ${snippet}${urlStr}` : ""}`;
      }).join("\n\n")
    : "No relevant items found in the vault.";

  const systemPrompt = `You are a Dev Second Brain assistant. You have access to the user's knowledge vault containing resources, prompts, notes, and projects. Answer the user's question using the provided context. If you use information from a specific item, cite it with [1], [2], etc. Be concise, technical, and helpful.`;

  const userPrompt = `Context from the user's vault:\n\n${context}\n\nUser question: ${message}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10),
          { role: "user", content: userPrompt },
        ],
        stream: true,
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(`OpenRouter error: ${text}`, { status: 502 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = res.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed?.choices?.[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {}
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    return new Response(`AI error: ${err.message}`, { status: 500 });
  }
}
