import { formatPrice, type Product } from "@/lib/shop"

export function offerActive(product: Product) {
  return Boolean(
    product.hasOffer &&
      product.offerPrice &&
      product.offerPrice > 0 &&
      product.offerPrice < product.price,
  )
}

export function offerPercent(product: Product) {
  if (!offerActive(product)) return 0
  return Math.round(((product.price - product.offerPrice!) / product.price) * 100)
}

export function Price({
  product,
  className = "",
  size = "sm",
}: {
  product: Product
  className?: string
  size?: "sm" | "lg"
}) {
  const active = offerActive(product)
  const big = size === "lg"

  if (!active) {
    return (
      <span className={className}>{formatPrice(product.price)}</span>
    )
  }

  return (
    <span className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-muted-foreground line-through">
        {formatPrice(product.price)}
      </span>
      <span className="font-semibold text-primary">
        {formatPrice(product.offerPrice!)}
      </span>
      <span
        className={`bg-primary px-2 py-0.5 uppercase tracking-[0.14em] text-primary-foreground ${
          big ? "text-[11px]" : "text-[9px]"
        }`}
      >
        {offerPercent(product)}% off
      </span>
    </span>
  )
}
