import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

const ARTICLE_URL =
  "https://dentaai-scanner-n0h.caffeine.xyz/blog/oral-health-tips";
const ARTICLE_TITLE = "10 Proven Tips for Healthy Teeth and Gums";

interface Tip {
  icon: LucideIcon;
  headline: string;
  body: string;
}

const tips: Tip[] = [
  {
    icon: Smile,
    headline: "Brush for 2 Full Minutes, Twice Daily",
    body: "Use a soft-bristled toothbrush and fluoride toothpaste. Divide your mouth into four quadrants and spend 30 seconds on each. Most people brush for less than 45 seconds — those extra seconds make a dramatic difference in plaque removal.",
  },
  {
    icon: Waves,
    headline: "Floss Every Single Day",
    body: "Flossing removes plaque and food from between teeth where your toothbrush cannot reach. Do it once per day — ideally before bed — and use a gentle C-shape motion along each tooth surface. Water flossers are an excellent alternative.",
  },
  {
    icon: ShieldCheck,
    headline: "Always Use Fluoride Toothpaste",
    body: "Fluoride re-mineralises early lesions and strengthens enamel against acid attack. Look for at least 1000 ppm fluoride on the label. Despite myths, fluoride at recommended concentrations is completely safe and clinically proven effective.",
  },
  {
    icon: Star,
    headline: "Limit Sugary and Acidic Foods",
    body: "Sugar feeds the bacteria that produce the acids that erode enamel. Acidic drinks like fizzy sodas and fruit juices lower your mouth’s pH directly. Limiting these — especially between meals — gives your saliva time to neutralise acids naturally.",
  },
  {
    icon: Droplets,
    headline: "Drink More Water (Especially Fluoridated)",
    body: "Water rinses away food particles, neutralises acids, and keeps saliva flowing. Fluoridated tap water provides a low-level protective dose throughout the day. Aim for at least 2 litres daily and rinse your mouth after every sugary meal.",
  },
  {
    icon: RefreshCcw,
    headline: "Replace Your Toothbrush Every 3 Months",
    body: "Worn bristles are significantly less effective at removing plaque. Replace your brush — or the head of an electric toothbrush — every 3 months, or sooner if the bristles are splayed. Also replace it after any illness to avoid reinfection.",
  },
  {
    icon: Sparkles,
    headline: "Use an Antimicrobial Mouthwash",
    body: "A good mouthwash reaches areas your brush and floss miss. Fluoride mouthwashes boost enamel protection; antibacterial formulas reduce gum-disease-causing bacteria. Use after brushing for maximum effect.",
  },
  {
    icon: Leaf,
    headline: "Eat Calcium-Rich Foods",
    body: "Teeth are made largely of calcium. Foods like dairy, leafy greens, almonds, and fortified plant milks supply the minerals your body uses to maintain enamel density and support healthy jawbone structure. Pair calcium with vitamin D for optimal absorption.",
  },
  {
    icon: ShieldCheck,
    headline: "Don’t Smoke or Use Tobacco",
    body: "Smoking is the leading preventable cause of gum disease, oral cancer, and tooth loss. It reduces blood flow to the gums, impairs healing, and stains teeth deeply. Quitting even in adulthood produces measurable improvement in gum health within months.",
  },
  {
    icon: Stethoscope,
    headline: "See Your Dentist Every 6 Months",
    body: "Professional cleaning removes calcified tartar that brushing cannot shift. Regular check-ups catch problems early — when they are small, inexpensive, and reversible. Consider an AI scan like DantaNova’s between visits to monitor any changes at home.",
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
        data-ocid="article2.whatsapp_share"
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
        data-ocid="article2.twitter_share"
      >
        Twitter / X
      </a>
    </div>
  );
}

export default function BlogArticle2Page() {
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
            data-ocid="article2.back_link"
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
              Oral Health
            </span>
            <span className="text-xs text-muted-foreground">
              Apr 28, 2025 · 6 min read
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
          <p className="mt-6 text-foreground/85 leading-relaxed">
            Good oral health is one of the best investments you can make in your
            overall wellbeing. These 10 research-backed tips are practical,
            affordable, and effective — whether you are starting from scratch or
            looking to level up an already solid routine.
          </p>

          <div className="mt-10 space-y-5">
            {tips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.headline}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-5 p-5 rounded-2xl border border-border/40"
                  style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
                  data-ocid={`article2.tip.${i + 1}`}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "oklch(0.78 0.16 80 / 0.14)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                    }}
                  >
                    <span
                      className="text-base font-extrabold"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex gap-3 flex-1">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "oklch(0.78 0.16 80 / 0.10)" }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: "oklch(0.88 0.18 85)" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1.5">
                        {tip.headline}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col gap-6">
            <ShareButtons />
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 self-start"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                color: "oklch(0.08 0.005 60)",
              }}
              data-ocid="article2.scan_cta_button"
            >
              Check Your Teeth Now — Free Scan{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>
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
          data-ocid="article2.footer_back_link"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          Back to Blog
        </Link>
        <span className="mx-3">·</span>© {new Date().getFullYear()} DantaNova
      </footer>
    </div>
  );
}
