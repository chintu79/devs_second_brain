"use client";

import { useEffect } from "react";
import { Button } from "@devventory/ui";
import { AlertTriangle } from "lucide-react";

export function ErrorCard({ error, reset, title = "Something went wrong" }: { error: Error & { digest?: string }; reset: () => void; title?: string }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">Something went wrong. Please try again.</p>
      <Button onClick={reset} variant="default" size="sm" className="h-8 text-xs">Try again</Button>
    </div>
  );
}
