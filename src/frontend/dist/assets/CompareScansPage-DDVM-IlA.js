import { j as jsxRuntimeExports, L as Link, l as ArrowLeft } from "./index-D1mTBV0L.js";
function CompareScansPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/history",
          className: "flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "History" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm flex-1 text-center", children: "Compare Scans" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "main",
      {
        id: "main-content",
        className: "flex-1 max-w-2xl mx-auto w-full px-4 py-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-gradient-gold mb-2", children: "Side-by-Side Scan Comparison" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: "Select two scan dates from your history to compare your oral health over time." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: ["Scan A", "Scan B"].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-2xl p-6 flex flex-col items-center gap-3 border border-border/20 min-h-48",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                    style: {
                      background: "oklch(0.78 0.16 80 / 0.1)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)"
                    },
                    children: "🦷"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/history",
                    className: "text-xs text-primary hover:underline mt-auto",
                    "data-ocid": "compare.select_link",
                    children: "Select from history →"
                  }
                )
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 glass-card rounded-2xl p-6 border border-border/20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Complete at least 2 scans to enable comparison. Visit",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/scan", className: "text-primary hover:underline", children: "Start Scan" }),
            " ",
            "to begin."
          ] }) })
        ]
      }
    )
  ] });
}
export {
  CompareScansPage as default
};
