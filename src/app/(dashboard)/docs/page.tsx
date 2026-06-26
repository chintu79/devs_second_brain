import { ReadingProgress } from "@/components/docs/reading-progress";
import { DocsTOC } from "@/components/docs/docs-toc";
import { Book, Link2, MessageSquare, StickyNote, FolderKanban, Radio, Search, Bot, Tags, Command, LayoutDashboard, Zap, Workflow, Palette, Sparkles, Server } from "lucide-react";

const useCases = [
  {
    id: "quickstart",
    icon: Zap,
    title: "Quickstart",
    color: "#6366F1",
    content: [
      {
        heading: "What is DevCache?",
        text: "A developer knowledge OS — save resources, prompts, notes, and projects, all connected through tags. Think of it as your personal memory system for everything you learn.",
      },
      {
        heading: "First 5 minutes",
        steps: [
          'Click "+" in the sidebar to create your first Resource (paste any useful link).',
          "Let AI suggest the category and tags — click the Sparkles icon next to each field.",
          'Write your first Note — use markdown for code blocks, headings, and lists.',
          "Press Cmd+K anywhere to search across everything you've saved.",
          "Add the same tag to two different items and watch them connect in the context panels.",
        ],
      },
      {
        heading: "Core concept: Tags connect everything",
        text: "Tags are not labels — they're relationships. Add \"react\" to a resource AND a note, and they'll appear in each other's context sidebar. The Knowledge Graph visualizes these connections. The tag input autocompletes from existing tags, so you always reuse instead of recreate.",
      },
    ],
  },
  {
    id: "resources",
    icon: Link2,
    title: "Resources — Save & Organize Links",
    color: "#14B8A6",
    content: [
      {
        heading: "Use cases",
        items: [
          "Bookmark an article you want to read later",
          "Save a GitHub repo with notes on why it matters",
          "Archive a blog post before it disappears",
          "Collect design inspiration with categorized tags",
        ],
      },
      {
        heading: "How to save a resource",
        steps: [
          "Go to Resources → click the + button (or use Quick Capture: ⚡ or Cmd+Shift+K).",
          "Paste the URL and add a title.",
          "Pick a category: frontend, backend, devops, tool, design, architecture, ai, mobile, security, testing, career, other.",
          "Click the Sparkles icon for AI-suggested category and tags.",
          "Add notes on why this matters — this helps retrieval later (Design Principle #5).",
        ],
      },
      {
        heading: "Managing resources",
        text: "Use the filter pills at the top to filter by category. The search bar searches titles. Each resource card shows tags and has a hover-visible Trash2 icon for deletion. The resource preview panel shows full details and related items via shared tags.",
      },
    ],
  },
  {
    id: "prompts",
    icon: MessageSquare,
    title: "Prompts — Reusable AI Templates",
    color: "#F59E0B",
    content: [
      {
        heading: "Use cases",
        items: [
          "Store code review prompts you use regularly",
          "Save debugging workflows with context instructions",
          "Keep architecture decision prompts for RFCs",
          "Template prompt patterns for docs generation",
        ],
      },
      {
        heading: "How to create a prompt",
        steps: [
          "Go to Prompts → click +.",
          "Give it a title (e.g. \"Rust Code Reviewer\").",
          "Write the full prompt text — this is the exact text you'll send to an AI.",
          "Set the category: coding, debugging, architecture, testing, docs, other.",
          "Add a use case description to remember when to use this.",
          "Use AI Suggest for category and tags.",
        ],
      },
      {
        heading: "Using prompts",
        text: "Open a prompt card, copy the prompt text from the preview panel, and paste it into your AI tool. The use count tracks how often you use each prompt. You can filter by category or search by title/use case.",
      },
    ],
  },
  {
    id: "notes",
    icon: StickyNote,
    title: "Notes — Markdown Knowledge Base",
    color: "#22C55E",
    content: [
      {
        heading: "Use cases",
        items: [
          "Write technical deep-dives after learning something new",
          "Document project architecture decisions (ADRs)",
          "Keep meeting notes linked to relevant projects",
          "Capture code snippets with explanations",
        ],
      },
      {
        heading: "How to write a note",
        steps: [
          "Go to Notes → click +.",
          "Write a title and select a category.",
          "Write in markdown — supports headings, code blocks, lists, links, images.",
          "Add tags — they'll connect this note to related resources, prompts, and projects.",
          "Use AI Summarize in the reader panel to generate a 2-3 sentence TLDR.",
        ],
      },
      {
        heading: "Reader panel features",
        text: "Click any note to open the reader panel (slides in from the right). It shows the rendered markdown, AI summary, linked items via shared tags, and backlinks (other notes that reference this one). Mark notes as favorite or archive them.",
      },
    ],
  },
  {
    id: "projects",
    icon: FolderKanban,
    title: "Projects — Idea to Completion",
    color: "#8B5CF6",
    content: [
      {
        heading: "Use cases",
        items: [
          "Track a side project from idea to shipped",
          "Plan an architecture refactor with research notes",
          "Document a POC with linked resources and prompts",
          "Kanban board for team or personal sprint tracking",
        ],
      },
      {
        heading: "Project lifecycle",
        steps: [
          "Create a project with status \"idea\" — just a title and description.",
          'Move to "research" — collect resources and notes linked via shared tags.',
          'Move to "planning" — write your PLAN.md with architecture decisions.',
          'Move to "building" — track progress with the Kanban board.',
          'Mark "completed" or "archived" when done.',
        ],
      },
      {
        heading: "Kanban board",
        text: "Toggle between List view and Kanban view using the Columns3 icon. Drag cards between 6 status columns: Idea → Research → Planning → Building → Completed → Archived. Changes save optimistically (instant UI update, server sync in background).",
      },
    ],
  },
  {
    id: "tags",
    icon: Tags,
    title: "Tags — The Glue",
    color: "#EC4899",
    content: [
      {
        heading: "Why tags matter",
        text: "Tags are the primary way items connect. Unlike folders (one item, one location), tags allow an item to belong to multiple categories simultaneously. A resource about \"Rust async\" can have tags: rust, async, backend, concurrency.",
      },
      {
        heading: "Tag management",
        steps: [
          "Go to Tags page to see all tags with per-type counts.",
          "Use Merge to combine two tags (e.g. \"reactjs\" → \"react\") — all items are reassigned automatically.",
          "Delete unused tags with the Trash2 button.",
          "Search tags by name to find what you need.",
        ],
      },
      {
        heading: "Smart tag features",
        text: "Auto-complete suggests existing tags as you type. AI Suggest generates relevant tags for any new item. The Tag Manager at /tags shows resource/prompt/note/project counts per tag so you can see which tags are most valuable.",
      },
    ],
  },
  {
    id: "radar",
    icon: Radio,
    title: "OS Radar — Discover Repos",
    color: "#06B6D4",
    content: [
      {
        heading: "Use cases",
        items: [
          "Find trending open-source projects in your stack",
          "Discover good first issues for contributing",
          "Track growth of repos you're watching",
          "Save interesting repos to Resources with one click",
        ],
      },
      {
        heading: "How to use the Radar",
        steps: [
          "Open OS Radar from the sidebar (three-column layout).",
          "Browse the feed — each card shows stars, forks, description, and growth indicator.",
          "Growth indicators: Trending (↑), Hot (🔥), Rising (↗), Stable (→), New (✨).",
          "Click a repo to open the detail panel with full README, tags, and use cases.",
          "Click \"Save to Resources\" to add the repo to your vault.",
        ],
      },
      {
        heading: "Explore categories",
        text: "The sidebar has collapsible categories (New This Week, AI trends, Frontend, Backend, etc.). Each shows a count of repos. This mirrors Product Hunt + Readwise Reader patterns for discovery.",
      },
    ],
  },
  {
    id: "search",
    icon: Search,
    title: "Search & Cmd+K — Find Everything",
    color: "#EF4444",
    content: [
      {
        heading: "Two search modes",
        items: [
          "Cmd+K (or Ctrl+K): Global command palette — type to search across all vaults AND navigate to pages.",
          "Search page: Three-column workspace with full results, preview panel, and context sidebar.",
        ],
      },
      {
        heading: "Cmd+K features",
        steps: [
          "Press Cmd+K from anywhere in the app.",
          "Type a query — results are grouped by type (Resources, Prompts, Notes, Projects).",
          "Use ↑↓ to navigate, Enter to open.",
          "Also works for page navigation: type \"settings\" to jump to Settings.",
        ],
      },
      {
        heading: "Search page workspace",
        text: "Opens to a three-column layout: left sidebar shows recent/suggested items, center shows grouped search results with type-colored borders, right panel shows full content preview. Debounced search updates as you type.",
      },
    ],
  },
  {
    id: "graph",
    icon: Workflow,
    title: "Knowledge Graph — Visualize Connections",
    color: "#0EA5E9",
    content: [
      {
        heading: "Use cases",
        items: [
          "See how your knowledge is connected across vaults",
          "Find orphaned items with no tags (they won't appear in the graph)",
          "Discover unexpected relationships between resources and projects",
        ],
      },
      {
        heading: "How to use",
        steps: [
          "Open Graph from the sidebar.",
          "Each node represents an item; edges represent shared tags.",
          "Drag to pan, scroll to zoom.",
          "Click a node to highlight its connected subgraph.",
          "Use the filter pills to show/hide item types.",
          "Search for a tag to focus on items with that tag.",
        ],
      },
      {
        heading: "Compact mode",
        text: "The dashboard includes a compact Knowledge Graph section that shows the same visualization at 420px height with smaller nodes and no labels. Click \"Open full graph →\" to go to the full page.",
      },
    ],
  },
  {
    id: "chat",
    icon: Bot,
    title: "AI Chat — RAG Over Your Vault",
    color: "#A855F7",
    content: [
      {
        heading: "What it does",
        text: "Chat with an AI that has context from your vault. It searches your resources, prompts, notes, and projects for relevant content (keyword-matched), injects the top 10 results as context, and streams a response. No vector embeddings needed.",
      },
      {
        heading: "How to use",
        steps: [
          "Open AI Chat from the sidebar.",
          "Type a question — e.g. \"What have I saved about React Server Components?\"",
          "The AI searches your vault items (title + tags + content), finds matches, and responds with references.",
          "Responses stream in ChatGPT-style with markdown rendering (code blocks, lists).",
          "Press Enter to send, Shift+Enter for newline.",
        ],
      },
      {
        heading: "Tips",
        text: "The better your tags and notes, the better the AI responses. Add context to your items (notes fields on resources, use case on prompts, content on notes) to improve keyword matching. The model is configurable via OPENROUTER_MODEL env var.",
      },
    ],
  },
  {
    id: "quick-capture",
    icon: Zap,
    title: "Quick Capture — Save From Anywhere",
    color: "#EAB308",
    content: [
      {
        heading: "What it is",
        text: "A minimal modal (Cmd+Shift+K or ⚡ button in the command bar) that lets you save a Resource, Note, Prompt, or Project without navigating away from your current page.",
      },
      {
        heading: "How to use",
        steps: [
          "Press Cmd+Shift+K or click the ⚡ button in the bottom command bar.",
          "Select the type (tab bar: Resource / Note / Prompt / Project).",
          "Fill in the fields — for Resources just paste a URL and title.",
          "Add tags using the autocomplete tag input.",
          "Hit save — the item is created and you stay on your current page.",
        ],
      },
      {
        heading: "When to use it",
        text: "Perfect for: saving a link while reading a note, capturing a quick thought while in the Radar, or adding a project idea while working in Search. No context switching.",
      },
    ],
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard — Your Command Center",
    color: "#6366F1",
    content: [
      {
        heading: "What you see",
        items: [
          "Greeting header with streak counter (if you've been active)",
          "Quick Actions bar — buttons to create any vault type inline",
          "4 vault blocks showing counts and last-saved timestamps (with project status badges)",
          "Unified Timeline — recently added items across all vaults, sorted by time",
          "Activity panel — 30-day sparkline, daily average, top 15 tags",
          "Compact Knowledge Graph — visual connections between your items",
        ],
      },
      {
        heading: "Navigating",
        text: "Click any vault block to jump to that section. Click \"View all\" on the timeline to go to Search. Click \"Open full graph →\" to expand the Knowledge Graph. The sidebar groups Navigation (core vaults) and Workspace (tools) sections.",
      },
    ],
  },
  {
    id: "self-hosting",
    icon: Server,
    title: "Self-Hosting",
    color: "#A1A1AA",
    content: [
      {
        heading: "Prerequisites",
        items: [
          "Node.js 18+",
          "PostgreSQL database (Render, Neon, Supabase, or local)",
          "A GitHub account (for deployment)",
        ],
      },
      {
        heading: "Quick deploy (Render)",
        steps: [
          "Push this repo to GitHub.",
          "Create a new Web Service on Render and connect your repo.",
          'Set Build Command: npm install && npm run build',
          'Set Start Command: npm start',
          "Add environment variables: DATABASE_URL (PostgreSQL connection string), NEXTAUTH_SECRET (run openssl rand -base64 32), NEXTAUTH_URL (your Render URL).",
          "Deploy. Render auto-deploys on every push.",
        ],
      },
      {
        heading: "Local development",
        steps: [
          "Clone the repo and run npm install.",
          "Copy .env.example to .env and fill in your database URL and auth secret.",
          "Run npx prisma db push to create the database schema.",
          "Run npm run dev — the app starts at http://localhost:3000.",
        ],
      },
    ],
  },
  {
    id: "settings",
    icon: Palette,
    title: "Customization & Settings",
    color: "#A1A1AA",
    content: [
      {
        heading: "Accent colors",
        text: "Every section (Dashboard, Resources, Prompts, Notes, Projects, Radar, Graph, Chat, Tags, Search, Settings) has its own accent color. Change them in Settings → Accent Colors. Custom colors are persisted in localStorage.",
      },
      {
        heading: "Theme",
        text: "Toggle light/dark mode using the theme switcher in the sidebar footer (sun/moon icon). The theme follows Notion's design philosophy: calm, neutral, timeless.",
      },
      {
        heading: "Import / Export",
        text: "Settings → Import / Export lets you download your entire vault as JSON or import a previous backup. Imports run in a Prisma transaction — if anything fails, nothing is saved.",
      },
    ],
  },
];

