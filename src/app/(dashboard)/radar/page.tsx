import { allRepos, discoverySections, sidebarCategories } from "@/lib/mock-data";
import { RadarWorkspace } from "@/components/radar/radar-workspace";

export const dynamic = "force-static";

export default function RadarPage() {
  return (
    <div data-accent="radar" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      <RadarWorkspace
        repos={allRepos}
        sections={discoverySections}
        categories={sidebarCategories}
      />
    </div>
  );
}
