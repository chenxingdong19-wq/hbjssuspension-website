## JS Suspension — Corporate Website

Official manufacturer website for **Hebei Jingshun Auto Parts Co., Ltd.** (Brand: JS Suspension). Built with Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, and Lucide Icons. Deployed on Vercel.

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build   # Production build
```

---

## Project Structure

```
jingshun-website/
├── data/                    # All content lives here
│   ├── company.json         # Company info, contact, statistics
│   ├── products.json        # Product catalog
│   ├── categories.json      # Product categories
│   └── certifications.json  # Quality certifications
├── public/
│   └── assets/              # Images & media
│       ├── logo/            # Company logo
│       ├── hero/            # Hero banner images
│       ├── products/        # Product photos (by category)
│       │   ├── control-arm/
│       │   ├── ball-joint/
│       │   ├── bushing/
│       │   └── other/
│       ├── factory/         # Factory/manufacturing photos
│       ├── certificates/    # Certification documents
│       └── documents/       # Other downloadable documents
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   │   ├── layout/          # Navbar, Footer
│   │   ├── home/            # Homepage sections
│   │   ├── products/        # Product cards, gallery
│   │   └── ui/              # Shared UI components
│   └── lib/                 # Data loading utilities
└── README.md
```

---

## How to Add New Products

### Step 1: Add product images

Create a folder under the appropriate category:

```
public/assets/products/control-arm/
```

Place your product photos inside. Recommended:
- 600x600px minimum
- WebP format
- White/neutral background
- Clear product focus (no watermarks or heavy branding)

### Step 2: Add product to `data/products.json`

Add a new entry:

```json
{
  "id": "control-arm-004",
  "name": "Front Upper Control Arm",
  "category": "Control Arm Assembly",
  "categorySlug": "control-arm",
  "image": "/assets/products/control-arm/004.webp",
  "gallery": [
    "/assets/products/control-arm/004.webp",
    "/assets/products/control-arm/004b.webp"
  ],
  "oem": "54501-3K000",
  "vehicle": "Hyundai Santa Fe 2013-2018",
  "material": "Forged Steel",
  "surface": "Electrophoretic Coating",
  "process": "Forging, CNC Machining, Robotic Welding",
  "description": "High-strength forged steel front upper control arm...",
  "packaging": "Individual box, 15 units per carton",
  "featured": true
}
```

### Step 3: Deploy

```bash
git add .
git commit -m "Add new product: Front Upper Control Arm"
git push
```

If deploying via Vercel, the site rebuilds automatically on push.

---

## How to Update Company Information

Edit `data/company.json` to update:

- Company name, address, contact details
- Statistics (years, products, etc.)
- Social media / WhatsApp links

No code changes needed. Rebuild and deploy.

---

## How to Add Categories

Edit `data/categories.json` to add a new product category:

```json
{
  "id": "stabilizer-link",
  "name": "Stabilizer Links",
  "slug": "stabilizer-link",
  "description": "Stabilizer link assemblies for a wide range of vehicles.",
  "icon": "Link"
}
```

Available icons: any Lucide icon name (https://lucide.dev/icons).

---

## How to Add Certifications

Edit `data/certifications.json`:

```json
{
  "id": "iso-14001",
  "name": "ISO 14001:2015",
  "issuer": "SGS",
  "description": "Environmental Management System certification.",
  "image": "/assets/certificates/iso-14001.webp"
}
```

---

## SEO & Performance

- Automatic sitemap.xml generation (see `public/sitemap.xml`)
- Schema.org Organization markup embedded in `<head>`
- Open Graph + Twitter Card metadata on all pages
- Canonical URLs pointing to https://hbjssuspension.com
- Next.js Image optimization with lazy loading
- WebP format recommended for all product images

---

## Deployment

This project is configured for one-click Vercel deployment:

1. Push to a GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Set the domain to `hbjssuspension.com`
4. Done — auto-deploys on every push

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Vercel | Hosting & deployment |

---

## License

All rights reserved — Hebei Jingshun Auto Parts Co., Ltd.
