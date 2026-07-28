import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-text-secondary">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
