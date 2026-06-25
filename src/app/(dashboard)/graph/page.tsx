import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";
import { GraphView } from "@/components/graph/graph-view";

export default async function GraphPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48" data-accent="graph">
        <p className="text-sm text-muted-foreground">Sign in to view your knowledge graph.</p>
      </div>
    );
  }

  const [resources, prompts, notes, projects] = await Promise.all([
    prisma.resource.findMany({ where: { userId }, ...includeTags }),
    prisma.prompt.findMany({ where: { userId }, ...includeTags }),
    prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, ...includeTags }),
    prisma.project.findMany({ where: { userId }, ...includeTags }),
  ]);

  return (
    <div data-accent="graph" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      <GraphView
        resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
        prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
        notes={flattenListTags(notes).map((n) => ({ ...n, content: n.content, category: n.category }))}
        projects={flattenListTags(projects.map((p) => ({ ...p, planMd: p.planMd })))}
      />
    </div>
  );
}
