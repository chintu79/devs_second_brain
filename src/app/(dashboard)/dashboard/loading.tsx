export default function DashboardPageLoading() {
  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 max-w-4xl">
        <div className="mb-8">
          <div className="skeleton h-6 w-64 rounded mb-1" />
          <div className="skeleton h-4 w-48 rounded" />
        </div>
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-5 w-16 rounded-md" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[116px] w-full rounded-xl" />
              ))}
            </div>
          </section>
          <section>
            <div className="skeleton h-3 w-28 rounded mb-5" />
            <div className="skeleton h-[220px] w-full rounded-xl" />
          </section>
          <section>
            <div className="skeleton h-3 w-28 rounded mb-5" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-28 rounded-xl" />
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="w-[300px] border-l border-border/50 p-6 space-y-10">
        <div className="space-y-3">
          <div className="skeleton h-3 w-16 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-10 w-full rounded" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="skeleton h-3 w-12 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-8 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
