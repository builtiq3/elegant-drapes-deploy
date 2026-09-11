import { Link } from "@tanstack/react-router";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
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
      {/* LUXURY FLOATING ROUNDED NAV */}
      <div className="fixed top-10 left-0 right-0 z-[50] px-3 md:px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between
                        bg-[#fdf8f1]/90 backdrop-blur-xl
                        rounded-full px-5 md:px-7 py-3
                        border border-[#e8ddd0]/80
                        shadow-[0_8px_30px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]">

          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
              {open? <X size={20}/> : <Menu size={20}/>}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="AK" className="h-9 w-9 rounded-full border border-[#e8ddd0] object-cover" />
              <span className="font-display uppercase tracking-[0.22em] text-[13px] md:text-[14px]">AK Drapes</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className="text-[11px] uppercase tracking-[0.2em] hover:text-[#7B1E2E] transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/wishlist" className="relative hover:text-[#7B1E2E] transition-colors"><Heart size={20} strokeWidth={1.5}/><Count n={wishlist.length}/></Link>
            <Link to="/cart" className="relative hover:text-[#7B1E2E] transition-colors"><ShoppingBag size={20} strokeWidth={1.5}/><Count n={cartCount}/></Link>
          </div>
        </div>

        {/* Mobile menu - also rounded */}
        {open && (
          <div className="mx-auto max-w-6xl mt-3 rounded-[24px] border border-[#e8ddd0] bg-[#fdf8f1]/95 backdrop-blur-xl px-6 py-4 shadow-lg md:hidden">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} onClick={()=>setOpen(false)} className="block py-3 text-[11px] uppercase tracking-widest border-b border-black/5 last:border-0">
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SPACER - reduced because nav is floating */}
      <div className="h-[110px]" />
    </>
  );
}