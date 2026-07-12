import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  modules: [],
  manifest: {
    name: "Devventory",
    version: "0.1.0",
    description: "The fastest way to capture knowledge from any page",
    permissions: ["storage", "activeTab", "contextMenus", "scripting"],
    host_permissions: ["<all_urls>"],
    action: {},
    options_ui: {
      page: "options.html",
      open_in_tab: true,
    },
    commands: {
      "capture-page": {
        suggested_key: {
          default: "Ctrl+Shift+S",
          mac: "Command+Shift+S",
        },
        description: "Capture current page",
      },
    },
  },
});
