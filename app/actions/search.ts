"use server";

import { searchCompositions } from "@/lib/tft";
import type { SearchResponse } from "@/lib/tft/types";

const MAX_QUERY_LENGTH = 120;

export async function searchCompositionsAction(query: string): Promise<SearchResponse> {
  const safeQuery = typeof query === "string" ? query.slice(0, MAX_QUERY_LENGTH) : "";
  return searchCompositions(safeQuery);
}
