import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_KEY,
  fetchSheetProducts,
  getSheetUrl,
  refreshCatalog,
  SHEET_URL_KEY,
  uploadImage,
  BUCKET,
  type DbProduct,
  type DbReview,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/shop";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Boutique Admin | AK Drapes Boutique" },
      {
        name: "description",
        content: "Private admin area for adding sarees, reviews and settings to AK Drapes Boutique.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Boutique Admin | AK Drapes Boutique" },
      { property: "og:description", content: "Private admin area for the boutique team." },
    ],
  }),
  component: Admin,
});

const ADMIN_PASSWORD = "admin123";
const FABRICS = ["Pure cotton","Pure Silk","Banarasi", "Kanjivaram",  "Georgette","Pure Silk", "Chiffon", "Cotton", "Linen", "Velvet", "Crepe", "Organza", "Satin", "Tussar Silk", "Mysore Silk", "Net", "Jacquard", "Brocade", "Rayon", "Polyester"];
const TABS = ["Products", "Settings", "Reviews", "Sheet Sync"] as const;
type Tab = (typeof TABS)[number];

const inputClass =
  "w-full border border-border bg-card px-4 py-3.5 text-base outline-none focus:border-primary";
const labelClass =
  "block text-[11px] uppercase tracking-[0.22em] text-muted-foreground";
const btnClass =
  "w-full bg-primary px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60";

/* ---------------- login ---------------- */

function Login({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  return (
    <main className="mx-auto max-w-sm px-5 py-24 text-center">
      <h1 className="text-3xl">Boutique Admin</h1>
      <div className="gold-rule mx-auto mt-4 h-px w-24" />
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim() === ADMIN_PASSWORD) {
            window.localStorage.setItem(ADMIN_KEY, "true");
            onUnlock();
          } else setError(true);
        }}
      >
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Admin password"
          className={`${inputClass} text-center tracking-[0.2em]`}
        />
        {error && <p className="text-xs text-destructive">Wrong password.</p>}
        <button type="submit" className={btnClass}>
          Enter
        </button>
      </form>
    </main>
  );
}

/* ---------------- image slots ---------------- */

function ImageSlots({
  images,
  setImages,
}: {
  images: string[];
  setImages: (v: string[]) => void;
}) {
  const [busy, setBusy] = useState<number | null>(null);

  const pick = async (idx: number, file?: File) => {
    if (!file) return;
    setBusy(idx);
    try {
      const url = await uploadImage(file);
      const next = [...images];
      next[idx] = url;
      setImages(next);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not upload that photo",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <label
          key={idx}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void pick(idx, e.dataTransfer.files[0]);
          }}
          className="relative grid aspect-[3/4] cursor-pointer place-items-center overflow-hidden border border-dashed border-gold/60 bg-secondary text-center"
        >
          {images[idx] ? (
            <>
              <img src={images[idx]} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={(e) => {
                  e.preventDefault();
                  const next = [...images];
                  next[idx] = "";
                  setImages(next);
                }}
                className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-background/90"
              >
                <X size={13} />
              </button>
            </>
          ) : busy === idx ? (
            <Loader2 className="animate-spin text-primary" size={20} />
          ) : (
            <span className="px-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <Upload size={16} className="mx-auto mb-1" />
              Photo {idx + 1}
              {idx === 0 ? " *" : ""}
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void pick(idx, e.target.files?.[0])}
          />
        </label>
      ))}
    </div>
  );
}

/* ---------------- products tab ---------------- */

const emptyForm = {
  id: "",
  name: "",
  price: "",
  fabric: FABRICS[0]!,
  color: "",
  description: "",
  in_stock: true,
  is_bestseller: false,
  has_offer: false,
  offer_price: "",
};

/** Turn a stored image URL back into a storage object path, if it is one. */
function storagePath(url: string): string | null {
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length).split("?")[0] ?? "";
  return path ? decodeURIComponent(path) : null;
}

