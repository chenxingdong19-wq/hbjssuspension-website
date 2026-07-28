import type { Metadata } from "next";
import CompanyIntro from "./CompanyIntro";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Hebei Jingshun Auto Parts Co., Ltd. - a professional automotive suspension manufacturer with 12+ years of experience serving global markets.",
};

export default function AboutPage() {
  return <CompanyIntro />;
}
