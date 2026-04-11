import LogoCircle from "@/components/LogoCircle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Copy,
  IndianRupee,
  Loader2,
  Plus,
  QrCode,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const GOLD_BORDER = "1.5px solid oklch(0.72 0.15 85 / 0.7)";
const GOLD_GLOW = "0 0 40px oklch(0.72 0.15 85 / 0.18)";
const GOLD_BG = "oklch(0.15 0.06 85 / 0.8)";

export default function IssuePassportPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();

  const [patientEmail, setPatientEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [treatmentHistory, setTreatmentHistory] = useState("");
  const [currentConditions, setCurrentConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity) return;
    if (!patientEmail.trim()) {
      toast.error("Patient email is required");
      return;
    }
    const budgetNum = Math.round(Number.parseFloat(budget || "0"));
    if (Number.isNaN(budgetNum) || budgetNum <= 0) {
      toast.error("Please enter a valid pre-approved budget (₹)");
      return;
    }
    setSubmitting(true);
    try {
      const code = await actor.issuePassport(
        patientEmail.trim(),
        treatmentHistory.trim(),
        currentConditions.trim(),
        allergies.trim(),
        BigInt(budgetNum),
        notes.trim(),
      );
      setIssuedCode(code);
    } catch {
      toast.error("Failed to issue passport. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIssuedCode(null);
    setPatientEmail("");
    setBudget("");
    setTreatmentHistory("");
    setCurrentConditions("");
    setAllergies("");
    setNotes("");
    setShowDetails(false);
  };

  const copyIssuedCode = () => {
    if (!issuedCode) return;
    navigator.clipboard.writeText(issuedCode);
    toast.success("Passport code copied!");
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to issue Dental Passports
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="issue_passport.sign_in_button"
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
          onClick={() => navigate({ to: "/passport" })}
          data-ocid="issue_passport.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">
            Issue Dental Passport
          </h1>
          <p className="text-xs text-muted-foreground">
            Create a dental passport for a patient
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="issue_passport.qr_button"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-4 mb-6 flex items-start gap-3"
          style={{
            border: "1px solid oklch(0.72 0.15 85 / 0.4)",
            background: "oklch(0.15 0.06 85 / 0.15)",
          }}
        >
          <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Issue a Dental Passport for a patient. Enter their email and a
            pre-approved budget. The patient shares the generated code with any
            dentist they visit while traveling — no dentist registration
            required.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {issuedCode ? (
            /* ── SUCCESS STATE ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-card rounded-3xl p-8 flex flex-col items-center gap-5"
              style={{ border: GOLD_BORDER, boxShadow: GOLD_GLOW }}
              data-ocid="issue_passport.success_panel"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.22 0.08 85 / 0.4)",
                  border: "2px solid oklch(0.72 0.15 85 / 0.8)",
                  boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.3)",
                }}
              >
                <CheckCircle className="w-10 h-10 text-yellow-400" />
              </div>

              <div className="text-center">
                <h2 className="font-display font-bold text-2xl">
                  Passport Issued!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share this code with your patient
                </p>
              </div>

              <div className="w-full">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold text-center mb-3">
                  Passport Code
                </p>
                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 text-2xl font-mono font-bold px-5 py-4 rounded-2xl tracking-widest text-center"
                    style={{
                      background: GOLD_BG,
                      border: "1.5px solid oklch(0.72 0.15 85 / 0.8)",
                      color: "oklch(0.92 0.2 85)",
                      boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.3)",
                    }}
                    data-ocid="issue_passport.code_display"
                  >
                    {issuedCode}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-12 w-12 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 flex-shrink-0"
                    onClick={copyIssuedCode}
                    aria-label="Copy passport code"
                    data-ocid="issue_passport.copy_button"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
                  The patient can show this code at{" "}
                  <Link
                    to="/passport-lookup"
                    className="text-yellow-400 underline"
                  >
                    Passport Lookup
                  </Link>{" "}
                  when visiting a dentist away from home.
                </p>
              </div>

              <Button
                className="rounded-full glow-primary px-8"
                onClick={resetForm}
                data-ocid="issue_passport.issue_another_button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Issue Another
              </Button>
            </motion.div>
          ) : (
            /* ── FORM ── */
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.05 }}
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 flex flex-col gap-5"
              data-ocid="issue_passport.form"
            >
              <h2 className="font-display font-bold text-lg">New Passport</h2>

              {/* Required: Patient Email */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Patient Email *
                </span>
                <Input
                  className="rounded-2xl bg-background/60 border-border/40"
                  placeholder="patient@email.com"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  data-ocid="issue_passport.email_input"
                />
              </div>

              {/* Required: Budget */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Pre-Approved Budget (₹) *
                </span>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 pointer-events-none" />
                  <Input
                    className="rounded-2xl bg-background/60 border-border/40 pl-9"
                    placeholder="500"
                    type="number"
                    min="1"
                    step="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    data-ocid="issue_passport.budget_input"
                  />
                </div>
              </div>

              {/* Optional medical details */}
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-yellow-400 font-semibold self-start hover:opacity-80 transition-opacity"
                onClick={() => setShowDetails((v) => !v)}
                data-ocid="issue_passport.toggle_details"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
                Add Medical Details (optional)
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-4 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Treatment History
                      </span>
                      <Textarea
                        className="rounded-2xl bg-background/60 border-border/40 min-h-[80px]"
                        placeholder="Previous treatments, procedures, x-rays..."
                        value={treatmentHistory}
                        onChange={(e) => setTreatmentHistory(e.target.value)}
                        data-ocid="issue_passport.treatment_input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Current Conditions
                      </span>
                      <Textarea
                        className="rounded-2xl bg-background/60 border-border/40 min-h-[70px]"
                        placeholder="Active dental issues, ongoing treatments..."
                        value={currentConditions}
                        onChange={(e) => setCurrentConditions(e.target.value)}
                        data-ocid="issue_passport.conditions_input"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Allergies
                        </span>
                        <Input
                          className="rounded-2xl bg-background/60 border-border/40"
                          placeholder="Penicillin, latex..."
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          data-ocid="issue_passport.allergies_input"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Notes
                        </span>
                        <Input
                          className="rounded-2xl bg-background/60 border-border/40"
                          placeholder="Additional notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          data-ocid="issue_passport.notes_input"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="rounded-full glow-primary w-full"
                disabled={submitting}
                data-ocid="issue_passport.submit_button"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? "Issuing Passport..." : "Issue Dental Passport"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
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
