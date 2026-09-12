import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_KEY, fetchSheetProducts, getSheetUrl, refreshCatalog,
  SHEET_URL_KEY, uploadImage, BUCKET, type DbProduct, type DbReview,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/shop";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Boutique Admin | AK Drapes Boutique" },
      { name: "description", content: "Private admin area" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const FABRICS = ["Pure cotton","Pure Silk","Banarasi","Kanjivaram","Georgette","Chiffon","Cotton","Linen","Velvet","Crepe","Organza","Satin","Tussar Silk","Mysore Silk","Net","Jacquard","Brocade","Rayon","Polyester"];
const TABS = ["Products","Settings","Reviews","Sheet Sync"] as const;
type Tab = typeof TABS[number];
const inputClass = "w-full border border-border bg-card px-4 py-3.5 text-base outline-none focus:border-primary";
const labelClass = "block text-[11px] uppercase tracking-[0.22em] text-muted-foreground";
const btnClass = "w-full bg-primary px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60";

// --- SECURE SERVER CHECK - NO HARDCODING ---
const checkAdmin = createServerFn({ method: "POST" })
 .validator((d: { user: string; pass: string }) => d)
 .handler(async ({ data }) => {
    // Reads from Vercel Env only, never from code
    const envUser = process.env.ADMIN_USER;
    const envPass = process.env.ADMIN_PASS;
    if (!envUser ||!envPass) {
      console.error("ADMIN_USER / ADMIN_PASS not set in Vercel");
      return false;
    }
    return data.user === envUser && data.pass === envPass;
  });

function Login({ onUnlock }: { onUnlock: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-sm px-5 py-24 text-center">
      <h1 className="text-3xl">Boutique Admin</h1>
      <div className="gold-rule mx-auto mt-4 h-px w-24" />
      <form className="mt-8 space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const ok = await checkAdmin({ data: { user: user.trim(), pass: pass.trim() } });
        if (ok) {
          window.localStorage.setItem(ADMIN_KEY, "true");
          onUnlock();
        } else setError(true);
        setLoading(false);
      }}>
        <input type="text" value={user} onChange={e=>{setUser(e.target.value); setError(false);}} placeholder="Admin name" className={`${inputClass} text-center`} />
        <input type="password" value={pass} onChange={e=>{setPass(e.target.value); setError(false);}} placeholder="Admin password" className={`${inputClass} text-center tracking-[0.2em]`} />
        {error && <p className="text-xs text-destructive">Wrong name or password.</p>}
        <button type="submit" disabled={loading} className={btnClass}>{loading? "Checking..." : "Enter"}</button>
      </form>
    </main>
  );
}

// --- KEEP YOUR EXISTING TABS BELOW AS-IS ---
// Paste your ImageSlots, ProductsTab, SettingsTab, ReviewsTab, SyncTab, Admin components from old file here
// (I omitted to keep message short - keep them unchanged)