import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
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
  heroSlides.forEach((s: any) => {
    const img = new Image();
    img.src = s.image;
  });
}, []);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden bg-[#120a0d]">

      {/* FALL ANIMATION ON FIRST LOAD */}
      <motion.div
        initial={{ y: -150, opacity: 0 }}
        animate={hasLoaded? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          type: "spring",
          stiffness: 80,
          damping: 18
        }}
        className="absolute inset-0"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={i}
            src={heroSlides[i]?.image}
            alt={heroSlides[i]?.subtitle}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            initial={{ y: -80, scale: 1.15, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/45" />
      </motion.div>

      {/* TEXT ALSO FALLS AFTER IMAGE */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={hasLoaded? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">
          {heroSlides[i]?.subtitle?.includes("2026")? "AK Drapes Boutique" : "The Festive Edit 2026"}
        </p>
        <h1 className="mt-4 font-serif text-[40px] leading-none sm:text-[64px]">
          {heroSlides[i]?.title}
        </h1>
        <p className="mt-3 text-[13px] text-white/70">
          {heroSlides[i]?.subtitle}
        </p>
        <Link
          to="/shop"
          className="mt-8 bg-[#7B1E2E] px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white"
        >
          Shop Now
        </Link>
      </motion.div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-[2px] transition-all ${idx === i? "w-8 bg-white" : "w-4 bg-white/30"}`}
          />
        ))}
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
            {shown.map((p, index) => (
              <ProductCard key={p.id} product={p} index={index} />
            ))}
          </div>
        )}
        <Link
          to="/shop"
          className="jewelry-button mt-14 inline-block bg-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.28em] text-primary-foreground"
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
