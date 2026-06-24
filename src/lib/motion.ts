/* ── Timing ── */
export const duration = {
  micro: 0.12,
  hover: 0.2,
  search: 0.25,
  panel: 0.3,
  page: 0.35,
  reveal: 0.5,
} as const;

/* ── Easing ── */
export const ease = {
  standard: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.8 },
} as const;

/* ── Variants ── */

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.reveal, ease: ease.standard } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: duration.panel, ease: ease.standard },
  },
  exit: { opacity: 0, x: 24, transition: { duration: duration.panel, ease: ease.standard } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

export const stagger = {
  container: {
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  },
};

/* ── Panel transition (for right-side detail/preview panels) ── */
export const panelTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
  transition: { duration: duration.panel, ease: ease.standard },
};

/* ── Card hover (applied via whileHover) ── */
export const cardHover = {
  scale: 1.015,
  transition: { duration: duration.hover, ease: ease.standard },
};

/* ── Sidebar active pill ── */
export const activePill = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { duration: duration.hover, ease: ease.decelerate },
};

/* ── Content stagger for detail panels ── */
export function contentStagger(delayBase = 0.05, staggerBy = 0.04) {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: duration.panel, delay: delayBase + i * staggerBy, ease: ease.standard },
    }),
  };
}

/* ── Collapsible section ── */
export const collapsible = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: duration.micro, ease: ease.standard },
};
