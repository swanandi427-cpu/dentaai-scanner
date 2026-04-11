import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock,
  Cpu,
  Download,
  Play,
  Scan,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const ENGINEERING_PRINCIPLES = [
  {
    number: "01",
    title: "Apply The Algorithm Constantly",
    description:
      "Question every requirement. Delete any part of the process you can. Simplify and optimize. Accelerate cycle time. Automate.",
    icon: Cpu,
  },
  {
    number: "02",
    title: "Physics Is The Only Law",
    description:
      "The only rules are the ones dictated by the laws of physics. Everything else is a recommendation.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Minimize The Idiot Index",
    description:
      "Compare the cost of a finished product to the cost of its raw materials. If the index is high, its cost could be reduced through more efficient manufacturing techniques.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "If The Timeline Is Long, It's Wrong",
    description:
      "Long timelines are a symptom of over-engineering, unnecessary steps, or lack of urgency. Compress them.",
    icon: Clock,
  },
  {
    number: "05",
    title: "Hire For Attitude",
    description:
      "Skills can be taught. Attitude cannot. Hire people who are driven, curious, and willing to challenge the status quo.",
    icon: Target,
  },
  {
    number: "06",
    title: "The Leader Should Be On The Front Lines",
    description:
      "Leaders who stay in boardrooms lose touch with reality. The best leaders are closest to the work.",
    icon: Activity,
  },
  {
    number: "07",
    title: "Camaraderie Is Dangerous",
    description:
      "It makes it hard for people to challenge each other's work. Maintain a culture where honest critique is valued over comfort.",
    icon: ArrowRight,
  },
  {
    number: "08",
    title: "Don't Fear Losing",
    description:
      "It hurts the first 50 times, but then you'll be able to play with less emotion and take more risks. Failure is the tuition fee for success.",
    icon: Scan,
  },
  {
    number: "09",
    title: "Design And Production Are One",
    description:
      "Design and production should never be separated. Keep everything together and feedback immediate. The best product teams ship as they design.",
    icon: Cpu,
  },
  {
    number: "10",
    title: "Do Useful Things For Civilization",
    description:
      "Stay heads-down focused on doing useful things for civilization. The mission is bigger than the product.",
    icon: TrendingUp,
  },
  {
    number: "11",
    title: "The Mission Comes First",
    description:
      "Keep the entire company committed to a common goal. When the mission is clear, every decision becomes easier.",
    icon: Target,
  },
];

const metrics = [
  { icon: TrendingUp, value: "5,000+", label: "Scans Analyzed" },
  { icon: Target, value: "94%", label: "Detection Accuracy" },
  { icon: Activity, value: "15+", label: "Conditions Detected" },
  { icon: Clock, value: "<15 min", label: "Emergency Match Time" },
];

const differentiators = [
  {
    emoji: "🦷",
    title: "AI Scan at Home",
    description:
      "Detect cavities, gum disease, and 15+ conditions using just your phone camera — no clinic visit needed.",
  },
  {
    emoji: "🚨",
    title: "Emergency-First Matching",
    description:
      "Unlike ZocDoc or directories, DantaNova is purpose-built for urgent care — matching you to an available dentist in under 15 minutes.",
  },
  {
    emoji: "🛂",
    title: "Dental Passport",
    description:
      "The world's first dentist-to-dentist trust-transfer network. Your records, budget, and history travel with you — globally.",
  },
  {
    emoji: "💸",
    title: "No Upfront Payment Abroad",
    description:
      "Payment is settled dentist-to-dentist. Patients never pay out-of-pocket while traveling — a problem no competitor has solved.",
  },
];

const yParts = [
  {
    label: "We help",
    content: "patients experiencing dental pain or uncertainty",
    color: "oklch(0.82 0.18 85)",
  },
  {
    label: "to",
    content:
      "detect dental problems early, find emergency dentists instantly, and carry their dental history anywhere in the world",
    color: "oklch(0.75 0.14 85)",
  },
  {
    label: "by",
    content:
      "combining AI-powered tooth scanning, real-time verified dentist matching, and a Dental Passport trust-transfer network — all in one free platform",
    color: "oklch(0.70 0.12 85)",
  },
  {
    label: "so that",
    content:
      "no one ever has to suffer through a dental emergency alone, overpay for care while traveling, or show up to a new dentist with zero context",
    color: "oklch(0.88 0.20 85)",
  },
];

