"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";

export default function ProductShowcase() {
  const products = getFeaturedProducts();

  return (
    <section className="py-20 border-t border-gray-200 section-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Product Range
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-3 mb-4">
            Featured Products
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            Explore our precision-engineered suspension components. All products
            meet or exceed OEM specifications for quality and durability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors group"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}