"use client";

import { useEffect } from "react";

const STORAGE_KEY = "custom-accents";

export type SectionAccent = "dashboard" | "resources" | "prompts" | "notes" | "projects" | "radar" | "graph" | "chat" | "tags" | "search" | "settings";

export const defaultAccents: Record<SectionAccent, string> = {
  dashboard: "#6366f1",
  resources: "#14b8a6",
  prompts: "#f59e0b",
  notes: "#22c55e",
  projects: "#8b5cf6",
  radar: "#06b6d4",
  graph: "#0ea5e9",
  chat: "#a855f7",
  tags: "#ec4899",
  search: "#ef4444",
  settings: "#a1a1aa",
};

export function getAccents(): Record<SectionAccent, string> {
  if (typeof window === "undefined") return defaultAccents;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultAccents, ...JSON.parse(stored) };
  } catch {}
  return defaultAccents;
}

export function setAccents(accents: Partial<Record<SectionAccent, string>>) {
  const current = getAccents();
  const merged = { ...current, ...accents };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  applyAccents(merged);
}

function applyAccents(accents: Record<SectionAccent, string>) {
  let style = document.getElementById("custom-accent-overrides");
  if (!style) {
    style = document.createElement("style");
    style.id = "custom-accent-overrides";
    document.head.appendChild(style);
  }
  const rules = (Object.entries(accents) as [SectionAccent, string][])
    .map(([section, color]) => `[data-accent="${section}"] { --accent: ${color} !important; }`)
    .join("\n");
  style.textContent = rules;
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const accents = getAccents();
    applyAccents(accents);
  }, []);

  return <>{children}</>;
}
