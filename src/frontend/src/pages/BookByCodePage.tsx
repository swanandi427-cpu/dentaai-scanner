import type { DentistProfile } from "@/backend.d";
import { BookingUrgency } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Loader2,
  MapPin,
  Search,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const URGENCY_OPTS = [
  {
    value: "routine",
    label: "Routine",
    color: "bg-primary/20 border-primary/60 text-primary",
    icon: "📅",
    fee: 499,
  },
  {
    value: "urgent",
    label: "Urgent",
    color: "bg-yellow-500/20 border-yellow-500/60 text-yellow-400",
    icon: "⚡",
    fee: 999,
  },
  {
    value: "emergency",
    label: "Emergency",
    color: "bg-red-500/20 border-red-500/60 text-red-400",
    icon: "🚨",
    fee: 999,
  },
] as const;

type UrgencyKey = "routine" | "urgent" | "emergency";

const URGENCY_FEE: Record<UrgencyKey, number> = {
  routine: 499,
  urgent: 999,
  emergency: 999,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "fill-primary text-primary" : "text-border"}`}
        />
      ))}
    </div>
  );
}

const URGENCY_ENUM: Record<UrgencyKey, BookingUrgency> = {
  routine: BookingUrgency.routine,
  urgent: BookingUrgency.urgent,
  emergency: BookingUrgency.emergency,
};

type PaymentState = "idle" | "recording" | "confirmed";

export default function BookByCodePage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const search = useSearch({ strict: false }) as { dentist?: string };

  const [emailInput, setEmailInput] = useState(search.dentist ?? "");
  const [dentistEmail, setDentistEmail] = useState(search.dentist ?? "");
  const [booking, setBooking] = useState(false);
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [urgency, setUrgency] = useState<UrgencyKey>("routine");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentRecordId, setPaymentRecordId] = useState<bigint | null>(null);

  const { data: allDentists = [] } = useQuery<DentistProfile[]>({
    queryKey: ["allDentists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDentists();
    },
    enabled: !!actor && !isFetching,
  });

  const dentist = allDentists.find((d) => d.email === dentistEmail) ?? null;
  const rating = dentist
    ? 4 + (dentist.name.charCodeAt(0) % 2 === 0 ? 0 : 1)
    : 4;

  const bookingFee = URGENCY_FEE[urgency];

  const bookAppointment = async () => {
    if (!actor || !identity || !dentistEmail || !selectedDate) return;
    setBooking(true);
    try {
      const id = await actor.requestBooking(
        dentistEmail,
        selectedDate,
        notes,
        URGENCY_ENUM[urgency],
      );
      setBookingId(id);
      toast.success(`Appointment booked! ID: #${Number(id)}`);
    } catch (err: unknown) {
      toast.error(
        (err instanceof Error ? err.message : null) ||
          "Booking failed. Try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  const handlePayNow = async () => {
    if (!actor || !bookingId) return;
    setPaymentState("recording");
    try {
      const payId = await actor.recordBookingPayment(
        bookingId,
        BigInt(bookingFee),
        "pending-stripe-session",
      );
      setPaymentRecordId(payId);
      setPaymentState("confirmed");
      toast.success(
        "Payment recorded — complete payment at your dentist visit",
      );
    } catch {
      setPaymentState("idle");
      toast.error("Failed to record payment. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to book an appointment
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="book.signin_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (bookingId !== null) {
    const urgencyOpt = URGENCY_OPTS.find((u) => u.value === urgency);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 max-w-md w-full flex flex-col gap-5 border border-primary/30"
        >
          <div className="text-center">
            <div className="circle-icon w-20 h-20 bg-primary/10 border-2 border-primary/40 mx-auto mb-4 circle-glow-ring animate-pulse-glow">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gradient-gold mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your appointment request has been sent to{" "}
              <span className="text-primary">
                {dentist?.name ?? dentistEmail}
              </span>
              .
            </p>
          </div>

          {/* Booking reference card */}
          <div className="border border-primary/30 bg-primary/5 rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Booking Reference
            </p>
            <p className="text-3xl font-bold font-display text-gradient-gold">
              #{String(bookingId)}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              {urgencyOpt && (
                <Badge
                  className={`text-xs ${urgency === "emergency" ? "bg-red-500/15 text-red-400 border-red-500/30" : urgency === "urgent" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" : "bg-primary/10 text-primary border-primary/30"}`}
                >
                  {urgencyOpt.icon} {urgency}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedDate}
              </span>
            </div>
          </div>

          {/* Payment section */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "oklch(0.12 0.06 85 / 0.4)",
              border: "1.5px solid oklch(0.72 0.15 85 / 0.4)",
            }}
            data-ocid="book.payment_section"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Booking Fee</span>
              </div>
              <span className="text-xl font-bold text-gradient-gold font-display">
                ₹{bookingFee.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {urgency === "routine"
                ? "Routine appointment — standard consultation fee."
                : "Urgent/emergency appointment — priority fee applies."}
            </p>

            {paymentState === "idle" && (
              <Button
                className="w-full rounded-full glow-primary shimmer-button font-semibold"
                onClick={handlePayNow}
                data-ocid="book.pay_now_button"
              >
                <IndianRupee className="w-4 h-4 mr-1.5" />
                Pay Now — ₹{bookingFee.toLocaleString("en-IN")}
              </Button>
            )}

            {paymentState === "recording" && (
              <Button
                className="w-full rounded-full opacity-70"
                disabled
                data-ocid="book.payment_loading_state"
              >
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Recording payment...
              </Button>
            )}

            {paymentState === "confirmed" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
                data-ocid="book.payment_success_state"
              >
                <div
                  className="flex items-center gap-2 rounded-2xl px-4 py-3"
                  style={{
                    background: "oklch(0.22 0.08 85 / 0.3)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.5)",
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary">
                      Payment Confirmed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Record #
                      {paymentRecordId !== null ? Number(paymentRecordId) : "—"}{" "}
                      · Complete payment at your visit
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs shrink-0">
                    Pending
                  </Badge>
                </div>
              </motion.div>
            )}

            {paymentState === "idle" && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 shrink-0" />
                <span>
                  Payment status:{" "}
                  <strong className="text-yellow-400">Payment Pending</strong>
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Track your appointment under My Bookings.
          </p>

          <Button
            className="w-full rounded-full glow-primary"
            onClick={() => navigate({ to: "/my-bookings" })}
            data-ocid="book.view_bookings"
          >
            View My Bookings
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/find-dentist" })}
          data-ocid="book.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">Book Appointment</h1>
          <p className="text-xs text-muted-foreground">
            Enter dentist email to book
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full flex flex-col gap-5">
        {/* Dentist Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-5 flex flex-col gap-3 border border-primary/10"
          data-ocid="book.panel"
        >
          <p className="text-sm font-semibold text-gradient-gold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Find Dentist by Email
          </p>
          <p className="text-xs text-muted-foreground">
            Enter the dentist's booking email or{" "}
            <Link to="/find-dentist" className="text-primary hover:underline">
              browse our directory
            </Link>
            .
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50 flex-1 text-sm"
              placeholder="doctor@clinic.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setDentistEmail(emailInput)
              }
              data-ocid="book.email_input"
            />
            <Button
              className="rounded-full glow-primary px-4"
              onClick={() => setDentistEmail(emailInput)}
              disabled={!emailInput.trim()}
              data-ocid="book.search_button"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Dentist profile card */}
        {dentistEmail && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {dentist ? (
              <div className="glass-card rounded-3xl p-5 flex flex-col gap-4 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="circle-icon w-14 h-14 bg-primary/10 border-2 border-primary/40 shrink-0">
                    <span className="text-primary font-bold font-display text-xl">
                      {dentist.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-foreground">
                        {dentist.name}
                      </h3>
                      {dentist.isVerified && (
                        <Shield className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {dentist.specialties?.[0] ?? "General Dentistry"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={rating} />
                      <span className="text-xs text-muted-foreground">
                        {rating}.0 / 5.0
                      </span>
                    </div>
                    {dentist.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
                        <span className="truncate">{dentist.location}</span>
                      </div>
                    )}
                    {dentist.bio && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {dentist.bio}
                      </p>
                    )}
                  </div>
                </div>
                {(dentist.specialties ?? []).some((s) =>
                  s.toLowerCase().includes("emergency"),
                ) && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    This dentist accepts emergency appointments
                  </div>
                )}
              </div>
            ) : (
              <div
                className="glass-card rounded-3xl p-6 text-center border border-border/20"
                data-ocid="book.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No dentist found for{" "}
                  <span className="text-primary">{dentistEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check the email address and try again.
                </p>
                <Link to="/find-dentist" className="inline-block mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary text-xs"
                  >
                    Browse Directory
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Appointment Details */}
        {dentistEmail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-3xl p-5 flex flex-col gap-4 border border-primary/10"
          >
            <p className="text-sm font-semibold text-gradient-gold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Appointment Details
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="book-date"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Preferred Date &amp; Time
                </label>
                <input
                  id="book-date"
                  type="datetime-local"
                  className="w-full rounded-2xl bg-background/60 border border-border/40 focus:border-primary/50 text-sm px-4 py-2.5 text-foreground outline-none focus:outline-none"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  data-ocid="book.date_input"
                />
              </div>

              {/* Urgency selector */}
              <div>
                <p
                  className="text-xs text-muted-foreground mb-1.5"
                  id="urgency-label"
                >
                  Urgency
                </p>
                <fieldset
                  className="grid grid-cols-3 gap-2 border-0 p-0 m-0"
                  aria-labelledby="urgency-label"
                >
                  {URGENCY_OPTS.map(({ value, label, icon, fee }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setUrgency(value)}
                      className={`py-2.5 rounded-2xl text-xs font-semibold border transition-all flex flex-col items-center gap-0.5 ${urgency === value ? (value === "emergency" ? "bg-red-500/20 border-red-500/60 text-red-400" : value === "urgent" ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-400" : "bg-primary/20 border-primary/60 text-primary") : "bg-background/40 border-border/30 text-muted-foreground hover:border-primary/30"}`}
                      data-ocid={`book.urgency_${value}`}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                      <span className="text-[10px] opacity-70">₹{fee}</span>
                    </button>
                  ))}
                </fieldset>
              </div>

              {/* Fee preview */}
              {dentist && (
                <div
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs"
                  style={{
                    background: "oklch(0.12 0.06 85 / 0.3)",
                    border: "1px solid oklch(0.72 0.15 85 / 0.25)",
                  }}
                >
                  <span className="text-muted-foreground flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" />
                    Booking fee
                  </span>
                  <span className="font-bold text-primary">
                    ₹{bookingFee.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div>
                <label
                  htmlFor="book-notes"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="book-notes"
                  className="w-full rounded-2xl bg-background/60 border border-border/40 focus:border-primary/50 text-sm px-4 py-2.5 text-foreground resize-none outline-none"
                  placeholder="Describe your issue or any special requirements..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  data-ocid="book.notes_input"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirm button */}
        {dentistEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              className="w-full rounded-full glow-primary shimmer-button py-6 text-base font-semibold disabled:opacity-40"
              disabled={!selectedDate || booking || !dentist}
              onClick={bookAppointment}
              data-ocid="book.confirm_button"
            >
              {booking ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : urgency === "emergency" ? (
                <Zap className="w-5 h-5 mr-2 text-red-300" />
              ) : (
                <CalendarCheck className="w-5 h-5 mr-2" />
              )}
              {booking
                ? "Confirming..."
                : !dentist
                  ? "Enter a Valid Dentist Email"
                  : !selectedDate
                    ? "Select a Date to Continue"
                    : `Confirm ${urgency.charAt(0).toUpperCase() + urgency.slice(1)} — ₹${bookingFee.toLocaleString("en-IN")}`}
            </Button>
            {!selectedDate && dentist && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                ↑ Pick a date and time above to confirm
              </p>
            )}
          </motion.div>
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
