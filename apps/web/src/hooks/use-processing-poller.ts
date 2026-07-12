import { useEffect, useRef } from "react";

export function useProcessingPoller(
  items: { id: string; captureStatus?: string | null }[],
  onStatusChange: (id: string, status: string) => void,
  intervalMs = 10_000
) {
  const itemsRef = useRef(items);
  const onStatusChangeRef = useRef(onStatusChange);

  useEffect(() => {
    itemsRef.current = items;
    onStatusChangeRef.current = onStatusChange;
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.hidden) return;
      const processing = itemsRef.current.filter((i) => i.captureStatus === "processing");
      if (processing.length === 0) return;
      const { getCaptureStatus } = await import("@/actions/capture");
      for (const item of processing) {
        const status = await getCaptureStatus(item.id);
        if (status && status !== "processing") {
          onStatusChangeRef.current(item.id, status);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
}
