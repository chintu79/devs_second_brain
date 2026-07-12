"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, BookOpen, Search } from "lucide-react";
import { Button } from "@devventory/ui";
import { ease } from "@devventory/motion";
import { R3FCanvas } from "./r3f/r3f-canvas";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.decelerate } },
};

const mockItems = [
  { id: "1", title: "How QR Phishing Attacks Target...,", url: "blog.security.com", tag: "Security", color: "text-red-400", dot: "bg-red-400" },
  { id: "2", title: "React 19: Everything You Need t...,", url: "react.dev", tag: "Frontend", color: "text-sky-400", dot: "bg-sky-400" },
  { id: "3", title: "System Design — Rate Limiting", url: "medium.com", tag: "Backend", color: "text-emerald-400", dot: "bg-emerald-400" },
];

const mockContent: Record<string, { title: string; paragraphs: string[]; readTime: string }> = {
  "1": {
    title: "How QR Phishing Attacks Target Developers",
    paragraphs: [
      "QR phishing — or 'quishing' — is on the rise. Attackers embed malicious QR codes in emails and PDFs to bypass email security filters.",
      "For developers, the risk is amplified. A single scan can compromise personal credentials or company VPN access.",
    ],
    readTime: "4 min read",
  },
  "2": {
    title: "React 19: Everything You Need To Know",
    paragraphs: [
      "React 19 introduces significant improvements to server components, actions, and the new compiler.",
      "Server Components, introduced as experimental in React 18, are now stable, enabling smaller bundles and faster page loads.",
    ],
    readTime: "6 min read",
  },
  "3": {
    title: "System Design — Rate Limiting",
    paragraphs: [
      "Rate limiting controls how many requests a client can make to an API within a given time window.",
      "Token Bucket is the most widely used algorithm in production systems, including Stripe and GitHub.",
    ],
    readTime: "8 min read",
  },
};

const itemVariants = (i: number) => ({
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: ease.decelerate, delay: 1.0 + i * 0.1 } },
});

function CaptureIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: ease.decelerate, delay: 0.8 }}
      className="absolute -top-3 -right-3 z-10 flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 shadow-md"
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#6366F1] to-[#6366F1]">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
        </svg>
      </div>
      <div className="text-left">
        <div className="text-[11px] font-semibold text-foreground leading-tight">Captured</div>
        <div className="text-[10px] text-muted-foreground/60 leading-tight">1 item saved</div>
      </div>
    </motion.div>
  );
}

