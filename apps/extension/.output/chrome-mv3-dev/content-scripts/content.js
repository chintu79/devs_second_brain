var content = (function() {
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __esmMin = (fn, res, err) => () => {
		if (err) throw err[0];
		try {
			return fn && (res = fn(fn = 0)), res;
		} catch (e) {
			throw err = [e], e;
		}
	};
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region context-engine/metadata.ts
	function getMeta(name) {
		return document.querySelector(`meta[name="${name}"], meta[property="og:${name}"], meta[name="twitter:${name}"]`)?.content || "";
	}
	function getSiteMeta() {
		return {
			url: window.location.href,
			hostname: window.location.hostname,
			title: getMeta("title") || document.title,
			description: getMeta("description") || "",
			favicon: document.querySelector("link[rel~='icon']")?.href || "/favicon.ico",
			siteName: getMeta("site_name") || window.location.hostname,
			ogImage: getMeta("image") || "",
			selectedText: window.getSelection()?.toString() || ""
		};
	}
	//#endregion
	//#region context-engine/ui.ts
	function injectBaseStyles() {
		if (injected) return;
		injected = true;
		const style = document.createElement("style");
		style.textContent = `
    @keyframes dv-toast-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes dv-pop{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
    @keyframes dv-slide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

    /* Chip — small pill with own vars (Brave Shields strips :root custom props) */
    .dv-chip{--dv-accent:#6366f1;--dv-bg:#fff;--dv-fg:#1a1a1a;--dv-muted:#8a9299;--dv-border:#e4e4e7;--dv-card:#f4f4f5;display:inline-flex;align-items:center;gap:4px;padding:2px 8px 2px 6px;border-radius:6px;border:1px solid var(--dv-border);background:var(--dv-bg);color:var(--dv-accent);font-size:11px;font-weight:500;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;transition:all 0.15s;white-space:nowrap;vertical-align:middle;line-height:normal;box-shadow:none;user-select:none}
    @media(prefers-color-scheme:dark){.dv-chip{--dv-accent:#818cf8;--dv-bg:#0a0a0a;--dv-fg:#fafafa;--dv-muted:#8a9299;--dv-border:#27272a;--dv-card:#18181b}}
    .dv-chip:hover{background:var(--dv-card);border-color:var(--dv-accent);box-shadow:0 1px 4px rgba(0,0,0,0.08)}
    .dv-chip svg{width:12px;height:12px;flex-shrink:0}

    /* Action menu — small dropdown below chip */
    .dv-menu{--dv-accent:#6366f1;--dv-bg:#fff;--dv-fg:#1a1a1a;--dv-muted:#8a9299;--dv-border:#e4e4e7;--dv-card:#f4f4f5;position:absolute;z-index:2147483646;background:var(--dv-bg);border:1px solid var(--dv-border);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.12);padding:4px;min-width:180px;animation:dv-slide 0.12s cubic-bezier(0.16,1,0.3,1);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    @media(prefers-color-scheme:dark){.dv-menu{--dv-accent:#818cf8;--dv-bg:#0a0a0a;--dv-fg:#fafafa;--dv-muted:#8a9299;--dv-border:#27272a;--dv-card:#18181b}}
    .dv-menu-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border:none;background:none;cursor:pointer;font-size:11px;color:var(--dv-fg);border-radius:5px;width:100%;text-align:left;transition:background 0.1s}
    .dv-menu-item:hover{background:var(--dv-card)}
    .dv-menu-item svg{width:13px;height:13px;color:var(--dv-accent);flex-shrink:0}
    .dv-menu-item span{flex:1}
    .dv-menu-item small{color:var(--dv-muted);font-size:10px}

    /* Inline popup (reused from content) */
    .dv-float{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box;z-index:2147483646;--dv-accent:#6366f1;--dv-bg:#fff;--dv-fg:#1a1a1a;--dv-muted:#8a9299;--dv-border:#e4e4e7;--dv-card:#f4f4f5}
    @media(prefers-color-scheme:dark){.dv-float{--dv-accent:#818cf8;--dv-bg:#0a0a0a;--dv-fg:#fafafa;--dv-muted:#8a9299;--dv-border:#27272a;--dv-card:#18181b}}
    .dv-float-btn{position:absolute;width:28px;height:28px;border-radius:50%;border:1px solid var(--dv-border);background:var(--dv-bg);color:var(--dv-accent);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);padding:0;animation:dv-pop 0.15s cubic-bezier(0.16,1,0.3,1)}
    .dv-float-btn:hover{background:var(--dv-card);transform:scale(1.1)}
    .dv-popup{position:absolute;width:340px;background:var(--dv-bg);border:1px solid var(--dv-border);border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);overflow:hidden;animation:dv-pop 0.15s cubic-bezier(0.16,1,0.3,1)}
    .dv-popup-hdr{display:flex;align-items:center;gap:6px;padding:8px 12px;border-bottom:1px solid var(--dv-border)}
    .dv-popup-title{font-size:12px;font-weight:600;flex:1;color:var(--dv-fg)}
    .dv-popup-close{background:none;border:none;cursor:pointer;color:var(--dv-muted);padding:2px 4px;font-size:14px;border-radius:4px}
    .dv-popup-close:hover{background:var(--dv-card);color:var(--dv-fg)}
    .dv-popup-body{padding:8px 12px 10px}
    .dv-popup-tabs{display:flex;gap:4px;margin-bottom:8px}
    .dv-popup-tab{flex:1;padding:5px;border:none;background:none;cursor:pointer;font-size:11px;font-weight:500;color:var(--dv-muted);border-radius:5px;transition:all 0.15s}
    .dv-popup-tab:hover{background:var(--dv-card)}
    .dv-popup-tab.active{background:var(--dv-accent);color:#fff}
    .dv-popup-tab-content{display:none}
    .dv-popup-tab-content.active{display:block;animation:panel-in 0.15s cubic-bezier(0.16,1,0.3,1)}
    @keyframes panel-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
    .dv-popup-card{background:var(--dv-card);border-radius:8px;padding:8px 10px;margin-bottom:8px}
    .dv-popup-card-body{min-width:0}
    .dv-popup-card-title{font-size:12px;font-weight:500;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dv-fg)}
    .dv-popup-card-url{font-size:10px;color:var(--dv-muted);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .dv-popup-badge{display:inline-block;font-size:9px;font-weight:600;padding:1px 5px;border-radius:4px;background:var(--dv-bg);color:var(--dv-muted);margin-top:4px}
    .dv-popup-sel{font-size:11px;color:var(--dv-muted);background:var(--dv-card);padding:6px 8px;border-radius:6px;margin-bottom:8px;max-height:48px;overflow:hidden;line-height:1.4;position:relative}
    .dv-popup-sel::after{content:"";position:absolute;bottom:0;left:0;right:0;height:16px;background:linear-gradient(transparent,var(--dv-card));pointer-events:none}
    .dv-popup-input{width:100%;padding:7px 9px;border:1px solid var(--dv-border);border-radius:6px;font-size:12px;outline:none;font-family:inherit;resize:none;min-height:36px;color:var(--dv-fg);background:var(--dv-bg);box-sizing:border-box}
    .dv-popup-input:focus{border-color:var(--dv-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--dv-accent) 15%,transparent)}
    .dv-popup-save{width:100%;margin-top:8px;padding:7px;background:var(--dv-accent);color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;transition:opacity 0.15s}
    .dv-popup-save:hover{opacity:0.9}
    .dv-popup-save:disabled{opacity:0.4;cursor:default}
    .dv-popup-err{color:#ef4444;font-size:11px;padding:4px 0;margin-top:4px;display:none}
  `;
		document.head.appendChild(style);
	}
	function createChip(icon, label) {
		const chip = document.createElement("div");
		chip.className = "dv-chip";
		chip.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icon}"/></svg>${label}`;
		return chip;
	}
	function showMenu(anchor, actions, onSelect) {
		const existing = document.querySelector(".dv-menu");
		if (existing) existing.remove();
		const menu = document.createElement("div");
		menu.className = "dv-menu";
		actions.forEach((a) => {
			const item = document.createElement("button");
			item.className = "dv-menu-item";
			item.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${a.icon}"/></svg><span>${a.label}</span><small>${a.description}</small>`;
			item.onclick = (e) => {
				e.stopPropagation();
				menu.remove();
				onSelect(a);
			};
			menu.appendChild(item);
		});
		const rect = anchor.getBoundingClientRect();
		menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
		menu.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 200)}px`;
		document.body.appendChild(menu);
		const close = (e) => {
			if (!menu.contains(e.target) && e.target !== anchor) {
				menu.remove();
				document.removeEventListener("mousedown", close);
			}
		};
		setTimeout(() => document.addEventListener("mousedown", close), 0);
	}
	var injected;
	var init_ui = __esmMin((() => {
		injected = false;
	}));
	//#endregion
	//#region context-engine/popup.ts
	var popup_exports = /* @__PURE__ */ __exportAll({ openPopup: () => openPopup });
	function openPopup(action, ctx, rect) {
		injectBaseStyles();
		clearExisting();
		const pageData = ctx.pageData;
		const selText = pageData.selectedText || "";
		const badge = pageData.siteId && SITE_LABELS[pageData.siteId];
		const repoPath = ctx.meta.owner && ctx.meta.repo ? `/${ctx.meta.owner}/${ctx.meta.repo}` : "";
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
		const tabs = popup.querySelectorAll(".dv-popup-tab");
		const contents = popup.querySelectorAll(".dv-popup-tab-content");
		const saveBtn = popup.querySelector(".dv-popup-save");
		const errEl = popup.querySelector(".dv-popup-err");
		const closeBtn = popup.querySelector(".dv-popup-close");
		let currentTab = action.tab;
		function setTab(tab) {
			currentTab = tab;
			tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
			contents.forEach((c) => c.classList.toggle("active", c.dataset.content === tab));
			saveBtn.textContent = {
				resource: "Save Page",
				note: "Save Note",
				prompt: "Save Prompt"
			}[tab] || "Save";
		}
		tabs.forEach((t) => t.onclick = () => setTab(t.dataset.tab || "resource"));
		closeBtn.onclick = () => popup.remove();
		setTab(action.tab);
		const getVal = (key) => popup.querySelector(`[data-${key}]`)?.value || "";
		saveBtn.onclick = async () => {
			saveBtn.textContent = "Saving...";
			saveBtn.disabled = true;
			errEl.style.display = "none";
			try {
				const msgType = currentTab === "resource" ? "saveInlineResource" : currentTab === "note" ? "saveInlineNote" : "saveInlinePrompt";
				const payload = currentTab === "resource" ? {
					url: pageData.url,
					title: pageData.title,
					description: pageData.description,
					selectedText: selText,
					reason: getVal("reason"),
					siteType: pageData.siteId
				} : currentTab === "note" ? {
					content: selText ? `${selText}\n\n${getVal("note")}` : getVal("note"),
					title: `Selection from ${pageData.title}`
				} : {
					prompt: selText ? `${selText}\n\n${getVal("prompt")}` : getVal("prompt"),
					sourceUrl: pageData.url
				};
				const res = await chrome.runtime.sendMessage({
					type: msgType,
					payload
				});
				if (res.success) {
					popup.remove();
					showToast$1(currentTab === "resource" ? "Page saved!" : currentTab === "note" ? "Note saved!" : "Prompt saved!");
				} else {
					errEl.textContent = res.error || "Failed";
					errEl.style.display = "block";
					saveBtn.textContent = currentTab === "resource" ? "Save Page" : currentTab === "note" ? "Save Note" : "Save Prompt";
					saveBtn.disabled = false;
				}
			} catch (e) {
				console.error("Devventory save error:", e);
				errEl.textContent = "Could not connect";
				errEl.style.display = "block";
				saveBtn.textContent = currentTab === "resource" ? "Save Page" : currentTab === "note" ? "Save Note" : "Save Prompt";
				saveBtn.disabled = false;
			}
		};
		if (rect) {
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;
			const top = rect.top + scrollY + 16;
			popup.style.top = top + 300 < window.innerHeight + scrollY ? `${top}px` : `${rect.top + scrollY - 300}px`;
			popup.style.left = `${Math.min(rect.left + scrollX, window.innerWidth - 350 + scrollX)}px`;
		} else {
			popup.style.position = "fixed";
			popup.style.top = "50%";
			popup.style.left = "50%";
			popup.style.transform = "translate(-50%, -50%)";
		}
		document.body.appendChild(popup);
		popup.querySelector("textarea")?.focus();
	}
	function clearExisting() {
		document.querySelectorAll(".dv-popup, .dv-float-btn").forEach((e) => e.remove());
	}
	function showToast$1(message) {
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
			animation: "dv-toast-in 0.2s ease-out"
		});
		document.body.appendChild(el);
		setTimeout(() => el.remove(), 2500);
	}
	function escapeHtml(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}
	var SITE_LABELS;
	var init_popup = __esmMin((() => {
		init_ui();
		SITE_LABELS = {
			"github-repo": "GitHub Repo",
			"github-file": "File",
			"github-pr": "PR",
			"github-issue": "Issue",
			youtube: "YouTube",
			mdn: "MDN",
			stackoverflow: "Stack Overflow",
			docs: "Docs",
			blog: "Blog",
			article: "Article"
		};
	}));
	//#endregion
	//#region providers/github.ts
	init_ui();
	var githubProvider = {
		id: "github-repo",
		label: "GitHub",
		detect() {
			const { hostname, pathname } = window.location;
			if (hostname !== "github.com") return null;
			const parts = pathname.split("/").filter(Boolean);
			if (parts.length < 2) return null;
			const [owner, repo] = parts;
			const pageType = parts.length === 2 ? "github-repo" : parts[2] === "pull" ? "github-pr" : parts[2] === "issues" ? "github-issue" : parts.length > 2 ? "github-file" : "github-repo";
			const starEl = document.querySelector("[data-testid='stargazers-count']");
			const meta = {
				owner,
				repo,
				stars: starEl ? parseInt(starEl.textContent?.replace(/,/g, "") || "0", 10) || void 0 : void 0,
				language: document.querySelector("[itemprop='programmingLanguage']")?.textContent || void 0,
				description: document.querySelector("p.f4.mt-3, [data-testid='repo-description']")?.textContent?.trim() || ""
			};
			return {
				id: pageType,
				label: `${owner}/${repo}`,
				meta,
				pageData: {
					...getSiteMeta(),
					siteId: pageType
				}
			};
		},
		getActions(ctx) {
			const isRepo = ctx.id === "github-repo";
			return [
				{
					id: "save-repo",
					label: ctx.id === "github-file" ? "Save File" : "Save Repository",
					description: isRepo ? "Save repo with AI summary" : "Save this file",
					icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm4 4h6v6H9V9z",
					tab: "resource",
					payload: { siteType: ctx.id }
				},
				...isRepo ? [
					{
						id: "ai-summary",
						label: "AI Summary",
						description: "Generate repo overview",
						icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
						tab: "note"
					},
					{
						id: "tech-stack",
						label: "Tech Stack",
						description: "Detect technologies used",
						icon: "M22 12h-4l-3 9L9 3l-3 9H2",
						tab: "note"
					},
					{
						id: "learning-path",
						label: "Learning Roadmap",
						description: "Generate study plan",
						icon: "M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4",
						tab: "note"
					}
				] : [],
				{
					id: "save-readme",
					label: "Save README",
					description: "Save as note",
					icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
					tab: "note"
				},
				{
					id: "related-notes",
					label: "Related Notes",
					description: "Find in your vault",
					icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
					tab: "resource"
				}
			];
		},
		getChipAnchor() {
			return document.querySelector("h1 strong a, [data-testid='repo-title'] a, [data-testid='repository-title'] a, .repository-content h1") || document.querySelector("h1") || null;
		},
		mountUI(ctx) {
			const anchor = this.getChipAnchor?.();
			if (!anchor) return () => {};
			const chip = createChip("M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6zM8 14v1a4 4 0 0 0 8 0v-1", "Devventory");
			chip.onclick = () => {
				showMenu(chip, this.getActions(ctx), (action) => {
					Promise.resolve().then(() => (init_popup(), popup_exports)).then((m) => m.openPopup(action, ctx));
				});
			};
			anchor.parentElement?.insertBefore(chip, anchor.nextSibling);
			chip.style.marginLeft = "8px";
			return () => chip.remove();
		}
	};
	//#endregion
	//#region providers/youtube.ts
	init_ui();
	var youtubeProvider = {
		id: "youtube",
		label: "YouTube",
		detect() {
			const { hostname } = window.location;
			if (![
				"www.youtube.com",
				"youtube.com",
				"youtu.be"
			].includes(hostname)) return null;
			const v = new URL(window.location.href).searchParams.get("v");
			if (!v) return null;
			const channel = document.querySelector("#owner #channel-name, yt-formatted-string.ytd-channel-name")?.textContent?.trim() || void 0;
			return {
				id: "youtube",
				label: (document.querySelector("#above-the-fold #title h1") || document.querySelector("h1"))?.textContent?.trim() || "YouTube Video",
				meta: {
					videoId: v,
					channel
				},
				pageData: {
					...getSiteMeta(),
					siteId: "youtube"
				}
			};
		},
		getActions() {
			return [
				{
					id: "ai-summary",
					label: "AI Summary",
					description: "Summarize this video",
					icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
					tab: "note"
				},
				{
					id: "key-learnings",
					label: "Key Learnings",
					description: "Extract main points",
					icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
					tab: "note"
				},
				{
					id: "save-transcript",
					label: "Save Transcript",
					description: "Save full transcript",
					icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
					tab: "note"
				},
				{
					id: "save-video",
					label: "Save Video",
					description: "Save as resource",
					icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
					tab: "resource"
				},
				{
					id: "flashcards",
					label: "Create Flashcards",
					description: "Generate study cards",
					icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
					tab: "note"
				}
			];
		},
		getChipAnchor() {
			return document.querySelector("#above-the-fold #title h1") || document.querySelector("#title h1") || document.querySelector("h1.ytd-video-primary-info-renderer") || document.querySelector("h1") || null;
		},
		mountUI(ctx) {
			const anchor = this.getChipAnchor?.();
			if (!anchor) return () => {};
			const chip = createChip("M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6zM8 14v1a4 4 0 0 0 8 0v-1", "Devventory");
			chip.onclick = () => {
				showMenu(chip, this.getActions(ctx), (action) => {
					Promise.resolve().then(() => (init_popup(), popup_exports)).then((m) => m.openPopup(action, ctx));
				});
			};
			anchor.parentElement?.insertBefore(chip, anchor.nextSibling);
			chip.style.marginLeft = "8px";
			chip.style.verticalAlign = "middle";
			return () => chip.remove();
		}
	};
	//#endregion
	//#region providers/docs.ts
	init_ui();
	var DOC_SITES = [
		"developer.mozilla.org",
		"react.dev",
		"nextjs.org",
		"nuxt.com",
		"svelte.dev",
		"vuejs.org",
		"angular.dev",
		"prisma.io",
		"trpc.io",
		"tailwindcss.com",
		"vite.dev",
		"astro.build",
		"python.org",
		"langchain.com",
		"platform.openai.com"
	];
	function isDocSite(hostname) {
		return DOC_SITES.some((s) => hostname.endsWith(s) || hostname === s) || hostname.endsWith(".dev") || hostname.endsWith(".docs") || window.location.pathname.startsWith("/docs");
	}
	//#endregion
	//#region context-engine/index.ts
	var providers = [
		githubProvider,
		youtubeProvider,
		{
			id: "docs",
			label: "Docs",
			detect() {
				const { hostname } = window.location;
				if (!isDocSite(hostname)) return null;
				return {
					id: "docs",
					label: document.querySelector("h1")?.textContent?.trim() || document.title,
					meta: { framework: DOC_SITES.find((s) => hostname.endsWith(s) || hostname === s) || hostname },
					pageData: {
						...getSiteMeta(),
						siteId: "docs"
					}
				};
			},
			getActions(ctx) {
				return [
					{
						id: "explain",
						label: "Explain This Page",
						description: "AI explanation",
						icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
						tab: "note"
					},
					{
						id: "save-page",
						label: "Save Page",
						description: "Save as resource",
						icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
						tab: "resource"
					},
					{
						id: "cheatsheet",
						label: "Generate Cheatsheet",
						description: "Create quick reference",
						icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
						tab: "note"
					},
					{
						id: "save-api",
						label: "Save API Reference",
						description: "Save key API details",
						icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
						tab: "note"
					}
				];
			},
			getChipAnchor() {
				return document.querySelector("h1") || null;
			},
			mountUI(ctx) {
				const anchor = this.getChipAnchor?.();
				if (!anchor) return () => {};
				const chip = createChip("M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6zM8 14v1a4 4 0 0 0 8 0v-1", "Devventory");
				chip.onclick = () => {
					showMenu(chip, this.getActions(ctx), (action) => {
						Promise.resolve().then(() => (init_popup(), popup_exports)).then((m) => m.openPopup(action, ctx));
					});
				};
				anchor.parentElement?.insertBefore(chip, anchor.nextSibling);
				chip.style.marginLeft = "8px";
				return () => chip.remove();
			}
		},
		{
			id: "generic",
			label: "Page",
			detect() {
				return {
					id: "generic",
					label: document.title || window.location.hostname,
					meta: {},
					pageData: {
						...getSiteMeta(),
						siteId: "generic"
					}
				};
			},
			getActions() {
				return [
					{
						id: "save-page",
						label: "Save Page",
						description: "Save as resource",
						icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
						tab: "resource"
					},
					{
						id: "save-note",
						label: "Save Note",
						description: "Write a quick note",
						icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",
						tab: "note"
					},
					{
						id: "ai-summary",
						label: "AI Summary",
						description: "Summarize this page",
						icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
						tab: "note"
					}
				];
			},
			mountUI() {
				return () => {};
			}
		}
	];
	var activeCleanup = null;
	var lastUrl = "";
	function runDetection() {
		for (const p of providers) {
			const ctx = p.detect();
			if (ctx) return {
				provider: p,
				ctx
			};
		}
		return null;
	}
	function mount() {
		if (activeCleanup) {
			activeCleanup();
			activeCleanup = null;
		}
		const result = runDetection();
		if (!result) return;
		if (result.provider.id === "generic") return;
		if (!result.provider.getChipAnchor?.()) {
			[
				1e3,
				2e3,
				3e3,
				5e3,
				8e3
			].forEach((delay) => {
				setTimeout(() => {
					if (activeCleanup) return;
					if (result.provider.getChipAnchor?.()) mount();
				}, delay);
			});
			return;
		}
		activeCleanup = result.provider.mountUI(result.ctx);
	}
	var observer = null;
	function mountContextUI() {
		lastUrl = window.location.href;
		const result = runDetection();
		if (result && result.provider.id !== "generic") {
			mount();
			observer = new MutationObserver(() => {
				if (window.location.href !== lastUrl) {
					lastUrl = window.location.href;
					setTimeout(mount, 600);
				}
			});
			observer.observe(document.body || document, {
				childList: true,
				subtree: true
			});
			document.addEventListener("yt-navigate-finish", () => {
				setTimeout(mount, 600);
			});
		}
		return () => {
			observer?.disconnect();
			observer = null;
			activeCleanup?.();
			activeCleanup = null;
		};
	}
	function getContext() {
		return runDetection()?.ctx || null;
	}
	//#endregion
	//#region entrypoints/content.ts
	init_ui();
	init_popup();
	var floatBtn = null;
	function clearFloat() {
		floatBtn?.remove();
		floatBtn = null;
	}
	function getSelRect() {
		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
		const r = sel.getRangeAt(0).getBoundingClientRect();
		return r.width === 0 && r.height === 0 ? null : r;
	}
	function onMouseUp(e) {
		if (e.target?.closest?.(".dv-float, .dv-chip, .dv-menu")) return;
		const rect = getSelRect();
		rect ? showFloatBtn(rect) : clearFloat();
	}
	function showFloatBtn(rect) {
		if (document.querySelector(".dv-popup")) return;
		if (!floatBtn) {
			injectBaseStyles();
			floatBtn = document.createElement("button");
			floatBtn.className = "dv-float dv-float-btn";
			floatBtn.innerHTML = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"/><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"/></svg>";
			floatBtn.title = "Save to Devventory";
			floatBtn.onclick = () => {
				clearFloat();
				const ctx = getContext();
				const hasSel = !!(window.getSelection()?.toString() || "");
				openPopup({
					id: hasSel ? "save-note" : "save-page",
					label: hasSel ? "Save Selection" : "Save Page",
					description: "",
					icon: "",
					tab: hasSel ? "note" : "resource"
				}, ctx || {
					id: "generic",
					label: document.title,
					meta: {},
					pageData: {
						...getSiteMeta(),
						siteId: "generic"
					}
				}, rect);
			};
			document.body.appendChild(floatBtn);
		}
		const scrollX = window.scrollX, scrollY = window.scrollY;
		floatBtn.style.left = Math.min(rect.right + scrollX - 7, window.innerWidth - 40) + "px";
		floatBtn.style.top = Math.max(rect.top + scrollY - 14, scrollY + 8) + "px";
	}
	var content_default = defineContentScript({
		matches: [
			"*://github.com/*",
			"*://www.youtube.com/*",
			"*://youtu.be/*",
			"*://developer.mozilla.org/*",
			"*://react.dev/*",
			"*://nextjs.org/*",
			"*://tailwindcss.com/*",
			"*://svelte.dev/*"
		],
		main() {
			const unmount = mountContextUI();
			document.addEventListener("mouseup", onMouseUp);
			document.addEventListener("mousedown", (e) => {
				if (!e.target?.closest?.(".dv-float, .dv-chip, .dv-menu")) clearFloat();
			});
			document.addEventListener("scroll", clearFloat, true);
			chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
				if (msg.type === "getPageData") sendResponse(getSiteMeta());
				if (msg.type === "showToast") {
					showToast(msg.message);
					sendResponse(true);
				}
				if (msg.type === "showInlinePopup") {
					injectBaseStyles();
					const ctx = getContext();
					const selText = window.getSelection()?.toString() || "";
					openPopup({
						id: "save-page",
						label: ctx?.label || document.title,
						description: "",
						icon: "",
						tab: selText ? "note" : "resource"
					}, ctx || {
						id: "generic",
						label: document.title,
						meta: {},
						pageData: {
							...getSiteMeta(),
							siteId: "generic"
						}
					}, null);
					sendResponse(true);
				}
			});
			return () => {
				unmount();
				clearFloat();
			};
		}
	});
	function showToast(message) {
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
			animation: "dv-toast-in 0.2s ease-out"
		});
		document.body.appendChild(el);
		setTimeout(() => el.remove(), 2500);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.27_@types+node@20.19.43_eslint@9.39.4_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.3/node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?/home/krishna/Desktop/dev-second-brain/apps/extension/entrypoints/content.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	//#endregion
	return (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyMC4xOS40M19lc2xpbnRAOS4zOS40X2ppdGlAMi43LjBfX2ppdGlAMi43LjBfcm9sbGRvd25AMS4xLjMvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YS50cyIsIi4uLy4uLy4uL2NvbnRleHQtZW5naW5lL3VpLnRzIiwiLi4vLi4vLi4vY29udGV4dC1lbmdpbmUvcG9wdXAudHMiLCIuLi8uLi8uLi9wcm92aWRlcnMvZ2l0aHViLnRzIiwiLi4vLi4vLi4vcHJvdmlkZXJzL3lvdXR1YmUudHMiLCIuLi8uLi8uLi9wcm92aWRlcnMvZG9jcy50cyIsIi4uLy4uLy4uL3Byb3ZpZGVycy9nZW5lcmljLnRzIiwiLi4vLi4vLi4vY29udGV4dC1lbmdpbmUvaW5kZXgudHMiLCIuLi8uLi8uLi9lbnRyeXBvaW50cy9jb250ZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI3X0B0eXBlcytub2RlQDIwLjE5LjQzX2VzbGludEA5LjM5LjRfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuMy9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ad3h0LWRlditicm93c2VyQDAuMi4wL25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjAuMTkuNDNfZXNsaW50QDkuMzkuNF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS4zL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyMC4xOS40M19lc2xpbnRAOS4zOS40X2ppdGlAMi43LjBfX2ppdGlAMi43LjBfcm9sbGRvd25AMS4xLjMvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI3X0B0eXBlcytub2RlQDIwLjE5LjQzX2VzbGludEA5LjM5LjRfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuMy9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjAuMTkuNDNfZXNsaW50QDkuMzkuNF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS4zL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG5cdHJldHVybiBkZWZpbml0aW9uO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVDb250ZW50U2NyaXB0IH07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0TWV0YShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgYG1ldGFbbmFtZT1cIiR7bmFtZX1cIl0sIG1ldGFbcHJvcGVydHk9XCJvZzoke25hbWV9XCJdLCBtZXRhW25hbWU9XCJ0d2l0dGVyOiR7bmFtZX1cIl1gLFxuICApO1xuICByZXR1cm4gKGVsIGFzIEhUTUxNZXRhRWxlbWVudCk/LmNvbnRlbnQgfHwgXCJcIjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNpdGVNZXRhKCkge1xuICByZXR1cm4ge1xuICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgaG9zdG5hbWU6IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICB0aXRsZTogZ2V0TWV0YShcInRpdGxlXCIpIHx8IGRvY3VtZW50LnRpdGxlLFxuICAgIGRlc2NyaXB0aW9uOiBnZXRNZXRhKFwiZGVzY3JpcHRpb25cIikgfHwgXCJcIixcbiAgICBmYXZpY29uOlxuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsaW5rW3JlbH49J2ljb24nXVwiKSBhcyBIVE1MTGlua0VsZW1lbnQpPy5ocmVmIHx8XG4gICAgICBcIi9mYXZpY29uLmljb1wiLFxuICAgIHNpdGVOYW1lOiBnZXRNZXRhKFwic2l0ZV9uYW1lXCIpIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICBvZ0ltYWdlOiBnZXRNZXRhKFwiaW1hZ2VcIikgfHwgXCJcIixcbiAgICBzZWxlY3RlZFRleHQ6IHdpbmRvdy5nZXRTZWxlY3Rpb24oKT8udG9TdHJpbmcoKSB8fCBcIlwiLFxuICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBBY3Rpb24gfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5sZXQgaW5qZWN0ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEJhc2VTdHlsZXMoKSB7XG4gIGlmIChpbmplY3RlZCkgcmV0dXJuO1xuICBpbmplY3RlZCA9IHRydWU7XG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBzdHlsZS50ZXh0Q29udGVudCA9IGBcbiAgICBAa2V5ZnJhbWVzIGR2LXRvYXN0LWlue2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDhweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfX1cbiAgICBAa2V5ZnJhbWVzIGR2LXBvcHtmcm9te29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoMC43KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnNjYWxlKDEpfX1cbiAgICBAa2V5ZnJhbWVzIGR2LXNsaWRle2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC00cHgpfXRve29wYWNpdHk6MTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX19XG5cbiAgICAvKiBDaGlwIOKAlCBzbWFsbCBwaWxsIHdpdGggb3duIHZhcnMgKEJyYXZlIFNoaWVsZHMgc3RyaXBzIDpyb290IGN1c3RvbSBwcm9wcykgKi9cbiAgICAuZHYtY2hpcHstLWR2LWFjY2VudDojNjM2NmYxOy0tZHYtYmc6I2ZmZjstLWR2LWZnOiMxYTFhMWE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiNlNGU0ZTc7LS1kdi1jYXJkOiNmNGY0ZjU7ZGlzcGxheTppbmxpbmUtZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjRweDtwYWRkaW5nOjJweCA4cHggMnB4IDZweDtib3JkZXItcmFkaXVzOjZweDtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWR2LWJvcmRlcik7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Y29sb3I6dmFyKC0tZHYtYWNjZW50KTtmb250LXNpemU6MTFweDtmb250LXdlaWdodDo1MDA7Y3Vyc29yOnBvaW50ZXI7Zm9udC1mYW1pbHk6LWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsXCJTZWdvZSBVSVwiLFJvYm90byxzYW5zLXNlcmlmO3RyYW5zaXRpb246YWxsIDAuMTVzO3doaXRlLXNwYWNlOm5vd3JhcDt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bGluZS1oZWlnaHQ6bm9ybWFsO2JveC1zaGFkb3c6bm9uZTt1c2VyLXNlbGVjdDpub25lfVxuICAgIEBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXsuZHYtY2hpcHstLWR2LWFjY2VudDojODE4Y2Y4Oy0tZHYtYmc6IzBhMGEwYTstLWR2LWZnOiNmYWZhZmE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiMyNzI3MmE7LS1kdi1jYXJkOiMxODE4MWJ9fVxuICAgIC5kdi1jaGlwOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCk7Ym9yZGVyLWNvbG9yOnZhcigtLWR2LWFjY2VudCk7Ym94LXNoYWRvdzowIDFweCA0cHggcmdiYSgwLDAsMCwwLjA4KX1cbiAgICAuZHYtY2hpcCBzdmd7d2lkdGg6MTJweDtoZWlnaHQ6MTJweDtmbGV4LXNocmluazowfVxuXG4gICAgLyogQWN0aW9uIG1lbnUg4oCUIHNtYWxsIGRyb3Bkb3duIGJlbG93IGNoaXAgKi9cbiAgICAuZHYtbWVudXstLWR2LWFjY2VudDojNjM2NmYxOy0tZHYtYmc6I2ZmZjstLWR2LWZnOiMxYTFhMWE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiNlNGU0ZTc7LS1kdi1jYXJkOiNmNGY0ZjU7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoyMTQ3NDgzNjQ2O2JhY2tncm91bmQ6dmFyKC0tZHYtYmcpO2JvcmRlcjoxcHggc29saWQgdmFyKC0tZHYtYm9yZGVyKTtib3JkZXItcmFkaXVzOjhweDtib3gtc2hhZG93OjAgNHB4IDE2cHggcmdiYSgwLDAsMCwwLjEyKTtwYWRkaW5nOjRweDttaW4td2lkdGg6MTgwcHg7YW5pbWF0aW9uOmR2LXNsaWRlIDAuMTJzIGN1YmljLWJlemllcigwLjE2LDEsMC4zLDEpO2ZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LFwiU2Vnb2UgVUlcIixSb2JvdG8sc2Fucy1zZXJpZn1cbiAgICBAbWVkaWEocHJlZmVycy1jb2xvci1zY2hlbWU6ZGFyayl7LmR2LW1lbnV7LS1kdi1hY2NlbnQ6IzgxOGNmODstLWR2LWJnOiMwYTBhMGE7LS1kdi1mZzojZmFmYWZhOy0tZHYtbXV0ZWQ6IzhhOTI5OTstLWR2LWJvcmRlcjojMjcyNzJhOy0tZHYtY2FyZDojMTgxODFifX1cbiAgICAuZHYtbWVudS1pdGVte2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjZweCA4cHg7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDpub25lO2N1cnNvcjpwb2ludGVyO2ZvbnQtc2l6ZToxMXB4O2NvbG9yOnZhcigtLWR2LWZnKTtib3JkZXItcmFkaXVzOjVweDt3aWR0aDoxMDAlO3RleHQtYWxpZ246bGVmdDt0cmFuc2l0aW9uOmJhY2tncm91bmQgMC4xc31cbiAgICAuZHYtbWVudS1pdGVtOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCl9XG4gICAgLmR2LW1lbnUtaXRlbSBzdmd7d2lkdGg6MTNweDtoZWlnaHQ6MTNweDtjb2xvcjp2YXIoLS1kdi1hY2NlbnQpO2ZsZXgtc2hyaW5rOjB9XG4gICAgLmR2LW1lbnUtaXRlbSBzcGFue2ZsZXg6MX1cbiAgICAuZHYtbWVudS1pdGVtIHNtYWxse2NvbG9yOnZhcigtLWR2LW11dGVkKTtmb250LXNpemU6MTBweH1cblxuICAgIC8qIElubGluZSBwb3B1cCAocmV1c2VkIGZyb20gY29udGVudCkgKi9cbiAgICAuZHYtZmxvYXR7Zm9udC1mYW1pbHk6LWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsXCJTZWdvZSBVSVwiLFJvYm90byxzYW5zLXNlcmlmO2JveC1zaXppbmc6Ym9yZGVyLWJveDt6LWluZGV4OjIxNDc0ODM2NDY7LS1kdi1hY2NlbnQ6IzYzNjZmMTstLWR2LWJnOiNmZmY7LS1kdi1mZzojMWExYTFhOy0tZHYtbXV0ZWQ6IzhhOTI5OTstLWR2LWJvcmRlcjojZTRlNGU3Oy0tZHYtY2FyZDojZjRmNGY1fVxuICAgIEBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXsuZHYtZmxvYXR7LS1kdi1hY2NlbnQ6IzgxOGNmODstLWR2LWJnOiMwYTBhMGE7LS1kdi1mZzojZmFmYWZhOy0tZHYtbXV0ZWQ6IzhhOTI5OTstLWR2LWJvcmRlcjojMjcyNzJhOy0tZHYtY2FyZDojMTgxODFifX1cbiAgICAuZHYtZmxvYXQtYnRue3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjI4cHg7aGVpZ2h0OjI4cHg7Ym9yZGVyLXJhZGl1czo1MCU7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kdi1ib3JkZXIpO2JhY2tncm91bmQ6dmFyKC0tZHYtYmcpO2NvbG9yOnZhcigtLWR2LWFjY2VudCk7Y3Vyc29yOnBvaW50ZXI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JveC1zaGFkb3c6MCAycHggOHB4IHJnYmEoMCwwLDAsMC4xKTtwYWRkaW5nOjA7YW5pbWF0aW9uOmR2LXBvcCAwLjE1cyBjdWJpYy1iZXppZXIoMC4xNiwxLDAuMywxKX1cbiAgICAuZHYtZmxvYXQtYnRuOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCk7dHJhbnNmb3JtOnNjYWxlKDEuMSl9XG4gICAgLmR2LXBvcHVwe3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOjM0MHB4O2JhY2tncm91bmQ6dmFyKC0tZHYtYmcpO2JvcmRlcjoxcHggc29saWQgdmFyKC0tZHYtYm9yZGVyKTtib3JkZXItcmFkaXVzOjEycHg7Ym94LXNoYWRvdzowIDhweCAzMnB4IHJnYmEoMCwwLDAsMC4xNSk7b3ZlcmZsb3c6aGlkZGVuO2FuaW1hdGlvbjpkdi1wb3AgMC4xNXMgY3ViaWMtYmV6aWVyKDAuMTYsMSwwLjMsMSl9XG4gICAgLmR2LXBvcHVwLWhkcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzo4cHggMTJweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS1kdi1ib3JkZXIpfVxuICAgIC5kdi1wb3B1cC10aXRsZXtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo2MDA7ZmxleDoxO2NvbG9yOnZhcigtLWR2LWZnKX1cbiAgICAuZHYtcG9wdXAtY2xvc2V7YmFja2dyb3VuZDpub25lO2JvcmRlcjpub25lO2N1cnNvcjpwb2ludGVyO2NvbG9yOnZhcigtLWR2LW11dGVkKTtwYWRkaW5nOjJweCA0cHg7Zm9udC1zaXplOjE0cHg7Ym9yZGVyLXJhZGl1czo0cHh9XG4gICAgLmR2LXBvcHVwLWNsb3NlOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCk7Y29sb3I6dmFyKC0tZHYtZmcpfVxuICAgIC5kdi1wb3B1cC1ib2R5e3BhZGRpbmc6OHB4IDEycHggMTBweH1cbiAgICAuZHYtcG9wdXAtdGFic3tkaXNwbGF5OmZsZXg7Z2FwOjRweDttYXJnaW4tYm90dG9tOjhweH1cbiAgICAuZHYtcG9wdXAtdGFie2ZsZXg6MTtwYWRkaW5nOjVweDtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOm5vbmU7Y3Vyc29yOnBvaW50ZXI7Zm9udC1zaXplOjExcHg7Zm9udC13ZWlnaHQ6NTAwO2NvbG9yOnZhcigtLWR2LW11dGVkKTtib3JkZXItcmFkaXVzOjVweDt0cmFuc2l0aW9uOmFsbCAwLjE1c31cbiAgICAuZHYtcG9wdXAtdGFiOmhvdmVye2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCl9XG4gICAgLmR2LXBvcHVwLXRhYi5hY3RpdmV7YmFja2dyb3VuZDp2YXIoLS1kdi1hY2NlbnQpO2NvbG9yOiNmZmZ9XG4gICAgLmR2LXBvcHVwLXRhYi1jb250ZW50e2Rpc3BsYXk6bm9uZX1cbiAgICAuZHYtcG9wdXAtdGFiLWNvbnRlbnQuYWN0aXZle2Rpc3BsYXk6YmxvY2s7YW5pbWF0aW9uOnBhbmVsLWluIDAuMTVzIGN1YmljLWJlemllcigwLjE2LDEsMC4zLDEpfVxuICAgIEBrZXlmcmFtZXMgcGFuZWwtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoM3B4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9fVxuICAgIC5kdi1wb3B1cC1jYXJke2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCk7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzo4cHggMTBweDttYXJnaW4tYm90dG9tOjhweH1cbiAgICAuZHYtcG9wdXAtY2FyZC1ib2R5e21pbi13aWR0aDowfVxuICAgIC5kdi1wb3B1cC1jYXJkLXRpdGxle2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjUwMDtsaW5lLWhlaWdodDoxLjM7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO2NvbG9yOnZhcigtLWR2LWZnKX1cbiAgICAuZHYtcG9wdXAtY2FyZC11cmx7Zm9udC1zaXplOjEwcHg7Y29sb3I6dmFyKC0tZHYtbXV0ZWQpO21hcmdpbi10b3A6MXB4O292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcH1cbiAgICAuZHYtcG9wdXAtYmFkZ2V7ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDo2MDA7cGFkZGluZzoxcHggNXB4O2JvcmRlci1yYWRpdXM6NHB4O2JhY2tncm91bmQ6dmFyKC0tZHYtYmcpO2NvbG9yOnZhcigtLWR2LW11dGVkKTttYXJnaW4tdG9wOjRweH1cbiAgICAuZHYtcG9wdXAtc2Vse2ZvbnQtc2l6ZToxMXB4O2NvbG9yOnZhcigtLWR2LW11dGVkKTtiYWNrZ3JvdW5kOnZhcigtLWR2LWNhcmQpO3BhZGRpbmc6NnB4IDhweDtib3JkZXItcmFkaXVzOjZweDttYXJnaW4tYm90dG9tOjhweDttYXgtaGVpZ2h0OjQ4cHg7b3ZlcmZsb3c6aGlkZGVuO2xpbmUtaGVpZ2h0OjEuNDtwb3NpdGlvbjpyZWxhdGl2ZX1cbiAgICAuZHYtcG9wdXAtc2VsOjphZnRlcntjb250ZW50OlwiXCI7cG9zaXRpb246YWJzb2x1dGU7Ym90dG9tOjA7bGVmdDowO3JpZ2h0OjA7aGVpZ2h0OjE2cHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsdmFyKC0tZHYtY2FyZCkpO3BvaW50ZXItZXZlbnRzOm5vbmV9XG4gICAgLmR2LXBvcHVwLWlucHV0e3dpZHRoOjEwMCU7cGFkZGluZzo3cHggOXB4O2JvcmRlcjoxcHggc29saWQgdmFyKC0tZHYtYm9yZGVyKTtib3JkZXItcmFkaXVzOjZweDtmb250LXNpemU6MTJweDtvdXRsaW5lOm5vbmU7Zm9udC1mYW1pbHk6aW5oZXJpdDtyZXNpemU6bm9uZTttaW4taGVpZ2h0OjM2cHg7Y29sb3I6dmFyKC0tZHYtZmcpO2JhY2tncm91bmQ6dmFyKC0tZHYtYmcpO2JveC1zaXppbmc6Ym9yZGVyLWJveH1cbiAgICAuZHYtcG9wdXAtaW5wdXQ6Zm9jdXN7Ym9yZGVyLWNvbG9yOnZhcigtLWR2LWFjY2VudCk7Ym94LXNoYWRvdzowIDAgMCAzcHggY29sb3ItbWl4KGluIHNyZ2IsdmFyKC0tZHYtYWNjZW50KSAxNSUsdHJhbnNwYXJlbnQpfVxuICAgIC5kdi1wb3B1cC1zYXZle3dpZHRoOjEwMCU7bWFyZ2luLXRvcDo4cHg7cGFkZGluZzo3cHg7YmFja2dyb3VuZDp2YXIoLS1kdi1hY2NlbnQpO2NvbG9yOiNmZmY7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo2cHg7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NTAwO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAwLjE1c31cbiAgICAuZHYtcG9wdXAtc2F2ZTpob3ZlcntvcGFjaXR5OjAuOX1cbiAgICAuZHYtcG9wdXAtc2F2ZTpkaXNhYmxlZHtvcGFjaXR5OjAuNDtjdXJzb3I6ZGVmYXVsdH1cbiAgICAuZHYtcG9wdXAtZXJye2NvbG9yOiNlZjQ0NDQ7Zm9udC1zaXplOjExcHg7cGFkZGluZzo0cHggMDttYXJnaW4tdG9wOjRweDtkaXNwbGF5Om5vbmV9XG4gIGA7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2hpcChpY29uOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjaGlwLmNsYXNzTmFtZSA9IFwiZHYtY2hpcFwiO1xuICBjaGlwLmlubmVySFRNTCA9IGA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiJHtpY29ufVwiLz48L3N2Zz4ke2xhYmVsfWA7XG4gIHJldHVybiBjaGlwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd01lbnUoXG4gIGFuY2hvcjogRWxlbWVudCxcbiAgYWN0aW9uczogQWN0aW9uW10sXG4gIG9uU2VsZWN0OiAoYWN0aW9uOiBBY3Rpb24pID0+IHZvaWQsXG4pIHtcbiAgY29uc3QgZXhpc3RpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmR2LW1lbnVcIik7XG4gIGlmIChleGlzdGluZykgZXhpc3RpbmcucmVtb3ZlKCk7XG5cbiAgY29uc3QgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG1lbnUuY2xhc3NOYW1lID0gXCJkdi1tZW51XCI7XG5cbiAgYWN0aW9ucy5mb3JFYWNoKChhKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgaXRlbS5jbGFzc05hbWUgPSBcImR2LW1lbnUtaXRlbVwiO1xuICAgIGl0ZW0uaW5uZXJIVE1MID0gYDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCIke2EuaWNvbn1cIi8+PC9zdmc+PHNwYW4+JHthLmxhYmVsfTwvc3Bhbj48c21hbGw+JHthLmRlc2NyaXB0aW9ufTwvc21hbGw+YDtcbiAgICBpdGVtLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1lbnUucmVtb3ZlKCk7XG4gICAgICBvblNlbGVjdChhKTtcbiAgICB9O1xuICAgIG1lbnUuYXBwZW5kQ2hpbGQoaXRlbSk7XG4gIH0pO1xuXG4gIGNvbnN0IHJlY3QgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIG1lbnUuc3R5bGUudG9wID0gYCR7cmVjdC5ib3R0b20gKyB3aW5kb3cuc2Nyb2xsWSArIDR9cHhgO1xuICBtZW51LnN0eWxlLmxlZnQgPSBgJHtNYXRoLm1pbihyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCwgd2luZG93LmlubmVyV2lkdGggLSAyMDApfXB4YDtcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lbnUpO1xuXG4gIGNvbnN0IGNsb3NlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoIW1lbnUuY29udGFpbnMoZS50YXJnZXQgYXMgTm9kZSkgJiYgZS50YXJnZXQgIT09IGFuY2hvcikge1xuICAgICAgbWVudS5yZW1vdmUoKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgY2xvc2UpO1xuICAgIH1cbiAgfTtcbiAgc2V0VGltZW91dCgoKSA9PiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsb3NlKSwgMCk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEFjdGlvbiwgQ29udGV4dCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTaXRlTWV0YSB9IGZyb20gXCIuL21ldGFkYXRhXCI7XG5pbXBvcnQgeyBpbmplY3RCYXNlU3R5bGVzIH0gZnJvbSBcIi4vdWlcIjtcblxuY29uc3QgU0lURV9MQUJFTFM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIFwiZ2l0aHViLXJlcG9cIjogXCJHaXRIdWIgUmVwb1wiLFxuICBcImdpdGh1Yi1maWxlXCI6IFwiRmlsZVwiLFxuICBcImdpdGh1Yi1wclwiOiBcIlBSXCIsXG4gIFwiZ2l0aHViLWlzc3VlXCI6IFwiSXNzdWVcIixcbiAgeW91dHViZTogXCJZb3VUdWJlXCIsXG4gIG1kbjogXCJNRE5cIixcbiAgc3RhY2tvdmVyZmxvdzogXCJTdGFjayBPdmVyZmxvd1wiLFxuICBkb2NzOiBcIkRvY3NcIixcbiAgYmxvZzogXCJCbG9nXCIsXG4gIGFydGljbGU6IFwiQXJ0aWNsZVwiLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5Qb3B1cChhY3Rpb246IEFjdGlvbiwgY3R4OiBDb250ZXh0LCByZWN0PzogRE9NUmVjdCB8IG51bGwpIHtcbiAgaW5qZWN0QmFzZVN0eWxlcygpO1xuICBjbGVhckV4aXN0aW5nKCk7XG5cbiAgY29uc3QgcGFnZURhdGEgPSBjdHgucGFnZURhdGE7XG4gIGNvbnN0IHNlbFRleHQgPSBwYWdlRGF0YS5zZWxlY3RlZFRleHQgfHwgXCJcIjtcbiAgY29uc3QgYmFkZ2UgPSBwYWdlRGF0YS5zaXRlSWQgJiYgU0lURV9MQUJFTFNbcGFnZURhdGEuc2l0ZUlkXTtcbiAgY29uc3QgcmVwb1BhdGggPVxuICAgIGN0eC5tZXRhLm93bmVyICYmIGN0eC5tZXRhLnJlcG9cbiAgICAgID8gYC8ke2N0eC5tZXRhLm93bmVyfS8ke2N0eC5tZXRhLnJlcG99YFxuICAgICAgOiBcIlwiO1xuXG4gIGNvbnN0IHBvcHVwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgcG9wdXAuY2xhc3NOYW1lID0gXCJkdi1mbG9hdCBkdi1wb3B1cFwiO1xuXG4gIHBvcHVwLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtaGRyXCI+XG4gICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWR2LWFjY2VudClcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAzYTYgNiAwIDAgMC02IDZ2MWgxMlY5YTYgNiAwIDAgMC02LTZ6XCIvPjxwYXRoIGQ9XCJNOCAxNHYxYTQgNCAwIDAgMCA4IDB2LTFcIi8+PC9zdmc+XG4gICAgICA8c3BhbiBjbGFzcz1cImR2LXBvcHVwLXRpdGxlXCI+RGV2dmVudG9yeTwvc3Bhbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJkdi1wb3B1cC1jbG9zZVwiPuKclTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkdi1wb3B1cC1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtdGFic1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZHYtcG9wdXAtdGFiXCIgZGF0YS10YWI9XCJyZXNvdXJjZVwiPlNhdmUgUGFnZTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZHYtcG9wdXAtdGFiXCIgZGF0YS10YWI9XCJub3RlXCI+Tm90ZTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZHYtcG9wdXAtdGFiXCIgZGF0YS10YWI9XCJwcm9tcHRcIj5Qcm9tcHQ8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImR2LXBvcHVwLXRhYi1jb250ZW50XCIgZGF0YS1jb250ZW50PVwicmVzb3VyY2VcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImR2LXBvcHVwLWNhcmRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtY2FyZC1ib2R5XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtY2FyZC10aXRsZVwiPiR7ZXNjYXBlSHRtbChhY3Rpb24ubGFiZWwgPT09IGN0eC5sYWJlbCA/IHBhZ2VEYXRhLnRpdGxlIDogYWN0aW9uLmxhYmVsKX08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkdi1wb3B1cC1jYXJkLXVybFwiPiR7ZXNjYXBlSHRtbChwYWdlRGF0YS5ob3N0bmFtZSl9JHtlc2NhcGVIdG1sKHJlcG9QYXRoKX08L2Rpdj5cbiAgICAgICAgICAgICR7YmFkZ2UgPyBgPHNwYW4gY2xhc3M9XCJkdi1wb3B1cC1iYWRnZVwiPiR7YmFkZ2V9PC9zcGFuPmAgOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZHYtcG9wdXAtaW5wdXRcIiBkYXRhLXJlYXNvbiBwbGFjZWhvbGRlcj1cIldoeSBzYXZlIHRoaXM/XCIgcm93cz1cIjJcIj48L3RleHRhcmVhPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtdGFiLWNvbnRlbnRcIiBkYXRhLWNvbnRlbnQ9XCJub3RlXCI+XG4gICAgICAgICR7c2VsVGV4dCA/IGA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtc2VsXCI+JHtlc2NhcGVIdG1sKHNlbFRleHQuc2xpY2UoMCwgMzAwKSl9PC9kaXY+YCA6IFwiXCJ9XG4gICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImR2LXBvcHVwLWlucHV0XCIgZGF0YS1ub3RlIHBsYWNlaG9sZGVyPVwiVHlwZSBhIHF1aWNrIHRob3VnaHQuLi5cIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJkdi1wb3B1cC10YWItY29udGVudFwiIGRhdGEtY29udGVudD1cInByb21wdFwiPlxuICAgICAgICAke3NlbFRleHQgPyBgPGRpdiBjbGFzcz1cImR2LXBvcHVwLXNlbFwiPiR7ZXNjYXBlSHRtbChzZWxUZXh0LnNsaWNlKDAsIDMwMCkpfTwvZGl2PmAgOiBcIlwifVxuICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJkdi1wb3B1cC1pbnB1dFwiIGRhdGEtcHJvbXB0IHBsYWNlaG9sZGVyPVwiUGFzdGUgYSBwcm9tcHQuLi5cIiByb3dzPVwiM1wiPjwvdGV4dGFyZWE+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJkdi1wb3B1cC1zYXZlXCI+U2F2ZSBQYWdlPC9idXR0b24+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtZXJyXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICBjb25zdCB0YWJzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbChcIi5kdi1wb3B1cC10YWJcIikgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gIGNvbnN0IGNvbnRlbnRzID0gcG9wdXAucXVlcnlTZWxlY3RvckFsbChcIi5kdi1wb3B1cC10YWItY29udGVudFwiKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgY29uc3Qgc2F2ZUJ0biA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuZHYtcG9wdXAtc2F2ZVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgZXJyRWwgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwLWVyclwiKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgY2xvc2VCdG4gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwLWNsb3NlXCIpIGFzIEhUTUxFbGVtZW50O1xuXG4gIGxldCBjdXJyZW50VGFiID0gYWN0aW9uLnRhYjtcblxuICBmdW5jdGlvbiBzZXRUYWIodGFiOiBzdHJpbmcpIHtcbiAgICBjdXJyZW50VGFiID0gdGFiO1xuICAgIHRhYnMuZm9yRWFjaCgodCkgPT4gdC5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIsIHQuZGF0YXNldC50YWIgPT09IHRhYikpO1xuICAgIGNvbnRlbnRzLmZvckVhY2goKGMpID0+IGMuY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiLCBjLmRhdGFzZXQuY29udGVudCA9PT0gdGFiKSk7XG4gICAgY29uc3QgbGFiZWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyByZXNvdXJjZTogXCJTYXZlIFBhZ2VcIiwgbm90ZTogXCJTYXZlIE5vdGVcIiwgcHJvbXB0OiBcIlNhdmUgUHJvbXB0XCIgfTtcbiAgICBzYXZlQnRuLnRleHRDb250ZW50ID0gbGFiZWxzW3RhYl0gfHwgXCJTYXZlXCI7XG4gIH1cblxuICB0YWJzLmZvckVhY2goKHQpID0+IHQub25jbGljayA9ICgpID0+IHNldFRhYih0LmRhdGFzZXQudGFiIHx8IFwicmVzb3VyY2VcIikpO1xuICBjbG9zZUJ0bi5vbmNsaWNrID0gKCkgPT4gcG9wdXAucmVtb3ZlKCk7XG4gIHNldFRhYihhY3Rpb24udGFiKTtcblxuICBjb25zdCBnZXRWYWwgPSAoa2V5OiBzdHJpbmcpID0+XG4gICAgKHBvcHVwLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLSR7a2V5fV1gKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KT8udmFsdWUgfHwgXCJcIjtcblxuICBzYXZlQnRuLm9uY2xpY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgc2F2ZUJ0bi50ZXh0Q29udGVudCA9IFwiU2F2aW5nLi4uXCI7XG4gICAgKHNhdmVCdG4gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBlcnJFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgbXNnVHlwZSA9IGN1cnJlbnRUYWIgPT09IFwicmVzb3VyY2VcIiA/IFwic2F2ZUlubGluZVJlc291cmNlXCJcbiAgICAgICAgOiBjdXJyZW50VGFiID09PSBcIm5vdGVcIiA/IFwic2F2ZUlubGluZU5vdGVcIlxuICAgICAgICA6IFwic2F2ZUlubGluZVByb21wdFwiO1xuXG4gICAgICBjb25zdCBwYXlsb2FkOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9XG4gICAgICAgIGN1cnJlbnRUYWIgPT09IFwicmVzb3VyY2VcIlxuICAgICAgICAgID8geyB1cmw6IHBhZ2VEYXRhLnVybCwgdGl0bGU6IHBhZ2VEYXRhLnRpdGxlLCBkZXNjcmlwdGlvbjogcGFnZURhdGEuZGVzY3JpcHRpb24sIHNlbGVjdGVkVGV4dDogc2VsVGV4dCwgcmVhc29uOiBnZXRWYWwoXCJyZWFzb25cIiksIHNpdGVUeXBlOiBwYWdlRGF0YS5zaXRlSWQgfVxuICAgICAgICAgIDogY3VycmVudFRhYiA9PT0gXCJub3RlXCJcbiAgICAgICAgICAgID8geyBjb250ZW50OiBzZWxUZXh0ID8gYCR7c2VsVGV4dH1cXG5cXG4ke2dldFZhbChcIm5vdGVcIil9YCA6IGdldFZhbChcIm5vdGVcIiksIHRpdGxlOiBgU2VsZWN0aW9uIGZyb20gJHtwYWdlRGF0YS50aXRsZX1gIH1cbiAgICAgICAgICAgIDogeyBwcm9tcHQ6IHNlbFRleHQgPyBgJHtzZWxUZXh0fVxcblxcbiR7Z2V0VmFsKFwicHJvbXB0XCIpfWAgOiBnZXRWYWwoXCJwcm9tcHRcIiksIHNvdXJjZVVybDogcGFnZURhdGEudXJsIH07XG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogbXNnVHlwZSwgcGF5bG9hZCB9KSBhcyB7IHN1Y2Nlc3M/OiBib29sZWFuOyBlcnJvcj86IHN0cmluZyB9O1xuXG4gICAgICBpZiAocmVzLnN1Y2Nlc3MpIHtcbiAgICAgICAgcG9wdXAucmVtb3ZlKCk7XG4gICAgICAgIHNob3dUb2FzdChcbiAgICAgICAgICBjdXJyZW50VGFiID09PSBcInJlc291cmNlXCJcbiAgICAgICAgICAgID8gXCJQYWdlIHNhdmVkIVwiXG4gICAgICAgICAgICA6IGN1cnJlbnRUYWIgPT09IFwibm90ZVwiXG4gICAgICAgICAgICAgID8gXCJOb3RlIHNhdmVkIVwiXG4gICAgICAgICAgICAgIDogXCJQcm9tcHQgc2F2ZWQhXCIsXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJFbC50ZXh0Q29udGVudCA9IHJlcy5lcnJvciB8fCBcIkZhaWxlZFwiO1xuICAgICAgICBlcnJFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICBzYXZlQnRuLnRleHRDb250ZW50ID1cbiAgICAgICAgICBjdXJyZW50VGFiID09PSBcInJlc291cmNlXCJcbiAgICAgICAgICAgID8gXCJTYXZlIFBhZ2VcIlxuICAgICAgICAgICAgOiBjdXJyZW50VGFiID09PSBcIm5vdGVcIlxuICAgICAgICAgICAgICA/IFwiU2F2ZSBOb3RlXCJcbiAgICAgICAgICAgICAgOiBcIlNhdmUgUHJvbXB0XCI7XG4gICAgICAgIChzYXZlQnRuIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJEZXZ2ZW50b3J5IHNhdmUgZXJyb3I6XCIsIGUpO1xuICAgICAgZXJyRWwudGV4dENvbnRlbnQgPSBcIkNvdWxkIG5vdCBjb25uZWN0XCI7XG4gICAgICBlcnJFbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgc2F2ZUJ0bi50ZXh0Q29udGVudCA9XG4gICAgICAgIGN1cnJlbnRUYWIgPT09IFwicmVzb3VyY2VcIlxuICAgICAgICAgID8gXCJTYXZlIFBhZ2VcIlxuICAgICAgICAgIDogY3VycmVudFRhYiA9PT0gXCJub3RlXCJcbiAgICAgICAgICAgID8gXCJTYXZlIE5vdGVcIlxuICAgICAgICAgICAgOiBcIlNhdmUgUHJvbXB0XCI7XG4gICAgICAoc2F2ZUJ0biBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUG9zaXRpb25cbiAgaWYgKHJlY3QpIHtcbiAgICBjb25zdCBzY3JvbGxYID0gd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3Qgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IHRvcCA9IHJlY3QudG9wICsgc2Nyb2xsWSArIDE2O1xuICAgIHBvcHVwLnN0eWxlLnRvcCA9XG4gICAgICB0b3AgKyAzMDAgPCB3aW5kb3cuaW5uZXJIZWlnaHQgKyBzY3JvbGxZXG4gICAgICAgID8gYCR7dG9wfXB4YFxuICAgICAgICA6IGAke3JlY3QudG9wICsgc2Nyb2xsWSAtIDMwMH1weGA7XG4gICAgcG9wdXAuc3R5bGUubGVmdCA9IGAke01hdGgubWluKHJlY3QubGVmdCArIHNjcm9sbFgsIHdpbmRvdy5pbm5lcldpZHRoIC0gMzUwICsgc2Nyb2xsWCl9cHhgO1xuICB9IGVsc2Uge1xuICAgIHBvcHVwLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgIHBvcHVwLnN0eWxlLnRvcCA9IFwiNTAlXCI7XG4gICAgcG9wdXAuc3R5bGUubGVmdCA9IFwiNTAlXCI7XG4gICAgcG9wdXAuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIjtcbiAgfVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICBjb25zdCBmaXJzdElucHV0ID0gcG9wdXAucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsO1xuICBmaXJzdElucHV0Py5mb2N1cygpO1xufVxuXG5mdW5jdGlvbiBjbGVhckV4aXN0aW5nKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmR2LXBvcHVwLCAuZHYtZmxvYXQtYnRuXCIpLmZvckVhY2goKGUpID0+IGUucmVtb3ZlKCkpO1xufVxuXG5mdW5jdGlvbiBzaG93VG9hc3QobWVzc2FnZTogc3RyaW5nKSB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICBPYmplY3QuYXNzaWduKGVsLnN0eWxlLCB7XG4gICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICBib3R0b206IFwiMjRweFwiLFxuICAgIHJpZ2h0OiBcIjI0cHhcIixcbiAgICB6SW5kZXg6IFwiMjE0NzQ4MzY0N1wiLFxuICAgIHBhZGRpbmc6IFwiMTBweCAxNnB4XCIsXG4gICAgYmFja2dyb3VuZDogXCIjNjM2NmYxXCIsXG4gICAgY29sb3I6IFwiI2ZmZlwiLFxuICAgIGJvcmRlclJhZGl1czogXCI4cHhcIixcbiAgICBmb250U2l6ZTogXCIxMnB4XCIsXG4gICAgZm9udFdlaWdodDogXCI1MDBcIixcbiAgICBib3hTaGFkb3c6IFwiMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMSlcIixcbiAgICBhbmltYXRpb246IFwiZHYtdG9hc3QtaW4gMC4ycyBlYXNlLW91dFwiLFxuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG4gIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlKCksIDI1MDApO1xufVxuXG5mdW5jdGlvbiBlc2NhcGVIdG1sKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzXG4gICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgUHJvdmlkZXIsIENvbnRleHQsIEFjdGlvbiB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U2l0ZU1ldGEgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvbWV0YWRhdGFcIjtcbmltcG9ydCB7IGNyZWF0ZUNoaXAsIHNob3dNZW51IH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3VpXCI7XG5cbmV4cG9ydCBjb25zdCBnaXRodWJQcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIGlkOiBcImdpdGh1Yi1yZXBvXCIsXG4gIGxhYmVsOiBcIkdpdEh1YlwiLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgY29uc3QgeyBob3N0bmFtZSwgcGF0aG5hbWUgfSA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICBpZiAoaG9zdG5hbWUgIT09IFwiZ2l0aHViLmNvbVwiKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHBhcnRzID0gcGF0aG5hbWUuc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBbb3duZXIsIHJlcG9dID0gcGFydHM7XG4gICAgY29uc3QgcGFnZVR5cGUgPVxuICAgICAgcGFydHMubGVuZ3RoID09PSAyXG4gICAgICAgID8gXCJnaXRodWItcmVwb1wiXG4gICAgICAgIDogcGFydHNbMl0gPT09IFwicHVsbFwiXG4gICAgICAgICAgPyBcImdpdGh1Yi1wclwiXG4gICAgICAgICAgOiBwYXJ0c1syXSA9PT0gXCJpc3N1ZXNcIlxuICAgICAgICAgICAgPyBcImdpdGh1Yi1pc3N1ZVwiXG4gICAgICAgICAgICA6IHBhcnRzLmxlbmd0aCA+IDJcbiAgICAgICAgICAgICAgPyBcImdpdGh1Yi1maWxlXCJcbiAgICAgICAgICAgICAgOiBcImdpdGh1Yi1yZXBvXCI7XG5cbiAgICBjb25zdCBzdGFyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtdGVzdGlkPSdzdGFyZ2F6ZXJzLWNvdW50J11cIik7XG4gICAgY29uc3Qgc3RhcnMgPSBzdGFyRWxcbiAgICAgID8gcGFyc2VJbnQoc3RhckVsLnRleHRDb250ZW50Py5yZXBsYWNlKC8sL2csIFwiXCIpIHx8IFwiMFwiLCAxMCkgfHwgdW5kZWZpbmVkXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGxhbmdFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbaXRlbXByb3A9J3Byb2dyYW1taW5nTGFuZ3VhZ2UnXVwiKTtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGxhbmdFbD8udGV4dENvbnRlbnQgfHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwicC5mNC5tdC0zLCBbZGF0YS10ZXN0aWQ9J3JlcG8tZGVzY3JpcHRpb24nXVwiLFxuICAgICk7XG5cbiAgICBjb25zdCBtZXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHtcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIHN0YXJzLFxuICAgICAgbGFuZ3VhZ2UsXG4gICAgICBkZXNjcmlwdGlvbjogZGVzY0VsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IFwiXCIsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogcGFnZVR5cGUgYXMgQ29udGV4dFtcImlkXCJdLFxuICAgICAgbGFiZWw6IGAke293bmVyfS8ke3JlcG99YCxcbiAgICAgIG1ldGEsXG4gICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IHBhZ2VUeXBlIGFzIENvbnRleHRbXCJpZFwiXSB9LFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0QWN0aW9ucyhjdHg6IENvbnRleHQpOiBBY3Rpb25bXSB7XG4gICAgY29uc3QgaXNSZXBvID0gY3R4LmlkID09PSBcImdpdGh1Yi1yZXBvXCI7XG4gICAgY29uc3QgaXNGaWxlID0gY3R4LmlkID09PSBcImdpdGh1Yi1maWxlXCI7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwic2F2ZS1yZXBvXCIsXG4gICAgICAgIGxhYmVsOiBpc0ZpbGUgPyBcIlNhdmUgRmlsZVwiIDogXCJTYXZlIFJlcG9zaXRvcnlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IGlzUmVwbyA/IFwiU2F2ZSByZXBvIHdpdGggQUkgc3VtbWFyeVwiIDogXCJTYXZlIHRoaXMgZmlsZVwiLFxuICAgICAgICBpY29uOiBcIk01IDNoMTRhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6bTAgMnYxNGgxNFY1SDV6bTQgNGg2djZIOVY5elwiLFxuICAgICAgICB0YWI6IFwicmVzb3VyY2VcIixcbiAgICAgICAgcGF5bG9hZDogeyBzaXRlVHlwZTogY3R4LmlkIH0sXG4gICAgICB9LFxuICAgICAgLi4uKGlzUmVwb1xuICAgICAgICA/IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IFwiYWktc3VtbWFyeVwiLFxuICAgICAgICAgICAgICBsYWJlbDogXCJBSSBTdW1tYXJ5XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlbmVyYXRlIHJlcG8gb3ZlcnZpZXdcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgICAgICAgdGFiOiBcIm5vdGVcIiBhcyBjb25zdCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBcInRlY2gtc3RhY2tcIixcbiAgICAgICAgICAgICAgbGFiZWw6IFwiVGVjaCBTdGFja1wiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEZXRlY3QgdGVjaG5vbG9naWVzIHVzZWRcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJNMjIgMTJoLTRsLTMgOUw5IDNsLTMgOUgyXCIsXG4gICAgICAgICAgICAgIHRhYjogXCJub3RlXCIgYXMgY29uc3QsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogXCJsZWFybmluZy1wYXRoXCIsXG4gICAgICAgICAgICAgIGxhYmVsOiBcIkxlYXJuaW5nIFJvYWRtYXBcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiR2VuZXJhdGUgc3R1ZHkgcGxhblwiLFxuICAgICAgICAgICAgICBpY29uOiBcIk0xMiA2VjRtMCAyYTIgMiAwIDEgMCAwIDRtMC00YTIgMiAwIDEgMSAwIDRtLTYgOGEyIDIgMCAxIDAgMC00bTAgNGEyIDIgMCAxIDEgMC00bTAgNHYybTAtNlY0bTYgNnYxMG02LTJhMiAyIDAgMSAwIDAtNG0wIDRhMiAyIDAgMSAxIDAtNG0wIDR2Mm0wLTZWNFwiLFxuICAgICAgICAgICAgICB0YWI6IFwibm90ZVwiIGFzIGNvbnN0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pLFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXJlYWRtZVwiLFxuICAgICAgICBsYWJlbDogXCJTYXZlIFJFQURNRVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXZlIGFzIG5vdGVcIixcbiAgICAgICAgaWNvbjogXCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41TDE0LjUgMnpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInJlbGF0ZWQtbm90ZXNcIixcbiAgICAgICAgbGFiZWw6IFwiUmVsYXRlZCBOb3Rlc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJGaW5kIGluIHlvdXIgdmF1bHRcIixcbiAgICAgICAgaWNvbjogXCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIsXG4gICAgICAgIHRhYjogXCJyZXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICBdO1xuICB9LFxuXG4gIGdldENoaXBBbmNob3IoKTogRWxlbWVudCB8IG51bGwge1xuICAgIC8vIEJlc2lkZSByZXBvIG5hbWUgaW4gdGhlIGhlYWRlclxuICAgIHJldHVybiAoXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICAgICAgXCJoMSBzdHJvbmcgYSwgW2RhdGEtdGVzdGlkPSdyZXBvLXRpdGxlJ10gYSwgW2RhdGEtdGVzdGlkPSdyZXBvc2l0b3J5LXRpdGxlJ10gYSwgLnJlcG9zaXRvcnktY29udGVudCBoMVwiLFxuICAgICAgKSB8fFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJoMVwiKSB8fFxuICAgICAgbnVsbFxuICAgICk7XG4gIH0sXG5cbiAgbW91bnRVSShjdHg6IENvbnRleHQpOiAoKSA9PiB2b2lkIHtcbiAgICBjb25zdCBhbmNob3IgPSB0aGlzLmdldENoaXBBbmNob3I/LigpO1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gKCkgPT4ge307XG5cbiAgICBjb25zdCBjaGlwID0gY3JlYXRlQ2hpcChcbiAgICAgIFwiTTEyIDNhNiA2IDAgMCAwLTYgNnYxaDEyVjlhNiA2IDAgMCAwLTYtNnpNOCAxNHYxYTQgNCAwIDAgMCA4IDB2LTFcIixcbiAgICAgIFwiRGV2dmVudG9yeVwiLFxuICAgICk7XG5cbiAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKGN0eCk7XG4gICAgICBzaG93TWVudShjaGlwLCBhY3Rpb25zLCAoYWN0aW9uKSA9PiB7XG4gICAgICAgIGltcG9ydChcIi4uL2NvbnRleHQtZW5naW5lL3BvcHVwXCIpLnRoZW4oKG0pID0+XG4gICAgICAgICAgbS5vcGVuUG9wdXAoYWN0aW9uLCBjdHgpLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFuY2hvci5wYXJlbnRFbGVtZW50Py5pbnNlcnRCZWZvcmUoY2hpcCwgYW5jaG9yLm5leHRTaWJsaW5nKTtcbiAgICBjaGlwLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjhweFwiO1xuXG4gICAgcmV0dXJuICgpID0+IGNoaXAucmVtb3ZlKCk7XG4gIH0sXG59O1xuIiwiaW1wb3J0IHR5cGUgeyBQcm92aWRlciwgQ29udGV4dCwgQWN0aW9uIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTaXRlTWV0YSB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YVwiO1xuaW1wb3J0IHsgY3JlYXRlQ2hpcCwgc2hvd01lbnUgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvdWlcIjtcblxuZXhwb3J0IGNvbnN0IHlvdXR1YmVQcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIGlkOiBcInlvdXR1YmVcIixcbiAgbGFiZWw6IFwiWW91VHViZVwiLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgY29uc3QgeyBob3N0bmFtZSB9ID0gd2luZG93LmxvY2F0aW9uO1xuICAgIGlmICghW1wid3d3LnlvdXR1YmUuY29tXCIsIFwieW91dHViZS5jb21cIiwgXCJ5b3V0dS5iZVwiXS5pbmNsdWRlcyhob3N0bmFtZSkpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgdiA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5nZXQoXCJ2XCIpO1xuICAgIGlmICghdikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBjaGFubmVsRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIjb3duZXIgI2NoYW5uZWwtbmFtZSwgeXQtZm9ybWF0dGVkLXN0cmluZy55dGQtY2hhbm5lbC1uYW1lXCIsXG4gICAgKTtcbiAgICBjb25zdCBjaGFubmVsID0gY2hhbm5lbEVsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3ZlLXRoZS1mb2xkICN0aXRsZSBoMVwiKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcInlvdXR1YmVcIixcbiAgICAgIGxhYmVsOiB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IFwiWW91VHViZSBWaWRlb1wiLFxuICAgICAgbWV0YTogeyB2aWRlb0lkOiB2LCBjaGFubmVsIH0sXG4gICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwieW91dHViZVwiIH0sXG4gICAgfTtcbiAgfSxcblxuICBnZXRBY3Rpb25zKCk6IEFjdGlvbltdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBpZDogXCJhaS1zdW1tYXJ5XCIsXG4gICAgICAgIGxhYmVsOiBcIkFJIFN1bW1hcnlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3VtbWFyaXplIHRoaXMgdmlkZW9cIixcbiAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImtleS1sZWFybmluZ3NcIixcbiAgICAgICAgbGFiZWw6IFwiS2V5IExlYXJuaW5nc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJFeHRyYWN0IG1haW4gcG9pbnRzXCIsXG4gICAgICAgIGljb246IFwiTTkgNUg3YTIgMiAwIDAgMC0yIDJ2MTJhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMmgtMk05IDVhMiAyIDAgMCAwIDIgMmgyYTIgMiAwIDAgMCAyLTJNOSA1YTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAyXCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXRyYW5zY3JpcHRcIixcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBUcmFuc2NyaXB0XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNhdmUgZnVsbCB0cmFuc2NyaXB0XCIsXG4gICAgICAgIGljb246IFwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNUwxNC41IDJ6XCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXZpZGVvXCIsXG4gICAgICAgIGxhYmVsOiBcIlNhdmUgVmlkZW9cIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2F2ZSBhcyByZXNvdXJjZVwiLFxuICAgICAgICBpY29uOiBcIk01IDNoMTRhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6XCIsXG4gICAgICAgIHRhYjogXCJyZXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZmxhc2hjYXJkc1wiLFxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgRmxhc2hjYXJkc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJHZW5lcmF0ZSBzdHVkeSBjYXJkc1wiLFxuICAgICAgICBpY29uOiBcIk0yIDNoNmE0IDQgMCAwIDEgNCA0djE0YTMgMyAwIDAgMC0zLTNIMnpNMjIgM2gtNmE0IDQgMCAwIDAtNCA0djE0YTMgMyAwIDAgMSAzLTNoN3pcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcblxuICBnZXRDaGlwQW5jaG9yKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBZb3VUdWJlIHJlbmRlcnMgdGl0bGUgaW5zaWRlICNhYm92ZS10aGUtZm9sZCA+ICN0aXRsZSA+IGgxXG4gICAgcmV0dXJuIChcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWJvdmUtdGhlLWZvbGQgI3RpdGxlIGgxXCIpIHx8XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlIGgxXCIpIHx8XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDEueXRkLXZpZGVvLXByaW1hcnktaW5mby1yZW5kZXJlclwiKSB8fFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpIHx8XG4gICAgICBudWxsXG4gICAgKTtcbiAgfSxcblxuICBtb3VudFVJKGN0eDogQ29udGV4dCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuZ2V0Q2hpcEFuY2hvcj8uKCk7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiAoKSA9PiB7fTtcblxuICAgIGNvbnN0IGNoaXAgPSBjcmVhdGVDaGlwKFxuICAgICAgXCJNMTIgM2E2IDYgMCAwIDAtNiA2djFoMTJWOWE2IDYgMCAwIDAtNi02ek04IDE0djFhNCA0IDAgMCAwIDggMHYtMVwiLFxuICAgICAgXCJEZXZ2ZW50b3J5XCIsXG4gICAgKTtcblxuICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoY3R4KTtcbiAgICAgIHNob3dNZW51KGNoaXAsIGFjdGlvbnMsIChhY3Rpb24pID0+IHtcbiAgICAgICAgaW1wb3J0KFwiLi4vY29udGV4dC1lbmdpbmUvcG9wdXBcIikudGhlbigobSkgPT4gbS5vcGVuUG9wdXAoYWN0aW9uLCBjdHgpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhbmNob3IucGFyZW50RWxlbWVudD8uaW5zZXJ0QmVmb3JlKGNoaXAsIGFuY2hvci5uZXh0U2libGluZyk7XG4gICAgY2hpcC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI4cHhcIjtcbiAgICBjaGlwLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuXG4gICAgcmV0dXJuICgpID0+IGNoaXAucmVtb3ZlKCk7XG4gIH0sXG59O1xuIiwiaW1wb3J0IHR5cGUgeyBQcm92aWRlciwgQ29udGV4dCwgQWN0aW9uIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTaXRlTWV0YSB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YVwiO1xuaW1wb3J0IHsgY3JlYXRlQ2hpcCwgc2hvd01lbnUgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvdWlcIjtcblxuY29uc3QgRE9DX1NJVEVTID0gW1xuICBcImRldmVsb3Blci5tb3ppbGxhLm9yZ1wiLFxuICBcInJlYWN0LmRldlwiLFxuICBcIm5leHRqcy5vcmdcIixcbiAgXCJudXh0LmNvbVwiLFxuICBcInN2ZWx0ZS5kZXZcIixcbiAgXCJ2dWVqcy5vcmdcIixcbiAgXCJhbmd1bGFyLmRldlwiLFxuICBcInByaXNtYS5pb1wiLFxuICBcInRycGMuaW9cIixcbiAgXCJ0YWlsd2luZGNzcy5jb21cIixcbiAgXCJ2aXRlLmRldlwiLFxuICBcImFzdHJvLmJ1aWxkXCIsXG4gIFwicHl0aG9uLm9yZ1wiLFxuICBcImxhbmdjaGFpbi5jb21cIixcbiAgXCJwbGF0Zm9ybS5vcGVuYWkuY29tXCIsXG5dO1xuXG5mdW5jdGlvbiBpc0RvY1NpdGUoaG9zdG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIERPQ19TSVRFUy5zb21lKChzKSA9PiBob3N0bmFtZS5lbmRzV2l0aChzKSB8fCBob3N0bmFtZSA9PT0gcykgfHxcbiAgICBob3N0bmFtZS5lbmRzV2l0aChcIi5kZXZcIikgfHxcbiAgICBob3N0bmFtZS5lbmRzV2l0aChcIi5kb2NzXCIpIHx8XG4gICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvZG9jc1wiKVxuICApO1xufVxuXG5leHBvcnQgY29uc3QgZG9jc1Byb3ZpZGVyOiBQcm92aWRlciA9IHtcbiAgaWQ6IFwiZG9jc1wiLFxuICBsYWJlbDogXCJEb2NzXCIsXG5cbiAgZGV0ZWN0KCk6IENvbnRleHQgfCBudWxsIHtcbiAgICBjb25zdCB7IGhvc3RuYW1lIH0gPSB3aW5kb3cubG9jYXRpb247XG4gICAgaWYgKCFpc0RvY1NpdGUoaG9zdG5hbWUpKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGhlYWRpbmcgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpPy50ZXh0Q29udGVudD8udHJpbSgpIHx8XG4gICAgICBkb2N1bWVudC50aXRsZTtcblxuICAgIC8vIFRyeSB0byBkZXRlY3QgZnJhbWV3b3JrXG4gICAgY29uc3QgZnJhbWV3b3JrID0gRE9DX1NJVEVTLmZpbmQoKHMpID0+IGhvc3RuYW1lLmVuZHNXaXRoKHMpIHx8IGhvc3RuYW1lID09PSBzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogXCJkb2NzXCIsXG4gICAgICBsYWJlbDogaGVhZGluZyxcbiAgICAgIG1ldGE6IHsgZnJhbWV3b3JrOiBmcmFtZXdvcmsgfHwgaG9zdG5hbWUgfSxcbiAgICAgIHBhZ2VEYXRhOiB7IC4uLmdldFNpdGVNZXRhKCksIHNpdGVJZDogXCJkb2NzXCIgfSxcbiAgICB9O1xuICB9LFxuXG4gIGdldEFjdGlvbnMoY3R4OiBDb250ZXh0KTogQWN0aW9uW10ge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIGlkOiBcImV4cGxhaW5cIixcbiAgICAgICAgbGFiZWw6IFwiRXhwbGFpbiBUaGlzIFBhZ2VcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQUkgZXhwbGFuYXRpb25cIixcbiAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInNhdmUtcGFnZVwiLFxuICAgICAgICBsYWJlbDogXCJTYXZlIFBhZ2VcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2F2ZSBhcyByZXNvdXJjZVwiLFxuICAgICAgICBpY29uOiBcIk01IDNoMTRhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6XCIsXG4gICAgICAgIHRhYjogXCJyZXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiY2hlYXRzaGVldFwiLFxuICAgICAgICBsYWJlbDogXCJHZW5lcmF0ZSBDaGVhdHNoZWV0XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkNyZWF0ZSBxdWljayByZWZlcmVuY2VcIixcbiAgICAgICAgaWNvbjogXCJNOSA1SDdhMiAyIDAgMCAwLTIgMnYxMmEyIDIgMCAwIDAgMiAyaDEwYTIgMiAwIDAgMCAyLTJWN2EyIDIgMCAwIDAtMi0yaC0yTTkgNWEyIDIgMCAwIDAgMiAyaDJhMiAyIDAgMCAwIDItMk05IDVhMiAyIDAgMCAxIDItMmgyYTIgMiAwIDAgMSAyIDJcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInNhdmUtYXBpXCIsXG4gICAgICAgIGxhYmVsOiBcIlNhdmUgQVBJIFJlZmVyZW5jZVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXZlIGtleSBBUEkgZGV0YWlsc1wiLFxuICAgICAgICBpY29uOiBcIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjVMMTQuNSAyelwiLFxuICAgICAgICB0YWI6IFwibm90ZVwiLFxuICAgICAgfSxcbiAgICBdO1xuICB9LFxuXG4gIGdldENoaXBBbmNob3IoKTogRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIikgfHwgbnVsbDtcbiAgfSxcblxuICBtb3VudFVJKGN0eDogQ29udGV4dCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuZ2V0Q2hpcEFuY2hvcj8uKCk7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiAoKSA9PiB7fTtcblxuICAgIGNvbnN0IGNoaXAgPSBjcmVhdGVDaGlwKFxuICAgICAgXCJNMTIgM2E2IDYgMCAwIDAtNiA2djFoMTJWOWE2IDYgMCAwIDAtNi02ek04IDE0djFhNCA0IDAgMCAwIDggMHYtMVwiLFxuICAgICAgXCJEZXZ2ZW50b3J5XCIsXG4gICAgKTtcblxuICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoY3R4KTtcbiAgICAgIHNob3dNZW51KGNoaXAsIGFjdGlvbnMsIChhY3Rpb24pID0+IHtcbiAgICAgICAgaW1wb3J0KFwiLi4vY29udGV4dC1lbmdpbmUvcG9wdXBcIikudGhlbigobSkgPT4gbS5vcGVuUG9wdXAoYWN0aW9uLCBjdHgpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhbmNob3IucGFyZW50RWxlbWVudD8uaW5zZXJ0QmVmb3JlKGNoaXAsIGFuY2hvci5uZXh0U2libGluZyk7XG4gICAgY2hpcC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI4cHhcIjtcblxuICAgIHJldHVybiAoKSA9PiBjaGlwLnJlbW92ZSgpO1xuICB9LFxufTtcbiIsImltcG9ydCB0eXBlIHsgUHJvdmlkZXIsIENvbnRleHQsIEFjdGlvbiB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U2l0ZU1ldGEgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvbWV0YWRhdGFcIjtcblxuZXhwb3J0IGNvbnN0IGdlbmVyaWNQcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIGlkOiBcImdlbmVyaWNcIixcbiAgbGFiZWw6IFwiUGFnZVwiLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgLy8gQWx3YXlzIG1hdGNoZXMgYXMgZmFsbGJhY2tcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFwiZ2VuZXJpY1wiLFxuICAgICAgbGFiZWw6IGRvY3VtZW50LnRpdGxlIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgcGFnZURhdGE6IHsgLi4uZ2V0U2l0ZU1ldGEoKSwgc2l0ZUlkOiBcImdlbmVyaWNcIiB9LFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0QWN0aW9ucygpOiBBY3Rpb25bXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwic2F2ZS1wYWdlXCIsXG4gICAgICAgIGxhYmVsOiBcIlNhdmUgUGFnZVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXZlIGFzIHJlc291cmNlXCIsXG4gICAgICAgIGljb246IFwiTTUgM2gxNGEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMnpcIixcbiAgICAgICAgdGFiOiBcInJlc291cmNlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLW5vdGVcIixcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBOb3RlXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldyaXRlIGEgcXVpY2sgbm90ZVwiLFxuICAgICAgICBpY29uOiBcIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjVMMTQuNSAyelwiLFxuICAgICAgICB0YWI6IFwibm90ZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWktc3VtbWFyeVwiLFxuICAgICAgICBsYWJlbDogXCJBSSBTdW1tYXJ5XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN1bW1hcml6ZSB0aGlzIHBhZ2VcIixcbiAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcblxuICBtb3VudFVJKCk6ICgpID0+IHZvaWQge1xuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfSxcbn07XG4iLCJpbXBvcnQgdHlwZSB7IFByb3ZpZGVyLCBDb250ZXh0IH0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCB7IGdpdGh1YlByb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVycy9naXRodWJcIjtcbmltcG9ydCB7IHlvdXR1YmVQcm92aWRlciB9IGZyb20gXCIuLi9wcm92aWRlcnMveW91dHViZVwiO1xuaW1wb3J0IHsgZG9jc1Byb3ZpZGVyIH0gZnJvbSBcIi4uL3Byb3ZpZGVycy9kb2NzXCI7XG5pbXBvcnQgeyBnZW5lcmljUHJvdmlkZXIgfSBmcm9tIFwiLi4vcHJvdmlkZXJzL2dlbmVyaWNcIjtcblxuY29uc3QgcHJvdmlkZXJzOiBQcm92aWRlcltdID0gW1xuICBnaXRodWJQcm92aWRlcixcbiAgeW91dHViZVByb3ZpZGVyLFxuICBkb2NzUHJvdmlkZXIsXG4gIGdlbmVyaWNQcm92aWRlcixcbl07XG5cbmxldCBhY3RpdmVDbGVhbnVwOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcbmxldCBsYXN0VXJsID0gXCJcIjtcblxuZnVuY3Rpb24gcnVuRGV0ZWN0aW9uKCk6IHsgcHJvdmlkZXI6IFByb3ZpZGVyOyBjdHg6IENvbnRleHQgfSB8IG51bGwge1xuICBmb3IgKGNvbnN0IHAgb2YgcHJvdmlkZXJzKSB7XG4gICAgY29uc3QgY3R4ID0gcC5kZXRlY3QoKTtcbiAgICBpZiAoY3R4KSByZXR1cm4geyBwcm92aWRlcjogcCwgY3R4IH07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIG1vdW50KCkge1xuICBpZiAoYWN0aXZlQ2xlYW51cCkge1xuICAgIGFjdGl2ZUNsZWFudXAoKTtcbiAgICBhY3RpdmVDbGVhbnVwID0gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHJ1bkRldGVjdGlvbigpO1xuICBpZiAoIXJlc3VsdCkgcmV0dXJuO1xuICBpZiAocmVzdWx0LnByb3ZpZGVyLmlkID09PSBcImdlbmVyaWNcIikgcmV0dXJuO1xuXG4gIC8vIENoZWNrIGlmIHByb3ZpZGVyIGhhcyBhbiBhbmNob3Ig4oCUIGlmIG5vdCwgcmV0cnkgKFNQQSBsYXp5IHJlbmRlciAvIHNsb3cgbG9hZHMpXG4gIGNvbnN0IGhhc0FuY2hvciA9IHJlc3VsdC5wcm92aWRlci5nZXRDaGlwQW5jaG9yPy4oKTtcbiAgaWYgKCFoYXNBbmNob3IpIHtcbiAgICBjb25zdCByZXRyaWVzID0gWzEwMDAsIDIwMDAsIDMwMDAsIDUwMDAsIDgwMDBdO1xuICAgIHJldHJpZXMuZm9yRWFjaCgoZGVsYXkpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlQ2xlYW51cCkgcmV0dXJuOyAvLyBhbHJlYWR5IG1vdW50ZWRcbiAgICAgICAgaWYgKHJlc3VsdC5wcm92aWRlci5nZXRDaGlwQW5jaG9yPy4oKSkgbW91bnQoKTtcbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cblxuICBhY3RpdmVDbGVhbnVwID0gcmVzdWx0LnByb3ZpZGVyLm1vdW50VUkocmVzdWx0LmN0eCk7XG59XG5cbmxldCBvYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlciB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gbW91bnRDb250ZXh0VUkoKTogKCkgPT4gdm9pZCB7XG4gIGxhc3RVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgY29uc3QgcmVzdWx0ID0gcnVuRGV0ZWN0aW9uKCk7XG5cbiAgLy8gT25seSBzZXQgdXAgb2JzZXJ2ZXJzIG9uIHN1cHBvcnRlZCBzaXRlcyAoc2tpcCBnZW5lcmljL3Vuc3VwcG9ydGVkKVxuICBpZiAocmVzdWx0ICYmIHJlc3VsdC5wcm92aWRlci5pZCAhPT0gXCJnZW5lcmljXCIpIHtcbiAgICBtb3VudCgpO1xuXG4gICAgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT09IGxhc3RVcmwpIHtcbiAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBzZXRUaW1lb3V0KG1vdW50LCA2MDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwieXQtbmF2aWdhdGUtZmluaXNoXCIsICgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQobW91bnQsIDYwMCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gKCkgPT4ge1xuICAgIG9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIGFjdGl2ZUNsZWFudXA/LigpO1xuICAgIGFjdGl2ZUNsZWFudXAgPSBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGV4dCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gIGNvbnN0IHJlc3VsdCA9IHJ1bkRldGVjdGlvbigpO1xuICByZXR1cm4gcmVzdWx0Py5jdHggfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGlvbnMoY29udGV4dD86IENvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0KSByZXR1cm4gW107XG4gIGNvbnN0IHJlc3VsdCA9IHJ1bkRldGVjdGlvbigpO1xuICBpZiAocmVzdWx0ICYmIHJlc3VsdC5jdHguaWQgPT09IGNvbnRleHQuaWQpIHJldHVybiByZXN1bHQucHJvdmlkZXIuZ2V0QWN0aW9ucyhyZXN1bHQuY3R4KTtcbiAgcmV0dXJuIFtdO1xufVxuIiwiaW1wb3J0IHsgbW91bnRDb250ZXh0VUksIGdldENvbnRleHQgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmVcIjtcbmltcG9ydCB7IGluamVjdEJhc2VTdHlsZXMgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvdWlcIjtcbmltcG9ydCB7IGdldFNpdGVNZXRhIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL21ldGFkYXRhXCI7XG5pbXBvcnQgeyBvcGVuUG9wdXAgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvcG9wdXBcIjtcblxuLy8g4pSA4pSA4pSAIEZsb2F0aW5nIFwiK1wiIGJ1dHRvbiBvbiB0ZXh0IHNlbGVjdGlvbiDilIDilIDilIBcblxubGV0IGZsb2F0QnRuOiBIVE1MQnV0dG9uRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG5mdW5jdGlvbiBjbGVhckZsb2F0KCkge1xuICBmbG9hdEJ0bj8ucmVtb3ZlKCk7XG4gIGZsb2F0QnRuID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0U2VsUmVjdCgpOiBET01SZWN0IHwgbnVsbCB7XG4gIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgaWYgKCFzZWwgfHwgc2VsLmlzQ29sbGFwc2VkIHx8ICFzZWwucmFuZ2VDb3VudCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHIgPSBzZWwuZ2V0UmFuZ2VBdCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIHIud2lkdGggPT09IDAgJiYgci5oZWlnaHQgPT09IDAgPyBudWxsIDogcjtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZVVwKGU6IE1vdXNlRXZlbnQpIHtcbiAgaWYgKChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCk/LmNsb3Nlc3Q/LihcIi5kdi1mbG9hdCwgLmR2LWNoaXAsIC5kdi1tZW51XCIpKSByZXR1cm47XG4gIGNvbnN0IHJlY3QgPSBnZXRTZWxSZWN0KCk7XG4gIHJlY3QgPyBzaG93RmxvYXRCdG4ocmVjdCkgOiBjbGVhckZsb2F0KCk7XG59XG5cbmZ1bmN0aW9uIHNob3dGbG9hdEJ0bihyZWN0OiBET01SZWN0KSB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwXCIpKSByZXR1cm47XG4gIGlmICghZmxvYXRCdG4pIHtcbiAgICBpbmplY3RCYXNlU3R5bGVzKCk7XG4gICAgZmxvYXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGZsb2F0QnRuLmNsYXNzTmFtZSA9IFwiZHYtZmxvYXQgZHYtZmxvYXQtYnRuXCI7XG4gICAgZmxvYXRCdG4uaW5uZXJIVE1MID1cbiAgICAgICc8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjIuNVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjVcIiB4Mj1cIjEyXCIgeTI9XCIxOVwiLz48bGluZSB4MT1cIjVcIiB5MT1cIjEyXCIgeDI9XCIxOVwiIHkyPVwiMTJcIi8+PC9zdmc+JztcbiAgICBmbG9hdEJ0bi50aXRsZSA9IFwiU2F2ZSB0byBEZXZ2ZW50b3J5XCI7XG4gICAgZmxvYXRCdG4ub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNsZWFyRmxvYXQoKTtcbiAgICAgIGNvbnN0IGN0eCA9IGdldENvbnRleHQoKTtcbiAgICAgIGNvbnN0IHNlbFRleHQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk/LnRvU3RyaW5nKCkgfHwgXCJcIjtcbiAgICAgIGNvbnN0IGhhc1NlbCA9ICEhc2VsVGV4dDtcbiAgICAgIG9wZW5Qb3B1cChcbiAgICAgICAge1xuICAgICAgICAgIGlkOiBoYXNTZWwgPyBcInNhdmUtbm90ZVwiIDogXCJzYXZlLXBhZ2VcIixcbiAgICAgICAgICBsYWJlbDogaGFzU2VsID8gXCJTYXZlIFNlbGVjdGlvblwiIDogXCJTYXZlIFBhZ2VcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcbiAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgIHRhYjogaGFzU2VsID8gXCJub3RlXCIgOiBcInJlc291cmNlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGN0eCB8fCB7XG4gICAgICAgICAgaWQ6IFwiZ2VuZXJpY1wiLFxuICAgICAgICAgIGxhYmVsOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICBtZXRhOiB7fSxcbiAgICAgICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwiZ2VuZXJpY1wiIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlY3QsXG4gICAgICApO1xuICAgIH07XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmbG9hdEJ0bik7XG4gIH1cbiAgY29uc3Qgc2Nyb2xsWCA9IHdpbmRvdy5zY3JvbGxYLFxuICAgIHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgZmxvYXRCdG4uc3R5bGUubGVmdCA9XG4gICAgTWF0aC5taW4ocmVjdC5yaWdodCArIHNjcm9sbFggLSA3LCB3aW5kb3cuaW5uZXJXaWR0aCAtIDQwKSArIFwicHhcIjtcbiAgZmxvYXRCdG4uc3R5bGUudG9wID1cbiAgICBNYXRoLm1heChyZWN0LnRvcCArIHNjcm9sbFkgLSAxNCwgc2Nyb2xsWSArIDgpICsgXCJweFwiO1xufVxuXG4vLyDilIDilIDilIAgRW50cnkg4pSA4pSA4pSAXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xuICBtYXRjaGVzOiBbXG4gICAgXCIqOi8vZ2l0aHViLmNvbS8qXCIsXG4gICAgXCIqOi8vd3d3LnlvdXR1YmUuY29tLypcIixcbiAgICBcIio6Ly95b3V0dS5iZS8qXCIsXG4gICAgXCIqOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnLypcIixcbiAgICBcIio6Ly9yZWFjdC5kZXYvKlwiLFxuICAgIFwiKjovL25leHRqcy5vcmcvKlwiLFxuICAgIFwiKjovL3RhaWx3aW5kY3NzLmNvbS8qXCIsXG4gICAgXCIqOi8vc3ZlbHRlLmRldi8qXCIsXG4gIF0sXG4gIG1haW4oKSB7XG4gICAgLy8gTW91bnQgY29udGV4dC1hd2FyZSBjaGlwcyBvbiBzdXBwb3J0ZWQgc2l0ZXMgKEdpdEh1YiwgWW91VHViZSwgZG9jcylcbiAgICBjb25zdCB1bm1vdW50ID0gbW91bnRDb250ZXh0VUkoKTtcblxuICAgIC8vIFNlbGVjdGlvbiBmbG9hdGVyIOKAlCBtaW5pbWFsIGxpc3RlbmVyLCBvbmx5IGNyZWF0ZXMgRE9NIG9uIGFjdHVhbCBzZWxlY3Rpb25cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmICghKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KT8uY2xvc2VzdD8uKFwiLmR2LWZsb2F0LCAuZHYtY2hpcCwgLmR2LW1lbnVcIikpIGNsZWFyRmxvYXQoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNsZWFyRmxvYXQsIHRydWUpO1xuXG4gICAgLy8gTWVzc2FnZSBoYW5kbGVycyDigJQgbm8gRE9NIGluamVjdGlvbiB1bnRpbCB1c2VyIGFjdHNcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgICBpZiAobXNnLnR5cGUgPT09IFwiZ2V0UGFnZURhdGFcIikge1xuICAgICAgICBzZW5kUmVzcG9uc2UoZ2V0U2l0ZU1ldGEoKSk7XG4gICAgICB9XG4gICAgICBpZiAobXNnLnR5cGUgPT09IFwic2hvd1RvYXN0XCIpIHtcbiAgICAgICAgc2hvd1RvYXN0KG1zZy5tZXNzYWdlKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1zZy50eXBlID09PSBcInNob3dJbmxpbmVQb3B1cFwiKSB7XG4gICAgICAgIGluamVjdEJhc2VTdHlsZXMoKTtcbiAgICAgICAgY29uc3QgY3R4ID0gZ2V0Q29udGV4dCgpO1xuICAgICAgICBjb25zdCBzZWxUZXh0ID0gd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8IFwiXCI7XG4gICAgICAgIG9wZW5Qb3B1cChcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZDogXCJzYXZlLXBhZ2VcIixcbiAgICAgICAgICAgIGxhYmVsOiBjdHg/LmxhYmVsIHx8IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXG4gICAgICAgICAgICBpY29uOiBcIlwiLFxuICAgICAgICAgICAgdGFiOiBzZWxUZXh0ID8gXCJub3RlXCIgOiBcInJlc291cmNlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjdHggfHwge1xuICAgICAgICAgICAgaWQ6IFwiZ2VuZXJpY1wiLFxuICAgICAgICAgICAgbGFiZWw6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgICAgbWV0YToge30sXG4gICAgICAgICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwiZ2VuZXJpY1wiIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBudWxsLFxuICAgICAgICApO1xuICAgICAgICBzZW5kUmVzcG9uc2UodHJ1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5tb3VudCgpO1xuICAgICAgY2xlYXJGbG9hdCgpO1xuICAgIH07XG4gIH0sXG59KTtcblxuZnVuY3Rpb24gc2hvd1RvYXN0KG1lc3NhZ2U6IHN0cmluZykge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgT2JqZWN0LmFzc2lnbihlbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgYm90dG9tOiBcIjI0cHhcIixcbiAgICByaWdodDogXCIyNHB4XCIsXG4gICAgekluZGV4OiBcIjIxNDc0ODM2NDdcIixcbiAgICBwYWRkaW5nOiBcIjEwcHggMTZweFwiLFxuICAgIGJhY2tncm91bmQ6IFwiIzYzNjZmMVwiLFxuICAgIGNvbG9yOiBcIiNmZmZcIixcbiAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXG4gICAgZm9udFNpemU6IFwiMTJweFwiLFxuICAgIGZvbnRXZWlnaHQ6IFwiNTAwXCIsXG4gICAgYm94U2hhZG93OiBcIjAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjEpXCIsXG4gICAgYW5pbWF0aW9uOiBcImR2LXRvYXN0LWluIDAuMnMgZWFzZS1vdXRcIixcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICBzZXRUaW1lb3V0KCgpID0+IGVsLnJlbW92ZSgpLCAyNTAwKTtcbn1cbiIsIi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLnRzXG5mdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcblx0aWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuXHRpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIG1ldGhvZChgW3d4dF0gJHthcmdzLnNoaWZ0KCl9YCwgLi4uYXJncyk7XG5cdGVsc2UgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG59XG4vKiogV3JhcHBlciBhcm91bmQgYGNvbnNvbGVgIHdpdGggYSBcIlt3eHRdXCIgcHJlZml4ICovXG5jb25zdCBsb2dnZXIgPSB7XG5cdGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG5cdGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcblx0d2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG5cdGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGxvZ2dlciB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy50c1xudmFyIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgPSBjbGFzcyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuXHRzdGF0aWMgRVZFTlRfTkFNRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpsb2NhdGlvbmNoYW5nZVwiKTtcblx0Y29uc3RydWN0b3IobmV3VXJsLCBvbGRVcmwpIHtcblx0XHRzdXBlcihXeHRMb2NhdGlvbkNoYW5nZUV2ZW50LkVWRU5UX05BTUUsIHt9KTtcblx0XHR0aGlzLm5ld1VybCA9IG5ld1VybDtcblx0XHR0aGlzLm9sZFVybCA9IG9sZFVybDtcblx0fVxufTtcbi8qKlxuKiBSZXR1cm5zIGFuIGV2ZW50IG5hbWUgdW5pcXVlIHRvIHRoZSBleHRlbnNpb24gYW5kIGNvbnRlbnQgc2NyaXB0IHRoYXQnc1xuKiBydW5uaW5nLlxuKi9cbmZ1bmN0aW9uIGdldFVuaXF1ZUV2ZW50TmFtZShldmVudE5hbWUpIHtcblx0cmV0dXJuIGAke2Jyb3dzZXI/LnJ1bnRpbWU/LmlkfToke2ltcG9ydC5tZXRhLmVudi5FTlRSWVBPSU5UfToke2V2ZW50TmFtZX1gO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50LCBnZXRVbmlxdWVFdmVudE5hbWUgfTtcbiIsImltcG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgfSBmcm9tIFwiLi9jdXN0b20tZXZlbnRzLm1qc1wiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLnRzXG5jb25zdCBzdXBwb3J0c05hdmlnYXRpb25BcGkgPSB0eXBlb2YgZ2xvYmFsVGhpcy5uYXZpZ2F0aW9uPy5hZGRFdmVudExpc3RlbmVyID09PSBcImZ1bmN0aW9uXCI7XG4vKipcbiogQ3JlYXRlIGEgdXRpbCB0aGF0IHdhdGNoZXMgZm9yIFVSTCBjaGFuZ2VzLCBkaXNwYXRjaGluZyB0aGUgY3VzdG9tIGV2ZW50IHdoZW5cbiogZGV0ZWN0ZWQuIFN0b3BzIHdhdGNoaW5nIHdoZW4gY29udGVudCBzY3JpcHQgaXMgaW52YWxpZGF0ZWQuIFVzZXMgTmF2aWdhdGlvblxuKiBBUEkgd2hlbiBhdmFpbGFibGUsIG90aGVyd2lzZSBmYWxscyBiYWNrIHRvIHBvbGxpbmcuXG4qL1xuZnVuY3Rpb24gY3JlYXRlTG9jYXRpb25XYXRjaGVyKGN0eCkge1xuXHRsZXQgbGFzdFVybDtcblx0bGV0IHdhdGNoaW5nID0gZmFsc2U7XG5cdHJldHVybiB7IHJ1bigpIHtcblx0XHRpZiAod2F0Y2hpbmcpIHJldHVybjtcblx0XHR3YXRjaGluZyA9IHRydWU7XG5cdFx0bGFzdFVybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cdFx0aWYgKHN1cHBvcnRzTmF2aWdhdGlvbkFwaSkgZ2xvYmFsVGhpcy5uYXZpZ2F0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJuYXZpZ2F0ZVwiLCAoZXZlbnQpID0+IHtcblx0XHRcdGNvbnN0IG5ld1VybCA9IG5ldyBVUkwoZXZlbnQuZGVzdGluYXRpb24udXJsKTtcblx0XHRcdGlmIChuZXdVcmwuaHJlZiA9PT0gbGFzdFVybC5ocmVmKSByZXR1cm47XG5cdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIGxhc3RVcmwpKTtcblx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0fSwgeyBzaWduYWw6IGN0eC5zaWduYWwgfSk7XG5cdFx0ZWxzZSBjdHguc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRcdGlmIChuZXdVcmwuaHJlZiAhPT0gbGFzdFVybC5ocmVmKSB7XG5cdFx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0XHRsYXN0VXJsID0gbmV3VXJsO1xuXHRcdFx0fVxuXHRcdH0sIDFlMyk7XG5cdH0gfTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgY3JlYXRlTG9jYXRpb25XYXRjaGVyIH07XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2dnZXIubWpzXCI7XG5pbXBvcnQgeyBnZXRVbmlxdWVFdmVudE5hbWUgfSBmcm9tIFwiLi9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLm1qc1wiO1xuaW1wb3J0IHsgY3JlYXRlTG9jYXRpb25XYXRjaGVyIH0gZnJvbSBcIi4vaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci5tanNcIjtcbmltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvdXRpbHMvY29udGVudC1zY3JpcHQtY29udGV4dC50c1xuLyoqXG4qIEltcGxlbWVudHNcbiogW2BBYm9ydENvbnRyb2xsZXJgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQWJvcnRDb250cm9sbGVyKS5cbiogVXNlZCB0byBkZXRlY3QgYW5kIHN0b3AgY29udGVudCBzY3JpcHQgY29kZSB3aGVuIHRoZSBzY3JpcHQgaXMgaW52YWxpZGF0ZWQuXG4qXG4qIEl0IGFsc28gcHJvdmlkZXMgc2V2ZXJhbCB1dGlsaXRpZXMgbGlrZSBgY3R4LnNldFRpbWVvdXRgIGFuZFxuKiBgY3R4LnNldEludGVydmFsYCB0aGF0IHNob3VsZCBiZSB1c2VkIGluIGNvbnRlbnQgc2NyaXB0cyBpbnN0ZWFkIG9mXG4qIGB3aW5kb3cuc2V0VGltZW91dGAgb3IgYHdpbmRvdy5zZXRJbnRlcnZhbGAuXG4qXG4qIFRvIGNyZWF0ZSBjb250ZXh0IGZvciB0ZXN0aW5nLCB5b3UgY2FuIHVzZSB0aGUgY2xhc3MncyBjb25zdHJ1Y3RvcjpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfSBmcm9tICd3eHQvdXRpbHMvY29udGVudC1zY3JpcHRzLWNvbnRleHQnO1xuKlxuKiB0ZXN0KCdzdG9yYWdlIGxpc3RlbmVyIHNob3VsZCBiZSByZW1vdmVkIHdoZW4gY29udGV4dCBpcyBpbnZhbGlkYXRlZCcsICgpID0+IHtcbiogICBjb25zdCBjdHggPSBuZXcgQ29udGVudFNjcmlwdENvbnRleHQoJ3Rlc3QnKTtcbiogICBjb25zdCBpdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtKCdsb2NhbDpjb3VudCcsIHsgZGVmYXVsdFZhbHVlOiAwIH0pO1xuKiAgIGNvbnN0IHdhdGNoZXIgPSB2aS5mbigpO1xuKlxuKiAgIGNvbnN0IHVud2F0Y2ggPSBpdGVtLndhdGNoKHdhdGNoZXIpO1xuKiAgIGN0eC5vbkludmFsaWRhdGVkKHVud2F0Y2gpOyAvLyBMaXN0ZW4gZm9yIGludmFsaWRhdGUgaGVyZVxuKlxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMSk7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFdpdGgoMSwgMCk7XG4qXG4qICAgY3R4Lm5vdGlmeUludmFsaWRhdGVkKCk7IC8vIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIGludmFsaWRhdGUgdGhlIGNvbnRleHRcbiogICBhd2FpdCBpdGVtLnNldFZhbHVlKDIpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkVGltZXMoMSk7XG4qIH0pO1xuKiBgYGBcbiovXG52YXIgQ29udGVudFNjcmlwdENvbnRleHQgPSBjbGFzcyBDb250ZW50U2NyaXB0Q29udGV4dCB7XG5cdHN0YXRpYyBTQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6Y29udGVudC1zY3JpcHQtc3RhcnRlZFwiKTtcblx0aWQ7XG5cdGFib3J0Q29udHJvbGxlcjtcblx0bG9jYXRpb25XYXRjaGVyID0gY3JlYXRlTG9jYXRpb25XYXRjaGVyKHRoaXMpO1xuXHRjb25zdHJ1Y3Rvcihjb250ZW50U2NyaXB0TmFtZSwgb3B0aW9ucykge1xuXHRcdHRoaXMuY29udGVudFNjcmlwdE5hbWUgPSBjb250ZW50U2NyaXB0TmFtZTtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyKTtcblx0XHR0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcblx0XHR0aGlzLnN0b3BPbGRTY3JpcHRzKCk7XG5cdFx0dGhpcy5saXN0ZW5Gb3JOZXdlclNjcmlwdHMoKTtcblx0fVxuXHRnZXQgc2lnbmFsKCkge1xuXHRcdHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWw7XG5cdH1cblx0YWJvcnQocmVhc29uKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KHJlYXNvbik7XG5cdH1cblx0Z2V0IGlzSW52YWxpZCgpIHtcblx0XHRpZiAoYnJvd3Nlci5ydW50aW1lPy5pZCA9PSBudWxsKSB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0cmV0dXJuIHRoaXMuc2lnbmFsLmFib3J0ZWQ7XG5cdH1cblx0Z2V0IGlzVmFsaWQoKSB7XG5cdFx0cmV0dXJuICF0aGlzLmlzSW52YWxpZDtcblx0fVxuXHQvKipcblx0KiBBZGQgYSBsaXN0ZW5lciB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCdzIGNvbnRleHQgaXNcblx0KiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEBleGFtcGxlXG5cdCogICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKGNiKTtcblx0KiAgIGNvbnN0IHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIgPSBjdHgub25JbnZhbGlkYXRlZCgoKSA9PiB7XG5cdCogICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIoY2IpO1xuXHQqICAgfSk7XG5cdCogICAvLyAuLi5cblx0KiAgIHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIoKTtcblx0KlxuXHQqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lci5cblx0Ki9cblx0b25JbnZhbGlkYXRlZChjYikge1xuXHRcdHRoaXMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG5cdFx0cmV0dXJuICgpID0+IHRoaXMuc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCBjYik7XG5cdH1cblx0LyoqXG5cdCogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IG5ldmVyIHJlc29sdmVzLiBVc2VmdWwgaWYgeW91IGhhdmUgYW4gYXN5bmMgZnVuY3Rpb25cblx0KiB0aGF0IHNob3VsZG4ndCBydW4gYWZ0ZXIgdGhlIGNvbnRleHQgaXMgZXhwaXJlZC5cblx0KlxuXHQqIEBleGFtcGxlXG5cdCogICBjb25zdCBnZXRWYWx1ZUZyb21TdG9yYWdlID0gYXN5bmMgKCkgPT4ge1xuXHQqICAgICBpZiAoY3R4LmlzSW52YWxpZCkgcmV0dXJuIGN0eC5ibG9jaygpO1xuXHQqXG5cdCogICAgIC8vIC4uLlxuXHQqICAgfTtcblx0Ki9cblx0YmxvY2soKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHt9KTtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldEludGVydmFsYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBJbnRlcnZhbHMgY2FuIGJlIGNsZWFyZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjbGVhckludGVydmFsYCBmdW5jdGlvbi5cblx0Ki9cblx0c2V0SW50ZXJ2YWwoaGFuZGxlciwgdGltZW91dCkge1xuXHRcdGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhckludGVydmFsKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWxcblx0KiB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogVGltZW91dHMgY2FuIGJlIGNsZWFyZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBzZXRUaW1lb3V0YCBmdW5jdGlvbi5cblx0Ki9cblx0c2V0VGltZW91dChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcblx0XHR9LCB0aW1lb3V0KTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJUaW1lb3V0KGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2Vsc1xuXHQqIHRoZSByZXF1ZXN0IHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBDYWxsYmFja3MgY2FuIGJlIGNhbmNlbGVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2FuY2VsQW5pbWF0aW9uRnJhbWVgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuXHRcdGNvbnN0IGlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCguLi5hcmdzKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBjYWxsYmFjayguLi5hcmdzKTtcblx0XHR9KTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrYCB0aGF0IGF1dG9tYXRpY2FsbHkgY2FuY2VscyB0aGVcblx0KiByZXF1ZXN0IHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBDYWxsYmFja3MgY2FuIGJlIGNhbmNlbGVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2FuY2VsSWRsZUNhbGxiYWNrYFxuXHQqIGZ1bmN0aW9uLlxuXHQqL1xuXHRyZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0SWRsZUNhbGxiYWNrKCguLi5hcmdzKSA9PiB7XG5cdFx0XHRpZiAoIXRoaXMuc2lnbmFsLmFib3J0ZWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0sIG9wdGlvbnMpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxJZGxlQ2FsbGJhY2soaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0YWRkRXZlbnRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGhhbmRsZXIsIG9wdGlvbnMpIHtcblx0XHRpZiAodHlwZSA9PT0gXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIikge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgdGhpcy5sb2NhdGlvbldhdGNoZXIucnVuKCk7XG5cdFx0fVxuXHRcdHRhcmdldC5hZGRFdmVudExpc3RlbmVyPy4odHlwZS5zdGFydHNXaXRoKFwid3h0OlwiKSA/IGdldFVuaXF1ZUV2ZW50TmFtZSh0eXBlKSA6IHR5cGUsIGhhbmRsZXIsIHtcblx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRzaWduYWw6IHRoaXMuc2lnbmFsXG5cdFx0fSk7XG5cdH1cblx0LyoqXG5cdCogQGludGVybmFsXG5cdCogQWJvcnQgdGhlIGFib3J0IGNvbnRyb2xsZXIgYW5kIGV4ZWN1dGUgYWxsIGBvbkludmFsaWRhdGVkYCBsaXN0ZW5lcnMuXG5cdCovXG5cdG5vdGlmeUludmFsaWRhdGVkKCkge1xuXHRcdHRoaXMuYWJvcnQoXCJDb250ZW50IHNjcmlwdCBjb250ZXh0IGludmFsaWRhdGVkXCIpO1xuXHRcdGxvZ2dlci5kZWJ1ZyhgQ29udGVudCBzY3JpcHQgXCIke3RoaXMuY29udGVudFNjcmlwdE5hbWV9XCIgY29udGV4dCBpbnZhbGlkYXRlZGApO1xuXHR9XG5cdHN0b3BPbGRTY3JpcHRzKCkge1xuXHRcdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgeyBkZXRhaWw6IHtcblx0XHRcdGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuXHRcdFx0bWVzc2FnZUlkOiB0aGlzLmlkXG5cdFx0fSB9KSk7XG5cdFx0aWYgKCF0aGlzLm9wdGlvbnM/Lm5vU2NyaXB0U3RhcnRlZFBvc3RNZXNzYWdlKSB3aW5kb3cucG9zdE1lc3NhZ2Uoe1xuXHRcdFx0dHlwZTogQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLFxuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9LCBcIipcIik7XG5cdH1cblx0dmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSB7XG5cdFx0Y29uc3QgaXNTYW1lQ29udGVudFNjcmlwdCA9IGV2ZW50LmRldGFpbD8uY29udGVudFNjcmlwdE5hbWUgPT09IHRoaXMuY29udGVudFNjcmlwdE5hbWU7XG5cdFx0Y29uc3QgaXNGcm9tU2VsZiA9IGV2ZW50LmRldGFpbD8ubWVzc2FnZUlkID09PSB0aGlzLmlkO1xuXHRcdHJldHVybiBpc1NhbWVDb250ZW50U2NyaXB0ICYmICFpc0Zyb21TZWxmO1xuXHR9XG5cdGxpc3RlbkZvck5ld2VyU2NyaXB0cygpIHtcblx0XHRjb25zdCBjYiA9IChldmVudCkgPT4ge1xuXHRcdFx0aWYgKCEoZXZlbnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCkgfHwgIXRoaXMudmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSkgcmV0dXJuO1xuXHRcdFx0dGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuXHRcdH07XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsIGNiKTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsIGNiKSk7XG5cdH1cbn07XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IENvbnRlbnRTY3JpcHRDb250ZXh0IH07XG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMTAsMTEsMTIsMTMsMTQsMTVdLCJtYXBwaW5ncyI6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