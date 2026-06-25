export function parseTagNames(input: string): string[] {
  if (!input || !input.trim()) return [];
  return input.split(",").map((t) => t.trim()).filter(Boolean);
}

export function buildTagCreate(tagNames: string[], userId: string) {
  return {
    create: tagNames.map((name) => ({
      tag: {
        connectOrCreate: {
          where: { name_userId: { name, userId } },
          create: { name, userId },
        },
      },
    })),
  };
}

export const includeTags = {
  include: { tags: { include: { tag: true } } },
} as const;

export type WithTagRels<T> = T & {
  tags: { tag: { id: string; name: string } }[];
};

export function flattenItemTags<T extends { tags?: { tag: { name: string } }[] }>(
  item: T
): Omit<T, "tags"> & { tags: string[] } {
  return {
    ...item,
    tags: item.tags?.map((t) => t.tag.name) ?? [],
  };
}

export function flattenListTags<T extends { tags?: { tag: { name: string } }[] }>(
  items: T[]
): (Omit<T, "tags"> & { tags: string[] })[] {
  return items.map(flattenItemTags);
}
