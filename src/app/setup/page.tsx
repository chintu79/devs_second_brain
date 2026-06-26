import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export default function SetupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="mx-auto max-w-4xl w-full px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-foreground transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Run it yourself</h1>
        <p className="text-muted-foreground/70 text-base mb-12">Self-host DevCache in 5 minutes. Local or cloud.</p>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">1</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Clone &amp; install</h2>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`git clone https://github.com/chintu79/devs_second_brain.git
cd devs_second_brain
npm install`}</pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">2</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Set up PostgreSQL</h2>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">You need a Postgres database running. Use Docker for a fast local setup:</p>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`docker run -d --name devcache-postgres \\
  -e POSTGRES_PASSWORD=mysecretpassword \\
  -e POSTGRES_DB=devcache \\
  -p 5432:5432 postgres:16`}</pre>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                Or use <a href="https://neon.tech" className="text-primary underline underline-offset-2 hover:opacity-80">Neon</a>,{" "}
                <a href="https://supabase.com" className="text-primary underline underline-offset-2 hover:opacity-80">Supabase</a>, or{" "}
                <a href="https://render.com/docs/databases" className="text-primary underline underline-offset-2 hover:opacity-80">Render Postgres</a>{" "}
                for a cloud database.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">3</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Configure environment</h2>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">Copy the example env file and fill in your values:</p>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`cp .env.example .env
# Edit .env:
#   DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/devcache
#   NEXTAUTH_SECRET= (run: openssl rand -base64 32)
#   NEXTAUTH_URL=http://localhost:3000`}</pre>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">4</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Create the database schema</h2>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`npx prisma db push`}</pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">5</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Run the app</h2>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`npm run dev`}</pre>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">Open <a href="http://localhost:3000" className="text-primary underline underline-offset-2 hover:opacity-80">http://localhost:3000</a>. Create an account and you&apos;re in.</p>
            </div>
          </div>

          {/* API Key */}
          <div className="flex gap-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">6</div>
            <div className="min-w-0 space-y-3">
              <h2 className="text-lg font-semibold">Create an API key</h2>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">Go to <strong>Settings → API Keys</strong> in the app and click <strong>Create Key</strong>. Give it a name and copy the generated key. Use it to authenticate requests:</p>
              <pre className="text-sm text-[#D4D4D8] bg-muted/50 rounded-lg p-4 font-mono overflow-x-auto">{`curl https://your-app.com/api/v1/resources \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground/60">
          Questions?{" "}
          <a href="https://github.com/chintu79/devs_second_brain/issues" className="text-primary underline underline-offset-2 hover:opacity-80">Open an issue</a>
        </div>
      </div>
    </div>
  );
}
