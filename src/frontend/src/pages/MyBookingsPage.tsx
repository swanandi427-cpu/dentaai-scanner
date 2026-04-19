import type { Booking, PaymentRecord } from "@/backend.d";
import {
  BookingStatus,
  PaymentState,
  PaymentStatusInternal,
} from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  MessageSquare,
  Plus,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function getStatusStr(status: unknown): string {
  if (typeof status === "string") return status;
  return Object.keys(status as Record<string, unknown>)[0];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  approved: "bg-primary/10 text-primary border-primary/30",
  completed: "bg-green-500/15 text-green-400 border-green-500/30",
  declined: "bg-destructive/10 text-destructive border-destructive/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const URGENCY_COLORS: Record<string, string> = {
  routine: "bg-primary/10 text-primary border-primary/30",
  urgent: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  emergency: "bg-red-500/15 text-red-400 border-red-500/30",
};

// Booking fee based on urgency
const URGENCY_FEE: Record<string, number> = {
  routine: 499,
  urgent: 999,
  emergency: 999,
};
const PLATFORM_FEE_PCT = 0.08;

type PaymentChipInfo = { label: string; cls: string; icon?: React.ReactNode };

function paymentChipInfo(payState: PaymentState | null): PaymentChipInfo {
  if (!payState || payState === PaymentState.pending)
    return {
      label: "Pending",
      cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    };
  if (payState === PaymentState.paid)
    return {
      label: "Paid",
      cls: "bg-green-500/15 text-green-400 border-green-500/30",
    };
  if (payState === PaymentState.refunded)
    return {
      label: "Refunded",
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    };
  if (payState === PaymentState.failed)
    return {
      label: "Failed",
      cls: "bg-red-500/15 text-red-400 border-red-500/30",
    };
  return { label: "N/A", cls: "bg-muted text-muted-foreground border-border" };
}

import type React from "react";

type BookingPayFlow = "idle" | "opening" | "confirmed" | "failed";

