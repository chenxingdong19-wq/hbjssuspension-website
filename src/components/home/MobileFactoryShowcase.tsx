"use client";

// Mobile-only factory capability strip.
// - Native touch/pane drag scrolling (handled by the browser, no heavy JS)
// - Auto marquee (CSS translateX) when idle
// - Interaction pauses auto-motion via .is-interacting class
const SLIDES = [
  { img: "/assets/mobile-showcase/01.webp", title: "Modern Manufacturing Facility", desc: "Advanced production capability" },
  { img: "/assets/mobile-showcase/02.webp", title: "Automated Production Lines", desc: "High-volume precision stamping" },
  { img: "/assets/mobile-showcase/03.webp", title: "Rigorous Quality Inspection", desc: "Multi-stage QC before shipment" },
  { img: "/assets/mobile-showcase/04.webp", title: "Robotic Welding", desc: "Consistent precision joints" },
  { img: "/assets/mobile-showcase/05.webp", title: "Global Shipment", desc: "Export-grade packaging worldwide" },
  { img: "", title: "Facility Overview", desc: "Reserved - drop your photo here" },
  { img: "", title: "Precision Machining", desc: "Reserved - drop your photo here" },
  { img: "", title: "Assembly Line", desc: "Reserved - drop your photo here" },
  { img: "", title: "Testing Lab", desc: "Reserved - drop your photo here" },
  { img: "", title: "Logistics Center", desc: "Reserved - drop your photo here" },
];

export default function MobileFactoryShowcase() {
  return (
    <section className="md:hidden py-10 border-t border-gray-200" aria-label="Factory Capabilities">
      <div className="mb-6 px-4">
        <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Factory Capability</span>
        <h2 className="text-xl font-bold text-[#0F172A] mt-2">Manufacturing Excellence</h2>
      </div>

      <div
        className="overflow-hidden select-none factory-touch-zone"
        onTouchStart={(e) => (e.currentTarget as HTMLElement).classList.add("is-interacting")}
        onTouchEnd={(e) => (e.currentTarget as HTMLElement).classList.remove("is-interacting")}
        onMouseDown={(e) => (e.currentTarget as HTMLElement).classList.add("is-interacting")}
        onMouseUp={(e) => (e.currentTarget as HTMLElement).classList.remove("is-interacting")}
        onMouseLeave={(e) => (e.currentTarget as HTMLElement).classList.remove("is-interacting")}
      >
        <div className="factory-marquee-track flex gap-4 w-max overflow-x-auto">
          {[...SLIDES, ...SLIDES].map((s, i) => (
            <div key={i} className="w-[210px] shrink-0 glass-card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-[#F0F3F8] relative">
                {s.img ? (
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#CBD5E1] text-[#94A3B8]">
                    <span className="text-[11px] text-center px-3 leading-snug">
                      Reserved slot<br />drop your photo
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-1 line-clamp-1">{s.title}</h3>
                <p className="text-xs text-[#64748B] line-clamp-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}