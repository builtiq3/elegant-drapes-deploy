import { useEffect, useState } from "react";

export const WHATSAPP_PHONE = "+91 9880253666";

export type Product = {
  id: string;
  name: string;
  price: number;
  fabric: string;
  color: string;
  image: string;
  hoverImage: string;
  images: string[];
  description?: string;
  inStock?: boolean;
  isBestseller?: boolean;
  hasOffer?: boolean;
  offerPrice?: number | null;
  tag?: string;
};

// Use YOUR logo as fallback, not dead links
export const FALLBACK_IMAGE = "/hero1.webp";

// Temporary images until you upload real saree photos
const TEMP = "/favicon.png";

const STATIC: Omit<Product, "images">[] = [
  { id: "ak-01", name: "Meher Kanjivaram Silk", price: 18900, fabric: "Silk", color: "Maroon", image: TEMP, hoverImage: TEMP, tag: "Bestseller" },
  { id: "ak-02", name: "Noor Organza Drape", price: 12400, fabric: "Organza", color: "Ivory", image: TEMP, hoverImage: TEMP, tag: "New" },
  { id: "ak-03", name: "Zarina Banarasi Weave", price: 22500, fabric: "Banarasi", color: "Gold", image: TEMP, hoverImage: TEMP },
  { id: "ak-04", name: "Aisha Chiffon Pleat", price: 9800, fabric: "Chiffon", color: "Blush", image: TEMP, hoverImage: TEMP },
  { id: "ak-05", name: "Rukhsar Tissue Silk", price: 16750, fabric: "Silk", color: "Emerald", image: TEMP, hoverImage: TEMP, tag: "Limited" },
  { id: "ak-06", name: "Saira Linen Handloom", price: 7400, fabric: "Linen", color: "Ivory", image: TEMP, hoverImage: TEMP },
  { id: "ak-07", name: "Alina Georgette Sequin", price: 14200, fabric: "Georgette", color: "Midnight", image: TEMP, hoverImage: TEMP },
  { id: "ak-08", name: "Dilnaz Velvet Border", price: 25600, fabric: "Velvet", color: "Maroon", image: TEMP, hoverImage: TEMP, tag: "Couture" },
];

export const products: Product[] = STATIC.map((p) => ({
  ...p,
  inStock: true,
  isBestseller: true,
  description: "A handpicked drape from the AK Drapes atelier — woven, finished and checked by hand.",
  images: [p.image, p.hoverImage],
}));

let runtimeProducts: Product[] = [];
export function setRuntimeProducts(list: Product[]) {
  runtimeProducts = list;
  emit();
}
export const allProducts = () => runtimeProducts.length ? runtimeProducts : products;

export const heroSlides = [
  { image: "/hero1.webp", title: "SAREE", subtitle: "The Festive Edit 2026" },
  { image: "/hero2.webp", title: "BANARASI", subtitle: "Handwoven atelier drapes" },
  { image: "/hero1.webp", title: "ORGANZA", subtitle: "Limited festive pieces" },
];


export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type CartItem = { id: string; qty: number };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown) { if (typeof window === "undefined") return; localStorage.setItem(key, JSON.stringify(value)); emit(); }
const CART_KEY = "ak-cart"; const WISH_KEY = "ak-wishlist";
export const cartStore = {
  get: () => read<CartItem[]>(CART_KEY, []),
  add(id: string) { const items = cartStore.get(); const found = items.find((i) => i.id === id); const next = found ? items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) : [...items, { id, qty: 1 }]; write(CART_KEY, next); },
  setQty(id: string, qty: number) { const next = cartStore.get().map((i) => (i.id === id ? { ...i, qty } : i)).filter((i) => i.qty > 0); write(CART_KEY, next); },
  remove(id: string) { write(CART_KEY, cartStore.get().filter((i) => i.id !== id)); },
  clear: () => write(CART_KEY, []),
};
export const wishStore = {
  get: () => read<string[]>(WISH_KEY, []),
  toggle(id: string) { const items = wishStore.get(); write(WISH_KEY, items.includes(id) ? items.filter((i) => i !== id) : [...items, id]); return !items.includes(id); },
  remove(id: string) { write(WISH_KEY, wishStore.get().filter((i) => i !== id)); },
};
function useStore<T>(getter: () => T, empty: T): T {
  const [state, setState] = useState<T>(empty);
  useEffect(() => { const sync = () => setState(getter()); sync(); listeners.add(sync); window.addEventListener("storage", sync); return () => { listeners.delete(sync); window.removeEventListener("storage", sync); }; }, []);
  return state;
}
export const useCart = () => useStore(cartStore.get, [] as CartItem[]);
export const useWishlist = () => useStore(wishStore.get, [] as string[]);
export const useCatalog = () => useStore(allProducts, products);
export const productById = (id: string) => allProducts().find((p) => p.id === id);
export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + (productById(i.id)?.price ?? 0) * i.qty, 0);
export function whatsappOrderLink(items: CartItem[], phone?: string) {
  const lines = items.map((i, idx) => { const p = productById(i.id); return `${idx + 1}. ${p?.name} - Rs. ${(p?.price ?? 0).toLocaleString("en-IN")} x ${i.qty}`; });
  const text = ["Hi AK Drapes! I want to order:", ...lines, "", `Total: Rs. ${cartTotal(items).toLocaleString("en-IN")}`, "Please confirm availability."].join("\n");
  const number = (phone || WHATSAPP_PHONE).replace(/[^0-9]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}