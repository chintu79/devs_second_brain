export interface SearchFilters {
  type?: string | string[];
  provider?: string | string[];
  domain?: string | string[];
  tag?: string;
  favorite?: boolean;
  collection?: string;
}

export interface ParsedQuery {
  text: string;
  textTokens: string[];
  phrase: string | null;
  tagFilter: string | null;
  namedFilters: SearchFilters;
}

export interface SearchResult {
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
  score: number;
  matchedFields: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
  query: string;
  nextCursor?: string | null;
}
