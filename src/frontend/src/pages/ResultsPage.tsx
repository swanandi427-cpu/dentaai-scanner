import DentalArch3D from "@/components/DentalArch3D";
import HealthScoreGauge from "@/components/HealthScoreGauge";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSubmitScan } from "@/hooks/useQueries";
import type { ToothRecord } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  LogIn,
  LogOut,
  MapPin,
  RotateCcw,
  Save,
  Share2,
  XCircle,
} from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: CheckCircle2,
  },
  risk: {
    label: "Risk Detected",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
  },
  cavity: {
    label: "Cavity / Decay",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

function IssueCard({ tooth, index }: { tooth: ToothRecord; index: number }) {
  const config = STATUS_CONFIG[tooth.status] ?? STATUS_CONFIG.risk;
  const Icon = config.icon;
  const isCavity = tooth.status === "cavity";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3 + index * 0.15,
        duration: 0.45,
        ease: "easeOut",
      }}
      className={`glass-card rounded-3xl p-4 border ${config.border} transition-smooth hover-lift`}
      style={
        isCavity
          ? {
              background: "oklch(0.63 0.26 27 / 0.12)",
              border: "1.5px solid oklch(0.63 0.26 27 / 0.55)",
              boxShadow: "0 0 20px 4px oklch(0.63 0.26 27 / 0.2)",
            }
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={`circle-icon w-9 h-9 ${config.bg} flex-shrink-0 border ${config.border}`}
          style={
            isCavity
              ? { boxShadow: "0 0 8px oklch(0.63 0.26 27 / 0.4)" }
              : undefined
          }
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="hud-telemetry text-[10px] text-muted-foreground">
              TOOTH #{Number(tooth.toothNumber)}
            </span>
            <Badge
              variant="outline"
              className={`text-xs ${config.color} border-current rounded-full`}
            >
              {config.label}
            </Badge>
          </div>
          <p className="font-semibold text-sm mt-1">{tooth.condition}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {tooth.recommendation}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Full report box — turns RED background when ANY cavity detected
function ReportBox({ teeth }: { teeth: ToothRecord[] }) {
  const issueTeeth = teeth.filter((t) => t.status !== "healthy");
  const cavityTeeth = teeth.filter((t) => t.status === "cavity");
  const riskTeeth = teeth.filter((t) => t.status === "risk");
  const hasCavities = cavityTeeth.length > 0;

  if (issueTeeth.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-3xl p-5 border-2"
      style={
        hasCavities
          ? {
              background: "oklch(0.63 0.26 27 / 0.13)",
              borderColor: "oklch(0.63 0.26 27 / 0.75)",
              boxShadow:
                "0 0 40px 8px oklch(0.63 0.26 27 / 0.25), inset 0 0 30px oklch(0.63 0.26 27 / 0.06)",
            }
          : {
              background: "oklch(0.78 0.16 80 / 0.06)",
              borderColor: "oklch(0.78 0.16 80 / 0.3)",
              boxShadow: "0 0 20px oklch(0.78 0.16 80 / 0.08)",
            }
      }
      data-ocid="results.cavity_report"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="circle-icon w-10 h-10 flex-shrink-0"
          style={
            hasCavities
              ? {
                  background: "oklch(0.63 0.26 27 / 0.2)",
                  border: "1.5px solid oklch(0.63 0.26 27 / 0.6)",
                  boxShadow: "0 0 12px oklch(0.63 0.26 27 / 0.5)",
                }
              : {
                  background: "oklch(0.78 0.16 80 / 0.12)",
                  border: "1.5px solid oklch(0.78 0.16 80 / 0.4)",
                }
          }
        >
          {hasCavities ? (
            <XCircle className="w-5 h-5 text-red-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          )}
        </div>
        <div>
          <h3
            className={`font-display font-bold text-base ${hasCavities ? "text-red-400" : "text-yellow-400"}`}
          >
            {hasCavities ? "⚠ Cavities Detected" : "Issues Found"}
          </h3>
          <p
            className={`text-xs hud-telemetry ${hasCavities ? "text-red-400/70" : "text-muted-foreground"}`}
          >
            {issueTeeth.length} TOOTH{" "}
            {issueTeeth.length > 1 ? "POSITIONS" : "POSITION"} AFFECTED
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {cavityTeeth.length > 0 && (
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "oklch(0.63 0.26 27 / 0.25)",
                border: "1px solid oklch(0.63 0.26 27 / 0.5)",
                color: "oklch(0.82 0.2 27)",
              }}
            >
              {cavityTeeth.length}{" "}
              {cavityTeeth.length === 1 ? "Cavity" : "Cavities"}
            </div>
          )}
          {riskTeeth.length > 0 && (
            <div
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: "oklch(0.78 0.2 80 / 0.2)",
                border: "1px solid oklch(0.78 0.2 80 / 0.4)",
                color: "oklch(0.88 0.18 80)",
              }}
            >
              {riskTeeth.length} At Risk
            </div>
          )}
        </div>
      </div>

      {/* Cavity rows */}
      {cavityTeeth.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          <p className="text-xs text-red-400/80 hud-telemetry mb-1">
            CAVITIES REQUIRING TREATMENT:
          </p>
          {cavityTeeth.map((tooth) => (
            <div
              key={Number(tooth.toothNumber)}
              className="flex items-start gap-3 rounded-2xl p-3"
              style={{
                background: "oklch(0.63 0.26 27 / 0.08)",
                border: "1px solid oklch(0.63 0.26 27 / 0.3)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  background: "oklch(0.63 0.26 27 / 0.2)",
                  color: "oklch(0.82 0.2 27)",
                  border: "1px solid oklch(0.63 0.26 27 / 0.5)",
                }}
              >
                #{Number(tooth.toothNumber)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-300">
                  {tooth.condition}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {tooth.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk rows */}
      {riskTeeth.length > 0 && (
        <div className="flex flex-col gap-2">
          {cavityTeeth.length > 0 && (
            <p className="text-xs text-yellow-400/80 hud-telemetry mb-1">
              AT-RISK TEETH:
            </p>
          )}
          {riskTeeth.map((tooth) => (
            <div
              key={Number(tooth.toothNumber)}
              className="flex items-start gap-3 rounded-2xl p-3"
              style={
                hasCavities
                  ? {
                      background: "oklch(0.63 0.26 27 / 0.05)",
                      border: "1px solid oklch(0.63 0.26 27 / 0.2)",
                    }
                  : {
                      background: "oklch(0.78 0.2 80 / 0.06)",
                      border: "1px solid oklch(0.78 0.2 80 / 0.25)",
                    }
              }
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  background: "oklch(0.78 0.2 80 / 0.15)",
                  color: "oklch(0.88 0.18 80)",
                  border: "1px solid oklch(0.78 0.2 80 / 0.4)",
                }}
              >
                #{Number(tooth.toothNumber)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-300">
                  {tooth.condition}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {tooth.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasCavities && (
        <p className="text-xs text-red-400/80 mt-4 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Please consult a dentist for professional treatment of detected
          cavities.
        </p>
      )}
    </motion.div>
  );
}

function TriageBanner({ score }: { score: number }) {
  const navigate = useNavigate();
  const controls = useAnimation();
  const severity = score >= 70 ? "Mild" : score >= 40 ? "Moderate" : "Severe";
  const config = {
    Mild: {
      message:
        "Your dental health looks good! Keep up your excellent oral hygiene routine.",
      bgStyle: {
        background: "oklch(0.55 0.2 145 / 0.07)",
        borderLeft: "4px solid oklch(0.55 0.2 145)",
      },
      textColor: "text-green-400",
      Icon: CheckCircle2,
      iconBg: "bg-green-500/15 border border-green-500/30",
    },
    Moderate: {
      message:
        "Moderate issues detected — see a dentist soon to prevent further damage.",
      bgStyle: {
        background: "oklch(0.78 0.2 80 / 0.07)",
        borderLeft: "4px solid oklch(0.78 0.2 80)",
      },
      textColor: "text-yellow-400",
      Icon: AlertTriangle,
      iconBg: "bg-yellow-500/15 border border-yellow-500/30",
    },
    Severe: {
      message:
        "URGENT: Severe dental issues detected — seek emergency care immediately.",
      bgStyle: {
        background: "oklch(0.63 0.26 27 / 0.12)",
        borderLeft: "4px solid oklch(0.63 0.26 27)",
        boxShadow: "0 0 20px oklch(0.63 0.26 27 / 0.15)",
      },
      textColor: "text-red-400",
      Icon: XCircle,
      iconBg: "bg-red-500/15 border border-red-500/30",
    },
  }[severity];

  const { Icon, bgStyle, textColor, message, iconBg } = config;

  // 3x flash pulse on mount for Moderate/Severe
  useEffect(() => {
    if (severity === "Mild") return;
    const pulseColor =
      severity === "Severe"
        ? "oklch(0.63 0.26 27 / 0.4)"
        : "oklch(0.78 0.2 80 / 0.35)";
    const sequence = async () => {
      for (let n = 0; n < 3; n++) {
        await controls.start({
          boxShadow: `0 0 24px 6px ${pulseColor}`,
          transition: { duration: 0.22 },
        });
        await controls.start({
          boxShadow: "0 0 0px 0px transparent",
          transition: { duration: 0.22 },
        });
      }
    };
    const t = setTimeout(() => {
      sequence();
    }, 300);
    return () => clearTimeout(t);
  }, [severity, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="glass-card rounded-3xl p-5"
      style={bgStyle}
      data-ocid="results.triage.card"
    >
      <motion.div animate={controls} className="rounded-3xl">
        <div className="flex items-start gap-3">
          <div className={`circle-icon w-10 h-10 flex-shrink-0 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${textColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider hud-telemetry ${textColor}`}
              >
                {severity} — Health Score: {score}/100
              </span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {message}
            </p>
            {(severity === "Moderate" || severity === "Severe") && (
              <Button
                size="sm"
                className="mt-3 rounded-full text-xs px-4"
                variant="outline"
                style={
                  severity === "Severe"
                    ? {
                        background: "oklch(0.63 0.26 27 / 0.15)",
                        borderColor: "oklch(0.63 0.26 27 / 0.5)",
                        color: "oklch(0.82 0.2 27)",
                      }
                    : {
                        background: "oklch(0.78 0.2 80 / 0.1)",
                        borderColor: "oklch(0.78 0.2 80 / 0.4)",
                        color: "oklch(0.88 0.18 80)",
                      }
                }
                onClick={() => navigate({ to: "/find-dentist" })}
                data-ocid="results.find_dentist.button"
              >
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Find Emergency Dentist
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { scanResult } = useScanContext();
  const { identity, login, clear } = useInternetIdentity();
  const { mutate: submitScan, isPending: isSaving } = useSubmitScan();
  const autoSavedRef = useRef(false);

  const score = scanResult ? Number(scanResult.healthScore) : 0;

  useEffect(() => {
    if (identity && scanResult && !autoSavedRef.current) {
      autoSavedRef.current = true;
      submitScan(
        {
          teeth: scanResult.teeth,
          healthScore: score,
          severity: scanResult.severity ?? "mild",
        },
        {
          onSuccess: () => toast.success("Scan saved to your account!"),
          onError: () => toast.error("Failed to auto-save report."),
        },
      );
    }
  }, [identity, scanResult, submitScan, score]);

  if (!scanResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <div className="circle-icon w-20 h-20 bg-muted/30">
          <CheckCircle2 className="w-9 h-9 text-muted-foreground opacity-50" />
        </div>
        <p className="text-muted-foreground">No scan results available.</p>
        <Button
          className="rounded-full glow-primary"
          onClick={() => navigate({ to: "/scan" })}
        >
          Start a Scan
        </Button>
      </div>
    );
  }

  const issueTeeth = scanResult.teeth.filter((t) => t.status !== "healthy");
  const cavityTeeth = scanResult.teeth.filter((t) => t.status === "cavity");
  const cavityCount = cavityTeeth.length;
  const riskCount = scanResult.teeth.filter((t) => t.status === "risk").length;
  const healthyCount = scanResult.teeth.filter(
    (t) => t.status === "healthy",
  ).length;

  const handleSave = () => {
    if (!identity) {
      login();
      return;
    }
    submitScan(
      {
        teeth: scanResult.teeth,
        healthScore: score,
        severity: scanResult.severity ?? "mild",
      },
      {
        onSuccess: () => toast.success("Scan report saved!"),
        onError: () => toast.error("Failed to save. Please try again."),
      },
    );
  };

  const handleShare = async () => {
    const text = `My dental health score: ${score}/100. ${healthyCount} healthy, ${riskCount} at risk, ${cavityCount} cavities. #DantaNova`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My DantaNova Scan",
          text,
          url: "https://dentaai-scanner-n0h.caffeine.xyz",
        });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${text} https://dentaai-scanner-n0h.caffeine.xyz`,
        );
        toast.success("Results copied to clipboard!");
      } catch {
        toast.error("Unable to share. Copy the URL manually.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gradient-gold">
            Scan Results
          </h1>
          <p className="hud-telemetry text-[10px] text-muted-foreground">
            {new Date(Number(scanResult.timestamp / BigInt(1_000_000)))
              .toLocaleString()
              .toUpperCase()}
          </p>
        </div>
        {identity ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="results.secondary_button"
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
            data-ocid="results.secondary_button"
            className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Sign In
          </Button>
        )}
      </header>

      <main className="flex-1 flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Score + stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6 glass-card rounded-3xl p-6 neon-border"
        >
          <HealthScoreGauge score={score} severity={scanResult.severity} />
          <div className="flex-1 grid grid-cols-3 gap-4 w-full">
            {(
              [
                {
                  count: healthyCount,
                  label: "Healthy",
                  color: "text-green-400",
                  bg: "bg-green-500/10",
                  border: "border-green-500/25",
                },
                {
                  count: riskCount,
                  label: "At Risk",
                  color: "text-yellow-400",
                  bg: "bg-yellow-500/10",
                  border: "border-yellow-500/25",
                },
                {
                  count: cavityCount,
                  label: "Cavities",
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                  border: "border-red-500/25",
                },
              ] as const
            ).map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div
                  className={`circle-icon w-14 h-14 ${item.bg} border ${item.border} mb-2`}
                >
                  <span
                    className={`text-xl font-display font-bold ${item.color}`}
                  >
                    {item.count}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Triage Banner — flashes 3x on mount for Moderate/Severe */}
        <TriageBanner score={score} />

        {/* 3D Arch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base text-gradient-gold">
              3D Dental Arch
            </h2>
            <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full hud-telemetry">
              {scanResult.teeth.length} TEETH ANALYZED
            </span>
          </div>
          <DentalArch3D teeth={scanResult.teeth} />
          <div className="flex gap-3 justify-center mt-4 flex-wrap">
            {(
              [
                { color: "bg-green-500", label: "Healthy" },
                { color: "bg-yellow-500", label: "Risk Detected" },
                { color: "bg-red-500", label: "Cavity / Decay" },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 bg-muted/30 px-3 py-1 rounded-full"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Full Report Box — RED when cavities present */}
        {issueTeeth.length > 0 && <ReportBox teeth={scanResult.teeth} />}

        {/* Issues list — staggered slide-up reveal */}
        {issueTeeth.length > 0 ? (
          <div>
            <h2 className="font-display font-semibold text-base mb-3">
              Detailed Issues
              <span className="ml-2 text-xs font-normal bg-primary/15 text-primary px-2.5 py-0.5 rounded-full">
                {issueTeeth.length}
              </span>
            </h2>
            <div className="flex flex-col gap-3">
              {issueTeeth.map((tooth, i) => (
                <IssueCard
                  key={Number(tooth.toothNumber)}
                  tooth={tooth}
                  index={i}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="glass-card rounded-3xl p-6 text-center"
            style={{
              border: "1.5px solid oklch(0.55 0.2 145 / 0.4)",
              boxShadow: "0 0 20px oklch(0.55 0.2 145 / 0.1)",
            }}
          >
            <div className="circle-icon w-16 h-16 bg-green-500/10 mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-display font-bold text-lg">
              Perfect Dental Health!
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              No issues detected. Keep up your excellent oral hygiene routine.
            </p>
          </motion.div>
        )}

        {/* Sign-in prompt */}
        {!identity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="glass-card rounded-3xl p-4 flex items-center justify-between gap-4 border border-primary/20"
            data-ocid="results.card"
          >
            <div className="flex items-center gap-3">
              <div className="circle-icon w-9 h-9 bg-primary/10 flex-shrink-0">
                <LogIn className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Sign in to save this report securely
              </p>
            </div>
            <Button
              size="sm"
              className="rounded-full flex-shrink-0 glow-primary"
              onClick={() => login()}
              data-ocid="results.primary_button"
            >
              Sign In
            </Button>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pb-4">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-border/40 hover:border-primary/40"
            onClick={() => navigate({ to: "/scan" })}
            data-ocid="results.secondary_button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Scan Again
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full border-border/40 hover:border-primary/40"
            onClick={handleShare}
            data-ocid="results.share_button"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            className="flex-1 rounded-full glow-primary shimmer-button"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="results.save_button"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : identity ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving…" : identity ? "Save Report" : "Login to Save"}
          </Button>
        </div>
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
