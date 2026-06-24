export type ResourceCategory = "frontend" | "backend" | "devops" | "database" | "mobile" | "ai" | "design" | "other";
export type PromptCategory = "coding" | "debugging" | "architecture" | "testing" | "docs" | "other";
export type NoteCategory = "personal" | "technical" | "learning" | "meeting" | "idea" | "other";
export type ProjectStatus = "idea" | "research" | "planning" | "building" | "completed" | "archived";

export interface Stats {
  resources: number;
  prompts: number;
  notes: number;
  projects: number;
}
