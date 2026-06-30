import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  modules: [],
  manifest: {
    name: "Devventory",
    version: "0.1.0",
    description: "The fastest way to capture knowledge from any page",
    permissions: ["storage", "activeTab", "contextMenus", "scripting"],
    host_permissions: [
      "*://github.com/*",
      "*://www.youtube.com/*",
      "*://youtu.be/*",
      "*://developer.mozilla.org/*",
      "*://react.dev/*",
      "*://nextjs.org/*",
      "*://tailwindcss.com/*",
      "*://svelte.dev/*",
      "*://*.dev/*",
    ],
    action: {},
  },
});
