import { HomeShell } from "@/app/components/home-shell";
import { searchCompositions } from "@/lib/tft";

export const revalidate = 1800;

export default async function SpanishHomePage() {
  const initialData = await searchCompositions("", "es");
  return <HomeShell locale="es" initialData={initialData} />;
}
