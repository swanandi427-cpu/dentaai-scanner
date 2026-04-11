import LogoCircle from "@/components/LogoCircle";
import { useScanContext } from "@/context/ScanContext";
import { generateScanResult } from "@/utils/scanSimulation";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ANALYSIS_STEPS = [
  { label: "Detecting tooth boundaries…", detail: "Mapping 32-tooth anatomy" },
  {
    label: "Analyzing enamel condition…",
    detail: "Checking surface integrity",
  },
  { label: "Checking for cavities…", detail: "Running cavity detection model" },
  { label: "Evaluating gum health…", detail: "Periodontal assessment" },
  { label: "Generating report…", detail: "Calculating health scores" },
];

const STEP_DURATIONS = [500, 500, 500, 500, 500];

// Neural network node positions
const NODES = [
  { x: 15, y: 20 },
  { x: 35, y: 10 },
  { x: 55, y: 18 },
  { x: 75, y: 8 },
  { x: 88, y: 25 },
  { x: 10, y: 45 },
  { x: 28, y: 38 },
  { x: 50, y: 42 },
  { x: 70, y: 35 },
  { x: 90, y: 48 },
  { x: 18, y: 65 },
  { x: 40, y: 60 },
  { x: 60, y: 68 },
  { x: 80, y: 58 },
  { x: 95, y: 70 },
  { x: 5, y: 80 },
  { x: 30, y: 78 },
  { x: 52, y: 85 },
  { x: 72, y: 80 },
  { x: 88, y: 88 },
  { x: 22, y: 30 },
  { x: 62, y: 28 },
  { x: 42, y: 50 },
  { x: 80, y: 46 },
  { x: 14, y: 55 },
  { x: 64, y: 82 },
  { x: 34, y: 90 },
  { x: 76, y: 72 },
];

const CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [0, 5],
  [1, 6],
  [2, 7],
  [3, 8],
  [4, 9],
  [5, 10],
  [6, 11],
  [7, 12],
  [8, 13],
  [9, 14],
  [10, 15],
  [11, 16],
  [12, 17],
  [13, 18],
  [14, 19],
  [1, 7],
  [6, 12],
  [11, 17],
  [20, 21],
  [21, 22],
  [22, 23],
  [20, 6],
  [21, 12],
  [22, 8],
  [24, 10],
  [25, 19],
  [26, 16],
  [27, 13],
];

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { capturedImages, setScanResult } = useScanContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [activeConnections, setActiveConnections] = useState<number[]>([]);
  const [progressPct, setProgressPct] = useState(0);
  const imageCount = capturedImages.length || 5;
  const doneRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    const total = STEP_DURATIONS.reduce((a, b) => a + b, 0);

    const startTime = Date.now();
    const rafInterval = setInterval(() => {
      const t = (Date.now() - startTime) / total;
      setProgressPct(Math.min(t * 95, 95));
    }, 50);

    for (const [i, dur] of STEP_DURATIONS.entries()) {
      const startDelay = elapsed;
      timers.push(
        setTimeout(() => {
          setCurrentStep(i);
          const nodeSet = Array.from({ length: 10 }, () =>
            Math.floor(Math.random() * NODES.length),
          );
          setActiveNodes(nodeSet);
          const connSet = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * CONNECTIONS.length),
          );
          setActiveConnections(connSet);
        }, startDelay),
      );
      elapsed += dur;
      timers.push(
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, i]);
        }, elapsed - 100),
      );
    }

    timers.push(
      setTimeout(() => {
        if (doneRef.current) return;
        doneRef.current = true;
        clearInterval(rafInterval);
        setProgressPct(100);
        const result = generateScanResult(imageCount);
        setScanResult(result);
        setTimeout(() => navigate({ to: "/results" }), 500);
      }, elapsed + 400),
    );

    return () => {
      for (const t of timers) clearTimeout(t);
      clearInterval(rafInterval);
    };
  }, []);

  const step = ANALYSIS_STEPS[currentStep];

  return (
    <div
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      data-ocid="analysis.loading_state"
    >
      {/* Animated background */}
      <div className="absolute inset-0 hero-grid-mesh pointer-events-none opacity-30" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.78 0.16 80 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="glow-orb w-72 h-72 top-10 left-1/4"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="glow-orb w-48 h-48 bottom-20 right-1/4"
        style={{ animationDelay: "4s" }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-card/40 backdrop-blur-sm relative z-20">
        <LogoCircle size="sm" />
        <div className="hud-telemetry text-center animate-hud-flicker">
          <span>NEURAL ANALYSIS SYSTEM v2.4</span>
        </div>
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: "oklch(0.88 0.18 85)",
            boxShadow: "0 0 6px oklch(0.88 0.18 85)",
          }}
        />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10 gap-6">
        {/* Neural network visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-sm aspect-[4/3] glass-card rounded-3xl overflow-hidden"
          style={{ border: "1px solid oklch(0.78 0.16 80 / 0.4)" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            aria-label="Neural network visualization"
            role="img"
          >
            <title>Neural network</title>
            {CONNECTIONS.map((conn, connIdx) => {
              const a = conn[0];
              const b = conn[1];
              const nodeA = NODES[a ?? 0];
              const nodeB = NODES[b ?? 0];
              if (!nodeA || !nodeB) return null;
              const isActive = activeConnections.includes(connIdx);
              const connKey = `c${a}-${b}-${connIdx}`;
              return (
                <line
                  key={connKey}
                  x1={nodeA.x}
                  y1={nodeA.y}
                  x2={nodeB.x}
                  y2={nodeB.y}
                  stroke={
                    isActive
                      ? "oklch(0.88 0.18 85 / 0.7)"
                      : "oklch(0.78 0.16 80 / 0.2)"
                  }
                  strokeWidth={isActive ? "0.6" : "0.3"}
                  style={{
                    transition: "stroke 0.4s ease, stroke-width 0.4s ease",
                  }}
                />
              );
            })}
            {NODES.map((node, nodeIdx) => {
              const isActive = activeNodes.includes(nodeIdx);
              const nodeKey = `n${node.x}-${node.y}`;
              return (
                <circle
                  key={nodeKey}
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? "1.8" : "1.2"}
                  fill={
                    isActive
                      ? "oklch(0.88 0.18 85)"
                      : "oklch(0.78 0.16 80 / 0.4)"
                  }
                  style={{ transition: "all 0.4s ease" }}
                >
                  {isActive && (
                    <animate
                      attributeName="r"
                      values="1.8;2.6;1.8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              );
            })}
          </svg>

          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute left-0 right-0 animate-scan-line"
              style={{
                height: "1.5px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.88 0.18 85 / 0.9), transparent)",
                boxShadow: "0 0 8px 2px oklch(0.88 0.18 85 / 0.6)",
              }}
            />
          </div>

          <div className="absolute top-3 left-3">
            <p className="hud-telemetry">NEURAL SCAN NETWORK</p>
          </div>
          <div className="absolute top-3 right-3">
            <p className="hud-telemetry">{imageCount} IMG</p>
          </div>

          {/* Step indicator inside card */}
          <div className="absolute bottom-3 left-3 right-3">
            <div
              className="hud-telemetry text-[9px] text-center"
              style={{ color: "oklch(0.88 0.18 85 / 0.7)" }}
            >
              {step?.label?.toUpperCase() ?? "PROCESSING..."}
            </div>
          </div>
        </motion.div>

        {/* Spinner + step label */}
        <div className="relative flex flex-col items-center gap-3">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "oklch(0.88 0.18 85)",
                borderRightColor: "oklch(0.78 0.16 80 / 0.4)",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              className="absolute inset-2 rounded-full border border-transparent"
              style={{
                borderBottomColor: "oklch(0.78 0.16 80 / 0.3)",
                animation: "spin 1.8s linear infinite reverse",
              }}
            />
            <LogoCircle size="md" animate />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="font-display font-bold text-lg text-gradient-gold">
                {step?.label}
              </p>
              <p className="text-xs text-muted-foreground hud-telemetry mt-1">
                {step?.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step checklist — 5 steps */}
        <div className="w-full max-w-sm flex flex-col gap-2">
          {ANALYSIS_STEPS.map((s, i) => {
            const isDone = completedSteps.includes(i);
            const isActive = i === currentStep && !isDone;
            const isPending = i > currentStep;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3"
                style={
                  isDone
                    ? { borderColor: "oklch(0.78 0.16 80 / 0.4)" }
                    : undefined
                }
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone
                      ? "bg-primary/20 circle-glow-ring"
                      : isActive
                        ? "bg-primary/10 border border-primary/50"
                        : "bg-muted/50"
                  }`}
                >
                  {isDone ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                      className="text-primary text-sm font-bold"
                    >
                      ✓
                    </motion.span>
                  ) : isActive ? (
                    <div
                      className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: "oklch(0.78 0.16 80)",
                        borderTopColor: "transparent",
                      }}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${isDone ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </p>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground hud-telemetry"
                    >
                      {s.detail}
                    </motion.p>
                  )}
                </div>
                {isDone && (
                  <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    Done
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs text-muted-foreground hud-telemetry mb-2">
            <span>ANALYSIS PROGRESS</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                background:
                  "linear-gradient(90deg, oklch(0.72 0.16 80), oklch(0.88 0.18 85), oklch(0.92 0.18 88))",
                boxShadow: "0 0 12px oklch(0.78 0.16 80 / 0.6)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
