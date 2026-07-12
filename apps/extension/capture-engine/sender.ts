import { addToQueue, updateQueueItem, removeQueueItem, getQueueItems, type QueueItem } from "./queue";

async function getBaseUrl(): Promise<string> {
  const r = await chrome.storage.local.get("devventory_web_url");
  return r.devventory_web_url || "http://localhost:3000";
}

async function fetchWithKey(path: string, body: unknown): Promise<Response> {
  const base = await getBaseUrl();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const { devventory_api_key } = await chrome.storage.sync.get("devventory_api_key");
  if (devventory_api_key) headers["x-api-key"] = devventory_api_key;
  return fetch(`${base}${path}`, { method: "POST", headers, body: JSON.stringify(body) });
}

function getBackoff(retries: number): number {
  return Math.min(1000 * Math.pow(2, retries), 30000) + Math.random() * 1000;
}

export type SendResult = { success: true; data: unknown } | { success: false; error: string; retryable: boolean };

export async function sendCapture(payload: unknown): Promise<SendResult> {
  try {
    const res = await fetchWithKey("/api/capture", payload);
    if (res.status === 201) {
      return { success: true, data: await res.json() };
    }
    if (res.status === 401) {
      return { success: false, error: "API key expired. Update in extension settings.", retryable: false };
    }
    if (res.status === 429) {
      return { success: false, error: "Rate limited", retryable: true };
    }
    if (res.status >= 500) {
      return { success: false, error: "Server error", retryable: true };
    }
    return { success: false, error: `HTTP ${res.status}`, retryable: true };
  } catch {
    return { success: false, error: "Network failure", retryable: true };
  }
}

export async function enqueueAndSend(
  id: string,
  payload: unknown,
  onFeedback?: (msg: string) => void
): Promise<void> {
  const item: QueueItem = {
    id,
    payload,
    createdAt: Date.now(),
    retries: 0,
    lastError: null,
    status: "pending",
  };

  await addToQueue(item);

  const result = await sendCapture(payload);
  if (result.success) {
    await removeQueueItem(id);
    onFeedback?.("Saved to Devventory");
    return;
  }

  if (!result.retryable) {
    await updateQueueItem(id, { status: "failed", lastError: result.error });
    onFeedback?.(`Devventory: ${result.error}`);
    return;
  }

  await updateQueueItem(id, { status: "pending", lastError: result.error });
  scheduleRetry(id, 1, payload, onFeedback);
}

async function scheduleRetry(
  id: string,
  retryCount: number,
  payload: unknown,
  onFeedback?: (msg: string) => void
): Promise<void> {
  if (retryCount > 3) {
    await updateQueueItem(id, { status: "failed", lastError: "Max retries exceeded" });
    onFeedback?.("Devventory: Save failed. Tap to retry.");
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, getBackoff(retryCount)));

  const result = await sendCapture(payload);
  if (result.success) {
    await removeQueueItem(id);
    return;
  }

  if (!result.retryable) {
    await updateQueueItem(id, { status: "failed", lastError: result.error });
    onFeedback?.(`Devventory: ${result.error}`);
    return;
  }

  await updateQueueItem(id, { status: "pending", lastError: result.error, retries: retryCount });
  scheduleRetry(id, retryCount + 1, payload, onFeedback);
}

export async function flushQueue(onFeedback?: (msg: string) => void): Promise<void> {
  const items = await getQueueItems("pending");
  for (const item of items) {
    await updateQueueItem(item.id, { status: "sending" });
    const result = await sendCapture(item.payload);
    if (result.success) {
      await removeQueueItem(item.id);
    } else if (!result.retryable) {
      await updateQueueItem(item.id, { status: "failed", lastError: result.error });
    } else {
      const nextRetry = (item.retries || 0) + 1;
      if (nextRetry > 3) {
        await updateQueueItem(item.id, { status: "failed", lastError: "Max retries exceeded" });
      } else {
        await updateQueueItem(item.id, { status: "pending", retries: nextRetry, lastError: result.error });
      }
    }
  }

  const remaining = await getQueueItems("pending");
  if (remaining.length > 0 && onFeedback) {
    onFeedback(`Devventory: ${remaining.length} capture(s) pending`);
  }
}