function PayNowButton({
  booking,
  urgencyStr,
  actor,
  onSuccess,
}: {
  booking: Booking;
  urgencyStr: string;
  actor: ReturnType<typeof useActor>["actor"];
  onSuccess: () => void;
}) {
  const [flow, setFlow] = useState<BookingPayFlow>("idle");

  const baseFee = URGENCY_FEE[urgencyStr] ?? 499;
  const platformFee = Math.round(baseFee * PLATFORM_FEE_PCT);
  const totalFee = baseFee + platformFee;

  const handlePay = async () => {
    if (!actor) return;
    setFlow("opening");

    // Capture session ID before checkout so it's available in catch
    let capturedSessionId: string | null = null;

    try {
      const { createCheckout } = await import("@/lib/stripe");
      await createCheckout({
        amountRupees: totalFee,
        currency: "inr",
        productName: `DantaNova ${urgencyStr.charAt(0).toUpperCase() + urgencyStr.slice(1)} Appointment`,
        successUrl: `${window.location.origin}/my-bookings?payment=success`,
        cancelUrl: `${window.location.origin}/my-bookings`,
        onSuccess: async (sessionId: string) => {
          capturedSessionId = sessionId;
          try {
            await actor.recordBookingPayment(
              booking.bookingId,
              BigInt(totalFee),
              sessionId,
            );
            await actor.confirmPayment(sessionId);
            setFlow("confirmed");
            onSuccess();
            toast.success("Payment confirmed!");
          } catch {
            setFlow("confirmed");
            onSuccess();
            toast.success("Payment received!");
          }
        },
        onCancel: () => {
          setFlow("idle");
          toast.info("Payment cancelled.");
        },
      });
      if (flow === "opening") setFlow("idle");
    } catch {
      setFlow("failed");
      // Transition backend record to #failed when session ID is known
      if (capturedSessionId) {
        try {
          await actor.failPayment(capturedSessionId);
        } catch {
          /* best-effort */
        }
      }
      toast.error("Could not open checkout.");
    }
  };

  if (flow === "confirmed")
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Payment confirmed
      </div>
    );

  if (flow === "failed")
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400 flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5" />
          Failed
        </span>
        <Button
          size="sm"
          className="rounded-full glow-primary text-xs px-3 h-7"
          onClick={handlePay}
          data-ocid="my_bookings.retry_payment"
        >
          Retry
        </Button>
      </div>
    );

  return (
    <Button
      size="sm"
      className="rounded-full glow-primary shimmer-button text-xs px-3 h-7"
      onClick={handlePay}
      disabled={flow === "opening"}
      data-ocid="my_bookings.pay_now"
    >
      {flow === "opening" ? (
        <>
          <Loader2
            className="w-3 h-3 animate-spin mr-1"
            style={{ color: "oklch(0.88 0.18 85)" }}
          />
          Opening…
        </>
      ) : (
        <>
          <IndianRupee className="w-3 h-3 mr-1" />
          Pay ₹{totalFee.toLocaleString("en-IN")}
        </>
      )}
    </Button>
  );
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // Fetch payment records and index by bookingId (referenceId in PaymentRecord)
  const { data: myPayments = [] } = useQuery<PaymentRecord[]>({
    queryKey: ["myPayments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPayments();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  // Build a map: bookingId string -> most recent payment state
  const paymentByBookingId: Record<string, PaymentState> = {};
  for (const p of myPayments) {
    const key = p.referenceId.toString();
    const existing = paymentByBookingId[key];
    if (!existing || p.state === PaymentState.paid) {
      paymentByBookingId[key] = p.state;
    }
  }

  const markPaid = async (bookingId: bigint, amount: bigint) => {
    if (!actor) return;
    try {
      await actor.updatePaymentStatus(
        bookingId,
        PaymentStatusInternal.paid,
        amount,
      );
      toast.success("Payment marked as paid!");
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    } catch {
      toast.error("Failed to update payment");
    }
  };

  const refreshPayments = () => {
    queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    queryClient.invalidateQueries({ queryKey: ["myBookings"] });
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to view your bookings
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="my_bookings.signin_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const approvedCount = bookings.filter(
    (b) => getStatusStr(b.status) === BookingStatus.approved,
  ).length;
  const pendingCount = bookings.filter(
    (b) => getStatusStr(b.status) === BookingStatus.pending,
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/" })}
          data-ocid="my_bookings.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">My Bookings</h1>
          <p className="text-xs text-muted-foreground">
            Your appointment history
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full glow-primary text-xs"
          onClick={() => navigate({ to: "/book" })}
          data-ocid="my_bookings.new_booking"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          New
        </Button>
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Stats */}
        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-5"
          >
            {[
              {
                label: "Total",
                value: bookings.length,
                color: "text-foreground",
              },
              {
                label: "Approved",
                value: approvedCount,
                color: "text-primary",
              },
              {
                label: "Pending",
                value: pendingCount,
                color: "text-yellow-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="glass-card rounded-2xl p-3 text-center border border-border/20"
              >
                <p className={`text-xl font-bold font-display ${color}`}>
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {(["a", "b", "c"] as const).map((k) => (
              <Skeleton key={k} className="h-36 rounded-3xl bg-card/50" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 text-center flex flex-col items-center gap-4 border border-primary/10"
            data-ocid="my_bookings.empty_state"
          >
            <div className="circle-icon w-16 h-16 bg-primary/10 border border-primary/30">
              <CalendarCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-gradient-gold">
              No Bookings Yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Find a verified dentist and book your first appointment today.
            </p>
            <Button
              className="rounded-full glow-primary"
              onClick={() => navigate({ to: "/find-dentist" })}
              data-ocid="my_bookings.find_cta"
            >
              <Zap className="w-4 h-4 mr-2" />
              Find a Dentist
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3" data-ocid="my_bookings.list">
            {bookings.map((bk, i) => {
              const statusStr = getStatusStr(bk.status);
              const urgencyStr = getStatusStr(bk.urgency);
              const statusColor =
                STATUS_COLORS[statusStr] ?? STATUS_COLORS.pending;
              const urgencyColor =
                URGENCY_COLORS[urgencyStr] ?? URGENCY_COLORS.routine;
              const isApproved = statusStr === BookingStatus.approved;

              // Resolve payment state
              const payRecordState =
                paymentByBookingId[bk.bookingId.toString()] ?? null;
              const internalPayStr = getStatusStr(bk.paymentStatus);
              let chipPayState: PaymentState | null = payRecordState;
              if (!chipPayState) {
                if (internalPayStr === "paid") chipPayState = PaymentState.paid;
                else if (internalPayStr === "refunded")
                  chipPayState = PaymentState.refunded;
                else chipPayState = PaymentState.pending;
              }
              const chip = paymentChipInfo(chipPayState);
              const isPaid = chipPayState === PaymentState.paid;

              return (
                <motion.div
                  key={bk.bookingId.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-3xl p-4 flex flex-col gap-3 border border-border/20"
                  style={
                    isApproved && !isPaid
                      ? {
                          border: "1px solid oklch(0.72 0.15 85 / 0.35)",
                        }
                      : {}
                  }
                  data-ocid={`my_bookings.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm text-foreground">
                          Booking #{Number(bk.bookingId)}
                        </p>
                        <Badge className={`text-xs ${urgencyColor}`}>
                          {urgencyStr}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Dentist: {bk.dentistEmail || "—"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 text-primary/60" />
                        <span>{bk.requestedDate || "Date not set"}</span>
                      </div>
                      {bk.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          Notes: {bk.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      <Badge className={`text-xs ${statusColor}`}>
                        {statusStr}
                      </Badge>
                      {/* Payment status HUD chip */}
                      <Badge
                        className={`text-xs flex items-center gap-1 ${chip.cls}`}
                        style={
                          chipPayState === PaymentState.paid
                            ? {
                                boxShadow: "0 0 8px oklch(0.55 0.18 145 / 0.4)",
                              }
                            : chipPayState === PaymentState.pending
                              ? {
                                  boxShadow:
                                    "0 0 8px oklch(0.72 0.15 85 / 0.3)",
                                }
                              : {}
                        }
                        data-ocid={`my_bookings.payment_chip.${i + 1}`}
                      >
                        <CreditCard className="w-2.5 h-2.5" />
                        {chip.label}
                      </Badge>
                      {bk.amountRupees > 0n && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <IndianRupee className="w-2.5 h-2.5" />
                          {Number(bk.amountRupees).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Stripe pay-now for approved unpaid bookings */}
                    {isApproved && !isPaid && actor && (
                      <PayNowButton
                        booking={bk}
                        urgencyStr={urgencyStr}
                        actor={actor}
                        onSuccess={refreshPayments}
                      />
                    )}

                    {/* Legacy mark paid (fallback if Stripe not available) */}
                    {isApproved && !isPaid && (
                      <Button
                        size="sm"
                        className="rounded-full bg-muted/50 text-muted-foreground border border-border/30 hover:bg-muted text-xs px-3 h-7"
                        onClick={() => markPaid(bk.bookingId, 0n)}
                        data-ocid={`my_bookings.mark_paid.${i + 1}`}
                      >
                        Mark Paid Manually
                      </Button>
                    )}

                    {(isApproved || statusStr === "completed") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-primary hover:bg-primary/10 text-xs px-3 h-7"
                        onClick={() =>
                          navigate({
                            to: "/messages/$bookingId",
                            params: { bookingId: bk.bookingId.toString() },
                          })
                        }
                        data-ocid={`my_bookings.chat.${i + 1}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        Message Dentist
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="py-5 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms
          </Link>
        </p>
        <p className="mt-1">
          Developed by Swanandi Manoj Vispute ·{" "}
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-primary hover:underline"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
