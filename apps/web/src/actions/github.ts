"use server";

import { auth } from "@/lib/auth";
import { fetchRepoByUrl } from "@/lib/github";

export async function fetchGithubRepo(url: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    const repo = await fetchRepoByUrl(url);
    if (!repo) return { error: "Not a valid GitHub repository URL" };
    return repo;
  } catch {
    return { error: "Failed to fetch repository info" };
  }
}
