"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <h1 className="text-sm font-semibold mb-2">Something went wrong</h1>
        <p className="text-xs text-muted-foreground mb-6">
          An unexpected error occurred while loading this page.
        </p>
        <Button onClick={reset} variant="default" size="sm" className="h-8 text-xs">
          Try again
        </Button>
      </div>
    </div>
  );
}
