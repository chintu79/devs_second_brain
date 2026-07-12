"use client";

import { Heart, Lock, Unlock, Loader2, Trash2, X, ArrowLeft, Archive, RotateCcw } from "lucide-react";
import type { SaveStatus } from "@/hooks/use-autosave";

interface ReaderHeaderProps {
  isFav: boolean;
  favPending: boolean;
  locked: boolean;
  status: SaveStatus;
  deleting: boolean;
  focusMode?: boolean;
  isTrashed?: boolean;
  isArchived?: boolean;
  onClose: () => void;
  onExitFocus?: () => void;
  onFavorite: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
}

export function ReaderHeader({
  isFav, favPending, locked, status, deleting, focusMode,
  isTrashed, isArchived,
  onClose, onExitFocus, onFavorite, onToggleLock, onDelete, onArchive, onRestore,
}: ReaderHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b shrink-0">
      <div className="flex items-center gap-1">
        {focusMode ? (
          <button
            onClick={onExitFocus}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted/50 transition-colors"
            aria-label="Back to preview"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onFavorite}
          disabled={favPending}
          aria-label={isFav ? "Unfavorite" : "Favorite"}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted/50 transition-colors"
        >
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50 hover:text-amber-400"}`} />
        </button>
        {!locked && status !== "idle" && (
          <span className="text-xs mr-1">
            {status === "saving" && <Loader2 className="h-3 w-3 animate-spin inline text-muted-foreground" />}
            {status === "saved" && <span className="text-emerald-400 text-[10px]">Saved</span>}
            {status === "error" && <span className="text-red-400 text-[10px]">Error</span>}
          </span>
        )}
        <button
          onClick={onToggleLock}
          aria-label={locked ? "Edit" : "Lock"}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted/50 transition-colors"
        >
          {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5 text-foreground" />}
        </button>
        {!focusMode && !isTrashed && !isArchived && (
          <button
            onClick={onArchive}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-muted/50 transition-colors"
            aria-label="Archive"
          >
            <Archive className="h-3.5 w-3.5" />
          </button>
        )}
        {!focusMode && (isTrashed || isArchived) && (
          <button
            onClick={onRestore}
            className="flex h-7 w-7 items-center justify-center rounded hover:text-green-500 hover:bg-green-500/10 transition-colors"
            aria-label="Restore"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        {!focusMode && (
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            aria-label={isTrashed ? "Delete permanently" : "Delete"}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
