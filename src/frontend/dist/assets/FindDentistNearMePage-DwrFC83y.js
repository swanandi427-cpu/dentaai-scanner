import { r as reactExports, j as jsxRuntimeExports, L as Link, l as ArrowLeft, M as MapPin, s as Search } from "./index-D1mTBV0L.js";
const dentists = [
  {
    name: "Dr. Priya Sharma",
    specialty: "General & Cosmetic",
    location: "Bandra, Mumbai",
    dist: "1.2 km",
    rating: 4.9
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Emergency Dental Care",
    location: "Andheri, Mumbai",
    dist: "2.8 km",
    rating: 4.8
  },
  {
    name: "Dr. Kavya Nair",
    specialty: "Orthodontics",
    location: "Powai, Mumbai",
    dist: "4.1 km",
    rating: 4.7
  },
  {
    name: "Dr. Rohan Gupta",
    specialty: "Oral Surgery",
    location: "Dadar, Mumbai",
    dist: "5.5 km",
    rating: 4.6
  }
];
function FindDentistNearMePage() {
  const [query, setQuery] = reactExports.useState("");
  const filtered = dentists.filter(
    (d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.location.toLowerCase().includes(query.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/find-dentist",
          className: "flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Dentist Finder" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm flex-1 text-center", children: "Near Me" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "main",
      {
        id: "main-content",
        className: "flex-1 max-w-xl mx-auto w-full px-4 py-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-gradient-gold", children: "Dentists Near You" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Showing dentists sorted by proximity. Enable location for real-time results." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search by name or area…",
                className: "w-full pl-9 pr-4 py-2.5 rounded-full text-sm bg-card border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50",
                "data-ocid": "find_near_me.search_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: filtered.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-2xl p-4 border border-border/20 flex items-start gap-3",
              "data-ocid": `find_near_me.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg",
                    style: {
                      background: "oklch(0.78 0.16 80 / 0.1)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)"
                    },
                    children: "🦷"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: d.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: d.specialty }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-primary/60" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      d.location,
                      " · ",
                      d.dist
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs font-bold",
                      style: { color: "oklch(0.88 0.18 85)" },
                      children: [
                        d.rating,
                        " ★"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/book",
                      className: "text-xs text-primary hover:underline",
                      "data-ocid": "find_near_me.book_link",
                      children: "Book"
                    }
                  )
                ] })
              ]
            },
            d.name
          )) })
        ]
      }
    )
  ] });
}
export {
  FindDentistNearMePage as default
};
