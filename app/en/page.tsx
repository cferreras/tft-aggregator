import { HomeShell } from "@/app/components/home-shell";
import { searchCompositions } from "@/lib/tft";

export const revalidate = 1800;

export default async function EnglishHomePage() {
  const initialData = await searchCompositions("", "en");
  return <HomeShell locale="en" initialData={initialData} />;
}
