import { Brain } from "lucide-react"

export default function AuthBrand() {
  return (
    <aside className="relative hidden md:flex flex-col justify-between p-12 border-r border-border/50">
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-dashboard)]/10">
            <Brain className="h-5 w-5 text-[var(--color-dashboard)]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Dev Second Brain</span>
            <p className="text-xs text-[var(--text-muted)]">Developer Knowledge OS</p>
          </div>
        </div>

        <div className="mt-16 space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Everything your team knows, organized.
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
            Resources, prompts, notes, and projects — connected in a single workspace designed for developers.
          </p>
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Save. Connect. Retrieve.
      </p>
    </aside>
  )
}
