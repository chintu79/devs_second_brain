"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slideInRight } from "@devventory/motion";
import { deleteKnowledgeItem, toggleFavorite, archiveKnowledgeItem, restoreKnowledgeItem, editKnowledgeItem, touchKnowledgeItem } from "@/actions/knowledge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAutosave } from "@/hooks/use-autosave";
import { ReaderHeader } from "./readers/reader-header";
import { getReader, type KnowledgeItemType } from "./readers/reader-registry";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function ResourceReaderPanel({
  item, onClose, onTagClick, autoEdit = false, focusMode, onExitFocus,
}: {
  item: KnowledgeItemType;
  onClose: () => void;
  onTagClick?: (tag: string) => void;
  autoEdit?: boolean;
  focusMode?: boolean;
  onExitFocus?: () => void;
}) {
  const reduced = useReducedMotion();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFav, setIsFav] = useState(item.favorite);
  const [favPending, setFavPending] = useState(false);
  const [locked, setLocked] = useState(!autoEdit);
  const isTrashed = item.status === "trashed";
  const isArchived = item.status === "archived";
  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content || "");
  const [editNotes, setEditNotes] = useState(item.notes || "");
  const [editTags, setEditTags] = useState(item.tags.join(", "));

  useEffect(() => {
    if (!focusMode) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onExitFocus?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode, onExitFocus]);

  useEffect(() => {
    if (locked) {
      setEditTitle(item.title);
      setEditContent(item.content || "");
      setEditNotes(item.notes || "");
      setEditTags(item.tags.join(", "));
    }
  }, [item, locked]);

  useEffect(() => { touchKnowledgeItem(item.id); }, [item.id]);

  async function handleDelete() {
    if (deleting) return;
    setShowDeleteConfirm(true);
  }

  async function confirmDelete() {
    setShowDeleteConfirm(false);
    setDeleting(true);
    onClose();
    deleteKnowledgeItem(item.id).then(() => {
      toast.success("Deleted");
      router.refresh();
    }).catch(() => toast.error("Failed to delete"));
  }

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try {
      await toggleFavorite(item.id, item.favorite);
    } catch {
      setIsFav(isFav);
      toast.error("Failed to toggle favorite");
    }
    setFavPending(false);
  }

  async function handleArchive() {
    await archiveKnowledgeItem(item.id);
    toast.success("Archived");
    onClose();
    router.refresh();
  }

  async function handleRestore() {
    await restoreKnowledgeItem(item.id);
    toast.success("Restored");
    onClose();
    router.refresh();
  }

  const draftData = { title: editTitle, content: editContent, notes: editNotes, tags: editTags };

  const handleAutosave = useCallback(async (data: typeof draftData) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("content", data.content);
    formData.set("notes", data.notes);
    formData.set("tags", data.tags);
    const result = await editKnowledgeItem(item.id, formData);
    if (result?.success) router.refresh();
  }, [item.id, router]);

  const { status, saveNow } = useAutosave({ data: draftData, onSave: handleAutosave, delay: 2000, enabled: !locked });

  function handleToggleLock() {
    if (locked) setLocked(false);
    else { saveNow(); setLocked(true); }
  }

  const blended = !locked ? "opacity-50 pointer-events-none" : "";

  const shared = {
    item, locked, blended,
    editTitle, editContent, editNotes, editTags,
    onEditTitle: setEditTitle, onEditContent: setEditContent,
    onEditNotes: setEditNotes, onEditTags: setEditTags,
    onTagClick, onClose,
  };

  const Reader = getReader(item.type);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(`reader-scroll-${item.id}`);
    if (saved && scrollRef.current) scrollRef.current.scrollTop = parseInt(saved, 10);
  }, [item.id]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) sessionStorage.setItem(`reader-scroll-${item.id}`, String(scrollRef.current.scrollTop));
  }, [item.id]);

  return (
    <motion.div variants={reduced ? undefined : slideInRight} initial={reduced ? undefined : "initial"} animate={reduced ? undefined : "animate"} exit={reduced ? undefined : "exit"} className="outline-none flex flex-col h-full">
      <ReaderHeader
        isFav={isFav} favPending={favPending} locked={locked} status={status}
        deleting={deleting} focusMode={focusMode}
        isTrashed={isTrashed} isArchived={isArchived}
        onClose={onClose} onExitFocus={onExitFocus}
        onFavorite={handleFavorite} onToggleLock={handleToggleLock} onDelete={handleDelete}
        onArchive={handleArchive} onRestore={handleRestore}
      />
      <div ref={scrollRef} className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        <Reader {...shared} />
      </div>
      <ConfirmDialog
        open={showDeleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete this item?"
        description="This will move it to trash. You can restore it later."
      />
    </motion.div>
  );
}
