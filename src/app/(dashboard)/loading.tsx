export default function DashboardLoading() {
  return (
    <div className="p-5 lg:p-8 space-y-8">
      <div className="skeleton h-5 w-48 rounded" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
