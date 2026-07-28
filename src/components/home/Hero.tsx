"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import ProductReel from "./ProductReel";
import { getCompany } from "@/lib/data";

export default function Hero() {
  const company = getCompany();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ambient section-hero">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20" style={{ zIndex: 1 }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.15em] text-accent uppercase">
                {company.businessType}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-[-0.02em] leading-[1.06] mb-6 bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent"
            >
              {company.tagline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-xl font-medium antialiased"
            >
              {company.description}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3.5">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white text-sm font-semibold btn-primary shadow-lg shadow-red-200 group"
              >
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[#0F172A] text-sm font-semibold btn-secondary"
              >
                <MessageCircle size={18} />
                Request Quote
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-10 pt-8 border-t border-gray-200">
              {company.statistics.slice(0, 3).map((stat) => (
                <div key={stat.label}>
                  <div className="text-[1.75rem] font-extrabold text-[#0F172A] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-1 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Reel */}
          <ProductReel />
        </div>
      </div>
    </section>
  );
}