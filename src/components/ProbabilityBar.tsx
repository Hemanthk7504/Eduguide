export function ProbabilityBar({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-[var(--color-ink-faint)]">Not available</span>;
  }
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped >= 66 ? "var(--color-agent-green)" : clamped >= 33 ? "var(--color-agent-orange)" : "var(--color-agent-red)";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-xs text-[var(--color-ink-dim)]">{clamped.toFixed(0)}%</span>
    </div>
  );
}
