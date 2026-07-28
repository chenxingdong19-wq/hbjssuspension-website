"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Send, Package, Cog, SprayCan, Wrench } from "lucide-react";
import type { Product } from "@/lib/data";
import ProductGallery from "@/components/products/ProductGallery";
import InquiryForm from "@/components/ui/InquiryForm";

const specs = [
  { key: "material", label: "Material", icon: Cog },
  { key: "surface", label: "Surface Treatment", icon: SprayCan },
  { key: "process", label: "Manufacturing Process", icon: Wrench },
  { key: "packaging", label: "Packaging", icon: Package },
];

export default function ProductDetailClient({ product }: { product: Product }) {
  return (
    <div className="pt-28 pb-20 bg-ambient" style={{ minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1, position: "relative" }}>
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent transition-colors">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <ProductGallery images={product.gallery} name={product.name} />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-red-50 text-accent border border-red-100">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-4 mb-2">{product.name}</h1>
              {product.oem && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">OEM:</span>
                  <code className="text-sm font-mono text-accent bg-red-50 px-2 py-0.5 rounded">
                    {product.oem}
                  </code>
                </div>
              )}
            </div>

            {/* Vehicle + OEM */}
            <div className="glass-card p-5">
              <div className="space-y-4">
                {product.oem && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">OEM Number</h3>
                    <p className="text-sm font-mono text-accent">{product.oem}</p>
                  </div>
                )}
                {product.vehicle && (
                  <div>
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Vehicle Compatibility</h3>
                    <p className="text-sm text-[#0F172A]">{product.vehicle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specs */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {specs.map((spec) => {
                  const val = product[spec.key as keyof Product] as string;
                  if (!val) return null;
                  const Icon = spec.icon;
                  return (
                    <div key={spec.key} className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={14} className="text-accent" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{spec.label}</span>
                      </div>
                      <p className="text-xs text-[#0F172A] leading-relaxed">{val}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <a
                href="#inquiry-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white text-sm font-semibold btn-primary shadow-lg shadow-red-200"
              >
                <Send size={15} /> Inquire About This Product
              </a>
              <p className="text-[11px] text-slate-400 text-center">Our team typically responds within 24 hours</p>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              {["ISO 9001:2015", "IATF 16949", "Global Shipping"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check size={12} className="text-green-500" />
                  <span className="text-[10px] text-slate-400 font-medium">{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form" className="mt-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Request a Quote</h2>
            <p className="text-sm text-slate-500">Fill out the form below and our team will get back to you within 24 hours.</p>
          </motion.div>
          <InquiryForm defaultProduct={product.name} />
        </div>
      </div>
    </div>
  );
}