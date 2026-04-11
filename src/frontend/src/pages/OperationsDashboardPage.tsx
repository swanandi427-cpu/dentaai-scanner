import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Server,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const HEALTH_ITEMS = [
  { label: "Backend Canister", status: "Healthy", color: "142", dot: "green" },
  { label: "AI Pipeline", status: "Active", color: "142", dot: "green" },
  { label: "ICP Database", status: "Synced", color: "142", dot: "green" },
  { label: "CDN / Assets", status: "Online", color: "142", dot: "green" },
  { label: "Auth Service", status: "Operational", color: "142", dot: "green" },
  { label: "3D Renderer", status: "Active", color: "75", dot: "yellow" },
];

const EVENTS = [
  {
    time: "10:42 AM",
    msg: "Canister heartbeat: 47 active sessions",
    type: "info",
  },
  {
    time: "10:38 AM",
    msg: "AI scan pipeline processed 12 requests",
    type: "success",
  },
  {
    time: "10:31 AM",
    msg: "Passport lookup: 3 queries resolved",
    type: "info",
  },
  {
    time: "10:22 AM",
    msg: "Booking system: 2 new appointments confirmed",
    type: "success",
  },
  {
    time: "10:15 AM",
    msg: "CDN cache refreshed (28 assets updated)",
    type: "info",
  },
  {
    time: "09:58 AM",
    msg: "Minor latency spike: 1.8s avg (resolved)",
    type: "warn",
  },
  {
    time: "09:45 AM",
    msg: "Stable memory checkpoint written",
    type: "success",
  },
];

const BOTTLENECKS = [
  {
    label: "3D Render Time",
    value: "380ms",
    status: "warn",
    note: "Above 300ms target",
  },
  {
    label: "Passport Lookup",
    value: "120ms",
    status: "ok",
    note: "Within threshold",
  },
  {
    label: "Scan Processing",
    value: "1.8s",
    status: "ok",
    note: "Within 2s target",
  },
];

