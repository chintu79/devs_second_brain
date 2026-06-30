"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, Loader2, Star, ExternalLink, Bookmark } from "lucide-react";
import { fetchGithubRepo } from "@/actions/github";
import { createResource } from "@/actions/resources";

interface RepoPreview {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  language: string;
  stars: number;
}

export function GithubImport({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [repo, setRepo] = useState<RepoPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleFetch() {
    if (!url.includes("github.com")) { setError("Enter a valid GitHub repository URL"); return; }
    setLoading(true);
    setError(null);
    setRepo(null);
    const res = await fetchGithubRepo(url);
    setLoading(false);
    if ("error" in res) { setError(res.error); return; }
    setRepo(res);
  }

  async function handleSave() {
    if (!repo) return;
    setSaving(true);
    const fd = new FormData();
    fd.set("title", repo.title);
    fd.set("url", repo.url);
    fd.set("category", repo.category);
    fd.set("tags", repo.tags);
    fd.set("notes", repo.description);
    fd.set("reason", `GitHub — ${repo.language}, ${repo.stars} stars`);
    const result = await createResource(fd);
    setSaving(false);
    if ("error" in result) { setError(result.error as string); return; }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Import from GitHub</h2>
            <p className="text-xs text-muted-foreground">Paste a repo URL to auto-create a resource</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="https://github.com/owner/repo"
            className="flex-1 h-9 rounded-lg border border-border/20 bg-muted/30 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border/60 transition-colors font-mono"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
          </button>
        </div>

        {error && <p className="text-xs text-destructive mb-3">{error}</p>}

        {repo && (
          <div className="rounded-lg border border-border/20 bg-muted/20 p-4 space-y-3 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{repo.title}</p>
                {repo.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                )}
              </div>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {repo.language && (
                <span className="rounded-full bg-muted/60 px-2 py-0.5">{repo.language}</span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.stars}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{repo.category}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="h-8 rounded-lg border border-border/40 px-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          {repo && (
            <button onClick={handleSave} disabled={saving} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bookmark className="h-3.5 w-3.5" />}
              Save Resource
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
