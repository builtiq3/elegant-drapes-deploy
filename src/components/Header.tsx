import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { useCart, useWishlist } from "@/lib/shop";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
  { to: "/wishlist", label: "Wishlist" },
] as const;

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">
      {n}
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
        <button
          type="button"
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Menu size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="flex min-w-0 items-center gap-3 md:justify-self-start">
          <img
            src="/favicon.png"
            alt="AK Drapes Boutique -"
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
          <span className="hidden truncate font-display text-lg tracking-[0.10em] uppercase sm:block">
            AK Drapes
           
            
            
          </span>
        </Link>

        <nav className="hidden justify-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4 justify-self-end">
          <button aria-label="Search" className="hidden text-foreground/80 hover:text-primary sm:block">
            <Search size={18} />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hover:text-primary">
            <Heart size={18} />
            <Count n={wishlist.length} />
          </Link>
          <Link to="/cart" aria-label="Shopping bag" className="relative hover:text-primary">
            <ShoppingBag size={18} />
            <Count n={cartCount} />
          </Link>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {NAV.concat([{ to: "/cart", label: "Bag" } as never]).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="py-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 py-2 text-[11px] uppercase tracking-[0.24em] text-primary"
          >
            <X size={13} /> Close
          </button>
        </nav>
      )}
    </header>
  );
}
