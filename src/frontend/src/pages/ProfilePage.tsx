import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useScanHistory } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Loader2,
  LogIn,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { data: history, isLoading } = useScanHistory();

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() ?? "";
  const shortId = principalId
    ? `${principalId.slice(0, 12)}…${principalId.slice(-6)}`
    : "";

  useEffect(() => {
    if (!actor || isFetching || !identity) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        if (p) {
          setProfileName(p.name);
          setProfileEmail(p.email ?? "");
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [actor, isFetching, identity]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success("Principal ID copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed.");
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSavingProfile(true);
    try {
      await actor.saveCallerUserProfile(
        profileName.trim(),
        profileEmail.trim(),
      );
      toast.success("Profile saved successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save profile.";
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
        <div className="glow-orb w-64 h-64 top-10 left-10 opacity-15" />
        <div
          className="glow-orb w-48 h-48 bottom-20 right-10 opacity-10"
          style={{ animationDelay: "4s" }}
        />

        <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="justify-start rounded-full px-4 w-fit"
            data-ocid="profile.link"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center gap-2">
            <LogoCircle size="sm" />
            <span className="font-display font-bold text-lg">
              Danta<span className="text-primary">Nova</span>
            </span>
          </div>
          <div />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center px-4 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="circle-icon w-24 h-24 mx-auto mb-6 animate-ring-pulse"
              style={{
                background: "oklch(0.78 0.16 80 / 0.08)",
                border: "2px solid oklch(0.78 0.16 80 / 0.4)",
                boxShadow: "0 0 30px oklch(0.78 0.16 80 / 0.15)",
              }}
            >
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gradient-gold">
              Sign In Required
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
              Sign in to view and manage your profile, scan history, and account
              details.
            </p>
          </motion.div>
          <Button
            size="lg"
            className="rounded-full px-8 glow-primary shimmer-button"
            onClick={() => login()}
            data-ocid="profile.primary_button"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      data-ocid="profile.page"
    >
      <div
        className="glow-orb w-72 h-72 top-20 right-10 opacity-10"
        style={{ animationDelay: "2s" }}
      />

      <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          className="justify-start rounded-full px-4 w-fit"
          data-ocid="profile.link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center gap-2">
          <LogoCircle size="sm" />
          <span className="font-display font-bold text-lg">
            Danta<span className="text-primary">Nova</span>
          </span>
        </div>
        <div />
      </header>

      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full flex flex-col gap-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-2xl font-bold mb-6 text-gradient-gold">
            My Profile
          </h1>

          {/* Identity card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="glass-card rounded-3xl p-5 flex items-center gap-4 mb-4 neon-border"
          >
            <div className="circle-icon w-14 h-14 bg-primary/15 circle-glow-ring flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="hud-telemetry text-[10px] text-muted-foreground mb-1">
                INTERNET IDENTITY
              </p>
              <p
                className="font-mono text-sm font-semibold truncate text-primary"
                data-ocid="profile.card"
              >
                {shortId || "Loading…"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cryptographic on-chain identity
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full flex-shrink-0 hover:bg-primary/10"
              onClick={handleCopyId}
              aria-label="Copy principal ID"
            >
              {copied ? (
                <span className="text-primary text-xs">✓</span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-4"
          >
            <div className="glass-card rounded-3xl p-4 flex items-center gap-3">
              <div className="circle-icon w-11 h-11 bg-primary/15 flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="w-8 h-5 rounded-full" />
                ) : (
                  <span className="font-display text-lg font-bold text-primary">
                    {history?.length ?? 0}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">Total Scans</p>
                <p className="text-xs text-muted-foreground">Recorded scans</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-4 flex items-center gap-3">
              <div className="circle-icon w-11 h-11 bg-green-500/10 border border-green-500/25 flex-shrink-0">
                <span className="font-display text-lg font-bold text-green-400">
                  {isLoading
                    ? "…"
                    : (history?.filter((h) => Number(h.healthScore) >= 70)
                        .length ?? 0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">Healthy Scans</p>
                <p className="text-xs text-muted-foreground">Score ≥ 70/100</p>
              </div>
            </div>
          </motion.div>

          {/* Profile edit card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="glass-card rounded-3xl p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-primary">
                Personal Information
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              Your name and email are used for bookings and dental passport
              identification.
            </p>

            {!profileLoaded && isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <form
                onSubmit={saveProfile}
                className="flex flex-col gap-4"
                data-ocid="profile.panel"
              >
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    Full Name
                  </Label>
                  <Input
                    className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50 focus:ring-primary/20"
                    placeholder="Your full name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    data-ocid="profile.input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50 focus:ring-primary/20"
                    placeholder="your@email.com"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    data-ocid="profile.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full glow-primary shimmer-button"
                  disabled={savingProfile}
                  data-ocid="profile.save_button"
                >
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {savingProfile ? "Saving…" : "Save Profile"}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Dentist shortcut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="glass-card rounded-3xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold">Are you a dentist?</p>
              <p className="text-xs text-muted-foreground">
                Register your practice and start receiving patients
              </p>
            </div>
            <Link
              to="/dentist-register"
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              data-ocid="profile.dentist_register.link"
            >
              Register
              <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30 bg-card/40 relative z-10">
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
