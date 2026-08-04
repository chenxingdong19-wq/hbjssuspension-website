import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import ManufacturingPreview from "@/components/home/ManufacturingPreview";
import ProductShowcase from "@/components/home/ProductShowcase";
import QualitySection from "@/components/home/QualitySection";
import GlobalPresence from "@/components/home/GlobalPresence";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ProductShowcase />
      <ManufacturingPreview />
      <QualitySection />
      <GlobalPresence />
      <ContactSection />
    </>
  );
}
