"use client";

// Mobile-only (≤768px) factory capability marquee.
// Pure CSS translateX infinite loop — no Framer Motion, no JS animation, no deps.
// Images are WebP + lazy. Desktop never renders this section.

const ITEMS = [
  { img: "/assets/factory/01.webp", title: "Modern Manufacturing Facility", desc: "Advanced production capability" },
  { img: "/assets/factory/02.webp", title: "Automated Production Lines", desc: "High-volume precision stamping" },
  { img: "/assets/factory/004.webp", title: "Rigorous Quality Inspection", desc: "Multi-stage QC before shipment" },
  { img: "/assets/factory/003.webp", title: "Robotic Welding", desc: "Consistent precision joints" },
  { img: "/assets/factory/005.webp", title: "Global Shipment", desc: "Export-grade packaging worldwide" },
];

export default function MobileFactoryShowcase() {
  return (
    <section className="md:hidden py-10 border-t border-gray-200" aria-label="Factory Capabilities">
      <div className="mb-6 px-4">
        <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Factory Capability</span>
        <h2 className="text-xl font-bold text-[#0F172A] mt-2">Manufacturing Excellence</h2>
      </div>

      <div className="overflow-hidden">
        <div className="factory-marquee-track flex gap-4 w-max">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <div
              key={i}
              className="w-[210px] shrink-0 glass-card overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F0F3F8]">
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-[#64748B] line-clamp-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}