import companyData from "../../data/company.json";
import productsData from "../../data/products.json";
import categoriesData from "../../data/categories.json";
import certificationsData from "../../data/certifications.json";

export interface Company {
  name: string;
  nameZh: string;
  brand: string;
  tagline: string;
  description: string;
  founded: number;
  website: string;
  industry: string;
  businessType: string;
  targetCustomers: string[];
  contact: {
    address: {
      full: string;
      village: string;
      township: string;
      county: string;
      city: string;
      province: string;
      country: string;
    };
    email: string;
    phones: string[];
    contactPerson: string;
    workingHours: {
      days: string;
      hours: string;
      timezone: string;
    };
  };
  statistics: { label: string; value: string }[];
  social: { whatsapp: string; wechat: string; facebook: string; linkedin: string };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategorySlug: string;
  image: string;
  gallery: string[];
  oem: string;
  vehicle: string;
  material: string;
  surface: string;
  process: string;
  description: string;
  packaging: string;
  featured: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  children: SubCategory[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  description: string;
  image: string;
}

export function getCompany(): Company {
  return companyData as Company;
}

export function getProducts(): Product[] {
  return productsData as Product[];
}

export function getFeaturedProducts(): Product[] {
  return (productsData as Product[]).filter((p) => p.featured);
}

export function getProductById(id: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return (productsData as Product[]).filter((p) => p.categorySlug === slug);
}

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((c) => c.slug === slug);
}

export function getCertifications(): Certification[] {
  return certificationsData as Certification[];
}

export function getSubCategoryBySlug(slug: string): SubCategory | undefined {
  for (const cat of categoriesData as Category[]) {
    for (const sub of cat.children) {
      if (sub.slug === slug) return sub;
    }
  }
  return undefined;
}

export function getParentCategory(slug: string): Category | undefined {
  return (categoriesData as Category[]).find((cat) =>
    cat.children.some((sub) => sub.slug === slug)
  );
}
