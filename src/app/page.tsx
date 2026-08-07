import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

// 非首屏组件一律拆分独立 chunk，避免阻塞首页渲染与 LCP
const Product3DViewer = dynamic(() => import("@/components/home/Product3DViewer"));
const Stats = dynamic(() => import("@/components/home/Stats"));
const ProductShowcase = dynamic(() => import("@/components/home/ProductShowcase"));
const ManufacturingPreview = dynamic(() => import("@/components/home/ManufacturingPreview"));
const QualitySection = dynamic(() => import("@/components/home/QualitySection"));
const GlobalPresence = dynamic(() => import("@/components/home/GlobalPresence"));
const ContactSection = dynamic(() => import("@/components/home/ContactSection"));

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
