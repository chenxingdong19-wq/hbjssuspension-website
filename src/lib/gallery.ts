import fs from "fs";
import path from "path";

/**
 * Server-only: auto-scan disk for product gallery images.
 * Directory: public/assets/products/{categorySlug}/{productId}/
 * Returns sorted array like: ["/assets/products/control-arms/control-arm-001/01.webp", ...]
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