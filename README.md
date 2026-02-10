# TFT Aggregator

TFT compositions aggregator that indexes multiple public sitemap sources, normalizes tags automatically, and provides fast search in Spanish and English.

Languages: [English](./README.md) | [Espanol](./README.es.md)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open in your browser:
- `http://localhost:3000/es` (Spanish)
- `http://localhost:3000/en` (English)

## Features

- Indexes TFT compositions from multiple external sources.
- Extracts metadata from URLs (set, name, tags).
- Generates search suggestions based on tag frequency.
- Ranks results by exact/partial matches and newest set.
- Supports i18n (`es` / `en`) and light/dark theme.

## Indexed Sources

- TFT Academy: `https://tftacademy.com/sitemap.xml`
- TFT Flow: `https://tftflow.com/sitemap.xml`
- AKAWonder: `https://compos.akawonder.com/sitemap.xml`

Note: `AKAWonder` results are excluded on `/en` by locale configuration.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Scripts

```bash
npm run dev     # local development
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
```

## Environment Variables

For canonical URLs and SEO metadata, the project uses this priority:

1. `NEXT_PUBLIC_SITE_URL`
2. `SITE_URL`
3. `VERCEL_PROJECT_PRODUCTION_URL`
4. `VERCEL_URL`
5. fallback: `http://localhost:3000`

Example:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Architecture (Summary)

- `app/es/page.tsx` and `app/en/page.tsx`: locale pages with metadata and initial data load.
- `app/components/tft-search.tsx`: search UI with debounce and reactive updates.
- `app/actions/search.ts`: safe server action for queries.
- `lib/tft/index.ts`: indexing, sitemap parsing, scoring, and suggestions.
- `lib/i18n.ts`: locale copy and locale validation.
- `app/robots.ts` and `app/sitemap.ts`: base technical SEO.

## Cache and Revalidation

- The aggregated index is cached with `unstable_cache`.
- Revalidation runs every 30 minutes (`1800s`).

## Operational Notes

- If an external source fails or changes its URL structure, that source may temporarily return 0 results.
- The app stays resilient by returning empty lists when a source is unavailable.

## Deployment

Compatible with Vercel or any Node.js platform that supports Next.js.

```bash
npm run build
npm run start
```

