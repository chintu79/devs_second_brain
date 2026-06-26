export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
  category: string;
  growthIndicator: "trending" | "hot" | "rising" | "stable" | "new";
  useCases: string[];
  keyFeatures: string[];
  savedBy?: string;
  highlight?: string;
  saved: boolean;
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const repos: Repository[] = [
  {
    id: "1", name: "browser-use", owner: "browser-use",
    description: "Browser automation framework designed for AI agents. Enables LLMs to control real browsers for web navigation, form filling, and data extraction tasks without APIs.",
    stars: 32000, forks: 3800, language: "Python",
    url: "https://github.com/browser-use/browser-use",
    topics: ["ai", "automation", "browser", "agent", "python"],
    category: "Agents",
    growthIndicator: "trending",
    useCases: ["Web scraping without APIs", "AI-powered form filling", "Automated browser testing", "Data extraction pipelines"],
    keyFeatures: ["Self-healing selectors", "Vision-based element detection", "Multi-tab management", "Stealth mode"],
    highlight: "Why this is trending: AI-native browser automation is replacing traditional Selenium-based approaches.",
    saved: false, bookmarked: false,
    createdAt: new Date("2025-12-01"), updatedAt: new Date("2026-06-20"),
  },
  {
    id: "2", name: "claude-code", owner: "anthropics",
    description: "Agentic coding tool that brings Claude directly into your terminal. Understands your codebase, writes files, runs commands, and pushes commits autonomously.",
    stars: 85000, forks: 6200, language: "TypeScript",
    url: "https://github.com/anthropics/claude-code",
    topics: ["ai", "coding", "agent", "cli", "typescript"],
    category: "AI",
    growthIndicator: "trending",
    useCases: ["Autonomous code generation", "Refactoring across files", "Bug fixing with context", "Documentation generation"],
    keyFeatures: ["Full file system access", "Git integration", "Multi-file edits", "Context-aware suggestions"],
    highlight: "Why this is trending: AI coding agents are becoming the primary interface for software development.",
    saved: false, bookmarked: false,
    createdAt: new Date("2026-03-15"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "3", name: "dify", owner: "langgenius",
    description: "Open-source LLM app development platform. Visual workflow builder for creating production-ready AI applications with RAG, agents, and model orchestration.",
    stars: 56000, forks: 8200, language: "TypeScript",
    url: "https://github.com/langgenius/dify",
    topics: ["ai", "llm", "platform", "rag", "workflow"],
    category: "AI",
    growthIndicator: "hot",
    useCases: ["Custom AI chatbot builders", "RAG pipeline creation", "Multi-model orchestration", "AI workflow automation"],
    keyFeatures: ["Visual workflow designer", "Built-in RAG engine", "Multi-LLM support", "API endpoint generation"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-08-01"), updatedAt: new Date("2026-06-21"),
  },
  {
    id: "4", name: "langgraph", owner: "langchain-ai",
    description: "Framework for building stateful, multi-agent applications with LLMs. Graph-based architecture for complex agent workflows and decision loops.",
    stars: 12000, forks: 1800, language: "Python",
    url: "https://github.com/langchain-ai/langgraph",
    topics: ["ai", "agents", "graph", "workflow", "python"],
    category: "Agents",
    growthIndicator: "trending",
    useCases: ["Multi-agent collaboration", "Stateful conversation chains", "Complex decision trees", "Agent supervision loops"],
    keyFeatures: ["Graph-based state management", "Human-in-the-loop support", "Parallel agent execution", "Built-in persistence"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-10-01"), updatedAt: new Date("2026-06-19"),
  },
  {
    id: "5", name: "crewai", owner: "crewai",
    description: "Framework for orchestrating role-based AI agents. Define agents with specific roles, goals, and tools to work together on complex tasks.",
    stars: 28000, forks: 3700, language: "Python",
    url: "https://github.com/crewai/crewai",
    topics: ["ai", "agents", "orchestration", "python"],
    category: "Agents",
    growthIndicator: "hot",
    useCases: ["Research teams of AI agents", "Automated content pipelines", "Multi-step research tasks", "Agent-based analysis"],
    keyFeatures: ["Role-based agent design", "Task delegation system", "Tool integration framework", "Process management"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-11-01"), updatedAt: new Date("2026-06-20"),
  },
  {
    id: "6", name: "next.js", owner: "vercel",
    description: "The React framework for production. Hybrid static & server rendering, TypeScript support, smart bundling, and route pre-fetching.",
    stars: 128000, forks: 27000, language: "TypeScript",
    url: "https://github.com/vercel/next.js",
    topics: ["react", "framework", "ssr", "typescript"],
    category: "Frontend",
    growthIndicator: "stable",
    useCases: ["Production web applications", "Static site generation", "API route development", "Full-stack React apps"],
    keyFeatures: ["Server-side rendering", "Static generation", "API routes", "Image optimization"],
    saved: false, bookmarked: false,
    createdAt: new Date("2016-10-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "7", name: "shadcn-ui", owner: "shadcn",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS. Copy-paste components with customizable themes and consistent accessibility.",
    stars: 82000, forks: 5200, language: "TypeScript",
    url: "https://github.com/shadcn-ui/ui",
    topics: ["react", "ui", "components", "design-system"],
    category: "Frontend",
    growthIndicator: "trending",
    useCases: ["Rapid UI prototyping", "Design system foundation", "Production component library", "Accessible interfaces"],
    keyFeatures: ["Copy-paste architecture", "Full accessibility", "Customizable themes", "No package dependency"],
    highlight: "Why this is trending: The copy-paste component model is reshaping how developers build UIs.",
    saved: false, bookmarked: false,
    createdAt: new Date("2023-01-01"), updatedAt: new Date("2026-06-21"),
  },
  {
    id: "8", name: "tailwindcss", owner: "tailwindlabs",
    description: "A utility-first CSS framework for rapid UI development. Composable design primitives with a built-in design system.",
    stars: 85000, forks: 4300, language: "TypeScript",
    url: "https://github.com/tailwindlabs/tailwindcss",
    topics: ["css", "framework", "design", "utility"],
    category: "Frontend",
    growthIndicator: "stable",
    useCases: ["Rapid UI development", "Consistent design systems", "Responsive layouts", "Prototyping"],
    keyFeatures: ["Utility-first approach", "Built-in design tokens", "Responsive variants", "Zero-runtime CSS"],
    saved: false, bookmarked: false,
    createdAt: new Date("2017-11-01"), updatedAt: new Date("2026-06-18"),
  },
  {
    id: "9", name: "supabase", owner: "supabase",
    description: "The open-source Firebase alternative. PostgreSQL database, authentication, instant APIs, realtime subscriptions, and storage.",
    stars: 75000, forks: 7100, language: "TypeScript",
    url: "https://github.com/supabase/supabase",
    topics: ["database", "backend", "realtime", "auth"],
    category: "Backend",
    growthIndicator: "trending",
    useCases: ["Full-stack app backend", "Real-time data sync", "Authentication & authorization", "File storage"],
    keyFeatures: ["Auto-generated REST APIs", "Realtime subscriptions", "Built-in auth", "Edge functions"],
    saved: false, bookmarked: false,
    createdAt: new Date("2020-02-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "10", name: "prisma", owner: "prisma",
    description: "Next-generation ORM for Node.js and TypeScript. Auto-generated query builder with migrations, type safety, and relation management.",
    stars: 41000, forks: 1500, language: "TypeScript",
    url: "https://github.com/prisma/prisma",
    topics: ["orm", "database", "typescript", "backend"],
    category: "Backend",
    growthIndicator: "stable",
    useCases: ["Database schema management", "Type-safe database queries", "API development", "Data modeling"],
    keyFeatures: ["Auto-generated types", "Migration system", "Relation management", "Studio GUI"],
    saved: false, bookmarked: false,
    createdAt: new Date("2019-06-01"), updatedAt: new Date("2026-06-20"),
  },
  {
    id: "11", name: "n8n", owner: "n8n-io",
    description: "Fair-code workflow automation platform. Connect any app with powerful visual workflows and 400+ integrations.",
    stars: 55000, forks: 8700, language: "TypeScript",
    url: "https://github.com/n8n-io/n8n",
    topics: ["automation", "workflow", "low-code", "devops"],
    category: "DevOps",
    growthIndicator: "hot",
    useCases: ["CI/CD pipeline automation", "Notification workflows", "Data sync between tools", "ChatOps integration"],
    keyFeatures: ["Visual workflow editor", "400+ integrations", "Self-hosted", "Code node support"],
    saved: false, bookmarked: false,
    createdAt: new Date("2020-05-01"), updatedAt: new Date("2026-06-19"),
  },
  {
    id: "12", name: "deltacheck", owner: "dandavison",
    description: "A syntax-highlighting pager for git, diff, and grep output. Transforms raw diffs into beautiful, navigable visualizations.",
    stars: 24000, forks: 380, language: "Rust",
    url: "https://github.com/dandavison/delta",
    topics: ["git", "diff", "cli", "rust"],
    category: "Developer Tools",
    growthIndicator: "rising",
    useCases: ["Code review workflows", "Git diff visualization", "CLI output enhancement", "Team code standards"],
    keyFeatures: ["Syntax-highlighted diffs", "Side-by-side view", "Git integration", "Custom themes"],
    savedBy: "Few Developers", highlight: "High utility, low visibility. Essential tool for anyone who reads diffs daily.",
    saved: false, bookmarked: false,
    createdAt: new Date("2020-08-01"), updatedAt: new Date("2026-06-15"),
  },
  {
    id: "13", name: "difftastic", owner: "Wilfred",
    description: "A structural diff tool that understands syntax. Compares code based on AST structure rather than lines, producing more meaningful diffs.",
    stars: 21000, forks: 320, language: "Rust",
    url: "https://github.com/Wilfred/difftastic",
    topics: ["diff", "cli", "rust", "developer-tools"],
    category: "Developer Tools",
    growthIndicator: "rising",
    useCases: ["Code review accuracy", "Refactoring verification", "Merge conflict resolution", "Language-agnostic diffing"],
    keyFeatures: ["AST-aware comparison", "Multi-language support", "Side-by-side display", "Git integration"],
    savedBy: "Few Developers", highlight: "Hidden gem: AST-level diffing catches semantic changes line-based tools miss.",
    saved: false, bookmarked: false,
    createdAt: new Date("2021-03-01"), updatedAt: new Date("2026-06-14"),
  },
  {
    id: "14", name: "flutter", owner: "flutter",
    description: "Flutter makes it easy to build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.",
    stars: 168000, forks: 28000, language: "Dart",
    url: "https://github.com/flutter/flutter",
    topics: ["mobile", "ui", "dart", "cross-platform"],
    category: "Flutter",
    growthIndicator: "stable",
    useCases: ["Cross-platform mobile apps", "Desktop applications", "Web applications", "Embedded systems"],
    keyFeatures: ["Hot reload", "Expressive UI", "Native performance", "Platform channels"],
    saved: false, bookmarked: false,
    createdAt: new Date("2015-06-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "15", name: "lnav", owner: "tstack",
    description: "An advanced log file viewer for the small-scale. Loads logs, indexes them, and provides SQL queries, histograms, and pretty-printing.",
    stars: 8700, forks: 310, language: "C++",
    url: "https://github.com/tstack/lnav",
    topics: ["logs", "cli", "debugging", "devops"],
    category: "DevOps",
    growthIndicator: "rising",
    useCases: ["Server log analysis", "Debugging production issues", "Log pattern detection", "Real-time log monitoring"],
    keyFeatures: ["SQL query on logs", "Auto-format parsing", "Timeline visualization", "Multi-file merge"],
    savedBy: "Few Developers", highlight: "Hidden gem: Turn unstructured logs into queryable data. Indispensable for debugging.",
    saved: false, bookmarked: false,
    createdAt: new Date("2013-01-01"), updatedAt: new Date("2026-06-10"),
  },
  {
    id: "16", name: "k6", owner: "grafana",
    description: "A modern load testing tool for engineering teams. Scriptable, developer-friendly performance testing with Grafana dashboards.",
    stars: 26000, forks: 1300, language: "Go",
    url: "https://github.com/grafana/k6",
    topics: ["testing", "performance", "devops", "load-testing"],
    category: "DevOps",
    growthIndicator: "trending",
    useCases: ["Load testing APIs", "Performance benchmarking", "Stress testing microservices", "CI/CD quality gates"],
    keyFeatures: ["JavaScript scripting", "High performance", "Grafana integration", "Cloud execution"],
    saved: false, bookmarked: false,
    createdAt: new Date("2019-01-01"), updatedAt: new Date("2026-06-18"),
  },
  {
    id: "17", name: "llamafile", owner: "Mozilla-Ocho",
    description: "Run open-source LLMs on your own computer with a single file. No installation, no GPU required, no cloud dependency.",
    stars: 22000, forks: 1100, language: "C++",
    url: "https://github.com/Mozilla-Ocho/llamafile",
    topics: ["ai", "llm", "local", "privacy"],
    category: "AI",
    growthIndicator: "hot",
    useCases: ["Local LLM inference", "Privacy-preserving AI", "Offline AI assistants", "Edge AI deployment"],
    keyFeatures: ["Single-file executable", "No GPU required", "Multi-platform support", "Open-source models"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-06-01"), updatedAt: new Date("2026-06-20"),
  },
  {
    id: "18", name: "polars", owner: "pola-rs",
    description: "Blazingly fast DataFrame library for Python and Rust. Designed for large-scale data processing with zero-copy and vectorized execution.",
    stars: 32000, forks: 2000, language: "Rust",
    url: "https://github.com/pola-rs/polars",
    topics: ["data", "python", "rust", "analytics"],
    category: "Data Science",
    growthIndicator: "trending",
    useCases: ["Large dataset analysis", "ETL pipelines", "Time-series processing", "Replace pandas workflows"],
    keyFeatures: ["Lazy and eager execution", "Streaming API", "Multi-core parallel", "Zero-copy data handling"],
    saved: false, bookmarked: false,
    createdAt: new Date("2021-05-01"), updatedAt: new Date("2026-06-21"),
  },
  {
    id: "19", name: "tabby", owner: "TabbyML",
    description: "Self-hosted AI coding assistant. Open-source alternative to GitHub Copilot with code completion, chat, and code search.",
    stars: 24000, forks: 950, language: "Rust",
    url: "https://github.com/TabbyML/tabby",
    topics: ["ai", "coding", "assistant", "self-hosted"],
    category: "Developer Tools",
    growthIndicator: "trending",
    useCases: ["Code completion on-premises", "Private code search", "AI code review", "Team-wide AI assistant"],
    keyFeatures: ["Self-hosted infrastructure", "Code completion", "Context-aware chat", "Code search index"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-02-01"), updatedAt: new Date("2026-06-20"),
  },
  {
    id: "20", name: "uv", owner: "astral-sh",
    description: "An extremely fast Python package and project manager written in Rust. Drops in as a replacement for pip, pip-tools, and virtualenv.",
    stars: 45000, forks: 1200, language: "Rust",
    url: "https://github.com/astral-sh/uv",
    topics: ["python", "package-manager", "rust", "developer-tools"],
    category: "Developer Tools",
    growthIndicator: "trending",
    useCases: ["Python dependency management", "Virtual environment creation", "Package publishing", "Monorepo management"],
    keyFeatures: ["10-100x faster than pip", "Dependency resolution", "Workspace support", "Tool management"],
    highlight: "Why this is trending: Rust-native speed is redefining the Python tooling ecosystem.",
    saved: false, bookmarked: false,
    createdAt: new Date("2024-09-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "21", name: "codex", owner: "openai",
    description: "Codex CLI is a lightweight agentic coding tool that uses the same technology as GPT-4 Code Interpreter. Runs entirely in your terminal.",
    stars: 18000, forks: 1400, language: "TypeScript",
    url: "https://github.com/openai/codex",
    topics: ["ai", "coding", "cli", "agent"],
    category: "AI",
    growthIndicator: "new",
    useCases: ["Natural language to code", "Script generation", "Code explanation", "Debugging assistant"],
    keyFeatures: ["Safe execution sandbox", "File system access", "Natural language interface", "Streaming responses"],
    saved: false, bookmarked: false,
    createdAt: new Date("2026-04-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "22", name: "linux", owner: "torvalds",
    description: "The Linux kernel. The core of millions of devices from servers to smartphones. Community-driven operating system foundation.",
    stars: 185000, forks: 54000, language: "C",
    url: "https://github.com/torvalds/linux",
    topics: ["kernel", "os", "linux", "systems"],
    category: "Linux",
    growthIndicator: "stable",
    useCases: ["Operating system development", "Embedded systems", "Server infrastructure", "Device driver development"],
    keyFeatures: ["Monolithic kernel", "Wide hardware support", "POSIX compliant", "Modular architecture"],
    saved: false, bookmarked: false,
    createdAt: new Date("2005-04-01"), updatedAt: new Date("2026-06-22"),
  },
  {
    id: "23", name: "localstack", owner: "localstack",
    description: "A fully functional local AWS cloud stack. Develop and test cloud applications offline with AWS service emulation.",
    stars: 57000, forks: 4100, language: "Python",
    url: "https://github.com/localstack/localstack",
    topics: ["aws", "cloud", "testing", "infrastructure"],
    category: "Infrastructure",
    growthIndicator: "hot",
    useCases: ["Offline AWS development", "CI/CD testing with AWS", "Cost-effective cloud testing", "Local microservice testing"],
    keyFeatures: ["50+ AWS services", "Local service emulation", "CI/CD integration", "Pro features available"],
    saved: false, bookmarked: false,
    createdAt: new Date("2017-06-01"), updatedAt: new Date("2026-06-21"),
  },
  {
    id: "24", name: "opentofu", owner: "opentofu",
    description: "Open-source infrastructure as code tool. Fork of Terraform with community governance and no BSL license restrictions.",
    stars: 24000, forks: 900, language: "Go",
    url: "https://github.com/opentofu/opentofu",
    topics: ["terraform", "iac", "infrastructure", "devops"],
    category: "Infrastructure",
    growthIndicator: "trending",
    useCases: ["Cloud infrastructure management", "Multi-cloud provisioning", "Infrastructure as code", "Compliance automation"],
    keyFeatures: ["Terraform compatible", "Community governance", "Open-source license", "Provider ecosystem"],
    saved: false, bookmarked: false,
    createdAt: new Date("2024-01-01"), updatedAt: new Date("2026-06-20"),
  },
];

export const allRepos = repos;

export const trendingToday = repos.filter((r) => r.growthIndicator === "trending");
export const trendingThisWeek = repos.filter((r) => r.growthIndicator === "hot" || r.growthIndicator === "trending");
export const aiRepos = repos.filter((r) => r.category === "AI");
export const agentRepos = repos.filter((r) => r.category === "Agents");
export const frontendRepos = repos.filter((r) => r.category === "Frontend");
export const backendRepos = repos.filter((r) => r.category === "Backend");
export const devopsRepos = repos.filter((r) => r.category === "DevOps");
export const flutterRepos = repos.filter((r) => r.category === "Flutter");
export const linuxRepos = repos.filter((r) => r.category === "Linux");
export const dataScienceRepos = repos.filter((r) => r.category === "Data Science");
export const devToolsRepos = repos.filter((r) => r.category === "Developer Tools");
export const infrastructureRepos = repos.filter((r) => r.category === "Infrastructure");
export const hiddenGems = repos.filter((r) => r.savedBy === "Few Developers");
export const recentlyReleased = repos.filter((r) => r.growthIndicator === "new");

export function searchRepos(query: string): Repository[] {
  const q = query.toLowerCase();
  return repos.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.language.toLowerCase().includes(q) ||
      r.topics.some((t) => t.toLowerCase().includes(q)),
  );
}

export const categoryMap: Record<string, Repository[]> = {
  all: repos,
  ai: aiRepos,
  agents: agentRepos,
  frontend: frontendRepos,
  backend: backendRepos,
  devops: devopsRepos,
  flutter: flutterRepos,
  linux: linuxRepos,
  datascience: dataScienceRepos,
  devtools: devToolsRepos,
  infrastructure: infrastructureRepos,
  hidden: hiddenGems,
  recent: recentlyReleased,
  bookmarked: [],
  saved: [],
  viewed: [],
};

export const sidebarCategories = [
  { id: "all", label: "All Trends", count: repos.length },
  { id: "ai", label: "AI", count: aiRepos.length },
  { id: "agents", label: "Agents", count: agentRepos.length },
  { id: "frontend", label: "Frontend", count: frontendRepos.length },
  { id: "backend", label: "Backend", count: backendRepos.length },
  { id: "devops", label: "DevOps", count: devopsRepos.length },
  { id: "flutter", label: "Flutter", count: flutterRepos.length },
  { id: "linux", label: "Linux", count: linuxRepos.length },
  { id: "datascience", label: "Data Science", count: dataScienceRepos.length },
  { id: "devtools", label: "Developer Tools", count: devToolsRepos.length },
  { id: "infrastructure", label: "Infrastructure", count: infrastructureRepos.length } as const,
];

export const discoverySections = [
  { id: "trending", label: "Trending Today", repos: trendingToday },
  { id: "week", label: "Trending This Week", repos: trendingThisWeek.slice(0, 5) },
  { id: "hidden", label: "Hidden Gems", repos: hiddenGems },
  { id: "recent", label: "Recently Released", repos: recentlyReleased },
];
