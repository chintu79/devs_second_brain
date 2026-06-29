"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { register } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerSchema } from "@/lib/schemas"

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const { errors, isSubmitting } = form.formState

  async function onSubmit(values: RegisterFormValues) {
    setMessage(null)
    const formData = new FormData()
    formData.set("name", values.name || "")
    formData.set("email", values.email)
    formData.set("password", values.password)
    const result = await register(formData)
    if (result?.error) {
      setMessage({ type: "error", text: result.error })
    } else if (result?.redirect) {
      router.push(result.redirect);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-prompts)]/10 md:hidden">
            <UserPlus className="h-5 w-5 text-[var(--color-prompts)]" />
          </div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Create an account</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {message?.type === "error" && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-[var(--text-secondary)]">
            Name
          </Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="John Doe"
            className="h-11 rounded-xl border-border/40 bg-muted/30 px-4 text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--color-prompts)]/40 focus-visible:ring-[var(--color-prompts)]/15"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-[var(--text-secondary)]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="you@example.com"
            className="h-11 rounded-xl border-border/40 bg-muted/30 px-4 text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--color-prompts)]/40 focus-visible:ring-[var(--color-prompts)]/15"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm text-[var(--text-secondary)]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              placeholder="••••••••"
              className="h-11 rounded-xl border-border/40 bg-muted/30 px-4 pr-10 text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--color-prompts)]/40 focus-visible:ring-[var(--color-prompts)]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--text-primary)] hover:text-[var(--color-prompts)] underline underline-offset-4 transition-colors duration-150"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
