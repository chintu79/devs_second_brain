"use client"

import { motion } from "framer-motion"
import { Brain, Link2, StickyNote, Sparkles, FolderKanban } from "lucide-react"

const floatingCards = [
  {
    icon: Link2,
    title: "Learn Next.js Server Actions",
    subtitle: "Saved resource",
    accent: "var(--color-resources)",
  },
  {
    icon: StickyNote,
    title: "System Design Notes",
    subtitle: "Personal note",
    accent: "var(--color-notes)",
  },
  {
    icon: Sparkles,
    title: "Code Review Assistant",
    subtitle: "AI prompt",
    accent: "var(--color-prompts)",
  },
  {
    icon: FolderKanban,
    title: "Voice AI Assistant",
    subtitle: "Active project",
    accent: "var(--color-projects)",
  },
]

export default function AuthBrand() {
  return (
    <aside className="relative hidden md:flex flex-col justify-between p-12 overflow-hidden border-r border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dashboard)]/[0.03] via-transparent to-[var(--color-notes)]/[0.03]" />
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-[var(--color-dashboard)]/5 blur-[120px]" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-[var(--color-notes)]/5 blur-[120px]" />

      <div className="relative z-10">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-dashboard)]/10">
            <Brain className="h-5 w-5 text-[var(--color-dashboard)]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">Dev Second Brain</span>
            <p className="text-xs text-[var(--text-muted)]">Developer Knowledge OS</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 space-y-3"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0, 0, 0.2, 1] }}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Everything your team knows, organized.
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md">
            Resources, prompts, notes, and projects — connected in a single workspace designed for developers.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-3">
        {floatingCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.6 + i * 0.2, duration: 0.6, ease: [0, 0, 0.2, 1] }}
          >
            <motion.div
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-3.5 w-72"
              style={{ borderLeftColor: card.accent, borderLeftWidth: 2 }}
              animate={{ y: [0, -6 + i * 2, 0] }}
              transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ backgroundColor: `${card.accent}15` }}>
                <card.icon className="h-4 w-4" style={{ color: card.accent }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{card.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{card.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="relative z-10 text-xs text-[var(--text-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        Save. Connect. Retrieve.
      </motion.p>
    </aside>
  )
}
