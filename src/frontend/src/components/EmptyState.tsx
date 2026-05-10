import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon = "✦",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 py-12 px-6 text-center",
        className,
      )}
    >
      {/* CSS-drawn illustration: circle with icon + gold accent ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer gold glow ring */}
        <span
          className="absolute inset-0 rounded-full animate-ring-pulse"
          style={{
            background: "transparent",
            border: "2px solid oklch(0.78 0.16 80 / 0.25)",
            borderRadius: "9999px",
          }}
          aria-hidden="true"
        />
        {/* Middle ring */}
        <span
          className="absolute"
          style={{
            inset: "-8px",
            borderRadius: "9999px",
            border: "1px solid oklch(0.78 0.16 80 / 0.12)",
          }}
          aria-hidden="true"
        />
        {/* Icon circle */}
        <div
          className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full text-4xl"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.18 0.04 80 / 0.6), oklch(0.12 0.01 60 / 0.9))",
            border: "1px solid oklch(0.78 0.16 80 / 0.35)",
            boxShadow:
              "0 0 24px oklch(0.78 0.16 80 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.06)",
          }}
        >
          <span role="img" aria-hidden="true">
            {icon}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <h3
          className="font-display font-bold text-lg"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.75 0.19 75))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.18 75))",
            color: "oklch(0.08 0.005 60)",
            boxShadow:
              "0 0 20px oklch(0.78 0.16 80 / 0.35), 0 4px 14px oklch(0 0 0 / 0.2)",
          }}
          data-ocid="empty_state.button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
