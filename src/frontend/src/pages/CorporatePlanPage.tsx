import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  FileText,
  Globe,
  HeartPulse,
  Mail,
  MapPin,
  Minus,
  Phone,
  Send,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

// ── DATA ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: Globe,
    title: "Emergency Coverage Anywhere",
    desc: "Employees traveling globally get instant access to verified emergency dentists — no matter the city or timezone.",
  },
  {
    icon: FileText,
    title: "Dental Passport Per Employee",
    desc: "Each team member gets a Dental Passport pre-loaded with records, insurance approval, and pre-authorized treatment budget.",
  },
  {
    icon: Building2,
    title: "Direct Dentist Billing",
    desc: "Dentist-to-company billing means employees never pay upfront. Expenses are consolidated and reported monthly.",
  },
  {
    icon: BarChart3,
    title: "Annual Oral Health Reports",
    desc: "Comprehensive dental health reports for your entire workforce — useful for HR, insurance, and wellness programs.",
  },
];

interface PlanFeature {
  label: string;
  starter: boolean | string;
  growth: boolean | string;
  enterprise: boolean | string;
}

const PLAN_FEATURES: PlanFeature[] = [
  {
    label: "Emergency dental coverage",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    label: "Dental Passport per employee",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    label: "Direct dentist billing",
    starter: true,
    growth: true,
    enterprise: true,
  },
  {
    label: "Annual health report",
    starter: "Basic",
    growth: "Full",
    enterprise: "Custom",
  },
  { label: "HR dashboard", starter: false, growth: true, enterprise: true },
  {
    label: "Monthly utilization reports",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    label: "Onboarding manager",
    starter: false,
    growth: true,
    enterprise: true,
  },
  {
    label: "White-label options",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    label: "HRMS/ERP integrations",
    starter: false,
    growth: false,
    enterprise: true,
  },
  { label: "SLA guarantees", starter: false, growth: false, enterprise: true },
  {
    label: "Dedicated account manager",
    starter: false,
    growth: false,
    enterprise: true,
  },
  {
    label: "Multi-region support",
    starter: false,
    growth: false,
    enterprise: true,
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹499",
    unit: "/employee/month",
    range: "10–50 employees",
    highlight: false,
    badge: null,
  },
  {
    name: "Growth",
    price: "₹399",
    unit: "/employee/month",
    range: "50–200 employees",
    highlight: true,
    badge: "Best Value",
  },
  {
    name: "Enterprise",
    price: "Custom",
    unit: "pricing",
    range: "200+ employees",
    highlight: false,
    badge: "Contact Us",
  },
];

const TRUST_STATS = [
  { value: "500+", label: "Companies Interested" },
  { value: "94%", label: "Employee Satisfaction" },
  { value: "48h", label: "Avg. Onboarding" },
  { value: "₹0", label: "Employee Upfront Cost" },
];

interface ContactForm {
  name: string;
  company: string;
  email: string;
  employeeCount: string;
  useCase: string;
  message: string;
}

const EMPTY_FORM: ContactForm = {
  name: "",
  company: "",
  email: "",
  employeeCount: "",
  useCase: "",
  message: "",
};

// ── FEATURE CELL ─────────────────────────────────────────────────────────────

