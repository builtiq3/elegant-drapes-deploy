import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LOGO = "/favicon.webp";

const PARTICLES = Array.from({ length: 14 }, (_, index) => index);

function PageLoader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 250 : 1450);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.55, ease: "easeInOut" }}
          aria-label="Loading AK Drapes Boutique"
        >
          <div className="relative grid place-items-center">
            {!reduceMotion && PARTICLES.map((particle) => (
              <motion.span
                key={particle}
                className="loader-particle absolute h-1 w-1 rounded-full bg-gold"
                style={{ rotate: particle * (360 / PARTICLES.length), x: 78 }}
                animate={{ opacity: [0.12, 0.9, 0.12], scale: [0.5, 1.4, 0.5] }}
                transition={{ duration: 1.6, delay: particle * 0.06, repeat: Infinity }}
              />
            ))}
            <motion.img
              src={LOGO}
              alt="AK Drapes Boutique"
              className="h-24 w-24 rounded-full object-cover shadow-luxury"
              initial={{ opacity: 0, scale: 0.78, rotateY: 0 }}
              animate={{ opacity: 1, scale: 1, rotateY: reduceMotion ? 0 : 360 }}
              transition={{ duration: reduceMotion ? 0.2 : 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CustomCursor() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const cursor = document.querySelector<HTMLElement>("[data-luxury-cursor]");
    if (!cursor) return;
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%) scale(${active ? 3.2 : 1})`;
    };
    const over = (event: PointerEvent) => {
      const target = event.target;
      setActive(target instanceof Element && Boolean(target.closest("a, button, input, select, textarea, [data-cursor-hover]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [active]);

  return <span data-luxury-cursor className={active ? "luxury-cursor is-active" : "luxury-cursor"} />;
}

export function LuxuryExperience({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.92,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  return (
    <>
      <PageLoader />
      <div className="ambient-orb ambient-orb-gold" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-rose" aria-hidden="true" />
      <CustomCursor />
      {children}
    </>
  );
}