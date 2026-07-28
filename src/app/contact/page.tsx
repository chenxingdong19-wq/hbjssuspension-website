import type { Metadata } from "next";
import ContactSection from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Hebei Jingshun Auto Parts Co., Ltd. for product inquiries, pricing, and technical specifications. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <div>
      <ContactSection />
    </div>
  );
}
