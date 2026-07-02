"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { register } from "@/actions/auth"
import { Button } from "@devventory/ui"
import { Input } from "@devventory/ui"
import { Label } from "@devventory/ui"
import { registerSchema } from "@devventory/types"

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SecurityBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-[18px] border border-primary/20 bg-primary/[0.04] p-4 backdrop-blur-xl"
    >
      <div className="absolute inset-0 rounded-[18px] shadow-[0_0_24px_-8px_rgba(99,102,241,0.15)]" />
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex items-start gap-3"
      >
        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Your data is yours.</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Everything is encrypted and stored securely. Only you can access your data.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    // ponytail: zodResolver stripped to schema fields; confirmPassword validated by register validate callback
    resolver: zodResolver(registerSchema) as any,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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
    <div className="relative flex w-full items-center justify-center">
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -20, 40, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#7c5cfc]/10 blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-[#06B6D4]/5 blur-[100px]"
        />
      </div>

      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute left-1/4 top-1/3 h-1 w-1 rounded-full bg-primary/40" />
        <div className="absolute right-1/3 top-1/4 h-1.5 w-1.5 rounded-full bg-primary/30" />
        <div className="absolute bottom-1/3 right-1/4 h-1 w-1 rounded-full bg-[#7c5cfc]/40" />
        <div className="absolute left-1/3 bottom-1/4 h-1 w-1 rounded-full bg-primary/30" />
        <div className="absolute left-2/3 top-2/3 h-1.5 w-1.5 rounded-full bg-[#06B6D4]/30" />
        <div className="absolute right-1/4 top-2/3 h-1 w-1 rounded-full bg-primary/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2 }}
        className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-6 shadow-[0_0_48px_-12px_rgba(99,102,241,0.12)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_0_56px_-8px_rgba(99,102,241,0.2)] sm:p-8"
      >
        <div className="space-y-5">
          <SecurityBanner />

          <div className="space-y-1">
            <h1 className="text-[36px] font-semibold tracking-tight text-foreground leading-none">Create your account</h1>
            <p className="text-lg text-muted-foreground">Create your secure DevCache workspace.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {message?.type === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {message.text}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="John Doe"
                className="h-12 rounded-xl border-border/40 bg-input/30 px-4 text-base transition-all duration-200 placeholder:text-base placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-border/40 bg-input/30 px-4 text-base transition-all duration-200 placeholder:text-base placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border-border/40 bg-input/30 px-4 pr-10 text-base transition-all duration-200 placeholder:text-base placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-base text-muted-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword", {
                    validate: (val) => val === form.getValues("password") || "Passwords don't match"
                  })}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-xl border-border/40 bg-input/30 px-4 pr-10 text-base transition-all duration-200 placeholder:text-base placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative"
              >
                <Button
                  type="submit"
                  className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[#7c5cfc] text-base font-medium text-primary-foreground shadow-[0_0_20px_-8px_rgba(99,102,241,0.4)] transition-shadow duration-300 hover:shadow-[0_0_28px_-6px_rgba(99,102,241,0.6)] disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </span>
                </Button>
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline underline-offset-4 transition-colors duration-150 hover:text-primary/80"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
