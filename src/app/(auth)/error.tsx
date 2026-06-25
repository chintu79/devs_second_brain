"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="w-full max-w-sm text-center">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 mx-auto mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <h1 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Authentication error</h1>
        <p className="text-xs text-[var(--text-muted)] mb-6">
          Something went wrong. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="default" size="sm">
            Try again
          </Button>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