export function HeroEntrance() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const canvasOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const headlineY = useTransform(scrollY, [0, 400], reduced ? [0, 0] : [0, 10]);
  const mockupY = useTransform(scrollY, [0, 400], reduced ? [0, 0] : [0, -15]);
  const mockupScale = useTransform(scrollY, [0, 400], reduced ? [1, 1] : [1, 0.97]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState("2");
  const [captured, setCaptured] = useState(false);
  const selected = mockContent[selectedId];
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouse({ x: x * 6, y: y * 6 });
    },
    [reduced],
  );

  useEffect(() => {
    console.log(
      "%c Devventory %c Never lose a thought. ✦ ",
      "background:#6366F1;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold",
      "color:#6366F1;font-weight:normal",
    );
  }, []);

  return (
    <div className="flex justify-center items-center" onMouseMove={onMouseMove}>
      {/* R3F knowledge canvas */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity: reduced ? 0 : canvasOpacity }}>
        <R3FCanvas show={!reduced} />
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text side */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-xl"
            style={{ y: headlineY }}
            variants={reduced ? undefined : container}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
          >
            <motion.div variants={reduced ? undefined : fadeUp}>
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
                Developer knowledge OS
              </span>
            </motion.div>

            <motion.h1
              variants={reduced ? undefined : fadeUp}
              className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold tracking-[-0.03em] leading-[1.05] mb-5"
            >
              Capture anything.
              <br />
              <motion.span
                className="text-[#6366F1] inline-block"
                initial={reduced ? undefined : { opacity: 0.5, scale: 0.98 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: ease.decelerate, delay: 0.8 }}
              >
                Never lose context.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="text-base text-muted-foreground/80 max-w-lg leading-relaxed mb-8"
            >
              One place for every link, note, PDF, and idea you want to
              remember. Search everything — instantly.
            </motion.p>

            <motion.div variants={reduced ? undefined : fadeUp} className="flex items-center gap-3 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group h-11 px-6 text-sm gap-2 bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 hover:scale-[1.02] transition-all"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 text-sm border-border/60 text-muted-foreground/70 hover:text-foreground hover:border-border transition-all hover:scale-[1.02]"
                >
                  Sign in
                </Button>
              </Link>
              <a
                href="https://github.com/chintu79/devs_second_brain"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-foreground/70 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Star on GitHub
              </a>
            </motion.div>
          </motion.div>

          {/* Preview side */}
          <motion.div
            className="flex-1 w-full max-w-lg"
            style={{ y: mockupY, scale: mockupScale }}
            initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: ease.decelerate, delay: 0.3 }}
          >
            <div
              className="relative"
              style={
                reduced
                  ? undefined
                  : { transform: `translate(${mouse.x}px, ${mouse.y}px)`, transition: "transform 0.15s ease-out" }
              }
            >
              {/* Ambient glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-[#6366F1]/5 via-[#6366F1]/5 to-transparent rounded-3xl blur-3xl pointer-events-none" />

              {/* Window */}
              <div className="relative rounded-xl border border-border/60 bg-card/90 backdrop-blur-sm shadow-xl overflow-hidden">
                {/* Chrome */}
                <div className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5 bg-secondary/20">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-[#EF4444]" />
                    <div className="h-2 w-2 rounded-full bg-[#EAB308]" />
                    <div className="h-2 w-2 rounded-full bg-[#22C55E]" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[11px] text-muted-foreground/40 font-medium">knowledge · Devventory</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground/30">
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>

                {/* Body — two-panel: list + reader */}
                <div className="flex h-72 md:h-80">
                  {/* Resource list */}
                  <div className="w-56 shrink-0 border-r border-border/60 p-2.5 space-y-1">
                    <motion.div
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={reduced ? undefined : { opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                      className="flex items-center gap-1.5 rounded-lg bg-muted/30 border border-border/40 px-2.5 py-1.5 mb-2"
                    >
                      <Search className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[11px] text-muted-foreground/40">Search knowledge...</span>
                    </motion.div>

                    {mockItems.map((item, i) => (
                      <motion.button
                        key={item.id}
                        variants={reduced ? undefined : itemVariants(i)}
                        initial={reduced ? undefined : "hidden"}
                        animate={reduced ? undefined : "visible"}
                        whileTap={reduced ? undefined : { scale: 0.98 }}
                        onClick={() => setSelectedId(item.id)}
                        className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors duration-150 ${
                          selectedId === item.id ? "bg-muted/30" : "hover:bg-muted/20"
                        }`}
                      >
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.dot}`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] font-medium text-foreground/80 truncate leading-tight">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground/50 truncate">{item.url}</span>
                            <span className={`text-[10px] font-medium ${item.color}`}>{item.tag}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}

                    <div className="border-t border-border/40 my-1" />

                    <motion.button
                      initial={reduced ? undefined : { opacity: 0 }}
                      animate={reduced ? undefined : { opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.5 }}
                      whileTap={reduced ? undefined : { scale: 0.97, transition: { duration: 0.1 } }}
                      onClick={() => {
                        setCaptured(true);
                        setTimeout(() => setCaptured(false), 2000);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-[#6366F1]/30 bg-[#6366F1]/5 px-2.5 py-2 transition-colors duration-150 hover:bg-[#6366F1]/10"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#6366F1]/10">
                        {captured ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-[#6366F1]">
                        {captured ? "Saved!" : "Save current page..."}
                      </span>
                    </motion.button>
                  </div>

                  {/* Reader panel */}
                  <div className="flex-1 p-4 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedId}
                        initial={reduced ? undefined : { opacity: 0, y: 8 }}
                        animate={reduced ? undefined : { opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: ease.decelerate }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`h-3 w-3 rounded ${selectedId === "1" ? "bg-red-400" : selectedId === "2" ? "bg-emerald-400" : "bg-sky-400"}`} />
                          <span className="text-[11px] font-medium text-foreground/80 truncate">{selected.title}</span>
                        </div>
                        <div className="space-y-2 text-[11px] text-muted-foreground/60 leading-relaxed">
                          {selected.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                          <BookOpen className="h-3 w-3 text-muted-foreground/40" />
                          <span className="text-[10px] text-muted-foreground/40">2 highlights · {selected.readTime}</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <CaptureIndicator />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
