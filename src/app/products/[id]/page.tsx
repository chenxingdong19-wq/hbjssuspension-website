import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/data";
import { scanProductGallery, readProductInfo } from "@/lib/product-folder";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 600, height: 600 }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  // Auto-scan disk for all images in the product directory
  const diskImages = scanProductGallery(product.categorySlug, product.id);
  if (diskImages.length > 0) {
    product.image = diskImages[0];
    product.gallery = diskImages;
  }

  // Merge info.json from disk (overrides products.json defaults)
  const info = readProductInfo(product.categorySlug, product.id);
  if (info) {
    if (typeof info.oem === "string") product.oem = info.oem;
    if (typeof info.vehicle === "string") product.vehicle = info.vehicle;
    if (typeof info.material === "string") product.material = info.material;
    if (typeof info.surface === "string") product.surface = info.surface;
    if (typeof info.process === "string") product.process = info.process;
    if (typeof info.packaging === "string") product.packaging = info.packaging;
    if (typeof info.description === "string") product.description = info.description;
    if (typeof info.featured === "boolean") product.featured = info.featured;
  }

  return <ProductDetailClient product={product} />;
}