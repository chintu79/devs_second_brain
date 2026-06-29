/* ── Timing ── */
export const duration = {
  micro: 0.12,
  hover: 0.18,
  panel: 0.25,
  page: 0.15,
  reveal: 0.3,
} as const;

/* ── Easing ── */
export const ease = {
  standard: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],
} as const;

/* ── Fade In Up ── */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

/* ── Slide In Right (preview panels) — GPU: opacity + translate ── */
export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: {
    opacity: 1, x: 0,
    transition: { duration: duration.panel, ease: ease.decelerate },
  },
  exit: {
    opacity: 0, x: 24,
    transition: { duration: duration.panel, ease: ease.accelerate },
  },
};

/* ── Staggered Container ── */
export const stagger = {
  container: {
    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  },
};

/* ── Card Hover (applied via whileHover) ── */
export const cardHover = {
  y: -2,
  scale: 1.01,
  transition: { duration: duration.hover, ease: ease.decelerate },
};

/* ── Collapsible Section ── */
export const collapsible = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: duration.micro, ease: ease.standard },
};

/* ── Content Reveal (staggered panel sections) ── */
export const contentReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, delay: 0.05 + i * 0.04, ease: ease.standard },
  }),
};


