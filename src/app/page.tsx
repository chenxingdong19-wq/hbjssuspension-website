import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import ManufacturingPreview from "@/components/home/ManufacturingPreview";
import ProductShowcase from "@/components/home/ProductShowcase";
import QualitySection from "@/components/home/QualitySection";
import GlobalPresence from "@/components/home/GlobalPresence";
import ContactSection from "@/components/home/ContactSection";

// Mobile-only second-screen 3D showcase. Kept as a separate chunk via next/dynamic
// so three.js never joins the first-screen bundle. The component internally gates
// canvas mounting on IntersectionObserver + mounted state, so the GLB only loads
// when the showcase scrolls near the viewport on phones.
const MobileProduct3DShowcase = dynamic(
  () => import("@/components/home/MobileProduct3DShowcase")
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <MobileProduct3DShowcase />
      <Stats />
      <ProductShowcase />
      <ManufacturingPreview />
      <QualitySection />
      <GlobalPresence />
      <ContactSection />
    </>
  );
}
