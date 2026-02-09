export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas text-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(17,17,17,0.06),transparent_45%)]" />
      </div>

      <section className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-20 sm:px-10">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          TFT Aggregator
        </h1>

        <div className="mt-8">
          <label htmlFor="tft-search" className="sr-only">
            Buscar composiciones de TFT
          </label>
          <input
            id="tft-search"
            type="text"
            placeholder="Ej: reroll, level 8, vertical, bruiser"
            className="h-12 w-full rounded-xl border border-edge bg-surface px-4 font-mono text-sm text-ink shadow-[0_1px_0_0_rgba(17,17,17,0.06)] outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10 sm:h-14 sm:text-base"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Busca composiciones de TFT de m&uacute;ltiples fuentes a trav&eacute;s de
          tags generados autom&aacute;ticamente
        </p>
      </section>
    </main>
  );
}
