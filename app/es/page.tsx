import type { Metadata } from "next";
import { HomeShell } from "@/app/components/home-shell";
import { searchCompositions } from "@/lib/tft";
import { withSiteUrl } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Composiciones TFT en Espanol",
  description:
    "Busca composiciones de Teamfight Tactics en espanol, filtradas por tags y fuentes actualizadas automaticamente.",
  alternates: {
    canonical: withSiteUrl("/es"),
    languages: {
      es: withSiteUrl("/es"),
      en: withSiteUrl("/en"),
      "x-default": withSiteUrl("/es"),
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: withSiteUrl("/es"),
    title: "TFT Aggregator - Composiciones en Espanol",
    description:
      "Busca composiciones de Teamfight Tactics en espanol, filtradas por tags y fuentes actualizadas automaticamente.",
  },
};

export default async function SpanishHomePage() {
  const initialData = await searchCompositions("", "es");
  return <HomeShell locale="es" initialData={initialData} />;
}
