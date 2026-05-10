import { r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, A as AnimatePresence, C as CircleCheckBig, b as ArrowRight, f as ChevronRight } from "./index-D1mTBV0L.js";
const questions = [
  {
    id: 1,
    text: "How often do you brush your teeth?",
    options: [
      { label: "Twice a day or more", points: 0, icon: "✅" },
      { label: "Once a day", points: 1, icon: "🟡" },
      { label: "A few times a week", points: 2, icon: "🟠" },
      { label: "Rarely", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 2,
    text: "How often do you floss?",
    options: [
      { label: "Daily", points: 0, icon: "✅" },
      { label: "A few times a week", points: 1, icon: "🟡" },
      { label: "Occasionally", points: 2, icon: "🟠" },
      { label: "Never", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 3,
    text: "Do you smoke or use tobacco?",
    options: [
      { label: "No, never", points: 0, icon: "✅" },
      { label: "I quit", points: 1, icon: "🟡" },
      { label: "Occasionally", points: 2, icon: "🟠" },
      { label: "Yes, regularly", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 4,
    text: "How often do you consume sugary drinks or snacks?",
    options: [
      { label: "Rarely / never", points: 0, icon: "✅" },
      { label: "Once a day", points: 1, icon: "🟡" },
      { label: "Several times a day", points: 2, icon: "🟠" },
      { label: "Constantly", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 5,
    text: "When did you last visit a dentist?",
    options: [
      { label: "Within the last 6 months", points: 0, icon: "✅" },
      { label: "6–12 months ago", points: 1, icon: "🟡" },
      { label: "1–3 years ago", points: 2, icon: "🟠" },
      { label: "More than 3 years ago", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 6,
    text: "Do you experience tooth sensitivity to hot or cold?",
    options: [
      { label: "No", points: 0, icon: "✅" },
      { label: "Mild, occasionally", points: 1, icon: "🟡" },
      { label: "Moderate, often", points: 2, icon: "🟠" },
      { label: "Severe", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 7,
    text: "Do you notice bleeding when you brush or floss?",
    options: [
      { label: "Never", points: 0, icon: "✅" },
      { label: "Rarely", points: 1, icon: "🟡" },
      { label: "Sometimes", points: 2, icon: "🟠" },
      { label: "Almost always", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 8,
    text: "Do you grind or clench your teeth at night?",
    options: [
      { label: "No", points: 0, icon: "✅" },
      { label: "Occasionally", points: 1, icon: "🟡" },
      { label: "Often", points: 2, icon: "🟠" },
      { label: "Yes, I wear a mouthguard", points: 1, icon: "🟡" }
    ]
  },
  {
    id: 9,
    text: "How much water do you drink daily?",
    options: [
      { label: "2 litres or more", points: 0, icon: "✅" },
      { label: "1–2 litres", points: 1, icon: "🟡" },
      { label: "Less than 1 litre", points: 2, icon: "🟠" },
      { label: "Mostly other drinks", points: 3, icon: "🔴" }
    ]
  },
  {
    id: 10,
    text: "Do you use fluoride toothpaste?",
    options: [
      { label: "Yes, always", points: 0, icon: "✅" },
      { label: "Sometimes", points: 1, icon: "🟡" },
      { label: "No", points: 2, icon: "🟠" },
      { label: "I’m not sure", points: 1, icon: "🟡" }
    ]
  }
];
function calculateRisk(answers) {
  const total = Object.values(answers).reduce((s, v) => s + v, 0);
  if (total <= 7) {
    return {
      level: "Low",
      color: "oklch(0.72 0.17 150)",
      bgColor: "oklch(0.42 0.15 145 / 0.15)",
      headline: "Your dental risk is Low — keep it up!",
      emoji: "🟢",
      recommendations: [
        "Continue brushing twice daily with fluoride toothpaste",
        "Maintain your flossing habit",
        "Keep attending regular dental check-ups every 6 months",
        "Try an AI scan every 3 months to monitor for any early changes"
      ]
    };
  }
  if (total <= 18) {
    return {
      level: "Moderate",
      color: "oklch(0.88 0.18 85)",
      bgColor: "oklch(0.78 0.16 80 / 0.12)",
      headline: "Your dental risk is Moderate — some areas need attention.",
      emoji: "🟡",
      recommendations: [
        "Improve flossing to daily if not already",
        "Reduce sugary snacks and drinks, especially between meals",
        "Book a dental check-up in the next 3 months",
        "Run an AI scan today to identify any visible concerns",
        "Consider using a fluoride mouthwash to boost enamel protection"
      ]
    };
  }
  return {
    level: "High",
    color: "oklch(0.65 0.22 25)",
    bgColor: "oklch(0.62 0.22 25 / 0.14)",
    headline: "Your dental risk is High — action is recommended soon.",
    emoji: "🔴",
    recommendations: [
      "Book a dentist appointment as soon as possible",
      "Start brushing twice daily — this single change has the highest impact",
      "Switch to fluoride toothpaste if you haven’t already",
      "Eliminate sugary drinks and limit sugar to mealtimes only",
      "Run an AI scan now — it’s free and takes 30 seconds",
      "If you smoke, talk to your doctor about cessation support"
    ]
  };
}
function RiskQuizPage() {
  const [current, setCurrent] = reactExports.useState(0);
  const [answers, setAnswers] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(null);
  const question = questions[current];
  const isLast = current === questions.length - 1;
  const result = submitted ? calculateRisk(answers) : null;
  const handleNext = () => {
    if (selected === null || !question) return;
    const pts = question.options[selected].points;
    const newAnswers = { ...answers, [question.id]: pts };
    setAnswers(newAnswers);
    if (isLast) {
      setSubmitted(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };
  const restart = () => {
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setSelected(null);
  };
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
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 h-14 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/",
                  className: "text-base font-bold",
                  style: { color: "oklch(0.88 0.18 85)" },
                  "data-ocid": "quiz.home_link",
                  children: "DantaNova"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/scan",
                  className: "text-sm text-muted-foreground hover:text-primary transition-colors",
                  "data-ocid": "quiz.scan_link",
                  children: "Free Scan →"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-2xl mx-auto px-4 py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
              className: "text-center mb-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-3xl md:text-4xl font-extrabold mb-2",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "Dental Health Risk Assessment"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "10 quick questions. Personalised recommendations in seconds." })
              ]
            }
          ),
          !submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", "data-ocid": "quiz.progress_bar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Question ",
                  current + 1,
                  " of ",
                  questions.length
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  Math.round(current / questions.length * 100),
                  "% complete"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-2 rounded-full",
                  style: { background: "oklch(0.22 0.015 60)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "h-full rounded-full",
                      style: {
                        background: "linear-gradient(90deg, oklch(0.78 0.16 80), oklch(0.88 0.18 85))"
                      },
                      animate: { width: `${current / questions.length * 100}%` },
                      transition: { duration: 0.4 }
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: question && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -30 },
                transition: { duration: 0.3 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "p-6 rounded-2xl border border-border/40 mb-6",
                      style: { background: "oklch(0.12 0.008 60 / 0.9)" },
                      "data-ocid": `quiz.question.${current + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-foreground mb-6", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.88 0.18 85)" }, children: [
                            "Q",
                            current + 1,
                            "."
                          ] }),
                          " ",
                          question.text
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-3", children: question.options.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setSelected(idx),
                            className: "flex items-center gap-3 p-4 rounded-xl text-left text-sm font-medium border transition-all hover:scale-[1.02]",
                            style: {
                              background: selected === idx ? "oklch(0.78 0.16 80 / 0.18)" : "oklch(0.10 0.006 70 / 0.7)",
                              borderColor: selected === idx ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60 / 0.6)",
                              color: selected === idx ? "oklch(0.88 0.18 85)" : "oklch(0.85 0.01 80)"
                            },
                            "data-ocid": `quiz.option.${current + 1}.${idx + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl flex-shrink-0", children: opt.icon }),
                              opt.label,
                              selected === idx && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                CircleCheckBig,
                                {
                                  className: "w-4 h-4 ml-auto flex-shrink-0",
                                  style: { color: "oklch(0.88 0.18 85)" }
                                }
                              )
                            ]
                          },
                          opt.label
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleNext,
                      disabled: selected === null,
                      className: "flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                        color: "oklch(0.08 0.005 60)"
                      },
                      "data-ocid": "quiz.next_button",
                      children: [
                        isLast ? "See My Results" : "Next",
                        isLast ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                      ]
                    }
                  ) })
                ]
              },
              current
            ) })
          ] }) : result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.5 },
              "data-ocid": "quiz.results_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-6 rounded-2xl border text-center mb-6",
                    style: {
                      background: result.bgColor,
                      borderColor: result.color
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: result.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "text-3xl font-extrabold mb-1",
                          style: { color: result.color },
                          children: [
                            result.level,
                            " Risk"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 text-sm", children: result.headline })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-6 rounded-2xl border border-border/40 mb-6",
                    style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                    "data-ocid": "quiz.recommendations_section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-foreground mb-4 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "✶" }),
                        " ",
                        "Personalised Recommendations"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: result.recommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex items-start gap-2.5 text-sm text-foreground/85",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "mt-0.5 flex-shrink-0",
                                style: { color: result.color },
                                children: "→"
                              }
                            ),
                            rec
                          ]
                        },
                        rec
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/scan",
                      className: "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105",
                      style: {
                        background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                        color: "oklch(0.08 0.005 60)"
                      },
                      "data-ocid": "quiz.scan_cta_button",
                      children: [
                        "Run AI Scan Now ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: restart,
                      className: "inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold border border-border/50 transition-all hover:scale-105",
                      style: {
                        background: "oklch(0.12 0.008 60 / 0.8)",
                        color: "oklch(0.88 0.18 85)"
                      },
                      "data-ocid": "quiz.restart_button",
                      children: "Retake Quiz"
                    }
                  )
                ] })
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
              " DantaNova · Built with love using",
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
  RiskQuizPage as default
};
