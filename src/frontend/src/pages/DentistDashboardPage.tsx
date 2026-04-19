import type {
  AvailabilitySlot,
  Booking,
  DentistProfile,
  ReimbursementRequest,
} from "@/backend.d";
import { BookingStatus, PaymentStatusInternal } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMySubscription } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CalendarPlus,
  Check,
  CheckCircle,
  Copy,
  Crown,
  IndianRupee,
  Loader2,
  MessageSquare,
  Shield,
  Star,
  Stethoscope,
  Trash2,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function getStatusStr(status: unknown): string {
  if (typeof status === "string") return status;
  return Object.keys(status as Record<string, unknown>)[0];
}

function bookingStatusColor(status: string) {
  if (status === "approved")
    return "bg-primary/10 text-primary border-primary/30";
  if (status === "declined")
    return "bg-destructive/10 text-destructive border-destructive/30";
  if (status === "completed")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (status === "cancelled")
    return "bg-muted text-muted-foreground border-border";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"; // pending
}

function urgencyBadgeColor(urgency: string) {
  if (urgency === "emergency")
    return "bg-red-500/15 text-red-400 border-red-500/30";
  if (urgency === "urgent")
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  return "bg-primary/10 text-primary border-primary/30";
}

function reimbStatusColor(status: string): string {
  if (status === "approved")
    return "bg-green-500/15 text-green-400 border-green-500/30";
  if (status === "declined")
    return "bg-destructive/10 text-destructive border-destructive/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
}

