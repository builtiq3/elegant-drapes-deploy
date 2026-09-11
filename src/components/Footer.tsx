import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
//import logo from "@/assets/ak-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <img src="/favicon.png" alt="AK Drapes Boutique" className="h-20 w-20 rounded-full object-cover" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            AK Drapes Boutique — premium sarees and made-to-drape couture,
            curated for women who dress with intention.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.22em]">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop All</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Shopping Bag</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.22em]">Atelier</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={14} /> +91 9880253666</li>
            <li className="flex items-center gap-2"><Mail size={14} /> care@akdrapes.com</li>
            <li className="flex items-center gap-2"><Instagram size={14} /> @akdrapesboutique</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        © {new Date().getFullYear()} AK Drapes Boutique
      </div>
    </footer>
  );
}
