"use client";

import { memo, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Brain,
  Plus,
  Pencil,
  Search,
  FolderOpen,
  Heart,
  Clock,
  Archive,
  Trash2,
  Tags,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { logout } from "@/actions/auth";
import { quickCapture } from "@/actions/capture";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getCollectionTree, createCollection, renameCollection, deleteCollection } from "@/actions/collections";
import { getTagsWithCounts } from "@/actions/tags";
import type { CollectionNode } from "@/actions/collections";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

function CollectionItem({ node, depth = 0, onChange }: { node: CollectionNode; depth?: number; onChange: () => void }) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasChildren = node.children.length > 0;
  const active = searchParams.get("collection") === node.id;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  function handleNavigate() {
    const params = new URLSearchParams(searchParams.toString());
    if (active) params.delete("collection");
    else params.set("collection", node.id);
    router.push(`/knowledge?${params.toString()}`);
  }

  async function handleRename() {
    if (!editValue.trim() || editValue.trim() === node.name) {
      setEditing(false);
      setEditValue(node.name);
      return;
    }
    await renameCollection(node.id, editValue.trim());
    setEditing(false);
    onChange();
  }

  function handleDeleteStart() {
    setShowDeleteConfirm(true);
  }

  async function handleDelete() {
    if (deleting) return;
    setShowDeleteConfirm(false);
    setDeleting(true);
    await deleteCollection(node.id);
    setDeleting(false);
    onChange();
  }

  return (
    <div>
      <div
        className={`sidebar-item w-full gap-0 p-0 group ${active ? "sidebar-item-active" : ""}`}
        style={{ paddingLeft: `${16 + depth * 16}px` }}
        aria-current={active ? "page" : undefined}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
            className="flex items-center justify-center h-7 w-7 shrink-0 hover:bg-accent/10 rounded"
          >
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="w-7 shrink-0" />
        )}
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") { setEditing(false); setEditValue(node.name); }
            }}
            className="flex-1 min-w-0 h-6 text-xs bg-transparent outline-none border-b border-foreground/20"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button onClick={handleNavigate} className="flex items-center gap-1.5 flex-1 min-w-0 h-7">
            <FolderOpen className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-xs flex-1 text-left">{node.name}</span>
            <span className="text-[10px] text-muted-foreground/40 tabular-nums">{node.itemCount}</span>
          </button>
        )}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); setEditValue(node.name); }}
            className="flex items-center justify-center h-6 w-6 hover:bg-accent/10 rounded"
            aria-label="Rename"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={handleDeleteStart}
            disabled={deleting}
            className="flex items-center justify-center h-6 w-6 hover:bg-destructive/10 hover:text-destructive rounded"
            aria-label="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      {open && hasChildren && (
        <div>
          {node.children.map((child) => (
            <CollectionItem key={child.id} node={child} depth={depth + 1} onChange={onChange} />
          ))}
        </div>
      )}
      <ConfirmDialog
        open={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title={`Delete "${node.name}"?`}
        description="This cannot be undone."
      />
    </div>
  );
}

function CollectionTree() {
  const [collections, setCollections] = useState<CollectionNode[]>([]);
  const [creating, setCreating] = useState(false);
  const [createValue, setCreateValue] = useState("");
  const [revision, setRevision] = useState(0);
  const createRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  useEffect(() => {
    getCollectionTree().then(setCollections).catch(() => {});
  }, [revision]);

  useEffect(() => {
    if (creating && createRef.current) createRef.current.focus();
  }, [creating]);

  async function handleCreate() {
    if (!createValue.trim()) { setCreating(false); return; }
    await createCollection(createValue.trim());
    setCreateValue("");
    setCreating(false);
    refresh();
  }

  if (collections.length === 0 && !creating) return null;

  return (
    <div className="space-y-0.5 mt-1">
      <button
        onClick={() => setCreating(true)}
        className="sidebar-item w-full gap-2.5 text-muted-foreground/50 hover:text-foreground"
        style={{ paddingLeft: "32px" }}
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">New collection</span>
      </button>
      {creating && (
        <div className="flex items-center gap-1" style={{ paddingLeft: "32px" }}>
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
          <input
            ref={createRef}
            value={createValue}
            onChange={(e) => setCreateValue(e.target.value)}
            onBlur={handleCreate}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") { setCreating(false); setCreateValue(""); }
            }}
            placeholder="Collection name"
            className="flex-1 h-6 text-xs bg-transparent outline-none border-b border-foreground/20 placeholder:text-muted-foreground/30"
          />
        </div>
      )}
      {collections.map((c) => (
        <CollectionItem key={c.id} node={c} onChange={refresh} />
      ))}
    </div>
  );
}

