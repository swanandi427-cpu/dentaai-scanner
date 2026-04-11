import LogoCircle from "@/components/LogoCircle";
import NeuralNetworkAnimation from "@/components/NeuralNetworkAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Brain,
  CalendarCheck,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  Globe,
  History,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  QrCode,
  ScanLine,
  Send,
  Shield,
  Star,
  Stethoscope,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "5,000+", label: "Scans Analyzed" },
  { value: "94%", label: "Accuracy Rate" },
  { value: "15+", label: "Conditions Detected" },
  { value: "500+", label: "Dentists Ready" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Camera,
    title: "Scan Your Teeth",
    desc: "Open camera or upload a photo. No special equipment needed — just good lighting.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analysis",
    desc: "Our neural network scans all 32 teeth individually, detecting subtle signs of decay.",
  },
  {
    step: "03",
    icon: Zap,
    title: "View Results",
    desc: "Interactive 3D arch with color-coded findings and personalised recommendations.",
  },
  {
    step: "04",
    icon: CalendarCheck,
    title: "Book a Dentist",
    desc: "Find and book an emergency dentist near you — if issues are found, act fast.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Caught a cavity early before it became expensive. DantaNova saved me from a root canal!",
    name: "Priya M.",
    role: "Frequent Traveler",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote:
      "Found an emergency dentist in 10 minutes while abroad. This app is a lifesaver.",
    name: "James K.",
    role: "Digital Nomad",
    city: "Dubai",
    rating: 5,
  },
  {
    quote:
      "The 3D model made it so clear which teeth needed attention. Easy to understand.",
    name: "Aisha R.",
    role: "Student",
    city: "Delhi",
    rating: 5,
  },
  {
    quote:
      "I was skeptical at first, but the scan detected early gum inflammation I had no idea about. My dentist confirmed it. Truly impressive!",
    name: "Rahul S.",
    role: "Software Engineer",
    city: "Bengaluru",
    rating: 5,
  },
  {
    quote:
      "Dental Passport saved me so much stress while traveling in Europe. My records were shared and I got treated without paying upfront.",
    name: "Meera T.",
    role: "International Student",
    city: "London",
    rating: 5,
  },
  {
    quote:
      "As a dentist myself, I'm impressed by the accuracy of the AI triage. Patients come in better prepared after using DantaNova.",
    name: "Dr. Ankit V.",
    role: "Dentist",
    city: "Pune",
    rating: 5,
  },
];

const TRUST_BADGES = [
  { icon: "🔒", label: "Encrypted" },
  { icon: "✅", label: "GDPR Compliant" },
  { icon: "⚡", label: "Free Forever" },
  { icon: "🔗", label: "Blockchain Secured" },
  { icon: "✓", label: "Clinically Aligned" },
  { icon: "🌍", label: "Global Network" },
];

const STORAGE_KEY = "dantanova_testimonials_v2";

interface UserTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  timestamp: number;
}

function loadStoredTestimonials(): UserTestimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserTestimonial[]) : [];
  } catch {
    return [];
  }
}

