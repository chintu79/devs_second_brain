import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ContinueWorking } from "@/components/dashboard/continue-working";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { KnowledgeLibrary } from "@/components/dashboard/knowledge-library";
import { ContextPanel } from "@/components/dashboard/context-panel";
import { PageTransition } from "@/components/dashboard/page-transition";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const userId = session?.user?.id;

  const [resourceCount, promptCount, noteCount, projectCount, recentResources, recentNotes, activeProjects] = userId
    ? await Promise.all([
        prisma.resource.count({ where: { userId } }),
        prisma.prompt.count({ where: { userId } }),
        prisma.note.count({ where: { userId } }),
        prisma.project.count({ where: { userId } }),
        prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, url: true, createdAt: true } }),
        prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }),
        prisma.project.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, title: true, status: true, createdAt: true } }),
      ])
    : [0, 0, 0, 0, [], [], []];

  const vaultCounts = { resources: resourceCount, prompts: promptCount, notes: noteCount, projects: projectCount };
  const totalItems = resourceCount + promptCount + noteCount + projectCount;

  const recentActivity: string[] = [];
  if (recentResources.length > 0) recentActivity.push(`Saved "${recentResources[0].title}"`);
  if (recentNotes.length > 0) recentActivity.push(`Wrote "${recentNotes[0].title}"`);
  if (activeProjects.length > 0) recentActivity.push(`Updated "${activeProjects[0].title}"`);

  const lastAdded = {
    resources: recentResources[0] ? { title: recentResources[0].title } : null,
    prompts: null,
    notes: recentNotes[0] ? { title: recentNotes[0].title } : null,
    projects: activeProjects[0] ? { title: activeProjects[0].title } : null,
  };

  const projects = activeProjects.map((p) => ({
    id: p.id,
    name: p.title,
    status: p.status,
    updatedAt: formatRelative(p.createdAt),
    nextAction: p.status === "Planning" ? "Define scope" : p.status === "In Progress" ? "Complete current task" : "Review progress",
    progress: p.status === "Planning" ? 10 : p.status === "In Progress" ? 45 : p.status === "Review" ? 80 : 100,
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = userName || "developer";

  return (
    <div data-accent="dashboard">
      <PageTransition>
        <div className="flex h-full">
          <div className="flex-1 min-w-0 max-w-4xl">
            {/* Greeting — hero */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {greeting}, <span style={{ color: "var(--accent)" }}>{name}</span>
              </h1>
              {totalItems > 0 && (
                <p className="text-base text-secondary-foreground mt-2">
                  {totalItems} items across {Object.values(vaultCounts).filter((c) => c > 0).length} vaults
                </p>
              )}
              {totalItems === 0 && (
                <p className="text-base text-secondary-foreground mt-2">
                  Start building your second brain &mdash; save a resource, write a note, or create a project.
                </p>
              )}
            </div>

            <div className="space-y-10">
              {/* Primary: Continue Working */}
              <ContinueWorking projects={projects} />

              {/* Secondary: Recent Activity */}
              <RecentActivity
                resources={recentResources.map((r) => ({ id: r.id, title: r.title, createdAt: r.createdAt }))}
                notes={recentNotes.map((n) => ({ id: n.id, title: n.title, createdAt: n.createdAt }))}
                projects={activeProjects.map((p) => ({ id: p.id, title: p.title, status: p.status, createdAt: p.createdAt }))}
              />

              {/* Tertiary: Knowledge Library */}
              <KnowledgeLibrary counts={vaultCounts} lastAdded={lastAdded} />
            </div>
          </div>

          <ContextPanel
            recentActivity={recentActivity}
            recentNotes={recentNotes.map((n) => ({ id: n.id, title: n.title }))}
          />
        </div>
      </PageTransition>
    </div>
  );
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
