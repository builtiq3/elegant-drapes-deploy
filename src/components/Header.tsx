import { Link } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useWishlist } from "@/lib/shop";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop All" },
] as const;

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#7B1E2E] px-1 text-[10px] font-bold text-white">
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
    <>
      {/* FIXED HEADER - ALWAYS VISIBLE ON TOP */}
      <div className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white border-b border-black/5">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open? <X size={20}/> : <Menu size={20}/>}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="AK" className="h-9 w-9 rounded-full" />
              <span className="font-display uppercase tracking-[0.15em] text-sm">AK Drapes</span>
            </Link>
          </div>

          <nav className="hidden md:flex gap-8">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className="text-[11px] uppercase tracking-widest">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/wishlist" className="relative"><Heart size={20}/><Count n={wishlist.length}/></Link>
            <Link to="/cart" className="relative"><ShoppingBag size={20}/><Count n={cartCount}/></Link>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t bg-white px-4 py-3">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className="block py-2 text-[11px] uppercase tracking-widest">
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* SPACER SO CONTENT NOT HIDDEN BEHIND FIXED HEADER */}
      <div className="h-[60px]" />
    </>
  );
}