function TagList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTag = searchParams.get("tag");
  const [tags, setTags] = useState<{ id: string; name: string; count: number }[]>([]);

  useEffect(() => {
    getTagsWithCounts().then(setTags).catch(() => {});
  }, []);

  if (tags.length === 0) return null;

  return (
    <div className="space-y-0.5 mt-1">
      {tags.map((t) => {
        const active = currentTag === t.name;
        return (
          <button
            key={t.id}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (active) params.delete("tag");
              else params.set("tag", t.name);
              router.push(`/knowledge?${params.toString()}`);
            }}
            className={`sidebar-item w-full gap-2.5 ${active ? "sidebar-item-active" : ""}`}
            style={{ paddingLeft: "32px" }}
            aria-current={active ? "page" : undefined}
          >
            <span className="text-xs truncate flex-1 text-left">{t.name}</span>
            <span className="text-[11px] text-muted-foreground/50 tabular-nums">{t.count}</span>
          </button>
        );
      })}
    </div>
  );
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSearchClick?: () => void;
}

export const Sidebar = memo(function Sidebar({ isOpen, onClose, onSearchClick }: SidebarProps = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentFilter = searchParams.get("filter");
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  const isActive = (href: string) => pathname === href;

  const [capturing, setCapturing] = useState(false);

  const capture = useCallback(() => {
    const url = prompt("Paste a URL to save:");
    if (!url) return;
    setCapturing(true);
    quickCapture(url).then((r) => {
      setCapturing(false);
      if ("success" in r && r.success) router.refresh();
    });
  }, [router]);

  useEffect(() => {
    if (isOpen) onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilter = useCallback((param: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (param) params.set("filter", param);
    else params.delete("filter");
    router.push(`/knowledge?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <>
      {isOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <aside className={`${isOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} md:flex w-[220px] shrink-0 flex-col border-r bg-background`}>
        <Link
          href="/knowledge"
          className={`sidebar-item h-12 gap-2.5 border-b ${isActive("/knowledge") && !currentFilter ? "sidebar-item-active" : ""}`}
          aria-current={isActive("/knowledge") && !currentFilter ? "page" : undefined}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded shrink-0 bg-gradient-to-br from-[#6366F1] to-[#6366F1]">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">Devventory</span>
        </Link>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-2 py-3 space-y-1">
            <button onClick={capture} disabled={capturing} className="sidebar-item w-full gap-2.5">
              {capturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span>{capturing ? "Saving..." : "Capture"}</span>
            </button>

            <div className="my-3 border-t" />

            <button
              onClick={() => setFilter(null)}
              className={`sidebar-item w-full gap-2.5 ${isActive("/knowledge") && !currentFilter ? "sidebar-item-active" : ""}`}
              aria-current={isActive("/knowledge") && !currentFilter ? "page" : undefined}
            >
              <Brain className="h-4 w-4" />
              <span>All Knowledge</span>
            </button>

            <button onClick={onSearchClick} className="sidebar-item w-full gap-2.5">
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search</span>
              <kbd className="text-[10px] font-medium text-muted-foreground/40 bg-muted/50 px-1.5 py-0.5 rounded border">
                ⌘K
              </kbd>
            </button>

            <div className="pt-3 pb-1">
              <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">Views</span>
            </div>

            <button
              onClick={() => setFilter(currentFilter === "favorites" ? null : "favorites")}
              className={`sidebar-item w-full gap-2.5 ${currentFilter === "favorites" ? "sidebar-item-active" : ""}`}
              aria-current={currentFilter === "favorites" ? "page" : undefined}
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setFilter(currentFilter === "recent" ? null : "recent")}
              className={`sidebar-item w-full gap-2.5 ${currentFilter === "recent" ? "sidebar-item-active" : ""}`}
              aria-current={currentFilter === "recent" ? "page" : undefined}
            >
              <Clock className="h-4 w-4" />
              <span>Recent</span>
            </button>

            <button
              onClick={() => setFilter(currentFilter === "archive" ? null : "archive")}
              className={`sidebar-item w-full gap-2.5 ${currentFilter === "archive" ? "sidebar-item-active" : ""}`}
              aria-current={currentFilter === "archive" ? "page" : undefined}
            >
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </button>

            <button
              onClick={() => setFilter(currentFilter === "trash" ? null : "trash")}
              className={`sidebar-item w-full gap-2.5 ${currentFilter === "trash" ? "sidebar-item-active" : ""}`}
              aria-current={currentFilter === "trash" ? "page" : undefined}
            >
              <Trash2 className="h-4 w-4" />
              <span>Trash</span>
            </button>

            <div className="mt-3">
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="sidebar-item w-full gap-1.5"
              >
                {collectionsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="text-xs">Collections</span>
              </button>
              {collectionsOpen && (
                <div className="ml-2">
                  <CollectionTree />
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setTagsOpen(!tagsOpen)}
                className="sidebar-item w-full gap-1.5"
              >
                {tagsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                <Tags className="h-3.5 w-3.5" />
                <span className="text-xs">Tags</span>
              </button>
              {tagsOpen && (
                <div className="ml-2">
                  <TagList />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t px-2 py-2">
          <div className="space-y-0.5">
            <Link href="/settings" className="sidebar-item w-full">
              <Settings className="h-4 w-4" />
              Preferences
            </Link>
            <ThemeToggle variant="sidebar" />
            <form action={logout}>
              <button type="submit" className="sidebar-item w-full">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
});