const businessModel = [
  {
    title: "Freemium Scans",
    desc: "Free AI dental scans for patients — unlimited",
    icon: "🆓",
  },
  {
    title: "Dentist Subscriptions",
    desc: "₹999–₹4,999/month for Pro & Elite tiers",
    icon: "💼",
  },
  {
    title: "Transaction Fee",
    desc: "8% platform fee on Dental Passport reimbursements",
    icon: "💰",
  },
  {
    title: "Referral Commission",
    desc: "Commission on every confirmed booking via platform",
    icon: "🤝",
  },
];

export default function YStatementPage() {
  const navigate = useNavigate();

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.01 85)" }}
      data-ocid="pitch.page"
    >
      {/* Header nav */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "oklch(0.08 0.01 85 / 0.9)",
          borderColor: "oklch(0.72 0.15 85 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
          style={{ color: "oklch(0.88 0.18 85)" }}
          data-ocid="pitch.home.link"
        >
          🦷 DantaNova
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 border"
            style={{
              borderColor: "oklch(0.72 0.18 85 / 0.4)",
              color: "oklch(0.82 0.18 85)",
            }}
            data-ocid="pitch.pdf_export.button"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/scan" })}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: "oklch(0.72 0.18 85)",
              color: "oklch(0.08 0.01 85)",
            }}
            data-ocid="pitch.scan.button"
          >
            Try Free Scan
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border mb-2"
            style={{
              borderColor: "oklch(0.72 0.18 85 / 0.4)",
              color: "oklch(0.82 0.18 85)",
              background: "oklch(0.72 0.18 85 / 0.08)",
            }}
          >
            Y Statement
          </div>
          <h1
            className="text-4xl md:text-6xl font-black tracking-tight leading-none"
            style={{ color: "oklch(0.97 0.03 85)" }}
          >
            Our Pitch
          </h1>
          <p
            className="text-base md:text-lg italic"
            style={{ color: "oklch(0.65 0.08 85)" }}
          >
            Because Every Smile Matters The Most
          </p>
        </motion.div>

        {/* Y Statement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1.5px solid oklch(0.72 0.18 85 / 0.3)",
            background:
              "linear-gradient(135deg, oklch(0.12 0.02 85 / 0.9), oklch(0.10 0.01 85))",
            boxShadow: "0 0 60px oklch(0.72 0.18 85 / 0.06)",
          }}
          data-ocid="pitch.statement.card"
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: "oklch(0.72 0.18 85 / 0.15)",
              background: "oklch(0.72 0.18 85 / 0.05)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.72 0.18 85)" }}
            >
              The Y Combinator-Style Statement
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-0">
            {yParts.map((part, i) => (
              <motion.div
                key={part.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex gap-4 md:gap-6 py-5 border-b last:border-b-0"
                style={{ borderColor: "oklch(0.72 0.18 85 / 0.1)" }}
              >
                <div className="pt-0.5 shrink-0 w-20 md:w-24">
                  <span
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ color: part.color }}
                  >
                    {part.label}
                  </span>
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "oklch(0.92 0.04 85)" }}
                >
                  {part.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
          data-ocid="pitch.metrics.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="rounded-xl p-5 text-center space-y-2"
                style={{
                  background: "oklch(0.13 0.02 85)",
                  border: "1px solid oklch(0.72 0.18 85 / 0.2)",
                }}
              >
                <m.icon
                  className="w-5 h-5 mx-auto"
                  style={{ color: "oklch(0.72 0.18 85)" }}
                />
                <div
                  className="text-3xl font-black tracking-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.88 0.20 85), oklch(0.65 0.14 85))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.65 0.07 85)" }}
                >
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Problem & Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-ocid="pitch.problem_solution.section"
        >
          <div
            className="rounded-xl p-6 space-y-3"
            style={{
              background: "oklch(0.12 0.03 25 / 0.5)",
              border: "1px solid oklch(0.62 0.22 25 / 0.3)",
            }}
          >
            <div className="text-2xl">😰</div>
            <h3
              className="font-bold text-lg"
              style={{ color: "oklch(0.82 0.18 25)" }}
            >
              The Problem
            </h3>
            <ul
              className="text-sm space-y-2"
              style={{ color: "oklch(0.72 0.06 85)" }}
            >
              <li>• 2M+ dental ER visits/year in the US alone ($750+ each)</li>
              <li>• No real-time emergency dentist matching platform</li>
              <li>• Patients travel with zero dental records</li>
              <li>• Upfront payments block urgent care abroad</li>
              <li>• Most dental problems caught too late</li>
            </ul>
          </div>
          <div
            className="rounded-xl p-6 space-y-3"
            style={{
              background: "oklch(0.12 0.04 142 / 0.3)",
              border: "1px solid oklch(0.62 0.18 142 / 0.3)",
            }}
          >
            <div className="text-2xl">✅</div>
            <h3
              className="font-bold text-lg"
              style={{ color: "oklch(0.72 0.18 142)" }}
            >
              Our Solution
            </h3>
            <ul
              className="text-sm space-y-2"
              style={{ color: "oklch(0.72 0.06 85)" }}
            >
              <li>• AI scan in 30 seconds from your phone camera</li>
              <li>• Real-time emergency dentist matching (&lt;15 min)</li>
              <li>• Dental Passport — records travel with you globally</li>
              <li>• Dentist-to-dentist payment settlement</li>
              <li>• All-in-one free platform, no app download needed</li>
            </ul>
          </div>
        </motion.div>

        {/* Business Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
          data-ocid="pitch.business_model.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            Business Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessModel.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl p-5 flex gap-4 items-start"
                style={{
                  background: "oklch(0.12 0.02 85)",
                  border: "1px solid oklch(0.72 0.18 85 / 0.2)",
                }}
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4
                    className="font-bold text-sm mb-1"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    {b.title}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.06 85)" }}
                  >
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl p-6 text-center space-y-4"
          style={{
            background: "oklch(0.12 0.02 85)",
            border: "1.5px solid oklch(0.72 0.18 85 / 0.3)",
          }}
          data-ocid="pitch.market.section"
        >
          <h2
            className="text-2xl font-black uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            Market Opportunity
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "$150B+", label: "Global Dental Market" },
              { value: "1B+", label: "International Travelers/Year" },
              { value: "4.8B", label: "People with Dental Disease" },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div
                  className="text-2xl font-black"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.88 0.20 85), oklch(0.65 0.14 85))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.value}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.62 0.06 85)" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-6"
          data-ocid="pitch.differentiators.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            Why DantaNova and Not a Competitor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl p-6 space-y-3"
                style={{
                  background: "oklch(0.12 0.02 85)",
                  border: "1px solid oklch(0.72 0.18 85 / 0.2)",
                }}
                data-ocid={`pitch.differentiators.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{d.emoji}</span>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  >
                    {d.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.72 0.06 85)" }}
                >
                  {d.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
          data-ocid="pitch.team.section"
        >
          <h2
            className="text-2xl font-black text-center uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.18 85)" }}
          >
            Team
          </h2>
          <div
            className="rounded-xl p-6 flex items-center gap-5"
            style={{
              background: "oklch(0.12 0.02 85)",
              border: "1px solid oklch(0.72 0.18 85 / 0.2)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: "oklch(0.78 0.18 85 / 0.15)",
                border: "2px solid oklch(0.78 0.18 85 / 0.5)",
              }}
            >
              👩‍💼
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-lg"
                style={{ color: "oklch(0.92 0.12 85)" }}
              >
                Swanandi Manoj Vispute
              </h3>
              <p className="text-sm" style={{ color: "oklch(0.72 0.18 85)" }}>
                Founder & CEO
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.60 0.06 85)" }}
              >
                Vision, strategy, product direction, and business development.
                Building DantaNova to make dental healthcare accessible for
                everyone, everywhere.
              </p>
              <a
                href="https://www.linkedin.com/in/dantanova-dental-ai-aa33a8400"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold hover:underline"
                style={{ color: "oklch(0.72 0.18 85)" }}
              >
                LinkedIn Profile →
              </a>
            </div>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="rounded-2xl p-8 md:p-10 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.72 0.18 85 / 0.12), oklch(0.72 0.18 85 / 0.04))",
            border: "1.5px solid oklch(0.72 0.18 85 / 0.35)",
          }}
          data-ocid="pitch.quote.section"
        >
          <div
            className="absolute top-4 left-6 text-6xl font-serif leading-none select-none"
            style={{ color: "oklch(0.72 0.18 85 / 0.2)" }}
          >
            &ldquo;
          </div>
          <p
            className="relative text-lg md:text-xl font-semibold leading-relaxed italic"
            style={{ color: "oklch(0.92 0.08 85)" }}
          >
            DantaNova is the only platform that scans your teeth, finds you an
            emergency dentist, and ensures your records and budget travel with
            you — anywhere in the world.
          </p>
          <div
            className="absolute bottom-4 right-6 text-6xl font-serif leading-none select-none"
            style={{ color: "oklch(0.72 0.18 85 / 0.2)" }}
          >
            &rdquo;
          </div>
        </motion.blockquote>

        {/* Engineering Principles */}
        <motion.section
          id="principles"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7 }}
          className="scroll-mt-24"
          data-ocid="pitch.principles.section"
        >
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border mb-4"
              style={{
                borderColor: "oklch(0.72 0.18 85 / 0.4)",
                color: "oklch(0.82 0.18 85)",
                background: "oklch(0.72 0.18 85 / 0.08)",
              }}
            >
              How We Build
            </div>
            <h2
              className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.75 0.2 72))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Engineering Principles
            </h2>
            <p
              className="text-base max-w-xl mx-auto leading-relaxed"
              style={{ color: "oklch(0.65 0.07 85)" }}
            >
              The 11 principles that guide how we build DantaNova — fast,
              focused, and for civilization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ENGINEERING_PRINCIPLES.map((principle, i) => (
              <motion.div
                key={principle.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 40px oklch(0.72 0.18 85 / 0.2)",
                  borderColor: "oklch(0.72 0.18 85 / 0.7)",
                }}
                className="relative rounded-2xl p-6 flex gap-5 overflow-hidden transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.13 0.03 85 / 0.95), oklch(0.10 0.015 60 / 0.9))",
                  border: "1.5px solid oklch(0.72 0.18 85 / 0.25)",
                  boxShadow: "inset 0 1px 0 oklch(0.72 0.18 85 / 0.08)",
                  backdropFilter: "blur(12px)",
                }}
                data-ocid={`pitch.principles.item.${i + 1}`}
              >
                <div
                  className="absolute top-0 left-0 w-24 h-24 rounded-full pointer-events-none"
                  style={{
                    background: "oklch(0.72 0.18 85 / 0.05)",
                    filter: "blur(20px)",
                    transform: "translate(-30%, -30%)",
                  }}
                />
                <div className="shrink-0 mt-0.5">
                  <span
                    className="font-black text-4xl leading-none block"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.88 0.18 85), oklch(0.62 0.14 80))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {principle.number}
                  </span>
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <principle.icon
                      className="w-4 h-4 shrink-0"
                      style={{ color: "oklch(0.82 0.18 85)" }}
                    />
                    <h3
                      className="font-bold text-sm leading-snug"
                      style={{ color: "oklch(0.92 0.12 85)" }}
                    >
                      {principle.title}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.65 0.06 80)" }}
                  >
                    {principle.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          data-ocid="pitch.cta.section"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ to: "/scan" })}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.65 0.16 85))",
              color: "oklch(0.08 0.01 85)",
              boxShadow: "0 4px 24px oklch(0.72 0.18 85 / 0.3)",
            }}
            data-ocid="pitch.scan.primary_button"
          >
            <Scan className="w-4 h-4" />
            Try Free Scan
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ to: "/demo" })}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base border transition-all"
            style={{
              border: "1.5px solid oklch(0.72 0.15 85 / 0.55)",
              color: "oklch(0.88 0.18 85)",
            }}
            data-ocid="pitch.demo.button"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Footer tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-center text-sm pb-8"
          style={{ color: "oklch(0.50 0.05 85)" }}
        >
          © {new Date().getFullYear()} DantaNova · Because Every Smile Matters
          The Most
        </motion.p>
      </div>
    </div>
  );
}
