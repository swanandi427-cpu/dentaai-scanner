import type {
  PassportRecord,
  PaymentRecord,
  ReimbursementRequest,
} from "@/backend.d";
import { PaymentState, ReimbursementStatus } from "@/backend.d";
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
  CreditCard,
  IndianRupee,
  Loader2,
  QrCode,
  Search,
  Send,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function reimbStatusColor(s: ReimbursementStatus): string {
  if (s === ReimbursementStatus.approved)
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === ReimbursementStatus.declined)
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (s === ReimbursementStatus.settled)
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

function paymentStateColor(s: PaymentState): string {
  if (s === PaymentState.paid)
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (s === PaymentState.failed)
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (s === PaymentState.refunded)
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

const GOLD_BORDER = "1.5px solid oklch(0.72 0.15 85 / 0.6)";
const GOLD_GLOW = "0 0 40px oklch(0.72 0.15 85 / 0.15)";

type ReimbursePayState = "idle" | "recording" | "confirmed";

export default function PassportLookupPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const [codeInput, setCodeInput] = useState("");
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [passport, setPassport] = useState<PassportRecord | null>(null);

  const [treatmentDesc, setTreatmentDesc] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState<bigint | null>(null);
  const [lastReimburseId, setLastReimburseId] = useState<bigint | null>(null);
  const [reimbursePayState, setReimbursePayState] =
    useState<ReimbursePayState>("idle");
  const [reimbursePayRecordId, setReimbursePayRecordId] = useState<
    bigint | null
  >(null);

  const [myRequests, setMyRequests] = useState<ReimbursementRequest[]>([]);
  const [reimbPayments, setReimbPayments] = useState<
    Record<string, PaymentRecord>
  >({});
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoadingRequests(false);
      return;
    }
    actor
      .getMyReimbursementRequests()
      .then((list) => setMyRequests(list))
      .catch(() => {})
      .finally(() => setLoadingRequests(false));
  }, [actor, isFetching, identity]);

  // Load payment records for reimbursements
  useEffect(() => {
    if (!actor || isFetching || !identity || myRequests.length === 0) return;
    const fetchPayments = async () => {
      const map: Record<string, PaymentRecord> = {};
      await Promise.allSettled(
        myRequests.map(async (req) => {
          try {
            const p = await actor.getReimbursementPayment(req.id);
            if (p) map[req.id.toString()] = p;
          } catch {
            /* ignore */
          }
        }),
      );
      setReimbPayments(map);
    };
    fetchPayments();
  }, [actor, isFetching, identity, myRequests]);

  const lookupPassport = async () => {
    if (!actor || !codeInput.trim()) return;
    setLooking(true);
    setPassport(null);
    setLookupError(false);
    setBillingSuccess(null);
    setLastReimburseId(null);
    setReimbursePayState("idle");
    try {
      const code = codeInput.trim().toUpperCase();
      const result = await actor.lookupPassportByCode(code);
      if (result) {
        setPassport(result);
        toast.success("Patient found!");
      } else {
        setLookupError(true);
        toast.error("No passport found with that code");
      }
    } catch {
      toast.error("Failed to look up passport. Please try again.");
    } finally {
      setLooking(false);
    }
  };

  const amountNum = Number.parseFloat(amountInput || "0");
  const platformFee = amountNum > 0 ? amountNum * 0.08 : 0;
  const netAmount = amountNum > 0 ? amountNum * 0.92 : 0;

  const submitReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !passport) return;
    if (!treatmentDesc.trim()) {
      toast.error("Please describe the treatment performed");
      return;
    }
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid treatment amount");
      return;
    }
    setSubmitting(true);
    try {
      const requestId = await actor.submitReimbursementRequest(
        passport.passportCode,
        treatmentDesc.trim(),
        BigInt(Math.round(amountNum)),
        "",
      );
      setLastReimburseId(requestId);
      setBillingSuccess(requestId);
      toast.success(`Reimbursement request #${Number(requestId)} submitted!`);
      setTreatmentDesc("");
      setAmountInput("");
      try {
        const updated = await actor.getMyReimbursementRequests();
        setMyRequests(updated);
      } catch {
        /* ignore */
      }
    } catch {
      toast.error("Failed to submit reimbursement request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReimbursePayNow = async () => {
    if (!actor || !lastReimburseId) return;
    setReimbursePayState("recording");
    try {
      const payId = await actor.recordReimbursementPayment(
        lastReimburseId,
        BigInt(Math.round(amountNum || 0)),
        "pending-stripe-session",
      );
      setReimbursePayRecordId(payId);
      setReimbursePayState("confirmed");
      toast.success(
        "Reimbursement request submitted — home dentist will be notified",
      );
    } catch {
      setReimbursePayState("idle");
      toast.error("Failed to record payment intent. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to look up patient passports
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="passport_lookup.sign_in_button"
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
          data-ocid="passport_lookup.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg">Passport Lookup</h1>
          <p className="text-xs text-muted-foreground">
            Look up a patient by their passport code
          </p>
        </div>
        <Link to="/qr">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-yellow-500/40 text-yellow-400 gap-1.5"
            data-ocid="passport_lookup.qr_button"
          >
            <QrCode className="w-3.5 h-3.5" />
            QR
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Lookup Box */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 mb-6"
          style={{
            border: GOLD_BORDER,
            boxShadow: "0 0 30px oklch(0.72 0.15 85 / 0.1)",
          }}
        >
          <h2 className="font-display font-bold text-base mb-1">
            Look Up Patient by Passport Code
          </h2>
          <p className="text-xs text-muted-foreground mb-1">
            Enter the patient's unique passport code (e.g. DP-42).
          </p>
          <p className="text-xs mb-4" style={{ color: "oklch(0.72 0.15 85)" }}>
            💡 Tip: Ask the patient to open <strong>My Dental Passport</strong>{" "}
            → tap <strong>Share Code</strong>
          </p>
          <div className="flex gap-2">
            <Input
              className="rounded-2xl bg-background/60 border-border/40 flex-1 font-mono tracking-widest text-yellow-300"
              placeholder="e.g. DP-42"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.toUpperCase());
                setLookupError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && lookupPassport()}
              data-ocid="passport_lookup.code_input"
            />
            <Button
              className="rounded-full glow-primary px-5"
              onClick={lookupPassport}
              disabled={looking || !codeInput.trim()}
              data-ocid="passport_lookup.search_button"
            >
              {looking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {lookupError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{
                background: "oklch(0.35 0.18 20 / 0.15)",
                border: "1px solid oklch(0.55 0.18 20 / 0.4)",
              }}
              data-ocid="passport_lookup.not_found_error"
            >
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">
                No passport found with this code. Please check and try again.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Patient Found + Details + Billing Form */}
        {passport && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5 mb-8"
          >
            {/* Patient Found Banner */}
            <div
              className="flex items-center gap-3 rounded-3xl px-5 py-4"
              style={{
                background: "oklch(0.22 0.08 85 / 0.3)",
                border: GOLD_BORDER,
                boxShadow: "0 0 24px oklch(0.72 0.15 85 / 0.15)",
              }}
              data-ocid="passport_lookup.patient_found_banner"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "oklch(0.72 0.15 85 / 0.2)",
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.7)",
                }}
              >
                <CheckCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-base">
                  Patient Found — Ready to Treat
                </p>
                <p className="text-xs text-muted-foreground">
                  Full patient records loaded below
                </p>
              </div>
              <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                Active
              </Badge>
            </div>

            {/* Passport Details */}
            <div
              className="glass-card rounded-3xl p-6"
              style={{ border: GOLD_BORDER, boxShadow: GOLD_GLOW }}
              data-ocid="passport_lookup.patient_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold">Patient Passport</h3>
                <code
                  className="ml-auto text-xs font-mono px-2 py-1 rounded-lg"
                  style={{
                    background: "oklch(0.15 0.06 85 / 0.8)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.5)",
                    color: "oklch(0.92 0.2 85)",
                  }}
                >
                  {passport.passportCode}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-card rounded-2xl p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pre-Approved Budget
                  </p>
                  <p className="text-xl font-bold text-yellow-400">
                    ₹
                    {Number(passport.preApprovedBudget).toLocaleString("en-IN")}
                  </p>
                </div>

                {passport.allergies && (
                  <div
                    className="rounded-2xl p-3 flex items-start gap-2"
                    style={{
                      background: "oklch(0.35 0.18 20 / 0.15)",
                      border: "1px solid oklch(0.55 0.18 20 / 0.4)",
                    }}
                  >
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-1">
                        ⚠ Allergies
                      </p>
                      <p className="text-sm text-red-200">
                        {passport.allergies}
                      </p>
                    </div>
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
                      Dentist Notes
                    </p>
                    <p className="text-sm">{passport.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Form or Success + Reimbursement Payment */}
            {billingSuccess !== null ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-6 flex flex-col gap-5"
                style={{
                  border: "1.5px solid oklch(0.72 0.15 85 / 0.6)",
                  boxShadow: GOLD_GLOW,
                }}
                data-ocid="passport_lookup.billing_success"
              >
                {/* Submission confirmation */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "oklch(0.22 0.08 85 / 0.4)",
                      border: "2px solid oklch(0.72 0.15 85 / 0.7)",
                    }}
                  >
                    <CheckCircle className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">
                      Reimbursement Request Submitted!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Request #{Number(billingSuccess)} sent to home dentist for
                      approval.
                    </p>
                  </div>
                </div>

                {/* Payment intent section */}
                <div
                  className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{
                    background: "oklch(0.12 0.06 85 / 0.4)",
                    border: "1.5px solid oklch(0.72 0.15 85 / 0.35)",
                  }}
                  data-ocid="passport_lookup.reimbursement_payment_section"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">
                      Reimbursement Payment
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Home dentist will be notified to approve and settle
                    reimbursement. You can also record the payment intent now.
                  </p>

                  {reimbursePayState === "idle" && (
                    <Button
                      className="w-full rounded-full glow-primary font-semibold"
                      onClick={handleReimbursePayNow}
                      data-ocid="passport_lookup.reimburse_pay_button"
                    >
                      <IndianRupee className="w-4 h-4 mr-1.5" />
                      Record Payment Intent
                    </Button>
                  )}

                  {reimbursePayState === "recording" && (
                    <Button
                      className="w-full rounded-full opacity-70"
                      disabled
                      data-ocid="passport_lookup.reimburse_pay_loading_state"
                    >
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Recording...
                    </Button>
                  )}

                  {reimbursePayState === "confirmed" && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl px-4 py-3"
                      style={{
                        background: "oklch(0.22 0.08 85 / 0.3)",
                        border: "1px solid oklch(0.72 0.15 85 / 0.5)",
                      }}
                      data-ocid="passport_lookup.reimburse_pay_success_state"
                    >
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary">
                          Reimbursement request submitted — home dentist will be
                          notified
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Payment record #
                          {reimbursePayRecordId !== null
                            ? Number(reimbursePayRecordId)
                            : "—"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="rounded-full border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={() => {
                    setBillingSuccess(null);
                    setPassport(null);
                    setCodeInput("");
                    setReimbursePayState("idle");
                    setLastReimburseId(null);
                  }}
                  data-ocid="passport_lookup.new_lookup_button"
                >
                  Look Up Another Patient
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={submitReimbursement}
                className="glass-card rounded-3xl p-6 flex flex-col gap-4"
                data-ocid="passport_lookup.billing_form"
              >
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-display font-bold">
                    Request Reimbursement
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  After treating the patient, submit a reimbursement request to
                  their home dentist. Platform fee: 8%.
                </p>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Treatment Description *
                  </span>
                  <Textarea
                    className="rounded-2xl bg-background/60 border-border/40 min-h-[80px]"
                    placeholder="Describe the treatment performed..."
                    value={treatmentDesc}
                    onChange={(e) => setTreatmentDesc(e.target.value)}
                    required
                    data-ocid="passport_lookup.description_input"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Treatment Amount (₹) *
                  </span>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 pointer-events-none" />
                    <Input
                      className="rounded-2xl bg-background/60 border-border/40 pl-9"
                      placeholder="2500"
                      type="number"
                      min="1"
                      step="1"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      required
                      data-ocid="passport_lookup.amount_input"
                    />
                  </div>
                </div>

                {/* Live fee breakdown */}
                {amountNum > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 flex flex-col gap-2"
                    style={{
                      background: "oklch(0.15 0.06 85 / 0.2)",
                      border: "1px solid oklch(0.72 0.15 85 / 0.3)",
                    }}
                    data-ocid="passport_lookup.fee_breakdown"
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                      Fee Breakdown
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Treatment Amount
                      </span>
                      <span className="font-semibold">
                        ₹{amountNum.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Platform Fee (8%)
                      </span>
                      <span className="text-red-400">
                        −₹{platformFee.toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between text-sm pt-2 mt-1"
                      style={{
                        borderTop: "1px solid oklch(0.72 0.15 85 / 0.2)",
                      }}
                    >
                      <span className="font-bold">You Receive</span>
                      <span className="font-bold text-yellow-400 text-base">
                        ₹{netAmount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="rounded-full glow-primary w-full"
                  disabled={submitting}
                  data-ocid="passport_lookup.submit_button"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {submitting
                    ? "Submitting..."
                    : "Submit Reimbursement Request"}
                </Button>
              </form>
            )}
          </motion.div>
        )}

        {/* My Submitted Requests */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            My Reimbursement Requests
          </h2>
          {loadingRequests ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
            </div>
          ) : myRequests.length === 0 ? (
            <div
              className="glass-card rounded-3xl p-8 text-center"
              data-ocid="passport_lookup.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No reimbursement requests submitted yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Look up a patient above and submit your first request.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myRequests.map((req, i) => {
                const payRec = reimbPayments[req.id.toString()];
                return (
                  <motion.div
                    key={req.id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-card rounded-2xl p-4 flex flex-col gap-2"
                    data-ocid={`passport_lookup.request.${i + 1}`}
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
                      <div className="flex flex-col gap-1 items-end shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${reimbStatusColor(req.status)}`}
                        >
                          {req.status}
                        </span>
                        {payRec && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${paymentStateColor(payRec.state)}`}
                          >
                            <CreditCard className="w-2.5 h-2.5" />
                            {payRec.state}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Amount
                      </span>
                      <div className="text-right">
                        <span className="text-yellow-400 font-bold text-sm">
                          ₹{Number(req.amountRupees).toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          (−₹
                          {Number(req.platformFeeRupees).toLocaleString(
                            "en-IN",
                          )}{" "}
                          fee)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
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
