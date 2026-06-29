const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

export function DashboardGreeting({
  userName, streak,
}: {
  userName: string | null; streak: number;
}) {
  const name = userName || "developer";
  return (
    <div className="space-y-1.5">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {greeting}, <span style={{ color: 'var(--accent)' }}>{name}</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        {day}
        {streak > 0 && <span className="text-muted-foreground/60"> &middot; {streak}-day streak</span>}
      </p>
    </div>
  );
}
