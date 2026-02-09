import Link from "next/link";
import { TftSearch } from "@/app/components/tft-search";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { getLocaleCopy } from "@/lib/i18n";
import type { AppLocale } from "@/lib/i18n";
import type { SearchResponse } from "@/lib/tft/types";

interface HomeShellProps {
  locale: AppLocale;
  initialData: SearchResponse;
}

export function HomeShell({ locale, initialData }: HomeShellProps) {
  const copy = getLocaleCopy(locale);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--hero-glow),transparent_45%)]" />
      </div>

      <section className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <nav
            className="inline-flex items-center rounded-full border border-edge bg-surface p-1 text-xs font-mono"
            aria-label="Language selector"
          >
            <Link
              href="/es"
              className={`rounded-full px-3 py-1.5 transition ${
                locale === "es" ? "bg-ink text-canvas" : "text-muted hover:text-ink"
              }`}
            >
              ES
            </Link>
            <Link
              href="/en"
              className={`rounded-full px-3 py-1.5 transition ${
                locale === "en" ? "bg-ink text-canvas" : "text-muted hover:text-ink"
              }`}
            >
              EN
            </Link>
          </nav>
          <ThemeToggle
            label={copy.themeLabel}
            lightText={copy.themeLight}
            darkText={copy.themeDark}
          />
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          TFT Aggregator
        </h1>
        <TftSearch initialData={initialData} locale={locale} copy={copy} />
      </section>
    </main>
  );
}
