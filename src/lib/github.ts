import type { Repository } from "@/lib/mock-data"

const GITHUB_API = "https://api.github.com"

const languageCategoryMap: Record<string, string> = {
  TypeScript: "frontend",
  JavaScript: "frontend",
  Python: "ai",
  Go: "backend",
  Rust: "devtools",
  Java: "backend",
  "C#": "backend",
  Ruby: "backend",
  Swift: "mobile",
  Kotlin: "mobile",
  Dart: "frontend",
  Shell: "devops",
  Dockerfile: "devops",
  "C++": "backend",
  Zig: "devtools",
  Lua: "devtools",
  HTML: "frontend",
  CSS: "frontend",
}

const topicCategoryOverrides: Record<string, string> = {
  ai: "ai",
  "machine-learning": "ai",
  "deep-learning": "ai",
  llm: "ai",
  "large-language-model": "ai",
  agent: "agents",
  agents: "agents",
  "ai-agent": "agents",
  frontend: "frontend",
  react: "frontend",
  vue: "frontend",
  css: "frontend",
  ui: "frontend",
  backend: "backend",
  api: "backend",
  database: "backend",
  devops: "devops",
  infrastructure: "infrastructure",
  testing: "devtools",
  cli: "devtools",
  "developer-tools": "devtools",
  mobile: "mobile",
  flutter: "frontend",
  linux: "linux",
  "data-science": "datascience",
  data: "datascience",
}

function inferCategory(topics: string[], language: string | null): string {
  for (const topic of topics) {
    const mapped = topicCategoryOverrides[topic.toLowerCase()]
    if (mapped) return mapped
  }
  if (language && languageCategoryMap[language]) return languageCategoryMap[language]
  return "other"
}

const growthStarsThresholds: { min: number; indicator: Repository["growthIndicator"] }[] = [
  { min: 20000, indicator: "hot" },
  { min: 8000, indicator: "trending" },
  { min: 2000, indicator: "rising" },
  { min: 500, indicator: "stable" },
]

function inferGrowthIndicator(stars: number, createdAt: string): Repository["growthIndicator"] {
  const daysOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  if (daysOld < 30) return "new"
  for (const t of growthStarsThresholds) {
    if (stars >= t.min) return t.indicator
  }
  return "stable"
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

function mapRepo(item: any): Repository {
  const topics: string[] = item.topics || []
  const language = item.language
  return {
    id: String(item.id),
    name: item.name,
    owner: item.owner?.login || "unknown",
    description: item.description || "",
    stars: item.stargazers_count || 0,
    forks: item.forks_count || 0,
    language: language || "Unknown",
    url: item.html_url || "",
    topics,
    category: inferCategory(topics, language),
    growthIndicator: inferGrowthIndicator(item.stargazers_count || 0, item.created_at),
    useCases: [],
    keyFeatures: [],
    saved: false,
    bookmarked: false,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }
}

function buildSections(repos: Repository[]) {
  const sorted = [...repos].sort((a, b) => b.stars - a.stars)
  const byStars = (threshold: number) => sorted.filter((r) => r.stars >= threshold)
  return [
    {
      id: "trending-today",
      label: "Trending Today",
      repos: sorted.filter((r) => r.growthIndicator === "trending" || r.growthIndicator === "hot").slice(0, 8),
    },
    {
      id: "top-this-week",
      label: "Top This Week",
      repos: sorted.slice(0, 10),
    },
    {
      id: "hidden-gems",
      label: "Hidden Gems",
      repos: sorted.filter((r) => r.stars >= 500 && r.stars <= 2000).slice(0, 6),
    },
    {
      id: "recently-released",
      label: "Recently Released",
      repos: sorted.filter((r) => r.growthIndicator === "new").slice(0, 6),
    },
  ].filter((s) => s.repos.length > 0)
}

function buildCategories(repos: Repository[]) {
  const counts: Record<string, number> = {}
  for (const r of repos) {
    counts[r.category] = (counts[r.category] || 0) + 1
  }
  const labelMap: Record<string, string> = {
    ai: "Artificial Intelligence",
    agents: "Agents",
    frontend: "Frontend",
    backend: "Backend",
    devops: "DevOps",
    mobile: "Mobile",
    linux: "Linux",
    datascience: "Data Science",
    devtools: "Developer Tools",
    infrastructure: "Infrastructure",
    other: "Other",
  }
  const order = ["ai", "agents", "frontend", "backend", "devops", "mobile", "linux", "datascience", "devtools", "infrastructure", "other"]
  return order
    .filter((id) => counts[id])
    .map((id) => ({ id, label: labelMap[id] || id, count: counts[id] }))
}

export async function fetchTrendingRepos() {
  try {
    const url = `${GITHUB_API}/search/repositories?q=stars:>300+pushed:>2025-01-01&sort=stars&order=desc&per_page=50`
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

    const data = await res.json()
    if (!data.items || !Array.isArray(data.items)) throw new Error("Invalid GitHub API response")

    const repos = data.items.map(mapRepo)
    return {
      repos,
      sections: buildSections(repos),
      categories: buildCategories(repos),
    }
  } catch (error) {
    console.error("Failed to fetch trending repos:", error)
    return null
  }
}
