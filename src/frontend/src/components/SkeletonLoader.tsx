import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export function SkeletonLoader({ lines = 3, className }: SkeletonLoaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      aria-label="Loading content"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton lines
          key={i}
          className="h-4 rounded-full animate-pulse"
          style={{
            background: `oklch(0.22 0.012 75 / ${0.5 + (i % 3) * 0.15})`,
            width: `${90 - i * 8}%`,
            boxShadow: "0 0 8px oklch(0.78 0.16 80 / 0.06)",
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glass-card rounded-3xl p-5 flex flex-col gap-4 border border-border/20",
        className,
      )}
      aria-label="Loading card"
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 animate-pulse"
          style={{ background: "oklch(0.22 0.015 75 / 0.6)" }}
        />
        <div className="flex flex-col gap-2 flex-1">
          <div
            className="h-4 rounded-full w-2/3 animate-pulse"
            style={{ background: "oklch(0.24 0.015 75 / 0.55)" }}
          />
          <div
            className="h-3 rounded-full w-1/2 animate-pulse"
            style={{ background: "oklch(0.20 0.01 75 / 0.45)" }}
          />
        </div>
        <div
          className="h-6 w-16 rounded-full shrink-0 animate-pulse"
          style={{ background: "oklch(0.22 0.015 75 / 0.5)" }}
        />
      </div>
      {/* Body lines */}
      <SkeletonLoader lines={3} />
      {/* Action row */}
      <div className="flex gap-2 mt-1">
        <div
          className="h-7 w-28 rounded-full animate-pulse"
          style={{ background: "oklch(0.22 0.015 75 / 0.5)" }}
        />
        <div
          className="h-7 w-20 rounded-full animate-pulse"
          style={{ background: "oklch(0.20 0.01 75 / 0.4)" }}
        />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default SkeletonLoader;
