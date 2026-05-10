import { j as jsxRuntimeExports, L as Link, l as ArrowLeft } from "./index-D1mTBV0L.js";
const sections = [
  {
    category: "Brushing",
    tips: [
      "Brush for a full 2 minutes, twice daily.",
      "Use a soft-bristle toothbrush.",
      "Replace your brush every 3 months.",
      "Brush your tongue gently to remove bacteria."
    ]
  },
  {
    category: "Flossing",
    tips: [
      "Floss once daily, ideally before bed.",
      "Use 18 inches of floss per session.",
      "Curve the floss around each tooth's base.",
      "Consider a water flosser for braces."
    ]
  },
  {
    category: "Diet",
    tips: [
      "Limit sugary and acidic beverages.",
      "Drink water after meals to rinse teeth.",
      "Eat calcium-rich foods for strong enamel.",
      "Chew sugar-free gum to stimulate saliva."
    ]
  },
  {
    category: "Habits",
    tips: [
      "Never use your teeth as tools.",
      "Wear a mouthguard during contact sports.",
      "Quit smoking to prevent gum disease.",
      "Stay hydrated — dry mouth promotes decay."
    ]
  },
  {
    category: "Appointments",
    tips: [
      "Visit your dentist at least once a year.",
      "Get a professional clean every 6 months.",
      "Book emergency care promptly for tooth pain.",
      "Use DantaNova for monthly AI check-ups."
    ]
  }
];
function TipsArchivePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Home" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm flex-1 text-center", children: "Dental Tips" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "main",
      {
        id: "main-content",
        className: "flex-1 max-w-xl mx-auto w-full px-4 py-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-gradient-gold mb-1", children: "Dental Tips Archive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "20 expert-backed tips across 5 categories." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h2",
              {
                className: "font-display font-bold text-sm mb-2",
                style: { color: "oklch(0.88 0.18 85)" },
                children: section.category
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: section.tips.map((tip) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "glass-card rounded-xl px-4 py-3 border border-border/20 text-sm flex items-start gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tip })
                ]
              },
              tip
            )) })
          ] }, section.category)) })
        ]
      }
    )
  ] });
}
export {
  TipsArchivePage as default
};
