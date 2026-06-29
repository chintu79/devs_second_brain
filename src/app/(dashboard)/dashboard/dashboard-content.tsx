export function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {children}
    </div>
  );
}

export function DashboardSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function SectionHeading({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: accent || 'var(--accent)' }} />
      <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em]">{children}</h2>
    </div>
  );
}
