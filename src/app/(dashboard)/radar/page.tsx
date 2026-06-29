import { Suspense } from "react"
import { auth } from "@/lib/auth"
import prisma, { safeQuery } from "@/lib/prisma"
import { fetchTrendingRepos } from "@/lib/github"
import { allRepos, discoverySections, sidebarCategories } from "@/lib/mock-data"
import { RadarWorkspace } from "@/components/radar/radar-workspace"

export default async function RadarPage() {
  const session = await auth()
  const userId = session?.user?.id

  const realData = await fetchTrendingRepos()
  const repos = realData?.repos ?? allRepos
  const sections = realData?.sections ?? discoverySections
  const categories = realData?.categories ?? sidebarCategories

  let userTags: string[] = []
  if (userId) {
    const tags = await safeQuery("radar.tags", () =>
      prisma.tag.findMany({ where: { userId }, select: { name: true } }), []
    )
    userTags = tags.map((t) => t.name)
  }

  return (
    <div data-accent="radar" className="absolute inset-0 flex overflow-hidden">
      <Suspense fallback={<div className="flex-1" />}>
        <RadarWorkspace
          repos={repos}
          sections={sections}
          categories={categories}
          userTags={userTags}
        />
      </Suspense>
    </div>
  )
}
