import { mountContextUI, getContext } from "../context-engine";
import { injectBaseStyles } from "../context-engine/ui";
import { getSiteMeta } from "../context-engine/metadata";
import { openPopup } from "../context-engine/popup";

// ─── Floating "+" button on text selection ───

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
      const ctx = getContext();
      const selText = window.getSelection()?.toString() || "";
      const hasSel = !!selText;
      openPopup(
        {
          id: hasSel ? "save-note" : "save-page",
          label: hasSel ? "Save Selection" : "Save Page",
          description: "",
          icon: "",
          tab: hasSel ? "note" : "resource",
        },
        ctx || {
          id: "generic",
          label: document.title,
          meta: {},
          pageData: { ...getSiteMeta(), siteId: "generic" },
        },
        rect,
      );
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

// ─── Entry ───

export default defineContentScript({
  matches: [
    "*://github.com/*",
    "*://www.youtube.com/*",
    "*://youtu.be/*",
    "*://developer.mozilla.org/*",
    "*://react.dev/*",
    "*://nextjs.org/*",
    "*://tailwindcss.com/*",
    "*://svelte.dev/*",
  ],
  main() {
    // Mount context-aware chips on supported sites (GitHub, YouTube, docs)
    const unmount = mountContextUI();

    // Selection floater — minimal listener, only creates DOM on actual selection
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", (e) => {
      if (!(e.target as HTMLElement)?.closest?.(".dv-float, .dv-chip, .dv-menu")) clearFloat();
    });
    document.addEventListener("scroll", clearFloat, true);

    // Message handlers — no DOM injection until user acts
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg.type === "getPageData") {
        sendResponse(getSiteMeta());
      }
      if (msg.type === "showToast") {
        showToast(msg.message);
        sendResponse(true);
      }
      if (msg.type === "showInlinePopup") {
        injectBaseStyles();
        const ctx = getContext();
        const selText = window.getSelection()?.toString() || "";
        openPopup(
          {
            id: "save-page",
            label: ctx?.label || document.title,
            description: "",
            icon: "",
            tab: selText ? "note" : "resource",
          },
          ctx || {
            id: "generic",
            label: document.title,
            meta: {},
            pageData: { ...getSiteMeta(), siteId: "generic" },
          },
          null,
        );
        sendResponse(true);
      }
    });

    return () => {
      unmount();
      clearFloat();
    };
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
