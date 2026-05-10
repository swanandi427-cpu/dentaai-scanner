import { j as jsxRuntimeExports, L as Link, l as ArrowLeft, m as motion, b as ArrowRight } from "./index-D1mTBV0L.js";
const ARTICLE_URL = "https://dentaai-scanner-n0h.caffeine.xyz/blog/can-ai-detect-cavities";
const ARTICLE_TITLE = "Can AI Really Detect Cavities? What the Research Says";
function ShareButtons() {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${ARTICLE_TITLE} ${ARTICLE_URL}`)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(ARTICLE_TITLE)}&url=${encodeURIComponent(ARTICLE_URL)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Share:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: waUrl,
        target: "_blank",
        rel: "noreferrer",
        className: "px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all",
        style: {
          background: "oklch(0.42 0.15 145 / 0.2)",
          color: "oklch(0.72 0.18 145)",
          border: "1px solid oklch(0.42 0.15 145 / 0.35)"
        },
        "data-ocid": "article1.whatsapp_share",
        children: "WhatsApp"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: twUrl,
        target: "_blank",
        rel: "noreferrer",
        className: "px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all",
        style: {
          background: "oklch(0.60 0.18 230 / 0.18)",
          color: "oklch(0.72 0.19 230)",
          border: "1px solid oklch(0.60 0.18 230 / 0.35)"
        },
        "data-ocid": "article1.twitter_share",
        children: "Twitter / X"
      }
    )
  ] });
}
function PullQuote({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "blockquote",
    {
      className: "my-8 px-6 py-5 rounded-xl border-l-4 text-base font-semibold leading-relaxed italic",
      style: {
        background: "oklch(0.78 0.16 80 / 0.08)",
        borderColor: "oklch(0.78 0.16 80)",
        color: "oklch(0.88 0.18 85)"
      },
      children
    }
  );
}
function BlogArticle1Page() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background text-foreground",
      style: { fontFamily: "Satoshi, Inter, sans-serif" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "header",
          {
            className: "sticky top-0 z-40 border-b border-border/40 backdrop-blur",
            style: { background: "oklch(0.10 0.006 70 / 0.92)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 h-14 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/blog",
                  className: "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors",
                  "data-ocid": "article1.back_link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                    " Back to Blog"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButtons, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-3xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold px-3 py-1 rounded-full",
                    style: {
                      background: "oklch(0.78 0.16 80 / 0.14)",
                      color: "oklch(0.88 0.18 85)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)"
                    },
                    children: "AI & Technology"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "May 5, 2025 · 8 min read" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h1",
                {
                  className: "text-3xl md:text-4xl font-extrabold mb-6 leading-tight",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  },
                  children: ARTICLE_TITLE
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButtons, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-6 text-foreground/90 leading-relaxed", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "Introduction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "For decades, detecting cavities meant a dental appointment, an X-ray machine, and a trained eye. Today, artificial intelligence is stepping into the operatory — and in some cases, into your pocket. AI-powered dental analysis tools can analyse photos of your teeth and flag potential problems with surprising speed. But how accurate is this technology, and can it really replace professional diagnosis? This article explores what the research says." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "How AI Dental Analysis Works" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "Modern AI dental tools rely on",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "oklch(0.88 0.18 85)" }, children: "deep learning convolutional neural networks (CNNs)" }),
                  " ",
                  "trained on thousands — sometimes millions — of annotated dental images. These networks learn to recognise visual patterns associated with decay, plaque buildup, gum recession, and more. When you upload a photo of your teeth, the model compares your image against these learned patterns and generates a probability score for each possible condition."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "More advanced systems use multi-modal inputs: combining photos with answers to health questions to produce a more holistic risk score. DantaNova’s approach layers visual cues with lifestyle factors like smoking, diet, and last dental visit to give you a richer picture of your oral health." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PullQuote, { children: "“AI dental models trained on 50,000+ X-rays have shown up to 92% sensitivity in detecting interproximal caries — comparable to a trained radiologist.”" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "Accuracy Rates in Clinical Studies" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "A growing body of research shows promising results. A 2022 systematic review published in the ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Journal of Dentistry" }),
                  " ",
                  "found that AI systems achieved a mean sensitivity of 87.4% and specificity of 89.2% in detecting proximal caries from radiographs. A 2023 study from the University of Groningen reported that AI outperformed final-year dental students in detecting early-stage lesions."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "For",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "oklch(0.88 0.18 85)" }, children: "smartphone-based photo analysis" }),
                  " ",
                  "— the approach DantaNova uses — accuracy rates are lower, typically in the 70–82% range, because photos lack the depth and contrast of clinical X-rays. However, for",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "screening purposes" }),
                  " — flagging teeth that warrant professional attention — this is more than adequate."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PullQuote, { children: "“The goal is not to replace dentists. It is to get more people through their doors at the right time.”" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "Limitations of AI Dental Scanning" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No AI system is perfect, and it is important to understand what these tools cannot do:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-2 text-foreground/85 pl-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Subsurface lesions" }),
                    " — early decay between teeth is invisible to a smartphone camera."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Gum pocket depth" }),
                    " — periodontal assessment requires physical probing."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Radiographic diagnosis" }),
                    " — bone loss, root infections, and impacted teeth need X-rays."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Lighting and angle variation" }),
                    " — inconsistent photos reduce accuracy significantly."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "No physical sensation feedback" }),
                    " — pain, temperature sensitivity, and tactile feel are critical diagnostic inputs that AI cannot access."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "When to See a Real Dentist" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "AI scanning is best thought of as a",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "triage and awareness tool" }),
                  " — not a replacement for professional care. You should always consult a licensed dentist if you experience:"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc list-inside space-y-2 text-foreground/85 pl-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Tooth pain or sensitivity to hot, cold, or sweet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Visible holes, dark spots, or chipped surfaces" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Bleeding or swollen gums" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Persistent bad breath despite good hygiene" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Any AI scan result flagging moderate or high risk" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mt-8 mb-3", children: "Conclusion" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "AI dental scanning is a genuine scientific breakthrough that can help millions of people who otherwise would delay or skip dental care. It is not magic, and it is not a replacement for your dentist — but for early awareness, habit building, and bridging the gap between visits, it is a powerful tool. DantaNova is designed with exactly this philosophy: use AI to ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "empower" }),
                  " ",
                  "patients, not replace clinicians."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-8 border-t border-border/30 flex flex-col gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShareButtons, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/scan",
                    className: "inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 self-start",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                      color: "oklch(0.08 0.005 60)"
                    },
                    "data-ocid": "article1.scan_cta_button",
                    children: [
                      "Try the AI Scan — It’s Free ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "footer",
          {
            className: "border-t border-border/30 mt-16 py-8 text-center text-xs text-muted-foreground",
            style: { background: "oklch(0.10 0.006 70 / 0.6)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/blog",
                  className: "hover:text-primary transition-colors",
                  "data-ocid": "article1.footer_back_link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "inline w-3 h-3 mr-1" }),
                    "Back to Blog"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-3", children: "·" }),
              "© ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              " DantaNova"
            ]
          }
        )
      ]
    }
  );
}
export {
  BlogArticle1Page as default
};
