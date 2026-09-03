export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`card animate-pulse p-5 ${className}`}>
      <div className="mb-3 h-4 w-1/3 rounded bg-[var(--color-surface-2)]" />
      <div className="mb-2 h-3 w-full rounded bg-[var(--color-surface-2)]" />
      <div className="h-3 w-2/3 rounded bg-[var(--color-surface-2)]" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <CardSkeleton />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton className="h-40" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
