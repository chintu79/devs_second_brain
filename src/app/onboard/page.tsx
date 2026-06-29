"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, StickyNote, Link2, FolderKanban, Brain, ArrowDown, X } from "lucide-react";
import { createNote } from "@/actions/notes";
import { createResource } from "@/actions/resources";
import { createProject } from "@/actions/projects";

const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "note", label: "Note" },
  { id: "resource", label: "Resource" },
  { id: "project", label: "Project" },
  { id: "done", label: "Ready" },
];

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div
          key={s.id}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-primary/40" : "w-1.5 bg-border"
            }`}
        />
      ))}
    </div>
  );
}

const fadeUpVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeOut" as const } },
};

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const [noteContent, setNoteContent] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [projectContent, setProjectContent] = useState("");

  const [skipped, setSkipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // Auto-redirect on step 4 after 4 seconds
  useEffect(() => {
    if (step !== 4) return;
    const t = setTimeout(() => router.push("/dashboard"), 4000);
    return () => clearTimeout(t);
  }, [step, router]);

  const canProceed = useCallback(() => {
    if (step === 0) return true;
    if (step === 1) return noteContent.trim().length > 0;
    if (step === 2) return resourceUrl.trim().length > 0;
    if (step === 3) return projectContent.trim().length > 0;
    return false;
  }, [step, noteContent, resourceUrl, projectContent]);

  const saveNote = async () => {
    setLoading(true);
    const title = noteContent.split("\n")[0].replace(/^#+\s*/, "").slice(0, 80) || "My first note";
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", noteContent);
    fd.set("category", "");
    fd.set("tags", "");
    const r = await createNote(fd);
    setLoading(false);
    if (!r.success) { setError("Could not save note. Try again?"); return false; }
    return true;
  };

  const saveResource = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.set("title", resourceTitle.trim() || resourceUrl || "My first resource");
    fd.set("url", resourceUrl);
    fd.set("notes", "");
    fd.set("reason", "Saved during onboarding");
    fd.set("category", "");
    fd.set("tags", "");
    const r = await createResource(fd);
    setLoading(false);
    if (!r.success) { setError("Could not save resource. Try again?"); return false; }
    return true;
  };

  const saveProject = async () => {
    setLoading(true);
    const title = projectContent.split("\n")[0].replace(/^#+\s*/, "").slice(0, 80) || "My first project";
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", projectContent);
    fd.set("status", "active");
    fd.set("techStack", "");
    fd.set("tags", "");
    fd.set("planMd", projectContent);
    const r = await createProject(fd);
    setLoading(false);
    if (!r.success) { setError("Could not create project. Try again?"); return false; }
    return true;
  };

  const celebrateAndAdvance = (label: string) => {
    setCelebrate(label);
    setTimeout(() => {
      setCelebrate(null);
      setStep((s) => s + 1);
    }, 1400);
  };

  const handleNext = async () => {
    if (loading || celebrate) return;
    setError("");

    if (step === 0) { setStep((s) => s + 1); return; }
    if (step === 4) { router.push("/dashboard"); return; }

    let ok = false;
    if (step === 1) ok = await saveNote();
    else if (step === 2) ok = await saveResource();
    else if (step === 3) ok = await saveProject();

    if (ok) {
      const labels = ["", "Note captured", "Resource saved", "Project created", ""];
      celebrateAndAdvance(labels[step]);
    }
  };

  const handleSkip = () => {
    if (loading || celebrate) return;
    setError("");
    setSkipped((prev) => new Set(prev).add(step));
    setStep((s) => s + 1);
  };

  const doneCount = 3 - skipped.size;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Brand header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Dev Second Brain</span>
        </div>
        <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-24">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={fadeUpVariants} initial="initial" animate="animate" exit="exit">
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-8">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Welcome to DevCache.</h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    This isn&apos;t another note-taking app. It&apos;s your developer second brain.
                  </p>
                </div>
              )}

              {/* Step 1: Create Note */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1 tracking-tight">What are you currently learning?</h2>
                  <p className="text-sm text-muted-foreground mb-5">Write naturally. AI will organize it.</p>
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="I've been exploring LangGraph for building agent workflows..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border/40 bg-muted/30 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && canProceed()) { e.preventDefault(); handleNext(); } }}
                  />
                </div>
              )}

              {/* Step 2: Save Resource */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1 tracking-tight">Save a resource you find valuable</h2>
                  <p className="text-sm text-muted-foreground mb-5">Paste a GitHub repo, article, or documentation link.</p>
                  <div className="space-y-3">
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      value={resourceUrl}
                      onChange={(e) => setResourceUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                      onKeyDown={(e) => { if (e.key === "Enter" && canProceed()) { e.preventDefault(); handleNext(); } }}
                    />
                    <input
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="Title (optional)"
                      className="w-full rounded-xl border border-border/40 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Create Project */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1 tracking-tight">What are you building?</h2>
                  <p className="text-sm text-muted-foreground mb-5">Describe your project in one sentence. AI will suggest a roadmap.</p>
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={projectContent}
                    onChange={(e) => setProjectContent(e.target.value)}
                    placeholder="Building an AI-powered code review agent..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-border/40 bg-muted/30 p-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && canProceed()) { e.preventDefault(); handleNext(); } }}
                  />
                </div>
              )}

              {/* Step 4: Done */}
              {step === 4 && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground mb-8 tracking-tight">
                    {doneCount > 0 ? "Look what just happened." : "You're all set."}
                  </h2>

                  {doneCount > 0 ? (
                    <div className="flex flex-col items-center gap-3 mb-8">
                      {!skipped.has(1) && (
                        <>
                          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border/30 bg-card/60 w-full max-w-xs">
                            <StickyNote className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm text-foreground/80 font-medium">Your Note</span>
                          </div>
                          <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                        </>
                      )}
                      {!skipped.has(2) && (
                        <>
                          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border/30 bg-card/60 w-full max-w-xs">
                            <Link2 className="h-5 w-5 text-teal-500 shrink-0" />
                            <span className="text-sm text-foreground/80 font-medium">Your Resource</span>
                          </div>
                          <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                        </>
                      )}
                      {!skipped.has(3) && (
                        <>
                          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-border/30 bg-card/60 w-full max-w-xs">
                            <FolderKanban className="h-5 w-5 text-purple-500 shrink-0" />
                            <span className="text-sm text-foreground/80 font-medium">Your Project</span>
                          </div>
                          <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
                        </>
                      )}
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-primary/20 bg-primary/5 w-full max-w-xs">
                        <Brain className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm text-foreground/80 font-medium">Knowledge Graph</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center mb-8">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-primary/20 bg-primary/5 w-full max-w-xs">
                        <Brain className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-sm text-foreground/80 font-medium">Your Dashboard</span>
                      </div>
                    </div>
                  )}

                  {doneCount > 0 && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      You created <strong>{doneCount} thing{doneCount > 1 ? "s" : ""}</strong>.
                      DevCache connected everything automatically.
                    </p>
                  )}
                  {doneCount === 0 && (
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Your dashboard is ready. Add resources, prompts, notes, and projects as you go.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-4 text-center"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-lg font-semibold text-foreground">{celebrate}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer: dots + CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/10 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-8">
        <div className="flex items-center justify-between max-w-lg mx-auto px-6">
          <StepDots current={step} />
          <div className="flex items-center gap-3">
            {step >= 1 && step <= 3 && (
              <button
                onClick={handleSkip}
                disabled={loading || !!celebrate}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/30 transition-all disabled:opacity-30"
              >
                <X className="h-3.5 w-3.5" />
                Skip
              </button>
            )}
            {step === 4 ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading || !!celebrate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-30 disabled:hover:bg-primary"
              >
                {loading ? (
                  "Saving..."
                ) : step === 0 ? (
                  <>Begin <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Continue <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
