import { c as createLucideIcon, j as jsxRuntimeExports, L as Link, m as motion, s as Search, F as FileText, a as Clock, g as Calendar, U as User, d as Shield, S as Stethoscope, G as Globe, Q as QrCode, B as BookOpen, u as ChartNoAxesColumn, t as Briefcase, v as MessageSquare, f as ChevronRight } from "./index-D1mTBV0L.js";
import { S as Smile } from "./smile-DhKAJgXN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }],
  ["path", { d: "M14 4h7", key: "3xa0d5" }],
  ["path", { d: "M14 9h7", key: "1icrd9" }],
  ["path", { d: "M14 15h7", key: "1mj8o2" }],
  ["path", { d: "M14 20h7", key: "11slyb" }]
];
const LayoutList = createLucideIcon("layout-list", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
const sections = [
  {
    title: "For Patients",
    sectionIcon: Smile,
    links: [
      { path: "/", label: "Home", desc: "DantaNova landing page", icon: House },
      {
        path: "/scan",
        label: "Start a Scan",
        desc: "5-step AI dental scan wizard",
        icon: Search
      },
      {
        path: "/results",
        label: "Scan Results",
        desc: "View your latest AI analysis",
        icon: FileText
      },
      {
        path: "/history",
        label: "Scan History",
        desc: "All your previous scans",
        icon: Clock
      },
      {
        path: "/my-bookings",
        label: "My Bookings",
        desc: "Appointments you have requested",
        icon: Calendar
      },
      {
        path: "/profile",
        label: "My Profile",
        desc: "Account details and settings",
        icon: User
      },
      {
        path: "/risk-quiz",
        label: "Risk Quiz",
        desc: "10-question dental health assessment",
        icon: Shield
      },
      {
        path: "/brush-timer",
        label: "Brushing Timer",
        desc: "2-minute guided brushing coach",
        icon: Clock
      }
    ]
  },
  {
    title: "For Dentists",
    sectionIcon: Stethoscope,
    links: [
      {
        path: "/find-dentist",
        label: "Find a Dentist",
        desc: "Browse and book emergency dentists",
        icon: Search
      },
      {
        path: "/dentist-register",
        label: "Dentist Registration",
        desc: "Join the DantaNova network",
        icon: User
      },
      {
        path: "/dentist-dashboard",
        label: "Dentist Dashboard",
        desc: "Manage bookings and availability",
        icon: LayoutDashboard
      },
      {
        path: "/book",
        label: "Book an Appointment",
        desc: "Request an appointment by email code",
        icon: Calendar
      }
    ]
  },
  {
    title: "Tools & Features",
    sectionIcon: Settings,
    links: [
      {
        path: "/passport",
        label: "Dental Passport",
        desc: "View and manage your dental passport",
        icon: Globe
      },
      {
        path: "/issue-passport",
        label: "Issue Passport",
        desc: "Create a dental passport record",
        icon: FileText
      },
      {
        path: "/passport-lookup",
        label: "Passport Lookup",
        desc: "Look up a patient’s dental passport",
        icon: Search
      },
      {
        path: "/demo",
        label: "Animated Demo",
        desc: "See DantaNova in action",
        icon: Smile
      },
      {
        path: "/qr",
        label: "QR Code",
        desc: "Share DantaNova via QR code",
        icon: QrCode
      },
      {
        path: "/blog",
        label: "Blog",
        desc: "Dental health articles and insights",
        icon: BookOpen
      },
      {
        path: "/changelog",
        label: "What’s New",
        desc: "Full release history and coming soon",
        icon: Clock
      },
      {
        path: "/sitemap",
        label: "Sitemap",
        desc: "All pages in one place",
        icon: LayoutList
      }
    ]
  },
  {
    title: "Business",
    sectionIcon: Briefcase,
    links: [
      {
        path: "/pricing",
        label: "Pricing",
        desc: "Dentist subscription tiers",
        icon: ChartNoAxesColumn
      },
      {
        path: "/corporate-plan",
        label: "Corporate Plan",
        desc: "Dental plans for companies",
        icon: Briefcase
      },
      {
        path: "/pitch",
        label: "Investor Pitch",
        desc: "Y Combinator-style pitch page",
        icon: FileText
      }
    ]
  },
  {
    title: "Legal",
    sectionIcon: Shield,
    links: [
      {
        path: "/privacy",
        label: "Privacy Policy",
        desc: "How we handle your data",
        icon: Shield
      },
      {
        path: "/terms",
        label: "Terms of Service",
        desc: "Platform terms and conditions",
        icon: FileText
      }
    ]
  },
  {
    title: "Admin & Dashboards",
    sectionIcon: LayoutDashboard,
    links: [
      {
        path: "/marketing-dashboard",
        label: "Marketing Dashboard",
        desc: "Traffic and CTA analytics",
        icon: ChartNoAxesColumn
      },
      {
        path: "/operations-dashboard",
        label: "Operations Dashboard",
        desc: "System health and workflows",
        icon: Settings
      },
      {
        path: "/support-dashboard",
        label: "Support Dashboard",
        desc: "Tickets and satisfaction scores",
        icon: MessageSquare
      },
      {
        path: "/ui-test",
        label: "UI Test Panel",
        desc: "Debug and design showcase",
        icon: Settings
      }
    ]
  }
];
function SitemapPage() {
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
                  className: "text-base font-bold",
                  style: { color: "oklch(0.88 0.18 85)" },
                  "data-ocid": "sitemap.home_link",
                  children: "DantaNova"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/scan",
                  className: "text-sm text-muted-foreground hover:text-primary transition-colors",
                  "data-ocid": "sitemap.scan_link",
                  children: "Free Scan →"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-4 py-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "w-3.5 h-3.5" }),
                      " All Pages"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-4xl font-extrabold mb-3",
                    style: {
                      background: "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76), oklch(0.95 0.12 90))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "DantaNova Site Map"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Every page on DantaNova, organised for easy navigation." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-8", children: sections.map((section, si) => {
            const SectionIcon = section.sectionIcon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.section,
              {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.4, delay: si * 0.06 },
                className: "p-6 rounded-2xl border border-border/40",
                style: { background: "oklch(0.12 0.008 60 / 0.85)" },
                "data-ocid": `sitemap.section.${si + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2.5 text-base font-bold mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded-lg flex items-center justify-center",
                        style: {
                          background: "oklch(0.78 0.16 80 / 0.14)",
                          border: "1px solid oklch(0.78 0.16 80 / 0.3)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SectionIcon,
                          {
                            className: "w-4 h-4",
                            style: { color: "oklch(0.88 0.18 85)" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.88 0.18 85)" }, children: section.title })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: section.links.map((link, li) => {
                    const LinkIcon = link.icon;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: link.path,
                        className: "flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-border/40 hover:bg-muted/20 transition-all group",
                        "data-ocid": `sitemap.link.${si + 1}.${li + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LinkIcon, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate", children: link.label }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: link.desc })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" })
                        ]
                      }
                    ) }, link.path);
                  }) })
                ]
              },
              section.title
            );
          }) })
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
  SitemapPage as default
};
