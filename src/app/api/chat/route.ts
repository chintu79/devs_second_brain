import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getApiKey } from "@/lib/ai";

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free";

type VaultCacheValue = {
  resources: unknown[];
  prompts: unknown[];
  notes: unknown[];
  projects: unknown[];
};

// In-memory cache for vault data (30s TTL)
const vaultCache = new Map<string, { data: VaultCacheValue; expiry: number }>();
const CACHE_TTL = 30_000;

async function getVaultData(userId: string) {
  const cached = vaultCache.get(userId);
  if (cached && Date.now() < cached.expiry) return cached.data;

  const [resources, prompts, notes, projects] = await Promise.all([
    prisma.resource.findMany({ where: { userId }, take: 500, include: { tags: { include: { tag: { select: { name: true } } } } } }),
    prisma.prompt.findMany({ where: { userId }, take: 500, include: { tags: { include: { tag: { select: { name: true } } } } } }),
    prisma.note.findMany({ where: { userId }, take: 500, include: { tags: { include: { tag: { select: { name: true } } } } } }),
    prisma.project.findMany({ where: { userId }, take: 500, include: { tags: { include: { tag: { select: { name: true } } } } } }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapTags = (item: any) => ({ ...item, tags: item.tags.map((t: any) => t.tag.name) });

  const data = {
    resources: resources.map(mapTags),
    prompts: prompts.map(mapTags),
    notes: notes.map(mapTags),
    projects: projects.map(mapTags),
  };

  vaultCache.set(userId, { data, expiry: Date.now() + CACHE_TTL });
  return data;
}

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

  const apiKey = await getApiKey();
  if (!apiKey) {
    return new Response("OPENROUTER_API_KEY not configured. Set it in Settings → System.", { status: 500 });
  }

  const { message, history = [] } = await req.json();
  if (!message || typeof message !== "string") {
    return new Response("Message required", { status: 400 });
  }

  const userId = session.user.id;

  const vault = await getVaultData(userId);

  const allItems = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...vault.resources.map((r: any) => ({ type: "resource" as const, id: r.id, title: r.title, tags: r.tags, description: r.category, content: r.notes, url: r.url })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...vault.prompts.map((p: any) => ({ type: "prompt" as const, id: p.id, title: p.title, tags: p.tags, description: p.category, content: p.prompt })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...vault.notes.map((n: any) => ({ type: "note" as const, id: n.id, title: n.title, tags: n.tags, description: n.category, content: n.content })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...vault.projects.map((p: any) => ({ type: "project" as const, id: p.id, title: p.title, tags: p.tags, description: p.description, content: p.planMd })),
  ];
  const scored = allItems
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const systemPrompt = `You are a knowledge OS assistant. You help the user work with their saved resources, prompts, notes, and projects.

RULES:
- Generate a maximum of 3 tags for any item using the format: Tags: tag1, tag2, tag3
- Do not impersonate a persona. Do not say "as an AI" or "as a language model" or similar.
- Be concise, technical, and helpful.
- Cite vault items using [1], [2], etc. when referring to specific items from the provided context.
- Answer questions directly without preamble.

RESPONSE STRUCTURE:
- Start with a brief 1-2 sentence summary answering the question directly.
- Organize information under ## sections (## Key Points, ## Sources, ## Explanation, etc.).
- End with actionable suggestions or next steps under ## Suggested Actions.
- Do NOT use conversational filler. Do NOT thank the user. Do NOT say "feel free to ask".

CREATION COMMAND:
When the user asks to create a vault item, explain what you're creating, then append a __CREATE__ JSON block.

Format:
__CREATE__
{"type":"TYPE","title":"TITLE","fields..."}
__END_CREATE__

Valid types and their fields:
- note: title, content, category, tags[]
- resource: title, url, notes, reason, category, tags[]
- prompt: title, prompt, category, useCase, tags[]
- project: title, description, status (active|planning|completed|on-hold), techStack (comma-separated string), tags[]

Include ONLY fields that the user explicitly provides or strongly implies. Default empty strings for missing fields. Tags max 3.`;

  const userPrompt = `Context from the user's vault:\n\n${context}\n\nUser question: ${message}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
  } catch (err: unknown) {
    return new Response(`AI error: ${err instanceof Error ? err.message : String(err)}`, { status: 500 });
  }
}
