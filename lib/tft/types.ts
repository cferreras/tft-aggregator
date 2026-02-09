export interface SitemapSource {
  id: string;
  label: string;
  sitemapUrl: string;
}

export interface IndexedComposition {
  url: string;
  sourceId: string;
  sourceLabel: string;
  set?: number;
  name: string;
  tags: string[];
}

export interface CompositionIndex {
  compositions: IndexedComposition[];
  tags: Array<{
    tag: string;
    count: number;
  }>;
  updatedAt: string;
}

export interface SearchResult {
  url: string;
  sourceLabel: string;
  sourceId: string;
  name: string;
  setLabel: string | null;
  tags: string[];
}

export interface SearchResponse {
  query: string;
  suggestions: string[];
  results: SearchResult[];
  total: number;
  updatedAt: string;
}
