import type { Provider, Context, Action } from "../context-engine/types";
import { getSiteMeta } from "../context-engine/metadata";
import { createChip, showMenu } from "../context-engine/ui";

export const githubProvider: Provider = {
  id: "github-repo",
  label: "GitHub",

  detect(): Context | null {
    const { hostname, pathname } = window.location;
    if (hostname !== "github.com") return null;

    const parts = pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const [owner, repo] = parts;
    const pageType =
      parts.length === 2
        ? "github-repo"
        : parts[2] === "pull"
          ? "github-pr"
          : parts[2] === "issues"
            ? "github-issue"
            : parts.length > 2
              ? "github-file"
              : "github-repo";

    const starEl = document.querySelector("[data-testid='stargazers-count']");
    const stars = starEl
      ? parseInt(starEl.textContent?.replace(/,/g, "") || "0", 10) || undefined
      : undefined;

    const langEl = document.querySelector("[itemprop='programmingLanguage']");
    const language = langEl?.textContent || undefined;

    const descEl = document.querySelector(
      "p.f4.mt-3, [data-testid='repo-description']",
    );

    const meta: Record<string, unknown> = {
      owner,
      repo,
      stars,
      language,
      description: descEl?.textContent?.trim() || "",
    };

    return {
      id: pageType as Context["id"],
      label: `${owner}/${repo}`,
      meta,
      pageData: { ...getSiteMeta(), siteId: pageType as Context["id"] },
    };
  },

  getActions(ctx: Context): Action[] {
    const isRepo = ctx.id === "github-repo";
    const isFile = ctx.id === "github-file";
    return [
      {
        id: "save-repo",
        label: isFile ? "Save File" : "Save Repository",
        description: isRepo ? "Save repo with AI summary" : "Save this file",
        icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm4 4h6v6H9V9z",
        tab: "resource",
        payload: { siteType: ctx.id },
      },
      ...(isRepo
        ? [
            {
              id: "ai-summary",
              label: "AI Summary",
              description: "Generate repo overview",
              icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
              tab: "note" as const,
            },
            {
              id: "tech-stack",
              label: "Tech Stack",
              description: "Detect technologies used",
              icon: "M22 12h-4l-3 9L9 3l-3 9H2",
              tab: "note" as const,
            },
            {
              id: "learning-path",
              label: "Learning Roadmap",
              description: "Generate study plan",
              icon: "M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4",
              tab: "note" as const,
            },
          ]
        : []),
      {
        id: "save-readme",
        label: "Save README",
        description: "Save as note",
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
        tab: "note",
      },
      {
        id: "related-notes",
        label: "Related Notes",
        description: "Find in your vault",
        icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
        tab: "resource",
      },
    ];
  },

  getChipAnchor(): Element | null {
    // Beside repo name in the header
    return (
      document.querySelector<HTMLElement>(
        "h1 strong a, [data-testid='repo-title'] a, [data-testid='repository-title'] a, .repository-content h1",
      ) ||
      document.querySelector<HTMLElement>("h1") ||
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
        import("../context-engine/popup").then((m) =>
          m.openPopup(action, ctx),
        );
      });
    };

    anchor.parentElement?.insertBefore(chip, anchor.nextSibling);
    chip.style.marginLeft = "8px";

    return () => chip.remove();
  },
};
