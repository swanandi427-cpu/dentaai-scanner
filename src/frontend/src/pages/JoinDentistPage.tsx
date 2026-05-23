import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const OUTREACH_MSG =
  "Hi Dr. [Name], I am Swanandi, founder of DantaNova — an AI-powered dental health platform connecting patients with trusted dentists in Mumbai and Pune. We would love to feature your clinic for free. Patients can find you, book appointments, and connect directly — no commission, no fees. Check it out: https://dentaai-scanner-n0h.caffeine.xyz/join-dentist — interested in joining?";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Free Listing",
    desc: "Get your clinic listed and discovered by patients at absolutely zero cost — forever.",
  },
  {
    icon: BadgeCheck,
    title: "No Commission Ever",
    desc: "Every patient connection is 100% yours. We never take a cut from your consultations.",
  },
  {
    icon: Users,
    title: "Direct Patient Connections",
    desc: "Patients reach out to you directly. No middleman, no gatekeeper between you and your next patient.",
  },
  {
    icon: Zap,
    title: "Emergency Referrals",
    desc: "Get matched with urgent patients who need immediate dental care in your locality.",
  },
  {
    icon: MessageCircle,
    title: "Dental Passport Network",
    desc: "Access verified patient records via the Dental Passport — treat travelers with full context.",
  },
  {
    icon: Award,
    title: "Verified Dentist Badge",
    desc: "Earn a gold verified badge on your profile after license confirmation — instant trust signal.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Register Your Clinic",
    desc: "Fill in your clinic details, specialization, and contact info. Takes less than 2 minutes.",
  },
  {
    n: "02",
    title: "Get Discovered by Patients",
    desc: "Your profile is immediately searchable. Patients in your area find you via AI-powered matching.",
  },
  {
    n: "03",
    title: "Connect and Grow",
    desc: "Patients book appointments directly with you. Grow your practice — completely free.",
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Priya Sharma",
    clinic: "Smile Craft Dental, Mumbai",
    text: "I got 3 new patients in my first week on DantaNova. Completely free and incredibly easy to set up. The emergency referrals alone were worth it.",
    stars: 5,
  },
  {
    name: "Dr. Rakesh Joshi",
    clinic: "Joshi Dental Care, Pune",
    text: "What impressed me most is the zero commission model. Every patient who books through DantaNova pays me directly. No fees, no surprises. Highly recommend.",
    stars: 5,
  },
  {
    name: "Dr. Sneha Patil",
    clinic: "PearlDent Clinic, Andheri West",
    text: "The Dental Passport feature is a game-changer for treating out-of-town patients. I have their complete dental history before they even sit in the chair.",
    stars: 5,
  },
];

const STATS = [
  { label: "Dentists Joined", value: "100+" },
  { label: "Commission Charged", value: "Zero" },
  { label: "Cost to Join", value: "Free Forever" },
  { label: "Trust Signal", value: "Verified Badges" },
];

const SPECIALIZATIONS = [
  "General Dentistry",
  "Orthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Cosmetic Dentistry",
  "Endodontics",
  "Periodontics",
  "Other",
];

function HudBrackets({ size = 20 }: { size?: number }) {
  const s = size;
  return (
    <>
      {/* TL */}
      <span
        aria-hidden
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: s,
          height: s,
          borderTop: "2px solid oklch(0.88 0.18 85/0.7)",
          borderLeft: "2px solid oklch(0.88 0.18 85/0.7)",
        }}
      />
      {/* TR */}
      <span
        aria-hidden
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: s,
          height: s,
          borderTop: "2px solid oklch(0.88 0.18 85/0.7)",
          borderRight: "2px solid oklch(0.88 0.18 85/0.7)",
        }}
      />
      {/* BL */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: s,
          height: s,
          borderBottom: "2px solid oklch(0.88 0.18 85/0.7)",
          borderLeft: "2px solid oklch(0.88 0.18 85/0.7)",
        }}
      />
      {/* BR */}
      <span
        aria-hidden
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: s,
          height: s,
          borderBottom: "2px solid oklch(0.88 0.18 85/0.7)",
          borderRight: "2px solid oklch(0.88 0.18 85/0.7)",
        }}
      />
    </>
  );
}

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: threshold });
  return { ref, visible };
}

