"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Stamp, Cog, ScanEye, Package } from "lucide-react";

const capabilities = [
  { title: "Laser Cutting", description: "High-precision laser cutting for complex geometries with tight tolerances.", image: "/assets/factory/01.webp", icon: Zap },
  { title: "Stamping", description: "Automated stamping lines for high-volume production with consistent quality.", image: "/assets/factory/02.webp", icon: Stamp },
  { title: "Robotic Welding", description: "Advanced robotic welding systems ensuring precision and repeatability.", image: "/assets/factory/003.webp", icon: Cog },
  { title: "Quality Inspection", description: "Multi-stage quality control from incoming materials to final shipment.", image: "/assets/factory/004.webp", icon: ScanEye },
  { title: "Packaging", description: "Professional export packaging designed for safe international shipping.", image: "/assets/factory/005.webp", icon: Package },
];

export default function ManufacturingPreview() {
  return (
    <section className="py-20 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Manufacturing Excellence</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-3 mb-4">Advanced Production Capability</h2>
          <p className="text-[#64748B] max-w-2xl mx-auto">From raw material to finished product, every step is controlled with precision engineering and rigorous quality standards.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div key={cap.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-card glass-card-hover overflow-hidden group">
                <div className="aspect-[4/3] relative overflow-hidden bg-[#F0F3F8]">
                  <img src={cap.image} alt={cap.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="w-8 h-8 rounded-md bg-red-50 border border-red-100 flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{cap.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{cap.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <Link href="/manufacturing" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors group">
            View Manufacturing Facility <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}