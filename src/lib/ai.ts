const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function generateContent(prompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY not configured. Get a free key at https://openrouter.ai/keys");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

export async function suggestCategory(
  title: string,
  content: string,
  categories: string[]
): Promise<string> {
  const list = categories.join(", ");
  const prompt = `Given this item's title "${title}" and content "${content?.slice(0, 300)}", suggest the most appropriate category from: ${list}. Answer with only the category name, nothing else.`;
  const result = await generateContent(prompt);
  const match = categories.find((c) => c.toLowerCase() === result.toLowerCase());
  return match || "";
}

export async function suggestTags(
  title: string,
  content: string
): Promise<string[]> {
  const prompt = `Given this item's title "${title}" and content "${content?.slice(0, 500)}", suggest 3-5 relevant tags as a comma-separated list. Answer with only the tags, nothing else.`;
  const result = await generateContent(prompt);
  return result
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-#]/g, ""))
    .filter(Boolean);
}

export async function summarizeContent(content: string): Promise<string> {
  const prompt = `Summarize the following in 2-3 sentences:\n\n${content?.slice(0, 1500)}`;
  return generateContent(prompt);
}
