import type { PassportRecord, ReimbursementRequest } from "@/backend.d";
import { ReimbursementStatus } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  IndianRupee,
  Loader2,
  QrCode,
  RefreshCw,
  Share2,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function statusColor(s: ReimbursementStatus): string {
  if (s === ReimbursementStatus.approved)
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === ReimbursementStatus.declined)
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (s === ReimbursementStatus.settled)
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

const GOLD = "oklch(0.72 0.15 85)";
const GOLD_BORDER = "1.5px solid oklch(0.72 0.15 85 / 0.6)";
const GOLD_GLOW = "0 0 40px oklch(0.72 0.15 85 / 0.18)";
const GOLD_BG = "oklch(0.15 0.06 85 / 0.8)";

export default function PassportPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [passport, setPassport] = useState<PassportRecord | null | undefined>(
    undefined,
  );
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Self-issue / update form
  const [showSelfForm, setShowSelfForm] = useState(false);
  const [treatmentHistory, setTreatmentHistory] = useState("");
  const [conditions, setConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey is manual trigger
  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([actor.getMyPassports(), actor.getMyReimbursementRequests()])
      .then(([passports, reimbList]) => {
        const p = passports.length > 0 ? passports[0] : null;
        setPassport(p);
        setRequests(reimbList);
        if (p) {
          setTreatmentHistory(p.treatmentHistory);
          setConditions(p.currentConditions);
          setAllergies(p.allergies);
          setBudget(String(Number(p.preApprovedBudget)));
          setNotes(p.notes);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, isFetching, identity, refreshKey]);

  const copyCode = useCallback(() => {
    if (!passport) return;
    navigator.clipboard.writeText(passport.passportCode);
    toast.success("Passport code copied!");
  }, [passport]);

  const shareCode = useCallback(async () => {
    if (!passport) return;
    const text = `My DantaNova Dental Passport Code: ${passport.passportCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Dental Passport", text });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Passport code copied to clipboard!");
    }
  }, [passport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    setSelfForm(false);
    setSubmitting(true);
    try {
      const budgetNum = BigInt(
        Math.max(0, Math.round(Number.parseFloat(budget || "0"))),
      );
      const code = await actor.selfIssuePassport(
        treatmentHistory.trim(),
        conditions.trim(),
        allergies.trim(),
        budgetNum,
        notes.trim(),
      );
      toast.success(`Dental Passport saved! Code: ${code}`);
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error("Could not save passport. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  function setSelfForm(open: boolean) {
    setShowSelfForm(open);
    if (open && passport) {
      setTreatmentHistory(passport.treatmentHistory);
      setConditions(passport.currentConditions);
      setAllergies(passport.allergies);
      setBudget(String(Number(passport.preApprovedBudget)));
      setNotes(passport.notes);
    }
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to view your Dental Passport
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="passport.sign_in_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/80 backdrop-blur sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/" })}
          data-ocid="passport.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">My Dental Passport</h1>
          <p className="text-xs text-muted-foreground">
            Your portable dental identity
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="passport.qr_button"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-yellow-400" />
          </div>
        ) : !passport ? (
          /* ── EMPTY STATE ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            <div
              className="glass-card rounded-3xl p-7 text-center flex flex-col items-center gap-3"
              data-ocid="passport.empty_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.08 85 / 0.3)",
                  border: GOLD_BORDER,
                  boxShadow: GOLD_GLOW,
                }}
              >
                <BookOpen className="w-7 h-7 text-yellow-400" />
              </div>
              <h2 className="font-display font-bold text-xl">
                No Passport Yet
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Get a Dental Passport to share your dental records when visiting
                dentists away from home.
              </p>
            </div>

            {/* Two options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/find-dentist">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-3xl p-5 flex flex-col items-center gap-3 cursor-pointer h-full"
                  style={{ border: "1.5px solid oklch(0.72 0.15 85 / 0.35)" }}
                  data-ocid="passport.get_from_dentist_card"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85 / 0.4)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                    }}
                  >
                    <Stethoscope className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm">Get from your dentist</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Ask your home dentist to issue a passport with your full
                      records and pre-approved budget.
                    </p>
                  </div>
                  <div
                    className="mt-auto flex items-center gap-1 text-xs font-semibold"
                    style={{ color: GOLD }}
                  >
                    Find a Dentist <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </Link>

              <motion.div
                whileHover={{ scale: showSelfForm ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card rounded-3xl p-5 flex flex-col items-center gap-3 cursor-pointer"
                style={{
                  border: showSelfForm
                    ? "1.5px solid oklch(0.72 0.15 85 / 0.7)"
                    : "1.5px solid oklch(0.72 0.15 85 / 0.35)",
                  boxShadow: showSelfForm ? GOLD_GLOW : undefined,
                }}
                onClick={() => setShowSelfForm((v) => !v)}
                data-ocid="passport.create_own_card"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.22 0.08 85 / 0.4)",
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                  }}
                >
                  <BookOpen className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Create your own</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Self-create a passport instantly with your allergies,
                    conditions, and approved budget.
                  </p>
                </div>
                <div
                  className="mt-auto flex items-center gap-1 text-xs font-semibold"
                  style={{ color: GOLD }}
                >
                  {showSelfForm ? "Hide Form" : "Create Now"}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showSelfForm ? "rotate-180" : ""}`}
                  />
                </div>
              </motion.div>
            </div>

            {/* Inline create form */}
            <AnimatePresence>
              {showSelfForm && (
                <PassportForm
                  key="create-form"
                  treatmentHistory={treatmentHistory}
                  setTreatmentHistory={setTreatmentHistory}
                  conditions={conditions}
                  setConditions={setConditions}
                  allergies={allergies}
                  setAllergies={setAllergies}
                  budget={budget}
                  setBudget={setBudget}
                  notes={notes}
                  setNotes={setNotes}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  mode="create"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ── PASSPORT EXISTS ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Passport Card */}
            <div
              className="glass-card rounded-3xl p-6"
              style={{ border: GOLD_BORDER, boxShadow: GOLD_GLOW }}
              data-ocid="passport.card"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85 / 0.5)",
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.5)",
                    }}
                  >
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm">
                      Dental Passport
                    </p>
                    <p className="text-xs text-muted-foreground">
                      DantaNova Network
                    </p>
                  </div>
                </div>
                <Badge
                  className={
                    passport.isActive
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                  }
                >
                  {passport.isActive ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>

              {/* Passport Code — gold highlight */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                  Passport Code
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-2xl font-mono font-bold px-4 py-3 rounded-2xl tracking-widest text-center"
                    style={{
                      background: GOLD_BG,
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.7)",
                      color: "oklch(0.92 0.2 85)",
                      boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.25)",
                    }}
                    data-ocid="passport.code_display"
                  >
                    {passport.passportCode}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-10 w-10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={copyCode}
                    aria-label="Copy passport code"
                    data-ocid="passport.copy_button"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-10 w-10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={shareCode}
                    aria-label="Share passport code"
                    data-ocid="passport.share_button"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this code with any dentist so they can look up your
                  records at /passport-lookup.
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pre-Approved Budget
                  </p>
                  <p className="text-lg font-bold text-yellow-400">
                    ₹
                    {Number(passport.preApprovedBudget).toLocaleString("en-IN")}
                  </p>
                </div>
                {passport.allergies && (
                  <div
                    className="glass-card rounded-2xl p-3"
                    style={{
                      border: "1px solid oklch(0.55 0.18 20 / 0.4)",
                      background: "oklch(0.35 0.18 20 / 0.1)",
                    }}
                  >
                    <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">
                      ⚠ Allergies
                    </p>
                    <p className="text-sm text-red-200">{passport.allergies}</p>
                  </div>
                )}
                {passport.currentConditions && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Current Conditions
                    </p>
                    <p className="text-sm">{passport.currentConditions}</p>
                  </div>
                )}
                {passport.treatmentHistory && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Treatment History
                    </p>
                    <p className="text-sm leading-relaxed">
                      {passport.treatmentHistory}
                    </p>
                  </div>
                )}
                {passport.notes && (
                  <div className="glass-card rounded-2xl p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Notes
                    </p>
                    <p className="text-sm">{passport.notes}</p>
                  </div>
                )}
              </div>

              {/* Update button */}
              <div className="mt-5 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 gap-1.5"
                  onClick={() => setSelfForm(!showSelfForm)}
                  data-ocid="passport.update_button"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {showSelfForm ? "Hide Update Form" : "Update My Passport"}
                </Button>
              </div>
            </div>

            {/* Update form */}
            <AnimatePresence>
              {showSelfForm && (
                <PassportForm
                  key="update-form"
                  treatmentHistory={treatmentHistory}
                  setTreatmentHistory={setTreatmentHistory}
                  conditions={conditions}
                  setConditions={setConditions}
                  allergies={allergies}
                  setAllergies={setAllergies}
                  budget={budget}
                  setBudget={setBudget}
                  notes={notes}
                  setNotes={setNotes}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                  mode="update"
                />
              )}
            </AnimatePresence>

            {/* Reimbursement History */}
            {requests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="font-display font-bold text-lg mb-3">
                  Treatment Reimbursements
                </h2>
                <div className="flex flex-col gap-3">
                  {requests.map((req, i) => (
                    <motion.div
                      key={req.id.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="glass-card rounded-2xl p-4 flex flex-col gap-2"
                      data-ocid={`passport.reimbursement.${i + 1}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">
                            Request #{Number(req.id)}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {req.treatmentDetails}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold shrink-0 ${statusColor(req.status)}`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-muted-foreground">
                          Amount
                        </span>
                        <span className="text-yellow-400 font-bold">
                          ₹{Number(req.amountRupees).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
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

// ── Shared form component ──────────────────────────────────────────────────
interface PassportFormProps {
  treatmentHistory: string;
  setTreatmentHistory: (v: string) => void;
  conditions: string;
  setConditions: (v: string) => void;
  allergies: string;
  setAllergies: (v: string) => void;
  budget: string;
  setBudget: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  mode: "create" | "update";
}

function PassportForm({
  treatmentHistory,
  setTreatmentHistory,
  conditions,
  setConditions,
  allergies,
  setAllergies,
  budget,
  setBudget,
  notes,
  setNotes,
  submitting,
  onSubmit,
  mode,
}: PassportFormProps) {
  return (
    <motion.form
      key="passport-form"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={onSubmit}
      className="glass-card rounded-3xl p-6 flex flex-col gap-4"
      style={{ border: "1.5px solid oklch(0.72 0.15 85 / 0.5)" }}
      data-ocid="passport.self_form"
    >
      <div>
        <h3 className="font-display font-bold text-base">
          {mode === "create"
            ? "Create Your Dental Passport"
            : "Update Your Dental Passport"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          All fields optional — add what you know.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Treatment History
        </span>
        <Textarea
          className="rounded-2xl bg-background/60 border-border/40 min-h-[60px]"
          placeholder="Previous procedures, fillings, extractions..."
          value={treatmentHistory}
          onChange={(e) => setTreatmentHistory(e.target.value)}
          data-ocid="passport.treatment_input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Current Conditions
        </span>
        <Input
          className="rounded-2xl bg-background/60 border-border/40"
          placeholder="e.g. Ongoing sensitivity, crown on tooth 14..."
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          data-ocid="passport.conditions_input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Allergies
        </span>
        <Input
          className="rounded-2xl bg-background/60 border-border/40"
          placeholder="e.g. Penicillin, latex..."
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          data-ocid="passport.allergies_input"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Pre-Approved Budget (₹)
        </span>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 pointer-events-none" />
          <Input
            className="rounded-2xl bg-background/60 border-border/40 pl-9"
            placeholder="0"
            type="number"
            min="0"
            step="1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            data-ocid="passport.budget_input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Notes
        </span>
        <Textarea
          className="rounded-2xl bg-background/60 border-border/40 min-h-[60px]"
          placeholder="Any other notes for your dentist..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-ocid="passport.notes_input"
        />
      </div>

      <Button
        type="submit"
        className="rounded-full glow-primary w-full"
        disabled={submitting}
        data-ocid="passport.submit_button"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <CheckCircle className="w-4 h-4 mr-2" />
        )}
        {submitting
          ? "Saving..."
          : mode === "create"
            ? "Create My Passport"
            : "Update My Passport"}
      </Button>
    </motion.form>
  );
}
