import type { Action, Context } from "./types";
import { injectBaseStyles } from "./ui";
import type { CapturePayload, LearningContext } from "../lib/types";

const SITE_LABELS: Record<string, string> = {
  "github-repo": "GitHub Repo",
  "github-file": "File",
  "github-pr": "PR",
  "github-issue": "Issue",
  youtube: "YouTube",
  mdn: "MDN",
  stackoverflow: "Stack Overflow",
  docs: "Docs",
  blog: "Blog",
  article: "Article",
};

export function openPopup(action: Action, ctx: Context, rect?: DOMRect | null) {
  injectBaseStyles();
  clearExisting();

  const pageData = ctx.pageData;
  const selText = pageData.selectedText || "";
  const badge = pageData.siteId && SITE_LABELS[pageData.siteId];
  const repoPath =
    ctx.meta.owner && ctx.meta.repo
      ? `/${ctx.meta.owner}/${ctx.meta.repo}`
      : "";

  const popup = document.createElement("div");
  popup.className = "dv-float dv-popup";

  const displayTitle = action.label === ctx.label ? pageData.title : action.label;

  popup.innerHTML = `
    <div class="dv-popup-hdr">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dv-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z"/><path d="M8 14v1a4 4 0 0 0 8 0v-1"/></svg>
      <span class="dv-popup-title">Devventory</span>
      <button class="dv-popup-close">✕</button>
    </div>
    <div class="dv-popup-body">
      <div class="dv-popup-card">
        <div class="dv-popup-card-body">
          <div class="dv-popup-card-title">${escapeHtml(displayTitle)}</div>
          <div class="dv-popup-card-url">${escapeHtml(pageData.hostname)}${escapeHtml(repoPath)}</div>
          ${badge ? `<span class="dv-popup-badge">${badge}</span>` : ""}
        </div>
      </div>
      <div class="dv-popup-learn" style="display:none"></div>
      ${selText ? `<div class="dv-popup-sel">${escapeHtml(selText.slice(0, 300))}</div>` : ""}
      <textarea class="dv-popup-input" data-thought placeholder="What are you trying to keep?" rows="2"></textarea>
      <button class="dv-popup-save">Save</button>
      <div class="dv-popup-err" style="display:none"></div>
    </div>
  `;

  const saveBtn = popup.querySelector(".dv-popup-save") as HTMLElement;
  const errEl = popup.querySelector(".dv-popup-err") as HTMLElement;
  const closeBtn = popup.querySelector(".dv-popup-close") as HTMLElement;
  const thoughtInput = popup.querySelector("[data-thought]") as HTMLTextAreaElement;

  closeBtn.onclick = () => popup.remove();

  saveBtn.onclick = async () => {
    saveBtn.textContent = "Saving...";
    (saveBtn as HTMLButtonElement).disabled = true;
    errEl.style.display = "none";

    try {
      const payload: CapturePayload = {
        provider: ctx.id,
        capabilities: [],
        page: {
          url: pageData.url,
          title: pageData.title,
          description: pageData.description,
          siteName: pageData.siteName,
          favicon: pageData.favicon,
          ogImage: pageData.ogImage,
        },
        selection: selText ? { text: selText } : undefined,
        userInput: thoughtInput.value ? { thought: thoughtInput.value } : undefined,
        metadata: { ...ctx.meta, siteId: pageData.siteId },
      };

      const res = await chrome.runtime.sendMessage({ type: "capture", payload }) as { success?: boolean; error?: string; type?: string };

      if (res.success) {
        popup.remove();
        showToast(res.type ? `Saved as ${res.type.charAt(0).toUpperCase() + res.type.slice(1)}` : "Saved!");
      } else {
        errEl.textContent = res.error || "Failed";
        errEl.style.display = "block";
        saveBtn.textContent = "Save";
        (saveBtn as HTMLButtonElement).disabled = false;
      }
    } catch (e) {
      console.error("Devventory save error:", e);
      errEl.textContent = "Could not connect";
      errEl.style.display = "block";
      saveBtn.textContent = "Save";
      (saveBtn as HTMLButtonElement).disabled = false;
    }
  };

  if (rect) {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const top = rect.top + scrollY + 16;
    popup.style.top =
      top + 300 < window.innerHeight + scrollY
        ? `${top}px`
        : `${rect.top + scrollY - 300}px`;
    popup.style.left = `${Math.min(rect.left + scrollX, window.innerWidth - 350 + scrollX)}px`;
  } else {
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
  }

  document.body.appendChild(popup);
  thoughtInput?.focus();

  // Fetch learning context (non-blocking)
  chrome.runtime.sendMessage(
    { type: "get-context", payload: { url: pageData.url, provider: ctx.id } },
    (res: LearningContext) => {
      if (res?.saved && res.count > 0) {
        const learnEl = popup.querySelector(".dv-popup-learn") as HTMLElement;
        if (learnEl) {
          const items = res.types.map(t => `${t.count} ${t.type}`).join(" · ");
          learnEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--dv-accent)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Already saved — ${items}</span>`;
          learnEl.style.display = "flex";
        }
      }
    },
  );
}

function clearExisting() {
  document.querySelectorAll(".dv-popup, .dv-float-btn").forEach((e) => e.remove());
}

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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
