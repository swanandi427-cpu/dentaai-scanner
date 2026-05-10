import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Check,
  Copy,
  Gift,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LIVE_URL = "https://dentaai-scanner-n0h.caffeine.xyz";
const CODE_KEY = "dantanova-referral-code";
const INVITES_KEY = "dantanova-invites-sent";

function getOrCreateCode(): string {
  const stored = localStorage.getItem(CODE_KEY);
  if (stored) return stored;
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  localStorage.setItem(CODE_KEY, code);
  return code;
}

function getInviteCount(): number {
  return Number(localStorage.getItem(INVITES_KEY) ?? "0");
}

function incrementInvites() {
  const current = getInviteCount();
  localStorage.setItem(INVITES_KEY, String(current + 1));
  return current + 1;
}

function StatusBadge({ invites }: { invites: number }) {
  const tier =
    invites >= 10
      ? {
          label: "Gold",
          color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
          icon: "🥇",
        }
      : invites >= 3
        ? {
            label: "Silver",
            color: "text-slate-300 border-slate-400/40 bg-slate-400/10",
            icon: "🥈",
          }
        : {
            label: "Bronze",
            color: "text-orange-400 border-orange-500/40 bg-orange-500/10",
            icon: "🥉",
          };
  return (
    <Badge
      variant="outline"
      className={`rounded-full text-sm px-3 py-1 ${tier.color}`}
    >
      {tier.icon} {tier.label}
    </Badge>
  );
}

