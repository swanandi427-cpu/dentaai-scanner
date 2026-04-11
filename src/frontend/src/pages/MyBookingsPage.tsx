import type { Booking } from "@/backend.d";
import { BookingStatus, PaymentStatusInternal } from "@/backend.d";
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
  IndianRupee,
  MessageSquare,
  Plus,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
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

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  paid: "bg-green-500/15 text-green-400 border-green-500/30",
  refunded: "bg-primary/10 text-primary border-primary/30",
};

const URGENCY_COLORS: Record<string, string> = {
  routine: "bg-primary/10 text-primary border-primary/30",
  urgent: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  emergency: "bg-red-500/15 text-red-400 border-red-500/30",
};

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
    } catch {
      toast.error("Failed to update payment");
    }
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
              const paymentStr = getStatusStr(bk.paymentStatus);
              const urgencyStr = getStatusStr(bk.urgency);
              const statusColor =
                STATUS_COLORS[statusStr] ?? STATUS_COLORS.pending;
              const paymentColor =
                PAYMENT_COLORS[paymentStr] ?? PAYMENT_COLORS.pending;
              const urgencyColor =
                URGENCY_COLORS[urgencyStr] ?? URGENCY_COLORS.routine;
              const isApproved = statusStr === BookingStatus.approved;

              return (
                <motion.div
                  key={bk.bookingId.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card rounded-3xl p-4 flex flex-col gap-3 border border-border/20"
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
                      <Badge className={`text-xs ${paymentColor}`}>
                        <IndianRupee className="w-2.5 h-2.5 mr-0.5" />
                        {paymentStr}
                      </Badge>
                      {bk.amountRupees > 0n && (
                        <span className="text-xs text-muted-foreground">
                          ₹{Number(bk.amountRupees).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isApproved && paymentStr === "pending" && (
                      <Button
                        size="sm"
                        className="rounded-full bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-xs px-3"
                        onClick={() => markPaid(bk.bookingId, 0n)}
                        data-ocid="my_bookings.mark_paid"
                      >
                        <IndianRupee className="w-3 h-3 mr-1" />
                        Mark Paid
                      </Button>
                    )}
                    {(isApproved || statusStr === "completed") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-primary hover:bg-primary/10 text-xs px-3"
                        onClick={() =>
                          navigate({
                            to: "/messages/$bookingId",
                            params: { bookingId: bk.bookingId.toString() },
                          })
                        }
                        data-ocid="my_bookings.chat"
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