function saveTestimonial(t: UserTestimonial) {
  const existing = loadStoredTestimonials();
  existing.unshift(t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const sV: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="w-4 h-4"
          style={{
            color: n <= rating ? "oklch(0.88 0.18 85)" : "oklch(0.35 0.03 70)",
            fill: n <= rating ? "oklch(0.88 0.18 85)" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function StarPicker({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${n}`}
          data-ocid="testimonial.toggle"
        >
          <Star
            className="w-6 h-6"
            style={{
              color:
                n <= (hovered || value)
                  ? "oklch(0.88 0.18 85)"
                  : "oklch(0.35 0.03 70)",
              fill:
                n <= (hovered || value) ? "oklch(0.88 0.18 85)" : "transparent",
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── HERO CANVASES ─────────────────────────────────────────────────────────────

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    interface P {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      aDir: number;
    }
    const pts: P[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.32,
      vy: -0.12 - Math.random() * 0.42,
      alpha: 0.15 + Math.random() * 0.5,
      aDir: Math.random() > 0.5 ? 1 : -1,
    }));
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.aDir * 0.003;
        if (p.alpha > 0.65 || p.alpha < 0.07) p.aDir *= -1;
        if (p.y < -10) {
          p.y = H + 5;
          p.x = Math.random() * W;
        }
        if (p.x < -10) p.x = W + 5;
        if (p.x > W + 10) p.x = -5;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(229,195,80,${p.alpha})`);
        g.addColorStop(0.5, `rgba(210,160,40,${p.alpha * 0.5})`);
        g.addColorStop(1, "rgba(200,140,20,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,218,90,${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

function IronManHUD() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let scanY = 0;
    let time = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      // Scan line sweep
      scanY = (scanY + 1.5) % h;
      const sg = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      sg.addColorStop(0, "rgba(229,195,80,0)");
      sg.addColorStop(0.5, "rgba(229,195,80,0.32)");
      sg.addColorStop(1, "rgba(229,195,80,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 30, w, 60);
      ctx.strokeStyle = "rgba(229,195,80,0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();
      // Corner brackets
      const bs = 26;
      const bg = 14;
      ctx.strokeStyle = "rgba(229,195,80,0.72)";
      ctx.lineWidth = 2;
      const corners = [
        [bg, bg, 1, 1],
        [w - bg, bg, -1, 1],
        [bg, h - bg, 1, -1],
        [w - bg, h - bg, -1, -1],
      ] as const;
      for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * bs, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * bs);
        ctx.stroke();
      }
      // Reticle rings
      const rcx = w / 2;
      const rcy = h * 0.42;
      ctx.save();
      ctx.translate(rcx, rcy);
      ctx.rotate(time * 0.28);
      ctx.strokeStyle = `rgba(229,195,80,${0.14 + Math.sin(time * 2) * 0.05})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 9]);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.save();
      ctx.translate(rcx, rcy);
      ctx.rotate(-time * 0.48);
      ctx.strokeStyle = `rgba(210,160,40,${0.18 + Math.sin(time * 3) * 0.07})`;
      ctx.setLineDash([2, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      // Crosshair
      ctx.strokeStyle = "rgba(229,195,80,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rcx - 135, rcy);
      ctx.lineTo(rcx + 135, rcy);
      ctx.moveTo(rcx, rcy - 135);
      ctx.lineTo(rcx, rcy + 135);
      ctx.stroke();
      // HUD text
      ctx.font = "9.5px monospace";
      ctx.fillStyle = "rgba(229,195,80,0.52)";
      ctx.fillText("AI SCAN ACTIVE", bg + 2, bg + bs + 16);
      ctx.fillStyle = "rgba(229,195,80,0.28)";
      ctx.fillText(
        `FRAME: ${Math.floor(time * 60)
          .toString()
          .padStart(6, "0")}`,
        bg + 2,
        bg + bs + 32,
      );
      ctx.fillText("SIGNAL: ████████░░ 82%", bg + 2, bg + bs + 48);
      const trs = ["NEURAL NET: READY", "TEETH: 32/32", "STATUS: ANALYZING"];
      for (let i = 0; i < trs.length; i++) {
        ctx.fillStyle =
          i === 2
            ? `rgba(229,195,80,${0.38 + Math.sin(time * 4 + i) * 0.22})`
            : "rgba(229,195,80,0.28)";
        const m = ctx.measureText(trs[i]);
        ctx.fillText(trs[i], w - bg - m.width - 2, bg + bs + 16 + i * 16);
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 4 }}
      tabIndex={-1}
    />
  );
}

// ── LIVE DEMO ────────────────────────────────────────────────────────────────

function LiveDemoSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsAnalyzing(true);
    setShowResult(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2800);
  };
  const reset = () => {
    setPreviewUrl(null);
    setIsAnalyzing(false);
    setShowResult(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const DEMO_R = [
    {
      tooth: "#14",
      cond: "Early Cavity Detected",
      sev: "red" as const,
      icon: "⚠",
    },
    {
      tooth: "#22",
      cond: "Gum Inflammation Risk",
      sev: "yellow" as const,
      icon: "●",
    },
    { tooth: "#8", cond: "Healthy", sev: "green" as const, icon: "✓" },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f?.type.startsWith("image/")) processFile(f);
        }}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !previewUrl)
            fileInputRef.current?.click();
        }}
        className="relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          height: 280,
          background: isDragging
            ? "oklch(0.14 0.06 85/0.7)"
            : "oklch(0.10 0.03 85/0.7)",
          border: isDragging
            ? "2px dashed oklch(0.88 0.18 85/0.8)"
            : "2px dashed oklch(0.88 0.18 85/0.3)",
          boxShadow: isDragging ? "0 0 40px oklch(0.88 0.18 85/0.3)" : "none",
        }}
        data-ocid="live_demo.dropzone"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Uploaded dental scan"
              className="w-full h-full object-cover"
            />
            {isAnalyzing && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "oklch(0.05 0.02 80/0.85)" }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,oklch(0.88 0.18 85),transparent)",
                  }}
                  animate={{ y: [0, 280] }}
                  transition={{
                    duration: 1.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="flex flex-col items-center gap-3 z-10">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "oklch(0.82 0.18 85)" }}
                  />
                  <span
                    className="text-sm font-mono animate-hud-flicker"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    AI ANALYZING...
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-20"
              style={{
                background: "oklch(0.15 0.05 85/0.9)",
                border: "1px solid oklch(0.88 0.18 85/0.4)",
                color: "oklch(0.88 0.18 85)",
              }}
              data-ocid="live_demo.close_button"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: "oklch(0.88 0.18 85/0.12)",
                border: "1px solid oklch(0.88 0.18 85/0.3)",
              }}
            >
              📷
            </div>
            <div className="text-center">
              <p
                className="font-semibold text-sm"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                {isDragging
                  ? "Drop to analyze →"
                  : "Drag & drop a dental photo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to upload • JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
          }}
          data-ocid="live_demo.upload_button"
        />
      </div>
      <div
        className="rounded-3xl p-6 min-h-[280px] flex flex-col"
        style={{
          background: "oklch(0.10 0.03 85/0.7)",
          border: "1px solid oklch(0.88 0.18 85/0.2)",
        }}
      >
        {!showResult && !isAnalyzing && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.12 0.05 85/0.5)",
                border: "1px solid oklch(0.88 0.18 85/0.25)",
              }}
            >
              <span style={{ color: "oklch(0.82 0.16 82)" }}>🦷</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI analysis results will appear here
            </p>
          </div>
        )}
        {isAnalyzing && (
          <div
            className="flex-1 flex flex-col gap-4 justify-center"
            data-ocid="live_demo.loading_state"
          >
            {[
              "Detecting tooth boundaries...",
              "Analyzing enamel condition...",
              "Checking for cavities...",
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.7 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-4 h-4 rounded-full border border-t-transparent animate-spin"
                  style={{
                    borderColor: "oklch(0.82 0.18 85)",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
                <span
                  className="text-sm font-mono"
                  style={{ color: "oklch(0.82 0.16 82)" }}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
            data-ocid="live_demo.success_state"
          >
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                Analysis Complete
              </p>
              <span className="text-xs text-green-400">72/100</span>
            </div>
            {DEMO_R.map((r) => (
              <div
                key={r.tooth}
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background:
                    r.sev === "red"
                      ? "oklch(0.11 0.04 25/0.8)"
                      : r.sev === "yellow"
                        ? "oklch(0.12 0.04 75/0.6)"
                        : "oklch(0.10 0.04 145/0.6)",
                  border: `1px solid oklch(${r.sev === "red" ? "0.65 0.22 25" : r.sev === "yellow" ? "0.78 0.18 75" : "0.65 0.18 145"}/0.4)`,
                }}
              >
                <span
                  className="font-mono text-xs font-bold w-8"
                  style={{
                    color:
                      r.sev === "red"
                        ? "oklch(0.72 0.22 25)"
                        : r.sev === "yellow"
                          ? "oklch(0.82 0.18 75)"
                          : "oklch(0.72 0.18 145)",
                  }}
                >
                  {r.tooth}
                </span>
                <p className="text-xs font-semibold text-foreground flex-1">
                  {r.cond}
                </p>
                <span className="text-xs">{r.icon}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-1">
              Demo preview only. Sign in for full camera scan.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARDS DROPDOWN ───────────────────────────────────────────────────────

function DashboardsDropdown({
  navigate,
}: { navigate: ReturnType<typeof useNavigate> }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Marketing Dashboard", to: "/marketing-dashboard" },
    { label: "Operations Dashboard", to: "/operations-dashboard" },
    { label: "Support Dashboard", to: "/support-dashboard" },
  ];
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground rounded-full px-3 font-semibold flex items-center gap-1"
        onClick={() => setOpen((o) => !o)}
        data-ocid="nav.dashboards_dropdown"
      >
        Dashboards <ChevronDown className="w-3.5 h-3.5" />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute top-full left-0 mt-2 w-52 rounded-2xl overflow-hidden z-50 shadow-2xl"
            style={{
              background: "oklch(0.12 0.04 85/0.97)",
              border: "1px solid oklch(0.72 0.15 85/0.35)",
            }}
          >
            {items.map((item) => (
              <button
                key={item.to}
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: item.to });
                }}
                data-ocid="nav.dashboard_item"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [_unused] = useState(actor);

  const [userTestimonials, setUserTestimonials] = useState<UserTestimonial[]>(
    loadStoredTestimonials,
  );
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formQuote, setFormQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartScan = () => {
    if (identity) navigate({ to: "/scan" });
    else login();
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formQuote.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newEntry: UserTestimonial = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: formName.trim(),
        role: formRole.trim() || "DantaNova User",
        quote: formQuote.trim(),
        rating: formRating,
        timestamp: Date.now(),
      };
      saveTestimonial(newEntry);
      setUserTestimonials(loadStoredTestimonials());
      setFormName("");
      setFormRole("");
      setFormRating(5);
      setFormQuote("");
      toast.success("Thank you for your review!");
    } catch {
      toast.error("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passportReveal = useReveal();
  const howReveal = useReveal();
  const testReveal = useReveal();
  const aboutReveal = useReveal();

  const goldBtn = {
    background:
      "linear-gradient(135deg,oklch(0.82 0.18 85),oklch(0.68 0.16 80))",
    color: "oklch(0.06 0.01 60)",
    boxShadow: "0 4px 28px oklch(0.72 0.15 85/0.45)",
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.07 0.015 60)" }}
    >
      {/* ── NAVBAR ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 md:px-10 backdrop-blur-xl"
        style={{
          background: "oklch(0.07 0.02 85/0.94)",
          borderBottom: "1px solid oklch(0.72 0.15 85/0.12)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <LogoCircle size="sm" />
          <div>
            <span className="font-display font-bold text-lg leading-none">
              Danta<span className="text-gradient-gold">Nova</span>
            </span>
            <p
              className="text-[9px] text-muted-foreground leading-none hidden md:block"
              style={{ color: "oklch(0.62 0.08 80)" }}
            >
              Because Every Smile Matters The Most
            </p>
          </div>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { label: "Home", to: "/" },
            { label: "Scan", to: "/scan" },
            { label: "Find Dentist", to: "/find-dentist" },
            { label: "Dental Passport", to: "/passport" },
            { label: "Demo", to: "/demo" },
            { label: "Pitch", to: "/pitch" },
          ].map((l) => (
            <Button
              key={l.to}
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: l.to })}
              className="text-muted-foreground hover:text-foreground rounded-full px-3 font-semibold text-sm"
              data-ocid="nav.link"
            >
              {l.label}
            </Button>
          ))}
          <DashboardsDropdown navigate={navigate} />
          {identity ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/history" })}
                className="text-muted-foreground hover:text-foreground rounded-full px-3"
                data-ocid="nav.history"
              >
                <History className="w-4 h-4 mr-1.5" />
                History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/profile" })}
                className="text-muted-foreground hover:text-foreground rounded-full px-3"
                data-ocid="nav.profile"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="rounded-full px-3 border-primary/40 text-primary hover:bg-primary/10"
                data-ocid="nav.signout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => login()}
              className="rounded-full px-4 border-primary/50 text-primary hover:bg-primary/10"
              data-ocid="nav.signin"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Sign In
            </Button>
          )}
        </nav>
        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                data-ocid="nav.menu_open"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-64 flex flex-col gap-2 pt-10"
              style={{
                background: "oklch(0.08 0.02 85)",
                border: "1px solid oklch(0.72 0.15 85/0.15)",
              }}
            >
              {[
                { label: "Home", to: "/" },
                { label: "Scan", to: "/scan" },
                { label: "Find Dentist", to: "/find-dentist" },
                { label: "Dental Passport", to: "/passport" },
                { label: "Demo", to: "/demo" },
                { label: "Pitch", to: "/pitch" },
                { label: "Marketing Dashboard", to: "/marketing-dashboard" },
                { label: "Operations Dashboard", to: "/operations-dashboard" },
                { label: "Support Dashboard", to: "/support-dashboard" },
              ].map((l) => (
                <Button
                  key={l.to}
                  variant="ghost"
                  className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => navigate({ to: l.to })}
                  data-ocid="nav.mobile_link"
                >
                  {l.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => navigate({ to: "/qr" })}
                data-ocid="nav.mobile_link"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              {identity ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => navigate({ to: "/history" })}
                    data-ocid="nav.mobile_link"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => navigate({ to: "/profile" })}
                    data-ocid="nav.mobile_link"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-full border-primary/40 text-primary hover:bg-primary/10"
                    onClick={() => clear()}
                    data-ocid="nav.mobile_signout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="justify-start rounded-full border-primary/50 text-primary hover:bg-primary/10"
                  onClick={() => login()}
                  data-ocid="nav.mobile_signin"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Background layers */}
        <div
          className="absolute inset-0 hero-grid-mesh pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden
        />
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <img
            src="/assets/generated/dental-clinic-hero.dim_1200x600.jpg"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.2) saturate(0.55)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,oklch(0.05 0.015 60/0.93) 0%,oklch(0.09 0.04 80/0.66) 50%,oklch(0.05 0.015 60/0.93) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 55% at 50% 35%,oklch(0.18 0.06 80/0.35) 0%,transparent 68%)",
            }}
          />
        </div>
        {/* Animated glow orbs */}
        {[
          {
            w: 500,
            h: 500,
            top: "-140px",
            left: "-120px",
            bg: "oklch(0.72 0.18 85/0.12)",
            d: 9,
            delay: 0,
            id: "orb1",
          },
          {
            w: 320,
            h: 320,
            top: "5%",
            right: "-80px",
            bg: "oklch(0.78 0.19 65/0.10)",
            d: 11,
            delay: 1.5,
            id: "orb2",
          },
          {
            w: 180,
            h: 180,
            bottom: "-30px",
            left: "38%",
            bg: "oklch(0.82 0.20 80/0.14)",
            d: 7,
            delay: 0.5,
            id: "orb3",
          },
          {
            w: 400,
            h: 400,
            bottom: "-120px",
            right: "-60px",
            bg: "oklch(0.70 0.17 75/0.09)",
            d: 15,
            delay: 4,
            id: "orb4",
          },
        ].map((o) => (
          <motion.div
            key={o.id}
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              width: o.w,
              height: o.h,
              ...("top" in o ? { top: o.top } : {}),
              ...("bottom" in o ? { bottom: o.bottom } : {}),
              ...("left" in o ? { left: o.left } : {}),
              ...("right" in o ? { right: o.right } : {}),
              background: o.bg,
              zIndex: 1,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{
              duration: o.d,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: o.delay,
            }}
            aria-hidden
          />
        ))}
        <HeroParticles />
        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg,transparent 0%,oklch(0.88 0.18 85/0.55) 50%,transparent 100%)",
            zIndex: 3,
            filter: "blur(0.5px)",
          }}
          animate={{ y: ["-100%", "120vh"] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2.5,
            ease: "linear",
          }}
          aria-hidden
        />
        <IronManHUD />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-20 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center w-full"
          >
            {/* Neural network canvas */}
            <div
              className="relative rounded-3xl overflow-hidden mb-8 w-full max-w-xl"
              style={{
                height: 200,
                background: "oklch(0.08 0.04 85/0.5)",
                border: "1px solid oklch(0.88 0.18 85/0.18)",
              }}
            >
              <NeuralNetworkAnimation />
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.88 0.18 85)" }}
                />
                <span
                  className="text-xs font-mono"
                  style={{ color: "oklch(0.82 0.16 82)" }}
                >
                  NEURAL NET ACTIVE • 28 NODES • 94% ACCURACY
                </span>
              </div>
            </div>
            {/* Eyebrow */}
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6"
              style={{
                background: "oklch(0.72 0.15 85/0.15)",
                border: "1px solid oklch(0.72 0.15 85/0.4)",
                color: "oklch(0.88 0.18 85)",
              }}
            >
              <ScanLine className="w-3.5 h-3.5" /> AI-Powered Dental Health
              Platform
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-5"
            >
              AI Dental Scan in 30 Seconds
              <br />
              <span className="text-gradient-gold">
                Know Your Oral Health Instantly
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-8"
            >
              Detect cavities, gum disease &amp; 15+ conditions instantly from
              your phone. No clinic visit needed.
            </motion.p>
            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.04,
                  boxShadow:
                    "0 0 30px oklch(0.88 0.18 85/0.5),0 0 60px oklch(0.88 0.18 85/0.2)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartScan}
                data-ocid="home.primary_button"
                className="flex items-center justify-center gap-2 px-10 py-5 rounded-full font-semibold text-lg shimmer-button"
                style={goldBtn}
              >
                <ScanLine className="w-5 h-5" /> Start Free Scan{" "}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate({ to: "/demo" })}
                data-ocid="home.demo_button"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border hover:bg-yellow-500/10 transition-all"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85/0.55)",
                  color: "oklch(0.88 0.18 85)",
                }}
              >
                ▶ Watch Demo
              </motion.button>
            </motion.div>
            {/* Trust nudge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm font-medium"
              style={{ color: "oklch(0.72 0.08 85)" }}
            >
              🔒 100% Private &nbsp;•&nbsp; No app download &nbsp;•&nbsp;
              Results in 30 seconds
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <motion.section
        variants={sV}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-5xl mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.04,
                rotateX: 3,
                rotateY: -3,
                transition: { duration: 0.2 },
              }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl p-6 text-center cursor-default card-glow-border"
              style={{
                background: "oklch(0.12 0.04 85/0.7)",
                transformPerspective: 800,
              }}
            >
              <p className="font-display text-5xl md:text-6xl font-bold text-gradient-gold">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── TRUST BADGES ── */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {TRUST_BADGES.map((b) => (
            <span
              key={b.label}
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"
              style={{
                background: "oklch(0.15 0.06 85/0.6)",
                border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                color: "oklch(0.85 0.14 85)",
              }}
            >
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center">
        {/* ── SCAN OUTPUT PREVIEW ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Real Output Preview
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              Here's What You'll See After Your Scan
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              This is exactly what a DantaNova scan result looks like —
              tooth-by-tooth, color-coded.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Health score + triage */}
            <div className="flex flex-col gap-6">
              <div
                className="rounded-3xl p-8 flex flex-col items-center gap-3"
                style={{
                  background: "oklch(0.11 0.04 85/0.85)",
                  border: "1px solid oklch(0.72 0.15 85/0.3)",
                }}
              >
                <div
                  className="w-36 h-36 rounded-full flex flex-col items-center justify-center"
                  style={{
                    border: "5px solid oklch(0.82 0.18 85)",
                    boxShadow: "0 0 28px oklch(0.72 0.15 85/0.35)",
                    background: "oklch(0.10 0.035 85/0.9)",
                  }}
                >
                  <span
                    className="font-display text-5xl font-bold leading-none"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    72
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "oklch(0.65 0.08 85)" }}
                  >
                    /100
                  </span>
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: "oklch(0.72 0.1 85)" }}
                >
                  Health Score
                </p>
              </div>
              <div
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{
                  background: "oklch(0.16 0.08 75/0.4)",
                  border: "1px solid oklch(0.75 0.18 75/0.4)",
                  borderLeft: "4px solid oklch(0.82 0.18 75)",
                }}
              >
                <AlertTriangle
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "oklch(0.88 0.18 75)" }}
                />
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.78 0.18 75/0.2)",
                      border: "1px solid oklch(0.78 0.18 75/0.5)",
                      color: "oklch(0.88 0.18 75)",
                    }}
                  >
                    Moderate
                  </span>
                  <p
                    className="text-sm mt-2"
                    style={{ color: "oklch(0.82 0.1 75)" }}
                  >
                    Some issues detected. A dentist visit is recommended soon.
                  </p>
                </div>
              </div>
            </div>
            {/* Issue cards — report box highlighted red when cavities present */}
            <div
              className="flex flex-col gap-4 rounded-2xl p-4"
              style={{
                background: "oklch(0.12 0.05 20/0.35)",
                border: "2px solid oklch(0.65 0.22 20/0.55)",
                boxShadow: "0 0 28px oklch(0.55 0.18 20/0.18)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wider text-center"
                style={{ color: "oklch(0.72 0.22 20)" }}
              >
                ⚠ Cavities Detected — Immediate Attention Recommended
              </p>
              {[
                {
                  tooth: "Tooth #14",
                  status: "CAVITY",
                  color: "20",
                  label:
                    "Early cavity detected. Recommend immediate treatment.",
                },
                {
                  tooth: "Tooth #22",
                  status: "AT RISK",
                  color: "75",
                  label:
                    "Signs of early decay. Monitor closely and improve brushing.",
                },
                {
                  tooth: "Tooth #8",
                  status: "HEALTHY",
                  color: "142",
                  label: "No issues detected. Continue good oral hygiene.",
                },
              ].map((c) => (
                <div
                  key={c.tooth}
                  className="rounded-xl p-4 flex flex-col gap-2"
                  style={{
                    background: "oklch(0.11 0.04 85/0.85)",
                    border: `1.5px solid oklch(0.55 0.18 ${c.color}/0.4)`,
                    borderLeft: `4px solid oklch(0.65 0.22 ${c.color})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "oklch(0.88 0.06 85)" }}
                    >
                      {c.tooth}
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: `oklch(0.55 0.18 ${c.color}/0.2)`,
                        border: `1px solid oklch(0.55 0.18 ${c.color}/0.5)`,
                        color: `oklch(0.78 0.2 ${c.color})`,
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartScan}
              data-ocid="scan_preview.cta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base"
              style={goldBtn}
            >
              <ScanLine className="w-5 h-5" /> Run Your Own Scan →
            </motion.button>
          </div>
        </motion.section>

        {/* ── DENTAL PASSPORT (above How It Works) ── */}
        <motion.section
          ref={passportReveal.ref}
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="w-full max-w-5xl px-6 py-16"
          style={{ opacity: passportReveal.visible ? undefined : 0 }}
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Trust Network
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-2">
              Dental Passport™
            </h2>
            <p className="font-display text-xl text-primary mt-2 italic">
              Your dental records travel with you — anywhere in the world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: "🤝",
                title: "Warm Handoff",
                desc: "Your home dentist issues a digital passport with your full records and allergies — so any dentist treats you with full context.",
              },
              {
                icon: "💳",
                title: "Pre-Approved Budget",
                desc: "No upfront payment required while traveling. The visiting dentist submits a reimbursement to your home dentist. You just receive care.",
              },
              {
                icon: "🔗",
                title: "Dentist-to-Dentist Payment",
                desc: "Payment is settled between dentists — 8% platform fee retained, patient never pays out-of-pocket in a foreign clinic.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl p-6 flex flex-col items-center text-center gap-4"
                style={{
                  background: "oklch(0.11 0.035 85/0.8)",
                  border: "1.5px solid oklch(0.72 0.15 85/0.5)",
                  boxShadow: "0 0 30px oklch(0.72 0.15 85/0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: "oklch(0.22 0.08 85/0.6)",
                    border: "2px solid oklch(0.72 0.15 85/0.5)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85/0.25)",
                  }}
                >
                  {c.icon}
                </div>
                <h3 className="font-display font-bold text-base">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/passport">
              <button
                type="button"
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm shimmer-button"
                style={goldBtn}
                data-ocid="home.passport.primary_button"
              >
                🛂 Get My Passport
              </button>
            </Link>
            <Link to="/issue-passport">
              <button
                type="button"
                className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm border hover:bg-yellow-500/10 transition-all"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85/0.6)",
                  color: "oklch(0.88 0.18 85)",
                }}
                data-ocid="home.passport.secondary_button"
              >
                📋 Issue a Passport
              </button>
            </Link>
          </div>
        </motion.section>

        {/* ── DEMO CTA BANNER ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-5xl px-6 py-10"
        >
          <div
            className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(135deg,oklch(0.20 0.08 85/0.9),oklch(0.14 0.05 85/0.95))",
              border: "1.5px solid oklch(0.72 0.15 85/0.5)",
              boxShadow: "0 0 40px oklch(0.72 0.15 85/0.15)",
            }}
          >
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.25em] mb-2"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Demo
              </p>
              <h3 className="font-display text-2xl font-bold mb-2">
                See DantaNova in Action
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Watch an 8-scene animated demo of Priya detecting cavities and
                booking an emergency dentist.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ to: "/demo" })}
              data-ocid="demo_banner.primary_button"
              className="shrink-0 flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shimmer-button"
              style={goldBtn}
            >
              ▶ Watch Demo Scan
            </motion.button>
          </div>
        </motion.section>

        {/* ── HOW IT WORKS ── */}
        <motion.section
          ref={howReveal.ref}
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`w-full max-w-5xl px-6 py-16 ${howReveal.visible ? "animate-section-reveal" : "opacity-0"}`}
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              From camera to diagnosis in four effortless steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl p-6 flex flex-col items-center text-center"
                style={{
                  background: "oklch(0.11 0.035 85/0.7)",
                  border: "1px solid oklch(0.72 0.15 85/0.3)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-4 font-display font-bold text-lg relative z-10"
                  style={{
                    background: "oklch(0.22 0.08 85/0.9)",
                    border: "2px solid oklch(0.72 0.15 85/0.6)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85/0.3)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  {step.step}
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "oklch(0.18 0.05 85/0.6)" }}
                >
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FEATURED TESTIMONIALS ── */}
        <motion.section
          ref={testReveal.ref}
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`w-full max-w-5xl px-6 py-16 ${testReveal.visible ? "animate-section-reveal" : "opacity-0"}`}
          data-ocid="testimonials.section"
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Social Proof
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-sm">
              Real stories from DantaNova users across India, UK, UAE & beyond
            </p>
          </div>
          {/* Featured 3 */}
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-6 text-center"
            style={{ color: "oklch(0.82 0.16 85)" }}
          >
            ⭐ Featured Reviews
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {TESTIMONIALS.slice(0, 3).map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="rounded-3xl p-8 flex flex-col gap-4 relative overflow-hidden"
                style={{
                  background: "oklch(0.12 0.045 85/0.9)",
                  border: "1.5px solid oklch(0.75 0.18 85/0.5)",
                  boxShadow: "0 0 20px oklch(0.72 0.15 85/0.2)",
                }}
                data-ocid={`testimonials.item.${idx + 1}`}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full self-start"
                  style={{
                    background: "oklch(0.82 0.18 85/0.15)",
                    border: "1px solid oklch(0.82 0.18 85/0.35)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  ⭐ Featured Review
                </span>
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl"
                  style={{
                    background:
                      "linear-gradient(180deg,oklch(0.88 0.18 85),oklch(0.68 0.16 80))",
                  }}
                />
                <StarRow rating={t.rating} />
                <p className="text-base text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "oklch(0.20 0.08 85/0.7)",
                      border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                      color: "oklch(0.88 0.18 85)",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* More reviews */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.15 85/0.15)" }}
            />
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap"
              style={{ color: "oklch(0.72 0.1 85)" }}
            >
              More from Our Community
            </p>
            <div
              className="flex-1 h-px"
              style={{ background: "oklch(0.72 0.15 85/0.15)" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(3).map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
                style={{
                  background: "oklch(0.11 0.035 85/0.8)",
                  border: "1px solid oklch(0.75 0.18 85/0.35)",
                }}
                data-ocid={`testimonials.item.${idx + 4}`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{
                    background:
                      "linear-gradient(180deg,oklch(0.82 0.18 85),oklch(0.62 0.14 80))",
                  }}
                />
                <StarRow rating={t.rating} />
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "oklch(0.20 0.08 85/0.7)",
                      border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                      color: "oklch(0.88 0.18 85)",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {userTestimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.45, delay: idx * 0.05 }}
                  className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
                  style={{
                    background: "oklch(0.11 0.04 85/0.85)",
                    border: "1px solid oklch(0.75 0.18 85/0.45)",
                  }}
                  data-ocid={`testimonials.item.${TESTIMONIALS.length + idx + 1}`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{
                      background:
                        "linear-gradient(180deg,oklch(0.82 0.18 85),oklch(0.62 0.14 80))",
                    }}
                  />
                  <StarRow rating={t.rating} />
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "oklch(0.20 0.08 85/0.7)",
                        border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                        color: "oklch(0.88 0.18 85)",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Review form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-10 rounded-2xl p-8 md:p-10"
            style={{
              background: "oklch(0.11 0.035 85/0.8)",
              border: "1.5px solid oklch(0.72 0.15 85/0.3)",
            }}
            data-ocid="testimonials.panel"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.20 0.08 85/0.7)",
                  border: "1.5px solid oklch(0.72 0.15 85/0.5)",
                }}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">
                  Share Your Experience
                </h3>
                <p className="text-xs text-muted-foreground">
                  Help others by leaving an honest review
                </p>
              </div>
            </div>
            {identity ? (
              <form onSubmit={handleSubmitTestimonial} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="rname"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Your Name
                    </label>
                    <Input
                      id="rname"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Sarah T."
                      className="rounded-full bg-background/50 border-border/50"
                      data-ocid="testimonial.input"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="rrole"
                      className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Role / Title
                    </label>
                    <Input
                      id="rrole"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Frequent Traveler"
                      className="rounded-full bg-background/50 border-border/50"
                      data-ocid="testimonial.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rating
                  </p>
                  <StarPicker value={formRating} onChange={setFormRating} />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="rquote"
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Your Review
                  </label>
                  <Textarea
                    id="rquote"
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="rounded-2xl bg-background/50 border-border/50 resize-none"
                    data-ocid="testimonial.textarea"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    style={
                      isSubmitting
                        ? {
                            background: "oklch(0.55 0.12 85)",
                            color: "oklch(0.06 0.01 60)",
                          }
                        : goldBtn
                    }
                    data-ocid="testimonial.submit_button"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="flex flex-col items-center gap-5 py-8 text-center"
                data-ocid="testimonial.error_state"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.15 0.05 85/0.6)",
                    border: "1.5px solid oklch(0.72 0.15 85/0.35)",
                  }}
                >
                  <User
                    className="w-7 h-7"
                    style={{ color: "oklch(0.78 0.14 85)" }}
                  />
                </div>
                <div>
                  <p className="font-display font-semibold text-base mb-1">
                    Sign in to leave a review
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Join DantaNova and share your experience.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => login()}
                  className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm"
                  style={goldBtn}
                  data-ocid="testimonial.primary_button"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In to Review
                </button>
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* ── BEFORE / AFTER ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              See the Difference
            </h2>
            <p className="text-muted-foreground text-sm">
              DantaNova catches what&apos;s invisible to the naked eye
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-7"
              style={{
                background: "oklch(0.11 0.03 25/0.7)",
                border: "1px solid oklch(0.5 0.18 20/0.5)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.4 0.18 20/0.3)" }}
                >
                  <X
                    className="w-4 h-4"
                    style={{ color: "oklch(0.65 0.2 20)" }}
                  />
                </div>
                <h3
                  className="font-display font-bold text-lg"
                  style={{ color: "oklch(0.65 0.2 20)" }}
                >
                  WITHOUT DantaNova
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Miss cavities until they hurt",
                  "Expensive emergency visits",
                  "No early warning system",
                  "Wasted dental visits",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <X
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "oklch(0.65 0.2 20)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-2xl p-7"
              style={{
                background: "oklch(0.11 0.04 85/0.8)",
                border: "1px solid oklch(0.75 0.18 85/0.55)",
                boxShadow: "0 0 28px oklch(0.75 0.18 85/0.12)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.22 0.08 85/0.5)" }}
                >
                  <Check
                    className="w-4 h-4"
                    style={{ color: "oklch(0.82 0.18 85)" }}
                  />
                </div>
                <h3 className="font-display font-bold text-lg text-gradient-gold">
                  WITH DantaNova
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Catch issues early — before they cause pain",
                  "Free AI scans from your phone, anytime",
                  "Color-coded warnings with clear severity levels",
                  "Emergency dentist match in under 15 minutes",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: "oklch(0.82 0.18 85)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ── EMERGENCY DENTIST FINDER PROMO ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-5xl px-6 py-10"
        >
          <div
            className="rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
            style={{
              background:
                "linear-gradient(135deg,oklch(0.12 0.05 25/0.85),oklch(0.14 0.06 20/0.9))",
              border: "2px solid oklch(0.65 0.22 20/0.5)",
              boxShadow: "0 0 50px oklch(0.55 0.18 20/0.18)",
            }}
          >
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 mx-auto md:mx-0"
                style={{
                  background: "oklch(0.55 0.18 20/0.2)",
                  border: "2px solid oklch(0.65 0.22 20/0.5)",
                }}
              >
                <Stethoscope
                  className="w-8 h-8"
                  style={{ color: "oklch(0.75 0.22 20)" }}
                />
              </div>
            </div>
            <div className="flex-1">
              <h3
                className="font-display text-2xl font-bold mb-2"
                style={{ color: "oklch(0.88 0.06 80)" }}
              >
                Emergency Dentist? We've Got You
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0">
                Browse verified dentists available for urgent care. Filter by
                urgency and book in minutes — no waiting room anxiety.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate({ to: "/find-dentist" })}
              data-ocid="home.emergency.cta"
              className="shrink-0 flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base"
              style={{
                background:
                  "linear-gradient(135deg,oklch(0.72 0.22 20),oklch(0.58 0.20 18))",
                color: "oklch(0.98 0.01 60)",
                boxShadow: "0 4px 28px oklch(0.55 0.18 20/0.45)",
              }}
            >
              <MapPin className="w-5 h-5" /> Find Emergency Dentist
            </motion.button>
          </div>
        </motion.section>

        {/* ── ABOUT SECTION (no photo) ── */}
        <motion.section
          ref={aboutReveal.ref}
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className={`w-full max-w-5xl px-6 py-16 ${aboutReveal.visible ? "animate-section-reveal" : "opacity-0"}`}
        >
          <div className="text-center mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              About
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
              About DantaNova
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Making dental healthcare accessible, affordable, and stress-free
              for everyone, everywhere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-5">
              <p className="text-muted-foreground leading-relaxed">
                DantaNova was built because too many people — traveling, living
                abroad, or simply too busy — skip dental care until it's too
                late. Our platform gives everyone a first line of dental
                defense, anywhere in the world.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Dental Passport concept came from a real gap: when you
                travel and need urgent dental care, there's no trust layer, no
                records, no continuity. DantaNova changes that.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:DANTANOVA.14@gmail.com"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-yellow-500/10 transition-all"
                  style={{
                    border: "1.5px solid oklch(0.72 0.15 85/0.5)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  DANTANOVA.14@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/dantanova-dental-ai-aa33a8400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-yellow-500/10 transition-all"
                  style={{
                    border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                    color: "oklch(0.75 0.08 85)",
                  }}
                >
                  <Users className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "oklch(0.82 0.14 85)" }}
              >
                Built by Swanandi Manoj Vispute, Founder &amp; CEO of DantaNova
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Brain,
                  title: "AI Technology",
                  desc: "CNN ensemble trained on 50,000+ clinical dental images",
                },
                {
                  icon: Shield,
                  title: "Blockchain Secured",
                  desc: "All records stored on Internet Computer blockchain",
                },
                {
                  icon: Globe,
                  title: "GDPR Compliant",
                  desc: "Full data privacy and GDPR rights implemented",
                },
                {
                  icon: Activity,
                  title: "Clinically Aligned",
                  desc: "Detection thresholds calibrated to dental screening standards",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: "oklch(0.11 0.035 85/0.8)",
                    border: "1px solid oklch(0.72 0.15 85/0.35)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "oklch(0.20 0.08 85/0.6)",
                      border: "1px solid oklch(0.72 0.15 85/0.4)",
                    }}
                  >
                    <c.icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <h4 className="font-display font-bold text-sm">{c.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── LIVE DEMO SECTION ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="w-full max-w-5xl px-6 py-16"
        >
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Try It Instantly
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-neon">Live Demo</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Drop any dental photo below and see our AI analyze it in real-time
              — no sign-in required for the preview.
            </p>
          </div>
          <LiveDemoSection />
        </motion.section>

        {/* ── SCALE SIGNALS ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full px-6 py-14"
          style={{
            background: "oklch(0.10 0.04 85/0.6)",
            borderTop: "1px solid oklch(0.72 0.15 85/0.12)",
            borderBottom: "1px solid oklch(0.72 0.15 85/0.12)",
          }}
        >
          <div className="max-w-5xl mx-auto text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-gradient-gold">
              DantaNova is Growing
            </h2>
          </div>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
            {[
              { icon: TrendingUp, text: "5,000+ scans completed" },
              { icon: Globe, text: "Users across 12+ cities" },
              {
                icon: MapPin,
                text: "Emergency dentists in Mumbai, Delhi, Bangalore & Dubai",
              },
              {
                icon: Zap,
                text: "Coming Soon: Teledentistry video consultations",
              },
              { icon: Database, text: "Trained on 50,000+ dental images" },
              { icon: Lock, text: "Blockchain-secured data" },
            ].map((item) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 px-5 py-3 rounded-full text-sm font-medium"
                style={{
                  background: "oklch(0.14 0.05 85/0.7)",
                  border: "1px solid oklch(0.72 0.15 85/0.3)",
                  color: "oklch(0.85 0.1 85)",
                }}
              >
                <item.icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                />
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FINAL CTA ── */}
        <motion.section
          variants={sV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-full max-w-4xl px-6 py-16 mb-8"
        >
          <div
            className="rounded-3xl py-16 px-8 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg,oklch(0.15 0.06 85/0.9),oklch(0.11 0.03 85/0.95))",
              border: "1px solid oklch(0.72 0.15 85/0.35)",
              boxShadow: "0 0 80px oklch(0.72 0.15 85/0.15)",
            }}
          >
            <div
              className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "oklch(0.72 0.15 85/0.07)" }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-3xl md:text-5xl font-bold mb-3 text-gradient-gold"
            >
              Your smile deserves the best care —
              <br className="hidden md:block" /> anywhere, anytime.
            </motion.h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Start scanning in 30 seconds. It's completely free.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartScan}
              data-ocid="home.cta.primary_button"
              className="flex items-center justify-center gap-2 mx-auto px-10 py-4 rounded-full font-semibold text-base shimmer-button"
              style={goldBtn}
            >
              <ScanLine className="w-5 h-5" />
              Start Free Scan
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="py-12 px-6"
        style={{
          background: "oklch(0.07 0.02 60/0.9)",
          borderTop: "1px solid oklch(0.72 0.15 85/0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Logo + contact */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <LogoCircle size="sm" />
                <span className="font-display font-bold text-lg">
                  Danta<span className="text-gradient-gold">Nova</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Because Every Smile Matters The Most
              </p>
              <a
                href="mailto:DANTANOVA.14@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                style={{ color: "oklch(0.75 0.12 85)" }}
              >
                <Mail className="w-4 h-4" />
                DANTANOVA.14@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/dantanova-dental-ai-aa33a8400"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                style={{ color: "oklch(0.68 0.10 85)" }}
              >
                <Users className="w-4 h-4" />
                LinkedIn — DantaNova Dental AI
              </a>
            </div>
            {/* Quick links */}
            <div className="flex flex-col gap-3">
              <h4
                className="font-display font-bold text-sm uppercase tracking-wider"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Quick Links
              </h4>
              {[
                { label: "Home", to: "/" },
                { label: "Start Scan", to: "/scan" },
                { label: "Find Dentist", to: "/find-dentist" },
                { label: "Dental Passport", to: "/passport" },
                { label: "Pitch", to: "/pitch" },
                { label: "Watch Demo", to: "/demo" },
              ].map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h4
                className="font-display font-bold text-sm uppercase tracking-wider"
                style={{ color: "oklch(0.82 0.16 85)" }}
              >
                Legal
              </h4>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <a
                href="mailto:DANTANOVA.14@gmail.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          {/* Gold divider */}
          <div className="gold-divider mb-6" />
          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} DantaNova. All rights reserved.
              &nbsp;·&nbsp; Developed by Swanandi Manoj Vispute
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent("dentaai-scanner-n0h.caffeine.xyz")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ❤ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
