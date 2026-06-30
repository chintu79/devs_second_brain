const KEYS = {
  API_KEY: "devventory_api_key",
  WEB_URL: "devventory_web_url",
} as const;

export const storage = {
  async getApiKey(): Promise<string | null> {
    const result = await chrome.storage.sync.get(KEYS.API_KEY);
    return result[KEYS.API_KEY] || null;
  },

  async setApiKey(key: string): Promise<void> {
    await chrome.storage.sync.set({ [KEYS.API_KEY]: key });
  },

  async clearApiKey(): Promise<void> {
    await chrome.storage.sync.remove(KEYS.API_KEY);
  },

  async getWebUrl(): Promise<string> {
    const result = await chrome.storage.local.get(KEYS.WEB_URL);
    return result[KEYS.WEB_URL] || "http://localhost:3000";
  },

  async setWebUrl(url: string): Promise<void> {
    await chrome.storage.local.set({ [KEYS.WEB_URL]: url });
  },
};
