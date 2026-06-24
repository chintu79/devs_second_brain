export default function RootLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="skeleton h-7 w-7 rounded-md" />
            <div className="skeleton h-4 w-32 rounded" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-16 rounded" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-9 rounded-md" />
            <div className="skeleton h-9 w-20 rounded-md" />
            <div className="skeleton h-9 w-28 rounded-md" />
          </div>
        </div>
      </nav>
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="skeleton h-5 w-56 rounded-full mx-auto mb-10" />
          <div className="skeleton h-16 w-3/4 rounded-lg mx-auto mb-6" />
          <div className="skeleton h-4 w-96 rounded mx-auto mb-10" />
          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="skeleton h-12 w-36 rounded-lg" />
            <div className="skeleton h-12 w-36 rounded-lg" />
          </div>
          <div className="skeleton h-[400px] w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
