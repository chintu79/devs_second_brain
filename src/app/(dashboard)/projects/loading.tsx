export default function ProjectsLoading() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-5 w-24 rounded mb-1" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-9 w-32 rounded-md" />
      </div>
      <div className="skeleton h-10 w-full rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton h-44 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
