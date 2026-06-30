import type { Provider, Context } from "./types";
import { detect as registryDetect } from "../providers/registry";
import "../providers/github";
import "../providers/youtube";
import "../providers/docs";
import "../providers/generic";

let activeCleanup: (() => void) | null = null;
let lastUrl = "";

function mount() {
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  const result = registryDetect();
  if (!result) return;
  if (result.provider.id === "generic") return;

  // Check if provider has an anchor — if not, retry (SPA lazy render / slow loads)
  const hasAnchor = result.provider.getChipAnchor?.();
  if (!hasAnchor) {
    const retries = [1000, 2000, 3000, 5000, 8000];
    retries.forEach((delay) => {
      setTimeout(() => {
        if (activeCleanup) return; // already mounted
        if (result.provider.getChipAnchor?.()) mount();
      }, delay);
    });
    return;
  }

  activeCleanup = result.provider.mountUI(result.ctx);
}

let observer: MutationObserver | null = null;

export function mountContextUI(): () => void {
  lastUrl = window.location.href;
  const result = registryDetect();

  // Only set up observers on supported sites (skip generic/unsupported)
  if (result && result.provider.id !== "generic") {
    mount();

    observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setTimeout(mount, 600);
      }
    });
    observer.observe(document.body || document, { childList: true, subtree: true });

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

export function getContext(): Context | null {
  const result = registryDetect();
  return result?.ctx || null;
}

export function getActions(context?: Context) {
  if (!context) return [];
  const result = registryDetect();
  if (result && result.ctx.id === context.id) return result.provider.getActions(result.ctx);
  return [];
}
