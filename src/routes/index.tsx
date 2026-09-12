import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";
import { Spinner } from "@/components/Spinner";
import { useCatalogLoader } from "@/lib/catalog";
import { heroSlides, useCatalog } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: "/hero1.webp" },
    ],
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
  return (
    <>
      {/* This style makes browser load image before React */}
      <link rel="preload" as="image" href="/hero1.webp" fetchPriority="high" />
      <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden bg-[#120a0d]">
        <img
          src="/hero1.webp"
          alt="AK Drapes Festive Edit"
          width={1080}
          height={1350}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="mt-4 font-serif text-[40px] sm:text-[64px]">SAREE</h1>
          <p className="mt-3 text-[13px] text-white/70">The Festive Edit 2026</p>
          <Link to="/shop" className="mt-8 bg-[#7B1E2E] px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white">Shop Now</Link>
        </div>
      </section>
    </>
  );
}

function Home() {
  const loading = useCatalogLoader();
  const catalog = useCatalog();
  const bestsellers = catalog.filter((p) => p.isBestseller!== false);
  const shown = (bestsellers.length? bestsellers : catalog).slice(0, 8);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Curated by hand</p>
        <h2 className="mt-3 text-3xl sm:text-4xl">Bestsellers</h2>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
        {loading? <Spinner label="Loading the edit" /> : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {shown.map((p, index) => <ProductCard key={p.id} product={p} index={index} />)}
          </div>
        )}
        <Link to="/shop" className="jewelry-button mt-14 inline-block bg-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary-foreground">Shop all drapes</Link>
      </section>
      <Reviews />
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl">From the House of AK Drapes</h2>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
        <p className="mt-6 text-sm leading-loose text-muted-foreground">Every AK Drapes piece is handpicked, not mass-produced. We travel to source the finest authentic designer sarees and curate them in limited numbers — so what arrives at your door feels personal, exclusive, and truly yours. From our studio to homes across India and beyond, we personally check, finish, and pack each drape with care. This is slow fashion you will want to live in, and never want to leave.</p>
      </section>
    </>
  );
}