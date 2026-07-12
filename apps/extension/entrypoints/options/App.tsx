import { useState, useEffect } from "react";

async function getBaseUrl(): Promise<string> {
  const r = await chrome.storage.local.get("devventory_web_url");
  return r.devventory_web_url || "http://localhost:3000";
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:3000");
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [error, setError] = useState("");
  const [queueLen, setQueueLen] = useState(0);

  useEffect(() => {
    (async () => {
      const { devventory_api_key } = await chrome.storage.sync.get("devventory_api_key");
      if (devventory_api_key) setSavedKey(true);
      const r = await chrome.storage.local.get("devventory_web_url");
      if (r.devventory_web_url) setServerUrl(r.devventory_web_url);
      checkStatus(devventory_api_key, r.devventory_web_url);
      checkQueue();
    })();
  }, []);

  async function checkStatus(key?: string, url?: string) {
    setStatus("checking");
    const k = key || (await chrome.storage.sync.get("devventory_api_key")).devventory_api_key;
    const u = url || (await chrome.storage.local.get("devventory_web_url")).devventory_web_url || "http://localhost:3000";
    if (!k) { setStatus("disconnected"); return; }
    try {
      const res = await fetch(`${u}/api/ext/verify-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": k },
      });
      setStatus(res.ok ? "connected" : "disconnected");
    } catch {
      setStatus("disconnected");
    }
  }

  async function checkQueue() {
    try {
      const res = await chrome.runtime.sendMessage({ type: "check-queue" }) as { pending?: number };
      if (res?.pending) setQueueLen(res.pending);
    } catch {}
  }

  async function handleSaveKey() {
    setError("");
    const trimmed = apiKey.trim();
    if (!trimmed) { setError("Enter an API key"); return; }

    try {
      const res = await fetch(`${serverUrl}/api/ext/verify-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": trimmed },
      });
      if (!res.ok) { setError("Key is invalid"); return; }
    } catch {
      setError("Could not reach server");
      return;
    }

    await chrome.storage.sync.set({ devventory_api_key: trimmed });
    await chrome.storage.local.set({ devventory_web_url: serverUrl });
    setSavedKey(true);
    setApiKey("");
    checkStatus(trimmed, serverUrl);
  }

  async function handleRemoveKey() {
    await chrome.storage.sync.remove("devventory_api_key");
    setSavedKey(false);
    setStatus("disconnected");
  }

  return (
    <>
      <h1>
        <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z" />
          <path d="M8 14v1a4 4 0 0 0 8 0v-1" />
        </svg>
        Devventory
      </h1>
      <p className="sub">Extension Settings</p>

      <div className="card">
        <h2>Connection</h2>
        <label>Server URL</label>
        <input
          type="text"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="http://localhost:3000"
        />
        <div className="status">
          <span className={`status-dot ${status}`} />
          {status === "connected" ? "Connected" : status === "checking" ? "Checking..." : "Disconnected"}
        </div>
        {queueLen > 0 && (
          <p className="info">{queueLen} capture(s) pending</p>
        )}
      </div>

      <div className="card">
        <h2>API Key</h2>
        {savedKey ? (
          <>
            <p className="success">Key is configured</p>
            <div className="mt-3">
              <button className="btn btn-danger" onClick={handleRemoveKey}>Remove Key</button>
            </div>
          </>
        ) : (
          <>
            <label>Paste your API key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
            />
            {error && <p className="error">{error}</p>}
            <div className="flex mt-3">
              <button className="btn btn-primary" onClick={handleSaveKey}>Save & Verify</button>
            </div>
            <p className="info">Generate a key in the Devventory web app: Settings → API Keys</p>
          </>
        )}
      </div>
    </>
  );
}
