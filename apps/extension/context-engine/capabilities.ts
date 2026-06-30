import type { Capability, ActionDef, Action, ProviderData } from "./types";

const REGISTRY: Record<Capability, ActionDef> = {
  // Content types
  repository:    { id: "save-repository", label: "Save Repository",  description: "Save repo with AI summary",   icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",                  tab: "auto", priority: 1 },
  code:          { id: "save-code",       label: "Save Code",        description: "Save this file",              icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",               tab: "auto", priority: 2 },
  video:         { id: "save-video",      label: "Save Video",       description: "Save as resource",            icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",                  tab: "auto", priority: 1 },
  documentation: { id: "save-page",       label: "Save Page",        description: "Save as resource",            icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",                  tab: "auto", priority: 1 },
  conversation:  { id: "save-conversation", label: "Save Conversation", description: "Save chat as resource",    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",                       tab: "auto", priority: 1 },
  qa:            { id: "save-qa",         label: "Save Q&A",         description: "Save question and answer",    icon: "M9.5 3.5A4.5 4.5 0 0 1 14 8c0 1.5-.7 2.8-1.8 3.7A3 3 0 0 0 11 14v1",                    tab: "auto", priority: 1 },
  article:       { id: "save-article",    label: "Save Article",     description: "Save as resource",            icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",                  tab: "auto", priority: 1 },
  paper:         { id: "save-paper",      label: "Save Paper",       description: "Save academic paper",         icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",                                          tab: "auto", priority: 1 },
  design:        { id: "save-design",     label: "Save Design",      description: "Save design reference",       icon: "M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z",                                          tab: "auto", priority: 1 },
  issue:         { id: "save-issue",      label: "Save Issue",       description: "Save issue",                  icon: "M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",                                tab: "auto", priority: 2 },
  pr:            { id: "save-pr",         label: "Save Pull Request", description: "Save PR",                    icon: "M7 21V3m10 18V3M3 7h18M3 17h18",                                                      tab: "auto", priority: 2 },
  page:          { id: "save-page",       label: "Save Page",        description: "Save as resource",            icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",                  tab: "auto", priority: 5 },

  // AI actions
  summary:       { id: "ai-summary",      label: "AI Summary",       description: "Generate summary",            icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",                         tab: "auto", priority: 10 },
  explain:       { id: "ai-explain",      label: "Explain This",     description: "AI explanation",              icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",                         tab: "auto", priority: 11 },
  cheatsheet:    { id: "ai-cheatsheet",   label: "Cheatsheet",       description: "Generate quick reference",    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",                tab: "auto", priority: 12 },
  flashcard:     { id: "ai-flashcard",    label: "Flashcards",       description: "Generate study cards",         icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",       tab: "auto", priority: 13 },
  roadmap:       { id: "ai-roadmap",      label: "Learning Roadmap", description: "Generate study plan",          icon: "M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4", tab: "auto", priority: 14 },
  "tech-stack":  { id: "ai-tech-stack",   label: "Tech Stack",       description: "Detect technologies used",    icon: "M22 12h-4l-3 9L9 3l-3 9H2",                                                                 tab: "auto", priority: 15 },
  transcript:    { id: "save-transcript", label: "Save Transcript",  description: "Save full transcript",         icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",               tab: "auto", priority: 3 },
  "key-points":  { id: "ai-key-points",   label: "Key Learnings",    description: "Extract main points",          icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2",                tab: "auto", priority: 16 },
};

export function buildActions(capabilities: Capability[]): ActionDef[] {
  const seen = new Set<string>();
  const result: ActionDef[] = [];
  for (const cap of capabilities) {
    const def = REGISTRY[cap];
    if (def && !seen.has(def.id)) {
      seen.add(def.id);
      result.push(def);
    }
  }
  result.sort((a, b) => a.priority - b.priority);
  return result;
}

export function actionDefToAction(def: ActionDef, data?: ProviderData): Action {
  return {
    id: def.id,
    label: def.label,
    description: def.description,
    icon: def.icon,
    tab: "resource",
    payload: data ? { providerData: data, captureType: "auto" } : undefined,
  };
}

export function getCapabilityRegistry(): Record<Capability, ActionDef> {
  return { ...REGISTRY };
}
