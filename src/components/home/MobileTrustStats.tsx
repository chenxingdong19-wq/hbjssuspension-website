"use client";

import { getCompany } from "@/lib/data";

// Mobile-only trust stats strip. Pure static — no animation.
export default function MobileTrustStats() {
  const company = getCompany();
  const stats = company.statistics;

  return (
    <section className="md:hidden px-4 pb-10" aria-label="Company Statistics">
      <div className="glass-card p-5">
        <div className="grid grid-cols-4 gap-2 text-center">
          {stats.slice(0, 4).map((s) => (
            <div key={s.label}>
              <div className="text-base sm:text-lg font-bold text-[#0F172A]">{s.value}</div>
              <div className="text-[10px] leading-tight text-[#64748B] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
