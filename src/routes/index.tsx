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
      {/* Preload saree hero image */}
      <link rel="preload" as="image" href="/hero1.webp" fetchPriority="high" />
      <style>{`
        @keyframes drapeWave {
          0% { transform: translateX(0) skewX(0deg); }
          50% { transform: translateX(-28px) skewX(-6deg); }
          100% { transform: translateX(0) skewX(0deg); }
        }
        @keyframes drapeSway {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(0.6deg) translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ak-eyebrow { animation: fadeUp 0.6s ease both; }
        .ak-title { animation: fadeUp 0.8s ease both; }
        .ak-para { animation: fadeUp 1s ease both; }
        .ak-cta { animation: fadeUp 1.2s ease both; }
        .ak-wave-1 { animation: drapeWave 7s ease-in-out infinite; }
        .ak-wave-2 { animation: drapeWave 9s ease-in-out infinite; }
        .ak-wave-3 { animation: drapeWave 11s ease-in-out infinite; }
        .ak-pallu { animation: drapeSway 8s ease-in-out infinite; transform-origin: top center; }
      `}</style>
      <section className="relative w-full overflow-hidden bg-[#F9F5EF]">
        {/* Mobile: saree pic as background */}
        <div aria-hidden className="absolute inset-0 md:hidden">
          <img
            src="/hero1.webp"
            alt=""
            loading="eager"
            decoding="sync"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          {/* readability veil over bg photo */}
          <div className="absolute inset-0 bg-[#F9F5EF]/88" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F9F5EF]/95 via-[#F9F5EF]/75 to-[#F9F5EF]/95" />
        </div>
        {/* 3 fabric wave layers - drapeWave */}
        <div aria-hidden className="ak-wave-1 pointer-events-none absolute -left-[10%] top-[8%] h-[420px] w-[120%] rounded-[100%] bg-[#EFE6D8]/70 blur-[1px]" />
        <div aria-hidden className="ak-wave-2 pointer-events-none absolute -left-[10%] top-[16%] h-[420px] w-[120%] rounded-[100%] bg-[#E8DCCB]/60" />
        <div aria-hidden className="ak-wave-3 pointer-events-none absolute -left-[10%] top-[24%] h-[420px] w-[120%] rounded-[100%] bg-[#F4EDE2]/80" />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:py-20">
          {/* Left: AAVIRA copy */}
          <div className="text-left">
            <p className="ak-eyebrow text-[10px] font-medium uppercase tracking-[0.3em] text-[#8B7355]">
              NEW SEASON
            </p>
            <h1
              className="ak-title mt-4 text-[42px] leading-[1.05] sm:text-[56px]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#2B211C' }}
            >
              <span className="block font-bold">New Season,</span>
              <span className="block font-light italic text-[#5A4A3A]">New Expressions</span>
            </h1>
            <p
              className="ak-para mt-5 max-w-[420px] text-[14px] leading-relaxed text-[#6B6B6B]"
              style={{ maxWidth: '420px' }}
            >
              Discover contemporary saree silhouettes crafted for effortless everyday elegance & festive grace.
            </p>
            <div className="ak-cta mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="inline-block bg-[#3A2A2A] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                SHOP NEW COLLECTION
              </Link>
              <Link
                to="/shop"
                className="inline-block border border-[#3A2A2A] bg-transparent px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3A2A2A] transition-colors duration-300 hover:bg-[#3A2A2A] hover:text-white"
              >
                EXPLORE SAREES
              </Link>
            </div>
            {/* Trust badges */}
            <div className="mt-10 flex flex-row items-center gap-6 border-t border-[#EDE6DA] pt-5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#5A4A3A]">
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 9c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
                  <path d="M3 13c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
                  <path d="M3 17c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
                </svg>
                Premium Fabrics
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3l1.8 4.6L18 9.2l-4.2 1.6L12 15.5l-1.8-4.7L6 9.2l4.2-1.6L12 3z" />
                  <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
                </svg>
                Finest Craftsmanship
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Custom Draping
              </span>
            </div>
          </div>

          {/* Right: saree model image - desktop only (mobile uses bg) */}
          <div className="relative mx-auto hidden w-full max-w-[440px] md:block">
            <div className="ak-pallu overflow-hidden rounded-t-[999px] rounded-b-[24px] border border-[#EDE6DA] bg-[#EDE6DA] shadow-[0_30px_70px_-28px_rgba(58,42,42,0.45)]">
              <img
                src="/hero1.webp"
                alt="AK Drapes contemporary saree - New Season New Expressions"
                width={880}
                height={1100}
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                style={{ width: '100%', height: '100%', minHeight: '520px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div aria-hidden className="absolute -bottom-4 left-1/2 h-[28px] w-[70%] -translate-x-1/2 rounded-[100%] bg-[#3A2A2A]/15 blur-[10px]" />
          </div>
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