import type { Provider, Context, Action } from "../context-engine/types";
import { getSiteMeta } from "../context-engine/metadata";
import { createChip, showMenu } from "../context-engine/ui";
import { register } from "./registry";

const DOC_SITES = [
  "developer.mozilla.org",
  "react.dev",
  "nextjs.org",
  "nuxt.com",
  "svelte.dev",
  "vuejs.org",
  "angular.dev",
  "prisma.io",
  "trpc.io",
  "tailwindcss.com",
  "vite.dev",
  "astro.build",
  "python.org",
  "langchain.com",
  "platform.openai.com",
];

function isDocSite(hostname: string): boolean {
  return (
    DOC_SITES.some((s) => hostname.endsWith(s) || hostname === s) ||
    hostname.endsWith(".dev") ||
    hostname.endsWith(".docs") ||
    window.location.pathname.startsWith("/docs")
  );
}

const provider: Provider = {
  id: "docs",
  label: "Docs",
  urlPatterns: [
    "*://developer.mozilla.org/*",
    "*://react.dev/*",
    "*://nextjs.org/*",
    "*://tailwindcss.com/*",
    "*://svelte.dev/*",
    "*://*.dev/*",
  ],
  capabilities: ["documentation", "explain", "cheatsheet", "summary"],
  supportsSelection: true,
  supportsAI: true,

  detect(): Context | null {
    const { hostname } = window.location;
    if (!isDocSite(hostname)) return null;

    const heading =
      document.querySelector("h1")?.textContent?.trim() ||
      document.title;

    const framework = DOC_SITES.find((s) => hostname.endsWith(s) || hostname === s);

    return {
      id: "docs",
      label: heading,
      meta: { framework: framework || hostname },
      pageData: { ...getSiteMeta(), siteId: "docs" },
    };
  },

  getActions(ctx: Context): Action[] {
    return [
      {
        id: "explain",
        label: "Explain This Page",
        description: "AI explanation",
        icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
        tab: "note",
      },
      {
        id: "save-page",
        label: "Save Page",
        description: "Save as resource",
        icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        tab: "resource",
      },
      {
        id: "cheatsheet",
        label: "Generate Cheatsheet",
        description: "Create quick reference",
        icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
        tab: "note",
      },
      {
        id: "save-api",
        label: "Save API Reference",
        description: "Save key API details",
        icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
        tab: "note",
      },
    ];
  },

  getChipAnchor(): Element | null {
    return document.querySelector("h1") || null;
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

    return () => chip.remove();
  },
};

register(provider);
export default provider;
