import type { SearchResult, SearchFilters, ParsedQuery } from "./types";

interface RawItem {
  id: string;
  title: string;
  url: string | null;
  type: string;
  content: string | null;
  notes: string | null;
  summary: string | null;
  tags: string[];
  favorite: boolean;
  domain: string | null;
  provider: string | null;
  status: string;
  createdAt: Date;
  lastOpenedAt: Date | null;
}

function scoreField(field: string | null, query: string): number {
  if (!field) return 0;
  const lower = field.toLowerCase();
  if (lower.includes(` ${query} `) || lower.startsWith(`${query} `) || lower.endsWith(` ${query}`) || lower === query) return 100;
  if (lower.startsWith(query)) return 80;
  if (lower.includes(query)) return 60;
  return 0;
}

const FIELDS: [string, keyof RawItem][] = [
  ["title", "title"],
  ["summary", "summary"],
  ["notes", "notes"],
  ["content", "content"],
  ["url", "url"],
  ["domain", "domain"],
  ["provider", "provider"],
];

function scoreFieldMatch(item: RawItem, q: string, matchedFields: string[]): number {
  let score = 0;
  for (const [label, key] of FIELDS) {
    const val = item[key] as string | null;
    if (!val) continue;
    const s = scoreField(val, q);
    if (s > 0) {
      score = Math.max(score, s);
      if (!matchedFields.includes(label)) matchedFields.push(label);
    }
  }
  for (const tag of item.tags) {
    if (tag.toLowerCase().includes(q)) {
      score = Math.max(score, 70);
      if (!matchedFields.includes("tags")) matchedFields.push("tags");
    }
  }
  return score;
}

function scoreItem(item: RawItem, tokens: string[], phrase: string | null): { score: number; matchedFields: string[] } {
  const matchedFields: string[] = [];
  let maxScore = 0;
  let tokensMatched = 0;

  for (const token of tokens) {
    const s = scoreFieldMatch(item, token.toLowerCase(), matchedFields);
    if (s > 0) tokensMatched++;
    maxScore = Math.max(maxScore, s);
  }

  if (tokens.length > 1 && tokensMatched === tokens.length) maxScore += 20;

  if (phrase) {
    const phraseMatch = FIELDS.some(([, key]) => {
      const val = item[key] as string | null;
      return val?.toLowerCase().includes(phrase.toLowerCase());
    });
    if (phraseMatch) maxScore = Math.max(maxScore, 90);
  }

  if (item.favorite) maxScore += 15;

  const daysOld = (Date.now() - new Date(item.createdAt).getTime()) / 86400000;
  if (daysOld < 7) maxScore += 10;

  if (item.lastOpenedAt) {
    const daysSinceOpen = (Date.now() - new Date(item.lastOpenedAt).getTime()) / 86400000;
    if (daysSinceOpen < 30) maxScore += 5;
  }

  return { score: maxScore, matchedFields };
}

export function rankItems(items: RawItem[], parsed: ParsedQuery): SearchResult[] {
  const { textTokens, phrase } = parsed;
  if (!textTokens.length && !phrase) return [];

  const scored = items
    .map((item) => {
      const { score, matchedFields } = scoreItem(item, textTokens, phrase);
      return { ...item, score, matchedFields };
    })
    .filter((r) => r.score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return scored;
}

export function applyFilters(items: RawItem[], searchFilters: SearchFilters): RawItem[] {
  return items.filter((item) => {
    if (searchFilters.type) {
      const types = Array.isArray(searchFilters.type) ? searchFilters.type : [searchFilters.type];
      if (!types.includes(item.type)) return false;
    }
    if (searchFilters.provider) {
      const providers = Array.isArray(searchFilters.provider) ? searchFilters.provider : [searchFilters.provider];
      if (!item.provider || !providers.includes(item.provider.toLowerCase())) return false;
    }
    if (searchFilters.domain) {
      const domains = Array.isArray(searchFilters.domain) ? searchFilters.domain : [searchFilters.domain];
      if (!item.domain || !domains.includes(item.domain.toLowerCase())) return false;
    }
    if (searchFilters.tag) {
      if (!item.tags.some((t) => t.toLowerCase() === searchFilters.tag!.toLowerCase())) return false;
    }
    if (searchFilters.favorite === true && !item.favorite) return false;
    return true;
  });
}

export function search(items: RawItem[], parsed: ParsedQuery, extraFilters?: SearchFilters): SearchResult[] {
  const mergedFilters: SearchFilters = { ...extraFilters };
  if (parsed.namedFilters.type) mergedFilters.type = parsed.namedFilters.type;
  if (parsed.namedFilters.provider) mergedFilters.provider = parsed.namedFilters.provider;
  if (parsed.namedFilters.domain) mergedFilters.domain = parsed.namedFilters.domain;
  if (parsed.namedFilters.favorite) mergedFilters.favorite = parsed.namedFilters.favorite;
  if (parsed.tagFilter) mergedFilters.tag = parsed.tagFilter;

  const filtered = Object.keys(mergedFilters).length > 0
    ? applyFilters(items, mergedFilters)
    : items;

  return rankItems(filtered, parsed);
}
