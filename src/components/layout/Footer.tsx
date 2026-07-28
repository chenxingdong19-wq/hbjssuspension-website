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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a href={`https://wa.me/${company.social.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#475569] hover:text-accent transition-colors">
                  WhatsApp
                </a>
              </li>
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