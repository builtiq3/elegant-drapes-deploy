import { Link } from "@tanstack/react-router"
import { Price } from "@/components/Price"
import type { Product } from "@/lib/shop"
import { TiltCard } from "@/components/TiltCard"

const FALLBACK_IMAGE = "/favicon.png"

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const mainImage = product.images?.[0] || FALLBACK_IMAGE
  const hoverImage = product.images?.[1] || product.images?.[0] || FALLBACK_IMAGE

  return (
    <TiltCard index={index}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-secondary">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          aria-label={product.name}
          className="absolute inset-0 block"
        >
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            className="product-card-image absolute inset-0 h-full w-full object-cover"
          />
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </Link>
      </div>
      <div className="relative z-10 px-1 pb-2 pt-4">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <Price product={product} className="text-sm text-muted-foreground" />
      </div>
    </TiltCard>
  )
}
