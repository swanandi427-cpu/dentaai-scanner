import { useEffect, useRef, useState } from "react";

interface Props {
  score: number;
  severity?: "mild" | "moderate" | "severe";
}

const SEVERITY_LABEL: Record<string, string> = {
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

export default function HealthScoreGauge({ score, severity }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Count-up animation
      let current = 0;
      const step = Math.ceil(score / 60);
      intervalRef.current = setInterval(() => {
        current += step;
        if (current >= score) {
          setAnimatedScore(score);
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          setAnimatedScore(current);
        }
      }, 20);
    }, 300);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [score]);

  const progress = animatedScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const color =
    score >= 70
      ? "oklch(0.72 0.18 142)"
      : score >= 40
        ? "oklch(0.82 0.18 75)"
        : "oklch(0.62 0.22 25)";

  const label = score >= 70 ? "Excellent" : score >= 40 ? "Fair" : "Needs Care";

  const filterColor =
    score >= 70
      ? "oklch(0.72 0.18 142 / 0.75)"
      : score >= 40
        ? "oklch(0.82 0.18 75 / 0.75)"
        : "oklch(0.62 0.22 25 / 0.75)";

  const severityBg =
    !severity || severity === "mild"
      ? "oklch(0.72 0.18 142 / 0.12)"
      : severity === "moderate"
        ? "oklch(0.82 0.18 75 / 0.12)"
        : "oklch(0.62 0.22 25 / 0.12)";

  const severityBorder =
    !severity || severity === "mild"
      ? "oklch(0.72 0.18 142 / 0.4)"
      : severity === "moderate"
        ? "oklch(0.82 0.18 75 / 0.4)"
        : "oklch(0.62 0.22 25 / 0.4)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        {/* Pulsing outer ring */}
        <div
          className="animate-ring-pulse rounded-full absolute inset-[-8px] pointer-events-none"
          style={{ border: `2px solid ${color}` }}
        />

        {/* Background radial glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: color }}
        />

        {/* Second glow layer for depth */}
        <div
          className="absolute inset-4 rounded-full opacity-10 blur-xl"
          style={{ backgroundColor: color }}
        />

        <svg
          viewBox="0 0 180 180"
          className="w-full h-full -rotate-90"
          role="img"
          aria-label={`Health score ${score} out of 100`}
          style={{
            filter: `drop-shadow(0 0 14px ${filterColor})`,
          }}
        >
          {/* Outer track (thin decorative) */}
          <circle
            cx="90"
            cy="90"
            r={radius + 12}
            fill="none"
            stroke="oklch(0.28 0.03 75 / 0.3)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
          {/* Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.03 75)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? strokeDashoffset : circumference}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset 1.6s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-display font-black tabular-nums"
            style={{ color, textShadow: `0 0 20px ${color}` }}
          >
            {animatedScore}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.18em] font-semibold">
            Health Score
          </span>
        </div>
      </div>

      {/* Quality label */}
      <div
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color, textShadow: `0 0 12px ${color}` }}
      >
        {label}
      </div>

      {/* Severity pill */}
      {severity && (
        <div
          className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{
            background: severityBg,
            border: `1px solid ${severityBorder}`,
            color,
          }}
        >
          {SEVERITY_LABEL[severity]} Severity
        </div>
      )}
    </div>
  );
}
