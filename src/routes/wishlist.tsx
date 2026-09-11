import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { useCatalogLoader } from "@/lib/catalog";
import { productById, useCatalog, useWishlist } from "@/lib/shop";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist | AK Drapes Boutique" },
      {
        name: "description",
        content: "The AK Drapes sarees you've saved for later, kept safe on this device.",
      },
      { property: "og:title", content: "Your Wishlist | AK Drapes Boutique" },
      { property: "og:description", content: "The drapes you've saved for later." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  useCatalogLoader();
  useCatalog();
  const ids = useWishlist();
  const items = ids.map(productById).filter(Boolean);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Saved for later
        </p>
        <h1 className="mt-3 text-4xl">Wishlist</h1>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Tap the heart on a drape you love.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block border border-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary transition hover:bg-primary hover:text-primary-foreground"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p!.id} product={p!} />
          ))}
        </div>
      )}
    </section>
  );
}
