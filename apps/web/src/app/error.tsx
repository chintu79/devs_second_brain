"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@devventory/ui";
import { Brain } from "lucide-react";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Brain className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Dev Second Brain</span>
      </Link>
      <div className="text-center max-w-sm">
        <h1 className="text-lg font-semibold mb-2">Something went wrong</h1>
        <p className="text-sm text-muted-foreground mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" className="h-9 px-4 text-sm">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="h-9 px-4 text-sm">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
