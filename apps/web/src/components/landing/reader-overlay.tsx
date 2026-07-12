"use client";

import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ExternalLink, Tag, Clock } from "lucide-react";

interface ReaderOverlayProps {
  id: string | null;
  onClose: () => void;
}

const content: Record<string, { title: string; body: string[]; url: string; tags: string[]; readTime: string }> = {
  "1": {
    title: "How QR Phishing Attacks Target Developers",
    body: [
      "QR phishing — or 'quishing' — is on the rise. Attackers are embedding malicious QR codes in emails, PDFs, and even physical mail to bypass traditional email security filters.",
      "Unlike a standard phishing link, a QR code cannot be inspected before scanning. The user's mobile device provides no hover preview, no URL inspection — just a blind trust fall into whatever destination the code encodes.",
      "For developers, the risk is amplified. Many engineering teams receive unsolicited job offers, conference invitations, and package delivery notifications that look legitimate. A single scan can compromise personal credentials, company VPN access, or CI/CD pipeline tokens.",
      "The mitigation strategy is straightforward but rarely practiced: treat every QR code like an unknown link. Use a QR scanner app that previews URLs before opening. On mobile, long-press the decoded URL to inspect it. Never scan a QR code from an unsolicited message.",
    ],
    url: "blog.security.com",
    tags: ["Security", "Phishing", "DevOps"],
    readTime: "4 min read",
  },
  "2": {
    title: "React 19: Everything You Need To Know",
    body: [
      "React 19 introduces significant improvements to server components, actions, and the new compiler. The React team has been working on these features for over two years, and the result is a framework that feels both familiar and fundamentally more capable.",
      "The most impactful change is the new compiler. Previously, React required manual memoization via useMemo, useCallback, and React.memo. The compiler now handles this automatically, analyzing your code at build time and inserting the necessary optimizations.",
      "Server Components, introduced as experimental in React 18, are now stable. This means components that fetch data, access databases, or use file systems can run exclusively on the server, sending only their rendered output to the client. The result is smaller bundles and faster page loads.",
      "Actions provide a new pattern for handling form submissions and data mutations. Combined with Server Components, they enable a full-stack development experience within a single React component — no separate API routes needed.",
    ],
    url: "react.dev",
    tags: ["Frontend", "React", "JavaScript"],
    readTime: "6 min read",
  },
  "3": {
    title: "System Design — Rate Limiting",
    body: [
      "Rate limiting is one of the most critical — and most frequently misunderstood — components of distributed system design. At its core, rate limiting controls how many requests a client can make to an API within a given time window.",
      "The most common algorithms are Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log. Each has tradeoffs between memory usage, accuracy, and burst behavior.",
      "Token Bucket is the most widely used in production systems (including Stripe and GitHub). It allows bursts up to a configured capacity while maintaining a steady refill rate. The implementation is simple: a counter per client, a timestamp of last refill, and a configured rate.",
      "Distributed rate limiting adds complexity. When an API runs across 50 servers, a naive in-memory counter won't work. Redis is the standard solution — atomic INCR commands with EXPIRE provide consistent counters across nodes. For higher throughput, consider local token buckets with periodic Redis sync.",
    ],
    url: "medium.com",
    tags: ["Backend", "System Design", "Distributed"],
    readTime: "8 min read",
  },
};

export function ReaderOverlay({ id, onClose }: ReaderOverlayProps) {
  const reduced = useReducedMotion();
  const data = id ? content[id] : null;

  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 pb-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Reader card */}
        <motion.div
          layoutId={`tile-${id}`}
          className="relative w-full max-w-[780px] mx-4 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#6366F1]" />
              <span className="text-xs font-medium text-muted-foreground/60">Reader</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted/30 transition-colors"
              aria-label="Close reader"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground/50" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 md:px-10 py-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4">
              {data.title}
            </h2>

            <div className="flex items-center gap-3 mb-8 text-xs text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {data.url}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {data.readTime}
              </span>
            </div>

            <div className="space-y-4 text-base text-foreground/80 leading-relaxed max-w-none">
              {data.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/40">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#6366F1]/5 border border-[#6366F1]/15 px-2.5 py-1 text-[11px] font-medium text-[#6366F1]"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
