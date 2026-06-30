import type { Provider, Context } from "../context-engine/types";

const registry = new Map<string, Provider>();

export function register(provider: Provider) {
  if (registry.has(provider.id)) {
    console.warn(`Provider already registered: ${provider.id}`);
    return;
  }
  registry.set(provider.id, provider);
}

export function detect(): { provider: Provider; ctx: Context } | null {
  for (const p of registry.values()) {
    const ctx = p.detect();
    if (ctx) return { provider: p, ctx };
  }
  return null;
}

export function getProvider(id: string): Provider | undefined {
  return registry.get(id);
}

export function getAllProviders(): Provider[] {
  return [...registry.values()];
}

export function getUrlPatterns(): string[] {
  const patterns: string[] = [];
  for (const p of registry.values()) {
    if (p.urlPatterns) patterns.push(...p.urlPatterns);
  }
  return patterns;
}
