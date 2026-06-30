"use client";

import { ErrorCard } from "@devventory/shared";

export default function NotesError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard {...props} title="Failed to load notes" />;
}
