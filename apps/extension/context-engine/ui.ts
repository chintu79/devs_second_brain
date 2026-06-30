import type { Action } from "./types";

let injected = false;

export function injectBaseStyles() {
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

export function createChip(icon: string, label: string): HTMLElement {
  injectBaseStyles();
  const chip = document.createElement("div");
  chip.className = "dv-chip";
  chip.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icon}"/></svg>${label}`;
  return chip;
}

export function showMenu(
  anchor: Element,
  actions: Action[],
  onSelect: (action: Action) => void,
) {
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

  const close = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node) && e.target !== anchor) {
      menu.remove();
      document.removeEventListener("mousedown", close);
    }
  };
  setTimeout(() => document.addEventListener("mousedown", close), 0);
}
