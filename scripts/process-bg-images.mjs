import sharp from "sharp";
import { readdir, rm, mkdir, copyFile, stat } from "fs/promises";
import { join, basename } from "path";
import { existsSync } from "fs";

const ASSETS_DIR = join(process.cwd(), "tft_assets");
const OUTPUT_DIR = join(process.cwd(), "public", "images", "bg");
const MANIFEST_PATH = join(OUTPUT_DIR, "manifest.json");

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 65;
const BLUR_SIGMA = 0.5;

async function processBgImages() {
  if (!existsSync(ASSETS_DIR)) {
    console.log(`Assets directory not found: ${ASSETS_DIR} — skipping image processing.`);
    return;
  }

  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(ASSETS_DIR);
  const imageFiles = files.filter((f) =>
    /\.(png|jpg|jpeg|webp|avif)$/i.test(f)
  );

  if (imageFiles.length === 0) {
    console.log("No image files found in assets directory — skipping.");
    return;
  }

  const manifest = [];
  let totalInput = 0;
  let totalOutput = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const inputFile = join(ASSETS_DIR, imageFiles[i]);
    const outputFile = join(OUTPUT_DIR, `${i + 1}.webp`);
    const inputSize = (await stat(inputFile)).size;
    totalInput += inputSize;

    await sharp(inputFile)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .grayscale()
      .blur(BLUR_SIGMA)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputFile);

    const outputSize = (await stat(outputFile)).size;
    totalOutput += outputSize;

    manifest.push(`${i + 1}.webp`);

    const reduction = (
      ((inputSize - outputSize) / inputSize) *
      100
    ).toFixed(1);
    console.log(
      `  ${imageFiles[i]} → ${i + 1}.webp  ` +
        `(${(inputSize / 1024 / 1024).toFixed(1)}MB → ${(outputSize / 1024).toFixed(0)}KB, -${reduction}%)`
    );
  }

  const { writeFileSync } = await import("fs");
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log("\n--- Summary ---");
  console.log(
    `Images: ${imageFiles.length} | ` +
      `Total input: ${(totalInput / 1024 / 1024).toFixed(1)}MB | ` +
      `Total output: ${(totalOutput / 1024 / 1024).toFixed(1)}MB | ` +
      `Reduction: ${((1 - totalOutput / totalInput) * 100).toFixed(1)}%`
  );
  console.log(`Manifest written to: ${MANIFEST_PATH}`);
}

processBgImages().catch((err) => {
  console.error(err);
  process.exit(1);
});