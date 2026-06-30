import type { Action, Context } from "./types";
import { getSiteMeta } from "./metadata";
import { injectBaseStyles } from "./ui";

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

  popup.innerHTML = `
    <div class="dv-popup-hdr">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dv-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z"/><path d="M8 14v1a4 4 0 0 0 8 0v-1"/></svg>
      <span class="dv-popup-title">Devventory</span>
      <button class="dv-popup-close">✕</button>
    </div>
    <div class="dv-popup-body">
      <div class="dv-popup-tabs">
        <button class="dv-popup-tab" data-tab="resource">Save Page</button>
        <button class="dv-popup-tab" data-tab="note">Note</button>
        <button class="dv-popup-tab" data-tab="prompt">Prompt</button>
      </div>
      <div class="dv-popup-tab-content" data-content="resource">
        <div class="dv-popup-card">
          <div class="dv-popup-card-body">
            <div class="dv-popup-card-title">${escapeHtml(action.label === ctx.label ? pageData.title : action.label)}</div>
            <div class="dv-popup-card-url">${escapeHtml(pageData.hostname)}${escapeHtml(repoPath)}</div>
            ${badge ? `<span class="dv-popup-badge">${badge}</span>` : ""}
          </div>
        </div>
        <textarea class="dv-popup-input" data-reason placeholder="Why save this?" rows="2"></textarea>
      </div>
      <div class="dv-popup-tab-content" data-content="note">
        ${selText ? `<div class="dv-popup-sel">${escapeHtml(selText.slice(0, 300))}</div>` : ""}
        <textarea class="dv-popup-input" data-note placeholder="Type a quick thought..." rows="3"></textarea>
      </div>
      <div class="dv-popup-tab-content" data-content="prompt">
        ${selText ? `<div class="dv-popup-sel">${escapeHtml(selText.slice(0, 300))}</div>` : ""}
        <textarea class="dv-popup-input" data-prompt placeholder="Paste a prompt..." rows="3"></textarea>
      </div>
      <button class="dv-popup-save">Save Page</button>
      <div class="dv-popup-err" style="display:none"></div>
    </div>
  `;

  const tabs = popup.querySelectorAll(".dv-popup-tab") as NodeListOf<HTMLElement>;
  const contents = popup.querySelectorAll(".dv-popup-tab-content") as NodeListOf<HTMLElement>;
  const saveBtn = popup.querySelector(".dv-popup-save") as HTMLElement;
  const errEl = popup.querySelector(".dv-popup-err") as HTMLElement;
  const closeBtn = popup.querySelector(".dv-popup-close") as HTMLElement;

  let currentTab = action.tab;

  function setTab(tab: string) {
    currentTab = tab;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
    contents.forEach((c) => c.classList.toggle("active", c.dataset.content === tab));
    const labels: Record<string, string> = { resource: "Save Page", note: "Save Note", prompt: "Save Prompt" };
    saveBtn.textContent = labels[tab] || "Save";
  }

  tabs.forEach((t) => t.onclick = () => setTab(t.dataset.tab || "resource"));
  closeBtn.onclick = () => popup.remove();
  setTab(action.tab);

  const getVal = (key: string) =>
    (popup.querySelector(`[data-${key}]`) as HTMLTextAreaElement)?.value || "";

  saveBtn.onclick = async () => {
    saveBtn.textContent = "Saving...";
    (saveBtn as HTMLButtonElement).disabled = true;
    errEl.style.display = "none";

    try {
      const msgType = currentTab === "resource" ? "saveInlineResource"
        : currentTab === "note" ? "saveInlineNote"
        : "saveInlinePrompt";

      const payload: Record<string, unknown> =
        currentTab === "resource"
          ? { url: pageData.url, title: pageData.title, description: pageData.description, selectedText: selText, reason: getVal("reason"), siteType: pageData.siteId }
          : currentTab === "note"
            ? { content: selText ? `${selText}\n\n${getVal("note")}` : getVal("note"), title: `Selection from ${pageData.title}` }
            : { prompt: selText ? `${selText}\n\n${getVal("prompt")}` : getVal("prompt"), sourceUrl: pageData.url };

      const res = await chrome.runtime.sendMessage({ type: msgType, payload }) as { success?: boolean; error?: string };

      if (res.success) {
        popup.remove();
        showToast(
          currentTab === "resource"
            ? "Page saved!"
            : currentTab === "note"
              ? "Note saved!"
              : "Prompt saved!",
        );
      } else {
        errEl.textContent = res.error || "Failed";
        errEl.style.display = "block";
        saveBtn.textContent =
          currentTab === "resource"
            ? "Save Page"
            : currentTab === "note"
              ? "Save Note"
              : "Save Prompt";
        (saveBtn as HTMLButtonElement).disabled = false;
      }
    } catch (e) {
      console.error("Devventory save error:", e);
      errEl.textContent = "Could not connect";
      errEl.style.display = "block";
      saveBtn.textContent =
        currentTab === "resource"
          ? "Save Page"
          : currentTab === "note"
            ? "Save Note"
            : "Save Prompt";
      (saveBtn as HTMLButtonElement).disabled = false;
    }
  };

  // Position
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
  const firstInput = popup.querySelector("textarea") as HTMLTextAreaElement | null;
  firstInput?.focus();
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
