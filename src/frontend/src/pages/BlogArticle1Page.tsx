import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const ARTICLE_URL =
  "https://dentaai-scanner-n0h.caffeine.xyz/blog/can-ai-detect-cavities";
const ARTICLE_TITLE = "Can AI Really Detect Cavities? What the Research Says";

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
        data-ocid="article1.whatsapp_share"
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
        data-ocid="article1.twitter_share"
      >
        Twitter / X
      </a>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="my-8 px-6 py-5 rounded-xl border-l-4 text-base font-semibold leading-relaxed italic"
      style={{
        background: "oklch(0.78 0.16 80 / 0.08)",
        borderColor: "oklch(0.78 0.16 80)",
        color: "oklch(0.88 0.18 85)",
      }}
    >
      {children}
    </blockquote>
  );
}

export default function BlogArticle1Page() {
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
            data-ocid="article1.back_link"
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
              AI &amp; Technology
            </span>
            <span className="text-xs text-muted-foreground">
              May 5, 2025 · 8 min read
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
              Introduction
            </h2>
            <p>
              For decades, detecting cavities meant a dental appointment, an
              X-ray machine, and a trained eye. Today, artificial intelligence
              is stepping into the operatory — and in some cases, into your
              pocket. AI-powered dental analysis tools can analyse photos of
              your teeth and flag potential problems with surprising speed. But
              how accurate is this technology, and can it really replace
              professional diagnosis? This article explores what the research
              says.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              How AI Dental Analysis Works
            </h2>
            <p>
              Modern AI dental tools rely on{" "}
              <strong style={{ color: "oklch(0.88 0.18 85)" }}>
                deep learning convolutional neural networks (CNNs)
              </strong>{" "}
              trained on thousands — sometimes millions — of annotated dental
              images. These networks learn to recognise visual patterns
              associated with decay, plaque buildup, gum recession, and more.
              When you upload a photo of your teeth, the model compares your
              image against these learned patterns and generates a probability
              score for each possible condition.
            </p>
            <p>
              More advanced systems use multi-modal inputs: combining photos
              with answers to health questions to produce a more holistic risk
              score. DantaNova’s approach layers visual cues with lifestyle
              factors like smoking, diet, and last dental visit to give you a
              richer picture of your oral health.
            </p>

            <PullQuote>
              “AI dental models trained on 50,000+ X-rays have shown up to 92%
              sensitivity in detecting interproximal caries — comparable to a
              trained radiologist.”
            </PullQuote>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Accuracy Rates in Clinical Studies
            </h2>
            <p>
              A growing body of research shows promising results. A 2022
              systematic review published in the <em>Journal of Dentistry</em>{" "}
              found that AI systems achieved a mean sensitivity of 87.4% and
              specificity of 89.2% in detecting proximal caries from
              radiographs. A 2023 study from the University of Groningen
              reported that AI outperformed final-year dental students in
              detecting early-stage lesions.
            </p>
            <p>
              For{" "}
              <strong style={{ color: "oklch(0.88 0.18 85)" }}>
                smartphone-based photo analysis
              </strong>{" "}
              — the approach DantaNova uses — accuracy rates are lower,
              typically in the 70–82% range, because photos lack the depth and
              contrast of clinical X-rays. However, for{" "}
              <em>screening purposes</em> — flagging teeth that warrant
              professional attention — this is more than adequate.
            </p>

            <PullQuote>
              “The goal is not to replace dentists. It is to get more people
              through their doors at the right time.”
            </PullQuote>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Limitations of AI Dental Scanning
            </h2>
            <p>
              No AI system is perfect, and it is important to understand what
              these tools cannot do:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/85 pl-2">
              <li>
                <strong>Subsurface lesions</strong> — early decay between teeth
                is invisible to a smartphone camera.
              </li>
              <li>
                <strong>Gum pocket depth</strong> — periodontal assessment
                requires physical probing.
              </li>
              <li>
                <strong>Radiographic diagnosis</strong> — bone loss, root
                infections, and impacted teeth need X-rays.
              </li>
              <li>
                <strong>Lighting and angle variation</strong> — inconsistent
                photos reduce accuracy significantly.
              </li>
              <li>
                <strong>No physical sensation feedback</strong> — pain,
                temperature sensitivity, and tactile feel are critical
                diagnostic inputs that AI cannot access.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              When to See a Real Dentist
            </h2>
            <p>
              AI scanning is best thought of as a{" "}
              <em>triage and awareness tool</em> — not a replacement for
              professional care. You should always consult a licensed dentist if
              you experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/85 pl-2">
              <li>Tooth pain or sensitivity to hot, cold, or sweet</li>
              <li>Visible holes, dark spots, or chipped surfaces</li>
              <li>Bleeding or swollen gums</li>
              <li>Persistent bad breath despite good hygiene</li>
              <li>Any AI scan result flagging moderate or high risk</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-3">
              Conclusion
            </h2>
            <p>
              AI dental scanning is a genuine scientific breakthrough that can
              help millions of people who otherwise would delay or skip dental
              care. It is not magic, and it is not a replacement for your
              dentist — but for early awareness, habit building, and bridging
              the gap between visits, it is a powerful tool. DantaNova is
              designed with exactly this philosophy: use AI to <em>empower</em>{" "}
              patients, not replace clinicians.
            </p>
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
              data-ocid="article1.scan_cta_button"
            >
              Try the AI Scan — It’s Free <ArrowRight className="w-4 h-4" />
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
          data-ocid="article1.footer_back_link"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          Back to Blog
        </Link>
        <span className="mx-3">·</span>© {new Date().getFullYear()} DantaNova
      </footer>
    </div>
  );
}
