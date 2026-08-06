import { Suspense } from "react";
import { getProducts } from "@/lib/data";
import ProductsContent from "./ProductsContent";

// Always render fresh — prevents stale cached HTML from appearing after updates.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // data/products.json is the single source of truth for all product display
  // fields (id, name, OEM, vehicle, description, category, order, etc.).
  // info.json is NOT merged here — it only provides image/gallery paths on
  // disk via product-folder scanning. This guarantees server render and
  // client hydration use exactly the same data (no hydration mismatch).
  const products = getProducts();

  return (
    <Suspense fallback={<div className="pt-28 text-center text-text-secondary">Loading products...</div>}>
      <ProductsContent products={products} />
    </Suspense>
  );
}