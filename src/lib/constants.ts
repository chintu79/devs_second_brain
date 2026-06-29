import {
  CircleDot, FlaskConical, Layers, Hammer, CheckCircle2, Archive,
  FolderKanban, Link2, Sparkles, FileText, ArrowUp, TrendingUp,
  ArrowUpRight, Minus, Zap,
} from "lucide-react";

export const RESOURCE_CATEGORY_COLORS: Record<string, string> = {
  frontend: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  backend: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  devops: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  tool: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  design: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
  architecture: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  ai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  mobile: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  security: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  testing: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  career: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  other: "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-300",
};

export const NOTE_CATEGORY_COLORS: Record<string, string> = {
  frontend: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  backend: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  devops: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  tool: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  design: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
  architecture: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  ai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  mobile: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  security: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  testing: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  career: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  personal: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  learning: "bg-lime-100 text-lime-700 dark:bg-lime-500/10 dark:text-lime-300",
  work: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  other: "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-300",
};

export const PROMPT_CATEGORY_COLORS: Record<string, string> = {
  coding: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  debugging: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  architecture: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300",
  testing: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  docs: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  other: "bg-neutral-100 text-neutral-700 dark:bg-neutral-500/10 dark:text-neutral-300",
};

export const PROJECT_STATUS_META: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  idea: { label: "Idea", color: "text-amber-400", icon: CircleDot },
  research: { label: "Research", color: "text-blue-400", icon: FlaskConical },
  planning: { label: "Planning", color: "text-purple-400", icon: Layers },
  building: { label: "Building", color: "text-green-400", icon: Hammer },
  completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  archived: { label: "Archived", color: "text-muted-foreground", icon: Archive },
};

export const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  resource: { icon: Link2, color: "#14B8A6", label: "Resource" },
  prompt: { icon: Sparkles, color: "#F59E0B", label: "Prompt" },
  note: { icon: FileText, color: "#22C55E", label: "Note" },
  project: { icon: FolderKanban, color: "#8B5CF6", label: "Project" },
};

export const GROWTH_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  trending: { label: "Trending", icon: ArrowUp, color: "text-emerald-400" },
  hot: { label: "Hot", icon: Zap, color: "text-rose-400" },
  rising: { label: "Rising", icon: TrendingUp, color: "text-blue-400" },
  stable: { label: "Stable", icon: Minus, color: "text-muted-foreground" },
  new: { label: "New", icon: ArrowUpRight, color: "text-amber-400" },
};
