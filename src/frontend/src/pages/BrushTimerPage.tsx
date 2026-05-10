import { Link } from "@tanstack/react-router";
import { Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL = 120;
const QUADRANT_TIME = 30;

const quadrants = [
  { id: 0, label: "Upper Right", teeth: "Teeth 1–8" },
  { id: 1, label: "Upper Left", teeth: "Teeth 9–16" },
  { id: 2, label: "Lower Left", teeth: "Teeth 17–24" },
  { id: 3, label: "Lower Right", teeth: "Teeth 25–32" },
];

const motivational: Record<number, string> = {
  0: "Upper Right done — Great start!",
  1: "Upper Left done — Halfway there!",
  2: "Lower Left done — Almost done!",
  3: "Lower Right done — All four quadrants complete! 🎉",
};

export default function BrushTimerPage() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuadrant = Math.min(Math.floor(elapsed / QUADRANT_TIME), 3);
  const remaining = TOTAL - elapsed;
  const progress = elapsed / TOTAL;

  const tick = useCallback(() => {
    setElapsed((prev) => {
      const next = prev + 1;
      const prevQ = Math.floor(prev / QUADRANT_TIME);
      const nextQ = Math.floor(next / QUADRANT_TIME);
      if (nextQ > prevQ && nextQ <= 4) {
        const msg = motivational[prevQ];
        if (msg) {
          setMessage(msg);
          setTimeout(() => setMessage(""), 3000);
        }
      }
      if (next >= TOTAL) {
        setRunning(false);
        setDone(true);
        setMessage("All done! 🎉 Your teeth are sparkling clean!");
      }
      return Math.min(next, TOTAL);
    });
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setDone(false);
    setMessage("");
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  const RADIUS = 88;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b border-border/40 backdrop-blur"
        style={{ background: "oklch(0.10 0.006 70 / 0.92)" }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-base font-bold"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="brush.home_link"
          >
            DantaNova
          </Link>
          <Link
            to="/scan"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="brush.scan_link"
          >
            Free Scan →
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            2-Minute Brushing Guide
          </h1>
          <p className="text-muted-foreground">
            Brush each quadrant for 30 seconds. Your dentist will be proud.
          </p>
        </motion.div>

        <div className="flex flex-col items-center mb-10">
          <div className="relative w-52 h-52" data-ocid="brush.timer_display">
            <svg
              className="absolute inset-0"
              width="208"
              height="208"
              viewBox="0 0 208 208"
              role="img"
              aria-label="Brushing timer progress"
            >
              <circle
                cx="104"
                cy="104"
                r={RADIUS}
                fill="none"
                stroke="oklch(0.22 0.015 60)"
                strokeWidth="12"
              />
              <circle
                cx="104"
                cy="104"
                r={RADIUS}
                fill="none"
                stroke={done ? "oklch(0.72 0.17 150)" : "oklch(0.88 0.18 85)"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 104 104)"
                style={{
                  transition: "stroke-dashoffset 0.95s linear, stroke 0.3s",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-5xl font-extrabold tabular-nums"
                style={{
                  color: done ? "oklch(0.72 0.17 150)" : "oklch(0.88 0.18 85)",
                }}
              >
                {mins}:{secs}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {done ? "Complete!" : `Q${currentQuadrant + 1} of 4`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            {!done && (
              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                className="flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                  color: "oklch(0.08 0.005 60)",
                }}
                data-ocid="brush.start_pause_button"
              >
                {running ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {running ? "Pause" : elapsed === 0 ? "Start" : "Resume"}
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border border-border/50 transition-all hover:scale-105 hover:border-primary/40"
              style={{
                background: "oklch(0.12 0.008 60 / 0.8)",
                color: "oklch(0.88 0.18 85)",
              }}
              data-ocid="brush.reset_button"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mx-auto max-w-sm text-center px-5 py-3 rounded-xl mb-8 text-sm font-semibold"
              style={{
                background: "oklch(0.78 0.16 80 / 0.14)",
                color: "oklch(0.88 0.18 85)",
                border: "1px solid oklch(0.78 0.16 80 / 0.3)",
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="grid grid-cols-2 gap-4 mb-10"
          data-ocid="brush.quadrant_grid"
        >
          {quadrants.map((q) => {
            const isActive = !done && running && q.id === currentQuadrant;
            const isCompleted = elapsed >= (q.id + 1) * QUADRANT_TIME;
            return (
              <motion.div
                key={q.id}
                animate={isActive ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                transition={
                  isActive
                    ? { repeat: Number.POSITIVE_INFINITY, duration: 1.5 }
                    : {}
                }
                className="p-5 rounded-2xl border text-center transition-all"
                style={{
                  background: isCompleted
                    ? "oklch(0.42 0.15 145 / 0.15)"
                    : isActive
                      ? "oklch(0.78 0.16 80 / 0.14)"
                      : "oklch(0.12 0.008 60 / 0.85)",
                  borderColor: isCompleted
                    ? "oklch(0.62 0.17 145 / 0.5)"
                    : isActive
                      ? "oklch(0.88 0.18 85)"
                      : "oklch(0.22 0.015 60 / 0.5)",
                }}
                data-ocid={`brush.quadrant.${q.id + 1}`}
              >
                <div
                  className="text-2xl mb-1"
                  style={{
                    color: isCompleted
                      ? "oklch(0.62 0.17 145)"
                      : isActive
                        ? "oklch(0.88 0.18 85)"
                        : "oklch(0.55 0.03 70)",
                  }}
                >
                  {isCompleted ? "✓" : isActive ? "🦷" : "○"}
                </div>
                <div className="text-sm font-bold text-foreground">
                  {q.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {q.teeth}
                </div>
                <div
                  className="text-xs mt-1.5 font-semibold"
                  style={{
                    color: isCompleted
                      ? "oklch(0.62 0.17 145)"
                      : isActive
                        ? "oklch(0.88 0.18 85)"
                        : "oklch(0.45 0.02 60)",
                  }}
                >
                  {isCompleted ? "Done" : isActive ? "Brushing now…" : "30 sec"}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-2xl border border-border/40 mb-8"
              style={{ background: "oklch(0.42 0.15 145 / 0.12)" }}
              data-ocid="brush.completion_card"
            >
              <div className="text-5xl mb-3">🎉</div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "oklch(0.72 0.17 145)" }}
              >
                Brushing Complete!
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Your teeth are sparkling clean. Run a quick AI scan to check
                your oral health.
              </p>
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                  color: "oklch(0.08 0.005 60)",
                }}
                data-ocid="brush.scan_cta_button"
              >
                Run AI Scan Now
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-center text-muted-foreground">
          Tip: Brush in gentle circular motions. Never scrub side to side — it
          wears enamel.
        </p>
      </main>

      <footer
        className="border-t border-border/30 mt-16 py-8 text-center text-xs text-muted-foreground"
        style={{ background: "oklch(0.10 0.006 70 / 0.6)" }}
      >
        © {new Date().getFullYear()} DantaNova · Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
