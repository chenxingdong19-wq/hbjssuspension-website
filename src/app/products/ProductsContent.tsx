"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsContent() {
  const [search, setSearch] = useState("");
  // "category" filter = top-level: show all subcategories under it
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  // "subcategory" = fine‑grained filter within an already‑selected top‑level cat
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const products = getProducts();
  const categories = getCategories();

  // URL param seeding
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategoryFilter(cat);
  }, [searchParams]);

  // Outside click closes menu
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------- hover‑with‑delay helpers ----------
  const clearTimers = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  const handleMenuEnter = (slug: string) => {
    clearTimers();
    enterTimer.current = setTimeout(() => setOpenMenu(slug), 200);
  };
  const handleMenuLeave = () => {
    clearTimers();
    leaveTimer.current = setTimeout(() => setOpenMenu(null), 800);
  };

  // ---------- filtering ----------
  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      // search
      const m =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.oem.toLowerCase().includes(search.toLowerCase()) ||
        p.vehicle.toLowerCase().includes(search.toLowerCase());
      if (!m) return false;
      // subcategory takes priority (fine filter for subcategories)
      if (subcategoryFilter) return p.subcategorySlug === subcategoryFilter;
      // category filter
      if (categoryFilter) {
        const catObj = categories.find((c) => c.slug === categoryFilter);
        if (!catObj) return false;
        // if category has children, match all products whose subcategory matches one of the children
        if (catObj.children.length > 0) {
          return catObj.children.some((s) => s.slug === p.subcategorySlug);
        }
        // if category has NO children, match by categorySlug directly
        return p.categorySlug === categoryFilter;
      }
      return true; // show all
    });
  }, [search, categoryFilter, subcategoryFilter, products, categories]);

  // ---------- click handlers ----------
  const handleCategoryClick = (slug: string) => {
    // toggle category filter
    if (categoryFilter === slug) {
      setCategoryFilter(null);
      setSubcategoryFilter(null);
    } else {
      setCategoryFilter(slug);
      setSubcategoryFilter(null);
    }
    setOpenMenu(null);
  };

  const handleSubcategoryClick = (slug: string) => {
    if (subcategoryFilter === slug) {
      setSubcategoryFilter(null);
    } else {
      setCategoryFilter(null);
      setSubcategoryFilter(slug);
    }
    setOpenMenu(null);
    setMobileExpanded(null);
  };

  const handleAllClick = () => {
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    setOpenMenu(null);
  };

  const activeCat = categories.find((c) => c.slug === categoryFilter);

  return (
    <div className="pt-28 pb-20 bg-ambient" style={{ minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1, position: "relative" }}>
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Product Catalog</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mt-3 mb-4">Our Products</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto">
            Browse our complete range of automotive suspension components.
            Every product is manufactured to meet or exceed OEM specifications.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name, OEM number, or vehicle…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>
        </div>

        {/* ---- Desktop mega menu (CLICK to expand, hover delay) ---- */}
        <div ref={menuRef} className="hidden lg:block mb-10">
          <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
            {/* All Products */}
            <button
              onClick={handleAllClick}
              className={`px-5 py-3 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[1px] ${
                !categoryFilter && !subcategoryFilter
                  ? "border-accent text-accent"
                  : "border-transparent text-[#475569] hover:text-[#0F172A]"
              }`}
            >
              All Products
            </button>

            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMenuEnter(cat.slug)}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold transition-all duration-300 border-b-2 -mb-[1px] ${
                    openMenu === cat.slug || categoryFilter === cat.slug
                      ? "border-accent text-accent"
                      : "border-transparent text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  {cat.name}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${openMenu === cat.slug ? "rotate-180" : ""}`}
                  />
                </button>

                {openMenu === cat.slug && cat.children.length > 0 && (
                  <div
                    className="absolute top-full left-0 mt-0 min-w-[240px] dropdown-menu py-2 z-50"
                    onMouseEnter={() => handleMenuEnter(cat.slug)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {cat.children.map((sub) => (
                      <button
                        key={sub.slug}
                        onClick={() => handleSubcategoryClick(sub.slug)}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                          subcategoryFilter === sub.slug
                            ? "bg-red-50 text-accent border-l-2 border-accent"
                            : "text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.03] border-l-2 border-transparent"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active filter badge */}
          {(categoryFilter || subcategoryFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-[#64748B]">Active filter:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 filter-badge text-xs font-medium text-accent">
                {subcategoryFilter
                  ? categories.flatMap((c) => c.children).find((s) => s.slug === subcategoryFilter)?.name
                  : activeCat?.name}
                <button onClick={handleAllClick} className="hover:text-accent-hover transition-colors">
                  <X size={12} />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ---- Mobile accordion ---- */}
        <div className="lg:hidden mb-10">
          {categories.map((cat) => (
            <div key={cat.slug} className="border-b border-gray-200">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition-colors ${
                  categoryFilter === cat.slug ? "text-accent" : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {cat.name}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileExpanded === cat.slug ? "rotate-180" : ""}`}
                />
              </button>
              {mobileExpanded === cat.slug && cat.children.length > 0 && (
                <div className="pb-2 space-y-0.5">
                  <button
                    onClick={() => { handleCategoryClick(cat.slug); setMobileExpanded(null); }}
                    className={`w-full text-left px-8 py-2.5 text-sm font-semibold transition-colors ${
                      categoryFilter === cat.slug && !subcategoryFilter
                        ? "bg-red-50 text-accent"
                        : "text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.03]"
                    }`}
                  >
                    All {cat.name}
                  </button>
                  {cat.children.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => handleSubcategoryClick(sub.slug)}
                      className={`w-full text-left px-8 py-2.5 text-sm transition-colors ${
                        subcategoryFilter === sub.slug
                          ? "bg-red-50 text-accent border-l-2 border-accent"
                          : "text-[#475569] hover:text-[#0F172A] hover:bg-black/[0.03] border-l-2 border-transparent"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#64748B]">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}