function PaymentUpdatePanel({
  bookingId,
  onSuccess,
}: { bookingId: bigint; onSuccess: () => void }) {
  const { actor } = useActor();
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const markPaid = async () => {
    if (!actor || !amount) return;
    setSaving(true);
    try {
      await actor.updatePaymentStatus(
        bookingId,
        PaymentStatusInternal.paid,
        BigInt(amount),
      );
      toast.success("Payment marked as paid!");
      onSuccess();
    } catch {
      toast.error("Failed to update payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="relative flex-1">
        <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-7 rounded-xl bg-background/60 border-border/40 focus:border-primary/50 h-8 text-xs"
        />
      </div>
      <Button
        size="sm"
        className="rounded-full bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-xs px-3 h-8"
        onClick={markPaid}
        disabled={saving || !amount}
        data-ocid="dentist_dashboard.mark_paid"
      >
        {saving ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <IndianRupee className="w-3 h-3 mr-1" />
        )}
        Mark Paid
      </Button>
    </div>
  );
}

export default function DentistDashboardPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const { data: mySubscription } = useMySubscription();

  const [profile, setProfile] = useState<DentistProfile | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reimbRequests, setReimbRequests] = useState<ReimbursementRequest[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);

  const loadData = useCallback(async () => {
    if (!actor || isFetching || !identity) return;
    const p = identity.getPrincipal();
    try {
      const [prof, sl, bk, reimb] = await Promise.all([
        actor.getDentistProfile(p),
        actor.getAvailabilitySlots(p),
        actor.getDentistBookings(),
        actor
          .getReimbursementRequests()
          .catch(() => [] as ReimbursementRequest[]),
      ]);
      setProfile(prof);
      setSlots(sl);
      setBookings(bk);
      setReimbRequests(reimb);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching, identity]);

  useEffect(() => {
    if (!actor || isFetching || !identity) {
      if (!isFetching) setLoading(false);
      return;
    }
    void loadData();
  }, [actor, isFetching, identity, loadData]);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile?.email ?? "");
    toast.success("Email copied!");
  };

  const addSlot = async () => {
    if (!actor || !newSlot.trim() || !identity) return;
    setAddingSlot(true);
    try {
      await actor.registerAvailabilitySlot(newSlot.trim());
      const updated = await actor.getAvailabilitySlots(identity.getPrincipal());
      setSlots(updated);
      setNewSlot("");
      toast.success("Slot added!");
    } catch {
      toast.error("Failed to add slot");
    } finally {
      setAddingSlot(false);
    }
  };

  const removeSlot = async (slotId: bigint) => {
    if (!actor) return;
    try {
      await actor.updateAvailabilitySlot(slotId, "DELETED");
      setSlots((prev) => prev.filter((s) => s.slotId !== slotId));
      toast.success("Slot removed");
    } catch {
      toast.error("Failed to remove slot");
    }
  };

  const approveBooking = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.approveBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: BookingStatus.approved }
            : b,
        ),
      );
      toast.success("Booking approved!");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const declineBooking = async (bookingId: bigint) => {
    if (!actor) return;
    try {
      await actor.declineBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId
            ? { ...b, status: BookingStatus.declined }
            : b,
        ),
      );
      toast.success("Booking declined");
    } catch {
      toast.error("Failed to decline");
    }
  };

  const settleReimbursement = async (requestId: bigint, approve: boolean) => {
    if (!actor) return;
    try {
      if (approve) {
        await actor.approveReimbursementRequest(requestId);
      } else {
        await actor.declineReimbursementRequest(
          requestId,
          "Declined by dentist",
        );
      }
      const newStatus = approve ? "approved" : "declined";
      setReimbRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: newStatus as typeof r.status }
            : r,
        ),
      );
      toast.success(
        approve ? "Reimbursement approved!" : "Reimbursement declined",
      );
    } catch {
      toast.error("Failed to settle reimbursement");
    }
  };

  const pendingBookings = bookings.filter(
    (b) => getStatusStr(b.status) === "pending",
  );

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm">
          Sign in to access your dashboard
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="dentist_dashboard.signin_button"
        >
          Sign In
        </Button>
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
          onClick={() => navigate({ to: "/" })}
          data-ocid="dentist_dashboard.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">
            Dentist Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            {profile?.name ?? "Your portal"}
          </p>
        </div>
        {pendingBookings.length > 0 && (
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs">
            {pendingBookings.length} pending
          </Badge>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !profile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 text-center flex flex-col items-center gap-4 border border-primary/20"
            data-ocid="dentist_dashboard.panel"
          >
            <div className="circle-icon w-16 h-16 bg-primary/10 border-2 border-primary/40">
              <Stethoscope className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl text-gradient-gold">
              Not Registered Yet
            </h2>
            <p className="text-sm text-muted-foreground">
              Register as a dentist to access your dashboard and start receiving
              patient bookings.
            </p>
            <Button
              className="rounded-full glow-primary shimmer-button"
              onClick={() => navigate({ to: "/dentist-register" })}
              data-ocid="dentist_dashboard.register_button"
            >
              Register as Dentist
            </Button>
          </motion.div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList
              className="w-full rounded-2xl bg-muted/30 mb-6 h-auto p-1 flex flex-wrap gap-1"
              data-ocid="dentist_dashboard.tab"
            >
              {[
                { v: "profile", label: "Profile", icon: User },
                { v: "availability", label: "Slots", icon: Calendar },
                { v: "bookings", label: "Bookings", icon: CheckCircle },
                { v: "passport", label: "Passport", icon: Shield },
              ].map(({ v, label, icon: Icon }) => (
                <TabsTrigger
                  key={v}
                  value={v}
                  className="flex-1 rounded-xl flex items-center justify-center gap-1.5 text-xs py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {v === "bookings" && pendingBookings.length > 0 && (
                    <span className="ml-0.5 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {pendingBookings.length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="glass-card rounded-3xl p-5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="circle-icon w-12 h-12 bg-primary/10 border border-primary/40">
                      <span className="text-primary font-bold text-lg">
                        {profile.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(profile.specialties ?? [])[0] ?? "General Dentistry"}
                      </p>
                    </div>
                    {profile.isVerified && (
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {[
                      { label: "Email", value: profile.email },
                      { label: "License", value: profile.licenseNumber },
                      { label: "Location", value: profile.location },
                      {
                        label: "Specialties",
                        value: (profile.specialties ?? []).join(", "),
                      },
                    ].map(({ label, value }) => (
                      <p key={label} className="text-xs">
                        <span className="text-muted-foreground">{label}: </span>
                        <span className="text-foreground">{value || "—"}</span>
                      </p>
                    ))}
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Booking Email */}
                <div className="glass-card rounded-3xl p-5 border border-primary/10">
                  <p className="text-sm font-semibold text-gradient-gold mb-1">
                    Your Booking Email
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Share this with patients to receive bookings.
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-primary/10 border border-primary/30 rounded-2xl px-3 py-2 text-primary break-all">
                      {profile.email || "No email set"}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full h-9 w-9 border border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                      onClick={copyEmail}
                      disabled={!profile.email}
                      data-ocid="dentist_dashboard.copy_email"
                      aria-label="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Subscription Tier */}
                <div
                  className="glass-card rounded-3xl p-5 flex flex-col gap-3"
                  style={{
                    border:
                      mySubscription?.tier === "elite"
                        ? "1.5px solid oklch(0.72 0.18 75 / 0.5)"
                        : mySubscription?.tier === "pro"
                          ? "1.5px solid oklch(0.78 0.16 80 / 0.5)"
                          : "1px solid oklch(0.35 0.03 70 / 0.5)",
                  }}
                  data-ocid="dentist_dashboard.subscription_panel"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gradient-gold">
                      Subscription Plan
                    </p>
                    <Badge
                      className={`text-xs font-bold uppercase tracking-wider ${mySubscription?.tier === "elite" ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : mySubscription?.tier === "pro" ? "bg-primary/15 text-primary border-primary/40" : "bg-muted/50 text-muted-foreground border-border"}`}
                      style={
                        mySubscription?.tier === "elite"
                          ? { boxShadow: "0 0 10px oklch(0.72 0.18 75 / 0.3)" }
                          : mySubscription?.tier === "pro"
                            ? {
                                boxShadow: "0 0 10px oklch(0.78 0.16 80 / 0.3)",
                              }
                            : {}
                      }
                    >
                      {mySubscription?.tier === "elite" ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Elite
                        </>
                      ) : mySubscription?.tier === "pro" ? (
                        <>
                          <Star className="w-3 h-3 mr-1" />
                          Pro
                        </>
                      ) : (
                        "Free"
                      )}
                    </Badge>
                  </div>
                  {mySubscription ? (
                    <div className="text-xs text-muted-foreground flex flex-col gap-0.5">
                      <p>
                        <span className="text-foreground font-medium">
                          ₹
                          {Number(
                            mySubscription.monthlyAmountRupees,
                          ).toLocaleString("en-IN")}
                        </span>
                        /month ·{" "}
                        <span
                          className={
                            mySubscription.state === "active"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }
                        >
                          {mySubscription.state}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      You are on the Free plan.
                    </p>
                  )}
                  <Link to="/pricing">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-primary/30 text-primary text-xs w-full"
                      data-ocid="dentist_dashboard.upgrade_plan"
                    >
                      {mySubscription?.tier === "free" || !mySubscription
                        ? "Upgrade to Pro"
                        : "Manage Plan"}
                    </Button>
                  </Link>
                </div>

                {/* Passport Quick Links */}
                <div className="glass-card rounded-3xl p-5 border border-primary/10 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-gradient-gold mb-1">
                    Dental Passport Tools
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      className="rounded-full glow-primary text-xs"
                      onClick={() => navigate({ to: "/issue-passport" })}
                      data-ocid="dentist_dashboard.issue_passport"
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1" />
                      Issue a Passport
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-primary/30 text-primary text-xs"
                      onClick={() => navigate({ to: "/passport-lookup" })}
                      data-ocid="dentist_dashboard.lookup_passport"
                    >
                      Lookup Patient Passport
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="glass-card rounded-3xl p-5 border border-primary/10">
                  <p className="text-sm font-semibold text-gradient-gold mb-3 flex items-center gap-2">
                    <CalendarPlus className="w-4 h-4 text-primary" />
                    Add Available Slot
                  </p>
                  <div className="flex gap-2">
                    <Input
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50 flex-1"
                      placeholder="e.g. Mon 25 Dec 10:00 AM"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSlot()}
                      data-ocid="dentist_dashboard.slot_input"
                    />
                    <Button
                      className="rounded-full glow-primary px-4"
                      onClick={addSlot}
                      disabled={addingSlot || !newSlot.trim()}
                      data-ocid="dentist_dashboard.add_slot"
                    >
                      {addingSlot ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CalendarPlus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {slots.length === 0 ? (
                    <div
                      className="glass-card rounded-3xl p-6 text-center border border-border/20"
                      data-ocid="dentist_dashboard.empty_state"
                    >
                      <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                      <p className="text-sm text-muted-foreground">
                        No slots added yet.
                      </p>
                    </div>
                  ) : (
                    slots.map((slot, i) => (
                      <motion.div
                        key={slot.slotId.toString()}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between border border-border/20"
                        data-ocid={`dentist_dashboard.slot.${i + 1}`}
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {slot.dateTimeLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {slot.isBooked ? "Booked" : "Available"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              slot.isBooked
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs"
                                : "bg-primary/10 text-primary border-primary/30 text-xs"
                            }
                          >
                            {slot.isBooked ? "Booked" : "Open"}
                          </Badge>
                          {!slot.isBooked && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeSlot(slot.slotId)}
                              aria-label="Remove slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {bookings.length === 0 ? (
                  <div
                    className="glass-card rounded-3xl p-8 text-center border border-border/20"
                    data-ocid="dentist_dashboard.empty_state"
                  >
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      No bookings yet.
                    </p>
                  </div>
                ) : (
                  bookings.map((bk, i) => {
                    const statusStr = getStatusStr(bk.status);
                    const urgencyStr = getStatusStr(bk.urgency);
                    const paymentStr = getStatusStr(bk.paymentStatus);
                    return (
                      <motion.div
                        key={bk.bookingId.toString()}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card rounded-3xl p-4 flex flex-col gap-3 border border-border/20"
                        data-ocid={`dentist_dashboard.booking.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="text-sm font-semibold">
                                Booking #{Number(bk.bookingId)}
                              </p>
                              <Badge
                                className={`text-xs ${urgencyBadgeColor(urgencyStr)}`}
                              >
                                {urgencyStr}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Patient: {bk.patientId.toString().slice(0, 16)}…
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Date: {bk.requestedDate || "—"}
                            </p>
                            {bk.notes && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                Notes: {bk.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            <Badge
                              className={`text-xs ${bookingStatusColor(statusStr)}`}
                            >
                              {statusStr}
                            </Badge>
                            {bk.amountRupees > 0n && (
                              <span className="text-xs text-muted-foreground">
                                ₹
                                {Number(bk.amountRupees).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Payment status row */}
                        {paymentStr !== "pending" && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <IndianRupee className="w-3 h-3 text-muted-foreground" />
                            <span
                              className={`font-medium ${paymentStr === "paid" ? "text-green-400" : "text-muted-foreground"}`}
                            >
                              Payment: {paymentStr}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {statusStr === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 text-xs px-3"
                                onClick={() => approveBooking(bk.bookingId)}
                                data-ocid="dentist_dashboard.approve_booking"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="rounded-full text-destructive hover:bg-destructive/10 text-xs px-3"
                                onClick={() => declineBooking(bk.bookingId)}
                                data-ocid="dentist_dashboard.decline_booking"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}
                          {statusStr === "approved" &&
                            paymentStr === "pending" && (
                              <PaymentUpdatePanel
                                bookingId={bk.bookingId}
                                onSuccess={loadData}
                              />
                            )}
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
                            data-ocid="dentist_dashboard.chat"
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </TabsContent>

            {/* Passport Tab */}
            <TabsContent value="passport">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="glass-card rounded-3xl p-4 flex items-start gap-3 border border-primary/20 bg-primary/5">
                  <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Reimbursement requests from traveling dentists who treated
                    your patients. Approve or decline — payment settled minus{" "}
                    <span className="text-primary font-semibold">
                      8% platform fee
                    </span>
                    .
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="rounded-full glow-primary text-xs"
                    onClick={() => navigate({ to: "/issue-passport" })}
                    data-ocid="dentist_dashboard.issue_passport"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    Issue Passport
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary text-xs"
                    onClick={() => navigate({ to: "/passport-lookup" })}
                    data-ocid="dentist_dashboard.lookup"
                  >
                    Lookup Patient
                  </Button>
                </div>

                <h3 className="font-display font-semibold text-sm text-gradient-gold">
                  Incoming Reimbursement Requests
                </h3>

                {reimbRequests.length === 0 ? (
                  <div
                    className="glass-card rounded-3xl p-8 text-center border border-border/20"
                    data-ocid="dentist_dashboard.empty_state"
                  >
                    <p className="text-sm text-muted-foreground">
                      No reimbursement requests yet.
                    </p>
                  </div>
                ) : (
                  reimbRequests.map((req, i) => {
                    const statusStr = getStatusStr(req.status);
                    return (
                      <motion.div
                        key={req.id.toString()}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card rounded-3xl p-4 flex flex-col gap-3 border border-border/20"
                        data-ocid={`dentist_dashboard.reimb.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Request #{Number(req.id)} · Code:{" "}
                              {req.passportCode}
                            </p>
                            <p className="text-sm font-medium line-clamp-2 mt-0.5">
                              {req.treatmentDetails}
                            </p>
                          </div>
                          <Badge
                            className={`text-xs shrink-0 ${reimbStatusColor(statusStr)}`}
                          >
                            {statusStr}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            {
                              label: "Amount",
                              value: `₹${Number(req.amountRupees).toLocaleString("en-IN")}`,
                              color: "text-primary",
                            },
                            {
                              label: "Platform Fee",
                              value: `₹${Number(req.platformFeeRupees).toLocaleString("en-IN")}`,
                              color: "text-muted-foreground",
                            },
                            {
                              label: "You Pay",
                              value: `₹${Number(req.netAmountRupees).toLocaleString("en-IN")}`,
                              color: "text-green-400",
                            },
                          ].map(({ label, value, color }) => (
                            <div
                              key={label}
                              className="glass-card rounded-xl p-2"
                            >
                              <p className="text-xs text-muted-foreground">
                                {label}
                              </p>
                              <p className={`text-sm font-bold ${color}`}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                        {statusStr === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 text-xs px-3 flex-1"
                              onClick={() => settleReimbursement(req.id, true)}
                              data-ocid="dentist_dashboard.approve_reimb"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full text-destructive hover:bg-destructive/10 text-xs px-3 flex-1"
                              onClick={() => settleReimbursement(req.id, false)}
                              data-ocid="dentist_dashboard.decline_reimb"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
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
