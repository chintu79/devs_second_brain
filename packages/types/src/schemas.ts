import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().max(100, "Name must be under 100 characters"),
  email: z.string().email("Enter a valid email address").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
})
