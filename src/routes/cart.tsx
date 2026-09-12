import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCatalogLoader, useSettings } from "@/lib/catalog";
import {
  cartStore,
  cartTotal,
  FALLBACK_IMAGE,
  formatPrice,
  productById,
  useCart,
  useCatalog,
  whatsappOrderLink,
} from "@/lib/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag | AK Drapes Boutique" },
      {
        name: "description",
        content:
          "Review your AK Drapes selection and place your order over WhatsApp with our styling team.",
      },
      { property: "og:title", content: "Shopping Bag | AK Drapes Boutique" },
      { property: "og:description", content: "Review your selection and order on WhatsApp." },
    ],
  }),
  component: Cart,
});

function Cart() {
  useCatalogLoader();
  useCatalog();
  const { whatsapp } = useSettings();
  const items = useCart();
  const total = cartTotal(items);

  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Your selection
        </p>
        <h1 className="mt-3 text-4xl">Shopping Bag</h1>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted-foreground">Your bag is beautifully empty.</p>
          <Link
            to="/shop"
            className="jewelry-button mt-8 inline-block bg-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary-foreground"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {items.map((item) => {
              const p = productById(item.id);
              if (!p) return null;
              return (
                <li key={item.id} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-lg">{p.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.fabric} · {p.color}
                    </p>
                    <p className="mt-2 text-sm text-primary">{formatPrice(p.price)}</p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center border border-border">
                        <button
                          aria-label="Decrease quantity"
                          className="px-3 py-2 hover:text-primary"
                          onClick={() => cartStore.setQty(item.id, item.qty - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="px-3 py-2 hover:text-primary"
                          onClick={() => cartStore.setQty(item.id, item.qty + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          cartStore.remove(item.id);
                          toast("Removed from bag");
                        }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="hidden self-center text-right text-sm sm:block">
                    {formatPrice(p.price * item.qty)}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Total
            </span>
            <span className="font-display text-2xl text-primary">{formatPrice(total)}</span>
          </div>

          <a
           <a
  href={whatsapp ? whatsappOrderLink(items, whatsapp) : "#"}
  onClick={(e) => {
    if (!whatsapp) {
      e.preventDefault();
      toast.error("Loading WhatsApp number...");
    }
  }}
            target="_blank"
            rel="noreferrer"
            onClick={() => toast.success("Opening WhatsApp with your order")}
            className="jewelry-button mt-8 block bg-primary px-6 py-4 text-center text-[11px] uppercase tracking-[0.28em] text-primary-foreground"
          >
            Order on WhatsApp
          </a>
          <button
            onClick={() => {
              cartStore.clear();
              toast("Bag cleared");
            }}
            className="mt-4 w-full text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary"
          >
            Clear bag
          </button>
        </>
      )}
    </section>
  );
}