const LOAD_DISTRIBUTION = [
  { label: "Scan Engine", pct: 38, color: "oklch(0.88 0.18 85)" },
  { label: "API Calls", pct: 25, color: "oklch(0.75 0.19 75)" },
  { label: "3D Rendering", pct: 18, color: "oklch(0.72 0.18 142)" },
  { label: "Auth", pct: 11, color: "oklch(0.68 0.18 55)" },
  { label: "Other", pct: 8, color: "oklch(0.55 0.08 80)" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function LoadRingChart() {
  let cumulative = 0;
  const segments = LOAD_DISTRIBUTION.map((d) => {
    const start = cumulative;
    cumulative += d.pct;
    return { ...d, start, end: cumulative };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start * 3.6}deg ${s.end * 3.6}deg`)
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: `conic-gradient(${gradient})`,
            boxShadow: "0 0 30px oklch(0.88 0.18 85 / 0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "oklch(0.10 0.025 80)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-gradient-gold font-bold text-lg font-display">
            99.9%
          </div>
          <div
            style={{ color: "oklch(0.55 0.06 80)", fontSize: 9, marginTop: 2 }}
          >
            UPTIME
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 w-full">
        {LOAD_DISTRIBUTION.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: d.color,
                }}
              />
              <span style={{ color: "oklch(0.72 0.08 80)" }}>{d.label}</span>
            </div>
            <span style={{ color: d.color, fontWeight: 600 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OperationsDashboardPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 80)" }}
      data-ocid="operations_dashboard.page"
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex items-center gap-4"
        style={{
          background: "oklch(0.09 0.02 80 / 0.95)",
          borderBottom: "1px solid oklch(0.88 0.18 85 / 0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="operations_dashboard.link"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "oklch(0.88 0.18 85 / 0.12)",
                border: "1px solid oklch(0.88 0.18 85 / 0.4)",
              }}
            >
              <Server
                className="w-5 h-5"
                style={{ color: "oklch(0.88 0.18 85)" }}
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gradient-gold">
                Operations Dashboard
              </h1>
              <p className="text-xs" style={{ color: "oklch(0.60 0.08 80)" }}>
                Monitor automations and workflows
              </p>
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: "oklch(0.72 0.18 142 / 0.1)",
            border: "1px solid oklch(0.72 0.18 142 / 0.3)",
            color: "oklch(0.72 0.18 142)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          ALL SYSTEMS GO
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10 gap-8 max-w-6xl mx-auto w-full">
        {/* Stat Cards */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {[
            {
              icon: Activity,
              label: "Uptime",
              value: "99.9%",
              sub: "Last 30 days",
              color: "142",
            },
            {
              icon: Zap,
              label: "Active Scans",
              value: "47",
              sub: "Right now",
              color: "85",
            },
            {
              icon: Clock,
              label: "Avg Response",
              value: "1.2s",
              sub: "API latency",
              color: "85",
            },
            {
              icon: AlertTriangle,
              label: "Error Rate",
              value: "0.03%",
              sub: "All requests",
              color: "142",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.11 0.025 80)",
                border: `1px solid oklch(0.62 0.2 ${stat.color} / 0.25)`,
                boxShadow: `0 0 20px oklch(0.62 0.2 ${stat.color} / 0.08)`,
              }}
              data-ocid="operations_dashboard.card"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon
                  className="w-4 h-4"
                  style={{ color: `oklch(0.72 0.18 ${stat.color})` }}
                />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.06 80)" }}
                >
                  {stat.sub}
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-gradient-gold">
                {stat.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.60 0.06 80)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* System Health + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.025 80)",
              border: "1px solid oklch(0.88 0.18 85 / 0.18)",
            }}
          >
            <p className="font-display font-bold mb-5 text-gradient-gold">
              System Health
            </p>
            <div className="flex flex-col gap-3">
              {HEALTH_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: "oklch(0.13 0.025 80)",
                    border: `1px solid oklch(0.62 0.2 ${item.color} / 0.2)`,
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.78 0.10 80)" }}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background:
                          item.dot === "green"
                            ? "oklch(0.72 0.18 142)"
                            : "oklch(0.82 0.18 75)",
                      }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          item.dot === "green"
                            ? "oklch(0.72 0.18 142)"
                            : "oklch(0.82 0.18 75)",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.025 80)",
              border: "1px solid oklch(0.88 0.18 85 / 0.18)",
            }}
          >
            <p className="font-display font-bold mb-5 text-gradient-gold">
              Recent Events
            </p>
            <div className="flex flex-col gap-2">
              {EVENTS.map((e, i) => (
                <motion.div
                  key={`${e.time}-${e.msg.slice(0, 12)}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 items-start py-2"
                  style={{
                    borderBottom:
                      i < EVENTS.length - 1
                        ? "1px solid oklch(0.88 0.18 85 / 0.08)"
                        : "none",
                  }}
                  data-ocid={`operations_dashboard.item.${i + 1}`}
                >
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{ color: "oklch(0.55 0.06 80)" }}
                  >
                    {e.time}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color:
                        e.type === "success"
                          ? "oklch(0.72 0.18 142)"
                          : e.type === "warn"
                            ? "oklch(0.82 0.18 75)"
                            : "oklch(0.72 0.10 80)",
                    }}
                  >
                    {e.msg}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottlenecks + Load Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.025 80)",
              border: "1px solid oklch(0.88 0.18 85 / 0.18)",
            }}
          >
            <p className="font-display font-bold mb-5 text-gradient-gold">
              Performance Bottlenecks
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BOTTLENECKS.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{
                    background: "oklch(0.13 0.025 80)",
                    border: `1px solid ${b.status === "warn" ? "oklch(0.82 0.18 75 / 0.4)" : "oklch(0.62 0.18 142 / 0.3)"}`,
                  }}
                >
                  <div className="flex justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.08 80)" }}
                    >
                      {b.label}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color:
                          b.status === "warn"
                            ? "oklch(0.82 0.18 75)"
                            : "oklch(0.72 0.18 142)",
                      }}
                    >
                      {b.value}
                    </span>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.06 80)" }}
                  >
                    {b.note}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.10 0.025 80)",
              border: "1px solid oklch(0.88 0.18 85 / 0.18)",
            }}
          >
            <p className="font-display font-bold mb-5 text-gradient-gold">
              Load Distribution
            </p>
            <LoadRingChart />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
