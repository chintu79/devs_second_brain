export default function PromptsLoading() {
  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <div className="skeleton h-6 w-36 rounded mb-1" />
          <div className="skeleton h-4 w-80 rounded" />
        </div>

        <div className="space-y-5">
          <div className="skeleton h-12 w-full rounded-xl" />

          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-12 rounded-lg" />
            <div className="skeleton h-7 w-20 rounded-lg" />
            <div className="skeleton h-7 w-16 rounded-lg" />
          </div>

          <div className="skeleton h-4 w-48 rounded" />

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="skeleton h-4 w-8 rounded" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[160px] w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[280px] border-l border-border/50 p-5 space-y-8">
        <div className="space-y-3">
          <div className="skeleton h-3 w-20 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-8 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
