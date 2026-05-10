import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Lightbulb,
  MapPin,
  Shield,
  Stethoscope,
  Video,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SYMPTOMS = [
  "Toothache",
  "Swelling",
  "Bleeding gums",
  "Sensitivity",
  "Cracked tooth",
  "Lost filling",
  "Jaw pain",
  "Bad breath",
  "Loose tooth",
  "Jaw clicking",
];

const DURATION_OPTIONS = [
  { label: "Today", value: 0 },
  { label: "2–3 days", value: 2 },
  { label: "1 week", value: 7 },
  { label: "More than 1 week", value: 10 },
];

const TIPS = [
  {
    icon: Lightbulb,
    title: "Good Lighting",
    desc: "Position yourself near a window or bright lamp. Dentists need to see clearly to assess your condition.",
  },
  {
    icon: Shield,
    title: "Clear Photos",
    desc: "Take close-up photos of the affected area before your consultation. Multiple angles help dentists diagnose faster.",
  },
  {
    icon: Wifi,
    title: "Stable Internet",
    desc: "A stable Wi-Fi connection ensures uninterrupted communication. Avoid moving to areas with poor signal.",
  },
];

type TriageLevel = "low" | "medium" | "high";

function getTriageLevel(pain: number, durationDays: number): TriageLevel {
  if (pain >= 7 || durationDays >= 10) return "high";
  if (pain >= 4 || durationDays >= 2) return "medium";
  return "low";
}

const TRIAGE_CONFIG: Record<
  TriageLevel,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: typeof AlertTriangle;
    headline: string;
    sub: string;
    cta: string;
    ctaLink: string;
  }
> = {
  high: {
    label: "URGENT",
    color: "oklch(0.65 0.22 25)",
    bg: "oklch(0.62 0.22 25 / 0.14)",
    border: "oklch(0.65 0.22 25 / 0.5)",
    icon: AlertTriangle,
    headline: "See a dentist immediately.",
    sub: "Your symptoms suggest a serious condition requiring urgent in-person care.",
    cta: "Find Emergency Dentist",
    ctaLink: "/find-dentist",
  },
  medium: {
    label: "Prompt Attention",
    color: "oklch(0.82 0.18 72)",
    bg: "oklch(0.78 0.16 80 / 0.12)",
    border: "oklch(0.88 0.18 85 / 0.4)",
    icon: Clock,
    headline: "Book within 48 hours.",
    sub: "Your symptoms need attention soon. Book an appointment promptly to prevent worsening.",
    cta: "Book Appointment",
    ctaLink: "/book",
  },
  low: {
    label: "Routine Care",
    color: "oklch(0.72 0.17 150)",
    bg: "oklch(0.42 0.15 145 / 0.12)",
    border: "oklch(0.72 0.17 150 / 0.4)",
    icon: CheckCircle,
    headline: "Book a regular appointment.",
    sub: "Your symptoms appear non-urgent. Schedule a routine check-up at your convenience.",
    cta: "Book Appointment",
    ctaLink: "/book",
  },
};

