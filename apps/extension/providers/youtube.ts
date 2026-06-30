import type { Provider, Context, Action } from "../context-engine/types";
import { getSiteMeta } from "../context-engine/metadata";
import { createChip, showMenu } from "../context-engine/ui";

export const youtubeProvider: Provider = {
  id: "youtube",
  label: "YouTube",

  detect(): Context | null {
    const { hostname } = window.location;
    if (!["www.youtube.com", "youtube.com", "youtu.be"].includes(hostname)) return null;

    const v = new URL(window.location.href).searchParams.get("v");
    if (!v) return null;

    const channelEl = document.querySelector(
      "#owner #channel-name, yt-formatted-string.ytd-channel-name",
    );
    const channel = channelEl?.textContent?.trim() || undefined;

    const titleEl = document.querySelector("#above-the-fold #title h1") || document.querySelector("h1");
    return {
      id: "youtube",
      label: titleEl?.textContent?.trim() || "YouTube Video",
      meta: { videoId: v, channel },
      pageData: { ...getSiteMeta(), siteId: "youtube" },
    };
  },

  getActions(): Action[] {
    return [
      {
        id: "ai-summary",
        label: "AI Summary",
        description: "Summarize this video",
        icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
        tab: "note",
      },
      {
        id: "key-learnings",
        label: "Key Learnings",
        description: "Extract main points",
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
        tab: "note",
      },
      {
        id: "save-transcript",
        label: "Save Transcript",
        description: "Save full transcript",
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
        tab: "note",
      },
      {
        id: "save-video",
        label: "Save Video",
        description: "Save as resource",
        icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        tab: "resource",
      },
      {
        id: "flashcards",
        label: "Create Flashcards",
        description: "Generate study cards",
        icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
        tab: "note",
      },
    ];
  },

  getChipAnchor(): Element | null {
    // YouTube renders title inside #above-the-fold > #title > h1
    return (
      document.querySelector("#above-the-fold #title h1") ||
      document.querySelector("#title h1") ||
      document.querySelector("h1.ytd-video-primary-info-renderer") ||
      document.querySelector("h1") ||
      null
    );
  },

  mountUI(ctx: Context): () => void {
    const anchor = this.getChipAnchor?.();
    if (!anchor) return () => {};

    const chip = createChip(
      "M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6zM8 14v1a4 4 0 0 0 8 0v-1",
      "Devventory",
    );

    chip.onclick = () => {
      const actions = this.getActions(ctx);
      showMenu(chip, actions, (action) => {
        import("../context-engine/popup").then((m) => m.openPopup(action, ctx));
      });
    };

    anchor.parentElement?.insertBefore(chip, anchor.nextSibling);
    chip.style.marginLeft = "8px";
    chip.style.verticalAlign = "middle";

    return () => chip.remove();
  },
};
