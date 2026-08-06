import { Suspense } from "react";
import { getProducts } from "@/lib/data";
import { readProductInfo } from "@/lib/product-folder";
import ProductsContent from "./ProductsContent";

// Always render fresh — prevents stale cached HTML from appearing after updates.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = getProducts();

  // Enrich each product with info.json from disk (single source of truth)
  const enriched = products.map((p) => {
    const info = readProductInfo(p.categorySlug, p.id);
    if (!info) return p;
    return {
      ...p,
      name: typeof info.name === "string" && info.name ? info.name : p.name,
      displayName:
        typeof info.displayName === "string" && info.displayName ? info.displayName : p.displayName || p.name,
      oem: typeof info.oem === "string" && info.oem ? info.oem : p.oem,
      vehicle: typeof info.vehicle === "string" && info.vehicle ? info.vehicle : p.vehicle,
      material: typeof info.material === "string" && info.material ? info.material : p.material,
      surface: typeof info.surface === "string" && info.surface ? info.surface : p.surface,
      process: typeof info.process === "string" && info.process ? info.process : p.process,
      packaging: typeof info.packaging === "string" && info.packaging ? info.packaging : p.packaging,
      description: typeof info.description === "string" && info.description ? info.description : p.description,
      featured: typeof info.featured === "boolean" ? info.featured : p.featured,
    };
  });

  return (
    <Suspense fallback={<div className="pt-28 text-center text-text-secondary">Loading products...</div>}>
      <ProductsContent products={enriched} />
    </Suspense>
  );
}