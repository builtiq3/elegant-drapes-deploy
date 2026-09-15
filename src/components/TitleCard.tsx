import { motion, useReducedMotion } from "motion/react";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";

export function TiltCard({ children, index = 0 }: { children: ReactNode; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -24, y: x * 24, active: true });
  };

  return (
    <motion.article
      ref={ref}
      className={`tilt-card group ${tilt.active ? "is-tilting" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 80, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ type: "spring", stiffness: 105, damping: 18, delay: Math.min(index, 7) * 0.055 }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, active: false })}
      style={{ transformPerspective: 900 }}
    >
      <span className="tilt-gloss" aria-hidden="true" />
      {children}
    </motion.article>
  );
}