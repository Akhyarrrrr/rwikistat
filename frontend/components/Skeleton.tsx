export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-ink-200 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-ink-200" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-1/3 rounded bg-ink-200" />
          <div className="h-2 w-1/4 rounded bg-ink-100" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded bg-ink-200" />
      <div className="h-3 w-full rounded bg-ink-100" />
      <div className="h-3 w-2/3 rounded bg-ink-100" />
    </div>
  );
}

export function SkeletonLine({ width = "w-full" }: { width?: string }) {
  return <div className={`h-3 animate-pulse rounded bg-ink-200 ${width}`} />;
}

export function SkeletonAvatar() {
  return <div className="size-10 animate-pulse rounded-xl bg-ink-200" />;
}
