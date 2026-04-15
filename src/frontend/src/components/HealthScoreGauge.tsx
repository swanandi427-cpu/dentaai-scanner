import { AnimatePresence, motion } from "motion/react";
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

function getScoreCommentary(s: number) {
  if (s <= 40) return { label: "Critical", color: "oklch(0.62 0.22 25)" };
  if (s <= 65) return { label: "Moderate Risk", color: "oklch(0.82 0.18 75)" };
  if (s <= 80) return { label: "Good", color: "oklch(0.78 0.16 80)" };
  return { label: "Excellent", color: "oklch(0.72 0.18 142)" };
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export default function HealthScoreGauge({ score, severity }: Props) {
  const [phase, setPhase] = useState<"scanning" | "counting" | "done">(
    "scanning",
  );
  const [displayScore, setDisplayScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 2000; // 2 second count-up

  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = displayScore / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const arcColor =
    score >= 70
      ? "oklch(0.72 0.18 142)"
      : score >= 40
        ? "oklch(0.82 0.18 75)"
        : "oklch(0.62 0.22 25)";

  const filterColor =
    score >= 70
      ? "oklch(0.72 0.18 142 / 0.75)"
      : score >= 40
        ? "oklch(0.82 0.18 75 / 0.75)"
        : "oklch(0.62 0.22 25 / 0.75)";

  const commentary = getScoreCommentary(score);

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

  useEffect(() => {
    // Phase 1: "SCANNING..." for 600ms
    const scanTimeout = setTimeout(() => {
      setPhase("counting");
      // Phase 2: rAF-driven easeOutCubic count-up over 2 seconds
      startTimeRef.current = null;

      function tick(now: number) {
        if (startTimeRef.current === null) {
          startTimeRef.current = now;
        }
        const elapsed = now - startTimeRef.current;
        const t = Math.min(elapsed / DURATION, 1);
        const easedValue = Math.round(easeOutCubic(t) * score);
        setDisplayScore(easedValue);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayScore(score);
          // Phase 3: pulse on completion
          setTimeout(() => {
            setPhase("done");
            setShowPulse(true);
          }, 80);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(scanTimeout);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        {/* Outer pulsing ring */}
        <div
          className="animate-ring-pulse rounded-full absolute inset-[-8px] pointer-events-none"
          style={{ border: `2px solid ${arcColor}` }}
        />

        {/* Expanding golden pulse ring — fires when final score reached */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key="score-reached-pulse"
              initial={{ scale: 0.9, opacity: 0.9 }}
              animate={{ scale: 2.1, opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: `3px solid ${arcColor}`,
                boxShadow: `0 0 24px 8px ${arcColor.replace(")", " / 0.45)")}`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Second pulse ring — offset */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key="score-reached-pulse-2"
              initial={{ scale: 0.9, opacity: 0.65 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 1.15, ease: "easeOut", delay: 0.14 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `2px solid ${arcColor}` }}
            />
          )}
        </AnimatePresence>

        {/* Third pulse ring — subtle */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              key="score-reached-pulse-3"
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: 3.0, opacity: 0 }}
              transition={{ duration: 1.35, ease: "easeOut", delay: 0.26 }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: `1px solid ${arcColor}` }}
            />
          )}
        </AnimatePresence>

        {/* Background radial glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: arcColor }}
        />

        <svg
          viewBox="0 0 180 180"
          className="w-full h-full -rotate-90"
          role="img"
          aria-label={`Health score ${score} out of 100`}
          style={{ filter: `drop-shadow(0 0 14px ${filterColor})` }}
        >
          {/* Outer track (decorative dashes) */}
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
          {/* Progress arc — animated via stroke-dashoffset */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={
              phase === "scanning" ? circumference : strokeDashoffset
            }
            strokeLinecap="round"
            style={{
              // Smooth SVG arc transition in sync with rAF counter
              transition:
                phase === "counting"
                  ? "stroke-dashoffset 0.016s linear"
                  : "stroke 0.5s ease",
            }}
          />
          {/* Tip glow dot on arc head */}
          {phase !== "scanning" && displayScore > 2 && (
            <circle
              cx="90"
              cy={90 - radius}
              r={strokeWidth / 2 + 1}
              fill={arcColor}
              opacity={0.6}
              style={{
                filter: "blur(3px)",
                transformOrigin: "90px 90px",
                transform: `rotate(${progress * 360}deg)`,
              }}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "scanning" ? (
              <motion.span
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                className="hud-telemetry text-[10px] text-center px-2"
                style={{ color: arcColor }}
              >
                SCANNING…
              </motion.span>
            ) : (
              <motion.span
                key="score"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: showPulse ? [1, 1.12, 1] : 1,
                  opacity: 1,
                  textShadow: showPulse
                    ? [
                        `0 0 20px ${arcColor}`,
                        `0 0 40px ${arcColor}`,
                        `0 0 20px ${arcColor}`,
                      ]
                    : `0 0 20px ${arcColor}`,
                }}
                transition={
                  showPulse
                    ? { duration: 0.5, ease: "easeInOut" }
                    : { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
                }
                className="text-5xl font-display font-black tabular-nums"
                style={{ color: arcColor }}
              >
                {displayScore}
              </motion.span>
            )}
          </AnimatePresence>
          {phase !== "scanning" && (
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.18em] font-semibold">
              Health Score
            </span>
          )}
        </div>
      </div>

      {/* Commentary label */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            key="commentary"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold uppercase tracking-widest"
            style={{
              color: commentary.color,
              textShadow: `0 0 12px ${commentary.color}`,
            }}
          >
            {commentary.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Severity pill */}
      {severity && (
        <div
          className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
          style={{
            background: severityBg,
            border: `1px solid ${severityBorder}`,
            color: arcColor,
          }}
        >
          {SEVERITY_LABEL[severity]} Severity
        </div>
      )}
    </div>
  );
}
