export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/40 border-t-primary" />
      <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