function FeatureCell({
  value,
  highlight,
}: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === "string") {
    return (
      <span
        className="text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: highlight
            ? "oklch(0.22 0.08 85/0.4)"
            : "oklch(0.16 0.02 70/0.4)",
          color: highlight ? "oklch(0.88 0.18 85)" : "oklch(0.72 0.04 70)",
        }}
      >
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center mx-auto"
        style={{
          background: highlight
            ? "oklch(0.22 0.08 85/0.4)"
            : "oklch(0.16 0.02 70/0.3)",
        }}
      >
        <Check
          className="w-3 h-3"
          style={{
            color: highlight ? "oklch(0.88 0.18 85)" : "oklch(0.65 0.04 70)",
          }}
        />
      </div>
    );
  }
  return <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function CorporatePlanPage() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.company || !form.email || !form.employeeCount) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Inquiry sent! Our team will contact you within 24 hours.");
  }

  const goldBtn = {
    background:
      "linear-gradient(135deg,oklch(0.82 0.18 85),oklch(0.68 0.16 80))",
    color: "oklch(0.06 0.01 60)",
    boxShadow: "0 4px 28px oklch(0.72 0.15 85/0.45)",
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.07 0.015 60)" }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 hero-grid-mesh opacity-20" />
        <motion.div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: "oklch(0.78 0.16 80/0.05)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "oklch(0.72 0.18 75/0.05)" }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{
            duration: 11,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Back Nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            data-ocid="corporate.nav_back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DantaNova
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "oklch(0.78 0.16 80/0.1)",
              border: "1px solid oklch(0.78 0.16 80/0.35)",
            }}
          >
            <Briefcase
              className="w-4 h-4"
              style={{ color: "oklch(0.88 0.18 85)" }}
            />
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "oklch(0.88 0.18 85)" }}
            >
              Corporate Dental Plan
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-5">
            <span className="text-gradient-gold">Dental Care for Your</span>
            <br />
            <span className="text-foreground">Traveling Team</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
            A single dental benefits platform for companies with traveling
            employees. Powered by the Dental Passport™ network — your team gets
            emergency care anywhere in the world, with zero upfront costs and
            dentist-to-company billing.
          </p>
          <p
            className="text-sm font-semibold mb-8"
            style={{ color: "oklch(0.82 0.14 85)" }}
          >
            Trusted by 500+ companies exploring smarter employee dental
            benefits.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="#contact-form">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shimmer-button"
                style={goldBtn}
                data-ocid="corporate.hero.cta_button"
              >
                Get a Quote
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </a>
            <Link to="/find-dentist">
              <button
                type="button"
                className="flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm border hover:bg-yellow-500/10 transition-all"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85/0.5)",
                  color: "oklch(0.88 0.18 85)",
                }}
                data-ocid="corporate.hero.secondary_button"
              >
                See How It Works
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {TRUST_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl p-5 text-center"
              whileHover={{ scale: 1.04 }}
              style={{
                background: "oklch(0.11 0.04 85/0.75)",
                border: "1px solid oklch(0.72 0.15 85/0.25)",
              }}
            >
              <div
                className="font-display text-3xl font-black"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Why DantaNova Corporate
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold">
              Everything Your Team Needs, Everywhere They Are
            </h2>
          </motion.div>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-ocid="corporate.benefits.list"
          >
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  data-ocid={`corporate.benefit.${i + 1}`}
                  className="rounded-2xl p-7 flex gap-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "oklch(0.11 0.04 85/0.75)",
                    border: "1.5px solid oklch(0.72 0.15 85/0.28)",
                    boxShadow: "0 0 20px oklch(0.72 0.15 85/0.05)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "oklch(0.20 0.08 85/0.5)",
                      border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1.5">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Plan Tiers (card grid) */}
        <div className="mb-12">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "oklch(0.82 0.16 85)" }}
            >
              Simple Pricing
            </p>
            <h2 className="font-display text-3xl font-bold text-gradient-gold">
              Corporate Plans
            </h2>
          </motion.div>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            data-ocid="corporate.plans.list"
          >
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                data-ocid={`corporate.plan.${i + 1}`}
                className="relative flex flex-col rounded-3xl p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6, scale: 1.01 }}
                style={
                  plan.highlight
                    ? {
                        background: "oklch(0.13 0.05 85/0.92)",
                        border: "1.5px solid oklch(0.78 0.16 80/0.65)",
                        boxShadow:
                          "0 0 40px oklch(0.78 0.16 80/0.2), 0 0 80px oklch(0.78 0.16 80/0.08)",
                      }
                    : {
                        background: "oklch(0.11 0.025 70/0.85)",
                        border: "1px solid oklch(0.35 0.02 70/0.5)",
                      }
                }
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase"
                      style={
                        plan.highlight
                          ? {
                              background:
                                "linear-gradient(135deg,oklch(0.88 0.18 85),oklch(0.72 0.16 80))",
                              color: "oklch(0.06 0.01 60)",
                            }
                          : {
                              background: "oklch(0.18 0.02 70/0.7)",
                              border: "1px solid oklch(0.35 0.02 70/0.5)",
                              color: "oklch(0.65 0.04 70)",
                            }
                      }
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-2 mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    {plan.range === "10–50 employees" ? (
                      <Users
                        className="w-4 h-4"
                        style={{
                          color: plan.highlight
                            ? "oklch(0.88 0.18 85)"
                            : "oklch(0.55 0.03 70)",
                        }}
                      />
                    ) : plan.range === "50–200 employees" ? (
                      <Briefcase
                        className="w-4 h-4"
                        style={{ color: "oklch(0.88 0.18 85)" }}
                      />
                    ) : (
                      <Building2
                        className="w-4 h-4"
                        style={{
                          color: plan.highlight
                            ? "oklch(0.88 0.18 85)"
                            : "oklch(0.55 0.03 70)",
                        }}
                      />
                    )}
                    <span className="text-xs text-muted-foreground font-medium">
                      {plan.range}
                    </span>
                  </div>
                  <h3
                    className="font-display text-2xl font-black mb-4"
                    style={{
                      color: plan.highlight
                        ? "oklch(0.92 0.1 85)"
                        : "oklch(0.82 0.04 80)",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span
                      className="font-display text-4xl font-black"
                      style={{
                        color: plan.highlight
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.72 0.04 70)",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1.5">
                      {plan.unit}
                    </span>
                  </div>
                  {plan.price !== "Custom" && (
                    <p className="text-xs text-muted-foreground">
                      Billed monthly. Annual pricing available.
                    </p>
                  )}
                </div>

                <div
                  className="my-5 h-px"
                  style={{
                    background: plan.highlight
                      ? "oklch(0.72 0.15 85/0.25)"
                      : "oklch(0.25 0.01 70/0.4)",
                  }}
                />

                <div className="flex-1 mb-6">
                  {plan.name === "Starter" && (
                    <ul className="space-y-2.5">
                      {[
                        "Emergency dental coverage worldwide",
                        "Dental Passport per employee",
                        "Direct dentist billing",
                        "Basic annual report",
                        "Email support",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <div className="w-4 h-4 rounded-full bg-muted/40 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {plan.name === "Growth" && (
                    <ul className="space-y-2.5">
                      {[
                        "Everything in Starter",
                        "Volume discount (20% off)",
                        "Dedicated HR dashboard",
                        "Monthly utilization reports",
                        "Priority support",
                        "Onboarding manager",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "oklch(0.22 0.08 85/0.4)" }}
                          >
                            <Check
                              className="w-2.5 h-2.5"
                              style={{ color: "oklch(0.88 0.18 85)" }}
                            />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {plan.name === "Enterprise" && (
                    <ul className="space-y-2.5">
                      {[
                        "Everything in Growth",
                        "White-label options",
                        "Custom HRMS/ERP integrations",
                        "SLA guarantees",
                        "Dedicated account manager",
                        "Multi-region support",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <div className="w-4 h-4 rounded-full bg-muted/40 flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 text-muted-foreground" />
                          </div>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <a href="#contact-form">
                  {plan.highlight ? (
                    <motion.button
                      type="button"
                      whileHover={{
                        boxShadow: "0 0 20px oklch(0.88 0.18 85/0.4)",
                      }}
                      className="w-full py-3.5 rounded-full font-bold text-sm shimmer-button"
                      style={goldBtn}
                      data-ocid={`corporate.plan.${i + 1}.cta_button`}
                    >
                      Get Started
                    </motion.button>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-3.5 rounded-full font-semibold text-sm border hover:bg-white/5 transition-all"
                      style={{
                        border: "1.5px solid oklch(0.45 0.02 70/0.55)",
                        color: "oklch(0.72 0.04 70)",
                      }}
                      data-ocid={`corporate.plan.${i + 1}.cta_button`}
                    >
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </button>
                  )}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Matrix Table */}
        <motion.div
          className="mb-20 overflow-x-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          data-ocid="corporate.feature_matrix.table"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid oklch(0.72 0.15 85/0.2)",
              background: "oklch(0.10 0.025 70/0.85)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "oklch(0.12 0.04 85/0.7)",
                    borderBottom: "1px solid oklch(0.72 0.15 85/0.2)",
                  }}
                >
                  <th className="text-left px-6 py-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Feature
                  </th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.name}
                      className="px-4 py-4 font-black text-sm"
                      style={{
                        color: plan.highlight
                          ? "oklch(0.88 0.18 85)"
                          : "oklch(0.72 0.04 70)",
                        textAlign: "center",
                      }}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURES.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      background:
                        i % 2 === 0 ? "oklch(0.10 0.02 70/0.3)" : "transparent",
                      borderBottom: "1px solid oklch(0.22 0.01 70/0.3)",
                    }}
                  >
                    <td className="px-6 py-3.5 text-muted-foreground text-sm">
                      {row.label}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={row.starter} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={row.growth} highlight />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <FeatureCell value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Contact/Demo Form */}
        <motion.div
          id="contact-form"
          className="rounded-3xl overflow-hidden mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            border: "1.5px solid oklch(0.72 0.15 85/0.3)",
            boxShadow: "0 0 40px oklch(0.72 0.15 85/0.06)",
          }}
          data-ocid="corporate.contact_form.section"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left panel */}
            <div
              className="p-10 flex flex-col justify-center"
              style={{
                background: "oklch(0.11 0.045 85/0.9)",
                borderRight: "1px solid oklch(0.72 0.15 85/0.2)",
              }}
            >
              <HeartPulse
                className="w-12 h-12 mb-6"
                style={{ color: "oklch(0.82 0.18 85)" }}
              />
              <h2 className="font-display text-3xl font-bold mb-4">
                Let's Build Your{" "}
                <span className="text-gradient-gold">
                  Corporate Dental Plan
                </span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                Tell us about your team and we'll design a custom plan with the
                right coverage, reporting, and pricing.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "Global emergency coverage" },
                  { icon: Shield, text: "Zero upfront cost for employees" },
                  { icon: Phone, text: "Response within 24 hours" },
                  { icon: Mail, text: "Dedicated account support" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "oklch(0.20 0.08 85/0.5)",
                          border: "1px solid oklch(0.72 0.15 85/0.3)",
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: "oklch(0.82 0.16 85)" }}
                        />
                      </div>
                      <span className="text-foreground font-medium">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel — Form */}
            <div
              className="p-10"
              style={{ background: "oklch(0.10 0.02 70/0.85)" }}
            >
              {submitted ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center text-center gap-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  data-ocid="corporate.form.success_state"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85/0.4)",
                      border: "2px solid oklch(0.72 0.15 85/0.5)",
                    }}
                  >
                    <Check
                      className="w-8 h-8"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">
                    Inquiry Received!
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Our corporate team will reach out within 24 hours to discuss
                    your plan options.
                  </p>
                  <button
                    type="button"
                    className="px-7 py-3 rounded-full text-sm font-semibold border hover:bg-white/5 transition-all mt-2"
                    style={{
                      border: "1.5px solid oklch(0.72 0.15 85/0.4)",
                      color: "oklch(0.82 0.14 85)",
                    }}
                    onClick={() => {
                      setSubmitted(false);
                      setForm(EMPTY_FORM);
                    }}
                    data-ocid="corporate.form.reset_button"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Priya Sharma"
                        value={form.name}
                        onChange={handleChange}
                        required
                        data-ocid="corporate.form.name_input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="company"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Company <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Acme Corp"
                        value={form.company}
                        onChange={handleChange}
                        required
                        data-ocid="corporate.form.company_input"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Work Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="priya@acmecorp.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      data-ocid="corporate.form.email_input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="employeeCount"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Team Size <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.employeeCount}
                        onValueChange={(v) =>
                          setForm((prev) => ({ ...prev, employeeCount: v }))
                        }
                      >
                        <SelectTrigger data-ocid="corporate.form.employee_count_select">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10-50">10–50 employees</SelectItem>
                          <SelectItem value="51-200">
                            51–200 employees
                          </SelectItem>
                          <SelectItem value="201-500">
                            201–500 employees
                          </SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="useCase"
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Use Case
                      </Label>
                      <Select
                        value={form.useCase}
                        onValueChange={(v) =>
                          setForm((prev) => ({ ...prev, useCase: v }))
                        }
                      >
                        <SelectTrigger data-ocid="corporate.form.usecase_select">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="travel">
                            Traveling employees
                          </SelectItem>
                          <SelectItem value="remote">
                            Remote workforce
                          </SelectItem>
                          <SelectItem value="expats">Expat benefits</SelectItem>
                          <SelectItem value="all">All employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="message"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Additional Notes
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your team's travel frequency, regions, or specific requirements..."
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      data-ocid="corporate.form.message_textarea"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{
                      boxShadow: "0 0 20px oklch(0.88 0.18 85/0.4)",
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed shimmer-button"
                    style={goldBtn}
                    data-ocid="corporate.form.submit_button"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Inquiry
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-muted-foreground/50 text-center">
                    By submitting, you agree to our{" "}
                    <Link
                      to="/privacy"
                      className="underline hover:text-primary"
                    >
                      Privacy Policy
                    </Link>
                    . We'll respond within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>

        {/* Talk to Our Team footer CTA */}
        <motion.div
          className="rounded-2xl p-10 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background:
              "linear-gradient(135deg,oklch(0.15 0.06 85/0.85),oklch(0.11 0.03 85/0.9))",
            border: "1.5px solid oklch(0.72 0.15 85/0.35)",
            boxShadow: "0 0 40px oklch(0.72 0.15 85/0.08)",
          }}
        >
          <h3 className="font-display text-2xl font-bold text-gradient-gold mb-2">
            Talk to Our Team
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Ready to protect your team wherever they travel? Our corporate
            specialists will design the right plan for you.
          </p>
          <a
            href="mailto:DANTANOVA.14@gmail.com?subject=Corporate Dental Plan — Talk to Team"
            data-ocid="corporate.footer.cta_button"
          >
            <motion.button
              type="button"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 30px oklch(0.88 0.18 85/0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm mx-auto shimmer-button"
              style={goldBtn}
            >
              <Mail className="w-4 h-4" />
              Contact Our Team
            </motion.button>
          </a>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground/50">
          All prices in Indian Rupees (₹). Enterprise pricing available on
          request. Contact{" "}
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="underline hover:text-primary"
          >
            DANTANOVA.14@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
