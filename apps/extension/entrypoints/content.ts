import { injectBaseStyles } from "../context-engine/ui";
import { getSiteMeta } from "../context-engine/metadata";
import { openPopup } from "../context-engine/popup";

let floatBtn: HTMLButtonElement | null = null;

function clearFloat() {
  floatBtn?.remove();
  floatBtn = null;
}

function getSelRect(): DOMRect | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const r = sel.getRangeAt(0).getBoundingClientRect();
  return r.width === 0 && r.height === 0 ? null : r;
}

function onMouseUp(e: MouseEvent) {
  if ((e.target as HTMLElement)?.closest?.(".dv-float, .dv-chip, .dv-menu")) return;
  const rect = getSelRect();
  rect ? showFloatBtn(rect) : clearFloat();
}

function showFloatBtn(rect: DOMRect) {
  if (document.querySelector(".dv-popup")) return;
  if (!floatBtn) {
    injectBaseStyles();
    floatBtn = document.createElement("button");
    floatBtn.className = "dv-float dv-float-btn";
    floatBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    floatBtn.title = "Save to Devventory";
    floatBtn.onclick = () => {
      clearFloat();
      const data = getSiteMeta();
      openPopup(data, rect);
    };
    document.body.appendChild(floatBtn);
  }
  const scrollX = window.scrollX,
    scrollY = window.scrollY;
  floatBtn.style.left =
    Math.min(rect.right + scrollX - 7, window.innerWidth - 40) + "px";
  floatBtn.style.top =
    Math.max(rect.top + scrollY - 14, scrollY + 8) + "px";
}

function isCloudflareChallenge(): boolean {
  return (
    document.querySelector("#cf-challenge-wrapper, #cf-please-wait, [id^='cf-challenge-']") !== null ||
    document.title.includes("Just a moment") ||
    document.body?.textContent?.includes("Checking your browser") ||
    window.location.href.includes("__cf_chl_tk")
  );
}

function waitForRealPage(maxMs = 30000): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!isCloudflareChallenge()) return resolve();
    const interval = setInterval(() => {
      if (!isCloudflareChallenge()) {
        clearInterval(interval);
        resolve();
      }
    }, 2000);
    setTimeout(() => clearInterval(interval), maxMs);
  });
}

function initUI() {
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousedown", (e) => {
    if (!(e.target as HTMLElement)?.closest?.(".dv-float, .dv-chip, .dv-menu")) clearFloat();
  });
  document.addEventListener("scroll", clearFloat, true);

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "ping") {
      sendResponse(true);
    }
    if (msg.type === "getPageData") {
      sendResponse(getSiteMeta());
    }
    if (msg.type === "showToast") {
      showToast(msg.message);
      sendResponse(true);
    }
    if (msg.type === "showInlinePopup") {
      injectBaseStyles();
      const data = getSiteMeta();
      openPopup(data, null);
      sendResponse(true);
    }
    if (msg.type === "showContextPopup") {
      injectBaseStyles();
      const data = getSiteMeta();
      if (msg.selectionText) data.selectedText = msg.selectionText;
      if (msg.linkUrl) data.url = msg.linkUrl;
      openPopup(data, null);
      sendResponse(true);
    }
  });
}

export default defineContentScript({
  matches: ["*://*/*"],
  main() {
    if (isCloudflareChallenge()) {
      waitForRealPage().then(initUI);
      return;
    }
    initUI();
  },
});

function showToast(message: string) {
  const el = document.createElement("div");
  el.textContent = message;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: "2147483647",
    padding: "10px 16px",
    background: "#6366f1",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    animation: "dv-toast-in 0.2s ease-out",
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}
