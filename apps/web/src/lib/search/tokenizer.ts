import type { ParsedQuery, SearchFilters } from "./types";

const NAMED_FILTER_RE = /(\w+):(\S+)/gi;
const PHRASE_RE = /"([^"]+)"/g;
const TAG_RE = /#(\S+)/g;

export function parseQuery(raw: string): ParsedQuery {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (normalized.length < 2) {
    return { text: "", textTokens: [], phrase: null, tagFilter: null, namedFilters: {} };
  }

  let text = normalized;

  const phrases: string[] = [];
  text = text.replace(PHRASE_RE, (_, p) => { phrases.push(p); return ""; });
  const phrase = phrases.length > 0 ? phrases.join(" ") : null;

  let tagFilter: string | null = null;
  text = text.replace(TAG_RE, (_, t) => { tagFilter = t; return ""; });

  const namedFilters: SearchFilters = {};
  text = text.replace(NAMED_FILTER_RE, (_, key: string, val: string) => {
    const k = key.toLowerCase();
    if (k === "type") namedFilters.type = val;
    else if (k === "provider") namedFilters.provider = val;
    else if (k === "domain") namedFilters.domain = val;
    else if (k === "favorite") namedFilters.favorite = val === "true";
    else if (k === "collection") namedFilters.collection = val;
    return "";
  });

  const textTokens = text.trim() ? text.trim().split(/\s+/) : [];

  return { text: text.trim(), textTokens, phrase, tagFilter, namedFilters };
}


