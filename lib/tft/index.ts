import { unstable_cache } from "next/cache";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import type { AppLocale } from "@/lib/i18n";
import { SITEMAP_SOURCES } from "@/lib/tft/sources";
import type {
  CompositionIndex,
  IndexedComposition,
  SearchResponse,
  SearchResult,
  SitemapSource,
} from "@/lib/tft/types";

const CACHE_REVALIDATE_SECONDS = 60 * 30;
const INDEX_CACHE_VERSION = "v2";
const MAX_RESULTS = 30;
const MAX_SUGGESTIONS = 8;
const MIN_DEFAULT_RESULTS_PER_SOURCE = 5;

function isSourceEnabledForLocale(sourceId: string, locale: AppLocale): boolean {
  if (locale === "en" && sourceId === "akawonder") {
    return false;
  }
  return true;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) {
    return [];
  }
  return normalized.split(" ").filter(Boolean);
}

function decodeXmlText(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractLocUrls(xml: string): string[] {
  const locations: string[] = [];
  const locRegex = /<loc>([\s\S]*?)<\/loc>/gm;

  for (const match of xml.matchAll(locRegex)) {
    const rawUrl = match[1]?.trim();
    if (!rawUrl) {
      continue;
    }
    locations.push(decodeXmlText(rawUrl));
  }

  return locations;
}

function parseTftAcademy(pathname: string): { set: number; name: string; tags: string[] } | null {
  const match = pathname.match(/^\/tierlist\/comps\/set-(\d+)-([^/?#]+)\/?$/i);
  if (!match) {
    return null;
  }

  const set = Number(match[1]);
  if (!Number.isFinite(set)) {
    return null;
  }

  const slug = match[2];
  const readableName = normalizeText(slug);
  const tokens = tokenize(slug);
  const tags = new Set<string>([`set${set}`, readableName, ...tokens]);

  return {
    set,
    name: readableName,
    tags: Array.from(tags).filter(Boolean),
  };
}

function parseTftFlow(pathname: string): { set: number; name: string; tags: string[] } | null {
  const match = pathname.match(/^\/composition\/set(\d+)\/([^/?#]+)\/?$/i);
  if (!match) {
    return null;
  }

  const set = Number(match[1]);
  if (!Number.isFinite(set)) {
    return null;
  }

  const slug = match[2];
  const readableName = normalizeText(slug);
  const tokens = tokenize(slug);
  const tags = new Set<string>([`set${set}`, readableName, ...tokens]);

  return {
    set,
    name: readableName,
    tags: Array.from(tags).filter(Boolean),
  };
}

function parseAkaWonder(pathname: string): { set?: number; name: string; tags: string[] } | null {
  const match = pathname.match(/^\/compositions\/([^/?#]+)\/?$/i);
  if (!match) {
    return null;
  }

  const rawSlug = match[1];
  const slugTag = normalizeText(rawSlug).replace(/\s+/g, "");
  if (!slugTag) {
    return null;
  }

  return {
    set: undefined,
    name: slugTag,
    tags: [slugTag],
  };
}

function parseCompositionFromUrl(
  url: string,
  source: SitemapSource,
): IndexedComposition | null {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  const pathname = parsedUrl.pathname;
  const parsed =
    source.id === "tftacademy"
      ? parseTftAcademy(pathname)
      : source.id === "tftflow"
        ? parseTftFlow(pathname)
        : source.id === "akawonder"
          ? parseAkaWonder(pathname)
        : null;

  if (!parsed) {
    return null;
  }

  return {
    url: parsedUrl.toString(),
    sourceId: source.id,
    sourceLabel: source.label,
    set: parsed.set,
    name: parsed.name,
    tags: parsed.tags,
  };
}

async function fetchSourceCompositions(source: SitemapSource): Promise<IndexedComposition[]> {
  const response = await fetch(source.sitemapUrl, {
    next: {
      revalidate: CACHE_REVALIDATE_SECONDS,
      tags: [`sitemap:${source.id}`],
    },
  });

  if (!response.ok) {
    return [];
  }

  const xml = await response.text();
  const urls = extractLocUrls(xml);

  return urls
    .map((url) => parseCompositionFromUrl(url, source))
    .filter((composition): composition is IndexedComposition => composition !== null);
}

function buildTagFrequency(compositions: IndexedComposition[]): CompositionIndex["tags"] {
  const frequency = new Map<string, number>();

  for (const composition of compositions) {
    for (const tag of composition.tags) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(frequency.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.tag.localeCompare(b.tag);
    });
}

async function createCompositionIndex(): Promise<CompositionIndex> {
  const grouped = await Promise.all(SITEMAP_SOURCES.map((source) => fetchSourceCompositions(source)));
  const uniqueByUrl = new Map<string, IndexedComposition>();

  for (const list of grouped) {
    for (const composition of list) {
      if (!uniqueByUrl.has(composition.url)) {
        uniqueByUrl.set(composition.url, composition);
      }
    }
  }

  const compositions = Array.from(uniqueByUrl.values()).sort((a, b) => {
    if ((b.set ?? 0) !== (a.set ?? 0)) {
      return (b.set ?? 0) - (a.set ?? 0);
    }
    return a.name.localeCompare(b.name);
  });

  return {
    compositions,
    tags: buildTagFrequency(compositions),
    updatedAt: new Date().toISOString(),
  };
}

const getCachedCompositionIndex = unstable_cache(
  async () => createCompositionIndex(),
  [`tft-aggregator:composition-index:${INDEX_CACHE_VERSION}`],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
  },
);

function rankResults(compositions: IndexedComposition[], queryTokens: string[]): SearchResult[] {
  const toSearchResult = (composition: IndexedComposition): SearchResult => ({
    url: composition.url,
    sourceLabel: composition.sourceLabel,
    sourceId: composition.sourceId,
    name: composition.name,
    setLabel: composition.set ? `Set ${composition.set}` : null,
    tags: composition.tags,
  });

  if (queryTokens.length === 0) {
    const groupedBySource = new Map<string, IndexedComposition[]>();
    for (const composition of compositions) {
      const list = groupedBySource.get(composition.sourceId) ?? [];
      list.push(composition);
      groupedBySource.set(composition.sourceId, list);
    }

    const selected: IndexedComposition[] = [];
    const seenUrls = new Set<string>();

    for (const list of groupedBySource.values()) {
      for (const composition of list.slice(0, MIN_DEFAULT_RESULTS_PER_SOURCE)) {
        if (!seenUrls.has(composition.url)) {
          selected.push(composition);
          seenUrls.add(composition.url);
        }
      }
    }

    if (selected.length < MAX_RESULTS) {
      for (const composition of compositions) {
        if (selected.length >= MAX_RESULTS) {
          break;
        }
        if (seenUrls.has(composition.url)) {
          continue;
        }
        selected.push(composition);
        seenUrls.add(composition.url);
      }
    }

    return selected.slice(0, MAX_RESULTS).map(toSearchResult);
  }

  const scored = compositions
    .map((composition) => {
      const exactMatches = queryTokens.filter((token) => composition.tags.includes(token)).length;
      const partialMatches = queryTokens.filter((token) =>
        composition.tags.some((tag) => tag.includes(token)),
      ).length;
      const score = exactMatches * 3 + partialMatches;

      const isMatch = queryTokens.every((token) =>
        composition.tags.some((tag) => tag.includes(token)),
      );

      return {
        composition,
        isMatch,
        score,
      };
    })
    .filter((entry) => entry.isMatch)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if ((b.composition.set ?? 0) !== (a.composition.set ?? 0)) {
        return (b.composition.set ?? 0) - (a.composition.set ?? 0);
      }
      return a.composition.name.localeCompare(b.composition.name);
    })
    .slice(0, MAX_RESULTS)
    .map((entry) => entry.composition);

  return scored.map(toSearchResult);
}

function buildSuggestions(
  allTags: CompositionIndex["tags"],
  normalizedQuery: string,
): string[] {
  if (!normalizedQuery) {
    return allTags.slice(0, MAX_SUGGESTIONS).map((item) => item.tag);
  }

  const segments = normalizedQuery.split(",");
  const activeSegment = normalizeText(segments[segments.length - 1] ?? "");
  if (!activeSegment) {
    return allTags.slice(0, MAX_SUGGESTIONS).map((item) => item.tag);
  }

  return allTags
    .filter((item) => item.tag.includes(activeSegment))
    .sort((a, b) => {
      const aStarts = a.tag.startsWith(activeSegment);
      const bStarts = b.tag.startsWith(activeSegment);
      if (aStarts !== bStarts) {
        return aStarts ? -1 : 1;
      }
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.tag.localeCompare(b.tag);
    })
    .slice(0, MAX_SUGGESTIONS)
    .map((item) => item.tag);
}

function queryToTokens(query: string): string[] {
  return normalizeText(query).split(/[\s,]+/).filter(Boolean);
}

export async function getCompositionIndex(): Promise<CompositionIndex> {
  return getCachedCompositionIndex();
}

export async function searchCompositions(
  query: string,
  locale: AppLocale = DEFAULT_LOCALE,
): Promise<SearchResponse> {
  const index = await getCompositionIndex();
  const normalizedQuery = normalizeText(query);
  const queryTokens = queryToTokens(query);
  const localizedCompositions = index.compositions.filter((composition) =>
    isSourceEnabledForLocale(composition.sourceId, locale),
  );
  const localizedTags = buildTagFrequency(localizedCompositions);
  const results = rankResults(localizedCompositions, queryTokens);
  const suggestions = buildSuggestions(localizedTags, normalizedQuery);

  return {
    query: normalizedQuery,
    suggestions,
    results,
    total: results.length,
    updatedAt: index.updatedAt,
  };
}
