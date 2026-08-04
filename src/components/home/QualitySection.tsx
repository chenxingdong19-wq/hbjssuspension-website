"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Microscope, ClipboardCheck, Award } from "lucide-react";

const qualityItems = [
  { icon: ShieldCheck, title: "Material Verification", description: "All raw materials undergo chemical composition analysis and mechanical property testing before production." },
  { icon: Microscope, title: "In-Process Inspection", description: "Real-time monitoring at every production stage with statistical process control methods." },
  { icon: ClipboardCheck, title: "Final Quality Audit", description: "100% dimensional inspection, surface quality check, and functional testing before shipment." },
  { icon: Award, title: "Certified Standards", description: "ISO 9001:2015 and IATF 16949 certified quality management system." },
];

export default function QualitySection() {
  return (
    <section className="py-20 section-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Quality Assurance</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mt-3 mb-4">Quality is Not Optional</h2>
            <p className="text-[#64748B] leading-relaxed mb-10">Every component leaving our factory has passed rigorous multi-stage quality inspection. We hold ourselves to the highest standards in the automotive industry.</p>
            <div className="space-y-6">
              {qualityItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <Link href="/quality" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors mt-8 group">
              Learn About Our Quality System <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
            <div className="glass-card p-8">
              <div className="aspect-[3/2] bg-white rounded-md flex items-center justify-center mb-6">
                <img src="/assets/certificates/01.jpg" alt="Certified Quality System" className="w-full h-full object-contain p-4" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-[#0F172A]">Certified Quality System</h3>
                <p className="text-sm text-[#64748B] mt-1">Internationally recognized standards</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-red-50 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-blue-50 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}