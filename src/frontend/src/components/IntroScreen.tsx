import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "dantanova_intro_shown";
const TAGLINE = "Because Every Smile Matters The Most";
const TAGLINE_CHARS = TAGLINE.split("").map((char, pos) => ({ char, pos }));

// 24 particles with varied trajectories
const PARTICLES = Array.from({ length: 24 }).map((_, idx) => {
  const angle = (idx / 24) * Math.PI * 2 + (idx % 3) * 0.18;
  const dist = 60 + (idx % 5) * 22 + Math.sin(idx * 1.3) * 12;
  const size = 4 + (idx % 4) * 2;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    id: `pt${idx}`,
    idx,
    size,
    // cubic-bezier easing via duration variation
    duration: 0.55 + (idx % 4) * 0.12,
    delay: idx * 0.008,
  };
});

// Neural network nodes for background
const NEURAL_NODES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  x: 8 + (i % 6) * 17 + Math.sin(i * 1.7) * 5,
  y: 10 + Math.floor(i / 6) * 30 + Math.cos(i * 1.2) * 8,
  active: i % 3 !== 0,
}));

export default function IntroScreen() {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch {
      return false;
    }
  });
  const [phase, setPhase] = useState<
    "logo-in" | "burst" | "scan" | "tagline" | "fade-out"
  >("logo-in");
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setPhase("burst"), 500);
    const t2 = setTimeout(() => setPhase("scan"), 1100);
    const t3 = setTimeout(() => setPhase("tagline"), 1600);
    const t4 = setTimeout(() => setPhase("fade-out"), 2900);
    const t5 = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }, 3500);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade-out" ? 0 : 1 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
        style={{ background: "oklch(0.04 0.008 70)" }}
        aria-hidden="true"
      >
        {/* Deep radial bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.26 0.09 82 / 0.35) 0%, oklch(0.14 0.05 78 / 0.12) 45%, transparent 70%)",
          }}
        />

        {/* Secondary outer glow ring */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 50%, oklch(0.22 0.07 78 / 0.08) 70%, transparent 85%)",
          }}
        />

        {/* Grid mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20 hero-grid-mesh" />

        {/* Neural network background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.12 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          role="presentation"
        >
          {NEURAL_NODES.map((node, ni) =>
            NEURAL_NODES.slice(ni + 1, ni + 3).map((target) => (
              <line
                key={`${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="oklch(0.88 0.18 85)"
                strokeWidth="0.15"
                strokeOpacity={node.active ? 0.8 : 0.3}
              />
            )),
          )}
          {NEURAL_NODES.map((node) => (
            <circle
              key={`nc-${node.id}`}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.active ? 0.5 : 0.3}
              fill="oklch(0.88 0.18 85)"
              opacity={node.active ? 0.9 : 0.4}
            />
          ))}
        </svg>

        {/* Corner HUD brackets — all 4 corners */}
        {(
          [
            { cls: "top-6 left-6 border-t-2 border-l-2", delay: 0.1, id: "tl" },
            {
              cls: "top-6 right-6 border-t-2 border-r-2",
              delay: 0.17,
              id: "tr",
            },
            {
              cls: "bottom-6 left-6 border-b-2 border-l-2",
              delay: 0.24,
              id: "bl",
            },
            {
              cls: "bottom-6 right-6 border-b-2 border-r-2",
              delay: 0.31,
              id: "br",
            },
          ] as const
        ).map(({ cls, delay, id }) => (
          <motion.div
            key={`bracket-${id}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className={`absolute w-10 h-10 ${cls}`}
            style={{ borderColor: "oklch(0.88 0.18 85 / 0.7)" }}
          />
        ))}

        {/* HUD edge tick marks */}
        {[15, 30, 50, 70, 85].map((pct) => (
          <motion.div
            key={`tick-top-${pct}`}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.3, scaleY: 1 }}
            transition={{ delay: 0.4 + pct * 0.003, duration: 0.3 }}
            className="absolute top-0 w-px h-2 pointer-events-none"
            style={{
              left: `${pct}%`,
              background: "oklch(0.88 0.18 85)",
            }}
          />
        ))}

        {/* Scan line — full screen sweep bottom-to-top */}
        <AnimatePresence>
          {phase === "scan" && (
            <motion.div
              key="scanline"
              ref={scanRef}
              initial={{ top: "100%", opacity: 0 }}
              animate={{ top: "-2px", opacity: [0, 1, 1, 0.7, 0] }}
              transition={{ duration: 0.62, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute left-0 right-0 pointer-events-none"
              style={{ height: "3px" }}
            >
              {/* Main scan line */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.88 0.18 85 / 0.5) 15%, oklch(0.96 0.2 88) 40%, oklch(1 0.22 88) 50%, oklch(0.96 0.2 88) 60%, oklch(0.88 0.18 85 / 0.5) 85%, transparent 100%)",
                  boxShadow:
                    "0 0 18px 5px oklch(0.88 0.18 85 / 0.85), 0 0 60px 12px oklch(0.78 0.16 80 / 0.35)",
                }}
              />
              {/* Shimmer trail below scan line */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: "3px",
                  height: "40px",
                  background:
                    "linear-gradient(180deg, oklch(0.88 0.18 85 / 0.12) 0%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logo with burst particles */}
          <motion.div
            initial={{ scale: 0.05, opacity: 0 }}
            animate={{
              scale: phase === "burst" ? [1, 1.18, 1.0] : 1,
              opacity: 1,
            }}
            transition={{
              opacity: { duration: 0.42, ease: "easeOut" },
              scale:
                phase === "burst"
                  ? { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }
                  : { duration: 0.52, ease: [0.34, 1.56, 0.64, 1] },
            }}
            className="relative flex items-center justify-center"
          >
            {/* Radial bloom behind logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, oklch(0.88 0.18 85 / 0.22) 0%, transparent 65%)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Burst pulse ring */}
            <AnimatePresence>
              {(phase === "burst" || phase === "scan") && (
                <motion.div
                  key="burst-ring"
                  initial={{ scale: 0.7, opacity: 1 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{
                    duration: 0.85,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="absolute w-20 h-20 rounded-full pointer-events-none"
                  style={{
                    border: "2px solid oklch(0.88 0.18 85 / 0.85)",
                    boxShadow: "0 0 32px 8px oklch(0.78 0.16 80 / 0.45)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Second burst ring, delayed */}
            <AnimatePresence>
              {phase === "burst" && (
                <motion.div
                  key="burst-ring-2"
                  initial={{ scale: 0.6, opacity: 0.7 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{
                    duration: 0.75,
                    ease: "easeOut",
                    delay: 0.12,
                  }}
                  className="absolute w-20 h-20 rounded-full pointer-events-none"
                  style={{
                    border: "1px solid oklch(0.88 0.18 85 / 0.55)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* 24 gold particles */}
            {phase === "burst" &&
              PARTICLES.map(({ x, y, id, idx, size, duration, delay }) => (
                <motion.div
                  key={id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x, y, opacity: 0, scale: 0.15 }}
                  transition={{
                    duration,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay,
                  }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: size,
                    height: size,
                    top: "50%",
                    left: "50%",
                    marginTop: -(size / 2),
                    marginLeft: -(size / 2),
                    background: `oklch(${0.82 + (idx % 4) * 0.04} ${0.16 + (idx % 3) * 0.02} ${76 + (idx % 6) * 3})`,
                    boxShadow: `0 0 ${size + 2}px oklch(0.88 0.18 85 / 0.9)`,
                  }}
                />
              ))}

            {/* Pulsing concentric rings */}
            {[
              { s: 88, op: 0.2, dl: 0, id: "rl" },
              { s: 66, op: 0.16, dl: 0.35, id: "rm" },
              { s: 48, op: 0.12, dl: 0.7, id: "rs" },
            ].map(({ s, op, dl, id }) => (
              <motion.div
                key={id}
                className="absolute rounded-full border pointer-events-none"
                style={{
                  width: s,
                  height: s,
                  borderColor: `oklch(0.88 0.18 85 / ${op})`,
                }}
                animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0.18, 0.55] }}
                transition={{
                  duration: 2.2,
                  delay: dl,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* DN logo circle */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 40px oklch(0.88 0.18 85 / 0.5), 0 0 80px oklch(0.88 0.18 85 / 0.2)",
                  "0 0 60px oklch(0.88 0.18 85 / 0.75), 0 0 120px oklch(0.88 0.18 85 / 0.35)",
                  "0 0 40px oklch(0.88 0.18 85 / 0.5), 0 0 80px oklch(0.88 0.18 85 / 0.2)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative w-20 h-20 rounded-full flex items-center justify-center font-display font-black text-3xl z-10"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.2 88), oklch(0.76 0.21 74))",
                color: "oklch(0.08 0.005 60)",
              }}
            >
              DN
            </motion.div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.52, ease: "easeOut" }}
            className="font-display font-black text-4xl tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.18 90), oklch(0.76 0.2 76))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px oklch(0.78 0.16 80 / 0.55))",
            }}
          >
            DantaNova
          </motion.h1>

          {/* Tagline — character-by-character stagger */}
          <AnimatePresence>
            {(phase === "tagline" || phase === "fade-out") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap justify-center max-w-xs px-6"
                aria-label={TAGLINE}
              >
                {TAGLINE_CHARS.map(({ char, pos }) => (
                  <motion.span
                    key={`tl-${pos}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: pos * 0.026,
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    style={{
                      display: "inline-block",
                      fontFamily: '"Satoshi", system-ui, sans-serif',
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color:
                        char === " "
                          ? "transparent"
                          : "oklch(0.88 0.18 85 / 0.88)",
                      textShadow: "0 0 10px oklch(0.88 0.18 85 / 0.45)",
                      whiteSpace: "pre",
                      minWidth: char === " " ? "0.45ch" : undefined,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar + HUD status */}
          <AnimatePresence>
            {(phase === "tagline" || phase === "fade-out") && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-2 w-52"
                style={{ transformOrigin: "center" }}
              >
                <div
                  className="w-full h-px rounded-full overflow-hidden"
                  style={{ background: "oklch(0.22 0.03 80 / 0.4)" }}
                >
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full w-full"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.72 0.16 82), oklch(0.88 0.18 88), oklch(0.96 0.2 90))",
                    }}
                  />
                </div>
                <p className="hud-telemetry" style={{ fontSize: "0.56rem" }}>
                  AI DENTAL SYSTEM ■ ONLINE ■ v2.0
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