function ProductsTab() {
  const [list, setList] = useState<DbProduct[] | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [images, setImages] = useState<string[]>(Array(6).fill(""));
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState<DbProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as unknown as DbProduct[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const reset = () => {
    setForm({ ...emptyForm });
    setImages(Array(6).fill(""));
    setShowForm(false);
  };

  const save = async () => {
    const clean = images.filter(Boolean);
    if (!form.name.trim()) { toast.error("Please add a name"); return; }
    if (!clean.length) { toast.error("Photo 1 is required"); return; }
    const price = Number(form.price.replace(/[^0-9]/g, "")) || 0;
    const offer = Number(form.offer_price.replace(/[^0-9]/g, "")) || 0;
    if (form.has_offer && (!offer || offer >= price)) {
      toast.error("Offer price must be less than the regular price");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      price,
      fabric: form.fabric,
      color: form.color.trim(),
      description: form.description.trim(),
      images: clean,
      in_stock: form.in_stock,
      is_bestseller: form.is_bestseller,
      has_offer: form.has_offer,
      offer_price: form.has_offer ? offer : null,
    };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(form.id ? "Saree updated" : "Saree added to the site");
    reset();
    await load();
    await refreshCatalog();
  };

  const remove = async (product: DbProduct) => {
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) { toast.error(error.message); return; }
    const paths = (product.images ?? [])
      .map((src) => storagePath(src))
      .filter((p): p is string => Boolean(p));
    if (paths.length) {
      await supabase.storage.from(BUCKET).remove(paths);
    }
    setConfirm(null);
    toast.success("Saree deleted");
    await load();
    await refreshCatalog();
  };

  return (
    <div className="space-y-8">
      <p className="border border-gold/50 bg-secondary px-4 py-3 text-sm text-muted-foreground">
        Just upload a photo like Instagram — no code needed.
      </p>

      {!showForm && (
        <button className={btnClass} onClick={() => setShowForm(true)}>
          + Add new saree
        </button>
      )}

      {showForm && (
        <div className="space-y-5 border border-border bg-card p-5">
          <ImageSlots images={images} setImages={setImages} />

          <div className="space-y-1.5">
            <span className={labelClass}>Name</span>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <span className={labelClass}>Price (₹)</span>
            <input
              className={inputClass}
              inputMode="numeric"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <span className={labelClass}>Fabric</span>
            <select
              className={inputClass}
              value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            >
              {FABRICS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className={labelClass}>Colour</span>
            <input
              className={inputClass}
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <span className={labelClass}>Description</span>
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#7B1E2E]"
              checked={form.has_offer}
              onChange={(e) => setForm({ ...form, has_offer: e.target.checked })}
            />
            Add offer price?
          </label>

          {form.has_offer && (
            <div className="space-y-1.5">
              <span className={labelClass}>Offer price (₹)</span>
              <input
                className={inputClass}
                inputMode="numeric"
                value={form.offer_price}
                onChange={(e) =>
                  setForm({ ...form, offer_price: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Must be lower than the regular price.
              </p>
            </div>
          )}

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#7B1E2E]"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
            />
            In stock
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#7B1E2E]"
              checked={form.is_bestseller}
              onChange={(e) =>
                setForm({ ...form, is_bestseller: e.target.checked })
              }
            />
            Bestseller
          </label>

          <button className={btnClass} disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : form.id ? "Update saree" : "Save saree"}
          </button>
          <button
            className="w-full py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            onClick={reset}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-3">
        {list === null && (
          <p className="text-sm text-muted-foreground">Loading sarees…</p>
        )}
        {list?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No sarees added yet — the site is showing the starter collection.
          </p>
        )}
        {list?.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border border-border bg-card p-3"
          >
            <img
              src={p.images?.[0] ?? ""}
              alt=""
              className="h-20 w-16 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.fabric} · {p.color} · {formatPrice(p.price)}
              </p>
            </div>
            <button
              className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-primary"
              onClick={() => {
                setForm({
                  id: p.id,
                  name: p.name,
                  price: String(p.price),
                  fabric: p.fabric || FABRICS[0]!,
                  color: p.color,
                  description: p.description ?? "",
                  in_stock: p.in_stock,
                  is_bestseller: p.is_bestseller,
                  has_offer: Boolean(p.has_offer),
                  offer_price: p.offer_price ? String(p.offer_price) : "",
                });
                const imgs = Array(6).fill("");
                (p.images ?? []).forEach((src, i) => (imgs[i] = src));
                setImages(imgs);
                setShowForm(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Edit
            </button>
            <button
              aria-label="Delete"
              className="p-2 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirm(p)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 px-5">
          <div className="w-full max-w-sm border border-border bg-card p-6 text-center">
            <p className="text-base">
              Are you sure to delete this product? This cannot be undone.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{confirm.name}</p>
            <button
              className={`${btnClass} mt-6`}
              disabled={deleting}
              onClick={() => {
                setDeleting(true);
                void remove(confirm).finally(() => setDeleting(false));
              }}
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              className="w-full py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
              onClick={() => setConfirm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- settings tab ---------------- */

function SettingsTab() {
  const [whatsapp, setWhatsapp] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [sheet, setSheet] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSheet(getSheetUrl());
    void supabase
      .from("settings")
      .select("whatsapp_number, announcement_text")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setWhatsapp(data.whatsapp_number ?? "");
        setAnnouncement(data.announcement_text ?? "");
      });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("settings").upsert({
      id: 1,
      whatsapp_number: whatsapp.trim(),
      announcement_text: announcement.trim(),
    });
    window.localStorage.setItem(SHEET_URL_KEY, sheet.trim());
    window.localStorage.removeItem("ak-settings");
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <span className={labelClass}>WhatsApp number</span>
        <input
          className={inputClass}
          inputMode="tel"
          placeholder="919880253666"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <span className={labelClass}>Announcement bar text</span>
        <input
          className={inputClass}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <span className={labelClass}>Google Sheet CSV link</span>
        <input
          className={inputClass}
          placeholder="https://docs.google.com/…/pub?output=csv"
          value={sheet}
          onChange={(e) => setSheet(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          In your sheet: File &gt; Share &gt; Publish to web &gt; CSV
        </p>
      </div>
      <button className={btnClass} disabled={saving} onClick={() => void save()}>
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}

/* ---------------- reviews tab ---------------- */

function ReviewsTab() {
  const [list, setList] = useState<DbReview[] | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setList((data as unknown as DbReview[]) ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    if (!name.trim() || !text.trim())
      { toast.error("Please add a name and a review"); return; }
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      photo_url: photo || null,
      stars,
      review_text: text.trim(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Review added");
    setName("");
    setPhoto("");
    setStars(5);
    setText("");
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5 border border-border bg-card p-5">
        <div className="space-y-1.5">
          <span className={labelClass}>Customer name</span>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <span className={labelClass}>Photo (optional)</span>
          <ImageSlots
            images={[photo]}
            setImages={(v) => setPhoto(v[0] ?? "")}
          />
        </div>

        <div className="space-y-1.5">
          <span className={labelClass}>Stars</span>
          <select
            className={inputClass}
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <span className={labelClass}>Review</span>
          <textarea
            rows={4}
            className={inputClass}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button className={btnClass} disabled={saving} onClick={() => void save()}>
          {saving ? "Saving…" : "Add review"}
        </button>
      </div>

      <div className="space-y-3">
        {list?.map((r) => (
          <div
            key={r.id}
            className="flex items-start gap-3 border border-border bg-card p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-base">
                {r.name} · {r.stars}★
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{r.review_text}</p>
            </div>
            <button
              aria-label="Delete review"
              className="p-2 text-muted-foreground hover:text-destructive"
              onClick={async () => {
                await supabase.from("reviews").delete().eq("id", r.id);
                toast("Review removed");
                await load();
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- sheet sync tab ---------------- */

function SyncTab() {
  const [busy, setBusy] = useState(false);

  const sync = async () => {
    const url = getSheetUrl();
    if (!url) { toast.error("Add your Google Sheet CSV link in Settings"); return; }
    setBusy(true);
    try {
      const rows = await fetchSheetProducts(url);
      if (!rows.length) throw new Error("No rows found in that sheet");
      const { error } = await supabase.from("products").insert(
        rows.map((p) => ({
          name: p.name,
          price: p.price,
          fabric: p.fabric,
          color: p.color,
          description: p.description ?? "",
          images: p.images,
          in_stock: p.inStock ?? true,
          is_bestseller: p.isBestseller ?? false,
        })),
      );
      if (error) throw error;
      await refreshCatalog();
      toast.success(`${rows.length} sarees imported from your sheet`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not read that sheet",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="border border-gold/50 bg-secondary px-4 py-3 text-sm text-muted-foreground">
        Your sheet columns should be: name, price, fabric, color, description,
        image1_url, image2_url, image3_url, is_bestseller, in_stock.
      </p>
      <button className={btnClass} disabled={busy} onClick={() => void sync()}>
        {busy ? "Syncing…" : "Sync from Google Sheet"}
      </button>
    </div>
  );
}

/* ---------------- shell ---------------- */

function Admin() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState<Tab>("Products");

  useEffect(() => {
    setUnlocked(window.localStorage.getItem(ADMIN_KEY) === "true");
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!unlocked) return <Login onUnlock={() => setUnlocked(true)} />;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="text-center">
        <h1 className="text-3xl">Boutique Admin</h1>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border px-3 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
              tab === t
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "Products" && <ProductsTab />}
        {tab === "Settings" && <SettingsTab />}
        {tab === "Reviews" && <ReviewsTab />}
        {tab === "Sheet Sync" && <SyncTab />}
      </div>

      <button
        className="mt-12 w-full py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        onClick={() => {
          window.localStorage.removeItem(ADMIN_KEY);
          setUnlocked(false);
        }}
      >
        Log out
      </button>
    </main>
  );
}
