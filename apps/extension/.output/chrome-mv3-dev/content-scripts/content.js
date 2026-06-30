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
	//#region providers/registry.ts
	var registry = /* @__PURE__ */ new Map();
	function register(provider) {
		if (registry.has(provider.id)) {
			console.warn(`Provider already registered: ${provider.id}`);
			return;
		}
		registry.set(provider.id, provider);
	}
	function detect() {
		for (const p of registry.values()) {
			const ctx = p.detect();
			if (ctx) return {
				provider: p,
				ctx
			};
		}
		return null;
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
    .dv-popup-learn{display:flex;align-items:center;gap:6px;padding:5px 8px;margin-bottom:6px;font-size:10px;font-weight:500;color:var(--dv-accent);background:color-mix(in srgb,var(--dv-accent) 8%,transparent);border-radius:6px}
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
		injectBaseStyles();
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
      <div class="dv-popup-card">
        <div class="dv-popup-card-body">
          <div class="dv-popup-card-title">${escapeHtml(action.label === ctx.label ? pageData.title : action.label)}</div>
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
		const saveBtn = popup.querySelector(".dv-popup-save");
		const errEl = popup.querySelector(".dv-popup-err");
		const closeBtn = popup.querySelector(".dv-popup-close");
		const thoughtInput = popup.querySelector("[data-thought]");
		closeBtn.onclick = () => popup.remove();
		saveBtn.onclick = async () => {
			saveBtn.textContent = "Saving...";
			saveBtn.disabled = true;
			errEl.style.display = "none";
			try {
				const payload = {
					provider: ctx.id,
					capabilities: [],
					page: {
						url: pageData.url,
						title: pageData.title,
						description: pageData.description,
						siteName: pageData.siteName,
						favicon: pageData.favicon,
						ogImage: pageData.ogImage
					},
					selection: selText ? { text: selText } : void 0,
					userInput: thoughtInput.value ? { thought: thoughtInput.value } : void 0,
					metadata: {
						...ctx.meta,
						siteId: pageData.siteId
					}
				};
				const res = await chrome.runtime.sendMessage({
					type: "capture",
					payload
				});
				if (res.success) {
					popup.remove();
					showToast$1(res.type ? `Saved as ${res.type.charAt(0).toUpperCase() + res.type.slice(1)}` : "Saved!");
				} else {
					errEl.textContent = res.error || "Failed";
					errEl.style.display = "block";
					saveBtn.textContent = "Save";
					saveBtn.disabled = false;
				}
			} catch (e) {
				console.error("Devventory save error:", e);
				errEl.textContent = "Could not connect";
				errEl.style.display = "block";
				saveBtn.textContent = "Save";
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
		thoughtInput?.focus();
		chrome.runtime.sendMessage({
			type: "get-context",
			payload: {
				url: pageData.url,
				provider: ctx.id
			}
		}, (res) => {
			if (res?.saved && res.count > 0) {
				const learnEl = popup.querySelector(".dv-popup-learn");
				if (learnEl) {
					learnEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--dv-accent)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Already saved — ${res.types.map((t) => `${t.count} ${t.type}`).join(" · ")}</span>`;
					learnEl.style.display = "flex";
				}
			}
		});
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
	register({
		id: "github-repo",
		label: "GitHub",
		urlPatterns: ["*://github.com/*"],
		capabilities: [
			"repository",
			"code",
			"issue",
			"pr",
			"summary",
			"tech-stack",
			"roadmap"
		],
		supportsSelection: true,
		supportsAI: true,
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
	});
	//#endregion
	//#region providers/youtube.ts
	init_ui();
	register({
		id: "youtube",
		label: "YouTube",
		urlPatterns: ["*://www.youtube.com/*", "*://youtu.be/*"],
		capabilities: [
			"video",
			"transcript",
			"key-points",
			"summary",
			"flashcard"
		],
		supportsSelection: false,
		supportsAI: true,
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
	});
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
	register({
		id: "docs",
		label: "Docs",
		urlPatterns: [
			"*://developer.mozilla.org/*",
			"*://react.dev/*",
			"*://nextjs.org/*",
			"*://tailwindcss.com/*",
			"*://svelte.dev/*",
			"*://*.dev/*"
		],
		capabilities: [
			"documentation",
			"explain",
			"cheatsheet",
			"summary"
		],
		supportsSelection: true,
		supportsAI: true,
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
	});
	register({
		id: "generic",
		label: "Page",
		urlPatterns: [],
		capabilities: ["page", "summary"],
		supportsSelection: true,
		supportsAI: true,
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
	});
	//#endregion
	//#region context-engine/index.ts
	var activeCleanup = null;
	var lastUrl = "";
	function mount() {
		if (activeCleanup) {
			activeCleanup();
			activeCleanup = null;
		}
		const result = detect();
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
		const result = detect();
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
		return detect()?.ctx || null;
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
				openPopup({
					id: "save",
					label: ctx?.label || document.title,
					description: "",
					icon: "",
					tab: "resource"
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
	function isCloudflareChallenge() {
		return document.querySelector("#cf-challenge-wrapper, #cf-please-wait, [id^='cf-challenge-']") !== null || document.title.includes("Just a moment") || document.body?.textContent?.includes("Checking your browser") || window.location.href.includes("__cf_chl_tk");
	}
	function waitForRealPage(maxMs = 3e4) {
		return new Promise((resolve) => {
			if (!isCloudflareChallenge()) return resolve();
			const interval = setInterval(() => {
				if (!isCloudflareChallenge()) {
					clearInterval(interval);
					resolve();
				}
			}, 2e3);
			setTimeout(() => clearInterval(interval), maxMs);
		});
	}
	function initUI() {
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
				openPopup({
					id: "save",
					label: ctx?.label || document.title,
					description: "",
					icon: "",
					tab: "resource"
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
		return unmount;
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
			"*://svelte.dev/*",
			"*://*.dev/*"
		],
		main() {
			if (isCloudflareChallenge()) {
				waitForRealPage().then(initUI);
				return;
			}
			const unmount = initUI();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyMC4xOS40M19lc2xpbnRAOS4zOS40X2ppdGlAMi43LjBfX2ppdGlAMi43LjBfcm9sbGRvd25AMS4xLjMvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi9wcm92aWRlcnMvcmVnaXN0cnkudHMiLCIuLi8uLi8uLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YS50cyIsIi4uLy4uLy4uL2NvbnRleHQtZW5naW5lL3VpLnRzIiwiLi4vLi4vLi4vY29udGV4dC1lbmdpbmUvcG9wdXAudHMiLCIuLi8uLi8uLi9wcm92aWRlcnMvZ2l0aHViLnRzIiwiLi4vLi4vLi4vcHJvdmlkZXJzL3lvdXR1YmUudHMiLCIuLi8uLi8uLi9wcm92aWRlcnMvZG9jcy50cyIsIi4uLy4uLy4uL3Byb3ZpZGVycy9nZW5lcmljLnRzIiwiLi4vLi4vLi4vY29udGV4dC1lbmdpbmUvaW5kZXgudHMiLCIuLi8uLi8uLi9lbnRyeXBvaW50cy9jb250ZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI3X0B0eXBlcytub2RlQDIwLjE5LjQzX2VzbGludEA5LjM5LjRfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuMy9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ad3h0LWRlditicm93c2VyQDAuMi4wL25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjAuMTkuNDNfZXNsaW50QDkuMzkuNF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS4zL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyMC4xOS40M19lc2xpbnRAOS4zOS40X2ppdGlAMi43LjBfX2ppdGlAMi43LjBfcm9sbGRvd25AMS4xLjMvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI3X0B0eXBlcytub2RlQDIwLjE5LjQzX2VzbGludEA5LjM5LjRfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuMy9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjAuMTkuNDNfZXNsaW50QDkuMzkuNF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS4zL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG5cdHJldHVybiBkZWZpbml0aW9uO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVDb250ZW50U2NyaXB0IH07XG4iLCJpbXBvcnQgdHlwZSB7IFByb3ZpZGVyLCBDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3R5cGVzXCI7XG5cbmNvbnN0IHJlZ2lzdHJ5ID0gbmV3IE1hcDxzdHJpbmcsIFByb3ZpZGVyPigpO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIocHJvdmlkZXI6IFByb3ZpZGVyKSB7XG4gIGlmIChyZWdpc3RyeS5oYXMocHJvdmlkZXIuaWQpKSB7XG4gICAgY29uc29sZS53YXJuKGBQcm92aWRlciBhbHJlYWR5IHJlZ2lzdGVyZWQ6ICR7cHJvdmlkZXIuaWR9YCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlZ2lzdHJ5LnNldChwcm92aWRlci5pZCwgcHJvdmlkZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0KCk6IHsgcHJvdmlkZXI6IFByb3ZpZGVyOyBjdHg6IENvbnRleHQgfSB8IG51bGwge1xuICBmb3IgKGNvbnN0IHAgb2YgcmVnaXN0cnkudmFsdWVzKCkpIHtcbiAgICBjb25zdCBjdHggPSBwLmRldGVjdCgpO1xuICAgIGlmIChjdHgpIHJldHVybiB7IHByb3ZpZGVyOiBwLCBjdHggfTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb3ZpZGVyKGlkOiBzdHJpbmcpOiBQcm92aWRlciB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiByZWdpc3RyeS5nZXQoaWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsUHJvdmlkZXJzKCk6IFByb3ZpZGVyW10ge1xuICByZXR1cm4gWy4uLnJlZ2lzdHJ5LnZhbHVlcygpXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybFBhdHRlcm5zKCk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcGF0dGVybnM6IHN0cmluZ1tdID0gW107XG4gIGZvciAoY29uc3QgcCBvZiByZWdpc3RyeS52YWx1ZXMoKSkge1xuICAgIGlmIChwLnVybFBhdHRlcm5zKSBwYXR0ZXJucy5wdXNoKC4uLnAudXJsUGF0dGVybnMpO1xuICB9XG4gIHJldHVybiBwYXR0ZXJucztcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRNZXRhKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBgbWV0YVtuYW1lPVwiJHtuYW1lfVwiXSwgbWV0YVtwcm9wZXJ0eT1cIm9nOiR7bmFtZX1cIl0sIG1ldGFbbmFtZT1cInR3aXR0ZXI6JHtuYW1lfVwiXWAsXG4gICk7XG4gIHJldHVybiAoZWwgYXMgSFRNTE1ldGFFbGVtZW50KT8uY29udGVudCB8fCBcIlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2l0ZU1ldGEoKSB7XG4gIHJldHVybiB7XG4gICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICBob3N0bmFtZTogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLFxuICAgIHRpdGxlOiBnZXRNZXRhKFwidGl0bGVcIikgfHwgZG9jdW1lbnQudGl0bGUsXG4gICAgZGVzY3JpcHRpb246IGdldE1ldGEoXCJkZXNjcmlwdGlvblwiKSB8fCBcIlwiLFxuICAgIGZhdmljb246XG4gICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxpbmtbcmVsfj0naWNvbiddXCIpIGFzIEhUTUxMaW5rRWxlbWVudCk/LmhyZWYgfHxcbiAgICAgIFwiL2Zhdmljb24uaWNvXCIsXG4gICAgc2l0ZU5hbWU6IGdldE1ldGEoXCJzaXRlX25hbWVcIikgfHwgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLFxuICAgIG9nSW1hZ2U6IGdldE1ldGEoXCJpbWFnZVwiKSB8fCBcIlwiLFxuICAgIHNlbGVjdGVkVGV4dDogd2luZG93LmdldFNlbGVjdGlvbigpPy50b1N0cmluZygpIHx8IFwiXCIsXG4gIH07XG59XG4iLCJpbXBvcnQgdHlwZSB7IEFjdGlvbiB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmxldCBpbmplY3RlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0QmFzZVN0eWxlcygpIHtcbiAgaWYgKGluamVjdGVkKSByZXR1cm47XG4gIGluamVjdGVkID0gdHJ1ZTtcbiAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIHN0eWxlLnRleHRDb250ZW50ID0gYFxuICAgIEBrZXlmcmFtZXMgZHYtdG9hc3QtaW57ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoOHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9fVxuICAgIEBrZXlmcmFtZXMgZHYtcG9we2Zyb217b3BhY2l0eTowO3RyYW5zZm9ybTpzY2FsZSgwLjcpfXRve29wYWNpdHk6MTt0cmFuc2Zvcm06c2NhbGUoMSl9fVxuICAgIEBrZXlmcmFtZXMgZHYtc2xpZGV7ZnJvbXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTRweCl9dG97b3BhY2l0eToxO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApfX1cblxuICAgIC8qIENoaXAg4oCUIHNtYWxsIHBpbGwgd2l0aCBvd24gdmFycyAoQnJhdmUgU2hpZWxkcyBzdHJpcHMgOnJvb3QgY3VzdG9tIHByb3BzKSAqL1xuICAgIC5kdi1jaGlwey0tZHYtYWNjZW50OiM2MzY2ZjE7LS1kdi1iZzojZmZmOy0tZHYtZmc6IzFhMWExYTstLWR2LW11dGVkOiM4YTkyOTk7LS1kdi1ib3JkZXI6I2U0ZTRlNzstLWR2LWNhcmQ6I2Y0ZjRmNTtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NHB4O3BhZGRpbmc6MnB4IDhweCAycHggNnB4O2JvcmRlci1yYWRpdXM6NnB4O2JvcmRlcjoxcHggc29saWQgdmFyKC0tZHYtYm9yZGVyKTtiYWNrZ3JvdW5kOnZhcigtLWR2LWJnKTtjb2xvcjp2YXIoLS1kdi1hY2NlbnQpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjUwMDtjdXJzb3I6cG9pbnRlcjtmb250LWZhbWlseTotYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxcIlNlZ29lIFVJXCIsUm9ib3RvLHNhbnMtc2VyaWY7dHJhbnNpdGlvbjphbGwgMC4xNXM7d2hpdGUtc3BhY2U6bm93cmFwO3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtsaW5lLWhlaWdodDpub3JtYWw7Ym94LXNoYWRvdzpub25lO3VzZXItc2VsZWN0Om5vbmV9XG4gICAgQG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmRhcmspey5kdi1jaGlwey0tZHYtYWNjZW50OiM4MThjZjg7LS1kdi1iZzojMGEwYTBhOy0tZHYtZmc6I2ZhZmFmYTstLWR2LW11dGVkOiM4YTkyOTk7LS1kdi1ib3JkZXI6IzI3MjcyYTstLWR2LWNhcmQ6IzE4MTgxYn19XG4gICAgLmR2LWNoaXA6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kdi1jYXJkKTtib3JkZXItY29sb3I6dmFyKC0tZHYtYWNjZW50KTtib3gtc2hhZG93OjAgMXB4IDRweCByZ2JhKDAsMCwwLDAuMDgpfVxuICAgIC5kdi1jaGlwIHN2Z3t3aWR0aDoxMnB4O2hlaWdodDoxMnB4O2ZsZXgtc2hyaW5rOjB9XG5cbiAgICAvKiBBY3Rpb24gbWVudSDigJQgc21hbGwgZHJvcGRvd24gYmVsb3cgY2hpcCAqL1xuICAgIC5kdi1tZW51ey0tZHYtYWNjZW50OiM2MzY2ZjE7LS1kdi1iZzojZmZmOy0tZHYtZmc6IzFhMWExYTstLWR2LW11dGVkOiM4YTkyOTk7LS1kdi1ib3JkZXI6I2U0ZTRlNzstLWR2LWNhcmQ6I2Y0ZjRmNTtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjIxNDc0ODM2NDY7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kdi1ib3JkZXIpO2JvcmRlci1yYWRpdXM6OHB4O2JveC1zaGFkb3c6MCA0cHggMTZweCByZ2JhKDAsMCwwLDAuMTIpO3BhZGRpbmc6NHB4O21pbi13aWR0aDoxODBweDthbmltYXRpb246ZHYtc2xpZGUgMC4xMnMgY3ViaWMtYmV6aWVyKDAuMTYsMSwwLjMsMSk7Zm9udC1mYW1pbHk6LWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsXCJTZWdvZSBVSVwiLFJvYm90byxzYW5zLXNlcmlmfVxuICAgIEBtZWRpYShwcmVmZXJzLWNvbG9yLXNjaGVtZTpkYXJrKXsuZHYtbWVudXstLWR2LWFjY2VudDojODE4Y2Y4Oy0tZHYtYmc6IzBhMGEwYTstLWR2LWZnOiNmYWZhZmE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiMyNzI3MmE7LS1kdi1jYXJkOiMxODE4MWJ9fVxuICAgIC5kdi1tZW51LWl0ZW17ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmc6NnB4IDhweDtib3JkZXI6bm9uZTtiYWNrZ3JvdW5kOm5vbmU7Y3Vyc29yOnBvaW50ZXI7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tZHYtZmcpO2JvcmRlci1yYWRpdXM6NXB4O3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpsZWZ0O3RyYW5zaXRpb246YmFja2dyb3VuZCAwLjFzfVxuICAgIC5kdi1tZW51LWl0ZW06aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kdi1jYXJkKX1cbiAgICAuZHYtbWVudS1pdGVtIHN2Z3t3aWR0aDoxM3B4O2hlaWdodDoxM3B4O2NvbG9yOnZhcigtLWR2LWFjY2VudCk7ZmxleC1zaHJpbms6MH1cbiAgICAuZHYtbWVudS1pdGVtIHNwYW57ZmxleDoxfVxuICAgIC5kdi1tZW51LWl0ZW0gc21hbGx7Y29sb3I6dmFyKC0tZHYtbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fVxuXG4gICAgLyogSW5saW5lIHBvcHVwIChyZXVzZWQgZnJvbSBjb250ZW50KSAqL1xuICAgIC5kdi1mbG9hdHtmb250LWZhbWlseTotYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxcIlNlZ29lIFVJXCIsUm9ib3RvLHNhbnMtc2VyaWY7Ym94LXNpemluZzpib3JkZXItYm94O3otaW5kZXg6MjE0NzQ4MzY0NjstLWR2LWFjY2VudDojNjM2NmYxOy0tZHYtYmc6I2ZmZjstLWR2LWZnOiMxYTFhMWE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiNlNGU0ZTc7LS1kdi1jYXJkOiNmNGY0ZjV9XG4gICAgQG1lZGlhKHByZWZlcnMtY29sb3Itc2NoZW1lOmRhcmspey5kdi1mbG9hdHstLWR2LWFjY2VudDojODE4Y2Y4Oy0tZHYtYmc6IzBhMGEwYTstLWR2LWZnOiNmYWZhZmE7LS1kdi1tdXRlZDojOGE5Mjk5Oy0tZHYtYm9yZGVyOiMyNzI3MmE7LS1kdi1jYXJkOiMxODE4MWJ9fVxuICAgIC5kdi1mbG9hdC1idG57cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MjhweDtoZWlnaHQ6MjhweDtib3JkZXItcmFkaXVzOjUwJTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLWR2LWJvcmRlcik7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Y29sb3I6dmFyKC0tZHYtYWNjZW50KTtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7Ym94LXNoYWRvdzowIDJweCA4cHggcmdiYSgwLDAsMCwwLjEpO3BhZGRpbmc6MDthbmltYXRpb246ZHYtcG9wIDAuMTVzIGN1YmljLWJlemllcigwLjE2LDEsMC4zLDEpfVxuICAgIC5kdi1mbG9hdC1idG46aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kdi1jYXJkKTt0cmFuc2Zvcm06c2NhbGUoMS4xKX1cbiAgICAuZHYtcG9wdXB7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MzQwcHg7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kdi1ib3JkZXIpO2JvcmRlci1yYWRpdXM6MTJweDtib3gtc2hhZG93OjAgOHB4IDMycHggcmdiYSgwLDAsMCwwLjE1KTtvdmVyZmxvdzpoaWRkZW47YW5pbWF0aW9uOmR2LXBvcCAwLjE1cyBjdWJpYy1iZXppZXIoMC4xNiwxLDAuMywxKX1cbiAgICAuZHYtcG9wdXAtaGRye2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjhweCAxMnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLWR2LWJvcmRlcil9XG4gICAgLmR2LXBvcHVwLXRpdGxle2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjYwMDtmbGV4OjE7Y29sb3I6dmFyKC0tZHYtZmcpfVxuICAgIC5kdi1wb3B1cC1jbG9zZXtiYWNrZ3JvdW5kOm5vbmU7Ym9yZGVyOm5vbmU7Y3Vyc29yOnBvaW50ZXI7Y29sb3I6dmFyKC0tZHYtbXV0ZWQpO3BhZGRpbmc6MnB4IDRweDtmb250LXNpemU6MTRweDtib3JkZXItcmFkaXVzOjRweH1cbiAgICAuZHYtcG9wdXAtY2xvc2U6aG92ZXJ7YmFja2dyb3VuZDp2YXIoLS1kdi1jYXJkKTtjb2xvcjp2YXIoLS1kdi1mZyl9XG4gICAgLmR2LXBvcHVwLWJvZHl7cGFkZGluZzo4cHggMTJweCAxMHB4fVxuICAgIC5kdi1wb3B1cC1sZWFybntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzo1cHggOHB4O21hcmdpbi1ib3R0b206NnB4O2ZvbnQtc2l6ZToxMHB4O2ZvbnQtd2VpZ2h0OjUwMDtjb2xvcjp2YXIoLS1kdi1hY2NlbnQpO2JhY2tncm91bmQ6Y29sb3ItbWl4KGluIHNyZ2IsdmFyKC0tZHYtYWNjZW50KSA4JSx0cmFuc3BhcmVudCk7Ym9yZGVyLXJhZGl1czo2cHh9XG4gICAgLmR2LXBvcHVwLWNhcmR7YmFja2dyb3VuZDp2YXIoLS1kdi1jYXJkKTtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjhweCAxMHB4O21hcmdpbi1ib3R0b206OHB4fVxuICAgIC5kdi1wb3B1cC1jYXJkLWJvZHl7bWluLXdpZHRoOjB9XG4gICAgLmR2LXBvcHVwLWNhcmQtdGl0bGV7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NTAwO2xpbmUtaGVpZ2h0OjEuMztvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7Y29sb3I6dmFyKC0tZHYtZmcpfVxuICAgIC5kdi1wb3B1cC1jYXJkLXVybHtmb250LXNpemU6MTBweDtjb2xvcjp2YXIoLS1kdi1tdXRlZCk7bWFyZ2luLXRvcDoxcHg7b3ZlcmZsb3c6aGlkZGVuO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwfVxuICAgIC5kdi1wb3B1cC1iYWRnZXtkaXNwbGF5OmlubGluZS1ibG9jaztmb250LXNpemU6OXB4O2ZvbnQtd2VpZ2h0OjYwMDtwYWRkaW5nOjFweCA1cHg7Ym9yZGVyLXJhZGl1czo0cHg7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Y29sb3I6dmFyKC0tZHYtbXV0ZWQpO21hcmdpbi10b3A6NHB4fVxuICAgIC5kdi1wb3B1cC1zZWx7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tZHYtbXV0ZWQpO2JhY2tncm91bmQ6dmFyKC0tZHYtY2FyZCk7cGFkZGluZzo2cHggOHB4O2JvcmRlci1yYWRpdXM6NnB4O21hcmdpbi1ib3R0b206OHB4O21heC1oZWlnaHQ6NDhweDtvdmVyZmxvdzpoaWRkZW47bGluZS1oZWlnaHQ6MS40O3Bvc2l0aW9uOnJlbGF0aXZlfVxuICAgIC5kdi1wb3B1cC1zZWw6OmFmdGVye2NvbnRlbnQ6XCJcIjtwb3NpdGlvbjphYnNvbHV0ZTtib3R0b206MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MTZweDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCx2YXIoLS1kdi1jYXJkKSk7cG9pbnRlci1ldmVudHM6bm9uZX1cbiAgICAuZHYtcG9wdXAtaW5wdXR7d2lkdGg6MTAwJTtwYWRkaW5nOjdweCA5cHg7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1kdi1ib3JkZXIpO2JvcmRlci1yYWRpdXM6NnB4O2ZvbnQtc2l6ZToxMnB4O291dGxpbmU6bm9uZTtmb250LWZhbWlseTppbmhlcml0O3Jlc2l6ZTpub25lO21pbi1oZWlnaHQ6MzZweDtjb2xvcjp2YXIoLS1kdi1mZyk7YmFja2dyb3VuZDp2YXIoLS1kdi1iZyk7Ym94LXNpemluZzpib3JkZXItYm94fVxuICAgIC5kdi1wb3B1cC1pbnB1dDpmb2N1c3tib3JkZXItY29sb3I6dmFyKC0tZHYtYWNjZW50KTtib3gtc2hhZG93OjAgMCAwIDNweCBjb2xvci1taXgoaW4gc3JnYix2YXIoLS1kdi1hY2NlbnQpIDE1JSx0cmFuc3BhcmVudCl9XG4gICAgLmR2LXBvcHVwLXNhdmV7d2lkdGg6MTAwJTttYXJnaW4tdG9wOjhweDtwYWRkaW5nOjdweDtiYWNrZ3JvdW5kOnZhcigtLWR2LWFjY2VudCk7Y29sb3I6I2ZmZjtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjZweDtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo1MDA7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpvcGFjaXR5IDAuMTVzfVxuICAgIC5kdi1wb3B1cC1zYXZlOmhvdmVye29wYWNpdHk6MC45fVxuICAgIC5kdi1wb3B1cC1zYXZlOmRpc2FibGVke29wYWNpdHk6MC40O2N1cnNvcjpkZWZhdWx0fVxuICAgIC5kdi1wb3B1cC1lcnJ7Y29sb3I6I2VmNDQ0NDtmb250LXNpemU6MTFweDtwYWRkaW5nOjRweCAwO21hcmdpbi10b3A6NHB4O2Rpc3BsYXk6bm9uZX1cbiAgYDtcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaGlwKGljb246IHN0cmluZywgbGFiZWw6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgaW5qZWN0QmFzZVN0eWxlcygpO1xuICBjb25zdCBjaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY2hpcC5jbGFzc05hbWUgPSBcImR2LWNoaXBcIjtcbiAgY2hpcC5pbm5lckhUTUwgPSBgPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIiR7aWNvbn1cIi8+PC9zdmc+JHtsYWJlbH1gO1xuICByZXR1cm4gY2hpcDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dNZW51KFxuICBhbmNob3I6IEVsZW1lbnQsXG4gIGFjdGlvbnM6IEFjdGlvbltdLFxuICBvblNlbGVjdDogKGFjdGlvbjogQWN0aW9uKSA9PiB2b2lkLFxuKSB7XG4gIGNvbnN0IGV4aXN0aW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kdi1tZW51XCIpO1xuICBpZiAoZXhpc3RpbmcpIGV4aXN0aW5nLnJlbW92ZSgpO1xuXG4gIGNvbnN0IG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBtZW51LmNsYXNzTmFtZSA9IFwiZHYtbWVudVwiO1xuXG4gIGFjdGlvbnMuZm9yRWFjaCgoYSkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGl0ZW0uY2xhc3NOYW1lID0gXCJkdi1tZW51LWl0ZW1cIjtcbiAgICBpdGVtLmlubmVySFRNTCA9IGA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiJHthLmljb259XCIvPjwvc3ZnPjxzcGFuPiR7YS5sYWJlbH08L3NwYW4+PHNtYWxsPiR7YS5kZXNjcmlwdGlvbn08L3NtYWxsPmA7XG4gICAgaXRlbS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtZW51LnJlbW92ZSgpO1xuICAgICAgb25TZWxlY3QoYSk7XG4gICAgfTtcbiAgICBtZW51LmFwcGVuZENoaWxkKGl0ZW0pO1xuICB9KTtcblxuICBjb25zdCByZWN0ID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBtZW51LnN0eWxlLnRvcCA9IGAke3JlY3QuYm90dG9tICsgd2luZG93LnNjcm9sbFkgKyA0fXB4YDtcbiAgbWVudS5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5taW4ocmVjdC5sZWZ0ICsgd2luZG93LnNjcm9sbFgsIHdpbmRvdy5pbm5lcldpZHRoIC0gMjAwKX1weGA7XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtZW51KTtcblxuICBjb25zdCBjbG9zZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKCFtZW51LmNvbnRhaW5zKGUudGFyZ2V0IGFzIE5vZGUpICYmIGUudGFyZ2V0ICE9PSBhbmNob3IpIHtcbiAgICAgIG1lbnUucmVtb3ZlKCk7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGNsb3NlKTtcbiAgICB9XG4gIH07XG4gIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBjbG9zZSksIDApO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBBY3Rpb24sIENvbnRleHQgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgaW5qZWN0QmFzZVN0eWxlcyB9IGZyb20gXCIuL3VpXCI7XG5pbXBvcnQgdHlwZSB7IENhcHR1cmVQYXlsb2FkLCBMZWFybmluZ0NvbnRleHQgfSBmcm9tIFwiLi4vbGliL3R5cGVzXCI7XG5cbmNvbnN0IFNJVEVfTEFCRUxTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBcImdpdGh1Yi1yZXBvXCI6IFwiR2l0SHViIFJlcG9cIixcbiAgXCJnaXRodWItZmlsZVwiOiBcIkZpbGVcIixcbiAgXCJnaXRodWItcHJcIjogXCJQUlwiLFxuICBcImdpdGh1Yi1pc3N1ZVwiOiBcIklzc3VlXCIsXG4gIHlvdXR1YmU6IFwiWW91VHViZVwiLFxuICBtZG46IFwiTUROXCIsXG4gIHN0YWNrb3ZlcmZsb3c6IFwiU3RhY2sgT3ZlcmZsb3dcIixcbiAgZG9jczogXCJEb2NzXCIsXG4gIGJsb2c6IFwiQmxvZ1wiLFxuICBhcnRpY2xlOiBcIkFydGljbGVcIixcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuUG9wdXAoYWN0aW9uOiBBY3Rpb24sIGN0eDogQ29udGV4dCwgcmVjdD86IERPTVJlY3QgfCBudWxsKSB7XG4gIGluamVjdEJhc2VTdHlsZXMoKTtcbiAgY2xlYXJFeGlzdGluZygpO1xuXG4gIGNvbnN0IHBhZ2VEYXRhID0gY3R4LnBhZ2VEYXRhO1xuICBjb25zdCBzZWxUZXh0ID0gcGFnZURhdGEuc2VsZWN0ZWRUZXh0IHx8IFwiXCI7XG4gIGNvbnN0IGJhZGdlID0gcGFnZURhdGEuc2l0ZUlkICYmIFNJVEVfTEFCRUxTW3BhZ2VEYXRhLnNpdGVJZF07XG4gIGNvbnN0IHJlcG9QYXRoID1cbiAgICBjdHgubWV0YS5vd25lciAmJiBjdHgubWV0YS5yZXBvXG4gICAgICA/IGAvJHtjdHgubWV0YS5vd25lcn0vJHtjdHgubWV0YS5yZXBvfWBcbiAgICAgIDogXCJcIjtcblxuICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHBvcHVwLmNsYXNzTmFtZSA9IFwiZHYtZmxvYXQgZHYtcG9wdXBcIjtcblxuICBjb25zdCBkaXNwbGF5VGl0bGUgPSBhY3Rpb24ubGFiZWwgPT09IGN0eC5sYWJlbCA/IHBhZ2VEYXRhLnRpdGxlIDogYWN0aW9uLmxhYmVsO1xuXG4gIHBvcHVwLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtaGRyXCI+XG4gICAgICA8c3ZnIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWR2LWFjY2VudClcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBhdGggZD1cIk0xMiAzYTYgNiAwIDAgMC02IDZ2MWgxMlY5YTYgNiAwIDAgMC02LTZ6XCIvPjxwYXRoIGQ9XCJNOCAxNHYxYTQgNCAwIDAgMCA4IDB2LTFcIi8+PC9zdmc+XG4gICAgICA8c3BhbiBjbGFzcz1cImR2LXBvcHVwLXRpdGxlXCI+RGV2dmVudG9yeTwvc3Bhbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJkdi1wb3B1cC1jbG9zZVwiPuKclTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJkdi1wb3B1cC1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtY2FyZFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtY2FyZC1ib2R5XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImR2LXBvcHVwLWNhcmQtdGl0bGVcIj4ke2VzY2FwZUh0bWwoZGlzcGxheVRpdGxlKX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtY2FyZC11cmxcIj4ke2VzY2FwZUh0bWwocGFnZURhdGEuaG9zdG5hbWUpfSR7ZXNjYXBlSHRtbChyZXBvUGF0aCl9PC9kaXY+XG4gICAgICAgICAgJHtiYWRnZSA/IGA8c3BhbiBjbGFzcz1cImR2LXBvcHVwLWJhZGdlXCI+JHtiYWRnZX08L3NwYW4+YCA6IFwiXCJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwiZHYtcG9wdXAtbGVhcm5cIiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPjwvZGl2PlxuICAgICAgJHtzZWxUZXh0ID8gYDxkaXYgY2xhc3M9XCJkdi1wb3B1cC1zZWxcIj4ke2VzY2FwZUh0bWwoc2VsVGV4dC5zbGljZSgwLCAzMDApKX08L2Rpdj5gIDogXCJcIn1cbiAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImR2LXBvcHVwLWlucHV0XCIgZGF0YS10aG91Z2h0IHBsYWNlaG9sZGVyPVwiV2hhdCBhcmUgeW91IHRyeWluZyB0byBrZWVwP1wiIHJvd3M9XCIyXCI+PC90ZXh0YXJlYT5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJkdi1wb3B1cC1zYXZlXCI+U2F2ZTwvYnV0dG9uPlxuICAgICAgPGRpdiBjbGFzcz1cImR2LXBvcHVwLWVyclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIGA7XG5cbiAgY29uc3Qgc2F2ZUJ0biA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoXCIuZHYtcG9wdXAtc2F2ZVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgZXJyRWwgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwLWVyclwiKSBhcyBIVE1MRWxlbWVudDtcbiAgY29uc3QgY2xvc2VCdG4gPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwLWNsb3NlXCIpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCB0aG91Z2h0SW5wdXQgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtdGhvdWdodF1cIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcblxuICBjbG9zZUJ0bi5vbmNsaWNrID0gKCkgPT4gcG9wdXAucmVtb3ZlKCk7XG5cbiAgc2F2ZUJ0bi5vbmNsaWNrID0gYXN5bmMgKCkgPT4ge1xuICAgIHNhdmVCdG4udGV4dENvbnRlbnQgPSBcIlNhdmluZy4uLlwiO1xuICAgIChzYXZlQnRuIGFzIEhUTUxCdXR0b25FbGVtZW50KS5kaXNhYmxlZCA9IHRydWU7XG4gICAgZXJyRWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBheWxvYWQ6IENhcHR1cmVQYXlsb2FkID0ge1xuICAgICAgICBwcm92aWRlcjogY3R4LmlkLFxuICAgICAgICBjYXBhYmlsaXRpZXM6IFtdLFxuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgdXJsOiBwYWdlRGF0YS51cmwsXG4gICAgICAgICAgdGl0bGU6IHBhZ2VEYXRhLnRpdGxlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBwYWdlRGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgICBzaXRlTmFtZTogcGFnZURhdGEuc2l0ZU5hbWUsXG4gICAgICAgICAgZmF2aWNvbjogcGFnZURhdGEuZmF2aWNvbixcbiAgICAgICAgICBvZ0ltYWdlOiBwYWdlRGF0YS5vZ0ltYWdlLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3Rpb246IHNlbFRleHQgPyB7IHRleHQ6IHNlbFRleHQgfSA6IHVuZGVmaW5lZCxcbiAgICAgICAgdXNlcklucHV0OiB0aG91Z2h0SW5wdXQudmFsdWUgPyB7IHRob3VnaHQ6IHRob3VnaHRJbnB1dC52YWx1ZSB9IDogdW5kZWZpbmVkLFxuICAgICAgICBtZXRhZGF0YTogeyAuLi5jdHgubWV0YSwgc2l0ZUlkOiBwYWdlRGF0YS5zaXRlSWQgfSxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogXCJjYXB0dXJlXCIsIHBheWxvYWQgfSkgYXMgeyBzdWNjZXNzPzogYm9vbGVhbjsgZXJyb3I/OiBzdHJpbmc7IHR5cGU/OiBzdHJpbmcgfTtcblxuICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgIHBvcHVwLnJlbW92ZSgpO1xuICAgICAgICBzaG93VG9hc3QocmVzLnR5cGUgPyBgU2F2ZWQgYXMgJHtyZXMudHlwZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHJlcy50eXBlLnNsaWNlKDEpfWAgOiBcIlNhdmVkIVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVyckVsLnRleHRDb250ZW50ID0gcmVzLmVycm9yIHx8IFwiRmFpbGVkXCI7XG4gICAgICAgIGVyckVsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHNhdmVCdG4udGV4dENvbnRlbnQgPSBcIlNhdmVcIjtcbiAgICAgICAgKHNhdmVCdG4gYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkRldnZlbnRvcnkgc2F2ZSBlcnJvcjpcIiwgZSk7XG4gICAgICBlcnJFbC50ZXh0Q29udGVudCA9IFwiQ291bGQgbm90IGNvbm5lY3RcIjtcbiAgICAgIGVyckVsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICBzYXZlQnRuLnRleHRDb250ZW50ID0gXCJTYXZlXCI7XG4gICAgICAoc2F2ZUJ0biBhcyBIVE1MQnV0dG9uRWxlbWVudCkuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHJlY3QpIHtcbiAgICBjb25zdCBzY3JvbGxYID0gd2luZG93LnNjcm9sbFg7XG4gICAgY29uc3Qgc2Nyb2xsWSA9IHdpbmRvdy5zY3JvbGxZO1xuICAgIGNvbnN0IHRvcCA9IHJlY3QudG9wICsgc2Nyb2xsWSArIDE2O1xuICAgIHBvcHVwLnN0eWxlLnRvcCA9XG4gICAgICB0b3AgKyAzMDAgPCB3aW5kb3cuaW5uZXJIZWlnaHQgKyBzY3JvbGxZXG4gICAgICAgID8gYCR7dG9wfXB4YFxuICAgICAgICA6IGAke3JlY3QudG9wICsgc2Nyb2xsWSAtIDMwMH1weGA7XG4gICAgcG9wdXAuc3R5bGUubGVmdCA9IGAke01hdGgubWluKHJlY3QubGVmdCArIHNjcm9sbFgsIHdpbmRvdy5pbm5lcldpZHRoIC0gMzUwICsgc2Nyb2xsWCl9cHhgO1xuICB9IGVsc2Uge1xuICAgIHBvcHVwLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgIHBvcHVwLnN0eWxlLnRvcCA9IFwiNTAlXCI7XG4gICAgcG9wdXAuc3R5bGUubGVmdCA9IFwiNTAlXCI7XG4gICAgcG9wdXAuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIjtcbiAgfVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocG9wdXApO1xuICB0aG91Z2h0SW5wdXQ/LmZvY3VzKCk7XG5cbiAgLy8gRmV0Y2ggbGVhcm5pbmcgY29udGV4dCAobm9uLWJsb2NraW5nKVxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcbiAgICB7IHR5cGU6IFwiZ2V0LWNvbnRleHRcIiwgcGF5bG9hZDogeyB1cmw6IHBhZ2VEYXRhLnVybCwgcHJvdmlkZXI6IGN0eC5pZCB9IH0sXG4gICAgKHJlczogTGVhcm5pbmdDb250ZXh0KSA9PiB7XG4gICAgICBpZiAocmVzPy5zYXZlZCAmJiByZXMuY291bnQgPiAwKSB7XG4gICAgICAgIGNvbnN0IGxlYXJuRWwgPSBwb3B1cC5xdWVyeVNlbGVjdG9yKFwiLmR2LXBvcHVwLWxlYXJuXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAobGVhcm5FbCkge1xuICAgICAgICAgIGNvbnN0IGl0ZW1zID0gcmVzLnR5cGVzLm1hcCh0ID0+IGAke3QuY291bnR9ICR7dC50eXBlfWApLmpvaW4oXCIgwrcgXCIpO1xuICAgICAgICAgIGxlYXJuRWwuaW5uZXJIVE1MID0gYDxzdmcgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjEyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIHN0eWxlPVwiZmxleC1zaHJpbms6MDtjb2xvcjp2YXIoLS1kdi1hY2NlbnQpXCI+PHBhdGggZD1cIk0yMiAxMS4wOFYxMmExMCAxMCAwIDEgMS01LjkzLTkuMTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjIyIDQgMTIgMTQuMDEgOSAxMS4wMVwiLz48L3N2Zz48c3Bhbj5BbHJlYWR5IHNhdmVkIOKAlCAke2l0ZW1zfTwvc3Bhbj5gO1xuICAgICAgICAgIGxlYXJuRWwuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gY2xlYXJFeGlzdGluZygpIHtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kdi1wb3B1cCwgLmR2LWZsb2F0LWJ0blwiKS5mb3JFYWNoKChlKSA9PiBlLnJlbW92ZSgpKTtcbn1cblxuZnVuY3Rpb24gc2hvd1RvYXN0KG1lc3NhZ2U6IHN0cmluZykge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgT2JqZWN0LmFzc2lnbihlbC5zdHlsZSwge1xuICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgYm90dG9tOiBcIjI0cHhcIixcbiAgICByaWdodDogXCIyNHB4XCIsXG4gICAgekluZGV4OiBcIjIxNDc0ODM2NDdcIixcbiAgICBwYWRkaW5nOiBcIjEwcHggMTZweFwiLFxuICAgIGJhY2tncm91bmQ6IFwiIzYzNjZmMVwiLFxuICAgIGNvbG9yOiBcIiNmZmZcIixcbiAgICBib3JkZXJSYWRpdXM6IFwiOHB4XCIsXG4gICAgZm9udFNpemU6IFwiMTJweFwiLFxuICAgIGZvbnRXZWlnaHQ6IFwiNTAwXCIsXG4gICAgYm94U2hhZG93OiBcIjAgNHB4IDEycHggcmdiYSgwLDAsMCwwLjEpXCIsXG4gICAgYW5pbWF0aW9uOiBcImR2LXRvYXN0LWluIDAuMnMgZWFzZS1vdXRcIixcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICBzZXRUaW1lb3V0KCgpID0+IGVsLnJlbW92ZSgpLCAyNTAwKTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlSHRtbChzOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc1xuICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFByb3ZpZGVyLCBDb250ZXh0LCBBY3Rpb24gfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvdHlwZXNcIjtcbmltcG9ydCB7IGdldFNpdGVNZXRhIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL21ldGFkYXRhXCI7XG5pbXBvcnQgeyBjcmVhdGVDaGlwLCBzaG93TWVudSB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS91aVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tIFwiLi9yZWdpc3RyeVwiO1xuXG5jb25zdCBwcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIGlkOiBcImdpdGh1Yi1yZXBvXCIsXG4gIGxhYmVsOiBcIkdpdEh1YlwiLFxuICB1cmxQYXR0ZXJuczogW1wiKjovL2dpdGh1Yi5jb20vKlwiXSxcbiAgY2FwYWJpbGl0aWVzOiBbXCJyZXBvc2l0b3J5XCIsIFwiY29kZVwiLCBcImlzc3VlXCIsIFwicHJcIiwgXCJzdW1tYXJ5XCIsIFwidGVjaC1zdGFja1wiLCBcInJvYWRtYXBcIl0sXG4gIHN1cHBvcnRzU2VsZWN0aW9uOiB0cnVlLFxuICBzdXBwb3J0c0FJOiB0cnVlLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgY29uc3QgeyBob3N0bmFtZSwgcGF0aG5hbWUgfSA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICBpZiAoaG9zdG5hbWUgIT09IFwiZ2l0aHViLmNvbVwiKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IHBhcnRzID0gcGF0aG5hbWUuc3BsaXQoXCIvXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBbb3duZXIsIHJlcG9dID0gcGFydHM7XG4gICAgY29uc3QgcGFnZVR5cGUgPVxuICAgICAgcGFydHMubGVuZ3RoID09PSAyXG4gICAgICAgID8gXCJnaXRodWItcmVwb1wiXG4gICAgICAgIDogcGFydHNbMl0gPT09IFwicHVsbFwiXG4gICAgICAgICAgPyBcImdpdGh1Yi1wclwiXG4gICAgICAgICAgOiBwYXJ0c1syXSA9PT0gXCJpc3N1ZXNcIlxuICAgICAgICAgICAgPyBcImdpdGh1Yi1pc3N1ZVwiXG4gICAgICAgICAgICA6IHBhcnRzLmxlbmd0aCA+IDJcbiAgICAgICAgICAgICAgPyBcImdpdGh1Yi1maWxlXCJcbiAgICAgICAgICAgICAgOiBcImdpdGh1Yi1yZXBvXCI7XG5cbiAgICBjb25zdCBzdGFyRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtdGVzdGlkPSdzdGFyZ2F6ZXJzLWNvdW50J11cIik7XG4gICAgY29uc3Qgc3RhcnMgPSBzdGFyRWxcbiAgICAgID8gcGFyc2VJbnQoc3RhckVsLnRleHRDb250ZW50Py5yZXBsYWNlKC8sL2csIFwiXCIpIHx8IFwiMFwiLCAxMCkgfHwgdW5kZWZpbmVkXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGxhbmdFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbaXRlbXByb3A9J3Byb2dyYW1taW5nTGFuZ3VhZ2UnXVwiKTtcbiAgICBjb25zdCBsYW5ndWFnZSA9IGxhbmdFbD8udGV4dENvbnRlbnQgfHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZGVzY0VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwicC5mNC5tdC0zLCBbZGF0YS10ZXN0aWQ9J3JlcG8tZGVzY3JpcHRpb24nXVwiLFxuICAgICk7XG5cbiAgICBjb25zdCBtZXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHtcbiAgICAgIG93bmVyLFxuICAgICAgcmVwbyxcbiAgICAgIHN0YXJzLFxuICAgICAgbGFuZ3VhZ2UsXG4gICAgICBkZXNjcmlwdGlvbjogZGVzY0VsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IFwiXCIsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBpZDogcGFnZVR5cGUgYXMgQ29udGV4dFtcImlkXCJdLFxuICAgICAgbGFiZWw6IGAke293bmVyfS8ke3JlcG99YCxcbiAgICAgIG1ldGEsXG4gICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IHBhZ2VUeXBlIGFzIENvbnRleHRbXCJpZFwiXSB9LFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0QWN0aW9ucyhjdHg6IENvbnRleHQpOiBBY3Rpb25bXSB7XG4gICAgY29uc3QgaXNSZXBvID0gY3R4LmlkID09PSBcImdpdGh1Yi1yZXBvXCI7XG4gICAgY29uc3QgaXNGaWxlID0gY3R4LmlkID09PSBcImdpdGh1Yi1maWxlXCI7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwic2F2ZS1yZXBvXCIsXG4gICAgICAgIGxhYmVsOiBpc0ZpbGUgPyBcIlNhdmUgRmlsZVwiIDogXCJTYXZlIFJlcG9zaXRvcnlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IGlzUmVwbyA/IFwiU2F2ZSByZXBvIHdpdGggQUkgc3VtbWFyeVwiIDogXCJTYXZlIHRoaXMgZmlsZVwiLFxuICAgICAgICBpY29uOiBcIk01IDNoMTRhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6bTAgMnYxNGgxNFY1SDV6bTQgNGg2djZIOVY5elwiLFxuICAgICAgICB0YWI6IFwicmVzb3VyY2VcIixcbiAgICAgICAgcGF5bG9hZDogeyBzaXRlVHlwZTogY3R4LmlkIH0sXG4gICAgICB9LFxuICAgICAgLi4uKGlzUmVwb1xuICAgICAgICA/IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IFwiYWktc3VtbWFyeVwiLFxuICAgICAgICAgICAgICBsYWJlbDogXCJBSSBTdW1tYXJ5XCIsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlbmVyYXRlIHJlcG8gb3ZlcnZpZXdcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgICAgICAgdGFiOiBcIm5vdGVcIiBhcyBjb25zdCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBcInRlY2gtc3RhY2tcIixcbiAgICAgICAgICAgICAgbGFiZWw6IFwiVGVjaCBTdGFja1wiLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEZXRlY3QgdGVjaG5vbG9naWVzIHVzZWRcIixcbiAgICAgICAgICAgICAgaWNvbjogXCJNMjIgMTJoLTRsLTMgOUw5IDNsLTMgOUgyXCIsXG4gICAgICAgICAgICAgIHRhYjogXCJub3RlXCIgYXMgY29uc3QsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogXCJsZWFybmluZy1wYXRoXCIsXG4gICAgICAgICAgICAgIGxhYmVsOiBcIkxlYXJuaW5nIFJvYWRtYXBcIixcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiR2VuZXJhdGUgc3R1ZHkgcGxhblwiLFxuICAgICAgICAgICAgICBpY29uOiBcIk0xMiA2VjRtMCAyYTIgMiAwIDEgMCAwIDRtMC00YTIgMiAwIDEgMSAwIDRtLTYgOGEyIDIgMCAxIDAgMC00bTAgNGEyIDIgMCAxIDEgMC00bTAgNHYybTAtNlY0bTYgNnYxMG02LTJhMiAyIDAgMSAwIDAtNG0wIDRhMiAyIDAgMSAxIDAtNG0wIDR2Mm0wLTZWNFwiLFxuICAgICAgICAgICAgICB0YWI6IFwibm90ZVwiIGFzIGNvbnN0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pLFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXJlYWRtZVwiLFxuICAgICAgICBsYWJlbDogXCJTYXZlIFJFQURNRVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXZlIGFzIG5vdGVcIixcbiAgICAgICAgaWNvbjogXCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41TDE0LjUgMnpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInJlbGF0ZWQtbm90ZXNcIixcbiAgICAgICAgbGFiZWw6IFwiUmVsYXRlZCBOb3Rlc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJGaW5kIGluIHlvdXIgdmF1bHRcIixcbiAgICAgICAgaWNvbjogXCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIsXG4gICAgICAgIHRhYjogXCJyZXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICBdO1xuICB9LFxuXG4gIGdldENoaXBBbmNob3IoKTogRWxlbWVudCB8IG51bGwge1xuICAgIC8vIEJlc2lkZSByZXBvIG5hbWUgaW4gdGhlIGhlYWRlclxuICAgIHJldHVybiAoXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcbiAgICAgICAgXCJoMSBzdHJvbmcgYSwgW2RhdGEtdGVzdGlkPSdyZXBvLXRpdGxlJ10gYSwgW2RhdGEtdGVzdGlkPSdyZXBvc2l0b3J5LXRpdGxlJ10gYSwgLnJlcG9zaXRvcnktY29udGVudCBoMVwiLFxuICAgICAgKSB8fFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCJoMVwiKSB8fFxuICAgICAgbnVsbFxuICAgICk7XG4gIH0sXG5cbiAgbW91bnRVSShjdHg6IENvbnRleHQpOiAoKSA9PiB2b2lkIHtcbiAgICBjb25zdCBhbmNob3IgPSB0aGlzLmdldENoaXBBbmNob3I/LigpO1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gKCkgPT4ge307XG5cbiAgICBjb25zdCBjaGlwID0gY3JlYXRlQ2hpcChcbiAgICAgIFwiTTEyIDNhNiA2IDAgMCAwLTYgNnYxaDEyVjlhNiA2IDAgMCAwLTYtNnpNOCAxNHYxYTQgNCAwIDAgMCA4IDB2LTFcIixcbiAgICAgIFwiRGV2dmVudG9yeVwiLFxuICAgICk7XG5cbiAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKGN0eCk7XG4gICAgICBzaG93TWVudShjaGlwLCBhY3Rpb25zLCAoYWN0aW9uKSA9PiB7XG4gICAgICAgIGltcG9ydChcIi4uL2NvbnRleHQtZW5naW5lL3BvcHVwXCIpLnRoZW4oKG0pID0+XG4gICAgICAgICAgbS5vcGVuUG9wdXAoYWN0aW9uLCBjdHgpLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFuY2hvci5wYXJlbnRFbGVtZW50Py5pbnNlcnRCZWZvcmUoY2hpcCwgYW5jaG9yLm5leHRTaWJsaW5nKTtcbiAgICBjaGlwLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjhweFwiO1xuXG4gICAgcmV0dXJuICgpID0+IGNoaXAucmVtb3ZlKCk7XG4gIH0sXG59O1xuXG5yZWdpc3Rlcihwcm92aWRlcik7XG5leHBvcnQgZGVmYXVsdCBwcm92aWRlcjtcbiIsImltcG9ydCB0eXBlIHsgUHJvdmlkZXIsIENvbnRleHQsIEFjdGlvbiB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U2l0ZU1ldGEgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvbWV0YWRhdGFcIjtcbmltcG9ydCB7IGNyZWF0ZUNoaXAsIHNob3dNZW51IH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3VpXCI7XG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gXCIuL3JlZ2lzdHJ5XCI7XG5cbmNvbnN0IHByb3ZpZGVyOiBQcm92aWRlciA9IHtcbiAgaWQ6IFwieW91dHViZVwiLFxuICBsYWJlbDogXCJZb3VUdWJlXCIsXG4gIHVybFBhdHRlcm5zOiBbXCIqOi8vd3d3LnlvdXR1YmUuY29tLypcIiwgXCIqOi8veW91dHUuYmUvKlwiXSxcbiAgY2FwYWJpbGl0aWVzOiBbXCJ2aWRlb1wiLCBcInRyYW5zY3JpcHRcIiwgXCJrZXktcG9pbnRzXCIsIFwic3VtbWFyeVwiLCBcImZsYXNoY2FyZFwiXSxcbiAgc3VwcG9ydHNTZWxlY3Rpb246IGZhbHNlLFxuICBzdXBwb3J0c0FJOiB0cnVlLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgY29uc3QgeyBob3N0bmFtZSB9ID0gd2luZG93LmxvY2F0aW9uO1xuICAgIGlmICghW1wid3d3LnlvdXR1YmUuY29tXCIsIFwieW91dHViZS5jb21cIiwgXCJ5b3V0dS5iZVwiXS5pbmNsdWRlcyhob3N0bmFtZSkpIHJldHVybiBudWxsO1xuXG4gICAgY29uc3QgdiA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLnNlYXJjaFBhcmFtcy5nZXQoXCJ2XCIpO1xuICAgIGlmICghdikgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBjaGFubmVsRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIjb3duZXIgI2NoYW5uZWwtbmFtZSwgeXQtZm9ybWF0dGVkLXN0cmluZy55dGQtY2hhbm5lbC1uYW1lXCIsXG4gICAgKTtcbiAgICBjb25zdCBjaGFubmVsID0gY2hhbm5lbEVsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHRpdGxlRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Fib3ZlLXRoZS1mb2xkICN0aXRsZSBoMVwiKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDFcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiBcInlvdXR1YmVcIixcbiAgICAgIGxhYmVsOiB0aXRsZUVsPy50ZXh0Q29udGVudD8udHJpbSgpIHx8IFwiWW91VHViZSBWaWRlb1wiLFxuICAgICAgbWV0YTogeyB2aWRlb0lkOiB2LCBjaGFubmVsIH0sXG4gICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwieW91dHViZVwiIH0sXG4gICAgfTtcbiAgfSxcblxuICBnZXRBY3Rpb25zKCk6IEFjdGlvbltdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBpZDogXCJhaS1zdW1tYXJ5XCIsXG4gICAgICAgIGxhYmVsOiBcIkFJIFN1bW1hcnlcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3VtbWFyaXplIHRoaXMgdmlkZW9cIixcbiAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImtleS1sZWFybmluZ3NcIixcbiAgICAgICAgbGFiZWw6IFwiS2V5IExlYXJuaW5nc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJFeHRyYWN0IG1haW4gcG9pbnRzXCIsXG4gICAgICAgIGljb246IFwiTTkgNUg3YTIgMiAwIDAgMC0yIDJ2MTJhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMmgtMk05IDVhMiAyIDAgMCAwIDIgMmgyYTIgMiAwIDAgMCAyLTJNOSA1YTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAyXCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXRyYW5zY3JpcHRcIixcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBUcmFuc2NyaXB0XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNhdmUgZnVsbCB0cmFuc2NyaXB0XCIsXG4gICAgICAgIGljb246IFwiTTE0LjUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjcuNUwxNC41IDJ6XCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXZpZGVvXCIsXG4gICAgICAgIGxhYmVsOiBcIlNhdmUgVmlkZW9cIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2F2ZSBhcyByZXNvdXJjZVwiLFxuICAgICAgICBpY29uOiBcIk01IDNoMTRhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6XCIsXG4gICAgICAgIHRhYjogXCJyZXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZmxhc2hjYXJkc1wiLFxuICAgICAgICBsYWJlbDogXCJDcmVhdGUgRmxhc2hjYXJkc1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJHZW5lcmF0ZSBzdHVkeSBjYXJkc1wiLFxuICAgICAgICBpY29uOiBcIk0yIDNoNmE0IDQgMCAwIDEgNCA0djE0YTMgMyAwIDAgMC0zLTNIMnpNMjIgM2gtNmE0IDQgMCAwIDAtNCA0djE0YTMgMyAwIDAgMSAzLTNoN3pcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcblxuICBnZXRDaGlwQW5jaG9yKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICAvLyBZb3VUdWJlIHJlbmRlcnMgdGl0bGUgaW5zaWRlICNhYm92ZS10aGUtZm9sZCA+ICN0aXRsZSA+IGgxXG4gICAgcmV0dXJuIChcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYWJvdmUtdGhlLWZvbGQgI3RpdGxlIGgxXCIpIHx8XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RpdGxlIGgxXCIpIHx8XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaDEueXRkLXZpZGVvLXByaW1hcnktaW5mby1yZW5kZXJlclwiKSB8fFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpIHx8XG4gICAgICBudWxsXG4gICAgKTtcbiAgfSxcblxuICBtb3VudFVJKGN0eDogQ29udGV4dCk6ICgpID0+IHZvaWQge1xuICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuZ2V0Q2hpcEFuY2hvcj8uKCk7XG4gICAgaWYgKCFhbmNob3IpIHJldHVybiAoKSA9PiB7fTtcblxuICAgIGNvbnN0IGNoaXAgPSBjcmVhdGVDaGlwKFxuICAgICAgXCJNMTIgM2E2IDYgMCAwIDAtNiA2djFoMTJWOWE2IDYgMCAwIDAtNi02ek04IDE0djFhNCA0IDAgMCAwIDggMHYtMVwiLFxuICAgICAgXCJEZXZ2ZW50b3J5XCIsXG4gICAgKTtcblxuICAgIGNoaXAub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoY3R4KTtcbiAgICAgIHNob3dNZW51KGNoaXAsIGFjdGlvbnMsIChhY3Rpb24pID0+IHtcbiAgICAgICAgaW1wb3J0KFwiLi4vY29udGV4dC1lbmdpbmUvcG9wdXBcIikudGhlbigobSkgPT4gbS5vcGVuUG9wdXAoYWN0aW9uLCBjdHgpKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhbmNob3IucGFyZW50RWxlbWVudD8uaW5zZXJ0QmVmb3JlKGNoaXAsIGFuY2hvci5uZXh0U2libGluZyk7XG4gICAgY2hpcC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI4cHhcIjtcbiAgICBjaGlwLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSBcIm1pZGRsZVwiO1xuXG4gICAgcmV0dXJuICgpID0+IGNoaXAucmVtb3ZlKCk7XG4gIH0sXG59O1xuXG5yZWdpc3Rlcihwcm92aWRlcik7XG5leHBvcnQgZGVmYXVsdCBwcm92aWRlcjtcbiIsImltcG9ydCB0eXBlIHsgUHJvdmlkZXIsIENvbnRleHQsIEFjdGlvbiB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U2l0ZU1ldGEgfSBmcm9tIFwiLi4vY29udGV4dC1lbmdpbmUvbWV0YWRhdGFcIjtcbmltcG9ydCB7IGNyZWF0ZUNoaXAsIHNob3dNZW51IH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3VpXCI7XG5pbXBvcnQgeyByZWdpc3RlciB9IGZyb20gXCIuL3JlZ2lzdHJ5XCI7XG5cbmNvbnN0IERPQ19TSVRFUyA9IFtcbiAgXCJkZXZlbG9wZXIubW96aWxsYS5vcmdcIixcbiAgXCJyZWFjdC5kZXZcIixcbiAgXCJuZXh0anMub3JnXCIsXG4gIFwibnV4dC5jb21cIixcbiAgXCJzdmVsdGUuZGV2XCIsXG4gIFwidnVlanMub3JnXCIsXG4gIFwiYW5ndWxhci5kZXZcIixcbiAgXCJwcmlzbWEuaW9cIixcbiAgXCJ0cnBjLmlvXCIsXG4gIFwidGFpbHdpbmRjc3MuY29tXCIsXG4gIFwidml0ZS5kZXZcIixcbiAgXCJhc3Ryby5idWlsZFwiLFxuICBcInB5dGhvbi5vcmdcIixcbiAgXCJsYW5nY2hhaW4uY29tXCIsXG4gIFwicGxhdGZvcm0ub3BlbmFpLmNvbVwiLFxuXTtcblxuZnVuY3Rpb24gaXNEb2NTaXRlKGhvc3RuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBET0NfU0lURVMuc29tZSgocykgPT4gaG9zdG5hbWUuZW5kc1dpdGgocykgfHwgaG9zdG5hbWUgPT09IHMpIHx8XG4gICAgaG9zdG5hbWUuZW5kc1dpdGgoXCIuZGV2XCIpIHx8XG4gICAgaG9zdG5hbWUuZW5kc1dpdGgoXCIuZG9jc1wiKSB8fFxuICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdGFydHNXaXRoKFwiL2RvY3NcIilcbiAgKTtcbn1cblxuY29uc3QgcHJvdmlkZXI6IFByb3ZpZGVyID0ge1xuICBpZDogXCJkb2NzXCIsXG4gIGxhYmVsOiBcIkRvY3NcIixcbiAgdXJsUGF0dGVybnM6IFtcbiAgICBcIio6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvKlwiLFxuICAgIFwiKjovL3JlYWN0LmRldi8qXCIsXG4gICAgXCIqOi8vbmV4dGpzLm9yZy8qXCIsXG4gICAgXCIqOi8vdGFpbHdpbmRjc3MuY29tLypcIixcbiAgICBcIio6Ly9zdmVsdGUuZGV2LypcIixcbiAgICBcIio6Ly8qLmRldi8qXCIsXG4gIF0sXG4gIGNhcGFiaWxpdGllczogW1wiZG9jdW1lbnRhdGlvblwiLCBcImV4cGxhaW5cIiwgXCJjaGVhdHNoZWV0XCIsIFwic3VtbWFyeVwiXSxcbiAgc3VwcG9ydHNTZWxlY3Rpb246IHRydWUsXG4gIHN1cHBvcnRzQUk6IHRydWUsXG5cbiAgZGV0ZWN0KCk6IENvbnRleHQgfCBudWxsIHtcbiAgICBjb25zdCB7IGhvc3RuYW1lIH0gPSB3aW5kb3cubG9jYXRpb247XG4gICAgaWYgKCFpc0RvY1NpdGUoaG9zdG5hbWUpKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGhlYWRpbmcgPVxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpPy50ZXh0Q29udGVudD8udHJpbSgpIHx8XG4gICAgICBkb2N1bWVudC50aXRsZTtcblxuICAgIGNvbnN0IGZyYW1ld29yayA9IERPQ19TSVRFUy5maW5kKChzKSA9PiBob3N0bmFtZS5lbmRzV2l0aChzKSB8fCBob3N0bmFtZSA9PT0gcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFwiZG9jc1wiLFxuICAgICAgbGFiZWw6IGhlYWRpbmcsXG4gICAgICBtZXRhOiB7IGZyYW1ld29yazogZnJhbWV3b3JrIHx8IGhvc3RuYW1lIH0sXG4gICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwiZG9jc1wiIH0sXG4gICAgfTtcbiAgfSxcblxuICBnZXRBY3Rpb25zKGN0eDogQ29udGV4dCk6IEFjdGlvbltdIHtcbiAgICByZXR1cm4gW1xuICAgICAge1xuICAgICAgICBpZDogXCJleHBsYWluXCIsXG4gICAgICAgIGxhYmVsOiBcIkV4cGxhaW4gVGhpcyBQYWdlXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkFJIGV4cGxhbmF0aW9uXCIsXG4gICAgICAgIGljb246IFwiTTEyIDIwaDlNMTYuNSAzLjVhMi4xMjEgMi4xMjEgMCAwIDEgMyAzTDcgMTlsLTQgMSAxLTRMMTYuNSAzLjV6XCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLXBhZ2VcIixcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBQYWdlXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNhdmUgYXMgcmVzb3VyY2VcIixcbiAgICAgICAgaWNvbjogXCJNNSAzaDE0YTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yelwiLFxuICAgICAgICB0YWI6IFwicmVzb3VyY2VcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImNoZWF0c2hlZXRcIixcbiAgICAgICAgbGFiZWw6IFwiR2VuZXJhdGUgQ2hlYXRzaGVldFwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJDcmVhdGUgcXVpY2sgcmVmZXJlbmNlXCIsXG4gICAgICAgIGljb246IFwiTTkgNUg3YTIgMiAwIDAgMC0yIDJ2MTJhMiAyIDAgMCAwIDIgMmgxMGEyIDIgMCAwIDAgMi0yVjdhMiAyIDAgMCAwLTItMmgtMk05IDVhMiAyIDAgMCAwIDIgMmgyYTIgMiAwIDAgMCAyLTJNOSA1YTIgMiAwIDAgMSAyLTJoMmEyIDIgMCAwIDEgMiAyXCIsXG4gICAgICAgIHRhYjogXCJub3RlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLWFwaVwiLFxuICAgICAgICBsYWJlbDogXCJTYXZlIEFQSSBSZWZlcmVuY2VcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2F2ZSBrZXkgQVBJIGRldGFpbHNcIixcbiAgICAgICAgaWNvbjogXCJNMTQuNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWNy41TDE0LjUgMnpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcblxuICBnZXRDaGlwQW5jaG9yKCk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpIHx8IG51bGw7XG4gIH0sXG5cbiAgbW91bnRVSShjdHg6IENvbnRleHQpOiAoKSA9PiB2b2lkIHtcbiAgICBjb25zdCBhbmNob3IgPSB0aGlzLmdldENoaXBBbmNob3I/LigpO1xuICAgIGlmICghYW5jaG9yKSByZXR1cm4gKCkgPT4ge307XG5cbiAgICBjb25zdCBjaGlwID0gY3JlYXRlQ2hpcChcbiAgICAgIFwiTTEyIDNhNiA2IDAgMCAwLTYgNnYxaDEyVjlhNiA2IDAgMCAwLTYtNnpNOCAxNHYxYTQgNCAwIDAgMCA4IDB2LTFcIixcbiAgICAgIFwiRGV2dmVudG9yeVwiLFxuICAgICk7XG5cbiAgICBjaGlwLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5nZXRBY3Rpb25zKGN0eCk7XG4gICAgICBzaG93TWVudShjaGlwLCBhY3Rpb25zLCAoYWN0aW9uKSA9PiB7XG4gICAgICAgIGltcG9ydChcIi4uL2NvbnRleHQtZW5naW5lL3BvcHVwXCIpLnRoZW4oKG0pID0+IG0ub3BlblBvcHVwKGFjdGlvbiwgY3R4KSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgYW5jaG9yLnBhcmVudEVsZW1lbnQ/Lmluc2VydEJlZm9yZShjaGlwLCBhbmNob3IubmV4dFNpYmxpbmcpO1xuICAgIGNoaXAuc3R5bGUubWFyZ2luTGVmdCA9IFwiOHB4XCI7XG5cbiAgICByZXR1cm4gKCkgPT4gY2hpcC5yZW1vdmUoKTtcbiAgfSxcbn07XG5cbnJlZ2lzdGVyKHByb3ZpZGVyKTtcbmV4cG9ydCBkZWZhdWx0IHByb3ZpZGVyO1xuIiwiaW1wb3J0IHR5cGUgeyBQcm92aWRlciwgQ29udGV4dCwgQWN0aW9uIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTaXRlTWV0YSB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YVwiO1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tIFwiLi9yZWdpc3RyeVwiO1xuXG5jb25zdCBwcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIGlkOiBcImdlbmVyaWNcIixcbiAgbGFiZWw6IFwiUGFnZVwiLFxuICB1cmxQYXR0ZXJuczogW10sXG4gIGNhcGFiaWxpdGllczogW1wicGFnZVwiLCBcInN1bW1hcnlcIl0sXG4gIHN1cHBvcnRzU2VsZWN0aW9uOiB0cnVlLFxuICBzdXBwb3J0c0FJOiB0cnVlLFxuXG4gIGRldGVjdCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gICAgLy8gQWx3YXlzIG1hdGNoZXMgYXMgZmFsbGJhY2tcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IFwiZ2VuZXJpY1wiLFxuICAgICAgbGFiZWw6IGRvY3VtZW50LnRpdGxlIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICAgIG1ldGE6IHt9LFxuICAgICAgcGFnZURhdGE6IHsgLi4uZ2V0U2l0ZU1ldGEoKSwgc2l0ZUlkOiBcImdlbmVyaWNcIiB9LFxuICAgIH07XG4gIH0sXG5cbiAgZ2V0QWN0aW9ucygpOiBBY3Rpb25bXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwic2F2ZS1wYWdlXCIsXG4gICAgICAgIGxhYmVsOiBcIlNhdmUgUGFnZVwiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTYXZlIGFzIHJlc291cmNlXCIsXG4gICAgICAgIGljb246IFwiTTUgM2gxNGEyIDIgMCAwIDEgMiAydjE0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMnpcIixcbiAgICAgICAgdGFiOiBcInJlc291cmNlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJzYXZlLW5vdGVcIixcbiAgICAgICAgbGFiZWw6IFwiU2F2ZSBOb3RlXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldyaXRlIGEgcXVpY2sgbm90ZVwiLFxuICAgICAgICBpY29uOiBcIk0xNC41IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3LjVMMTQuNSAyelwiLFxuICAgICAgICB0YWI6IFwibm90ZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWktc3VtbWFyeVwiLFxuICAgICAgICBsYWJlbDogXCJBSSBTdW1tYXJ5XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN1bW1hcml6ZSB0aGlzIHBhZ2VcIixcbiAgICAgICAgaWNvbjogXCJNMTIgMjBoOU0xNi41IDMuNWEyLjEyMSAyLjEyMSAwIDAgMSAzIDNMNyAxOWwtNCAxIDEtNEwxNi41IDMuNXpcIixcbiAgICAgICAgdGFiOiBcIm5vdGVcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgfSxcblxuICBtb3VudFVJKCk6ICgpID0+IHZvaWQge1xuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfSxcbn07XG5cbnJlZ2lzdGVyKHByb3ZpZGVyKTtcbmV4cG9ydCBkZWZhdWx0IHByb3ZpZGVyO1xuIiwiaW1wb3J0IHR5cGUgeyBQcm92aWRlciwgQ29udGV4dCB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgeyBkZXRlY3QgYXMgcmVnaXN0cnlEZXRlY3QgfSBmcm9tIFwiLi4vcHJvdmlkZXJzL3JlZ2lzdHJ5XCI7XG5pbXBvcnQgXCIuLi9wcm92aWRlcnMvZ2l0aHViXCI7XG5pbXBvcnQgXCIuLi9wcm92aWRlcnMveW91dHViZVwiO1xuaW1wb3J0IFwiLi4vcHJvdmlkZXJzL2RvY3NcIjtcbmltcG9ydCBcIi4uL3Byb3ZpZGVycy9nZW5lcmljXCI7XG5cbmxldCBhY3RpdmVDbGVhbnVwOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcbmxldCBsYXN0VXJsID0gXCJcIjtcblxuZnVuY3Rpb24gbW91bnQoKSB7XG4gIGlmIChhY3RpdmVDbGVhbnVwKSB7XG4gICAgYWN0aXZlQ2xlYW51cCgpO1xuICAgIGFjdGl2ZUNsZWFudXAgPSBudWxsO1xuICB9XG5cbiAgY29uc3QgcmVzdWx0ID0gcmVnaXN0cnlEZXRlY3QoKTtcbiAgaWYgKCFyZXN1bHQpIHJldHVybjtcbiAgaWYgKHJlc3VsdC5wcm92aWRlci5pZCA9PT0gXCJnZW5lcmljXCIpIHJldHVybjtcblxuICAvLyBDaGVjayBpZiBwcm92aWRlciBoYXMgYW4gYW5jaG9yIOKAlCBpZiBub3QsIHJldHJ5IChTUEEgbGF6eSByZW5kZXIgLyBzbG93IGxvYWRzKVxuICBjb25zdCBoYXNBbmNob3IgPSByZXN1bHQucHJvdmlkZXIuZ2V0Q2hpcEFuY2hvcj8uKCk7XG4gIGlmICghaGFzQW5jaG9yKSB7XG4gICAgY29uc3QgcmV0cmllcyA9IFsxMDAwLCAyMDAwLCAzMDAwLCA1MDAwLCA4MDAwXTtcbiAgICByZXRyaWVzLmZvckVhY2goKGRlbGF5KSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZUNsZWFudXApIHJldHVybjsgLy8gYWxyZWFkeSBtb3VudGVkXG4gICAgICAgIGlmIChyZXN1bHQucHJvdmlkZXIuZ2V0Q2hpcEFuY2hvcj8uKCkpIG1vdW50KCk7XG4gICAgICB9LCBkZWxheSk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYWN0aXZlQ2xlYW51cCA9IHJlc3VsdC5wcm92aWRlci5tb3VudFVJKHJlc3VsdC5jdHgpO1xufVxuXG5sZXQgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXIgfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIG1vdW50Q29udGV4dFVJKCk6ICgpID0+IHZvaWQge1xuICBsYXN0VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIGNvbnN0IHJlc3VsdCA9IHJlZ2lzdHJ5RGV0ZWN0KCk7XG5cbiAgLy8gT25seSBzZXQgdXAgb2JzZXJ2ZXJzIG9uIHN1cHBvcnRlZCBzaXRlcyAoc2tpcCBnZW5lcmljL3Vuc3VwcG9ydGVkKVxuICBpZiAocmVzdWx0ICYmIHJlc3VsdC5wcm92aWRlci5pZCAhPT0gXCJnZW5lcmljXCIpIHtcbiAgICBtb3VudCgpO1xuXG4gICAgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT09IGxhc3RVcmwpIHtcbiAgICAgICAgbGFzdFVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICBzZXRUaW1lb3V0KG1vdW50LCA2MDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSB8fCBkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwieXQtbmF2aWdhdGUtZmluaXNoXCIsICgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQobW91bnQsIDYwMCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gKCkgPT4ge1xuICAgIG9ic2VydmVyPy5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIGFjdGl2ZUNsZWFudXA/LigpO1xuICAgIGFjdGl2ZUNsZWFudXAgPSBudWxsO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGV4dCgpOiBDb250ZXh0IHwgbnVsbCB7XG4gIGNvbnN0IHJlc3VsdCA9IHJlZ2lzdHJ5RGV0ZWN0KCk7XG4gIHJldHVybiByZXN1bHQ/LmN0eCB8fCBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aW9ucyhjb250ZXh0PzogQ29udGV4dCkge1xuICBpZiAoIWNvbnRleHQpIHJldHVybiBbXTtcbiAgY29uc3QgcmVzdWx0ID0gcmVnaXN0cnlEZXRlY3QoKTtcbiAgaWYgKHJlc3VsdCAmJiByZXN1bHQuY3R4LmlkID09PSBjb250ZXh0LmlkKSByZXR1cm4gcmVzdWx0LnByb3ZpZGVyLmdldEFjdGlvbnMocmVzdWx0LmN0eCk7XG4gIHJldHVybiBbXTtcbn1cbiIsImltcG9ydCB7IG1vdW50Q29udGV4dFVJLCBnZXRDb250ZXh0IH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lXCI7XG5pbXBvcnQgeyBpbmplY3RCYXNlU3R5bGVzIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3VpXCI7XG5pbXBvcnQgeyBnZXRTaXRlTWV0YSB9IGZyb20gXCIuLi9jb250ZXh0LWVuZ2luZS9tZXRhZGF0YVwiO1xuaW1wb3J0IHsgb3BlblBvcHVwIH0gZnJvbSBcIi4uL2NvbnRleHQtZW5naW5lL3BvcHVwXCI7XG5cbi8vIOKUgOKUgOKUgCBGbG9hdGluZyBcIitcIiBidXR0b24gb24gdGV4dCBzZWxlY3Rpb24g4pSA4pSA4pSAXG5cbmxldCBmbG9hdEJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuZnVuY3Rpb24gY2xlYXJGbG9hdCgpIHtcbiAgZmxvYXRCdG4/LnJlbW92ZSgpO1xuICBmbG9hdEJ0biA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFNlbFJlY3QoKTogRE9NUmVjdCB8IG51bGwge1xuICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gIGlmICghc2VsIHx8IHNlbC5pc0NvbGxhcHNlZCB8fCAhc2VsLnJhbmdlQ291bnQpIHJldHVybiBudWxsO1xuICBjb25zdCByID0gc2VsLmdldFJhbmdlQXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiByLndpZHRoID09PSAwICYmIHIuaGVpZ2h0ID09PSAwID8gbnVsbCA6IHI7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VVcChlOiBNb3VzZUV2ZW50KSB7XG4gIGlmICgoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpPy5jbG9zZXN0Py4oXCIuZHYtZmxvYXQsIC5kdi1jaGlwLCAuZHYtbWVudVwiKSkgcmV0dXJuO1xuICBjb25zdCByZWN0ID0gZ2V0U2VsUmVjdCgpO1xuICByZWN0ID8gc2hvd0Zsb2F0QnRuKHJlY3QpIDogY2xlYXJGbG9hdCgpO1xufVxuXG5mdW5jdGlvbiBzaG93RmxvYXRCdG4ocmVjdDogRE9NUmVjdCkge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kdi1wb3B1cFwiKSkgcmV0dXJuO1xuICBpZiAoIWZsb2F0QnRuKSB7XG4gICAgaW5qZWN0QmFzZVN0eWxlcygpO1xuICAgIGZsb2F0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBmbG9hdEJ0bi5jbGFzc05hbWUgPSBcImR2LWZsb2F0IGR2LWZsb2F0LWJ0blwiO1xuICAgIGZsb2F0QnRuLmlubmVySFRNTCA9XG4gICAgICAnPHN2ZyB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48bGluZSB4MT1cIjEyXCIgeTE9XCI1XCIgeDI9XCIxMlwiIHkyPVwiMTlcIi8+PGxpbmUgeDE9XCI1XCIgeTE9XCIxMlwiIHgyPVwiMTlcIiB5Mj1cIjEyXCIvPjwvc3ZnPic7XG4gICAgZmxvYXRCdG4udGl0bGUgPSBcIlNhdmUgdG8gRGV2dmVudG9yeVwiO1xuICAgIGZsb2F0QnRuLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjbGVhckZsb2F0KCk7XG4gICAgICBjb25zdCBjdHggPSBnZXRDb250ZXh0KCk7XG4gICAgICBvcGVuUG9wdXAoXG4gICAgICAgIHsgaWQ6IFwic2F2ZVwiLCBsYWJlbDogY3R4Py5sYWJlbCB8fCBkb2N1bWVudC50aXRsZSwgZGVzY3JpcHRpb246IFwiXCIsIGljb246IFwiXCIsIHRhYjogXCJyZXNvdXJjZVwiIH0sXG4gICAgICAgIGN0eCB8fCB7XG4gICAgICAgICAgaWQ6IFwiZ2VuZXJpY1wiLFxuICAgICAgICAgIGxhYmVsOiBkb2N1bWVudC50aXRsZSxcbiAgICAgICAgICBtZXRhOiB7fSxcbiAgICAgICAgICBwYWdlRGF0YTogeyAuLi5nZXRTaXRlTWV0YSgpLCBzaXRlSWQ6IFwiZ2VuZXJpY1wiIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlY3QsXG4gICAgICApO1xuICAgIH07XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmbG9hdEJ0bik7XG4gIH1cbiAgY29uc3Qgc2Nyb2xsWCA9IHdpbmRvdy5zY3JvbGxYLFxuICAgIHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgZmxvYXRCdG4uc3R5bGUubGVmdCA9XG4gICAgTWF0aC5taW4ocmVjdC5yaWdodCArIHNjcm9sbFggLSA3LCB3aW5kb3cuaW5uZXJXaWR0aCAtIDQwKSArIFwicHhcIjtcbiAgZmxvYXRCdG4uc3R5bGUudG9wID1cbiAgICBNYXRoLm1heChyZWN0LnRvcCArIHNjcm9sbFkgLSAxNCwgc2Nyb2xsWSArIDgpICsgXCJweFwiO1xufVxuXG4vLyDilIDilIDilIAgQ2xvdWRmbGFyZSBjaGFsbGVuZ2UgZGV0ZWN0aW9uIOKUgOKUgOKUgFxuXG5mdW5jdGlvbiBpc0Nsb3VkZmxhcmVDaGFsbGVuZ2UoKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjZi1jaGFsbGVuZ2Utd3JhcHBlciwgI2NmLXBsZWFzZS13YWl0LCBbaWRePSdjZi1jaGFsbGVuZ2UtJ11cIikgIT09IG51bGwgfHxcbiAgICBkb2N1bWVudC50aXRsZS5pbmNsdWRlcyhcIkp1c3QgYSBtb21lbnRcIikgfHxcbiAgICBkb2N1bWVudC5ib2R5Py50ZXh0Q29udGVudD8uaW5jbHVkZXMoXCJDaGVja2luZyB5b3VyIGJyb3dzZXJcIikgfHxcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIl9fY2ZfY2hsX3RrXCIpXG4gICk7XG59XG5cbi8vIHBvbnl0YWlsOiBpbnRlcnZhbCBwb2xsIGluc3RlYWQgb2YgTXV0YXRpb25PYnNlcnZlciDigJQgY2hhbGxlbmdlIHBhZ2UgRE9NXG4vLyBpcyBtaW5pbWFsIGFuZCByZXBsYWNpbmcgTXV0YXRpb25PYnNlcnZlciB3aXRoIGEgbGlnaHRlciBjaGVjayBhdm9pZHNcbi8vIHRyaXBwaW5nIGRldGVjdGlvbi4gVXBncmFkZSB0byBvYnNlcnZlciBpZiBwZXJmIG1hdHRlcnMuXG5mdW5jdGlvbiB3YWl0Rm9yUmVhbFBhZ2UobWF4TXMgPSAzMDAwMCk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWlzQ2xvdWRmbGFyZUNoYWxsZW5nZSgpKSByZXR1cm4gcmVzb2x2ZSgpO1xuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCFpc0Nsb3VkZmxhcmVDaGFsbGVuZ2UoKSkge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgIH0sIDIwMDApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCksIG1heE1zKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRVSSgpIHtcbiAgY29uc3QgdW5tb3VudCA9IG1vdW50Q29udGV4dFVJKCk7XG5cbiAgLy8gU2VsZWN0aW9uIGZsb2F0ZXIg4oCUIG1pbmltYWwgbGlzdGVuZXIsIG9ubHkgY3JlYXRlcyBET00gb24gYWN0dWFsIHNlbGVjdGlvblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbk1vdXNlVXApO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlKSA9PiB7XG4gICAgaWYgKCEoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpPy5jbG9zZXN0Py4oXCIuZHYtZmxvYXQsIC5kdi1jaGlwLCAuZHYtbWVudVwiKSkgY2xlYXJGbG9hdCgpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjbGVhckZsb2F0LCB0cnVlKTtcblxuICAvLyBNZXNzYWdlIGhhbmRsZXJzIOKAlCBubyBET00gaW5qZWN0aW9uIHVudGlsIHVzZXIgYWN0c1xuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZywgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSBcImdldFBhZ2VEYXRhXCIpIHtcbiAgICAgIHNlbmRSZXNwb25zZShnZXRTaXRlTWV0YSgpKTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInNob3dUb2FzdFwiKSB7XG4gICAgICBzaG93VG9hc3QobXNnLm1lc3NhZ2UpO1xuICAgICAgc2VuZFJlc3BvbnNlKHRydWUpO1xuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09IFwic2hvd0lubGluZVBvcHVwXCIpIHtcbiAgICAgIGluamVjdEJhc2VTdHlsZXMoKTtcbiAgICAgIGNvbnN0IGN0eCA9IGdldENvbnRleHQoKTtcbiAgICAgIG9wZW5Qb3B1cChcbiAgICAgICAgeyBpZDogXCJzYXZlXCIsIGxhYmVsOiBjdHg/LmxhYmVsIHx8IGRvY3VtZW50LnRpdGxlLCBkZXNjcmlwdGlvbjogXCJcIiwgaWNvbjogXCJcIiwgdGFiOiBcInJlc291cmNlXCIgfSxcbiAgICAgICAgY3R4IHx8IHtcbiAgICAgICAgICBpZDogXCJnZW5lcmljXCIsXG4gICAgICAgICAgbGFiZWw6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICAgIG1ldGE6IHt9LFxuICAgICAgICAgIHBhZ2VEYXRhOiB7IC4uLmdldFNpdGVNZXRhKCksIHNpdGVJZDogXCJnZW5lcmljXCIgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbnVsbCxcbiAgICAgICk7XG4gICAgICBzZW5kUmVzcG9uc2UodHJ1ZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdW5tb3VudDtcbn1cblxuLy8g4pSA4pSA4pSAIEVudHJ5IOKUgOKUgOKUgFxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogW1xuICAgIFwiKjovL2dpdGh1Yi5jb20vKlwiLFxuICAgIFwiKjovL3d3dy55b3V0dWJlLmNvbS8qXCIsXG4gICAgXCIqOi8veW91dHUuYmUvKlwiLFxuICAgIFwiKjovL2RldmVsb3Blci5tb3ppbGxhLm9yZy8qXCIsXG4gICAgXCIqOi8vcmVhY3QuZGV2LypcIixcbiAgICBcIio6Ly9uZXh0anMub3JnLypcIixcbiAgICBcIio6Ly90YWlsd2luZGNzcy5jb20vKlwiLFxuICAgIFwiKjovL3N2ZWx0ZS5kZXYvKlwiLFxuICAgIFwiKjovLyouZGV2LypcIixcbiAgXSxcbiAgbWFpbigpIHtcbiAgICAvLyBJZiB0aGlzIGlzIGEgQ2xvdWRmbGFyZSBjaGFsbGVuZ2UgcGFnZSwgZGVmZXIgYWxsIGluamVjdGlvbiB1bnRpbFxuICAgIC8vIHRoZSByZWFsIHBhZ2UgbG9hZHMgKENsb3VkZmxhcmUgcmVkaXJlY3RzIGFmdGVyIHZlcmlmaWNhdGlvbikuXG4gICAgaWYgKGlzQ2xvdWRmbGFyZUNoYWxsZW5nZSgpKSB7XG4gICAgICB3YWl0Rm9yUmVhbFBhZ2UoKS50aGVuKGluaXRVSSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdW5tb3VudCA9IGluaXRVSSgpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVubW91bnQoKTtcbiAgICAgIGNsZWFyRmxvYXQoKTtcbiAgICB9O1xuICB9LFxufSk7XG5cbmZ1bmN0aW9uIHNob3dUb2FzdChtZXNzYWdlOiBzdHJpbmcpIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBlbC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG4gIE9iamVjdC5hc3NpZ24oZWwuc3R5bGUsIHtcbiAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICAgIGJvdHRvbTogXCIyNHB4XCIsXG4gICAgcmlnaHQ6IFwiMjRweFwiLFxuICAgIHpJbmRleDogXCIyMTQ3NDgzNjQ3XCIsXG4gICAgcGFkZGluZzogXCIxMHB4IDE2cHhcIixcbiAgICBiYWNrZ3JvdW5kOiBcIiM2MzY2ZjFcIixcbiAgICBjb2xvcjogXCIjZmZmXCIsXG4gICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgIGZvbnRTaXplOiBcIjEycHhcIixcbiAgICBmb250V2VpZ2h0OiBcIjUwMFwiLFxuICAgIGJveFNoYWRvdzogXCIwIDRweCAxMnB4IHJnYmEoMCwwLDAsMC4xKVwiLFxuICAgIGFuaW1hdGlvbjogXCJkdi10b2FzdC1pbiAwLjJzIGVhc2Utb3V0XCIsXG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbiAgc2V0VGltZW91dCgoKSA9PiBlbC5yZW1vdmUoKSwgMjUwMCk7XG59XG4iLCIvLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG5cdGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcblx0aWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSBtZXRob2QoYFt3eHRdICR7YXJncy5zaGlmdCgpfWAsIC4uLmFyZ3MpO1xuXHRlbHNlIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xufVxuLyoqIFdyYXBwZXIgYXJvdW5kIGBjb25zb2xlYCB3aXRoIGEgXCJbd3h0XVwiIHByZWZpeCAqL1xuY29uc3QgbG9nZ2VyID0ge1xuXHRkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuXHRsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG5cdHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuXHRlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBsb2dnZXIgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsImltcG9ydCB7IGJyb3dzZXIgYXMgYnJvd3NlciQxIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuLyoqXG4qIENvbnRhaW5zIHRoZSBgYnJvd3NlcmAgZXhwb3J0IHdoaWNoIHlvdSBzaG91bGQgdXNlIHRvIGFjY2VzcyB0aGUgZXh0ZW5zaW9uXG4qIEFQSXMgaW4geW91ciBwcm9qZWN0OlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBicm93c2VyIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuKlxuKiBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuKiAgIC8vIC4uLlxuKiB9KTtcbiogYGBgXG4qXG4qIEBtb2R1bGUgd3h0L2Jyb3dzZXJcbiovXG5jb25zdCBicm93c2VyID0gYnJvd3NlciQxO1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBicm93c2VyIH07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMudHNcbnZhciBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50ID0gY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0c3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG5cdGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG5cdFx0c3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG5cdFx0dGhpcy5uZXdVcmwgPSBuZXdVcmw7XG5cdFx0dGhpcy5vbGRVcmwgPSBvbGRVcmw7XG5cdH1cbn07XG4vKipcbiogUmV0dXJucyBhbiBldmVudCBuYW1lIHVuaXF1ZSB0byB0aGUgZXh0ZW5zaW9uIGFuZCBjb250ZW50IHNjcmlwdCB0aGF0J3NcbiogcnVubmluZy5cbiovXG5mdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG5cdHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCwgZ2V0VW5pcXVlRXZlbnROYW1lIH07XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci50c1xuY29uc3Qgc3VwcG9ydHNOYXZpZ2F0aW9uQXBpID0gdHlwZW9mIGdsb2JhbFRoaXMubmF2aWdhdGlvbj8uYWRkRXZlbnRMaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiO1xuLyoqXG4qIENyZWF0ZSBhIHV0aWwgdGhhdCB3YXRjaGVzIGZvciBVUkwgY2hhbmdlcywgZGlzcGF0Y2hpbmcgdGhlIGN1c3RvbSBldmVudCB3aGVuXG4qIGRldGVjdGVkLiBTdG9wcyB3YXRjaGluZyB3aGVuIGNvbnRlbnQgc2NyaXB0IGlzIGludmFsaWRhdGVkLiBVc2VzIE5hdmlnYXRpb25cbiogQVBJIHdoZW4gYXZhaWxhYmxlLCBvdGhlcndpc2UgZmFsbHMgYmFjayB0byBwb2xsaW5nLlxuKi9cbmZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcblx0bGV0IGxhc3RVcmw7XG5cdGxldCB3YXRjaGluZyA9IGZhbHNlO1xuXHRyZXR1cm4geyBydW4oKSB7XG5cdFx0aWYgKHdhdGNoaW5nKSByZXR1cm47XG5cdFx0d2F0Y2hpbmcgPSB0cnVlO1xuXHRcdGxhc3RVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdGlmIChzdXBwb3J0c05hdmlnYXRpb25BcGkpIGdsb2JhbFRoaXMubmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgPT09IGxhc3RVcmwuaHJlZikgcmV0dXJuO1xuXHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRsYXN0VXJsID0gbmV3VXJsO1xuXHRcdH0sIHsgc2lnbmFsOiBjdHguc2lnbmFsIH0pO1xuXHRcdGVsc2UgY3R4LnNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGNvbnN0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgIT09IGxhc3RVcmwuaHJlZikge1xuXHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIGxhc3RVcmwpKTtcblx0XHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHRcdH1cblx0XHR9LCAxZTMpO1xuXHR9IH07XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9O1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vaW50ZXJuYWwvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgZ2V0VW5pcXVlRXZlbnROYW1lIH0gZnJvbSBcIi4vaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9IGZyb20gXCIuL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzXCI7XG5pbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQudHNcbi8qKlxuKiBJbXBsZW1lbnRzXG4qIFtgQWJvcnRDb250cm9sbGVyYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Fib3J0Q29udHJvbGxlcikuXG4qIFVzZWQgdG8gZGV0ZWN0IGFuZCBzdG9wIGNvbnRlbnQgc2NyaXB0IGNvZGUgd2hlbiB0aGUgc2NyaXB0IGlzIGludmFsaWRhdGVkLlxuKlxuKiBJdCBhbHNvIHByb3ZpZGVzIHNldmVyYWwgdXRpbGl0aWVzIGxpa2UgYGN0eC5zZXRUaW1lb3V0YCBhbmRcbiogYGN0eC5zZXRJbnRlcnZhbGAgdGhhdCBzaG91bGQgYmUgdXNlZCBpbiBjb250ZW50IHNjcmlwdHMgaW5zdGVhZCBvZlxuKiBgd2luZG93LnNldFRpbWVvdXRgIG9yIGB3aW5kb3cuc2V0SW50ZXJ2YWxgLlxuKlxuKiBUbyBjcmVhdGUgY29udGV4dCBmb3IgdGVzdGluZywgeW91IGNhbiB1c2UgdGhlIGNsYXNzJ3MgY29uc3RydWN0b3I6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IENvbnRlbnRTY3JpcHRDb250ZXh0IH0gZnJvbSAnd3h0L3V0aWxzL2NvbnRlbnQtc2NyaXB0cy1jb250ZXh0JztcbipcbiogdGVzdCgnc3RvcmFnZSBsaXN0ZW5lciBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQnLCAoKSA9PiB7XG4qICAgY29uc3QgY3R4ID0gbmV3IENvbnRlbnRTY3JpcHRDb250ZXh0KCd0ZXN0Jyk7XG4qICAgY29uc3QgaXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbSgnbG9jYWw6Y291bnQnLCB7IGRlZmF1bHRWYWx1ZTogMCB9KTtcbiogICBjb25zdCB3YXRjaGVyID0gdmkuZm4oKTtcbipcbiogICBjb25zdCB1bndhdGNoID0gaXRlbS53YXRjaCh3YXRjaGVyKTtcbiogICBjdHgub25JbnZhbGlkYXRlZCh1bndhdGNoKTsgLy8gTGlzdGVuIGZvciBpbnZhbGlkYXRlIGhlcmVcbipcbiogICBhd2FpdCBpdGVtLnNldFZhbHVlKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkVGltZXMoMSk7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRXaXRoKDEsIDApO1xuKlxuKiAgIGN0eC5ub3RpZnlJbnZhbGlkYXRlZCgpOyAvLyBVc2UgdGhpcyBmdW5jdGlvbiB0byBpbnZhbGlkYXRlIHRoZSBjb250ZXh0XG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgyKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiB9KTtcbiogYGBgXG4qL1xudmFyIENvbnRlbnRTY3JpcHRDb250ZXh0ID0gY2xhc3MgQ29udGVudFNjcmlwdENvbnRleHQge1xuXHRzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIik7XG5cdGlkO1xuXHRhYm9ydENvbnRyb2xsZXI7XG5cdGxvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcblx0Y29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG5cdFx0dGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdFx0dGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuXHRcdHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG5cdH1cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuXHR9XG5cdGFib3J0KHJlYXNvbikge1xuXHRcdHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydChyZWFzb24pO1xuXHR9XG5cdGdldCBpc0ludmFsaWQoKSB7XG5cdFx0aWYgKGJyb3dzZXIucnVudGltZT8uaWQgPT0gbnVsbCkgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuXHRcdHJldHVybiB0aGlzLnNpZ25hbC5hYm9ydGVkO1xuXHR9XG5cdGdldCBpc1ZhbGlkKCkge1xuXHRcdHJldHVybiAhdGhpcy5pc0ludmFsaWQ7XG5cdH1cblx0LyoqXG5cdCogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzXG5cdCogaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG5cdCogICBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuXHQqICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGNiKTtcblx0KiAgIH0pO1xuXHQqICAgLy8gLi4uXG5cdCogICByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG5cdCpcblx0KiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG5cdCovXG5cdG9uSW52YWxpZGF0ZWQoY2IpIHtcblx0XHR0aGlzLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHR9XG5cdC8qKlxuXHQqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uXG5cdCogdGhhdCBzaG91bGRuJ3QgcnVuIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgY29uc3QgZ2V0VmFsdWVGcm9tU3RvcmFnZSA9IGFzeW5jICgpID0+IHtcblx0KiAgICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcblx0KlxuXHQqICAgICAvLyAuLi5cblx0KiAgIH07XG5cdCovXG5cdGJsb2NrKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7fSk7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWxcblx0KiB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogSW50ZXJ2YWxzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2xlYXJJbnRlcnZhbGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcblx0XHR9LCB0aW1lb3V0KTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldFRpbWVvdXRgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIFRpbWVvdXRzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgc2V0VGltZW91dGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuXHRcdGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHNcblx0KiB0aGUgcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbEFuaW1hdGlvbkZyYW1lYFxuXHQqIGZ1bmN0aW9uLlxuXHQqL1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlXG5cdCogcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbElkbGVDYWxsYmFja2Bcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuXHRcdGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcblx0XHR9LCBvcHRpb25zKTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG5cdFx0aWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuXHRcdH1cblx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLCBoYW5kbGVyLCB7XG5cdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0c2lnbmFsOiB0aGlzLnNpZ25hbFxuXHRcdH0pO1xuXHR9XG5cdC8qKlxuXHQqIEBpbnRlcm5hbFxuXHQqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuXHQqL1xuXHRub3RpZnlJbnZhbGlkYXRlZCgpIHtcblx0XHR0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcblx0XHRsb2dnZXIuZGVidWcoYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgKTtcblx0fVxuXHRzdG9wT2xkU2NyaXB0cygpIHtcblx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsIHsgZGV0YWlsOiB7XG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0gfSkpO1xuXHRcdGlmICghdGhpcy5vcHRpb25zPy5ub1NjcmlwdFN0YXJ0ZWRQb3N0TWVzc2FnZSkgd2luZG93LnBvc3RNZXNzYWdlKHtcblx0XHRcdHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcblx0XHRcdGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuXHRcdFx0bWVzc2FnZUlkOiB0aGlzLmlkXG5cdFx0fSwgXCIqXCIpO1xuXHR9XG5cdHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuXHRcdGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kZXRhaWw/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdGNvbnN0IGlzRnJvbVNlbGYgPSBldmVudC5kZXRhaWw/Lm1lc3NhZ2VJZCA9PT0gdGhpcy5pZDtcblx0XHRyZXR1cm4gaXNTYW1lQ29udGVudFNjcmlwdCAmJiAhaXNGcm9tU2VsZjtcblx0fVxuXHRsaXN0ZW5Gb3JOZXdlclNjcmlwdHMoKSB7XG5cdFx0Y29uc3QgY2IgPSAoZXZlbnQpID0+IHtcblx0XHRcdGlmICghKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQpIHx8ICF0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHJldHVybjtcblx0XHRcdHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHR9O1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYik7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYikpO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9O1xuIl0s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