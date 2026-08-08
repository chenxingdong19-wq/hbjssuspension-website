"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getCompany } from "@/lib/data";
import { Trophy, Factory, Package, Globe } from "lucide-react";

const icons = [Factory, Trophy, Package, Globe];

function AnimatedCounter({ value }: { value: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(value.replace(/\D/g, "")) || 0;
    const hasPlus = value.includes("+");
    const duration = 1500;
    const steps = 40;
    const increment = numeric / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numeric);
      setDisplay(current + (hasPlus ? "+" : ""));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function Stats() {
  const company = getCompany();
  const isNumeric = (v: string) => /\d/.test(v);

  return (
    <section className="hidden md:block py-20 border-t border-gray-200 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {company.statistics.map((stat, i) => {
            const Icon = icons[i] || Factory;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-accent" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-1">
                  {isNumeric(stat.value) ? (
                    <AnimatedCounter value={stat.value} />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-[#64748B]">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}