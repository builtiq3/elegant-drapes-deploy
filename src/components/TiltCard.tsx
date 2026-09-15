import { useRef, type ReactNode } from "react";

/**
 * 3D tilt wrapper. Tilt is desktop-only (fine pointer); touch devices get the
 * static card so scrolling stays at 60fps.
 */
export function TiltCard({
  children,
  className = "",
  max = 12,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * max * 2}deg) rotateX(${
      -py * max * 2
    }deg) translateZ(0)`;
    el.style.setProperty("--gloss-x", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gloss-y", `${(py + 0.5) * 100}%`);
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`ak-tilt ${className}`}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      {children}
    </div>
  );
}
