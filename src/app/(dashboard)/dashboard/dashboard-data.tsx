import prisma, { safeQuery } from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";
import { getAnalytics } from "@/actions/analytics";
import { DashboardVaultBlocks } from "./vault-blocks";
import { DashboardTimeline } from "./timeline";
import { GraphView } from "@/components/graph/graph-view";
import { DashboardSection } from "./dashboard-content";
import { DashboardInsights } from "./insights";

export async function DashboardPrimarySection({ userId }: { userId: string | undefined }) {
  if (!userId) return null;

  const [resourceCount, promptCount, noteCount, projectCount, recentResources, recentPrompts, recentNotes, activeProjects] = await Promise.all([
    safeQuery("resource.count", () => prisma.resource.count({ where: { userId } }), 0),
    safeQuery("prompt.count", () => prisma.prompt.count({ where: { userId } }), 0),
    safeQuery("note.count", () => prisma.note.count({ where: { userId } }), 0),
    safeQuery("project.count", () => prisma.project.count({ where: { userId } }), 0),
    safeQuery("resource.recent", () => prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, url: true, createdAt: true } }), []),
    safeQuery("prompt.recent", () => prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }), []),
    safeQuery("note.recent", () => prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }), []),
    safeQuery("project.active", () => prisma.project.findMany({ where: { userId, status: { notIn: ["archived"] } }, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, createdAt: true } }), []),
  ]);

  const analyticsData = await getAnalytics();

  const totalItems = resourceCount + promptCount + noteCount + projectCount;
  const hasActivity = !!analyticsData && !("error" in analyticsData);

  const timeline = [
    ...recentResources.map((r) => ({ id: r.id, type: "resource" as const, title: r.title, href: "/resources", createdAt: r.createdAt })),
    ...recentPrompts.map((p) => ({ id: p.id, type: "prompt" as const, title: p.title, href: "/prompts", createdAt: p.createdAt })),
    ...recentNotes.map((n) => ({ id: n.id, type: "note" as const, title: n.title, href: "/notes", createdAt: n.createdAt })),
    ...activeProjects.map((p) => ({ id: p.id, type: "project" as const, title: p.title, href: "/projects", createdAt: p.createdAt })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

  return (
    <>
      <DashboardSection>
        <div className="flex items-start justify-between mb-6 mt-3">
          <div>
            <p className="text-base text-secondary-foreground">
              {totalItems > 0
                ? `${totalItems} items across ${[resourceCount, promptCount, noteCount, projectCount].filter((c) => c > 0).length} vaults`
                : "Start building your second brain"}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {hasActivity && analyticsData!.streak > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-400">
                  {analyticsData!.streak}-day streak
                </span>
              )}
            </div>
          </div>
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
    </>
  );
}

export async function DashboardGraphSection({ userId }: { userId: string | undefined }) {
  if (!userId) return null;

  const [graphResources, graphPrompts, graphNotes, graphProjects] = await Promise.all([
    safeQuery("graph.resources", () => prisma.resource.findMany({ where: { userId }, take: 500, ...includeTags }), []),
    safeQuery("graph.prompts", () => prisma.prompt.findMany({ where: { userId }, take: 500, ...includeTags }), []),
    safeQuery("graph.notes", () => prisma.note.findMany({ where: { userId }, take: 500, ...includeTags }), []),
    safeQuery("graph.projects", () => prisma.project.findMany({ where: { userId }, take: 500, ...includeTags }), []),
  ]);

  return (
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
          resources={flattenListTags(graphResources).map((r) => ({ id: r.id, title: r.title, tags: r.tags }))}
          prompts={flattenListTags(graphPrompts).map((p) => ({ id: p.id, title: p.title, tags: p.tags }))}
          notes={flattenListTags(graphNotes).map((n) => ({ id: n.id, title: n.title, tags: n.tags }))}
          projects={flattenListTags(graphProjects).map((p) => ({ id: p.id, title: p.title, tags: p.tags }))}
        />
      </div>
    </DashboardSection>
  );
}
