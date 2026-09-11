import type { Product } from "@/lib/shop";

/** Public origin used for canonical / og:url / sitemap. */
export const SITE_URL = (
  (import.meta.env["VITE_SITE_URL"] as string | undefined) ??
  "https://ak-drapes-elegance.vercel.app"
).replace(/\/$/, "");

export const absoluteUrl = (path: string) =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Absolute URL for an image that may already be absolute. */
export const absoluteImage = (src?: string | null) =>
  !src ? absoluteUrl("/favicon.png") : /^https?:\/\//.test(src) ? src : absoluteUrl(src);

/**
 * Google title for a product.
 * Uses the optional admin-entered seo_title, otherwise auto-generates one.
 */
export function productSeoTitle(p: {
  name: string;
  fabric?: string;
  seoTitle?: string | null;
}) {
  const custom = (p.seoTitle ?? "").trim();
  if (custom) return custom;
  const fabric = (p.fabric ?? "").trim();
  return `${p.name}${fabric ? ` - ${fabric} Saree` : " - Saree"} - AK Drapes | Dubai`;
}

export function productSeoDescription(p: Product) {
  const base = (p.description ?? "").trim();
  if (base) return base.slice(0, 155);
  return `${p.name} — handwoven ${p.fabric || "designer"} saree in ${
    p.color || "a signature shade"
  }. Premium drapes by AK Drapes Boutique, Dubai. Shop now.`;
}

export function productJsonLd(p: Product, url: string) {
  const price = p.hasOffer && p.offerPrice ? p.offerPrice : p.price;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productSeoTitle({ name: p.name, fabric: p.fabric, seoTitle: p.seoTitle }),
    image: (p.images ?? []).map(absoluteImage),
    description: productSeoDescription(p),
    sku: p.id,
    brand: { "@type": "Brand", name: "AK Drapes Boutique" },
    material: p.fabric || undefined,
    color: p.color || undefined,
    offers: {
      "@type": "Offer",
      url,
      price: String(price),
      priceCurrency: "AED",
      availability:
        p.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "AK Drapes Boutique" },
    },
  };
}

/** Strips control chars / angle brackets from admin-entered text. */
export function sanitizeText(value: string, max = 500) {
  return value
    .replace(/[<>]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, max);
}
