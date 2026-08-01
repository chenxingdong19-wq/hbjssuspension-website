import Link from "next/link";
import { getCompany, getCategories } from "@/lib/data";

export default function Footer() {
  const company = getCompany();
  const categories = getCategories();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/brand/logo.png" alt={`${company.brand} Logo`} className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed mb-6">
              Professional manufacturer of automotive suspension components and chassis systems. Serving global importers and distributors since {company.founded}.
            </p>
            <p className="text-xs text-[#94A3B8]">&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Products</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-[#64748B] hover:text-accent transition-colors">All Products</Link></li>
              {categories.map((cat) => (
                <li key={cat.slug}><Link href={`/products?category=${cat.slug}`} className="text-sm text-[#64748B] hover:text-accent transition-colors">{cat.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-[#64748B] hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/manufacturing" className="text-sm text-[#64748B] hover:text-accent transition-colors">Manufacturing</Link></li>
              <li><Link href="/quality" className="text-sm text-[#64748B] hover:text-accent transition-colors">Quality Control</Link></li>
              <li><Link href="/contact" className="text-sm text-[#64748B] hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Connect — Facebook, WhatsApp, Email from company.json */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                </svg>
                <span className="text-sm text-[#475569]">{company.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-[#94A3B8]">{company.name} &mdash; {company.nameZh}</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}