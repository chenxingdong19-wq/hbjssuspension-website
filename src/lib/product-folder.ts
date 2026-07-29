import fs from "fs";
import path from "path";

/**
 * Scan product directory for all image files.
 */
export function scanProductGallery(categorySlug: string, productId: string): string[] {
  const dirPath = path.join(process.cwd(), "public/assets/products", categorySlug, productId);
  try {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => /\.(webp|png|jpg|jpeg|svg)$/i.test(f))
      .sort();
    return files.map((f) => `/assets/products/${categorySlug}/${productId}/${f}`);
  } catch {
    return [];
  }
}

/**
 * Read product info.json from disk.
 */
export function readProductInfo(categorySlug: string, productId: string): Record<string, unknown> | null {
  const infoPath = path.join(process.cwd(), "public/assets/products", categorySlug, productId, "info.json");
  try {
    if (!fs.existsSync(infoPath)) return null;
    const raw = fs.readFileSync(infoPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}