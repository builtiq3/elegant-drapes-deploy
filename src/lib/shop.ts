import { useEffect, useState } from "react";

export let WHATSAPP_PHONE = "";

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
  seoTitle?: string | null;
};

export const FALLBACK_IMAGE = "/hero1.webp";
export const products: Product[] = [];

let runtimeProducts: Product[] = [];
export function setRuntimeProducts(list: Product[]) {
  runtimeProducts = list;
  emit();
}
export const allProducts = () => runtimeProducts;

export const heroSlides = [
  { image: "/hero1.webp", title: "SAREE", subtitle: "The Festive Edit 2026" },
  { image: "/hero2.webp", title: "BANARASI", subtitle: "Handwoven atelier drapes" },
  { image: "/hero1.webp", title: "ORGANZA", subtitle: "Limited festive pieces" },
];

// Country / currency. Product prices are stored in INR; others are converted.
export const COUNTRIES = [
  { code: "IN", label: "India", currency: "INR", symbol: "₹", perInr: 1, locale: "en-IN" },
  { code: "AE", label: "UAE", currency: "AED", symbol: "AED ", perInr: 1 / 22.7, locale: "en-AE" },
  { code: "QA", label: "Qatar", currency: "QAR", symbol: "QAR ", perInr: 1 / 22.9, locale: "en-QA" },
] as const;
export type CountryCode = (typeof COUNTRIES)[number]["code"];
const COUNTRY_KEY = "ak-country";
export function getCountry(): CountryCode {
  if (typeof window === "undefined") return "IN";
  const v = localStorage.getItem(COUNTRY_KEY);
  return COUNTRIES.some((c) => c.code === v) ? (v as CountryCode) : "IN";
}
export function setCountry(code: CountryCode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COUNTRY_KEY, code);
  window.location.reload();
}

export const formatPrice = (n: number) => {
  const c = COUNTRIES.find((x) => x.code === getCountry()) ?? COUNTRIES[0];
  const v = c.code === "IN" ? n : Math.round(n * c.perInr);
  return `${c.symbol}${v.toLocaleString(c.locale)}`;
};

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
export const useCatalog = () => useStore(allProducts, []);
export const productById = (id: string) => allProducts().find((p) => p.id === id);
export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + (productById(i.id)?.price ?? 0) * i.qty, 0);

export function whatsappOrderLink(items: CartItem[], phone?: string) {
  const lines = items.map((i, idx) => { const p = productById(i.id); return `${idx + 1}. ${p?.name} - Rs. ${(p?.price ?? 0).toLocaleString("en-IN")} x ${i.qty}`; });
  const text = ["Hi AK Drapes! I want to order:", ...lines, "", `Total: Rs. ${cartTotal(items).toLocaleString("en-IN")}`, "Please confirm availability."].join("\n");
  const number = (phone || "").replace(/[^0-9]/g, "");
  if (!number) return "#";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}