"use client";

import { useState, useEffect, useCallback } from "react";

const phrases = [
  "resource.",
  "repository.",
  "prompt.",
  "note.",
  "project idea.",
  "insight.",
];

const TYPING_SPEED = 60;
const DELETING_SPEED = 35;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETING = 400;

export function TypewriterText() {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      setDisplay(currentPhrase.slice(0, charIndex + 1));
      setCharIndex((c) => c + 1);

      if (charIndex + 1 === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
        return;
      }
    } else {
      setDisplay(currentPhrase.slice(0, charIndex - 1));
      setCharIndex((c) => c - 1);

      if (charIndex - 1 === 0) {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
        return;
      }
    }
  }, [phraseIndex, charIndex, isDeleting]);

  useEffect(() => {
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return (
    <span className="text-primary">
      {display}
      <span className="inline-block w-[2px] h-[0.85em] bg-primary ml-0.5 align-middle animate-pulse" />
    </span>
  );
}
