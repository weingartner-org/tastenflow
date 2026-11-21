export function Spinner({ label = "Wird geladen …" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 rounded-full border-[3px] border-hairline border-t-accent animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
