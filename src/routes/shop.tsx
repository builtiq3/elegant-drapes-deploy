import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Spinner } from "@/components/Spinner";
import { useCatalogLoader } from "@/lib/catalog";
import { useCatalog } from "@/lib/shop";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop All Sarees | AK Drapes Boutique" },
      {
        name: "description",
        content:
          "Browse every AK Drapes saree — filter by fabric, colour and price to find your next handwoven drape.",
      },
      { property: "og:title", content: "Shop All Sarees | AK Drapes Boutique" },
      {
        property: "og:description",
        content: "Filter handwoven sarees by fabric, colour and price.",
      },
    ],
  }),
  component: Shop,
});

const PRICES = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: Infinity },
];

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2 text-left sm:flex-none">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-gold sm:w-52"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Shop() {
  const loading = useCatalogLoader();
  const products = useCatalog();
  const [fabric, setFabric] = useState("All fabrics");
  const [color, setColor] = useState("All colours");
  const [price, setPrice] = useState(PRICES[0]!.label);

  const fabrics = ["All fabrics", ...new Set(products.map((p) => p.fabric))];
  const colors = ["All colours", ...new Set(products.map((p) => p.color))];

  const list = useMemo(() => {
    const range = PRICES.find((p) => p.label === price) ?? PRICES[0]!;
    return products.filter(
      (p) =>
        (fabric === "All fabrics" || p.fabric === fabric) &&
        (color === "All colours" || p.color === color) &&
        p.price >= range.min &&
        p.price < range.max,
    );
  }, [fabric, color, price, products]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          The collection
        </p>
        <h1 className="mt-3 text-4xl">Shop All</h1>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-center gap-4 border-y border-border py-6">
        <Select label="Fabric" value={fabric} options={fabrics} onChange={setFabric} />
        <Select label="Colour" value={color} options={colors} onChange={setColor} />
        <Select
          label="Price"
          value={price}
          options={PRICES.map((p) => p.label)}
          onChange={setPrice}
        />
      </div>

      <p className="mt-6 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {list.length} {list.length === 1 ? "piece" : "pieces"}
      </p>

      {loading ? (
        <Spinner label="Loading the collection" />
      ) : (
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {list.map((p, index) => (
          <ProductCard key={p.id} product={p} index={index} />
        ))}
      </div>
      )}

      {!loading && list.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No drapes match this combination — try widening your filters.
        </p>
      )}
    </section>
  );
}
