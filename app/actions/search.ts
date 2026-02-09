"use server";

import { DEFAULT_LOCALE, isAppLocale } from "@/lib/i18n";
import { searchCompositions } from "@/lib/tft";
import type { SearchResponse } from "@/lib/tft/types";

const MAX_QUERY_LENGTH = 120;

export async function searchCompositionsAction(
  query: string,
  locale: string,
): Promise<SearchResponse> {
  const safeQuery = typeof query === "string" ? query.slice(0, MAX_QUERY_LENGTH) : "";
  const safeLocale = isAppLocale(locale) ? locale : DEFAULT_LOCALE;
  return searchCompositions(safeQuery, safeLocale);
}
