const MAX_TAGS = 20;

export function parseTagNames(input: string): string[] {
  if (!input || !input.trim()) return [];
  return input.split(",").map((t) => t.trim()).filter(Boolean).slice(0, MAX_TAGS);
}

export function flattenItemTags<T extends { tags?: { tag: { name: string } }[] }>(
  item: T
): Omit<T, "tags"> & { tags: string[] } {
  return {
    ...item,
    tags: item.tags?.map((t) => t.tag.name) ?? [],
  };
}

export function flattenItemCollections<T extends { collections?: { collectionId: string }[] }>(
  item: T
): Omit<T, "collections"> & { collectionIds: string[] } {
  return {
    ...item,
    collectionIds: item.collections?.map((c) => c.collectionId) ?? [],
  };
}

export const DOT_COLORS: Record<string, string> = {
  link: "bg-sky-400", note: "bg-emerald-400", document: "bg-amber-400",
  pdf: "bg-red-400", tweet: "bg-blue-400", video: "bg-rose-400",
};
