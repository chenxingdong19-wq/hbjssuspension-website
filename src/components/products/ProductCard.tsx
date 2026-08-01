"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const spring = { type: "spring", stiffness: 220, damping: 20, mass: 0.9 } as const;

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);

  // 3D tilt on mouse move (subtle)
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current?.style.setProperty("--rx", `${-py * 5}deg`);
    tiltRef.current?.style.setProperty("--ry", `${px * 5}deg`);
  };

  const resetTilt = () => {
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  };

  // Staggered scroll entrance (index-based)
  const entranceDelay = Math.min(index * 0.07, 0.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...spring, delay: entranceDelay }}
    >
      <Link
        ref={cardRef}
        href={`/products/${product.id}`}
        className="group block glass-card glass-card-hover overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <div
          ref={tiltRef}
          className="relative transition-transform duration-300 ease-out"
          style={{ transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))", transformStyle: "preserve-3d" }}
        >
          {/* Image */}
          <div className="aspect-square relative overflow-hidden product-card-shine">
            <SafeImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-8 product-card-image absolute inset-0"
              fallbackClassName="absolute inset-0"
              loading="lazy"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

            {/* Category badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-accent border border-red-100 backdrop-blur-sm">
                {product.category}
              </span>
            </div>

            {/* OEM code badge */}
            {product.oem && (
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/80 text-[#475569] border border-gray-200 backdrop-blur-sm">
                  {product.oem}
                </span>
              </div>
            )}

            {/* Inquire button on hover */}
            <div className="absolute bottom-4 left-4 right-4 z-[3] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="flex items-center justify-center gap-1.5 px-4 py-2 bg-accent/90 text-white text-xs font-semibold rounded-xl backdrop-blur-sm">
                <Send size={12} />
                Inquire
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 pt-4">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-1.5 line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {product.displayName || product.name}
            </h3>
            {product.vehicle && (
              <p className="text-[11px] text-[#64748B] line-clamp-1 mb-4">
                {product.vehicle}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-accent group-hover:gap-2.5 transition-all duration-300">
              View Details
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}