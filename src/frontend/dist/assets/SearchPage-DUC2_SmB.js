import { r as reactExports, j as jsxRuntimeExports, L as Link, l as ArrowLeft, s as Search } from "./index-D1mTBV0L.js";
const allResults = [
  {
    type: "page",
    title: "Start a Dental Scan",
    desc: "AI-powered oral health scan",
    href: "/scan"
  },
  {
    type: "page",
    title: "Find a Dentist",
    desc: "Search verified dentists near you",
    href: "/find-dentist"
  },
  {
    type: "page",
    title: "Dental Passport",
    desc: "Your portable dental record",
    href: "/passport"
  },
  {
    type: "blog",
    title: "Can AI Detect Cavities?",
    desc: "Blog article &middot; April 2026",
    href: "/blog/can-ai-detect-cavities"
  },
  {
    type: "blog",
    title: "10 Oral Health Tips for 2026",
    desc: "Blog article &middot; March 2026",
    href: "/blog/oral-health-tips"
  },
  {
    type: "tool",
    title: "2-Minute Brush Timer",
    desc: "Interactive brushing guide",
    href: "/brush-timer"
  },
  {
    type: "tool",
    title: "Dental Risk Quiz",
    desc: "10-question oral health assessment",
    href: "/risk-quiz"
  },
  {
    type: "page",
    title: "Pricing",
    desc: "Dentist subscription tiers",
    href: "/pricing"
  },
  {
    type: "page",
    title: "Book Appointment",
    desc: "Request a dentist appointment",
    href: "/book"
  }
];
function SearchPage() {
  const [query, setQuery] = reactExports.useState("");
  const results = query.length > 1 ? allResults.filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.desc.toLowerCase().includes(query.toLowerCase())
  ) : [];
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm flex-1 text-center", children: "Search" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "main",
      {
        id: "main-content",
        className: "flex-1 max-w-xl mx-auto w-full px-4 py-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search DantaNova…",
                className: "w-full pl-9 pr-4 py-3 rounded-full text-sm bg-card border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50",
                "data-ocid": "search.input"
              }
            )
          ] }),
          query.length > 1 && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground py-8", children: [
            "No results found for “",
            query,
            "”"
          ] }),
          results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: results.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: r.href,
              className: "glass-card rounded-xl p-4 border border-border/20 hover:border-primary/40 transition-all flex items-start gap-3",
              "data-ocid": `search.result.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg mt-0.5", children: r.type === "blog" ? "📖" : r.type === "tool" ? "🔧" : "📄" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: r.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: r.desc })
                ] })
              ]
            },
            r.href
          )) }),
          query.length <= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 uppercase tracking-wide", children: "Popular" }),
            allResults.slice(0, 5).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: r.href,
                className: "glass-card rounded-xl p-3 border border-border/20 hover:border-primary/40 transition-all text-sm flex items-center gap-2",
                "data-ocid": `search.popular.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                  r.title
                ]
              },
              r.href
            ))
          ] })
        ]
      }
    )
  ] });
}
export {
  SearchPage as default
};
