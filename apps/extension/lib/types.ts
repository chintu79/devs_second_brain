export type Tab = "resource" | "note" | "prompt";

export type SiteType =
  | "github-repo" | "github-file" | "github-pr" | "github-issue"
  | "youtube"
  | "mdn"
  | "stackoverflow"
  | "docs"
  | "blog"
  | "article"
  | "other";

export interface GitHubData {
  repo: string;
  owner: string;
  language?: string;
  stars?: number;
}

export interface YouTubeData {
  videoId: string;
  channel?: string;
  duration?: string;
}

export interface PageData {
  url: string;
  title: string;
  description: string;
  favicon: string;
  siteName: string;
  ogImage: string;
  domain: string;
  selectedText: string;
  siteType: SiteType;
  siteMeta: GitHubData | YouTubeData | null;
}

export interface SaveResourcePayload {
  url: string;
  title: string;
  description: string;
  selectedText: string;
  reason: string;
  siteType?: string;
}

export interface SaveNotePayload {
  content: string;
  title?: string;
}

export interface SavePromptPayload {
  prompt: string;
  title?: string;
  sourceUrl: string;
  aiModel?: string;
}

export interface AiEnrichResult {
  category: string;
  tags: string[];
  summary: string;
  technologies: string[];
  difficulty: string;
  keywords: string[];
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  id?: string;
  error?: string;
  ai?: AiEnrichResult;
}

export interface ExtensionMessage {
  type: "getPageData" | "showToast" | "showInlinePopup" | "saveInlineResource" | "saveInlineNote" | "saveInlinePrompt";
  payload?: unknown;
}
