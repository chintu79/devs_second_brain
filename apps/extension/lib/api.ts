import { storage } from "./storage";
import type { SaveResourcePayload, SaveNotePayload, SavePromptPayload, ApiResponse } from "./types";

async function getHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const apiKey = await storage.getApiKey();
  if (apiKey) headers["x-api-key"] = apiKey;
  return headers;
}

async function post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  const base = await storage.getWebUrl();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  });
  return res.json();
}

export const api = {
  saveResource: (data: SaveResourcePayload) => post("/api/ext/save-resource", data),
  saveNote: (data: SaveNotePayload) => post("/api/ext/save-note", data),
  savePrompt: (data: SavePromptPayload) => post("/api/ext/save-prompt", data),
  verifyKey: async () => {
    const base = await storage.getWebUrl();
    const res = await fetch(`${base}/api/ext/verify-key`, { method: "POST", headers: await getHeaders() });
    return (await res.json()) as ApiResponse & { valid?: boolean };
  },
};