export default function TeledentistryPage() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set(),
  );
  const [pain, setPain] = useState(5);
  const [duration, setDuration] = useState(0);

  const triageLevel = getTriageLevel(pain, duration);
  const triageConfig = TRIAGE_CONFIG[triageLevel];
  const TriageIcon = triageConfig.icon;

  const painColor =
    pain <= 3
      ? "oklch(0.72 0.17 150)"
      : pain <= 6
        ? "oklch(0.88 0.18 85)"
        : "oklch(0.65 0.22 25)";

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const canProceedStep1 = selectedSymptoms.size > 0;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-border/40 backdrop-blur"
        style={{ background: "oklch(0.10 0.006 70 / 0.92)" }}
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-base font-bold"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="teledentistry.home_link"
          >
            DantaNova
          </Link>
          <Link
            to="/scan"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="teledentistry.scan_link"
          >
            Free Scan →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border"
            style={{
              background: "oklch(0.78 0.16 80 / 0.12)",
              borderColor: "oklch(0.88 0.18 85 / 0.3)",
              color: "oklch(0.88 0.18 85)",
            }}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Symptom Triage Tool
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Teledentistry
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Describe your symptoms and get connected with a verified dentist for
            a remote consultation
          </p>
        </motion.div>

        {/* Coming-soon notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 p-4 rounded-2xl border mb-8 text-sm"
          style={{
            background: "oklch(0.12 0.008 60 / 0.9)",
            borderColor: "oklch(0.78 0.16 80 / 0.25)",
          }}
        >
          <Video
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "oklch(0.88 0.18 85)" }}
          />
          <p className="text-muted-foreground">
            <span
              className="font-semibold"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Live video consultations coming soon.
            </span>{" "}
            For now, use our triage guide below and book an in-person
            appointment with a verified dentist.
          </p>
        </motion.div>

        {/* Stepper progress */}
        <div className="mb-8" data-ocid="teledentistry.progress_bar">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 flex-1 last:flex-none"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all"
                  style={{
                    borderColor:
                      step >= s
                        ? "oklch(0.88 0.18 85)"
                        : "oklch(0.22 0.015 60)",
                    background:
                      step >= s ? "oklch(0.78 0.16 80 / 0.2)" : "transparent",
                    color:
                      step >= s ? "oklch(0.88 0.18 85)" : "oklch(0.55 0.03 70)",
                  }}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 4 && (
                  <div
                    className="flex-1 h-0.5 rounded-full transition-all"
                    style={{
                      background:
                        step > s
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.22 0.015 60)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>Symptoms</span>
            <span>Pain level</span>
            <span>Duration</span>
            <span>Result</span>
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Symptoms */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl border border-border/40 mb-6"
              style={{ background: "oklch(0.12 0.008 60 / 0.9)" }}
              data-ocid="teledentistry.symptoms_step"
            >
              <h2 className="font-bold text-lg text-foreground mb-5">
                <span style={{ color: "oklch(0.88 0.18 85)" }}>Step 1.</span>{" "}
                Describe your symptoms
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select all that apply:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.has(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all hover:scale-[1.02]"
                      style={{
                        background: isSelected
                          ? "oklch(0.78 0.16 80 / 0.18)"
                          : "oklch(0.10 0.006 70 / 0.7)",
                        borderColor: isSelected
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.22 0.015 60 / 0.6)",
                        color: isSelected
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.85 0.01 80)",
                      }}
                      data-ocid={`teledentistry.symptom_${sym.toLowerCase().replace(/ /g, "_")}`}
                    >
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-current flex-shrink-0" />
                      )}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Pain scale */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl border border-border/40 mb-6"
              style={{ background: "oklch(0.12 0.008 60 / 0.9)" }}
              data-ocid="teledentistry.pain_step"
            >
              <h2 className="font-bold text-lg text-foreground mb-5">
                <span style={{ color: "oklch(0.88 0.18 85)" }}>Step 2.</span>{" "}
                How severe is your pain?
              </h2>
              <div className="text-center mb-8">
                <motion.div
                  key={pain}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-7xl font-extrabold mb-2 transition-colors"
                  style={{ color: painColor }}
                >
                  {pain}
                </motion.div>
                <div
                  className="text-sm font-medium"
                  style={{ color: painColor }}
                >
                  {pain <= 3 ? "Mild" : pain <= 6 ? "Moderate" : "Severe"}
                </div>
              </div>
              <div className="relative px-2 mb-6">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={pain}
                  onChange={(e) => setPain(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.72 0.17 150) 0%, oklch(0.88 0.18 85) 45%, oklch(0.65 0.22 25) 100%)",
                    accentColor: painColor,
                  }}
                  data-ocid="teledentistry.pain_slider"
                  aria-label="Pain level 1 to 10"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 — No pain</span>
                  <span>5 — Moderate</span>
                  <span>10 — Unbearable</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                {[
                  {
                    range: "1–3",
                    label: "Mild",
                    color: "oklch(0.72 0.17 150)",
                  },
                  {
                    range: "4–6",
                    label: "Moderate",
                    color: "oklch(0.88 0.18 85)",
                  },
                  {
                    range: "7–10",
                    label: "Severe",
                    color: "oklch(0.65 0.22 25)",
                  },
                ].map((item) => (
                  <div
                    key={item.range}
                    className="p-2 rounded-xl border"
                    style={{
                      borderColor: `${item.color} / 0.3`,
                      background: `${item.color} / 0.1`,
                    }}
                  >
                    <div className="font-bold" style={{ color: item.color }}>
                      {item.range}
                    </div>
                    <div className="text-muted-foreground">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Duration */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl border border-border/40 mb-6"
              style={{ background: "oklch(0.12 0.008 60 / 0.9)" }}
              data-ocid="teledentistry.duration_step"
            >
              <h2 className="font-bold text-lg text-foreground mb-5">
                <span style={{ color: "oklch(0.88 0.18 85)" }}>Step 3.</span>{" "}
                How long have you had these symptoms?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setDuration(opt.value)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium border text-left transition-all hover:scale-[1.02]"
                    style={{
                      background:
                        duration === opt.value
                          ? "oklch(0.78 0.16 80 / 0.18)"
                          : "oklch(0.10 0.006 70 / 0.7)",
                      borderColor:
                        duration === opt.value
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.22 0.015 60 / 0.6)",
                      color:
                        duration === opt.value
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.85 0.01 80)",
                    }}
                    data-ocid={`teledentistry.duration_${opt.label.toLowerCase().replace(/ /g, "_")}`}
                  >
                    <Clock
                      className="w-4 h-4 flex-shrink-0"
                      style={{
                        color:
                          duration === opt.value
                            ? "oklch(0.88 0.18 85)"
                            : "oklch(0.55 0.03 70)",
                      }}
                    />
                    {opt.label}
                    {duration === opt.value && (
                      <CheckCircle
                        className="w-4 h-4 ml-auto"
                        style={{ color: "oklch(0.88 0.18 85)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Triage result */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              data-ocid="teledentistry.triage_result"
            >
              <div
                className="p-6 rounded-2xl border mb-6 text-center"
                style={{
                  background: triageConfig.bg,
                  borderColor: triageConfig.border,
                }}
              >
                <TriageIcon
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: triageConfig.color }}
                />
                <div
                  className="text-2xl font-extrabold mb-1"
                  style={{ color: triageConfig.color }}
                >
                  {triageConfig.label}
                </div>
                <p className="font-bold text-foreground mb-1">
                  {triageConfig.headline}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {triageConfig.sub}
                </p>

                {/* Symptom summary */}
                {selectedSymptoms.size > 0 && (
                  <div
                    className="rounded-xl p-3 mb-5 text-sm text-left"
                    style={{ background: "oklch(0.10 0.006 70 / 0.5)" }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    >
                      Selected symptoms:
                    </p>
                    <p className="text-muted-foreground">
                      {[...selectedSymptoms].join(" · ")}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to={triageConfig.ctaLink as "/find-dentist" | "/book"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                      color: "oklch(0.08 0.005 60)",
                    }}
                    data-ocid="teledentistry.cta_primary_button"
                  >
                    {triageConfig.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/passport"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border border-border/50 transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.12 0.008 60 / 0.8)",
                      color: "oklch(0.88 0.18 85)",
                    }}
                    data-ocid="teledentistry.passport_button"
                  >
                    <Shield className="w-4 h-4" />
                    View Dental Passport
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSelectedSymptoms(new Set());
                  setPain(5);
                  setDuration(0);
                }}
                className="w-full py-3 rounded-2xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                data-ocid="teledentistry.restart_button"
              >
                Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid="teledentistry.prev_button"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={step === 1 && !canProceedStep1}
              className="flex items-center gap-2 px-7 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                color: "oklch(0.08 0.005 60)",
              }}
              data-ocid="teledentistry.next_button"
            >
              {step === 3 ? "See Triage Result" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* What is Teledentistry */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Info
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.88 0.18 85)" }}
            />
            <h2 className="text-xl font-bold text-foreground">
              What is Teledentistry?
            </h2>
          </div>
          <div
            className="p-6 rounded-2xl border border-border/40"
            style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Teledentistry is the use of technology to deliver dental care,
              advice, and education at a distance. Through phone calls, video
              calls, or messaging, verified dentists can assess your symptoms,
              provide guidance, and determine whether you need in-person care.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                "Get a professional opinion without leaving home",
                "Receive urgent triage when clinics are closed",
                "Ideal for travellers, expats, and rural communities",
                "Follow up after treatment with your dentist remotely",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-foreground/80"
                >
                  <span style={{ color: "oklch(0.88 0.18 85)" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Consultation tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6">
            Remote Consultation Tips
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl border border-border/40"
                  style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: "oklch(0.78 0.16 80 / 0.14)",
                      border: "1px solid oklch(0.88 0.18 85 / 0.2)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 rounded-2xl border border-border/40"
          style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
        >
          <MapPin
            className="w-8 h-8 mx-auto mb-3"
            style={{ color: "oklch(0.88 0.18 85)" }}
          />
          <p className="text-muted-foreground text-sm mb-4">
            Already scanned? View your AI dental scan results
          </p>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
              color: "oklch(0.08 0.005 60)",
            }}
            data-ocid="teledentistry.results_cta_button"
          >
            <Calendar className="w-4 h-4" />
            View Scan Results
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
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
