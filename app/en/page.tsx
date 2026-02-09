import type { Metadata } from "next";
import { HomeShell } from "@/app/components/home-shell";
import { searchCompositions } from "@/lib/tft";
import { withSiteUrl } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "TFT Comps in English",
  description:
    "Search Teamfight Tactics comps in English with automatically tagged results gathered from multiple sources.",
  alternates: {
    canonical: withSiteUrl("/en"),
    languages: {
      es: withSiteUrl("/es"),
      en: withSiteUrl("/en"),
      "x-default": withSiteUrl("/es"),
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: withSiteUrl("/en"),
    title: "TFT Aggregator - Comps in English",
    description:
      "Search Teamfight Tactics comps in English with automatically tagged results gathered from multiple sources.",
  },
};

export default async function EnglishHomePage() {
  const initialData = await searchCompositions("", "en");
  return <HomeShell locale="en" initialData={initialData} />;
}
