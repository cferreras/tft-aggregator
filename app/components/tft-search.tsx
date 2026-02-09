"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { searchCompositionsAction } from "@/app/actions/search";
import type { SearchResponse } from "@/lib/tft/types";

interface TftSearchProps {
  initialData: SearchResponse;
}

const DEBOUNCE_MS = 220;

export function TftSearch({ initialData }: TftSearchProps) {
  const [query, setQuery] = useState(initialData.query);
  const [data, setData] = useState<SearchResponse>(initialData);
  const [isPending, startTransition] = useTransition();
  const requestId = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentRequest = ++requestId.current;

      startTransition(async () => {
        const next = await searchCompositionsAction(query);
        if (requestId.current === currentRequest) {
          setData(next);
        }
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const resultLabel = useMemo(() => {
    if (!query.trim()) {
      return `${data.results.length} composiciones recientes`;
    }
    return `${data.results.length} resultados para "${query.trim()}"`;
  }, [data.results.length, query]);

  return (
    <>
      <div className="mt-8">
        <label htmlFor="tft-search" className="sr-only">
          Buscar composiciones de TFT
        </label>
        <input
          id="tft-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          list="tft-tags"
          placeholder="Ej: set13, reroll, bruiser"
          className="h-12 w-full rounded-xl border border-edge bg-surface px-4 font-mono text-sm text-ink shadow-[0_1px_0_0_rgba(17,17,17,0.06)] outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 sm:h-14 sm:text-base"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-controls="tft-results"
        />
        <datalist id="tft-tags">
          {data.suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Busca composiciones de TFT de m&uacute;ltiples fuentes a trav&eacute;s de tags
        generados autom&aacute;ticamente
      </p>

      <div className="mt-8 flex items-center justify-between gap-3 text-xs text-muted sm:text-sm">
        <span>{resultLabel}</span>
        <span>{isPending ? "Actualizando..." : "Actualizado"}</span>
      </div>

      <ul id="tft-results" className="mt-4 space-y-3">
        {data.results.map((result) => (
          <li key={result.url}>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-edge bg-surface px-4 py-3 transition hover:border-ink"
            >
              <p className="text-sm font-medium text-ink sm:text-base">{result.name}</p>
              <p className="mt-1 text-xs text-muted sm:text-sm">
                {result.sourceLabel}
                {result.setLabel ? ` | ${result.setLabel}` : ""}
              </p>
              <p className="mt-2 line-clamp-2 text-xs font-mono text-muted sm:text-sm">
                {result.tags.join(", ")}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
