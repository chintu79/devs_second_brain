import { enqueueAndSend, flushQueue } from "../capture-engine/sender";
import { getQueueLength } from "../capture-engine/queue";

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

function sendToTab(tabId: number, msg: unknown) {
  return chrome.tabs.sendMessage(tabId, msg).catch(() => {});
}

function showInlinePopup(tabId: number) {
  return sendToTab(tabId, { type: "showInlinePopup" });
}

function ensureContentScript(tabId: number): Promise<void> {
  return sendToTab(tabId, { type: "ping" }).then(() => {}).catch(() =>
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["content-scripts/content.js"],
    }).then(() => {}).catch(() => {})
  );
}

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "devventory-root",
      title: "Devventory",
      contexts: ["page", "link", "selection", "image"],
    });

    chrome.contextMenus.create({
      id: "save-page",
      parentId: "devventory-root",
      title: "Save Page",
      contexts: ["page"],
    });

    chrome.contextMenus.create({
      id: "save-link",
      parentId: "devventory-root",
      title: "Save Link",
      contexts: ["link"],
    });

    chrome.contextMenus.create({
      id: "save-selection",
      parentId: "devventory-root",
      title: "Save Selection",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "save-image",
      parentId: "devventory-root",
      title: "Save Image",
      contexts: ["image"],
    });

    chrome.contextMenus.create({
      id: "quick-note",
      parentId: "devventory-root",
      title: "Quick Note",
      contexts: ["page"],
    });

    flushPendingCaptures();
  });

  async function flushPendingCaptures() {
    const len = await getQueueLength();
    if (len > 0) flushQueue();
  }

  chrome.runtime.onStartup.addListener(() => {
    flushPendingCaptures();
  });

  // Toolbar icon inline popup
  chrome.action.onClicked.addListener(async (tab) => {
    if (!tab?.id) return;
    await ensureContentScript(tab.id);
    showInlinePopup(tab.id);
  });

  // Keyboard shortcut
  chrome.commands?.onCommand?.addListener(async (command, tab) => {
    if (command === "capture-page" && tab?.id) {
      await ensureContentScript(tab.id);
      showInlinePopup(tab.id);
    }
  });

  // Context menu clicks
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (!tab?.id) return;
    await ensureContentScript(tab.id);

    let contextMsg: Record<string, string> = { context: info.menuItemId };

    if (info.linkUrl) contextMsg.linkUrl = info.linkUrl;
    if (info.selectionText) contextMsg.selectionText = info.selectionText;
    if (info.srcUrl) contextMsg.srcUrl = info.srcUrl;

    sendToTab(tab.id, { type: "showContextPopup", ...contextMsg });
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
          const p = msg.payload as any;
          const id = crypto.randomUUID();
          const apiPayload = {
            source: "extension",
            type: "reference",
            payload: {
              url: p.page?.url,
              title: p.page?.title,
              description: p.page?.description,
              selectedText: p.selection?.text,
              note: p.userInput?.thought,
            },
            provider: p.provider,
            context: p.metadata,
          };

          await enqueueAndSend(id, apiPayload, (feedback) => {
            sendToTab(_sender.tab?.id ?? 0, { type: "showToast", message: feedback });
          });

          sendResponse({ success: true, type: "link" });
        } catch {
          sendResponse({ error: "Could not connect" });
        }
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

    if (msg.type === "check-queue") {
      (async () => {
        const len = await getQueueLength();
        sendResponse({ pending: len });
      })();
      return true;
    }
  });
});
