import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Price } from "@/components/Price";
import { Spinner } from "@/components/Spinner";
import { useCatalogLoader } from "@/lib/catalog";
import {
  cartStore,
  FALLBACK_IMAGE,
  formatPrice,
  productById,
  useCatalog,
  useWishlist,
  wishStore,
} from "@/lib/shop";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Saree Details | AK Drapes Boutique" },
      {
        name: "description",
        content:
          "View fabric, colour, price and care details for this handwoven AK Drapes saree, and add it to your bag.",
      },
      { property: "og:title", content: "Saree Details | AK Drapes Boutique" },
      {
        property: "og:description",
        content: "Fabric, colour, price and care details for this handwoven drape.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductDetail,
});

function Accordion({ title, children }: { title: string; children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] uppercase tracking-[0.22em]"
      >
        {title}
        <span className="text-primary">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </div>
  );
}

function Carousel({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const touch = useRef<number | null>(null);
  const many = images.length > 1;
  const go = (n: number) => setI((n + images.length) % images.length);

  return (
    <div>
      <div
        className="relative aspect-[3/4] overflow-hidden bg-secondary"
        onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
        onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({
            on: true,
            x: ((e.clientX - r.left) / r.width) * 100,
            y: ((e.clientY - r.top) / r.height) * 100,
          });
        }}
        onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touch.current === null || !many) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
          touch.current = null;
        }}
      >
        <img
          src={images[i]}
          alt={name}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          style={{ transformOrigin: `${zoom.x}% ${zoom.y}%` }}
          className={`h-full w-full object-cover transition-transform duration-300 ${
            zoom.on ? "scale-150" : "scale-100"
          }`}
        />

        {many && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(i - 1)}
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-background/85 p-2 text-foreground transition hover:bg-background sm:grid"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(i + 1)}
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 place-items-center rounded-full bg-background/85 p-2 text-foreground transition hover:bg-background sm:grid"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Image ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-[3px] w-7 transition-all ${
                    idx === i ? "bg-primary" : "bg-background/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {many && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`View image ${idx + 1}`}
              className={`h-24 w-20 shrink-0 overflow-hidden border transition ${
                idx === i ? "border-primary" : "border-border"
              }`}
            >
              <img
                src={src}
                alt=""
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = Route.useParams();
  const loading = useCatalogLoader();
  useCatalog();
  const router = useRouter();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);

  const product = productById(id);
  const liked = product ? wishlist.includes(product.id) : false;

  if (loading && !product) return <Spinner label="Loading drape" />;

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="text-3xl">This drape isn’t available</h1>
        <Link
          to="/shop"
          className="mt-8 inline-block border border-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Back to collection
        </Link>
      </section>
    );
  }

  const inStock = product.inStock !== false;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary">
          Collection
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <button
        type="button"
        onClick={() => router.history.back()}
        className="mt-4 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Carousel images={product.images} name={product.name} />

        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {product.fabric} · {product.color}
          </p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 font-display text-2xl text-primary">
            <Price product={product} size="lg" />
          </div>

          <p
            className={`mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${
              inStock ? "text-green-700" : "text-destructive"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                inStock ? "bg-green-600" : "bg-destructive"
              }`}
            />
            {inStock ? "In stock" : "Sold out"}
          </p>

          <div className="gold-rule mt-6 h-px w-24" />

          <p className="mt-6 text-sm leading-loose text-muted-foreground">
            {product.description ||
              "A handpicked drape from the AK Drapes atelier — woven, finished and checked by hand, then packed with care."}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                aria-label="Decrease quantity"
                className="px-4 py-3 hover:text-primary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                aria-label="Increase quantity"
                className="px-4 py-3 hover:text-primary"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              type="button"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => {
                const added = wishStore.toggle(product.id);
                toast(added ? "Saved to wishlist" : "Removed from wishlist");
              }}
              className="grid h-12 w-12 place-items-center border border-border transition hover:border-primary"
            >
              <Heart
                size={17}
                className={liked ? "fill-primary text-primary" : ""}
              />
            </button>
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={() => {
              for (let n = 0; n < qty; n++) cartStore.add(product.id);
              toast.success(`${product.name} added to bag`);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={15} /> Add to bag
          </button>

          <div className="mt-10">
            <Accordion title="Fabric details">
              {`${product.fabric} in ${product.color}. Handwoven and finished by our atelier, with natural variations in weave and tone that make each drape unique.`}
            </Accordion>
            <Accordion title="Shipping">
              Complimentary shipping across India. Dispatched within 2–3 working
              days and delivered in signature AK Drapes packaging. International
              delivery on request over WhatsApp.
            </Accordion>
            <Accordion title="Care">
              Dry clean only. Store folded in a soft muslin cloth, away from
              direct sunlight. Avoid perfume and moisture directly on the weave.
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
