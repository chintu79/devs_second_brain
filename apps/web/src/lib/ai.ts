import { getConfigValue } from "@/actions/config";

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free";
const ENV_KEY = process.env.OPENROUTER_API_KEY;

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function getApiKey(): Promise<string | null> {
  // ponytail: two-tier — env var wins, then DB config
  if (ENV_KEY) return ENV_KEY;
  try { return await getConfigValue("OPENROUTER_API_KEY"); } catch { return null; }
}

async function generateContent(prompt: string): Promise<string> {
  const key = await getApiKey();
  if (!key) {
    throw new Error("OPENROUTER_API_KEY not configured. Set it in Settings → System or add it to your .env file.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
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

export async function suggestTechnologies(content: string): Promise<string[]> {
  const prompt = `From the following content, list the technologies, frameworks, and tools mentioned as a comma-separated list. Answer with only the list, nothing else:\n\n${content?.slice(0, 1000)}`;
  const result = await generateContent(prompt);
  return result.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function suggestDifficulty(content: string): Promise<string> {
  const prompt = `Rate the difficulty of the following content as either "beginner", "intermediate", or "advanced". Answer with only one word:\n\n${content?.slice(0, 1000)}`;
  const result = (await generateContent(prompt)).toLowerCase().trim();
  return ["beginner", "intermediate", "advanced"].includes(result) ? result : "";
}

export async function suggestKeywords(content: string): Promise<string[]> {
  const prompt = `Extract 3-5 key topics or keywords from the following content as a comma-separated list. Answer with only the list:\n\n${content?.slice(0, 1000)}`;
  const result = await generateContent(prompt);
  return result.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
}
