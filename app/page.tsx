import { TftSearch } from "@/app/components/tft-search";
import { searchCompositions } from "@/lib/tft";

export const revalidate = 1800;

export default async function Home() {
  const initialData = await searchCompositions("");

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
        <TftSearch initialData={initialData} />
      </section>
    </main>
  );
}