export default function JoinDentistPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    clinicName: "",
    specialization: "",
    city: "",
    area: "",
    phone: "",
    email: "",
  });

  const benefitsReveal = useReveal();
  const stepsReveal = useReveal();
  const statsReveal = useReveal();
  const outreachReveal = useReveal();
  const testimonialsReveal = useReveal();
  const ctaReveal = useReveal();

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleCopy() {
    navigator.clipboard.writeText(OUTREACH_MSG).then(() => {
      setCopied(true);
      toast.success("Message copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.clinicName ||
      !form.specialization ||
      !form.city ||
      !form.area ||
      !form.phone ||
      !form.email
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! We will contact you shortly.", {
      description: `Welcome to DantaNova, Dr. ${form.fullName.split(" ")[0]}!`,
      duration: 6000,
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.07 0.015 60) 0%, oklch(0.10 0.015 70) 50%, oklch(0.07 0.012 55) 100%)",
        color: "oklch(0.96 0.01 80)",
      }}
    >
      {/* Back nav */}
      <div className="px-6 pt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          style={{ color: "oklch(0.68 0.10 85)" }}
          data-ocid="join.back_link"
        >
          ← Back to DantaNova
        </Link>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 overflow-hidden">
        {/* Animated scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, oklch(0.88 0.18 85/0.8) 50%, transparent 100%)",
          }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        {/* Glow orbs */}
        <div
          aria-hidden
          className="absolute top-12 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.88 0.18 85/0.07)" }}
        />
        <div
          aria-hidden
          className="absolute bottom-8 right-1/4 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.75 0.19 75/0.06)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <Badge
            className="mb-4 px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border"
            style={{
              background: "oklch(0.88 0.18 85/0.12)",
              borderColor: "oklch(0.88 0.18 85/0.4)",
              color: "oklch(0.92 0.18 88)",
            }}
          >
            For Dentists in Mumbai &amp; Pune
          </Badge>

          <h1
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.18 90) 0%, oklch(0.88 0.18 85) 50%, oklch(0.75 0.19 75) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Grow Your Dental Practice.{" "}
            <span style={{ WebkitTextFillColor: "oklch(0.88 0.18 85)" }}>
              For Free.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.78 0.04 75)" }}
          >
            DantaNova connects dentists directly with patients — no commission,
            no fees, no middleman cut. Join hundreds of dentists already growing
            their practice for free.
          </p>
          <p className="text-sm mb-8" style={{ color: "oklch(0.62 0.06 80)" }}>
            ✓ Free listing &nbsp;·&nbsp; ✓ Zero commission &nbsp;·&nbsp; ✓
            Verified badge &nbsp;·&nbsp; ✓ Emergency referrals
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.75 0.19 75))",
                color: "oklch(0.08 0.005 60)",
                boxShadow: "0 0 28px oklch(0.88 0.18 85/0.35)",
              }}
              data-ocid="join.hero_cta_button"
            >
              <Sparkles className="w-4 h-4" />
              Join DantaNova Free
              <ChevronRight className="w-4 h-4" />
            </motion.button>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                window.open(
                  "https://dentaai-scanner-n0h.caffeine.xyz",
                  "_blank",
                )
              }
              className="rounded-full px-8"
              style={{
                borderColor: "oklch(0.88 0.18 85/0.4)",
                color: "oklch(0.88 0.18 85)",
              }}
              data-ocid="join.preview_button"
            >
              Preview Platform
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <motion.div
          ref={statsReveal.ref}
          initial={{ opacity: 0, y: 24 }}
          animate={statsReveal.visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={statsReveal.visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative rounded-2xl p-5 text-center overflow-hidden"
              style={{
                background: "oklch(0.12 0.015 65/0.8)",
                border: "1px solid oklch(0.88 0.18 85/0.18)",
                backdropFilter: "blur(16px)",
              }}
            >
              <HudBrackets size={12} />
              <div
                className="font-display font-black text-2xl mb-1"
                style={{ color: "oklch(0.92 0.18 88)" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────── */}
      <section
        className="px-4 py-16"
        style={{ background: "oklch(0.09 0.012 62/0.6)" }}
      >
        <motion.div
          ref={benefitsReveal.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={benefitsReveal.visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2
              className="font-display font-black text-3xl md:text-4xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.80 0.16 82))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why Dentists Choose DantaNova
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to grow your practice — built for Indian
              dentists, by design.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                animate={benefitsReveal.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.09, duration: 0.45 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: "oklch(0.11 0.014 62/0.9)",
                  border: "1px solid oklch(0.88 0.18 85/0.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <HudBrackets size={14} />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "oklch(0.88 0.18 85/0.12)",
                    border: "1px solid oklch(0.88 0.18 85/0.3)",
                  }}
                >
                  <b.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  />
                </div>
                <h3
                  className="font-display font-bold text-base mb-2"
                  style={{ color: "oklch(0.92 0.14 85)" }}
                >
                  {b.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <motion.div
          ref={stepsReveal.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={stepsReveal.visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2
              className="font-display font-black text-3xl md:text-4xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.80 0.16 82))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to start growing your patient base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                animate={stepsReveal.visible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative rounded-2xl p-7 overflow-hidden"
                style={{
                  background: "oklch(0.10 0.015 65/0.8)",
                  border: "1px solid oklch(0.88 0.18 85/0.2)",
                }}
              >
                <HudBrackets size={14} />
                <div
                  className="font-display font-black text-5xl mb-4 leading-none select-none"
                  style={{ color: "oklch(0.88 0.18 85/0.2)" }}
                >
                  {step.n}
                </div>
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: "oklch(0.92 0.14 85)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── REGISTRATION FORM ───────────────────────────────────── */}
      <section
        ref={formRef}
        id="register"
        className="px-4 py-16"
        style={{ background: "oklch(0.09 0.012 62/0.5)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="font-display font-black text-3xl md:text-4xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.80 0.16 82))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Register Your Interest
            </h2>
            <p className="text-muted-foreground">
              Fill in your details and we'll reach out to onboard your clinic.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl p-10 text-center overflow-hidden"
              style={{
                background: "oklch(0.11 0.015 65/0.9)",
                border: "1px solid oklch(0.88 0.18 85/0.4)",
              }}
              data-ocid="join.success_state"
            >
              <HudBrackets />
              <CheckCircle2
                className="w-14 h-14 mx-auto mb-4"
                style={{ color: "oklch(0.88 0.18 85)" }}
              />
              <h3
                className="font-display font-black text-2xl mb-2"
                style={{ color: "oklch(0.92 0.16 86)" }}
              >
                Welcome to DantaNova!
              </h3>
              <p className="text-muted-foreground">
                Thank you, Dr. {form.fullName}. We will contact you shortly at{" "}
                <span style={{ color: "oklch(0.88 0.18 85)" }}>
                  {form.email}
                </span>
                .
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl p-8 overflow-hidden"
              style={{
                background: "oklch(0.11 0.015 65/0.9)",
                border: "1px solid oklch(0.88 0.18 85/0.2)",
                backdropFilter: "blur(20px)",
              }}
            >
              <HudBrackets />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="fullName"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Dr. Priya Sharma"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                    data-ocid="join.fullname_input"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                    }}
                  />
                </div>
                {/* Clinic Name */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="clinicName"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Clinic Name
                  </Label>
                  <Input
                    id="clinicName"
                    placeholder="Smile Craft Dental"
                    value={form.clinicName}
                    onChange={(e) => handleChange("clinicName", e.target.value)}
                    required
                    data-ocid="join.clinicname_input"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                    }}
                  />
                </div>
                {/* Specialization */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="specialization"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Specialization
                  </Label>
                  <select
                    id="specialization"
                    value={form.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                    required
                    data-ocid="join.specialization_select"
                    className="w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                      color: "oklch(0.92 0.01 80)",
                    }}
                  >
                    <option value="" disabled>
                      Select specialization
                    </option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="city"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    City
                  </Label>
                  <select
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                    data-ocid="join.city_select"
                    className="w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                      color: "oklch(0.92 0.01 80)",
                    }}
                  >
                    <option value="" disabled>
                      Select city
                    </option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
                {/* Area */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label
                    htmlFor="area"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Area / Locality
                  </Label>
                  <Input
                    id="area"
                    placeholder="e.g. Andheri West, Baner"
                    value={form.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    required
                    data-ocid="join.area_input"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                    }}
                  />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="phone"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    data-ocid="join.phone_input"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                    }}
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="email"
                    style={{ color: "oklch(0.82 0.12 82)" }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    data-ocid="join.email_input"
                    style={{
                      background: "oklch(0.09 0.01 60/0.7)",
                      borderColor: "oklch(0.88 0.18 85/0.2)",
                    }}
                  />
                </div>
              </div>

              <div className="mt-7">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-full font-bold text-base"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.75 0.19 75))",
                    color: "oklch(0.08 0.005 60)",
                    boxShadow: "0 0 24px oklch(0.88 0.18 85/0.3)",
                  }}
                  data-ocid="join.submit_button"
                >
                  <Sparkles className="inline w-4 h-4 mr-2" />
                  Register My Clinic
                </motion.button>
                <p className="text-xs text-center mt-3 text-muted-foreground">
                  By submitting you agree to our{" "}
                  <Link
                    to="/privacy"
                    className="hover:text-primary underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  . We will never share your data.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* ── OUTREACH MESSAGE ─────────────────────────────────────── */}
      <section className="px-4 py-16">
        <motion.div
          ref={outreachReveal.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={outreachReveal.visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2
              className="font-display font-black text-2xl md:text-3xl mb-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.80 0.16 82))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Share DantaNova with Fellow Dentists
            </h2>
            <p className="text-muted-foreground text-sm">
              Copy this message and send it via SMS, email, or any messaging
              app.
            </p>
          </div>

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.11 0.015 65/0.9)",
              border: "1px solid oklch(0.88 0.18 85/0.25)",
            }}
          >
            <HudBrackets />
            <div className="p-6">
              <div
                className="text-sm leading-relaxed mb-5 p-4 rounded-xl"
                style={{
                  background: "oklch(0.08 0.01 60/0.7)",
                  border: "1px solid oklch(0.88 0.18 85/0.12)",
                  color: "oklch(0.85 0.03 75)",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {OUTREACH_MSG}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm"
                style={{
                  background: copied
                    ? "oklch(0.72 0.18 150/0.2)"
                    : "oklch(0.88 0.18 85/0.12)",
                  border: copied
                    ? "1px solid oklch(0.72 0.18 150/0.5)"
                    : "1px solid oklch(0.88 0.18 85/0.4)",
                  color: copied
                    ? "oklch(0.78 0.18 150)"
                    : "oklch(0.88 0.18 85)",
                }}
                data-ocid="join.copy_message_button"
              >
                <ClipboardCopy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Message"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section
        className="px-4 py-16"
        style={{ background: "oklch(0.09 0.012 62/0.5)" }}
      >
        <motion.div
          ref={testimonialsReveal.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsReveal.visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2
              className="font-display font-black text-3xl md:text-4xl mb-3"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.80 0.16 82))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              What Dentists Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                animate={testimonialsReveal.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                  background: "oklch(0.11 0.015 65/0.9)",
                  border: "1px solid oklch(0.88 0.18 85/0.2)",
                  backdropFilter: "blur(12px)",
                }}
                data-ocid={`join.testimonial.item.${i + 1}`}
              >
                <HudBrackets size={12} />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }, (_, si) => (
                    <Star
                      key={`${t.name}-star-${si + 1}`}
                      className="w-3.5 h-3.5 fill-current"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{ color: "oklch(0.82 0.03 75)" }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div
                    className="font-display font-bold text-sm"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.clinic}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <motion.div
          ref={ctaReveal.ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={ctaReveal.visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto rounded-3xl p-10 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.02 72/0.9), oklch(0.10 0.015 65/0.9))",
            border: "1px solid oklch(0.88 0.18 85/0.3)",
            boxShadow: "0 0 60px oklch(0.88 0.18 85/0.08)",
          }}
        >
          {/* Animated corner glow */}
          <div
            aria-hidden
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ background: "oklch(0.88 0.18 85/0.12)" }}
          />
          <HudBrackets size={22} />

          <Search
            className="w-12 h-12 mx-auto mb-5"
            style={{ color: "oklch(0.88 0.18 85)" }}
          />
          <h2
            className="font-display font-black text-3xl md:text-4xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.18 90), oklch(0.88 0.18 85))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ready to Join DantaNova?
          </h2>
          <p
            className="text-lg mb-8 max-w-lg mx-auto"
            style={{ color: "oklch(0.72 0.04 75)" }}
          >
            Join 100+ dentists already connecting with patients for free. No
            commission. No fees. Just growth.
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.75 0.19 75))",
              color: "oklch(0.08 0.005 60)",
              boxShadow: "0 0 32px oklch(0.88 0.18 85/0.4)",
            }}
            data-ocid="join.cta_register_button"
          >
            <Sparkles className="w-5 h-5" />
            Register Now — It's Free
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="mt-auto px-6 py-8 text-center text-xs text-muted-foreground"
        style={{
          borderTop: "1px solid oklch(0.88 0.18 85/0.1)",
        }}
      >
        <p>
          © {new Date().getFullYear()} DantaNova. Built by Swanandi Manoj
          Vispute &nbsp;·&nbsp;
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="hover:text-primary transition-colors"
          >
            DANTANOVA.14@gmail.com
          </a>
          &nbsp;·&nbsp;
          <Link to="/" className="hover:text-primary transition-colors">
            Back to Home
          </Link>
        </p>
      </footer>
    </div>
  );
}
