"use server";

import { auth } from "@/lib/auth";
import { suggestCategory, suggestTags, summarizeContent } from "@/lib/ai";

export async function aiSuggestCategory(title: string, content: string, categories: string[]) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const category = await suggestCategory(title, content, categories);
    return { category };
  } catch (e: any) {
    return { error: e.message || "Failed to suggest category" };
  }
}

export async function aiSuggestTags(title: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const tags = await suggestTags(title, content);
    return { tags: tags.join(", ") };
  } catch (e: any) {
    return { error: e.message || "Failed to suggest tags" };
  }
}

export async function aiSummarize(content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const summary = await summarizeContent(content);
    return { summary };
  } catch (e: any) {
    return { error: e.message || "Failed to summarize" };
  }
}