const shortcuts = [
  { keys: "Cmd+K", desc: "Open command palette / global search" },
  { keys: "Cmd+Shift+K", desc: "Open Quick Capture modal" },
  { keys: "Esc", desc: "Close panels, modals, and palettes" },
  { keys: "Enter", desc: "Add tag from input, submit forms" },
  { keys: "↑ ↓", desc: "Navigate suggestions and search results" },
  { keys: "Backspace", desc: "Remove last tag when input is empty" },
];

const tocSections = useCases.map((s) => ({ id: s.id, title: s.title, color: s.color }));

export default function DocsPage() {
  return (
    <>
      <ReadingProgress />
      <div className="max-w-6xl mx-auto flex gap-8 h-full" data-accent="settings">
        {/* TOC sidebar */}
        <DocsTOC sections={tocSections} />

        {/* Main content */}
        <div className="flex-1 min-w-0 overflow-y-auto py-6 pr-4">
          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-[#FAFAFA]">Docs</h1>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-2xl">
              Full how-to guide for Dev Second Brain. Each section covers use cases, step-by-step instructions, and tips.
            </p>
          </div>

          {/* Grid Table of Contents */}
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-[#E4E4E7] mb-3">Sections</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {useCases.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2.5 rounded-lg border border-border/20 bg-card px-4 py-2.5 text-sm text-[#D4D4D8] hover:border-border/60 hover:text-[#F4F4F5] transition-all duration-150"
                >
                  <s.icon className="h-4 w-4 shrink-0 accent-text" style={{ '--accent-c': s.color } as React.CSSProperties} />
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 mb-12">
            {useCases.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-20 rounded-xl border border-border/20 bg-card overflow-hidden hover:border-border/40 transition-colors"
              >
                <div className="px-6 py-4 border-b border-border/20 bg-muted/30 flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg accent-bg-15"
                    style={{ '--accent-c': section.color } as React.CSSProperties}
                  >
                    <section.icon className="h-4 w-4 accent-text" />
                  </div>
                  <h2 className="text-base font-semibold text-[#F4F4F5]">{section.title}</h2>
                </div>
                <div className="px-6 py-5 space-y-5">
                  {section.content.map((block, i) => (
                    <div key={i}>
                      {"heading" in block && (
                        <h3 className="text-sm font-medium text-[#E4E4E7] mb-2">{block.heading}</h3>
                      )}
                      {"text" in block && block.text && (
                        <p className="text-sm text-[#A1A1AA] leading-relaxed">{block.text}</p>
                      )}
                      {"items" in block && block.items && (
                        <ul className="space-y-1.5">
                          {block.items.map((item: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full accent-bg" style={{ '--accent-c': section.color } as React.CSSProperties} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {"steps" in block && block.steps && (
                        <ol className="space-y-1.5">
                          {block.steps.map((step: string, j: number) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                              <span
                                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white accent-bg"
                                style={{ '--accent-c': section.color } as React.CSSProperties}
                              >
                                {j + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}


                </div>
              </section>
            ))}
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-[#F4F4F5] mb-4">Keyboard Shortcuts</h2>
            <div className="rounded-xl border border-border/20 overflow-hidden">
              {shortcuts.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-5 py-3 ${
                    i < shortcuts.length - 1 ? "border-b border-border/20" : ""
                  }`}
                >
                  <span className="text-sm text-[#D4D4D8]">{s.desc}</span>
                  <kbd className="inline-flex items-center h-6 px-2 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/40 font-mono">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
