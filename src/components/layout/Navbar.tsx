"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { getCategories, getCompany } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/quality", label: "Quality" },
  { href: "/contact", label: "Contact" },
];

const SCROLL_THRESHOLD = 20;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  // Mobile Products accordion (independent from desktop hover dropdown)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();
  const categories = getCategories();
  const company = getCompany();
  const lastScrollY = useRef(0);
  const isAnimating = useRef(false);
  // Live ref of mobileOpen so the scroll handler can read it without stale closure
  const mobileOpenRef = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Show all categories defined in categories.json — empty placeholder
  // categories (e.g. front-subframe, rear-suspension-parts with no products
  // yet) stay visible on the site as requested by the business.
  const categoriesWithProducts = categories;

  // Keep ref in sync
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  const onScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > SCROLL_THRESHOLD);

    // When the mobile menu is open, never hide the header/menu via scroll
    if (mobileOpenRef.current) {
      setHidden(false);
      lastScrollY.current = currentY;
      return;
    }

    if (currentY <= SCROLL_THRESHOLD) {
      setHidden(false);
      lastScrollY.current = currentY;
      return;
    }

    if (isAnimating.current) return;

    const delta = currentY - lastScrollY.current;
    if (delta > 10) {
      setHidden(true);
    } else if (delta < -5) {
      setHidden(false);
    }

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    isAnimating.current = true;
    const timer = setTimeout(() => {
      isAnimating.current = false;
    }, 350);
    return () => clearTimeout(timer);
  }, [hidden]);

  // Click outside closes the mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [mobileOpen]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{
        y: hidden ? -80 : 0,
        opacity: hidden ? 0 : scrolled ? 0.92 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        scrolled ? "navbar-scrolled border-b border-black/[0.06] shadow-sm" : "bg-transparent"
      }`}
      style={{
        backdropFilter: hidden ? "blur(0px)" : scrolled ? "blur(40px) saturate(2) brightness(1.08)" : "none",
        WebkitBackdropFilter: hidden ? "blur(0px)" : scrolled ? "blur(40px) saturate(2) brightness(1.08)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center group flex-shrink-0">
            <img
              src="/assets/brand/logo.png"
              alt={`${company.brand} Logo`}
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.label === "Products" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-md flex items-center gap-1 ${
                      pathname === link.href || pathname.startsWith("/products")
                        ? "text-accent"
                        : "text-[#475569] hover:text-[#0F172A]"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} />
                  </Link>
                  {productsOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 dropdown-menu py-2">
                      <Link
                        href="/products"
                        className="block px-4 py-2.5 text-sm text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.03] transition-colors"
                      >
                        All Products
                      </Link>
                      {categoriesWithProducts.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.slug}`}
                          className="block px-4 py-2.5 text-sm text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.03] transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/contact"
              className="ml-4 px-5 py-2.5 bg-accent text-white text-sm font-medium btn-primary shadow-lg shadow-red-200"
            >
              Request Quote
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-[#475569] hover:text-[#0F172A] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — full-viewport, blocks all Hero/page content underneath */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Solid backdrop — covers the entire viewport below the header bar */}
            <motion.div
              key="mobile-overlay-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 top-16 z-40"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(238,242,246,0.97) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            />

            {/* Menu items panel — slides down from the header */}
            <motion.div
              key="mobile-overlay-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-6 space-y-1">
                {navLinks.map((link) =>
                  link.label === "Products" ? (
                    <div key={link.href}>
                      <button
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-base font-medium transition-colors rounded-xl ${
                          pathname === "/products" || pathname.startsWith("/products")
                            ? "text-accent bg-red-50/80"
                            : "text-[#0F172A] hover:bg-black/[0.04]"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {mobileProductsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pb-2 space-y-0.5"
                        >
                          <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="block pl-10 pr-4 py-2.5 text-sm font-medium text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.04] transition-colors rounded-xl"
                          >
                            All Products
                          </Link>
                          {categoriesWithProducts.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="block pl-10 pr-4 py-2.5 text-sm text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.04] transition-colors rounded-xl"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3.5 text-base font-medium transition-colors rounded-xl ${
                        pathname === link.href || (link.href === "/products" && pathname.startsWith("/products"))
                          ? "text-accent bg-red-50/80"
                          : "text-[#0F172A] hover:bg-black/[0.04]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block mx-4 mt-6 px-5 py-3.5 bg-accent text-white text-center text-sm font-semibold btn-primary rounded-2xl"
                >
                  Request Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}