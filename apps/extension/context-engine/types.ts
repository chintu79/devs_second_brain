export type SiteId =
  | "github-repo" | "github-file" | "github-pr" | "github-issue"
  | "youtube"
  | "mdn" | "docs"
  | "chatgpt" | "claude" | "gemini"
  | "stackoverflow"
  | "blog"
  | "paper"
  | "generic";

export interface SiteMeta {
  url: string;
  hostname: string;
  title: string;
  description: string;
  favicon: string;
  siteName: string;
  ogImage: string;
  selectedText: string;
  siteId: SiteId;
}

export interface GitHubMeta {
  owner: string;
  repo: string;
  language?: string;
  stars?: number;
  description?: string;
  topics?: string[];
}

export interface YouTubeMeta {
  videoId: string;
  channel?: string;
  title?: string;
}

export interface DocsMeta {
  framework?: string;
  version?: string;
  section?: string;
}

export interface ChatMeta {
  provider: "chatgpt" | "claude" | "gemini";
  hasPrompt: boolean;
  hasResponse: boolean;
}

export interface StackOverflowMeta {
  questionId?: string;
  hasAcceptedAnswer: boolean;
  tags: string[];
}

export interface BlogMeta {
  platform: "medium" | "devto" | "hashnode" | "other";
  author?: string;
  readingTime?: number;
}

export interface Context {
  id: SiteId;
  label: string;
  meta: Record<string, unknown>;
  pageData: SiteMeta;
}

export interface Action {
  id: string;
  label: string;
  description: string;
  icon: string; // SVG path
  tab: "resource" | "note" | "prompt";
  payload?: Record<string, unknown>;
}

export interface Provider {
  id: SiteId;
  label: string;
  detect(): Context | null;
  getActions(ctx: Context): Action[];
  mountUI(ctx: Context): () => void; // returns cleanup
  getChipAnchor?(): Element | null;
}
