import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
  const [scrolled, setScrolled] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-5">
      <motion.header
        layout
        className={`pointer-events-auto mx-auto w-full max-w-6xl overflow-hidden border border-border/80 bg-background/80 shadow-nav backdrop-blur-2xl ${
          scrolled || open ? "rounded-[1.75rem]" : "rounded-full"
        }`}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3">
          <button
            type="button"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 md:justify-self-start">
            <img
              src="/favicon.png"
              alt="AK Drapes Boutique"
              className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
            />
            <span className="truncate font-display text-sm tracking-[0.14em] uppercase sm:text-lg sm:tracking-[0.1em]">
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

          <div className="flex shrink-0 items-center gap-3 justify-self-end sm:gap-4">
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
          <nav className="flex flex-col gap-1 border-t border-border bg-background/95 px-5 py-3 md:hidden">
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
          </nav>
        )}
      </motion.header>
    </div>
  );
}
