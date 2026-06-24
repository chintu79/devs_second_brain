export default function SearchLoading() {
  return (
    <div className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      {/* Results skeleton */}
      <div className="flex-1 p-6 space-y-6">
        <div className="skeleton h-14 w-full rounded-xl" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded" />
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
        </div>
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded" />
          {[1, 2].map((i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
        </div>
      </div>

      {/* Context skeleton */}
      <div className="w-64 shrink-0 border-l border-border/30 p-4 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-5 w-full rounded-md" />
            <div className="skeleton h-5 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
