import type { Provider, Context, Action } from "../context-engine/types";
import { getSiteMeta } from "../context-engine/metadata";

export const genericProvider: Provider = {
  id: "generic",
  label: "Page",

  detect(): Context | null {
    // Always matches as fallback
    return {
      id: "generic",
      label: document.title || window.location.hostname,
      meta: {},
      pageData: { ...getSiteMeta(), siteId: "generic" },
    };
  },

  getActions(): Action[] {
    return [
      {
        id: "save-page",
        label: "Save Page",
        description: "Save as resource",
        icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        tab: "resource",
      },
      {
        id: "save-note",
        label: "Save Note",
        description: "Write a quick note",
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
        tab: "note",
      },
      {
        id: "ai-summary",
        label: "AI Summary",
        description: "Summarize this page",
        icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
        tab: "note",
      },
    ];
  },

  mountUI(): () => void {
    return () => {};
  },
};
