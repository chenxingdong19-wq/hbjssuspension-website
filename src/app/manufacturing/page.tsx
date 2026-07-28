"use client";

import { motion } from "framer-motion";
import { Zap, Stamp, Cog, ScanEye, Package, ShieldCheck, Truck, Wrench } from "lucide-react";

const capabilities = [
  {
    icon: Zap,
    title: "Laser Cutting",
    description:
      "High-precision CNC laser cutting systems capable of processing complex geometries with tolerances within 0.1mm. Suitable for steel, aluminum, and alloy materials up to 25mm thickness.",
    image: "/assets/factory/01.webp",
  },
  {
    icon: Stamp,
    title: "Stamping & Forging",
    description:
      "Automated hydraulic and mechanical stamping lines with capacities from 100 to 800 tons. Hot and cold forging capabilities for high-strength suspension components.",
    image: "/assets/factory/02.webp",
  },
  {
    icon: Cog,
    title: "Robotic Welding",
    description:
      "Six-axis industrial welding robots with real-time parameter monitoring. MIG/MAG and spot welding capabilities for consistent, high-quality joints on every component.",
    image: "/assets/factory/003.webp",
  },
  {
    icon: ScanEye,
    title: "Quality Inspection",
    description:
      "Comprehensive testing laboratory with CMM (Coordinate Measuring Machine), hardness testers, tensile strength analyzers, and salt spray corrosion testing chambers.",
    image: "/assets/factory/004.webp",
  },
  {
    icon: Package,
    title: "Packaging & Logistics",
    description:
      "Professional export-grade packaging with custom foam inserts, anti-rust treatment, and reinforced cartons. Container loading optimization for cost-effective international shipping.",
    image: "/assets/factory/005.webp",
  },
];

const highlights = [
  { icon: Wrench, text: "CNC Machining Centers" },
  { icon: ShieldCheck, text: "ISO 9001:2015 Certified Facility" },
  { icon: Truck, text: "Export to 20+ Countries" },
  { icon: Cog, text: "24/7 Production Capability" },
];

export default function ManufacturingPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Manufacturing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mt-3 mb-4">
            Advanced Production Facility
          </h1>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Our state-of-the-art manufacturing facility combines advanced machinery,
            skilled technicians, and rigorous quality systems to produce suspension
            components that meet the highest industry standards.
          </p>
        </motion.div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-card"
              >
                <Icon size={14} className="text-accent" />
                <span className="text-xs font-medium text-text-secondary">{h.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Capabilities */}
        <div className="space-y-12">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`grid lg:grid-cols-2 gap-10 items-center ${
                  isEven ? "" : "lg:direction-rtl"
                }`}
              >
                <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                  <div className="aspect-[4/3] glass-card overflow-hidden bg-[#0F172A]">
                    <img
                      src={cap.image}
                      alt={cap.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-3">
                    {cap.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
