import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  modules: [],
  manifest: {
    name: "Devventory",
    version: "0.1.0",
    description: "The fastest way to capture knowledge from any page",
    permissions: ["storage", "activeTab", "contextMenus", "scripting"],
    action: {},
  },
});
