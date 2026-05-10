import { readFileSync } from "fs";
import { join } from "path";

const MANIFEST_PATH = join(
  process.cwd(),
  "public",
  "images",
  "bg",
  "manifest.json"
);

export function getRandomBgImage(): string {
  try {
    const manifest: string[] = JSON.parse(
      readFileSync(MANIFEST_PATH, "utf-8")
    );
    if (manifest.length === 0) return "";
    const index = Math.floor(Math.random() * manifest.length);
    return `/images/bg/${manifest[index]}`;
  } catch {
    return "";
  }
}