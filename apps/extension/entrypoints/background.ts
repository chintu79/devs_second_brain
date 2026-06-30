async function getBaseUrl(): Promise<string> {
  const r = await chrome.storage.local.get("devventory_web_url");
  return r.devventory_web_url || "http://localhost:3000";
}

async function fetchWithKey(path: string, body: unknown) {
  const base = await getBaseUrl();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const { devventory_api_key } = await chrome.storage.sync.get("devventory_api_key");
  if (devventory_api_key) headers["x-api-key"] = devventory_api_key;
  return fetch(`${base}${path}`, { method: "POST", headers, body: JSON.stringify(body) }).then(r => r.json());
}

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {});

  // Toolbar icon → inline popup on current page
  chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: "showInlinePopup" });
    } catch {
      // Content script not registered for this site — inject on-demand
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content-scripts/content.js"],
        });
        chrome.tabs.sendMessage(tab.id, { type: "showInlinePopup" });
      } catch {}
    }
  });

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "getPageData") {
      (async () => {
        const { pendingTabId } = await chrome.storage.session.get("pendingTabId");
        const id = pendingTabId as number | undefined;
        if (id) {
          await chrome.storage.session.remove("pendingTabId");
          try { sendResponse(await chrome.tabs.sendMessage(id, { type: "getPageData" })); return; } catch {}
        }
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        tab?.id ? chrome.tabs.sendMessage(tab.id, { type: "getPageData" }, sendResponse) : sendResponse(null);
      })();
      return true;
    }

    if (msg.type === "capture") {
      (async () => {
        try {
          const res = await fetchWithKey("/api/ext/capture", msg.payload);
          sendResponse(res);
        } catch { sendResponse({ error: "Could not connect" }); }
      })();
      return true;
    }

    if (msg.type === "get-context") {
      (async () => {
        try {
          const query = msg.payload as { url: string; provider: string };
          const qs = new URLSearchParams(query);
          const base = await getBaseUrl();
          const headers: Record<string, string> = {};
          const { devventory_api_key } = await chrome.storage.sync.get("devventory_api_key");
          if (devventory_api_key) headers["x-api-key"] = devventory_api_key;
          const res = await fetch(`${base}/api/ext/context?${qs}`, { headers });
          sendResponse(await res.json());
        } catch { sendResponse({ saved: false, count: 0 }); }
      })();
      return true;
    }
  });
});
