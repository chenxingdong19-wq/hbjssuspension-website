"use client";

import { getCompany } from "@/lib/data";

export default function WhatsAppFloat() {
  const company = getCompany();
  const number = company.social.whatsapp.replace(/\D/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 glass-card hover:shadow-lg hover:border-green-200 transition-all duration-400 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center group-hover:bg-green-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M9.5 13.5c.5 1 1.5 2 2.5 2s2-1 2.5-2" />
          </svg>
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white animate-pulse" />
      </div>
      <div className="hidden md:block">
        <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none">Quick Connect</div>
        <div className="text-xs font-medium text-[#475569] leading-tight mt-1 group-hover:text-green-600 transition-colors">WhatsApp</div>
      </div>
    </a>
  );
}