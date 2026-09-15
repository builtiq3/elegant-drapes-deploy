import { useEffect, useRef, useState } from "react";

/** Gold cursor dot — desktop pointer devices only. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    let x = 0;
    let y = 0;
    let raf = 0;

    const render = () => {
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const hot = !!t?.closest("a, button, input, select, textarea, [role='button']");
      ref.current?.classList.toggle("is-hot", hot);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return <div ref={ref} aria-hidden className="ak-cursor" />;
}
