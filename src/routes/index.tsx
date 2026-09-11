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
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24 });
  const textX = useTransform(smoothX, (value) => value * 0.02);
  const textY = useTransform(smoothY, (value) => value * 0.02);
  const productX = useTransform(smoothX, (value) => value * 0.05);
  const productY = useTransform(smoothY, (value) => value * 0.05);
  const dustX = useTransform(smoothX, (value) => value * 0.1);
  const dustY = useTransform(smoothY, (value) => value * 0.1);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="hero-stage relative h-[72svh] min-h-[420px] w-full overflow-hidden sm:h-[78vh] sm:min-h-[520px]"
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType === "touch") return;
        pointerX.set(event.clientX - window.innerWidth / 2);
        pointerY.set(event.clientY - window.innerHeight / 2);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <motion.div className="hero-word" style={{ x: textX, y: textY }} aria-hidden="true">
        SAREE
      </motion.div>
      <div className="hero-radial-glow" aria-hidden="true" />

      <motion.div className="hero-product-layer" style={{ x: productX, y: productY }}>
        <motion.div
          className="hero-product"
          animate={reduceMotion ? undefined : { y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={i}
              src={heroSlides[i]?.image}
              alt={heroSlides[i]?.subtitle ?? "AK Drapes festive saree"}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              className="h-full w-full object-cover"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.08, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            />
          </AnimatePresence>
        </motion.div>
        <div className="hero-depth-shadow" aria-hidden="true" />
      </motion.div>

      <motion.div className="hero-dust" style={{ x: dustX, y: dustY }} aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <span key={index} />)}
      </motion.div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center text-hero-foreground">
        <p className="text-[10px] uppercase tracking-[0.4em] text-hero-muted">
          AK Drapes Boutique
        </p>
        <h1 key={i} className="rise mt-4 max-w-3xl text-[2rem] leading-tight sm:text-6xl">
          {heroSlides[i]?.title}
        </h1>
        <p key={`s${i}`} className="rise mt-4 max-w-md text-sm text-hero-muted sm:text-base">
          {heroSlides[i]?.subtitle}
        </p>
        <Link
          to="/shop"
          className="jewelry-button mt-9 border border-hero-border bg-primary px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] text-primary-foreground"
        >
          Shop Now
        </Link>

        <div className="absolute bottom-7 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-[3px] w-9 transition-all ${idx === i ? "bg-hero-foreground" : "bg-hero-muted/40"}`}
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
