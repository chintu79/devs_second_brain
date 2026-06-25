"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { login } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stagger, fadeInUp } from "@/lib/motion"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <motion.div
      className="w-full max-w-sm"
      variants={stagger.container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-dashboard)]/10 md:hidden">
            <LogIn className="h-5 w-5 text-[var(--color-dashboard)]" />
          </div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Welcome back</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Sign in to your account
        </p>
      </motion.div>

      <form action={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="space-y-2">
          <Label htmlFor="email" className="text-sm text-[var(--text-secondary)]">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-11 rounded-xl border-border/40 bg-muted/30 px-4 text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--color-dashboard)]/40 focus-visible:ring-[var(--color-dashboard)]/15"
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm text-[var(--text-secondary)]">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              className="h-11 rounded-xl border-border/40 bg-muted/30 px-4 pr-10 text-sm transition-all duration-200 placeholder:text-[var(--text-muted)] focus-visible:border-[var(--color-dashboard)]/40 focus-visible:ring-[var(--color-dashboard)]/15"
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
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </motion.div>

        <motion.div variants={fadeInUp} className="text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--text-primary)] hover:text-[var(--color-dashboard)] underline underline-offset-4 transition-colors duration-150"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </form>
    </motion.div>
  )
}
