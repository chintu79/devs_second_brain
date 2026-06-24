export default function RadarLoading() {
  return (
    <div className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      {/* Sidebar skeleton */}
      <div className="w-56 shrink-0 border-r border-border/50 bg-sidebar p-3 space-y-2">
        <div className="skeleton h-4 w-16 rounded mb-4" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-8 w-full rounded-md" />)}
        <div className="skeleton h-px w-full my-2" />
        <div className="skeleton h-4 w-20 rounded mb-3" />
        {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-7 w-full rounded-md" />)}
      </div>

      {/* Feed skeleton */}
      <div className="flex-1 p-5 space-y-6">
        <div className="skeleton h-10 w-full rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-28 w-full rounded-xl" />
            <div className="skeleton h-28 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Context skeleton */}
      <div className="w-64 shrink-0 border-l border-border/30 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-6 w-full rounded-md" />
            <div className="skeleton h-6 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
