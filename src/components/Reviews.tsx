import { Star } from "lucide-react";
import { useCloudReviews } from "@/lib/catalog";

const FALLBACK = [
  { name: "Ananya R.", text: "The Kanjivaram arrived wrapped like a gift. The weave is impeccable — everyone asked where it was from.", stars: 5, photo: null as string | null },
  { name: "Sneha M.", text: "I wore the organza drape to a sangeet and felt like the best dressed woman in the room.", stars: 5, photo: null as string | null },
  { name: "Farah K.", text: "Their styling advice over WhatsApp was so personal. It felt like shopping with a friend.", stars: 5, photo: null as string | null },
  { name: "Divya S.", text: "Quiet luxury, truly. The finish and fall of the fabric is far above what I expected.", stars: 5, photo: null as string | null },
  { name: "Ritika J.", text: "My third order this year. AK Drapes has quietly replaced every other boutique for me.", stars: 5, photo: null as string | null },
];

export function Reviews() {
  const cloud = useCloudReviews();
  const list =
    cloud && cloud.length
      ? cloud.map((r) => ({
          name: r.name,
          text: r.review_text,
          stars: r.stars,
          photo: r.photo_url,
        }))
      : FALLBACK;
  const strip = [...list, ...list];

  return (
    <section className="overflow-hidden border-y border-border bg-secondary/50 py-16">
      <div className="mb-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Kind words</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Loved by her</h2>
      </div>
      <div className="group flex w-max gap-6 ticker-track [animation-duration:45s] hover:[animation-play-state:paused]">
        {strip.map((r, i) => (
          <figure
            key={i}
            className="w-[300px] shrink-0 border border-gold/40 bg-card px-7 py-8 sm:w-[380px]"
          >
            <div className="flex gap-1 text-gold">
              {Array.from({ length: Math.max(1, Math.min(5, r.stars)) }).map((_, s) => (
                <Star key={s} size={13} className="fill-gold" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]">
              {r.photo && (
                <img
                  src={r.photo}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              {r.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
