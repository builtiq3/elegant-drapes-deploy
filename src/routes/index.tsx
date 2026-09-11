import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";
import { Spinner } from "@/components/Spinner";
import { useCatalogLoader } from "@/lib/catalog";
import { FALLBACK_IMAGE, heroSlides, useCatalog } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AK Drapes Boutique | Handwoven Festive Sarees 2026" },
      {
        name: "description",
        content:
          "Discover The Festive Edit 2026 at AK Drapes Boutique — handwoven silk, organza and Banarasi sarees curated in limited numbers.",
      },
      { property: "og:title", content: "AK Drapes Boutique | The Festive Edit 2026" },
      {
        property: "og:description",
        content: "Handwoven silk, organza and Banarasi drapes, curated for celebration.",
      },
    ],
  }),
  component: Home,
});

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden">
      {heroSlides.map((s, idx) => (
        <img
          key={idx}
          src={s.image}
          alt={s.subtitle}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/60" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/80">
          AK Drapes Boutique
        </p>
        <h1 key={i} className="rise mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">
          {heroSlides[i]?.title}
        </h1>
        <p key={`s${i}`} className="rise mt-4 max-w-md text-sm text-white/85 sm:text-base">
          {heroSlides[i]?.subtitle}
        </p>
        <Link
          to="/shop"
          className="mt-9 border border-white/70 px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] transition hover:bg-white hover:text-primary"
        >
          Shop Now
        </Link>

        <div className="absolute bottom-7 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-[3px] w-9 transition-all ${idx === i ? "bg-white" : "bg-white/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const loading = useCatalogLoader();
  const catalog = useCatalog();
  const bestsellers = catalog.filter((p) => p.isBestseller !== false);
  const shown = (bestsellers.length ? bestsellers : catalog).slice(0, 8);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Curated by hand
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl">Bestsellers</h2>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
        {loading ? (
          <Spinner label="Loading the edit" />
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        <Link
          to="/shop"
          className="mt-14 inline-block border border-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Shop all drapes
        </Link>
      </section>

      <Reviews />

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
       <h2 className="text-3xl sm:text-4xl">
  From the House of <span className="text-[#D18B94]  font-medium">zy_by_nilu</span>
</h2>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
        <p className="mt-6 text-sm leading-loose text-muted-foreground">
          Every AK Drapes piece is handpicked, not mass-produced. We travel to source the finest authentic designer sarees and curate them in limited numbers — so what arrives at your door feels personal, exclusive, and truly yours. From our studio in Thokot to homes across Mangalore, Dubai & beyond, we personally check, finish, and pack each drape with care. This is slow fashion you will want to live in, and never want to leave.
        </p>
      </section>
    </>
  );
}
