import { c as createLucideIcon, x as useNavigate, r as reactExports, j as jsxRuntimeExports, y as Button, l as ArrowLeft, z as LogoCircle, A as AnimatePresence, m as motion, D as Check, E as Copy, k as Share2, o as Star, H as Users, L as Link, J as ue, K as Badge } from "./index-D1mTBV0L.js";
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
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1", key: "bkv52" }],
  ["path", { d: "M12 8v13", key: "1c76mn" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7", key: "6wjy6b" }],
  [
    "path",
    {
      d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
      key: "1ihvrl"
    }
  ]
];
const Gift = createLucideIcon("gift", __iconNode);
const LIVE_URL = "https://dentaai-scanner-n0h.caffeine.xyz";
const CODE_KEY = "dantanova-referral-code";
const INVITES_KEY = "dantanova-invites-sent";
function getOrCreateCode() {
  const stored = localStorage.getItem(CODE_KEY);
  if (stored) return stored;
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  localStorage.setItem(CODE_KEY, code);
  return code;
}
function getInviteCount() {
  return Number(localStorage.getItem(INVITES_KEY) ?? "0");
}
function incrementInvites() {
  const current = getInviteCount();
  localStorage.setItem(INVITES_KEY, String(current + 1));
  return current + 1;
}
function StatusBadge({ invites }) {
  const tier = invites >= 10 ? {
    label: "Gold",
    color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    icon: "🥇"
  } : invites >= 3 ? {
    label: "Silver",
    color: "text-slate-300 border-slate-400/40 bg-slate-400/10",
    icon: "🥈"
  } : {
    label: "Bronze",
    color: "text-orange-400 border-orange-500/40 bg-orange-500/10",
    icon: "🥉"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      variant: "outline",
      className: `rounded-full text-sm px-3 py-1 ${tier.color}`,
      children: [
        tier.icon,
        " ",
        tier.label
      ]
    }
  );
}
function ReferralPage() {
  const navigate = useNavigate();
  const [code] = reactExports.useState(getOrCreateCode);
  const [copied, setCopied] = reactExports.useState(false);
  const [invitesSent, setInvitesSent] = reactExports.useState(getInviteCount);
  const [referredBy, setReferredBy] = reactExports.useState(null);
  const inviteLink = `${LIVE_URL}/?ref=${code}`;
  const successfulSignups = invitesSent > 0 ? 1 : 0;
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      localStorage.setItem("dantanova-referred-by", refCode);
      setReferredBy(refCode);
    } else {
      const stored = localStorage.getItem("dantanova-referred-by");
      if (stored) setReferredBy(stored);
    }
  }, []);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      ue.success("Invite link copied!", {
        description: "Share it with your friends."
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      ue.error("Could not copy", {
        description: "Please copy the link manually."
      });
    }
  };
  const handleShare = (platform) => {
    const newCount = incrementInvites();
    setInvitesSent(newCount);
    const msg = encodeURIComponent(
      `Hey! I use DantaNova for free AI dental scans — it detects cavities in 30 seconds! Try it free: ${inviteLink}`
    );
    const tweetMsg = encodeURIComponent(
      `Just did an AI dental scan with DantaNova — detected issues in 30 seconds! Try it free: ${inviteLink} #DentalHealth #AI`
    );
    const url = platform === "whatsapp" ? `https://wa.me/?text=${msg}` : `https://twitter.com/intent/tweet?text=${tweetMsg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const steps = [
    {
      icon: Copy,
      title: "Copy Your Unique Invite Link",
      desc: "Every user gets a unique code. Copy your link above and share it anywhere.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: Share2,
      title: "Share via WhatsApp or Social Media",
      desc: "Send to friends, family, or post on social media to spread healthier smiles.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10"
    },
    {
      icon: Gift,
      title: "You Both Get Dental Credit Points",
      desc: "When they complete their first scan, you both unlock dental credit points and badges.",
      color: "text-green-400",
      bg: "bg-green-500/10"
    }
  ];
  const benefits = [
    {
      icon: Star,
      text: "Your referral gets early access to premium scan features"
    },
    {
      icon: Award,
      text: "You earn a priority badge displayed on your profile"
    },
    {
      icon: Users,
      text: "Unlock Gold status at 10 referrals for advanced analytics"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm sticky top-0 z-30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/" }),
          "aria-label": "Go back",
          className: "rounded-full hover:bg-primary/10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogoCircle, { size: "sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-lg text-gradient-gold", children: "Invite Friends to DantaNova" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hud-telemetry text-[10px] text-muted-foreground", children: "SPREAD HEALTHIER SMILES" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { invites: invitesSent })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4 py-6 max-w-2xl mx-auto w-full flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: referredBy && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0 },
          className: "flex items-start gap-3 p-4 rounded-3xl",
          style: {
            background: "oklch(0.72 0.17 150 / 0.1)",
            border: "1px solid oklch(0.72 0.17 150 / 0.3)"
          },
          "data-ocid": "referral.referred_banner",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🎉" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "You were invited by a friend!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Your dental journey starts here. Try your first free scan — results in 30 seconds." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "mt-3 rounded-full px-5 glow-primary shimmer-button text-xs",
                  onClick: () => navigate({ to: "/scan" }),
                  "data-ocid": "referral.scan_cta_button",
                  children: "Start Free Scan"
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          className: "glass-card rounded-3xl p-6 card-glow-border text-center",
          "data-ocid": "referral.invite_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "circle-icon w-20 h-20 mx-auto mb-4 animate-ring-pulse",
                style: {
                  background: "oklch(0.78 0.16 80 / 0.1)",
                  border: "2px solid oklch(0.78 0.16 80 / 0.4)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "w-9 h-9 text-primary" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-gradient-gold mb-2", children: "Invite Friends, Earn Dental Credits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto mb-5", children: "Spread healthier smiles. Share your invite link and help others scan their teeth for free." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 p-3 rounded-2xl mb-4 text-left",
                style: {
                  background: "oklch(0.12 0.008 60)",
                  border: "1px solid oklch(0.78 0.16 80 / 0.25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-xs font-mono text-primary truncate min-w-0", children: inviteLink }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleCopy,
                      className: "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                      style: {
                        background: copied ? "oklch(0.72 0.17 150 / 0.2)" : "oklch(0.78 0.16 80 / 0.15)",
                        border: `1px solid ${copied ? "oklch(0.72 0.17 150 / 0.4)" : "oklch(0.78 0.16 80 / 0.35)"}`,
                        color: copied ? "oklch(0.72 0.17 150)" : "oklch(0.78 0.16 80)"
                      },
                      "aria-label": "Copy invite link",
                      "data-ocid": "referral.copy_button",
                      children: [
                        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
                        copied ? "Copied!" : "Copy"
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleShare("whatsapp"),
                  className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all",
                  style: {
                    background: "oklch(0.55 0.18 145 / 0.15)",
                    border: "1px solid oklch(0.55 0.18 145 / 0.35)",
                    color: "oklch(0.72 0.17 150)"
                  },
                  "data-ocid": "referral.whatsapp_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "💬" }),
                    " WhatsApp"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleShare("twitter"),
                  className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all",
                  style: {
                    background: "oklch(0.55 0.12 250 / 0.15)",
                    border: "1px solid oklch(0.55 0.12 250 / 0.35)",
                    color: "oklch(0.72 0.14 250)"
                  },
                  "data-ocid": "referral.twitter_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: "𝕏" }),
                    " Twitter / X"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "grid grid-cols-3 gap-3",
          "data-ocid": "referral.stats_panel",
          children: [
            {
              value: invitesSent,
              label: "Invites Sent",
              color: "text-primary"
            },
            {
              value: successfulSignups,
              label: "Signed Up",
              color: "text-green-400"
            },
            {
              value: invitesSent >= 10 ? "Gold" : invitesSent >= 3 ? "Silver" : "Bronze",
              label: "Your Status",
              color: invitesSent >= 10 ? "text-yellow-400" : invitesSent >= 3 ? "text-slate-300" : "text-orange-400"
            }
          ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-3xl p-4 text-center card-glow-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-2xl font-bold ${s.color}`, children: s.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.label })
              ]
            },
            s.label
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 },
          className: "glass-card rounded-3xl p-5 card-glow-border",
          "data-ocid": "referral.how_it_works_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-gradient-gold mb-4", children: "How It Works" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: steps.map((step, i) => {
              const Icon = step.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -12 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.2 + i * 0.1 },
                  className: "flex items-start gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${step.bg}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${step.color}` })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud-telemetry text-[9px] text-muted-foreground", children: [
                        "STEP ",
                        i + 1
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: step.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: step.desc })
                    ] })
                  ]
                },
                step.title
              );
            }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.25 },
          className: "glass-card rounded-3xl p-5 card-glow-border",
          "data-ocid": "referral.benefits_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base text-gradient-gold mb-4", children: "Referral Benefits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: benefits.map((b) => {
              const Icon = b.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: b.text })
              ] }, b.text);
            }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          className: "glass-card rounded-3xl p-5 card-glow-border text-center",
          "data-ocid": "referral.code_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground hud-telemetry mb-2", children: "YOUR REFERRAL CODE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-3xl font-bold text-gradient-gold tracking-widest mb-3", children: code }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleCopy,
                size: "sm",
                className: "rounded-full px-6 glow-primary shimmer-button",
                "data-ocid": "referral.primary_button",
                children: [
                  copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 mr-1.5" }),
                  copied ? "Copied!" : "Copy Full Link"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "py-6 text-center text-xs text-muted-foreground border-t border-border/30 bg-card/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " DantaNova ·",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "text-primary hover:underline", children: "Privacy Policy" }),
        " · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "text-primary hover:underline", children: "Terms of Service" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: "Developed by Swanandi Manoj Vispute" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "mailto:DANTANOVA.14@gmail.com",
          className: "text-yellow-400 hover:text-yellow-300",
          children: "DANTANOVA.14@gmail.com"
        }
      ) })
    ] })
  ] });
}
export {
  ReferralPage as default
};
