import { useState, useEffect, useRef, useCallback } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: {
  data: T;
  onSave: (data: T) => Promise<unknown>;
  delay?: number;
  enabled?: boolean;
}) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const lastSnapshot = useRef("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) { setStatus("idle"); return; }
    const snapshot = JSON.stringify(data);
    if (snapshot === lastSnapshot.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      setStatus("saving");
      try {
        await onSaveRef.current(data);
        lastSnapshot.current = snapshot;
        setStatus("saved");
        statusTimer.current = setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        statusTimer.current = setTimeout(() => setStatus("idle"), 3000);
      }
    }, delay);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, [data, delay, enabled]);

  const saveNow = useCallback(async () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    const snapshot = JSON.stringify(data);
    if (snapshot === lastSnapshot.current) return;
    setStatus("saving");
    try {
      await onSaveRef.current(data);
      lastSnapshot.current = snapshot;
      setStatus("saved");
      statusTimer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      statusTimer.current = setTimeout(() => setStatus("idle"), 3000);
    }
  }, [data]);

  return { status, saveNow };
}
