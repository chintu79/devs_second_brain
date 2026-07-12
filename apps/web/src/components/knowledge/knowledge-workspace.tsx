"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LayoutGroup } from "framer-motion";
import { KnowledgeGrid } from "./knowledge-grid";
import type { KnowledgeItemType } from "@/components/resources/readers/reader-registry";

const ReaderOverlay = dynamic(
  () => import("./reader-overlay").then((m) => ({ default: m.ReaderOverlay })),
  { ssr: false }
);

interface KnowledgeWorkspaceProps {
  initialItems: KnowledgeItemType[];
  nextCursor: string | null;
  filter?: string | null;
}

export function KnowledgeWorkspace({ initialItems, nextCursor, filter }: KnowledgeWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const selectedTag = searchParams.get("tag");
  const collectionId = searchParams.get("collection");
  const [overlayItem, setOverlayItem] = useState<KnowledgeItemType | null>(
    () => initialItems.find((r) => r.id === selectedId) ?? null
  );

  // Sync overlay with URL on browser back/forward
  useEffect(() => {
    if (selectedId) {
      const item = initialItems.find((r) => r.id === selectedId);
      if (item && item.id !== overlayItem?.id) setOverlayItem(item);
    } else if (overlayItem) {
      setOverlayItem(null);
    }
  }, [selectedId]);

  const setSearchParam = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`/knowledge?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSelectItem = useCallback((id: string | null) => {
    if (id) {
      const item = initialItems.find((r) => r.id === id);
      if (item) setOverlayItem(item);
      const params = new URLSearchParams(searchParams.toString());
      params.set("id", id);
      router.replace(`/knowledge?${params.toString()}`, { scroll: false });
    } else {
      setOverlayItem(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("id");
      router.replace(`/knowledge?${params.toString()}`, { scroll: false });
    }
  }, [router, searchParams, initialItems]);

  return (
    <LayoutGroup>
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <KnowledgeGrid
            initialItems={initialItems}
            nextCursor={nextCursor}
            selectedId={selectedId}
            onSelect={handleSelectItem}
            selectedTag={selectedTag}
            onTagChange={(tag) => setSearchParam("tag", tag)}
            collectionId={collectionId}
            onCollectionChange={(id) => setSearchParam("collection", id)}
            filter={filter}
            onFilterChange={() => setSearchParam("filter", null)}
          />
        </div>

          {overlayItem && (
            <ReaderOverlay
              key={overlayItem.id}
              item={overlayItem}
              onClose={() => handleSelectItem(null)}
            />
          )}
      </div>
    </LayoutGroup>
  );
}
