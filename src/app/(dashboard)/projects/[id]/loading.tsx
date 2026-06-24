export default function ProjectDetailLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="skeleton h-8 w-8 rounded-md" />
        <div className="flex items-center gap-3">
          <div className="skeleton h-5 w-5 rounded" />
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
      <div className="flex gap-1 border-b border-border pb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-7 w-20 rounded-t-md" />
        ))}
      </div>
      <div className="space-y-4">
        <div className="skeleton h-32 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-28 rounded-lg" />
          <div className="skeleton h-28 rounded-lg" />
        </div>
        <div className="skeleton h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
