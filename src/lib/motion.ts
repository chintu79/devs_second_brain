/* ── Timing ── */
export const duration = {
  micro: 0.12,
  hover: 0.18,
  tap: 0.12,
  search: 0.25,
  panel: 0.3,
  page: 0.3,
  reveal: 0.55,
  modal: 0.2,
} as const;

/* ── Easing ── */
export const ease = {
  standard: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  decelerate: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0.0, 1, 1] as [number, number, number, number],
  spring: { type: "spring" as const, stiffness: 350, damping: 25, mass: 0.8 },
  springSnappy: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.5 },
} as const;

/* ── Page Transition (fade + slide — no blur, cheaper GPU) ── */
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: duration.page, ease: ease.decelerate },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: duration.micro, ease: ease.accelerate },
  },
};

/* ── Section Reveal (scroll-triggered, once) ── */
export const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

/* ── Fade In ── */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.reveal, ease: ease.standard } },
};

/* ── Fade In Up ── */
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

/* ── Fade In Down ── */
export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.reveal, ease: ease.decelerate },
  },
};

/* ── Slide In Right (preview panels) ── */
export const slideInRight = {
  initial: { opacity: 0, x: 24, filter: "blur(4px)" },
  animate: {
    opacity: 1, x: 0, filter: "blur(0px)",
    transition: { duration: duration.panel, ease: ease.decelerate },
  },
  exit: {
    opacity: 0, x: 24, filter: "blur(4px)",
    transition: { duration: duration.panel, ease: ease.accelerate },
  },
};

/* ── Scale In (modals, dialogs) ── */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { duration: duration.modal, ease: ease.decelerate },
  },
  exit: {
    opacity: 0, scale: 0.98, filter: "blur(4px)",
    transition: { duration: duration.modal, ease: ease.accelerate },
  },
};

/* ── Modal Overlay ── */
export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.modal } },
  exit: { opacity: 0, transition: { duration: duration.modal } },
};

/* ── Search / Command Palette ── */
export const searchReveal = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(8px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { duration: duration.search, ease: ease.decelerate },
  },
  exit: {
    opacity: 0, scale: 0.98, filter: "blur(8px)",
    transition: { duration: duration.search, ease: ease.accelerate },
  },
};

/* ── Staggered Container ── */
export const stagger = {
  container: {
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  },
};

/* ── Card Hover (applied via whileHover) ── */
export const cardHover = {
  y: -2,
  scale: 1.01,
  transition: { duration: duration.hover, ease: ease.decelerate },
};

/* ── Button Hover (for motion buttons) ── */
export const buttonHover = {
  scale: 1.02,
  transition: { duration: duration.hover, ease: ease.decelerate },
};

/* ── Button Tap ── */
export const buttonTap = {
  scale: 0.98,
  transition: { duration: duration.tap, ease: ease.accelerate },
};

/* ── Sidebar Active Pill ── */
export const activePill = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { duration: duration.hover, ease: ease.decelerate },
};

/* ── Collapsible Section ── */
export const collapsible = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: duration.micro, ease: ease.standard },
};

/* ── Content Stagger (for detail panels) ── */
export function contentStagger(delayBase = 0.05, staggerBy = 0.04) {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: duration.panel, delay: delayBase + i * staggerBy, ease: ease.decelerate },
    }),
  };
}

/* ── Lift (for interactive elements on hover) ── */
export const liftHover = {
  y: -2,
  transition: { duration: duration.hover, ease: ease.decelerate },
};
