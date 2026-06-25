import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";
import { getAnalytics } from "@/actions/analytics";
import { PageTransition } from "@/components/dashboard/page-transition";
import { DashboardContent, DashboardSection } from "./dashboard-content";
import { DashboardVaultBlocks } from "./vault-blocks";
import { DashboardInsights } from "./insights";
import { DashboardQuickActions } from "./quick-actions";
import { DashboardTimeline } from "./timeline";
import { GraphView } from "@/components/graph/graph-view";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name ?? null;
  const userId = session?.user?.id;

  const [resourceCount, promptCount, noteCount, projectCount, recentResources, recentPrompts, recentNotes, activeProjects, analyticsData] = userId
    ? await Promise.all([
      prisma.resource.count({ where: { userId } }),
      prisma.prompt.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.project.count({ where: { userId } }),
      prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, url: true, createdAt: true } }),
      prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }),
      prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }),
      prisma.project.findMany({ where: { userId, status: { notIn: ["archived"] } }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } }),
      getAnalytics(),
    ])
    : [0, 0, 0, 0, [], [], [], [], null];

  const vaultCounts = { resources: resourceCount, prompts: promptCount, notes: noteCount, projects: projectCount };
  const totalItems = resourceCount + promptCount + noteCount + projectCount;

  // Graph data
  const [graphResources, graphPrompts, graphNotes, graphProjects] = userId
    ? await Promise.all([
      prisma.resource.findMany({ where: { userId }, ...includeTags }),
      prisma.prompt.findMany({ where: { userId }, ...includeTags }),
      prisma.note.findMany({ where: { userId }, ...includeTags }),
      prisma.project.findMany({ where: { userId }, ...includeTags }),
    ])
    : [[], [], [], []];

  // Merge all recent items into a unified timeline
  const timeline = [
    ...recentResources.map((r) => ({ id: r.id, type: "resource" as const, title: r.title, href: "/resources", createdAt: r.createdAt })),
    ...recentPrompts.map((p) => ({ id: p.id, type: "prompt" as const, title: p.title, href: "/prompts", createdAt: p.createdAt })),
    ...recentNotes.map((n) => ({ id: n.id, type: "note" as const, title: n.title, href: "/notes", createdAt: n.createdAt })),
    ...activeProjects.map((p) => ({ id: p.id, type: "project" as const, title: p.title, href: "/projects", createdAt: p.createdAt })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = userName || "developer";

  const hasActivity = !!(analyticsData && !("error" in analyticsData));

  return (
    <div data-accent="dashboard" className="h-full overflow-y-auto">
      <PageTransition>
        <DashboardContent>
          {/* Greeting hero */}
          <DashboardSection>
            <div className="flex items-start justify-between mb-6">
              <div className="overflow-y-auto">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {greeting}, <span style={{ color: "var(--accent)" }}>{name}</span>
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-base text-secondary-foreground">
                    {totalItems > 0
                      ? `${totalItems} items across ${Object.values(vaultCounts).filter((c) => c > 0).length} vaults`
                      : "Start building your second brain"}
                  </p>
                  {hasActivity && analyticsData!.streak > 0 && (
                    <span className="flex items-center gap-1 text-sm text-amber-400">
                      {analyticsData!.streak}-day streak
                    </span>
                  )}
                </div>
              </div>

              {/* Today + Week summary */}
              {hasActivity && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <div className="text-right">
                    <p className="text-foreground/80 font-medium">Today</p>
                    <p>+{analyticsData!.todayCounts.resources + analyticsData!.todayCounts.prompts + analyticsData!.todayCounts.notes + analyticsData!.todayCounts.projects} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground/80 font-medium">This Week</p>
                    <p>+{analyticsData!.weekCounts.resources + analyticsData!.weekCounts.prompts + analyticsData!.weekCounts.notes + analyticsData!.weekCounts.projects} items</p>
                  </div>
                </div>
              )}
            </div>
          </DashboardSection>

          {/* Quick Action Bar */}
          <DashboardSection>
            <DashboardQuickActions />
          </DashboardSection>

          {/* 4 vault blocks */}
          <DashboardSection>
            <div className="mb-6">
              <DashboardVaultBlocks
                resources={{ count: resourceCount, items: recentResources.map((r) => ({ id: r.id, title: r.title, createdAt: r.createdAt })) }}
                prompts={{ count: promptCount, items: recentPrompts.map((p) => ({ id: p.id, title: p.title, createdAt: p.createdAt })) }}
                notes={{ count: noteCount, items: recentNotes.map((n) => ({ id: n.id, title: n.title, createdAt: n.createdAt })) }}
                projects={{ count: projectCount, items: activeProjects.map((p) => ({ id: p.id, title: p.title, status: p.status, createdAt: p.createdAt })) }}
              />
            </div>
          </DashboardSection>

          {/* Bottom row: Timeline + Insights */}
          <DashboardSection>
            <div className="flex gap-6">
              <div className="flex-[3] min-w-0">
                <DashboardTimeline items={timeline} />
              </div>
              {hasActivity && (
                <div className="flex-[2] min-w-0">
                  <DashboardInsights data={analyticsData} />
                </div>
              )}
            </div>
          </DashboardSection>

          {/* Knowledge Graph */}
          <DashboardSection>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Knowledge Graph</h2>
                <a href="/graph" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Open full graph →
                </a>
              </div>
              <GraphView
                compact
                resources={flattenListTags(graphResources).map((r: any) => ({ id: r.id, title: r.title, tags: r.tags }))}
                prompts={flattenListTags(graphPrompts).map((p: any) => ({ id: p.id, title: p.title, tags: p.tags }))}
                notes={flattenListTags(graphNotes).map((n: any) => ({ id: n.id, title: n.title, tags: n.tags }))}
                projects={flattenListTags(graphProjects).map((p: any) => ({ id: p.id, title: p.title, tags: p.tags }))}
              />
            </div>
          </DashboardSection>
        </DashboardContent>
      </PageTransition>
    </div>
  );
}
