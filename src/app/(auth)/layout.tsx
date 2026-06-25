import AuthBrand from "@/components/auth/auth-brand"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[2fr_3fr]" data-accent="dashboard">
      <AuthBrand />
      <main className="flex items-center justify-center p-8">
        {children}
      </main>
    </div>
  )
}
