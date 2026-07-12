"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error("Dashboard error:", error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center" data-accent="knowledge">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
        <RefreshCw className="h-6 w-6 text-destructive" />
      </div>
      <h2 className="text-base font-semibold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
