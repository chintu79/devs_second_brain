export function KnowledgeSkeleton() {
  return (
    <div className="w-full p-5">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,280px)] auto-rows-[200px] gap-3 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-full rounded-xl border border-border/50 bg-card animate-pulse p-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 rounded bg-muted/60 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/60 rounded w-3/4" />
                  <div className="h-3 bg-muted/40 rounded w-1/3" />
                </div>
                <div className="h-4 w-4 rounded bg-muted/40 shrink-0" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-3 bg-muted/40 rounded w-full" />
                <div className="h-3 bg-muted/40 rounded w-5/6" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 rounded-full bg-muted/40" />
              <div className="h-3 w-16 bg-muted/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
