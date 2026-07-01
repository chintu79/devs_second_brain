import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden" data-accent="dashboard">
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        ← Back to Home
      </Link>
      {children}
    </main>
  )
}
