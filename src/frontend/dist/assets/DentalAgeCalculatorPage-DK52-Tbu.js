import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Link, m as motion, h as CalendarDays, i as TrendingUp, C as CircleCheckBig, b as ArrowRight, R as RefreshCw, k as Share2, e as ChevronLeft, f as ChevronRight } from "./index-D1mTBV0L.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const INITIAL = {
  age: 25,
  brushFreq: "",
  flossFreq: "",
  mouthwash: "",
  sugaryDrinks: "",
  smoking: "",
  alcohol: "",
  lastVisit: "",
  hadCavities: "",
  gumDisease: "",
  sensitivity: "",
  bleedingGums: "",
  discoloration: ""
};
function calcDentalAge(d) {
  let adj = 0;
  const tips = [];
  if (d.brushFreq === "3x") {
    adj -= 1;
  } else if (d.brushFreq === "1-2x") ;
  else if (d.brushFreq === "less") {
    adj += 2;
    tips.push("Brush at least twice daily with fluoride toothpaste.");
  }
  if (d.flossFreq === "daily") {
    adj -= 2;
  } else if (d.flossFreq === "rarely") {
    adj += 2;
    tips.push("Start flossing daily — it removes plaque brushing can't reach.");
  } else if (d.flossFreq === "never") {
    adj += 3;
    tips.push(
      "Introduce daily flossing immediately — gum disease risk is elevated."
    );
  }
  if (d.mouthwash === "yes") adj -= 1;
  if (d.sugaryDrinks === "3+") {
    adj += 2;
    tips.push("Reduce sugary drinks — they feed cavity-causing bacteria.");
  } else if (d.sugaryDrinks === "1-2") {
    adj += 1;
  }
  if (d.smoking === "yes") {
    adj += 4;
    tips.push(
      "Quitting smoking is the single biggest improvement for oral health."
    );
  }
  if (d.alcohol === "frequently") {
    adj += 2;
    tips.push(
      "Frequent alcohol use causes dry mouth and increases decay risk."
    );
  } else if (d.alcohol === "occasionally") {
    adj += 1;
  }
  if (d.lastVisit === "within6mo") {
    adj -= 2;
  } else if (d.lastVisit === "6-12mo") {
    adj -= 1;
  } else if (d.lastVisit === "1-2yr") {
    adj += 1;
    tips.push("Book a dental check-up — aim for every 6 months.");
  } else if (d.lastVisit === "2yr+") {
    adj += 3;
    tips.push(
      "You're overdue for a dental visit. Untreated issues worsen quickly."
    );
  }
  if (d.hadCavities === "yes") adj += 1;
  if (d.gumDisease === "yes") {
    adj += 2;
    tips.push("Treat existing gum disease — it can accelerate tooth loss.");
  }
  if (d.sensitivity === "yes") {
    adj += 1;
    tips.push(
      "Sensitivity may indicate enamel erosion — use a sensitive toothpaste."
    );
  }
  if (d.bleedingGums === "yes") {
    adj += 1;
    tips.push(
      "Bleeding gums signal early gum disease — improve flossing immediately."
    );
  }
  if (d.discoloration === "yes") adj += 1;
  const clampedAdj = Math.max(-5, Math.min(10, adj));
  const dentalAge = Math.round(d.age + clampedAdj);
  if (tips.length === 0) {
    tips.push("Excellent habits! Keep brushing twice daily and flossing.");
    tips.push("Continue visiting your dentist every 6 months.");
    tips.push("Run an AI scan every 3 months to catch early changes.");
  }
  return { dentalAge, delta: clampedAdj, tips };
}
function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  ocidPrefix
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        className: "block text-sm font-semibold text-foreground mb-2",
        htmlFor: name,
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(name, opt.value),
        className: "px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:scale-[1.02]",
        style: {
          background: value === opt.value ? "oklch(0.78 0.16 80 / 0.18)" : "oklch(0.10 0.006 70 / 0.7)",
          borderColor: value === opt.value ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60 / 0.6)",
          color: value === opt.value ? "oklch(0.88 0.18 85)" : "oklch(0.85 0.01 80)"
        },
        "data-ocid": `${ocidPrefix}.${opt.value}`,
        children: [
          value === opt.value && "✓ ",
          opt.label
        ]
      },
      opt.value
    )) })
  ] });
}
const STEP_LABELS = [
  "Basic Info",
  "Flossing & Mouthwash",
  "Diet & Habits",
  "Dental History",
  "Current Symptoms"
];
function DentalAgeCalculatorPage() {
  const [step, setStep] = reactExports.useState(1);
  const [form, setForm] = reactExports.useState(INITIAL);
  const [result, setResult] = reactExports.useState(
    null
  );
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const stepValid = () => {
    if (step === 1) return form.age > 0 && form.brushFreq !== "";
    if (step === 2) return form.flossFreq !== "" && form.mouthwash !== "";
    if (step === 3)
      return form.sugaryDrinks !== "" && form.smoking !== "" && form.alcohol !== "";
    if (step === 4)
      return form.lastVisit !== "" && form.hadCavities !== "" && form.gumDisease !== "";
    if (step === 5)
      return form.sensitivity !== "" && form.bleedingGums !== "" && form.discoloration !== "";
    return true;
  };
  const handleNext = () => {
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      setResult(calcDentalAge(form));
    }
  };
  const reset = () => {
    setStep(1);
    setForm(INITIAL);
    setResult(null);
  };
  const shareText = result ? `My dental age is ${result.dentalAge} years (chronological: ${form.age})! Check yours on DantaNova: https://dentaai-scanner-n0h.caffeine.xyz/dental-age` : "";
  const deltaColor = !result ? "oklch(0.88 0.18 85)" : result.delta <= 0 ? "oklch(0.72 0.17 150)" : result.delta <= 5 ? "oklch(0.88 0.18 85)" : "oklch(0.65 0.22 25)";
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
                  "data-ocid": "dental-age.home_link",
                  children: "DantaNova"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/scan",
                  className: "text-sm text-muted-foreground hover:text-primary transition-colors",
                  "data-ocid": "dental-age.scan_link",
                  children: "Free Scan →"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-2xl mx-auto px-4 py-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
              className: "text-center mb-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border",
                    style: {
                      background: "oklch(0.78 0.16 80 / 0.12)",
                      borderColor: "oklch(0.88 0.18 85 / 0.3)",
                      color: "oklch(0.88 0.18 85)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3.5 h-3.5" }),
                      "Free · 5 Steps · Results Instant"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-3xl md:text-4xl font-extrabold mb-3",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "Dental Age Calculator"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mx-auto", children: "Estimate your dental biological age based on your oral health habits and symptoms" })
              ]
            }
          ),
          result ? (
            /* ── Result screen ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.5 },
                "data-ocid": "dental-age.result_section",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "p-8 rounded-2xl border text-center mb-6",
                      style: {
                        background: "oklch(0.12 0.008 60 / 0.9)",
                        borderColor: `${deltaColor} / 0.4`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Your Dental Age is approximately" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            initial: { scale: 0.5, opacity: 0 },
                            animate: { scale: 1, opacity: 1 },
                            transition: { type: "spring", stiffness: 120 },
                            className: "text-8xl font-extrabold mb-2",
                            style: { color: deltaColor },
                            "data-ocid": "dental-age.result_number",
                            children: result.dentalAge
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground mb-4", children: "years old" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex items-center justify-center gap-3 p-4 rounded-xl mb-4",
                            style: { background: "oklch(0.10 0.006 70 / 0.6)" },
                            children: [
                              result.delta <= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                TrendingDown,
                                {
                                  className: "w-5 h-5",
                                  style: { color: "oklch(0.72 0.17 150)" }
                                }
                              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                TrendingUp,
                                {
                                  className: "w-5 h-5",
                                  style: { color: deltaColor }
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: result.delta === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.72 0.17 150)" }, children: "Your dental age matches your chronological age — great!" }) : result.delta < 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.72 0.17 150)" }, children: [
                                "Your dental health is",
                                " ",
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                                  Math.abs(result.delta),
                                  " years younger"
                                ] }),
                                " ",
                                "than your chronological age!"
                              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: deltaColor }, children: [
                                "Your dental health is",
                                " ",
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                                  result.delta,
                                  " years older"
                                ] }),
                                " than your chronological age."
                              ] }) })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          "Chronological age: ",
                          form.age,
                          " years"
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "p-6 rounded-2xl border border-border/40 mb-6",
                      style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                      "data-ocid": "dental-age.tips_section",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-foreground mb-4", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "✶" }),
                          " ",
                          "Personalised Improvement Tips"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: result.tips.map((tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "li",
                          {
                            className: "flex items-start gap-2.5 text-sm text-foreground/85",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                CircleCheckBig,
                                {
                                  className: "w-4 h-4 mt-0.5 flex-shrink-0",
                                  style: { color: "oklch(0.88 0.18 85)" }
                                }
                              ),
                              tip
                            ]
                          },
                          tip
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/scan",
                        className: "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105",
                        style: {
                          background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                          color: "oklch(0.08 0.005 60)"
                        },
                        "data-ocid": "dental-age.scan_cta_button",
                        children: [
                          "Improve Your Dental Age",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: reset,
                        className: "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border border-border/50 transition-all hover:scale-105",
                        style: {
                          background: "oklch(0.12 0.008 60 / 0.8)",
                          color: "oklch(0.88 0.18 85)"
                        },
                        "data-ocid": "dental-age.retake_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
                          "Recalculate"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-all",
                        "data-ocid": "dental-age.twitter_share",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                          "Share on X"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-all",
                        "data-ocid": "dental-age.whatsapp_share",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                          "Share on WhatsApp"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ) : (
            /* ── Multi-step form ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", "data-ocid": "dental-age.progress_bar", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Step ",
                    step,
                    " of 5 — ",
                    STEP_LABELS[step - 1]
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    Math.round((step - 1) / 5 * 100),
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
                        animate: { width: `${(step - 1) / 5 * 100}%` },
                        transition: { duration: 0.4 }
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: 30 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -30 },
                  transition: { duration: 0.3 },
                  className: "p-6 rounded-2xl border border-border/40 mb-6",
                  style: { background: "oklch(0.12 0.008 60 / 0.9)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg text-foreground mb-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.88 0.18 85)" }, children: [
                        "Step ",
                        step,
                        "."
                      ] }),
                      " ",
                      STEP_LABELS[step - 1]
                    ] }),
                    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental-age.step1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "chrono-age",
                            className: "block text-sm font-semibold text-foreground mb-2",
                            children: "Your chronological age (years)"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "chrono-age",
                            type: "number",
                            min: 5,
                            max: 120,
                            value: form.age,
                            onChange: (e) => set("age", Math.max(1, Number(e.target.value))),
                            className: "w-28 px-4 py-2.5 rounded-xl border text-foreground text-center text-xl font-bold focus:outline-none",
                            style: {
                              background: "oklch(0.10 0.006 70 / 0.8)",
                              borderColor: "oklch(0.88 0.18 85 / 0.5)",
                              color: "oklch(0.88 0.18 85)"
                            },
                            "data-ocid": "dental-age.age_input"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "How often do you brush?",
                          name: "brushFreq",
                          value: form.brushFreq,
                          onChange: set,
                          ocidPrefix: "dental-age.brush",
                          options: [
                            { label: "3x+ daily", value: "3x" },
                            { label: "1–2x daily", value: "1-2x" },
                            { label: "Less than once", value: "less" }
                          ]
                        }
                      )
                    ] }),
                    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental-age.step2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "How often do you floss?",
                          name: "flossFreq",
                          value: form.flossFreq,
                          onChange: set,
                          ocidPrefix: "dental-age.floss",
                          options: [
                            { label: "Daily", value: "daily" },
                            { label: "Weekly", value: "weekly" },
                            { label: "Rarely", value: "rarely" },
                            { label: "Never", value: "never" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Do you use mouthwash?",
                          name: "mouthwash",
                          value: form.mouthwash,
                          onChange: set,
                          ocidPrefix: "dental-age.mouthwash",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      )
                    ] }),
                    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental-age.step3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Sugary drinks per day",
                          name: "sugaryDrinks",
                          value: form.sugaryDrinks,
                          onChange: set,
                          ocidPrefix: "dental-age.sugary",
                          options: [
                            { label: "0", value: "0" },
                            { label: "1–2", value: "1-2" },
                            { label: "3+", value: "3+" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Do you smoke or vape?",
                          name: "smoking",
                          value: form.smoking,
                          onChange: set,
                          ocidPrefix: "dental-age.smoking",
                          options: [
                            { label: "No", value: "no" },
                            { label: "Yes", value: "yes" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Alcohol consumption",
                          name: "alcohol",
                          value: form.alcohol,
                          onChange: set,
                          ocidPrefix: "dental-age.alcohol",
                          options: [
                            { label: "Rarely", value: "rarely" },
                            { label: "Occasionally", value: "occasionally" },
                            { label: "Frequently", value: "frequently" }
                          ]
                        }
                      )
                    ] }),
                    step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental-age.step4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Last dentist visit",
                          name: "lastVisit",
                          value: form.lastVisit,
                          onChange: set,
                          ocidPrefix: "dental-age.visit",
                          options: [
                            { label: "Within 6 months", value: "within6mo" },
                            { label: "6–12 months", value: "6-12mo" },
                            { label: "1–2 years", value: "1-2yr" },
                            { label: "2+ years", value: "2yr+" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Had cavities before?",
                          name: "hadCavities",
                          value: form.hadCavities,
                          onChange: set,
                          ocidPrefix: "dental-age.cavities",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Diagnosed with gum disease?",
                          name: "gumDisease",
                          value: form.gumDisease,
                          onChange: set,
                          ocidPrefix: "dental-age.gum",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      )
                    ] }),
                    step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dental-age.step5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Do you experience tooth sensitivity?",
                          name: "sensitivity",
                          value: form.sensitivity,
                          onChange: set,
                          ocidPrefix: "dental-age.sensitivity",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Do your gums bleed when brushing?",
                          name: "bleedingGums",
                          value: form.bleedingGums,
                          onChange: set,
                          ocidPrefix: "dental-age.bleeding",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RadioGroup,
                        {
                          label: "Visible tooth discolouration?",
                          name: "discoloration",
                          value: form.discoloration,
                          onChange: set,
                          ocidPrefix: "dental-age.discolour",
                          options: [
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" }
                          ]
                        }
                      )
                    ] })
                  ]
                },
                step
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setStep((s) => Math.max(1, s - 1)),
                    disabled: step === 1,
                    className: "flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                    "data-ocid": "dental-age.prev_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                      " Back"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleNext,
                    disabled: !stepValid(),
                    className: "flex items-center gap-2 px-7 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                      color: "oklch(0.08 0.005 60)"
                    },
                    "data-ocid": "dental-age.next_button",
                    children: [
                      step === 5 ? "Calculate My Dental Age" : "Next",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              ] })
            ] })
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "mt-16",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleHelp,
                    {
                      className: "w-5 h-5",
                      style: { color: "oklch(0.88 0.18 85)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "What does dental age mean?" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-6 rounded-2xl border border-border/40",
                    style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: [
                        "Your ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "dental age" }),
                        " is an estimate of how old your teeth and gums appear to be based on your habits and symptoms — regardless of how old you actually are."
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: "Someone who is 30 years old but smokes, never flosses, and hasn't seen a dentist in 3 years may have the dental health profile of a 45-year-old. Conversely, someone with excellent habits may have the teeth of someone 5–10 years younger." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: [
                        "Daily flossing is the single biggest predictor of good dental age",
                        "Regular check-ups prevent small issues from becoming expensive ones",
                        "Diet choices have a major impact — sugar feeds cavity bacteria",
                        "Smoking is the highest-risk factor for accelerated dental ageing"
                      ].map((fact) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex items-start gap-2 text-foreground/80",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "→" }),
                            fact
                          ]
                        },
                        fact
                      )) })
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
  DentalAgeCalculatorPage as default
};
