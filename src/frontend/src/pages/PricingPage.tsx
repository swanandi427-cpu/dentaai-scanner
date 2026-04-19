import { SubscriptionTier } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useMySubscription,
  useSetDentistSubscription,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Crown,
  Headphones,
  Loader2,
  Minus,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STRIPE_PRICE_IDS = {
  proMonthly: "price_pro_2499_inr",
  proAnnual: "price_pro_1999_inr",
  eliteMonthly: "price_elite_5999_inr",
  eliteAnnual: "price_elite_4799_inr",
};

interface Tier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  priceLabel: (annual: boolean) => string;
  tagline: string;
  icon: React.ElementType<{ className?: string }>;
  badge: string | null;
  badgeColor: string;
  cta: string;
  borderStyle: React.CSSProperties;
  glowStyle: React.CSSProperties;
  features: { text: string; included: boolean }[];
  stripePriceMonthly?: string;
  stripePriceAnnual?: string;
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    priceLabel: () => "₹0",
    tagline: "Perfect for getting started",
    icon: Shield,
    badge: null,
    badgeColor: "",
    cta: "Start Free",
    borderStyle: { border: "1px solid oklch(0.35 0.03 70/0.5)" },
    glowStyle: {},
    features: [
      { text: "Unlimited AI scans", included: true },
      { text: "Basic health report", included: true },
      { text: "AI triage & severity score", included: true },
      { text: "Dental arch visualization", included: true },
      { text: "Priority appointment booking", included: false },
      { text: "Advanced 3D arch analysis", included: false },
      { text: "PDF export of scan reports", included: false },
      { text: "Dental Passport access", included: false },
      { text: "1 dentist booking/month", included: false },
      { text: "Unlimited dentist bookings", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 2499,
    annualPrice: 1999,
    priceLabel: (annual) => (annual ? "₹1,999" : "₹2,499"),
    tagline: "For proactive dental health",
    icon: Star,
    badge: "Most Popular",
    badgeColor: "bg-primary text-primary-foreground",
    cta: "Subscribe — Pro",
    borderStyle: {
      border: "1.5px solid oklch(0.78 0.16 80/0.65)",
      boxShadow:
        "0 0 40px oklch(0.78 0.16 80/0.2), 0 0 80px oklch(0.78 0.16 80/0.08)",
    },
    glowStyle: {},
    stripePriceMonthly: STRIPE_PRICE_IDS.proMonthly,
    stripePriceAnnual: STRIPE_PRICE_IDS.proAnnual,
    features: [
      { text: "Unlimited AI scans", included: true },
      { text: "Basic health report", included: true },
      { text: "AI triage & severity score", included: true },
      { text: "Dental arch visualization", included: true },
      { text: "Priority appointment booking", included: true },
      { text: "Advanced 3D arch analysis", included: true },
      { text: "PDF export of scan reports", included: true },
      { text: "Dental Passport access", included: true },
      { text: "1 dentist booking/month", included: true },
      { text: "Unlimited dentist bookings", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPrice: 5999,
    annualPrice: 4799,
    priceLabel: (annual) => (annual ? "₹4,799" : "₹5,999"),
    tagline: "Maximum care & priority access",
    icon: Crown,
    badge: "Enterprise Grade",
    badgeColor: "bg-accent text-accent-foreground",
    cta: "Contact Sales",
    borderStyle: {
      border: "1.5px solid oklch(0.72 0.18 75/0.65)",
      boxShadow:
        "0 0 40px oklch(0.72 0.18 75/0.18), 0 0 80px oklch(0.72 0.18 75/0.07)",
    },
    glowStyle: {},
    stripePriceMonthly: STRIPE_PRICE_IDS.eliteMonthly,
    stripePriceAnnual: STRIPE_PRICE_IDS.eliteAnnual,
    features: [
      { text: "Unlimited AI scans", included: true },
      { text: "Basic health report", included: true },
      { text: "AI triage & severity score", included: true },
      { text: "Dental arch visualization", included: true },
      { text: "Priority appointment booking", included: true },
      { text: "Advanced 3D arch analysis", included: true },
      { text: "PDF export of scan reports", included: true },
      { text: "Dental Passport access", included: true },
      { text: "1 dentist booking/month", included: true },
      { text: "Unlimited dentist bookings", included: true },
    ],
  },
];

const ELITE_PERKS = [
  { icon: Sparkles, label: "Unlimited Bookings" },
  { icon: BarChart3, label: "Corporate Dashboard" },
  { icon: Headphones, label: "Dedicated Support" },
  { icon: Zap, label: "Custom Integrations" },
];

const FAQ_ITEMS = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, absolutely. You can cancel your Pro or Elite subscription at any time from your account settings. Your access continues until the end of your billing period — no penalties, no questions asked.",
  },
  {
    q: "How does annual billing work?",
    a: "When you choose annual billing, you're charged once for the full year at a 20% discounted rate. For Pro, that's ₹1,999/month (billed ₹23,988/year instead of ₹29,988). You save ₹6,000 per year.",
  },
  {
    q: "What's included in the Dental Passport on the Pro plan?",
    a: "Pro subscribers get full Dental Passport access — create your passport, issue records to other dentists, and use the lookup flow for traveling care. Dentist-to-dentist billing is available when your home dentist is also on DantaNova.",
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

import type React from "react";

export default function PricingPage() {
  const { loginStatus } = useInternetIdentity();
  const [annual, setAnnual] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const setSubscription = useSetDentistSubscription();
  const { data: _mySubscription } = useMySubscription();

  async function handleSubscribe(tier: Tier) {
    if (tier.id === "free") return;
    if (tier.id === "elite") {
      window.location.href =
        "mailto:DANTANOVA.14@gmail.com?subject=DantaNova Elite Plan Inquiry";
      return;
    }

    if (loginStatus !== "success") {
      toast.error("Please sign in first to subscribe.");
      return;
    }

    setLoadingTier(tier.id);
    try {
      const priceId = annual ? tier.stripePriceAnnual : tier.stripePriceMonthly;
      const monthlyAmount = annual ? tier.annualPrice : tier.monthlyPrice;
      const tierEnum =
        tier.id === "pro" ? SubscriptionTier.pro : SubscriptionTier.elite;

      const { createCheckout } = await import("@/lib/stripe");
      await createCheckout({
        priceId: priceId!,
        currency: "inr",
        productName: `DantaNova ${tier.name} Plan`,
        successUrl: `${window.location.origin}/dentist-dashboard?subscription=${tier.id}`,
        cancelUrl: `${window.location.origin}/pricing`,
        onSuccess: async (sessionId: string) => {
          try {
            await setSubscription.mutateAsync({
              tier: tierEnum,
              stripeSubscriptionId: sessionId,
              monthlyAmountRupees: BigInt(monthlyAmount),
            });
            toast.success(
              `Welcome to ${tier.name}! Your subscription is now active.`,
            );
          } catch {
            toast.success(
              `Payment received for ${tier.name}. Subscription will activate shortly.`,
            );
          }
        },
        onCancel: () => {
          toast.info("Subscription cancelled. You can try again anytime.");
        },
      });
    } catch {
      toast.error("Checkout could not be opened. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  }

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
              Dentist Subscription Plans
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
            <span className="text-gradient-gold">Grow Your Practice</span>
            <br />
            <span className="text-foreground">On Your Terms</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Join 500+ dentists on DantaNova. Choose the plan that fits your
            practice and start attracting verified patients today.
          </p>

          {/* Annual toggle */}
          <div
            className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl"
            style={{
              background: "oklch(0.11 0.04 85/0.7)",
              border: "1px solid oklch(0.72 0.15 85/0.25)",
            }}
          >
            <span
              className={`text-sm font-semibold transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnual((a) => !a)}
              aria-label="Toggle annual billing"
              data-ocid="pricing.billing_toggle"
              className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                background: annual
                  ? "linear-gradient(135deg,oklch(0.88 0.18 85),oklch(0.72 0.16 80))"
                  : "oklch(0.22 0.02 70)",
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                style={{
                  left: annual ? "calc(100% - 1.375rem)" : "0.125rem",
                  background: annual
                    ? "oklch(0.06 0.01 60)"
                    : "oklch(0.55 0.02 70)",
                }}
              />
            </button>
            <span
              className={`text-sm font-semibold transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}
            >
              Annual
            </span>
            <AnimatePresence>
              {annual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -6 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -6 }}
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.22 0.08 85/0.7)",
                    border: "1px solid oklch(0.72 0.15 85/0.5)",
                    color: "oklch(0.88 0.18 85)",
                  }}
                >
                  Save 20%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          data-ocid="pricing.tiers.list"
        >
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const isPopular = tier.id === "pro";
            const isElite = tier.id === "elite";
            const isFree = tier.id === "free";
            return (
              <motion.div
                key={tier.id}
                data-ocid={`pricing.tier.${i + 1}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{
                  y: -6,
                  rotateX: 1,
                  rotateY: isPopular ? -1 : 1,
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
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                  ...tier.borderStyle,
                }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase ${tier.badgeColor}`}
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

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1.5">
                    <motion.span
                      key={annual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-display text-5xl font-black leading-none"
                      style={{
                        color: isPopular
                          ? "oklch(0.88 0.18 85)"
                          : isElite
                            ? "oklch(0.82 0.18 75)"
                            : "oklch(0.82 0.05 80)",
                      }}
                    >
                      {tier.priceLabel(annual)}
                    </motion.span>
                    {!isFree && (
                      <span className="text-muted-foreground text-sm mb-1.5">
                        /month
                      </span>
                    )}
                  </div>
                  {isFree ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Free forever — no credit card required
                    </p>
                  ) : annual ? (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "oklch(0.72 0.12 145)" }}
                    >
                      Billed annually · save 20%
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed monthly · switch to annual to save
                    </p>
                  )}
                </div>

                <Separator
                  className="mb-6 opacity-20"
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
                ) : isElite ? (
                  <a
                    href="mailto:DANTANOVA.14@gmail.com?subject=DantaNova Elite Plan"
                    data-ocid="pricing.elite.cta_button"
                  >
                    <button
                      type="button"
                      className="w-full py-3.5 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                      style={{
                        border: "1.5px solid oklch(0.72 0.18 75/0.65)",
                        color: "oklch(0.82 0.18 75)",
                        background: "oklch(0.18 0.06 75/0.3)",
                      }}
                    >
                      {tier.cta}
                    </button>
                  </a>
                ) : (
                  <motion.button
                    type="button"
                    whileHover={{
                      boxShadow:
                        "0 0 30px oklch(0.88 0.18 85/0.5), 0 0 60px oklch(0.88 0.18 85/0.2)",
                    }}
                    onClick={() => handleSubscribe(tier)}
                    disabled={loadingTier === tier.id}
                    data-ocid={`pricing.${tier.id}.subscribe_button`}
                    className="w-full py-3.5 rounded-full font-bold text-sm shimmer-button disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background:
                        "linear-gradient(135deg,oklch(0.88 0.18 85),oklch(0.72 0.16 80))",
                      color: "oklch(0.06 0.01 60)",
                    }}
                  >
                    {loadingTier === tier.id ? "Opening checkout…" : tier.cta}
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
            <h2 className="font-display text-2xl font-bold text-gradient-purple">
              Elite — Exclusively Yours
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

        {/* Why Upgrade */}
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
                desc: "Priority listings and analytics help you attract 3x more patients each month.",
              },
              {
                icon: Shield,
                title: "Build Patient Trust",
                desc: "Verified badge signals credibility and increases appointment conversions.",
              },
              {
                icon: Calendar,
                title: "Never Miss a Booking",
                desc: "Unlimited bookings mean no caps during busy seasons or marketing pushes.",
              },
              {
                icon: Zap,
                title: "Stay Ahead",
                desc: "Elite members get early access to new AI features before anyone else.",
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

        {/* Contact Sales footer */}
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
            Questions about pricing?
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            Our team is ready to help you find the right plan for your practice.
          </p>
          <a
            href="mailto:DANTANOVA.14@gmail.com?subject=DantaNova Pricing Inquiry"
            data-ocid="pricing.contact_sales.link"
          >
            <Button
              variant="outline"
              className="rounded-full px-8 border-primary/40 text-primary hover:bg-primary/10"
            >
              Contact Sales
            </Button>
          </a>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/50">
          All prices are in Indian Rupees (₹). Annual billing charged upfront.
          Cancel anytime. Stripe-secured payments.
        </p>
      </div>
    </div>
  );
}
