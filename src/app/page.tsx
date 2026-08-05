import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import ManufacturingPreview from "@/components/home/ManufacturingPreview";
import ProductShowcase from "@/components/home/ProductShowcase";
import QualitySection from "@/components/home/QualitySection";
import GlobalPresence from "@/components/home/GlobalPresence";
import ContactSection from "@/components/home/ContactSection";

// Mobile-only second-screen 3D showcase — loaded as a separate chunk so
// three.js never joins the first-screen bundle. The component internally
// gates canvas mounting on IntersectionObserver, so the GLB only loads
// when the section scrolls near the viewport on phones.
const Product3DViewer = dynamic(
  () => import("@/components/home/Product3DViewer")
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Product3DViewer />
      <Stats />
      <ProductShowcase />
      <ManufacturingPreview />
      <QualitySection />
      <GlobalPresence />
      <ContactSection />
    </>
  );
}
