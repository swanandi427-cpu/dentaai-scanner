import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useScanHistory } from "@/hooks/useQueries";
import type { ScanResult, ToothRecord } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  LogIn,
  LogOut,
  Scan,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70
      ? "oklch(0.72 0.17 150)"
      : score >= 40
        ? "oklch(0.88 0.2 80)"
        : "oklch(0.63 0.26 27)";
  const radius = 14;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ - (score / 100) * circ;
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="absolute inset-0"
        role="img"
        aria-label={`Health score ${score}`}
      >
        <title>Health score {score}</title>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="oklch(0.22 0.015 60)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="text-[10px] font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function ToothBreakdownRow({ tooth }: { tooth: ToothRecord }) {
  const config = {
    healthy: {
      color: "text-green-400",
      icon: CheckCircle2,
      bg: "bg-green-500/10",
    },
    risk: {
      color: "text-yellow-400",
      icon: AlertTriangle,
      bg: "bg-yellow-500/10",
    },
    cavity: { color: "text-red-400", icon: XCircle, bg: "bg-red-500/15" },
  }[tooth.status];
  const Icon = config.icon;
  return (
    <div
      className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs"
      style={
        tooth.status === "cavity"
          ? {
              background: "oklch(0.63 0.26 27 / 0.08)",
              border: "1px solid oklch(0.63 0.26 27 / 0.25)",
            }
          : { background: "oklch(0.12 0.008 60 / 0.5)" }
      }
    >
      <div
        className={`w-5 h-5 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>
      <span className="hud-telemetry text-[9px] text-muted-foreground w-12 flex-shrink-0">
        TOOTH #{Number(tooth.toothNumber)}
      </span>
      <span className={`font-medium ${config.color} truncate flex-1`}>
        {tooth.condition}
      </span>
    </div>
  );
}

function ScanCard({
  scan,
  index,
  onView,
}: { scan: ScanResult; index: number; onView: (scan: ScanResult) => void }) {
  const [expanded, setExpanded] = useState(false);
  const score = Number(scan.healthScore);
  const cavityTeeth = scan.teeth.filter((t) => t.status === "cavity");
  const riskTeeth = scan.teeth.filter((t) => t.status === "risk");
  const issueTeeth = scan.teeth.filter((t) => t.status !== "healthy");
  const date = new Date(
    Number(scan.timestamp / BigInt(1_000_000)),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const severity = score >= 70 ? "Mild" : score >= 40 ? "Moderate" : "Severe";
  const severityColor =
    severity === "Mild"
      ? "text-green-400 border-green-500/30 bg-green-500/10"
      : severity === "Moderate"
        ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card rounded-3xl overflow-hidden card-glow-border"
      data-ocid={`history.item.${index + 1}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <ScoreRing score={score} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge
              variant="outline"
              className={`text-xs rounded-full ${severityColor}`}
            >
              {severity}
            </Badge>
            {cavityTeeth.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs text-red-400 border-red-500/40 rounded-full bg-red-500/8"
              >
                {cavityTeeth.length}{" "}
                {cavityTeeth.length === 1 ? "cavity" : "cavities"}
              </Badge>
            )}
            {riskTeeth.length > 0 && (
              <Badge
                variant="outline"
                className="text-xs text-yellow-400 border-yellow-500/40 rounded-full bg-yellow-500/8"
              >
                {riskTeeth.length} at risk
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground hud-telemetry">
            <Calendar className="w-3 h-3" />
            <span>{date.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {issueTeeth.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="w-8 h-8 rounded-full bg-muted/40 hover:bg-primary/10 border border-border/30 hover:border-primary/30 flex items-center justify-center transition-all"
              aria-label={expanded ? "Collapse breakdown" : "Expand breakdown"}
            >
              <AnimatePresence mode="wait">
                {expanded ? (
                  <motion.div
                    key="up"
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="down"
                    initial={{ rotate: 180 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
          <button
            type="button"
            onClick={() => onView(scan)}
            className="px-3 h-8 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-semibold transition-all"
            aria-label="View full results"
          >
            View
          </button>
        </div>
      </div>

      {/* Expandable tooth breakdown */}
      <AnimatePresence>
        {expanded && issueTeeth.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border/20">
              <p className="hud-telemetry text-[9px] text-muted-foreground mb-2">
                {issueTeeth.length} ISSUE{issueTeeth.length !== 1 ? "S" : ""}{" "}
                DETECTED:
              </p>
              <div className="flex flex-col gap-1">
                {issueTeeth.map((tooth) => (
                  <ToothBreakdownRow
                    key={Number(tooth.toothNumber)}
                    tooth={tooth}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { setScanResult } = useScanContext();
  const { data: history, isLoading } = useScanHistory();
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;

  const handleViewScan = (scan: ScanResult) => {
    setScanResult(scan);
    navigate({ to: "/results" });
  };

  const paged = (history ?? []).slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil((history?.length ?? 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
          aria-label="Go back"
          className="rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gradient-gold">
            Scan History
          </h1>
          <p className="hud-telemetry text-[10px] text-muted-foreground">
            {identity
              ? `${history?.length ?? 0} SCANS RECORDED`
              : "SIGN IN REQUIRED"}
          </p>
        </div>
        {identity ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="history.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => login()}
            data-ocid="history.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Button>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {!identity ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-20 text-center"
            data-ocid="history.empty_state"
          >
            <div
              className="circle-icon w-24 h-24 animate-ring-pulse"
              style={{
                background: "oklch(0.78 0.16 80 / 0.08)",
                border: "2px solid oklch(0.78 0.16 80 / 0.4)",
                boxShadow: "0 0 30px oklch(0.78 0.16 80 / 0.15)",
              }}
            >
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-gradient-gold">
                Sign In Required
              </h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Sign in to access your scan history and track your dental health
                over time.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 glow-primary shimmer-button"
              onClick={() => login()}
              data-ocid="history.primary_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </motion.div>
        ) : isLoading ? (
          <div
            className="flex flex-col gap-3"
            data-ocid="history.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-4 flex gap-4 items-center"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !history || history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-5 py-20 text-center"
            data-ocid="history.empty_state"
          >
            <div className="circle-icon w-24 h-24 bg-muted/30 border border-border/30">
              <ClipboardList className="w-10 h-10 text-muted-foreground opacity-40" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">No Scans Yet</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-xs">
                Complete your first dental scan to start tracking your oral
                health journey.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 glow-primary shimmer-button"
              onClick={() => navigate({ to: "/scan" })}
              data-ocid="history.primary_button"
            >
              <Scan className="w-4 h-4 mr-2" />
              Start First Scan
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Stats summary */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-2"
            >
              {[
                {
                  value: history.length,
                  label: "Total Scans",
                  color: "text-primary",
                },
                {
                  value: Math.round(
                    history.reduce((s, h) => s + Number(h.healthScore), 0) /
                      history.length,
                  ),
                  label: "Avg. Score",
                  color: "text-yellow-400",
                },
                {
                  value: history.filter((h) => Number(h.healthScore) >= 70)
                    .length,
                  label: "Healthy Scans",
                  color: "text-green-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card rounded-3xl p-3 text-center"
                >
                  <p
                    className={`font-display text-2xl font-bold ${item.color}`}
                  >
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Scan list */}
            {paged.map((scan, i) => (
              <ScanCard
                key={Number(scan.timestamp)}
                scan={scan}
                index={i}
                onView={handleViewScan}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </Button>
                <span className="text-xs text-muted-foreground hud-telemetry">
                  PAGE {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/30 text-primary hover:bg-primary/10"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30 bg-card/40">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
        <p className="mt-1">
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
