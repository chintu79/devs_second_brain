import { z } from "zod"

export const resourceCategoryEnum = z.enum(["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"])
export const promptCategoryEnum = z.enum(["coding", "debugging", "architecture", "testing", "docs", "other"])
export const noteCategoryEnum = z.enum(["personal", "technical", "learning", "meeting", "idea", "other"])
export const projectStatusEnum = z.enum(["idea", "research", "planning", "building", "completed", "archived"])

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  category: resourceCategoryEnum,
  reason: z.string().max(1000, "Reason must be under 1000 characters"),
  tags: z.string(),
  notes: z.string().max(5000, "Notes must be under 5000 characters"),
})

export const promptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  prompt: z.string().min(1, "Prompt content is required").max(10000, "Prompt must be under 10000 characters"),
  category: promptCategoryEnum,
  useCase: z.string().max(500, "Use case must be under 500 characters"),
  tags: z.string(),
})

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  content: z.string().max(50000, "Note content must be under 50000 characters"),
  category: noteCategoryEnum,
  tags: z.string(),
})

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().max(2000, "Description must be under 2000 characters"),
  status: projectStatusEnum,
  techStack: z.string(),
  tags: z.string(),
})

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().max(100, "Name must be under 100 characters"),
  email: z.string().email("Enter a valid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
})
