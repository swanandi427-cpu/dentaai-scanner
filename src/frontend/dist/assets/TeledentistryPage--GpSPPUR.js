import { c as createLucideIcon, r as reactExports, C as CircleCheckBig, a as Clock, T as TriangleAlert, j as jsxRuntimeExports, L as Link, m as motion, S as Stethoscope, A as AnimatePresence, b as ArrowRight, d as Shield, e as ChevronLeft, f as ChevronRight, I as Info, M as MapPin, g as Calendar } from "./index-D1mTBV0L.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
const SYMPTOMS = [
  "Toothache",
  "Swelling",
  "Bleeding gums",
  "Sensitivity",
  "Cracked tooth",
  "Lost filling",
  "Jaw pain",
  "Bad breath",
  "Loose tooth",
  "Jaw clicking"
];
const DURATION_OPTIONS = [
  { label: "Today", value: 0 },
  { label: "2–3 days", value: 2 },
  { label: "1 week", value: 7 },
  { label: "More than 1 week", value: 10 }
];
const TIPS = [
  {
    icon: Lightbulb,
    title: "Good Lighting",
    desc: "Position yourself near a window or bright lamp. Dentists need to see clearly to assess your condition."
  },
  {
    icon: Shield,
    title: "Clear Photos",
    desc: "Take close-up photos of the affected area before your consultation. Multiple angles help dentists diagnose faster."
  },
  {
    icon: Wifi,
    title: "Stable Internet",
    desc: "A stable Wi-Fi connection ensures uninterrupted communication. Avoid moving to areas with poor signal."
  }
];
function getTriageLevel(pain, durationDays) {
  if (pain >= 7 || durationDays >= 10) return "high";
  if (pain >= 4 || durationDays >= 2) return "medium";
  return "low";
}
const TRIAGE_CONFIG = {
  high: {
    label: "URGENT",
    color: "oklch(0.65 0.22 25)",
    bg: "oklch(0.62 0.22 25 / 0.14)",
    border: "oklch(0.65 0.22 25 / 0.5)",
    icon: TriangleAlert,
    headline: "See a dentist immediately.",
    sub: "Your symptoms suggest a serious condition requiring urgent in-person care.",
    cta: "Find Emergency Dentist",
    ctaLink: "/find-dentist"
  },
  medium: {
    label: "Prompt Attention",
    color: "oklch(0.82 0.18 72)",
    bg: "oklch(0.78 0.16 80 / 0.12)",
    border: "oklch(0.88 0.18 85 / 0.4)",
    icon: Clock,
    headline: "Book within 48 hours.",
    sub: "Your symptoms need attention soon. Book an appointment promptly to prevent worsening.",
    cta: "Book Appointment",
    ctaLink: "/book"
  },
  low: {
    label: "Routine Care",
    color: "oklch(0.72 0.17 150)",
    bg: "oklch(0.42 0.15 145 / 0.12)",
    border: "oklch(0.72 0.17 150 / 0.4)",
    icon: CircleCheckBig,
    headline: "Book a regular appointment.",
    sub: "Your symptoms appear non-urgent. Schedule a routine check-up at your convenience.",
    cta: "Book Appointment",
    ctaLink: "/book"
  }
};
function TeledentistryPage() {
  const [step, setStep] = reactExports.useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [pain, setPain] = reactExports.useState(5);
  const [duration, setDuration] = reactExports.useState(0);
  const triageLevel = getTriageLevel(pain, duration);
  const triageConfig = TRIAGE_CONFIG[triageLevel];
  const TriageIcon = triageConfig.icon;
  const painColor = pain <= 3 ? "oklch(0.72 0.17 150)" : pain <= 6 ? "oklch(0.88 0.18 85)" : "oklch(0.65 0.22 25)";
  const toggleSymptom = (s) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };
  const canProceedStep1 = selectedSymptoms.size > 0;
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/",
                  className: "text-base font-bold",
                  style: { color: "oklch(0.88 0.18 85)" },
                  "data-ocid": "teledentistry.home_link",
                  children: "DantaNova"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/scan",
                  className: "text-sm text-muted-foreground hover:text-primary transition-colors",
                  "data-ocid": "teledentistry.scan_link",
                  children: "Free Scan →"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-3xl mx-auto px-4 py-10", children: [
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "w-3.5 h-3.5" }),
                      "Symptom Triage Tool"
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
                    children: "Teledentistry"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-xl mx-auto", children: "Describe your symptoms and get connected with a verified dentist for a remote consultation" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.2 },
              className: "flex items-center gap-3 p-4 rounded-2xl border mb-8 text-sm",
              style: {
                background: "oklch(0.12 0.008 60 / 0.9)",
                borderColor: "oklch(0.78 0.16 80 / 0.25)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Video,
                  {
                    className: "w-5 h-5 flex-shrink-0",
                    style: { color: "oklch(0.88 0.18 85)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-semibold",
                      style: { color: "oklch(0.88 0.18 85)" },
                      children: "Live video consultations coming soon."
                    }
                  ),
                  " ",
                  "For now, use our triage guide below and book an in-person appointment with a verified dentist."
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", "data-ocid": "teledentistry.progress_bar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: [1, 2, 3, 4].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 flex-1 last:flex-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 transition-all",
                      style: {
                        borderColor: step >= s ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60)",
                        background: step >= s ? "oklch(0.78 0.16 80 / 0.2)" : "transparent",
                        color: step >= s ? "oklch(0.88 0.18 85)" : "oklch(0.55 0.03 70)"
                      },
                      children: step > s ? "✓" : s
                    }
                  ),
                  s < 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "flex-1 h-0.5 rounded-full transition-all",
                      style: {
                        background: step > s ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60)"
                      }
                    }
                  )
                ]
              },
              s
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px] text-muted-foreground px-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Symptoms" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pain level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Result" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -30 },
                transition: { duration: 0.3 },
                className: "p-6 rounded-2xl border border-border/40 mb-6",
                style: { background: "oklch(0.12 0.008 60 / 0.9)" },
                "data-ocid": "teledentistry.symptoms_step",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg text-foreground mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "Step 1." }),
                    " ",
                    "Describe your symptoms"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Select all that apply:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: SYMPTOMS.map((sym) => {
                    const isSelected = selectedSymptoms.has(sym);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleSymptom(sym),
                        className: "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all hover:scale-[1.02]",
                        style: {
                          background: isSelected ? "oklch(0.78 0.16 80 / 0.18)" : "oklch(0.10 0.006 70 / 0.7)",
                          borderColor: isSelected ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60 / 0.6)",
                          color: isSelected ? "oklch(0.88 0.18 85)" : "oklch(0.85 0.01 80)"
                        },
                        "data-ocid": `teledentistry.symptom_${sym.toLowerCase().replace(/ /g, "_")}`,
                        children: [
                          isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border border-current flex-shrink-0" }),
                          sym
                        ]
                      },
                      sym
                    );
                  }) })
                ]
              },
              "step1"
            ),
            step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -30 },
                transition: { duration: 0.3 },
                className: "p-6 rounded-2xl border border-border/40 mb-6",
                style: { background: "oklch(0.12 0.008 60 / 0.9)" },
                "data-ocid": "teledentistry.pain_step",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg text-foreground mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "Step 2." }),
                    " ",
                    "How severe is your pain?"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.div,
                      {
                        initial: { scale: 0.8 },
                        animate: { scale: 1 },
                        className: "text-7xl font-extrabold mb-2 transition-colors",
                        style: { color: painColor },
                        children: pain
                      },
                      pain
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "text-sm font-medium",
                        style: { color: painColor },
                        children: pain <= 3 ? "Mild" : pain <= 6 ? "Moderate" : "Severe"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-2 mb-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "range",
                        min: 1,
                        max: 10,
                        value: pain,
                        onChange: (e) => setPain(Number(e.target.value)),
                        className: "w-full h-3 rounded-full appearance-none cursor-pointer",
                        style: {
                          background: "linear-gradient(90deg, oklch(0.72 0.17 150) 0%, oklch(0.88 0.18 85) 45%, oklch(0.65 0.22 25) 100%)",
                          accentColor: painColor
                        },
                        "data-ocid": "teledentistry.pain_slider",
                        "aria-label": "Pain level 1 to 10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1 — No pain" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 — Moderate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10 — Unbearable" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 text-center text-xs", children: [
                    {
                      range: "1–3",
                      label: "Mild",
                      color: "oklch(0.72 0.17 150)"
                    },
                    {
                      range: "4–6",
                      label: "Moderate",
                      color: "oklch(0.88 0.18 85)"
                    },
                    {
                      range: "7–10",
                      label: "Severe",
                      color: "oklch(0.65 0.22 25)"
                    }
                  ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "p-2 rounded-xl border",
                      style: {
                        borderColor: `${item.color} / 0.3`,
                        background: `${item.color} / 0.1`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold", style: { color: item.color }, children: item.range }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: item.label })
                      ]
                    },
                    item.range
                  )) })
                ]
              },
              "step2"
            ),
            step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -30 },
                transition: { duration: 0.3 },
                className: "p-6 rounded-2xl border border-border/40 mb-6",
                style: { background: "oklch(0.12 0.008 60 / 0.9)" },
                "data-ocid": "teledentistry.duration_step",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-bold text-lg text-foreground mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "Step 3." }),
                    " ",
                    "How long have you had these symptoms?"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: DURATION_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDuration(opt.value),
                      className: "flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium border text-left transition-all hover:scale-[1.02]",
                      style: {
                        background: duration === opt.value ? "oklch(0.78 0.16 80 / 0.18)" : "oklch(0.10 0.006 70 / 0.7)",
                        borderColor: duration === opt.value ? "oklch(0.88 0.18 85)" : "oklch(0.22 0.015 60 / 0.6)",
                        color: duration === opt.value ? "oklch(0.88 0.18 85)" : "oklch(0.85 0.01 80)"
                      },
                      "data-ocid": `teledentistry.duration_${opt.label.toLowerCase().replace(/ /g, "_")}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Clock,
                          {
                            className: "w-4 h-4 flex-shrink-0",
                            style: {
                              color: duration === opt.value ? "oklch(0.88 0.18 85)" : "oklch(0.55 0.03 70)"
                            }
                          }
                        ),
                        opt.label,
                        duration === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheckBig,
                          {
                            className: "w-4 h-4 ml-auto",
                            style: { color: "oklch(0.88 0.18 85)" }
                          }
                        )
                      ]
                    },
                    opt.label
                  )) })
                ]
              },
              "step3"
            ),
            step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.4 },
                "data-ocid": "teledentistry.triage_result",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "p-6 rounded-2xl border mb-6 text-center",
                      style: {
                        background: triageConfig.bg,
                        borderColor: triageConfig.border
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          TriageIcon,
                          {
                            className: "w-10 h-10 mx-auto mb-3",
                            style: { color: triageConfig.color }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "text-2xl font-extrabold mb-1",
                            style: { color: triageConfig.color },
                            children: triageConfig.label
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground mb-1", children: triageConfig.headline }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: triageConfig.sub }),
                        selectedSymptoms.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "rounded-xl p-3 mb-5 text-sm text-left",
                            style: { background: "oklch(0.10 0.006 70 / 0.5)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "p",
                                {
                                  className: "text-xs font-semibold mb-1",
                                  style: { color: "oklch(0.88 0.18 85)" },
                                  children: "Selected symptoms:"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: [...selectedSymptoms].join(" · ") })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: triageConfig.ctaLink,
                              className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105",
                              style: {
                                background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                                color: "oklch(0.08 0.005 60)"
                              },
                              "data-ocid": "teledentistry.cta_primary_button",
                              children: [
                                triageConfig.cta,
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: "/passport",
                              className: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold border border-border/50 transition-all hover:scale-105",
                              style: {
                                background: "oklch(0.12 0.008 60 / 0.8)",
                                color: "oklch(0.88 0.18 85)"
                              },
                              "data-ocid": "teledentistry.passport_button",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                                "View Dental Passport"
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setStep(1);
                        setSelectedSymptoms(/* @__PURE__ */ new Set());
                        setPain(5);
                        setDuration(0);
                      },
                      className: "w-full py-3 rounded-2xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all",
                      "data-ocid": "teledentistry.restart_button",
                      children: "Start over"
                    }
                  )
                ]
              },
              "step4"
            )
          ] }),
          step < 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setStep((s) => Math.max(1, s - 1)),
                disabled: step === 1,
                className: "flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border border-border/40 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                "data-ocid": "teledentistry.prev_button",
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
                onClick: () => setStep((s) => Math.min(4, s + 1)),
                disabled: step === 1 && !canProceedStep1,
                className: "flex items-center gap-2 px-7 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                style: {
                  background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                  color: "oklch(0.08 0.005 60)"
                },
                "data-ocid": "teledentistry.next_button",
                children: [
                  step === 3 ? "See Triage Result" : "Next",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: 0.1 },
              className: "mt-16",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Info,
                    {
                      className: "w-5 h-5 flex-shrink-0",
                      style: { color: "oklch(0.88 0.18 85)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: "What is Teledentistry?" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "p-6 rounded-2xl border border-border/40",
                    style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-4", children: "Teledentistry is the use of technology to deliver dental care, advice, and education at a distance. Through phone calls, video calls, or messaging, verified dentists can assess your symptoms, provide guidance, and determine whether you need in-person care." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: [
                        "Get a professional opinion without leaving home",
                        "Receive urgent triage when clinics are closed",
                        "Ideal for travellers, expats, and rural communities",
                        "Follow up after treatment with your dentist remotely"
                      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "li",
                        {
                          className: "flex items-start gap-2 text-foreground/80",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: "→" }),
                            item
                          ]
                        },
                        item
                      )) })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: 0.15 },
              className: "mt-12",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mb-6", children: "Remote Consultation Tips" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: TIPS.map((tip, i) => {
                  const Icon = tip.icon;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: i * 0.1 },
                      className: "p-5 rounded-2xl border border-border/40",
                      style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                            style: {
                              background: "oklch(0.78 0.16 80 / 0.14)",
                              border: "1px solid oklch(0.88 0.18 85 / 0.2)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Icon,
                              {
                                className: "w-5 h-5",
                                style: { color: "oklch(0.88 0.18 85)" }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground text-sm mb-1", children: tip.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: tip.desc })
                      ]
                    },
                    tip.title
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              className: "mt-12 text-center p-8 rounded-2xl border border-border/40",
              style: { background: "oklch(0.12 0.008 60 / 0.85)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MapPin,
                  {
                    className: "w-8 h-8 mx-auto mb-3",
                    style: { color: "oklch(0.88 0.18 85)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Already scanned? View your AI dental scan results" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/results",
                    className: "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
                      color: "oklch(0.08 0.005 60)"
                    },
                    "data-ocid": "teledentistry.results_cta_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
                      "View Scan Results",
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
  TeledentistryPage as default
};