export default function ReferralPage() {
  const navigate = useNavigate();
  const [code] = useState(getOrCreateCode);
  const [copied, setCopied] = useState(false);
  const [invitesSent, setInvitesSent] = useState(getInviteCount);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  const inviteLink = `${LIVE_URL}/?ref=${code}`;
  const successfulSignups = invitesSent > 0 ? 1 : 0;

  useEffect(() => {
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
      toast.success("Invite link copied!", {
        description: "Share it with your friends.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy", {
        description: "Please copy the link manually.",
      });
    }
  };

  const handleShare = (platform: "whatsapp" | "twitter") => {
    const newCount = incrementInvites();
    setInvitesSent(newCount);
    const msg = encodeURIComponent(
      `Hey! I use DantaNova for free AI dental scans — it detects cavities in 30 seconds! Try it free: ${inviteLink}`,
    );
    const tweetMsg = encodeURIComponent(
      `Just did an AI dental scan with DantaNova — detected issues in 30 seconds! Try it free: ${inviteLink} #DentalHealth #AI`,
    );
    const url =
      platform === "whatsapp"
        ? `https://wa.me/?text=${msg}`
        : `https://twitter.com/intent/tweet?text=${tweetMsg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const steps = [
    {
      icon: Copy,
      title: "Copy Your Unique Invite Link",
      desc: "Every user gets a unique code. Copy your link above and share it anywhere.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Share2,
      title: "Share via WhatsApp or Social Media",
      desc: "Send to friends, family, or post on social media to spread healthier smiles.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      icon: Gift,
      title: "You Both Get Dental Credit Points",
      desc: "When they complete their first scan, you both unlock dental credit points and badges.",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const benefits = [
    {
      icon: Star,
      text: "Your referral gets early access to premium scan features",
    },
    {
      icon: Award,
      text: "You earn a priority badge displayed on your profile",
    },
    {
      icon: Users,
      text: "Unlock Gold status at 10 referrals for advanced analytics",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
          aria-label="Go back"
          className="rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gradient-gold">
            Invite Friends to DantaNova
          </h1>
          <p className="hud-telemetry text-[10px] text-muted-foreground">
            SPREAD HEALTHIER SMILES
          </p>
        </div>
        <StatusBadge invites={invitesSent} />
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
        {/* Referred-by welcome banner */}
        <AnimatePresence>
          {referredBy && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-4 rounded-3xl"
              style={{
                background: "oklch(0.72 0.17 150 / 0.1)",
                border: "1px solid oklch(0.72 0.17 150 / 0.3)",
              }}
              data-ocid="referral.referred_banner"
            >
              <span className="text-2xl">🎉</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  You were invited by a friend!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your dental journey starts here. Try your first free scan —
                  results in 30 seconds.
                </p>
                <Button
                  size="sm"
                  className="mt-3 rounded-full px-5 glow-primary shimmer-button text-xs"
                  onClick={() => navigate({ to: "/scan" })}
                  data-ocid="referral.scan_cta_button"
                >
                  Start Free Scan
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero invite section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 card-glow-border text-center"
          data-ocid="referral.invite_panel"
        >
          <div
            className="circle-icon w-20 h-20 mx-auto mb-4 animate-ring-pulse"
            style={{
              background: "oklch(0.78 0.16 80 / 0.1)",
              border: "2px solid oklch(0.78 0.16 80 / 0.4)",
            }}
          >
            <Gift className="w-9 h-9 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gradient-gold mb-2">
            Invite Friends, Earn Dental Credits
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-5">
            Spread healthier smiles. Share your invite link and help others scan
            their teeth for free.
          </p>

          {/* Invite link box */}
          <div
            className="flex items-center gap-2 p-3 rounded-2xl mb-4 text-left"
            style={{
              background: "oklch(0.12 0.008 60)",
              border: "1px solid oklch(0.78 0.16 80 / 0.25)",
            }}
          >
            <p className="flex-1 text-xs font-mono text-primary truncate min-w-0">
              {inviteLink}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: copied
                  ? "oklch(0.72 0.17 150 / 0.2)"
                  : "oklch(0.78 0.16 80 / 0.15)",
                border: `1px solid ${
                  copied
                    ? "oklch(0.72 0.17 150 / 0.4)"
                    : "oklch(0.78 0.16 80 / 0.35)"
                }`,
                color: copied ? "oklch(0.72 0.17 150)" : "oklch(0.78 0.16 80)",
              }}
              aria-label="Copy invite link"
              data-ocid="referral.copy_button"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleShare("whatsapp")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all"
              style={{
                background: "oklch(0.55 0.18 145 / 0.15)",
                border: "1px solid oklch(0.55 0.18 145 / 0.35)",
                color: "oklch(0.72 0.17 150)",
              }}
              data-ocid="referral.whatsapp_button"
            >
              <span className="text-base">💬</span> WhatsApp
            </button>
            <button
              type="button"
              onClick={() => handleShare("twitter")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold transition-all"
              style={{
                background: "oklch(0.55 0.12 250 / 0.15)",
                border: "1px solid oklch(0.55 0.12 250 / 0.35)",
                color: "oklch(0.72 0.14 250)",
              }}
              data-ocid="referral.twitter_button"
            >
              <span className="text-base">𝕏</span> Twitter / X
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
          data-ocid="referral.stats_panel"
        >
          {[
            {
              value: invitesSent,
              label: "Invites Sent",
              color: "text-primary",
            },
            {
              value: successfulSignups,
              label: "Signed Up",
              color: "text-green-400",
            },
            {
              value:
                invitesSent >= 10
                  ? "Gold"
                  : invitesSent >= 3
                    ? "Silver"
                    : "Bronze",
              label: "Your Status",
              color:
                invitesSent >= 10
                  ? "text-yellow-400"
                  : invitesSent >= 3
                    ? "text-slate-300"
                    : "text-orange-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-3xl p-4 text-center card-glow-border"
            >
              <p className={`font-display text-2xl font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-5 card-glow-border"
          data-ocid="referral.how_it_works_section"
        >
          <h3 className="font-display font-bold text-base text-gradient-gold mb-4">
            How It Works
          </h3>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${step.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="hud-telemetry text-[9px] text-muted-foreground">
                        STEP {i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-3xl p-5 card-glow-border"
          data-ocid="referral.benefits_section"
        >
          <h3 className="font-display font-bold text-base text-gradient-gold mb-4">
            Referral Benefits
          </h3>
          <div className="flex flex-col gap-3">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {b.text}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Referral code display */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5 card-glow-border text-center"
          data-ocid="referral.code_panel"
        >
          <p className="text-xs text-muted-foreground hud-telemetry mb-2">
            YOUR REFERRAL CODE
          </p>
          <p className="font-mono text-3xl font-bold text-gradient-gold tracking-widest mb-3">
            {code}
          </p>
          <Button
            onClick={handleCopy}
            size="sm"
            className="rounded-full px-6 glow-primary shimmer-button"
            data-ocid="referral.primary_button"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            {copied ? "Copied!" : "Copy Full Link"}
          </Button>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30 bg-card/40">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
        <p className="mt-1">
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
