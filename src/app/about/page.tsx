import type { Metadata } from "next";
import CompanyIntro from "./CompanyIntro";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Hebei Jingshun Auto Parts: 12+ years manufacturing automotive suspension parts with OEM/ODM for global importers & distributors.",
};

export default function AboutPage() {
  return <CompanyIntro />;
}
