"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/action-utils";
import { search } from "@/lib/search/engine";
import { parseQuery } from "@/lib/search/tokenizer";
import type { SearchFilters, SearchResponse } from "@/lib/search/types";

export async function globalSearch(
  query: string,
  filters?: SearchFilters,
  cursor?: string,
  limit = 50
): Promise<SearchResponse> {
  try {
    const userId = await requireAuth();
    if (!query?.trim() || !userId) return { results: [], total: 0, hasMore: false, query, nextCursor: null };

    const parsed = parseQuery(query);
    if (!parsed.text && !parsed.phrase && !parsed.tagFilter && !Object.keys(parsed.namedFilters).length) {
      return { results: [], total: 0, hasMore: false, query, nextCursor: null };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId, status: "active" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    if (parsed.textTokens.length > 0) {
      const tokenConds = parsed.textTokens.map((token) => ({
        OR: [
          { title: { contains: token, mode: "insensitive" } },
          { url: { contains: token, mode: "insensitive" } },
          { content: { contains: token, mode: "insensitive" } },
          { notes: { contains: token, mode: "insensitive" } },
          { summary: { contains: token, mode: "insensitive" } },
          { domain: { contains: token, mode: "insensitive" } },
          { provider: { contains: token, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: token, mode: "insensitive" } } } } },
        ],
      }));
      conditions.push({ AND: tokenConds });
    }

    if (parsed.phrase) {
      conditions.push({
        OR: [
          { title: { contains: parsed.phrase, mode: "insensitive" } },
          { content: { contains: parsed.phrase, mode: "insensitive" } },
          { notes: { contains: parsed.phrase, mode: "insensitive" } },
        ],
      });
    }

    if (conditions.length > 0) where.AND = conditions;

    const raw = await prisma.knowledgeItem.findMany({
      where,
      include: { tags: { include: { tag: true } } },
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = raw.length > limit;
    if (hasMore) raw.pop();

    const items = raw.map((i) => ({
      id: i.id, title: i.title, url: i.url, type: i.type,
      content: i.content, notes: i.notes, summary: i.summary,
      tags: i.tags.map((t) => t.tag.name),
      favorite: i.favorite, domain: i.domain, provider: i.provider,
      status: i.status, createdAt: i.createdAt, lastOpenedAt: i.lastOpenedAt,
    }));

    const mergedFilters: SearchFilters = { ...filters };
    if (parsed.tagFilter) mergedFilters.tag = parsed.tagFilter;
    if (parsed.namedFilters.type) mergedFilters.type = parsed.namedFilters.type;
    if (parsed.namedFilters.provider) mergedFilters.provider = parsed.namedFilters.provider;
    if (parsed.namedFilters.domain) mergedFilters.domain = parsed.namedFilters.domain;
    if (parsed.namedFilters.favorite) mergedFilters.favorite = parsed.namedFilters.favorite;

    const results = search(items, parsed, mergedFilters);

    return {
      results: results.slice(0, limit),
      total: results.length,
      hasMore: hasMore || results.length > limit,
      query,
      nextCursor: hasMore ? raw[raw.length - 1].id : null,
    };
  } catch {
    return { results: [], total: 0, hasMore: false, query, nextCursor: null };
  }
}
