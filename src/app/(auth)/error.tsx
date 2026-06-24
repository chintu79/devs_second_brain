"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Brain className="h-6 w-6" />
        <span className="text-xl font-bold">Dev Second Brain</span>
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 text-center">
        <h1 className="text-sm font-semibold mb-2">Authentication error</h1>
        <p className="text-xs text-muted-foreground mb-4">
          Something went wrong. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" size="sm" className="h-8 text-xs">
            Try again
          </Button>
          <Link href="/login">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
