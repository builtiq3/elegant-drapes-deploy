import { useSettings } from "@/lib/catalog";

const MESSAGES = [
  "Complimentary shipping on all orders across India",
  "The Festive Edit 2026 — now live",
  "Handpicked drapes, curated in limited numbers",
  "Personal styling on WhatsApp, every day 10am–8pm",
];

export function Ticker() {
  const { announcement } = useSettings();
  const base = announcement
   ? [announcement,...MESSAGES.slice(1)]
    : MESSAGES;
  const strip = [...base,...base];
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full overflow-hidden bg-[#7B1E2E] py-2.5 text-primary-foreground">
      <div className="ticker-track flex w-max gap-12 whitespace-nowrap group-hover:[animation-play-state:paused]">
        {strip.map((m, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-[10px] uppercase tracking-[0.28em] text-[#f6efe6]"
          >
            {m}
            <span className="text-[hsl(43_60%_70%)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}