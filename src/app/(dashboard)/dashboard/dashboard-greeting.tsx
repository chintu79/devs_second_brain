const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

export function DashboardGreeting({ userName }: { userName: string | null }) {
  const name = userName || "developer";
  return (
    <div className="overflow-y-auto">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
        {greeting}, <span className="accent-text" style={{ '--accent-c': 'var(--accent)' } as React.CSSProperties}>{name}</span>
      </h1>
    </div>
  );
}
