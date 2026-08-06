import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ContactFloat from "@/components/ui/ContactFloat";
import TranslateFloat from "@/components/ui/TranslateFloat";
import companyData from "../../data/company.json";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const company = companyData;
const baseUrl = "https://hbjssuspension.com";

export const metadata: Metadata = {
  title: { default: `${company.brand} | Automotive Suspension Components Manufacturer`, template: `%s | ${company.brand}` },
  description: company.description,
  keywords: ["automotive suspension","control arm","ball joint","rubber bushing","chassis parts","auto parts manufacturer",company.name,company.brand,"OEM auto parts","ODM auto parts"],
  authors: [{ name: company.name }], creator: company.name, publisher: company.name,
  metadataBase: new URL(baseUrl), alternates: { canonical: baseUrl },
  openGraph: { type: "website", locale: "en_US", url: baseUrl, siteName: company.brand, title: `${company.brand} | Automotive Suspension Components Manufacturer`, description: company.description, images: [{ url: "/assets/hero/hero.svg", width: 1200, height: 630, alt: `${company.brand} - Automotive Suspension Components` }] },
  twitter: { card: "summary_large_image", title: `${company.brand} | Automotive Suspension Components`, description: company.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <meta name="facebook-domain-verification" content="jo2oj87qfpjj8q7vkxdyrnbe1f9haw" />
        <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context":"https://schema.org","@type":"Organization",name:company.name,alternateName:company.brand,url:baseUrl,description:company.description,address:{"@type":"PostalAddress",addressLocality:`${company.contact.address.county}, ${company.contact.address.city}`,addressRegion:company.contact.address.province,addressCountry:"CN"},contactPoint:{"@type":"ContactPoint",telephone:company.contact.phones[0],contactType:"sales",email:company.contact.email},sameAs:[] }) }} />
      </head>
      <body className="min-h-full flex flex-col bg-ambient text-[#0F172A] antialiased">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <TranslateFloat />
        <ContactFloat />

        {/* Tawk.to — live chat, hidden default bubble (custom button opens it) */}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/6a6d5ae003ca471d44326847/1jutim02m';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
        <Script id="tawk-hide-widget" strategy="lazyOnload">
          {`
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_API.onLoad = function () {
              if (window.Tawk_API.hideWidget) {
                window.Tawk_API.hideWidget();
              }
            };
          `}
        </Script>
      </body>
    </html>
  );
}