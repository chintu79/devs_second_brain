"use client";

import { useEffect, useRef } from "react";

export function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(el);
        } else {
          // Below the fold — hide instantly (user can't see it)
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition = `opacity 0.5s ease-out, transform 0.5s ease-out`;
        }
      },
      { threshold: 0.1 }
    );

    // If the element is already in view on mount, animate entrance via a temporary hide+show
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "none";
      // Force reflow so the opacity 0 takes effect
      void el.offsetHeight;
      el.style.transition = `opacity 0.5s ease-out, transform 0.5s ease-out`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, delay);
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [delay]);

  // SSR: renders fully visible — no inline styles
  return <div ref={ref} className={className}>{children}</div>;
}

export function FadeInScale({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0) scale(1)";
          }, delay);
          observer.unobserve(el);
        } else {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px) scale(0.98)";
          el.style.transition = `opacity 0.5s ease-out, transform 0.5s ease-out`;
        }
      },
      { threshold: 0.1 }
    );

    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px) scale(0.98)";
      el.style.transition = "none";
      void el.offsetHeight;
      el.style.transition = `opacity 0.5s ease-out, transform 0.5s ease-out`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
      }, delay);
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
