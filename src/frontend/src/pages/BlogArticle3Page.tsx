import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Globe,
  Lock,
  Search,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

const ARTICLE_URL =
  "https://dentaai-scanner-n0h.caffeine.xyz/blog/dental-passport-guide";
const ARTICLE_TITLE =
  "The Dental Passport: Your Complete Guide to Seamless Dental Care Anywhere";

interface Step {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    icon: Lock,
    title: "Create your Passport",
    desc: "Sign in and visit /passport. Add your dental history, existing conditions, allergies, and previous treatments. Your data is encrypted on-chain.",
  },
  {
    icon: Globe,
    title: "Travel anywhere with confidence",
    desc: "Your Dental Passport code goes with you on your phone. Walk into any DantaNova-connected dentist worldwide and share your record instantly — no paperwork needed.",
  },
  {
    icon: Search,
    title: "Dentists look up your record",
    desc: "A visiting dentist can use the Passport Lookup to access your full dental history, saving consultation time and avoiding duplicate X-rays or missed allergy information.",
  },
  {
    icon: Briefcase,
    title: "Reimbursement flow",
    desc: "If you receive emergency treatment abroad, the visiting dentist can bill your home dentist through the platform. All amounts are handled directly between parties — DantaNova is the connector.",
  },
];

function ShareButtons() {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${ARTICLE_TITLE} ${ARTICLE_URL}`)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(ARTICLE_TITLE)}&url=${encodeURIComponent(ARTICLE_URL)}`;
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs text-muted-foreground">Share:</span>
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all"
        style={{
          background: "oklch(0.42 0.15 145 / 0.2)",
          color: "oklch(0.72 0.18 145)",
          border: "1px solid oklch(0.42 0.15 145 / 0.35)",
        }}
        data-ocid="article3.whatsapp_share"
      >
        WhatsApp
      </a>
      <a
        href={twUrl}
        target="_blank"
        rel="noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all"
        style={{
          background: "oklch(0.60 0.18 230 / 0.18)",
          color: "oklch(0.72 0.19 230)",
          border: "1px solid oklch(0.60 0.18 230 / 0.35)",
        }}
        data-ocid="article3.twitter_share"
      >
        Twitter / X
      </a>
    </div>
  );
}

export default function BlogArticle3Page() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b border-border/40 backdrop-blur"
        style={{ background: "oklch(0.10 0.006 70 / 0.92)" }}
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-ocid="article3.back_link"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <ShareButtons />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: "oklch(0.78 0.16 80 / 0.14)",
                color: "oklch(0.88 0.18 85)",
                border: "1px solid oklch(0.78 0.16 80 / 0.3)",
              }}
            >
              Dental Passport
            </span>
            <span className="text-xs text-muted-foreground">
              Apr 20, 2025 · 7 min read
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {ARTICLE_TITLE}
          </h1>
          <ShareButtons />

          <div className="mt-8 space-y-6 text-foreground/90 leading-relaxed">
            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              What Is a Dental Passport?
            </h2>
            <p>
              A Dental Passport is a portable, digital record of your entire
              dental history — X-rays, diagnoses, treatments, allergies, and
              ongoing conditions — stored securely on the blockchain and
              accessible from any device, anywhere in the world. Think of it as
              your dental health identity: compact, trustworthy, and always with
              you.
            </p>
            <p>
              DantaNova pioneered the Dental Passport concept to solve a
              universal problem: when you travel or move abroad, your dental
              records stay behind. That means emergency dentists abroad work
              blind — unaware of your allergies, previous root canals, implants,
              or medications. The result is slower treatment, higher costs, and
              avoidable risk.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              How to Create Yours on DantaNova
            </h2>
            <div className="grid gap-4 mt-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-4 p-5 rounded-xl border border-border/40"
                    style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
                    data-ocid={`article3.step.${i + 1}`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "oklch(0.78 0.16 80 / 0.14)",
                        border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "oklch(0.88 0.18 85)" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        <span style={{ color: "oklch(0.88 0.18 85)" }}>
                          Step {i + 1}:
                        </span>{" "}
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Using Your Passport When Traveling
            </h2>
            <p>
              Before a trip, open DantaNova and ensure your Dental Passport is
              up to date. Download a PDF copy as a backup — handy if you are in
              an area with poor connectivity. When you arrive at a foreign
              dental clinic, simply share your Passport code or let the dentist
              perform a lookup by your email. Within seconds, they have your
              full history.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Sharing Your Record with Dentists
            </h2>
            <p>
              Your Dental Passport is private by default. You choose when to
              share it, and with whom. Sharing generates a time-limited access
              link or a simple lookup code. You can revoke access at any time
              from your Passport settings. Data is encrypted on the Internet
              Computer blockchain — no centralised server holds your records.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              The Reimbursement Flow
            </h2>
            <p>
              If a visiting dentist treats you abroad, they can submit a
              treatment record through DantaNova. Your home dentist receives a
              notification with the cost and can review the treatment details.
              If they agree, they authorise the payment directly to the visiting
              dentist — DantaNova simply facilitates the introduction and
              record-keeping. No money flows through the platform.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row gap-4">
            <Link
              to="/issue-passport"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                color: "oklch(0.08 0.005 60)",
              }}
              data-ocid="article3.issue_passport_button"
            >
              Issue a Passport <Zap className="w-4 h-4" />
            </Link>
            <Link
              to="/passport"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 border border-border/50"
              style={{
                background: "oklch(0.12 0.008 60 / 0.8)",
                color: "oklch(0.88 0.18 85)",
              }}
              data-ocid="article3.view_passport_button"
            >
              View My Passport <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-6">
            <ShareButtons />
          </div>
        </motion.div>
      </main>

      <footer
        className="border-t border-border/30 mt-16 py-8 text-center text-xs text-muted-foreground"
        style={{ background: "oklch(0.10 0.006 70 / 0.6)" }}
      >
        <Link
          to="/blog"
          className="hover:text-primary transition-colors"
          data-ocid="article3.footer_back_link"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          Back to Blog
        </Link>
        <span className="mx-3">·</span>© {new Date().getFullYear()} DantaNova
      </footer>
    </div>
  );
}
