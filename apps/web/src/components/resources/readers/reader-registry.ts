import type { ComponentType } from "react";
import { ReferenceReader } from "./reference-reader";
import { NoteReader } from "./note-reader";
import { DocumentReader } from "./document-reader";
import { VideoReader } from "./video-reader";

export interface KnowledgeItemType {
  id: string; title: string; url: string | null; type: string;
  content: string | null; notes: string | null; summary: string | null;
  tags: string[]; favorite: boolean; createdAt: Date;
  domain: string | null; status: string;
  lastOpenedAt: Date | null;
  captureStatus?: string | null;
}

export interface ReaderProps {
  item: KnowledgeItemType;
  locked: boolean;
  blended: string;
  editTitle: string;
  editContent: string;
  editNotes: string;
  editTags: string;
  onEditTitle: (v: string) => void;
  onEditContent: (v: string) => void;
  onEditNotes: (v: string) => void;
  onEditTags: (v: string) => void;
  onTagClick?: (tag: string) => void;
  onClose: () => void;
}

type ReaderComponent = ComponentType<ReaderProps>;

const REGISTRY: Record<string, ReaderComponent> = {
  reference: ReferenceReader,
  link: ReferenceReader,
  note: NoteReader,
  document: DocumentReader,
  pdf: DocumentReader,
  video: VideoReader,
};

export function getReader(type: string): ReaderComponent {
  return REGISTRY[type] || REGISTRY.reference;
}
