import { r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, B as BookOpen, g as Calendar, a as Clock, b as ArrowRight } from "./index-D1mTBV0L.js";
const articles = [
  {
    slug: "can-ai-detect-cavities",
    title: "Can AI Really Detect Cavities? What the Research Says",
    excerpt: "Artificial intelligence is transforming dental diagnostics. We dive deep into the science behind AI cavity detection, accuracy rates, and what it means for your oral health.",
    readTime: "8 min read",
    date: "May 5, 2025",
    category: "AI & Technology"
  },
  {
    slug: "oral-health-tips",
    title: "10 Proven Tips for Healthy Teeth and Gums",
    excerpt: "Building a strong dental hygiene routine doesn't have to be complicated. These 10 evidence-backed tips can dramatically improve your oral health starting today.",
    readTime: "6 min read",
    date: "Apr 28, 2025",
    category: "Oral Health"
  },
  {
    slug: "dental-passport-guide",
    title: "The Dental Passport: Your Complete Guide to Seamless Dental Care Anywhere",
    excerpt: "Traveling abroad and worried about dental emergencies? The DantaNova Dental Passport lets you carry your complete dental record anywhere in the world.",
    readTime: "7 min read",
    date: "Apr 20, 2025",
    category: "Dental Passport"
  }
];
function BlogPage() {
  reactExports.useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "DantaNova Blog",
      description: "Dental health insights from DantaNova.",
      url: "https://dentaai-scanner-n0h.caffeine.xyz/blog",
      blogPost: articles.map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        datePublished: a.date,
        url: `https://dentaai-scanner-n0h.caffeine.xyz/blog/${a.slug}`
      }))
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "blog-schema";
    script.textContent = JSON.stringify(schema);
    if (!document.getElementById("blog-schema")) {
      document.head.appendChild(script);
    }
    return () => {
      const el = document.getElementById("blog-schema");
      if (el) el.remove();
    };
  }, []);
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
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 h-14 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/",
                  className: "text-lg font-bold",
                  style: { color: "oklch(0.88 0.18 85)" },
                  "data-ocid": "blog.home_link",
                  children: "DantaNova"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/scan",
                    className: "text-muted-foreground hover:text-primary transition-colors",
                    "data-ocid": "blog.nav_scan_link",
                    children: "Free Scan"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/find-dentist",
                    className: "text-muted-foreground hover:text-primary transition-colors",
                    "data-ocid": "blog.nav_dentist_link",
                    children: "Find Dentist"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-4 py-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "text-center mb-14",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border",
                    style: {
                      background: "oklch(0.78 0.16 80 / 0.12)",
                      borderColor: "oklch(0.78 0.16 80 / 0.3)",
                      color: "oklch(0.88 0.18 85)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                      " Dental Health Insights"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-4xl md:text-5xl font-extrabold mb-4",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76), oklch(0.95 0.12 90))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "DantaNova Blog"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "Dental health insights, AI research, oral care tips, and the latest from DantaNova." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8", children: articles.map((article, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.article,
            {
              initial: { opacity: 0, y: 32 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: i * 0.12 },
              whileHover: { y: -4 },
              className: "group flex flex-col md:flex-row rounded-2xl border border-border/40 overflow-hidden",
              style: { background: "oklch(0.12 0.008 60 / 0.9)" },
              "data-ocid": `blog.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "relative w-full md:w-64 min-h-44 flex-shrink-0 flex items-center justify-center",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.22 0.08 80 / 0.4), oklch(0.14 0.03 70 / 0.3))"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-16 h-16 rounded-full flex items-center justify-center",
                          style: {
                            background: "oklch(0.78 0.16 80 / 0.18)",
                            border: "1.5px solid oklch(0.78 0.16 80 / 0.4)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            BookOpen,
                            {
                              className: "w-7 h-7",
                              style: { color: "oklch(0.88 0.18 85)" }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full",
                          style: {
                            background: "oklch(0.78 0.16 80 / 0.18)",
                            color: "oklch(0.88 0.18 85)",
                            border: "1px solid oklch(0.78 0.16 80 / 0.35)"
                          },
                          children: article.category
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between p-6 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors", children: article.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-4", children: article.excerpt })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                        article.date
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
                        article.readTime
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: `/blog/${article.slug}`,
                        className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                          color: "oklch(0.08 0.005 60)"
                        },
                        "data-ocid": `blog.read_button.${i + 1}`,
                        children: [
                          "Read Article ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3.5 h-3.5" })
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            },
            article.slug
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5 },
              className: "mt-20 text-center rounded-2xl p-10 border border-border/40",
              style: { background: "oklch(0.12 0.008 60 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-foreground mb-3", children: "Ready to scan your teeth?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Get a free AI-powered dental health check in under 30 seconds." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/scan",
                    className: "inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                      color: "oklch(0.08 0.005 60)"
                    },
                    "data-ocid": "blog.scan_cta_button",
                    children: [
                      "Start Free Scan ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "footer",
          {
            className: "border-t border-border/30 mt-16 py-8 text-center text-xs text-muted-foreground",
            style: { background: "oklch(0.10 0.006 70 / 0.6)" },
            children: [
              "© ",
              (/* @__PURE__ */ new Date()).getFullYear(),
              " DantaNova. Built with love using",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "hover:text-primary transition-colors",
                  children: "caffeine.ai"
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  BlogPage as default
};
