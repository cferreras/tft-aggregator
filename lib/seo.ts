const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    return FALLBACK_SITE_URL;
  }

  const normalized = trimmed.startsWith("http")
    ? trimmed
    : `https://${trimmed}`;

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;
  return normalizeSiteUrl(envUrl ?? FALLBACK_SITE_URL);
}

export function withSiteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
