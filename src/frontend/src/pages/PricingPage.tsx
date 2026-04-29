import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Crown,
  Headphones,
  Info,
  Minus,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

interface Tier {
  id: string;
  name: string;
  tagline: string;
  visibilityLabel: string;
  icon: React.ElementType<{ className?: string }>;
  badge: string | null;
  cta: string;
  borderStyle: React.CSSProperties;
  features: { text: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Get listed and start connecting",
    visibilityLabel: "Basic listing",
    icon: Shield,
    badge: null,
    cta: "Start Free",
    borderStyle: { border: "1px solid oklch(0.35 0.03 70/0.5)" },
    features: [
      { text: "Public dentist profile", included: true },
      { text: "Listed in patient search", included: true },
      { text: "AI scan result referrals", included: true },
      { text: "Basic dental arch visualization", included: true },
      { text: "Featured in search results", included: false },
      { text: "Advanced 3D arch analysis access", included: false },
      { text: "Dental Passport integration", included: false },
      { text: "Verified dentist badge", included: false },
      { text: "Priority placement", included: false },
      { text: "Unlimited connection requests", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Featured placement and verified badge",
    visibilityLabel: "Featured in search results",
    icon: Star,
    badge: "Most Popular",
    cta: "Select Pro",
    borderStyle: {
      border: "1.5px solid oklch(0.78 0.16 80/0.65)",
      boxShadow:
        "0 0 40px oklch(0.78 0.16 80/0.2), 0 0 80px oklch(0.78 0.16 80/0.08)",
    },
    features: [
      { text: "Public dentist profile", included: true },
      { text: "Listed in patient search", included: true },
      { text: "AI scan result referrals", included: true },
      { text: "Basic dental arch visualization", included: true },
      { text: "Featured in search results", included: true },
      { text: "Advanced 3D arch analysis access", included: true },
      { text: "Dental Passport integration", included: true },
      { text: "Verified dentist badge", included: true },
      { text: "Priority placement", included: false },
      { text: "Unlimited connection requests", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Top placement + verified + dedicated support",
    visibilityLabel: "Top placement + verified badge",
    icon: Crown,
    badge: "Enterprise Grade",
    cta: "Select Elite",
    borderStyle: {
      border: "1.5px solid oklch(0.72 0.18 75/0.65)",
      boxShadow:
        "0 0 40px oklch(0.72 0.18 75/0.18), 0 0 80px oklch(0.72 0.18 75/0.07)",
    },
    features: [
      { text: "Public dentist profile", included: true },
      { text: "Listed in patient search", included: true },
      { text: "AI scan result referrals", included: true },
      { text: "Basic dental arch visualization", included: true },
      { text: "Featured in search results", included: true },
      { text: "Advanced 3D arch analysis access", included: true },
      { text: "Dental Passport integration", included: true },
      { text: "Verified dentist badge", included: true },
      { text: "Priority placement", included: true },
      { text: "Unlimited connection requests", included: true },
    ],
  },
];

const ELITE_PERKS = [
  { icon: Sparkles, label: "Unlimited Connections" },
  { icon: BarChart3, label: "Practice Analytics" },
  { icon: Headphones, label: "Dedicated Support" },
  { icon: Zap, label: "AI Referral Priority" },
];

const FAQ_ITEMS = [
  {
    q: "Does DantaNova charge patients or dentists for appointments?",
    a: "No. DantaNova is a connection platform — we connect patients to dentists. Financial arrangements (consultation fees, treatment costs) are agreed directly between the patient and dentist. We never touch payments.",
  },
  {
    q: "What does the Pro or Elite tier actually give me?",
    a: "Higher tiers improve your visibility in search results and add trust signals like the verified badge. More visibility means more patients discover and connect with you through DantaNova's AI referral system.",
  },
  {
    q: "Can I change my tier at any time?",
    a: "Yes. You can upgrade or downgrade your visibility tier from your Dentist Dashboard at any time. Changes take effect immediately.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.11 0.035 85/0.7)",
        border: "1px solid oklch(0.72 0.15 85/0.22)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((o) => !o)}
        data-ocid="pricing.faq.toggle"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-foreground">{q}</span>
        {open ? (
          <ChevronUp
            className="w-4 h-4 shrink-0"
            style={{ color: "oklch(0.82 0.16 85)" }}
          />
        ) : (
          <ChevronDown
            className="w-4 h-4 shrink-0"
            style={{ color: "oklch(0.82 0.16 85)" }}
          />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PricingPage() {
  const { loginStatus } = useInternetIdentity();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  async function handleSelectTier(tier: Tier) {
    if (tier.id === "free") {
      toast.info(
        "You're on the Free tier. Register as a dentist to get listed.",
      );
      return;
    }
    if (loginStatus !== "success") {
      toast.error("Please sign in first to select a tier.");
      return;
    }
    setLoadingTier(tier.id);
    // Payment is arranged directly between dentist and DantaNova
    // Contact via email to upgrade
    setTimeout(() => {
      window.location.href = `mailto:DANTANOVA.14@gmail.com?subject=Upgrade to ${tier.name} Plan&body=Hi DantaNova team, I would like to upgrade to the ${tier.name} plan. Please send me the details.`;
      toast.success(`Upgrade request sent! We'll contact you shortly.`);
      setLoadingTier(null);
    }, 300);
  }

  const currentTierId = "free";

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.07 0.015 60)" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 hero-grid-mesh opacity-20" />
        <motion.div
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "oklch(0.78 0.16 80/0.06)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "oklch(0.72 0.18 75/0.06)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            data-ocid="pricing.nav_back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DantaNova
          </Link>
        </motion.div>

        {/* Platform info banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-10"
          style={{
            background: "oklch(0.14 0.06 85/0.5)",
            border: "1px solid oklch(0.72 0.15 85/0.4)",
          }}
          data-ocid="pricing.info_banner"
        >
          <Info
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: "oklch(0.88 0.18 85)" }}
          />
          <p className="text-sm" style={{ color: "oklch(0.88 0.18 85)" }}>
            <strong>DantaNova connects you directly with patients.</strong>{" "}
            Choose your visibility tier — no payments, no subscriptions.
            Financial arrangements are made directly between you and your
            patients.
          </p>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "oklch(0.78 0.16 80/0.1)",
              border: "1px solid oklch(0.78 0.16 80/0.35)",
            }}
          >
            <Crown
              className="w-4 h-4"
              style={{ color: "oklch(0.88 0.18 85)" }}
            />
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Dentist Visibility Tiers
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
            <span className="text-gradient-gold">Grow Your Practice</span>
            <br />
            <span className="text-foreground">Through Connection</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join 500+ dentists on DantaNova. Choose your visibility tier and
            start attracting verified patients — no payment required.
          </p>
        </motion.div>

        {/* Tier Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          data-ocid="pricing.tiers.list"
        >
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isPopular = tier.id === "pro";
            const isElite = tier.id === "elite";
            const isFree = tier.id === "free";
            const isCurrentTier = currentTierId === tier.id;

            return (
              <motion.div
                key={tier.id}
                data-ocid={`pricing.tier.${i + 1}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{
                  y: -6,
                  scale: 1.015,
                  transition: { duration: 0.2 },
                }}
                className="relative flex flex-col rounded-3xl p-8"
                style={{
                  background: isPopular
                    ? "oklch(0.13 0.05 85/0.92)"
                    : isElite
                      ? "oklch(0.12 0.04 80/0.88)"
                      : "oklch(0.11 0.025 70/0.85)",
                  ...tier.borderStyle,
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase"
                      style={
                        isPopular
                          ? {
                              background:
                                "linear-gradient(135deg,oklch(0.88 0.18 85),oklch(0.72 0.16 80))",
                              color: "oklch(0.06 0.01 60)",
                            }
                          : {
                              background:
                                "linear-gradient(135deg,oklch(0.72 0.18 75),oklch(0.62 0.16 72))",
                              color: "oklch(0.06 0.01 60)",
                            }
                      }
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Current tier indicator */}
                {isCurrentTier && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
                      Current
                    </Badge>
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={
                      isPopular
                        ? {
                            background: "oklch(0.22 0.08 85/0.7)",
                            border: "1.5px solid oklch(0.72 0.15 85/0.5)",
                          }
                        : isElite
                          ? {
                              background: "oklch(0.20 0.08 75/0.6)",
                              border: "1.5px solid oklch(0.68 0.18 75/0.4)",
                            }
                          : {
                              background: "oklch(0.16 0.02 70/0.6)",
                              border: "1px solid oklch(0.35 0.02 70/0.4)",
                            }
                    }
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: isPopular
                          ? "oklch(0.88 0.18 85)"
                          : isElite
                            ? "oklch(0.82 0.18 75)"
                            : "oklch(0.65 0.04 70)",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-display font-bold text-lg leading-tight"
                      style={{
                        color: isPopular
                          ? "oklch(0.92 0.1 85)"
                          : "oklch(0.88 0.05 80)",
                      }}
                    >
                      {tier.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.tagline}
                    </p>
                  </div>
                </div>

                {/* Visibility label */}
                <div
                  className="mb-5 px-4 py-2.5 rounded-2xl flex items-center gap-2"
                  style={{
                    background: isPopular
                      ? "oklch(0.18 0.08 85/0.5)"
                      : isElite
                        ? "oklch(0.17 0.08 75/0.4)"
                        : "oklch(0.14 0.02 70/0.4)",
                    border: `1px solid ${isPopular ? "oklch(0.72 0.15 85/0.3)" : isElite ? "oklch(0.68 0.18 75/0.25)" : "oklch(0.30 0.02 70/0.3)"}`,
                  }}
                >
                  <Users
                    className="w-3.5 h-3.5 shrink-0"
                    style={{
                      color: isPopular
                        ? "oklch(0.88 0.18 85)"
                        : isElite
                          ? "oklch(0.82 0.18 75)"
                          : "oklch(0.55 0.04 70)",
                    }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: isPopular
                        ? "oklch(0.88 0.18 85)"
                        : isElite
                          ? "oklch(0.82 0.18 75)"
                          : "oklch(0.65 0.04 70)",
                    }}
                  >
                    {tier.visibilityLabel}
                  </span>
                </div>

                <Separator
                  className="mb-5 opacity-20"
                  style={{
                    background: isPopular
                      ? "oklch(0.72 0.15 85/0.4)"
                      : "oklch(0.35 0.02 70/0.5)",
                  }}
                />

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f.text}
                      className={`flex items-center gap-2.5 text-sm ${f.included ? "text-foreground" : "text-muted-foreground/35"}`}
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={
                          f.included
                            ? {
                                background: isPopular
                                  ? "oklch(0.22 0.08 85/0.5)"
                                  : isElite
                                    ? "oklch(0.20 0.08 75/0.5)"
                                    : "oklch(0.18 0.02 70/0.4)",
                              }
                            : { background: "oklch(0.14 0.01 70/0.3)" }
                        }
                      >
                        {f.included ? (
                          <Check
                            className="w-2.5 h-2.5"
                            style={{
                              color: isPopular
                                ? "oklch(0.88 0.18 85)"
                                : isElite
                                  ? "oklch(0.82 0.18 75)"
                                  : "oklch(0.65 0.04 70)",
                            }}
                          />
                        ) : (
                          <Minus className="w-2.5 h-2.5 text-muted-foreground/30" />
                        )}
                      </div>
                      <span className={f.included ? "" : "line-through"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isFree ? (
                  <Link
                    to="/dentist-register"
                    data-ocid="pricing.free.cta_button"
                  >
                    <button
                      type="button"
                      className="w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:bg-white/5"
                      style={{
                        border: "1.5px solid oklch(0.45 0.02 70/0.6)",
                        color: "oklch(0.72 0.04 70)",
                      }}
                    >
                      {tier.cta}
                    </button>
                  </Link>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{
                      boxShadow: isPopular
                        ? "0 0 30px oklch(0.88 0.18 85/0.5), 0 0 60px oklch(0.88 0.18 85/0.2)"
                        : "0 0 30px oklch(0.82 0.18 75/0.4)",
                    }}
                    onClick={() => handleSelectTier(tier)}
                    disabled={loadingTier === tier.id || isCurrentTier}
                    data-ocid={`pricing.${tier.id}.select_button`}
                    className="w-full py-3.5 rounded-full font-bold text-sm shimmer-button disabled:opacity-60 disabled:cursor-not-allowed"
                    style={
                      isPopular
                        ? {
                            background:
                              "linear-gradient(135deg,oklch(0.88 0.18 85),oklch(0.72 0.16 80))",
                            color: "oklch(0.06 0.01 60)",
                          }
                        : {
                            border: "1.5px solid oklch(0.72 0.18 75/0.65)",
                            color: "oklch(0.82 0.18 75)",
                            background: "oklch(0.18 0.06 75/0.3)",
                          }
                    }
                  >
                    {loadingTier === tier.id
                      ? "Updating…"
                      : isCurrentTier
                        ? "Current Tier"
                        : tier.cta}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Elite Perks */}
        <motion.div
          className="rounded-3xl p-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: "oklch(0.12 0.04 80/0.85)",
            border: "1.5px solid oklch(0.72 0.18 75/0.4)",
            boxShadow: "0 0 40px oklch(0.72 0.18 75/0.08)",
          }}
        >
          <div className="text-center mb-8">
            <Crown
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "oklch(0.82 0.18 75)" }}
            />
            <h2 className="font-display text-2xl font-bold text-gradient-gold">
              Elite — Maximum Visibility
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Everything in Pro, plus enterprise-grade capabilities.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ELITE_PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.label}
                  className="flex flex-col items-center gap-2.5 p-5 rounded-2xl text-center"
                  whileHover={{ scale: 1.04, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  style={{
                    background: "oklch(0.14 0.05 75/0.5)",
                    border: "1px solid oklch(0.68 0.18 75/0.3)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: "oklch(0.18 0.06 75/0.5)",
                      border: "1px solid oklch(0.68 0.18 75/0.4)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.82 0.18 75)" }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {perk.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Why upgrade */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl font-bold text-center mb-10">
            Why Dentists{" "}
            <span className="text-gradient-gold">Upgrade to Pro</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: BarChart3,
                title: "Grow Your Practice",
                desc: "Priority listings help you attract 3x more patients through DantaNova's AI referral engine.",
              },
              {
                icon: Shield,
                title: "Build Patient Trust",
                desc: "The verified badge signals credibility and increases connection acceptance rates.",
              },
              {
                icon: Calendar,
                title: "More Connections",
                desc: "Higher visibility means patients scanning with DantaNova are more likely to find and request you.",
              },
              {
                icon: Zap,
                title: "Stay Ahead",
                desc: "Elite members get early access to new AI features and analytics before anyone else.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="rounded-2xl p-6"
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  style={{
                    background: "oklch(0.11 0.035 85/0.7)",
                    border: "1px solid oklch(0.72 0.15 85/0.22)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "oklch(0.20 0.08 85/0.5)",
                      border: "1px solid oklch(0.72 0.15 85/0.35)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-bold text-center mb-8 text-gradient-gold">
            Frequently Asked Questions
          </h2>
          <div
            className="space-y-3 max-w-3xl mx-auto"
            data-ocid="pricing.faq.list"
          >
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <FaqItem q={item.q} a={item.a} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact footer */}
        <motion.div
          className="rounded-2xl p-8 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: "oklch(0.11 0.035 85/0.7)",
            border: "1px solid oklch(0.72 0.15 85/0.2)",
          }}
        >
          <h3 className="font-display text-xl font-bold text-foreground mb-2">
            Questions about tiers?
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            Our team is ready to help you find the right visibility level for
            your practice.
          </p>
          <a
            href="mailto:DANTANOVA.14@gmail.com?subject=DantaNova Pricing Inquiry"
            data-ocid="pricing.contact_sales.link"
          >
            <Button
              variant="outline"
              className="rounded-full px-8 border-primary/40 text-primary hover:bg-primary/10"
            >
              Contact Us
            </Button>
          </a>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/50">
          DantaNova connects patients and dentists. No payments processed
          through the platform.
        </p>
      </div>
    </div>
  );
}
