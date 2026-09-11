import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/ak-logo.png.asset.json";

const KEY = "ak-unlocked";
const PASSWORD = "ak2026";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const isAdmin = useRouterState({
    select: (s) => s.location.pathname.startsWith("/admin"),
  });

  useEffect(() => {
    setUnlocked(window.localStorage.getItem(KEY) === "true");
    setReady(true);
  }, []);

  if (isAdmin) return <>{children}</>;
  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-6">
      <div className="w-full max-w-sm rise text-center">
        <img
          src={logo.url}
          alt="AK Drapes Boutique"
          className="mx-auto h-28 w-28 rounded-full object-cover shadow-[0_18px_50px_-24px_rgba(123,30,46,0.55)]"
        />
        <h1 className="mt-8 text-3xl">AK Drapes Boutique</h1>
        <div className="gold-rule mx-auto mt-4 h-px w-24" />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Our festive collection is opening soon. Enter your private access
          password to preview the boutique.
        </p>

        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim().toLowerCase() === PASSWORD) {
              window.localStorage.setItem(KEY, "true");
              setUnlocked(true);
            } else {
              setError(true);
            }
          }}
        >
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Access password"
            autoComplete="current-password"
            className="w-full border border-gold/60 bg-background px-4 py-3 text-center text-sm tracking-[0.2em] outline-none focus:border-primary"
          />
          {error && (
            <p className="text-xs text-destructive">
              That password isn’t right. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="jewelry-button w-full bg-primary px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-primary-foreground"
          >
            Enter the boutique
          </button>
        </form>
      </div>
    </main>
  );
}
