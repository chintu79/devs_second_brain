import { fetchTrendingRepos } from "@/lib/github"
import { allRepos, discoverySections, sidebarCategories } from "@/lib/mock-data"
import { RadarWorkspace } from "@/components/radar/radar-workspace"

export default async function RadarPage() {
  const realData = await fetchTrendingRepos()

  const repos = realData?.repos ?? allRepos
  const sections = realData?.sections ?? discoverySections
  const categories = realData?.categories ?? sidebarCategories

  return (
    <div data-accent="radar" className="-m-5 pb-8 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      <RadarWorkspace
        repos={repos}
        sections={sections}
        categories={categories}
      />
    </div>
  )
}
