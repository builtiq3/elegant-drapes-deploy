import Papa from "papaparse";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  products as staticProducts,
  setRuntimeProducts,
  WHATSAPP_PHONE,
  type Product,
} from "@/lib/shop";

export const SHEET_URL_KEY = "google_sheet_url";
export const ADMIN_KEY = "adminUnlocked";
export const BUCKET = "saree-images";
const TEN_YEARS = 60 * 60 * 24 * 3650;

export type DbProduct = {
  id: string;
  name: string;
  price: number;
  fabric: string;
  color: string;
  description: string | null;
  images: string[] | null;
  is_bestseller: boolean;
  in_stock: boolean;
  has_offer?: boolean | null;
  offer_price?: number | null;
  created_at: string;
};

export type DbReview = {
  id: string;
  name: string;
  photo_url: string | null;
  stars: number;
  review_text: string;
  created_at: string;
};

export function toProduct(row: DbProduct): Product {
  const images = (row.images ?? []).filter(Boolean);
  const safe = images.length ? images : staticProducts[0]!.images;
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    fabric: row.fabric,
    color: row.color,
    description: row.description ?? "",
    images: safe,
    image: safe[0]!,
    hoverImage: safe[1] ?? safe[0]!,
    inStock: row.in_stock,
    isBestseller: row.is_bestseller,
    hasOffer: Boolean(row.has_offer),
    offerPrice: row.offer_price ?? null,
    ...(row.is_bestseller ? { tag: "Bestseller" } : {}),
  };
}

/* ---------------- google sheet ---------------- */

type SheetRow = Record<string, string>;

export async function fetchSheetProducts(url: string): Promise<Product[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet request failed (${res.status})`);
  const csv = await res.text();
  const parsed = Papa.parse<SheetRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  return parsed.data
    .filter((r) => (r["name"] ?? "").trim())
    .map((r, i) => {
      const images = [r["image1_url"], r["image2_url"], r["image3_url"]]
        .map((v) => (v ?? "").trim())
        .filter(Boolean);
      const safe = images.length ? images : staticProducts[0]!.images;
      const truthy = (v?: string) =>
        !["false", "no", "0", ""].includes((v ?? "").trim().toLowerCase());
      return {
        id: `sheet-${i + 1}`,
        name: (r["name"] ?? "").trim(),
        price: Number((r["price"] ?? "0").replace(/[^0-9.]/g, "")) || 0,
        fabric: (r["fabric"] ?? "").trim(),
        color: (r["color"] ?? "").trim(),
        description: (r["description"] ?? "").trim(),
        images: safe,
        image: safe[0]!,
        hoverImage: safe[1] ?? safe[0]!,
        inStock: truthy(r["in_stock"]),
        isBestseller: truthy(r["is_bestseller"]),
        ...(truthy(r["is_bestseller"]) ? { tag: "Bestseller" } : {}),
      } satisfies Product;
    });
}

export const getSheetUrl = () =>
  typeof window === "undefined"
    ? ""
    : window.localStorage.getItem(SHEET_URL_KEY) ?? "";

/* ---------------- loading ---------------- */

export async function loadCatalog(): Promise<Product[]> {
  const [dbResult, sheetResult] = await Promise.allSettled([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    (async () => {
      const url = getSheetUrl();
      return url ? await fetchSheetProducts(url) : [];
    })(),
  ]);

  const dbProducts =
    dbResult.status === "fulfilled" && dbResult.value.data
      ? (dbResult.value.data as unknown as DbProduct[]).map(toProduct)
      : [];
  const sheetProducts =
    sheetResult.status === "fulfilled" ? sheetResult.value : [];

  const merged = [...sheetProducts, ...dbProducts];
  return merged.length ? merged : staticProducts;
}

let cache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

export function useCatalogLoader() {
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let alive = true;
    if (cache) {
      setRuntimeProducts(cache);
      setLoading(false);
      return;
    }
    setLoading(true);
    inflight = inflight ?? loadCatalog();
    inflight
      .then((list) => {
        cache = list;
        inflight = null;
        if (!alive) return;
        setRuntimeProducts(list);
      })
      .catch(() => setRuntimeProducts(staticProducts))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return loading;
}

export async function refreshCatalog() {
  cache = null;
  inflight = null;
  const list = await loadCatalog();
  cache = list;
  setRuntimeProducts(list);
  return list;
}

/* ---------------- settings ---------------- */

export type Settings = { whatsapp: string; announcement: string };

const SETTINGS_CACHE = "ak-settings";

export function useSettings(): Settings {
  const [settings, setSettings] = useState<Settings>(() => ({
    whatsapp: WHATSAPP_PHONE,
    announcement: "",
  }));

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_CACHE);
      if (raw) setSettings(JSON.parse(raw) as Settings);
    } catch {
      /* ignore */
    }
    let alive = true;
    try {
      void supabase
        .from("settings")
        .select("whatsapp_number, announcement_text")
        .eq("id", 1)
        .maybeSingle()
        .then(({ data }) => {
          if (!alive || !data) return;
          const next: Settings = {
            whatsapp: data.whatsapp_number || WHATSAPP_PHONE,
            announcement: data.announcement_text || "",
          };
          setSettings(next);
          window.localStorage.setItem(SETTINGS_CACHE, JSON.stringify(next));
        })
        .catch(() => undefined);
    } catch {
      /* missing env */
    }
    return () => {
      alive = false;
    };
  }, []);

  return settings;
}

/* ---------------- reviews ---------------- */

export function useCloudReviews() {
  const [reviews, setReviews] = useState<DbReview[] | null>(null);

  useEffect(() => {
    let alive = true;
    try {
      void supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (alive) setReviews((data as unknown as DbReview[]) ?? []);
        })
        .catch(() => {
          if (alive) setReviews([]);
        });
    } catch {
      setReviews([]);
    }
    return () => {
      alive = false;
    };
  }, []);

  return reviews;
}

/* ---------------- image upload ---------------- */

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signErr || !data) throw signErr ?? new Error("Could not link image");
  return data.signedUrl;
}
