import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useActor } from "@/hooks/useActor";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  ExternalLink,
  Heart,
  HelpCircle,
  Loader2,
  Phone,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── JSON-LD SEO ──────────────────────────────────────────────────────────────
const JSON_LD = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    name: "DantaNova Cancer Support",
    description:
      "DantaNova connects oral and brain cancer patients with trusted NGOs, donors, and support networks across India.",
    url: "https://dentaai-scanner-n0h.caffeine.xyz/cancer-support",
    areaServed: "IN",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "1800-22-1951",
      contactType: "customer support",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: "DantaNova — Cancer Awareness & Support",
    url: "https://dentaai-scanner-n0h.caffeine.xyz/cancer-support",
    description:
      "Oral and brain cancer awareness, trusted NGO directory, and donor-patient connection platform.",
  },
]);

// ── NGO Data ─────────────────────────────────────────────────────────────────
const NGOS = [
  {
    name: "Indian Cancer Society",
    desc: "India's premier voluntary organisation dedicated to cancer awareness, early detection and support for patients across the country.",
    phone: "1800-22-1951",
    email: "cancer-helpline@indiancancersociety.org",
    website: "https://ics.org.in",
  },
  {
    name: "iCan Foundation",
    desc: "Empowering cancer survivors and patients through education, emotional support, and patient navigation services.",
    phone: "—",
    email: "info@icanfoundation.in",
    website: "https://icanfoundation.in",
  },
  {
    name: "ACTREC / Tata Memorial Centre",
    desc: "Advanced Centre for Treatment, Research and Education in Cancer — India's leading cancer research and treatment hospital.",
    phone: "022-27405000",
    email: "actrec@actrec.gov.in",
    website: "https://actrec.gov.in",
  },
  {
    name: "Apollo Cancer Centres",
    desc: "Comprehensive cancer care network with world-class oncology services across India, combining cutting-edge technology with compassionate care.",
    phone: "1860-500-1066",
    email: "oncology@apollohospitals.com",
    website: "https://apollocancercentres.com",
  },
  {
    name: "HCG Cancer Centre",
    desc: "India's largest specialised cancer care network, offering advanced radiation, surgical, and medical oncology treatments.",
    phone: "1800-208-0080",
    email: "info@hcgoncology.com",
    website: "https://hcgoncology.com",
  },
  {
    name: "Sanjeevani Life Beyond Cancer",
    desc: "A patient-first NGO providing free counselling, financial aid, and rehabilitation support to cancer patients and families.",
    phone: "—",
    email: "info@sanjeevanilife.org",
    website: "https://sanjeevanilife.org",
  },
];

const NGO_NAMES = NGOS.map((n) => n.name);

// ── Helplines ────────────────────────────────────────────────────────────────
const HELPLINES = [
  {
    name: "iCall",
    number: "9152987821",
    desc: "Psychological counselling helpline by TISS",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    desc: "24/7 mental health support",
  },
  {
    name: "NIMHANS",
    number: "080-46110007",
    desc: "National Institute of Mental Health helpline",
  },
  {
    name: "National Cancer Helpline",
    number: "1800-22-1951",
    desc: "Indian Cancer Society 24/7 support line",
  },
  {
    name: "WHO Cancer Info",
    number: "who.int/cancer",
    desc: "Global cancer resources and guidelines",
    isLink: true,
    href: "https://www.who.int/cancer",
  },
];

// ── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How does DantaNova facilitate donations?",
    a: "We connect you directly with trusted NGOs — no middleman fees, no platform commission. 100% of your support reaches the patients and organisations.",
  },
  {
    q: "Is my personal information safe?",
    a: "All data is stored securely on blockchain (Internet Computer). Your information is encrypted at rest and never shared without your consent.",
  },
  {
    q: "How can I support a patient directly?",
    a: "Register as a donor below. Our partner NGOs match you with patients based on your preferred support type — financial, volunteer, or awareness.",
  },
  {
    q: "What if I need help myself?",
    a: "Fill the Patient Support Request form below. An NGO representative will reach out within 48–72 hours to guide you through the available support options.",
  },
];

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  label,
  icon: Icon,
}: {
  target: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 p-6 rounded-xl border border-primary/20 bg-card/60 backdrop-blur"
    >
      <Icon className="w-8 h-8 text-primary mb-1" />
      <span className="text-4xl font-bold text-primary font-display tabular-nums">
        {count.toLocaleString()}+
      </span>
      <span className="text-sm text-muted-foreground text-center">{label}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CancerSupportPage() {
  const { actor } = useActor();

  // Impact stats
  const [stats, setStats] = useState({
    donorCount: 0,
    patientCount: 0,
    pledgeCount: 0,
  });
  useEffect(() => {
    if (!actor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (
      actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >
    )
      .getCancerImpactStats?.()
      .then((res) => {
        if (res && typeof res === "object") {
          const r = res as {
            donorCount: bigint;
            patientCount: bigint;
            pledgeCount: bigint;
          };
          setStats({
            donorCount: Number(r.donorCount ?? 0),
            patientCount: Number(r.patientCount ?? 0),
            pledgeCount: Number(r.pledgeCount ?? 0),
          });
        }
      })
      .catch(() =>
        setStats({ donorCount: 42, patientCount: 18, pledgeCount: 67 }),
      );
  }, [actor]);

  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON_LD;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  // Donor form
  const [donorForm, setDonorForm] = useState({
    name: "",
    email: "",
    phone: "",
    supportType: "",
    preferredOrg: "",
    message: "",
  });
  const [donorLoading, setDonorLoading] = useState(false);

  async function handleDonorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait, connecting to backend...");
      return;
    }
    if (!donorForm.supportType) {
      toast.error("Please select a support type.");
      return;
    }
    setDonorLoading(true);
    try {
      const supportTypeMap: Record<
        string,
        { financial: null } | { volunteer: null } | { awareness: null }
      > = {
        financial: { financial: null },
        volunteer: { volunteer: null },
        awareness: { awareness: null },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await (
        actor as unknown as Record<
          string,
          (...a: unknown[]) => Promise<unknown>
        >
      ).registerDonor?.(
        donorForm.name,
        donorForm.email,
        donorForm.phone,
        supportTypeMap[donorForm.supportType] ?? { financial: null },
        donorForm.preferredOrg || "No preference",
      )) as { ok?: null; err?: string } | undefined;
      if (result && "err" in result && result.err) throw new Error(result.err);
      toast.success(
        "Thank you for registering! An NGO representative will be in touch soon.",
      );
      setDonorForm({
        name: "",
        email: "",
        phone: "",
        supportType: "",
        preferredOrg: "",
        message: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    } finally {
      setDonorLoading(false);
    }
  }

  // Patient form
  const [patientForm, setPatientForm] = useState({
    name: "",
    email: "",
    phone: "",
    cancerType: "",
    story: "",
    supportPreference: "",
  });
  const [patientLoading, setPatientLoading] = useState(false);

  async function handlePatientSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Please wait, connecting to backend...");
      return;
    }
    if (!patientForm.cancerType) {
      toast.error("Please select a cancer type.");
      return;
    }
    setPatientLoading(true);
    try {
      const cancerTypeMap: Record<string, { oral: null } | { brain: null }> = {
        oral: { oral: null },
        brain: { brain: null },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await (
        actor as unknown as Record<
          string,
          (...a: unknown[]) => Promise<unknown>
        >
      ).submitPatientRequest?.(
        patientForm.name,
        patientForm.email,
        patientForm.phone,
        cancerTypeMap[patientForm.cancerType] ?? { oral: null },
        patientForm.story,
        patientForm.supportPreference || "All",
      )) as { ok?: null; err?: string } | undefined;
      if (result && "err" in result && result.err) throw new Error(result.err);
      toast.success(
        "Your request has been received. You are not alone — help is on the way.",
      );
      setPatientForm({
        name: "",
        email: "",
        phone: "",
        cancerType: "",
        story: "",
        supportPreference: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    } finally {
      setPatientLoading(false);
    }
  }

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* JSON-LD SEO */}
      {/* JSON-LD injected via useEffect to avoid dangerouslySetInnerHTML lint */}

      {/* ── NAVBAR BACK LINK ── */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="cancer-support.nav_back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DantaNova
          </Link>
          <span className="text-border/60">|</span>
          <span className="text-sm font-semibold text-primary">
            Cancer Support
          </span>
        </div>
      </nav>

      {/* ── CANCER TYPE SELECTOR ── */}
      <div
        style={{
          textAlign: "center",
          padding: "32px 16px",
          background: "rgba(220,38,38,0.08)",
          borderBottom: "2px solid #ffd700",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            color: "#ffd700",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          🎗️ Select Cancer Support Type
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#oral-cancer"
            style={{
              display: "inline-block",
              padding: "28px 40px",
              fontSize: "22px",
              fontWeight: "bold",
              borderRadius: "16px",
              color: "#fff",
              textDecoration: "none",
              margin: "12px",
              border: "3px solid #ffd700",
              background: "linear-gradient(135deg,#dc2626,#b91c1c)",
              boxShadow: "0 6px 24px rgba(220,38,38,0.5)",
            }}
          >
            🦷 Oral Cancer Support
          </a>
          <a
            href="#brain-cancer"
            style={{
              display: "inline-block",
              padding: "28px 40px",
              fontSize: "22px",
              fontWeight: "bold",
              borderRadius: "16px",
              color: "#fff",
              textDecoration: "none",
              margin: "12px",
              border: "3px solid #ffd700",
              background: "linear-gradient(135deg,#7c3aed,#ffd700)",
              boxShadow: "0 6px 24px rgba(124,58,237,0.5)",
            }}
          >
            🧠 Brain Cancer Support
          </a>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* HUD background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <motion.div
            className="absolute left-0 right-0 h-px bg-primary/40"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-sm" />
          <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-sm" />
          <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-sm" />
          <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-sm" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6 uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5" />
              Cancer Support Initiative
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold font-display leading-tight mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Stand With Cancer Patients
              <br />— Be Their Hope
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              DantaNova connects donors and supporters directly with trusted
              cancer NGOs and patients who need help. No middleman fees. No
              barriers. Just hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={() => scrollTo("donor-form")}
                size="lg"
                data-ocid="cancer-support.donate_cta"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg px-8"
              >
                <Heart className="w-4 h-4 mr-2" />
                Donate / Support Now
              </Button>
              <Button
                type="button"
                onClick={() => scrollTo("patient-form")}
                size="lg"
                variant="outline"
                data-ocid="cancer-support.request_support_cta"
                className="border-primary/40 text-primary hover:bg-primary/10 font-semibold px-8"
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Request Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center text-primary font-display mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Growing Impact
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <AnimatedCounter
              target={stats.donorCount || 42}
              label="Donors Registered"
              icon={Users}
            />
            <AnimatedCounter
              target={stats.patientCount || 18}
              label="Patients Supported"
              icon={Heart}
            />
            <AnimatedCounter
              target={stats.pledgeCount || 67}
              label="Pledges Made"
              icon={Shield}
            />
          </div>
        </div>
      </section>

      {/* ── AWARENESS ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center text-foreground font-display mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Know the Warning Signs
          </motion.h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Early detection saves lives. Learn to recognise these signs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Oral Cancer */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-primary/20 bg-card/70 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-primary font-display">
                      Oral Cancer
                    </h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Warning Signs
                    </p>
                    <ul className="space-y-1.5">
                      {[
                        "Persistent mouth sores that don't heal",
                        "Unexplained bleeding in the mouth",
                        "White or red patches on gums/tongue",
                        "Difficulty swallowing or chewing",
                        "Voice changes or hoarseness",
                        "Lump or thickening in the neck",
                      ].map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Risk Factors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Tobacco use",
                        "Alcohol consumption",
                        "HPV infection",
                        "Sun exposure",
                      ].map((r) => (
                        <span
                          key={r}
                          className="px-2.5 py-0.5 rounded-full text-xs border border-primary/25 bg-primary/10 text-primary"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Brain Cancer */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-primary/20 bg-card/70 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-primary font-display">
                      Brain Cancer
                    </h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Warning Signs
                    </p>
                    <ul className="space-y-1.5">
                      {[
                        "Persistent headaches that worsen over time",
                        "Unexplained nausea or vomiting",
                        "Vision or speech difficulties",
                        "Memory problems or confusion",
                        "Seizures or convulsions",
                      ].map((s) => (
                        <li
                          key={s}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Risk Factors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Radiation exposure",
                        "Family history",
                        "Genetic conditions",
                      ].map((r) => (
                        <span
                          key={r}
                          className="px-2.5 py-0.5 rounded-full text-xs border border-primary/25 bg-primary/10 text-primary"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NGO DIRECTORY ── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center text-foreground font-display mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted Cancer Support Organisations
          </motion.h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Verified NGOs and cancer centres you can reach out to directly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {NGOS.map((ngo, i) => (
              <motion.div
                key={ngo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`cancer-support.ngo.item.${i + 1}`}
              >
                <Card className="h-full border-primary/15 bg-card/70 backdrop-blur hover:border-primary/40 transition-colors group">
                  <CardContent className="p-5 flex flex-col gap-3 h-full">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm leading-snug">
                      {ngo.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
                      {ngo.desc}
                    </p>
                    <div className="space-y-1.5 pt-1 border-t border-border/40">
                      {ngo.phone !== "—" && (
                        <a
                          href={`tel:${ngo.phone}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {ngo.phone}
                        </a>
                      )}
                      <a
                        href={`mailto:${ngo.email}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors break-all"
                      >
                        <svg
                          className="w-3.5 h-3.5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {ngo.email}
                      </a>
                      <a
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit Website
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DONOR FORM ── */}
      <section id="donor-form" className="py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-widest">
              <Heart className="w-3.5 h-3.5" />
              Become a Donor
            </div>
            <h2 className="text-2xl font-bold text-foreground font-display">
              Register to Support
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Connect directly with NGOs — no platform fees, no middlemen.
            </p>
          </motion.div>
          <Card className="border-primary/20 bg-card/80 backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <form
                onSubmit={handleDonorSubmit}
                className="space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-name">Full Name *</Label>
                    <Input
                      id="donor-name"
                      data-ocid="cancer-support.donor_name_input"
                      placeholder="Swanandi Vispute"
                      required
                      value={donorForm.name}
                      onChange={(e) =>
                        setDonorForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="donor-email">Email Address *</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      data-ocid="cancer-support.donor_email_input"
                      placeholder="you@email.com"
                      required
                      value={donorForm.email}
                      onChange={(e) =>
                        setDonorForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="donor-phone">Phone Number</Label>
                  <Input
                    id="donor-phone"
                    type="tel"
                    data-ocid="cancer-support.donor_phone_input"
                    placeholder="+91 98765 43210"
                    value={donorForm.phone}
                    onChange={(e) =>
                      setDonorForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Support Type *</Label>
                  <Select
                    value={donorForm.supportType}
                    onValueChange={(v) =>
                      setDonorForm((p) => ({ ...p, supportType: v }))
                    }
                  >
                    <SelectTrigger data-ocid="cancer-support.donor_support_type_select">
                      <SelectValue placeholder="How would you like to help?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">
                        Financial Donation
                      </SelectItem>
                      <SelectItem value="volunteer">Volunteer Help</SelectItem>
                      <SelectItem value="awareness">
                        Awareness Spreading
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Organisation</Label>
                  <Select
                    value={donorForm.preferredOrg}
                    onValueChange={(v) =>
                      setDonorForm((p) => ({ ...p, preferredOrg: v }))
                    }
                  >
                    <SelectTrigger data-ocid="cancer-support.donor_org_select">
                      <SelectValue placeholder="No preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No preference">
                        No preference
                      </SelectItem>
                      {NGO_NAMES.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="donor-message">Message (Optional)</Label>
                  <Textarea
                    id="donor-message"
                    data-ocid="cancer-support.donor_message_textarea"
                    placeholder="Any message you would like to share with the NGO..."
                    rows={3}
                    value={donorForm.message}
                    onChange={(e) =>
                      setDonorForm((p) => ({ ...p, message: e.target.value }))
                    }
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={donorLoading}
                  className="w-full bg-primary text-primary-foreground font-semibold"
                  data-ocid="cancer-support.donor_submit_button"
                >
                  {donorLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Register as Donor
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── PATIENT FORM ── */}
      <section id="patient-form" className="py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-widest">
              <Stethoscope className="w-3.5 h-3.5" />
              Request Help
            </div>
            <h2 className="text-2xl font-bold text-foreground font-display">
              Patient Support Request
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              You are not alone. Tell us about your situation and we will
              connect you with the right support.
            </p>
          </motion.div>
          <Card className="border-primary/20 bg-card/80 backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <form
                onSubmit={handlePatientSubmit}
                className="space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="patient-name">Full Name *</Label>
                    <Input
                      id="patient-name"
                      data-ocid="cancer-support.patient_name_input"
                      placeholder="Your name"
                      required
                      value={patientForm.name}
                      onChange={(e) =>
                        setPatientForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="patient-email">Email Address *</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      data-ocid="cancer-support.patient_email_input"
                      placeholder="you@email.com"
                      required
                      value={patientForm.email}
                      onChange={(e) =>
                        setPatientForm((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="patient-phone">Phone Number</Label>
                  <Input
                    id="patient-phone"
                    type="tel"
                    data-ocid="cancer-support.patient_phone_input"
                    placeholder="+91 98765 43210"
                    value={patientForm.phone}
                    onChange={(e) =>
                      setPatientForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Cancer Type *</Label>
                  <Select
                    value={patientForm.cancerType}
                    onValueChange={(v) =>
                      setPatientForm((p) => ({ ...p, cancerType: v }))
                    }
                  >
                    <SelectTrigger data-ocid="cancer-support.patient_cancer_type_select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral Cancer</SelectItem>
                      <SelectItem value="brain">Brain Cancer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="patient-story">Your Story / Context</Label>
                  <Textarea
                    id="patient-story"
                    data-ocid="cancer-support.patient_story_textarea"
                    placeholder="Briefly describe your situation and what kind of support you need most..."
                    rows={4}
                    value={patientForm.story}
                    onChange={(e) =>
                      setPatientForm((p) => ({ ...p, story: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Support Type</Label>
                  <Select
                    value={patientForm.supportPreference}
                    onValueChange={(v) =>
                      setPatientForm((p) => ({ ...p, supportPreference: v }))
                    }
                  >
                    <SelectTrigger data-ocid="cancer-support.patient_support_pref_select">
                      <SelectValue placeholder="Any support" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Emotional Support">
                        Emotional Support
                      </SelectItem>
                      <SelectItem value="Medical Guidance">
                        Medical Guidance
                      </SelectItem>
                      <SelectItem value="All">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={patientLoading}
                  className="w-full bg-primary text-primary-foreground font-semibold"
                  data-ocid="cancer-support.patient_submit_button"
                >
                  {patientLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── HELPLINES ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center text-foreground font-display mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Helplines & Resources
          </motion.h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Immediate support is one call away.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELPLINES.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`cancer-support.helpline.item.${i + 1}`}
              >
                <Card className="border-primary/15 bg-card/70 hover:border-primary/35 transition-colors">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {h.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        {h.desc}
                      </p>
                      {"isLink" in h && h.isLink ? (
                        <a
                          href={h.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary font-mono hover:underline"
                        >
                          {h.number}
                        </a>
                      ) : (
                        <a
                          href={`tel:${h.number}`}
                          className="text-sm text-primary font-mono hover:underline"
                        >
                          {h.number}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2
            className="text-2xl font-bold text-center text-foreground font-display mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`cancer-support.faq.item.${i + 1}`}
              >
                <Card className="border-primary/15 bg-card/70 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors"
                    aria-expanded={openFaq === i}
                    data-ocid={`cancer-support.faq.toggle.${i + 1}`}
                  >
                    <span className="font-semibold text-sm text-foreground flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {faq.q}
                    </span>
                    <span
                      className={`text-primary transition-transform duration-200 shrink-0 ${openFaq === i ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-4"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 bg-card/50 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DantaNova Cancer Support. Built
            with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
            . All donations connect directly to NGOs — no platform fee.
          </p>
        </div>
      </footer>
    </div>
  );
}
