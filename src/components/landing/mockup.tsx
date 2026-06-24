export function Mockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Subtle glow behind mockup */}
      <div className="absolute -inset-8 bg-gradient-to-b from-[#6366F1]/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Window frame */}
      <div className="relative rounded-xl border border-border bg-card shadow-2xl shadow-[var(--shadow-elevated)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-secondary/30">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground/50 font-medium tracking-tight">Dev Second Brain — workspace</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex h-[520px]">
          {/* Activity bar */}
          <div className="flex w-11 flex-col items-center gap-3 border-r border-border bg-secondary/50 py-3">
            {["bookmark", "sparkles", "sticky-note", "folder-kanban", "radio"].map((icon, i) => {
              const icons: Record<string, React.ReactNode> = {
                "bookmark": <BookmarkIcon active={i === 0} />,
                "sparkles": <SparklesIcon active={i === 1} />,
                "sticky-note": <NoteIcon active={i === 2} />,
                "folder-kanban": <FolderIcon active={i === 3} />,
                "radio": <RadioIcon active={i === 4} />,
              };
              return (
                <div key={icon} className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-muted cursor-pointer ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {icons[icon]}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="w-56 border-r border-border bg-muted/20 p-3.5 flex flex-col gap-px">
            <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-2 px-1.5">Vaults</div>
            {[
              { name: "Resources", count: 24, active: false },
              { name: "Prompts", count: 18, active: false },
              { name: "Notes", count: 31, active: true },
              { name: "Projects", count: 7, active: false },
            ].map((v) => (
              <div
                key={v.name}
                className={`flex items-center justify-between rounded-md px-2 py-[7px] text-xs transition-colors ${
                  v.active ? "bg-[#6366F1]/8 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span>{v.name}</span>
                <span className="text-[10px] text-muted-foreground/40">{v.count}</span>
              </div>
            ))}
            <div className="mt-4 border-t border-border pt-3.5">
              <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-2.5 px-1.5">Recent</div>
              {[
                { name: "useEffect deep dive", type: "note" },
                { name: "API prompt collection", type: "prompt" },
                { name: "Server actions guide", type: "resource" },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-2.5 rounded-md px-2 py-[7px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                  <FileDot type={f.type} />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search bar */}
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5 bg-muted/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-sm text-foreground/80">useEffect</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground/50">⌘K</kbd>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto p-4 space-y-5">
              <ResultGroup title="Resources" count={3}>
                <ResultItem
                  icon={<LinkIcon />}
                  title="Using useEffect in React"
                  subtitle="react.dev — Tagged: react, hooks, effects"
                />
                <ResultItem
                  icon={<LinkIcon />}
                  title="React hooks cheatsheet"
                  subtitle="dev.to — Tagged: react, cheatsheet"
                />
                <ResultItem
                  icon={<LinkIcon />}
                  title="Effect cleanup patterns"
                  subtitle="overreacted.io — Tagged: react, patterns"
                />
              </ResultGroup>

              <ResultGroup title="Prompts" count={2}>
                <ResultItem
                  icon={<MessageIcon />}
                  title="Refactor useEffect to custom hook"
                  subtitle="Use case: Code review — 2 days ago"
                />
                <ResultItem
                  icon={<MessageIcon />}
                  title="Generate JSDoc for useEffect"
                  subtitle="Use case: Documentation — 1 week ago"
                />
              </ResultGroup>

              <ResultGroup title="Notes" count={1}>
                <ResultItem
                  icon={<DocIcon />}
                  title="useEffect deep dive notes"
                  subtitle="react/advanced — 3 tags — Updated yesterday"
                />
              </ResultGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5 px-0.5">
        <span className="text-[11px] font-semibold text-muted-foreground/70">{title}</span>
        <span className="text-[10px] text-muted-foreground/30">({count})</span>
      </div>
      <div className="space-y-px">{children}</div>
    </div>
  );
}

function ResultItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer">
      <div className="shrink-0 text-muted-foreground/40">{icon}</div>
      <div className="min-w-0">
        <div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">{title}</div>
        <div className="text-[11px] text-muted-foreground/50 mt-px truncate">{subtitle}</div>
      </div>
    </div>
  );
}

function FileDot({ type }: { type: string }) {
  const fillClass = type === "note" ? "fill-primary" : type === "prompt" ? "fill-success" : "fill-warning";
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" className={`shrink-0 ${fillClass}`}>
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

function IconTemplate({ children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <IconTemplate active={active}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </IconTemplate>
  );
}

function SparklesIcon({ active }: { active: boolean }) {
  return (
    <IconTemplate active={active}>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <path d="M18 14l1 2.5 2.5 1-2.5 1L18 21l-1-2.5L14.5 17l2.5-1z" />
    </IconTemplate>
  );
}

function NoteIcon({ active }: { active: boolean }) {
  return (
    <IconTemplate active={active}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </IconTemplate>
  );
}

function FolderIcon({ active }: { active: boolean }) {
  return (
    <IconTemplate active={active}>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" />
    </IconTemplate>
  );
}

function RadioIcon({ active }: { active: boolean }) {
  return (
    <IconTemplate active={active}>
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </IconTemplate>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
