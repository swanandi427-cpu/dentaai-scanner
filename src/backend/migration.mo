import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

/// Migration: removes Stripe payment fields from Booking and drops payment-
/// specific stable variables (paymentRecords, dentistSubscriptions, nextPaymentIdRef).
/// The platform no longer handles payments — it is a pure matchmaking directory.
module {

  // ─── Old inline types (copied from .old/src/backend/main.mo) ─────────────

  type OldBookingUrgency = { #routine; #urgent; #emergency };
  type OldBookingStatus  = { #pending; #approved; #declined; #completed; #cancelled };
  type OldPaymentStatus  = { #pending; #paid; #refunded };

  type OldBooking = {
    bookingId     : Nat;
    patientId     : Principal;
    dentistEmail  : Text;
    requestedDate : Text;
    notes         : Text;
    urgency       : OldBookingUrgency;
    status        : OldBookingStatus;
    paymentStatus : OldPaymentStatus;
    amountRupees  : Nat;
    createdAt     : Time.Time;
  };

  // Old payment types (from .old/src/backend/types/payments.mo)
  type OldPaymentKind  = { #bookingFee; #reimbursement };
  type OldPaymentState = { #pending; #paid; #failed; #refunded };
  type OldPaymentRecord = {
    id              : Nat;
    kind            : OldPaymentKind;
    referenceId     : Nat;
    payer           : Principal;
    amountRupees    : Nat;
    stripeSessionId : Text;
    state           : OldPaymentState;
    createdAt       : Time.Time;
    settledAt       : ?Time.Time;
  };

  type OldSubscriptionTier  = { #free; #pro; #elite };
  type OldSubscriptionState = { #active; #cancelled; #expired };
  type OldDentistSubscription = {
    dentistId            : Principal;
    tier                 : OldSubscriptionTier;
    state                : OldSubscriptionState;
    stripeSubscriptionId : Text;
    monthlyAmountRupees  : Nat;
    startedAt            : Time.Time;
    renewsAt             : ?Time.Time;
  };

  // ─── New inline types (matching current main.mo) ──────────────────────────

  type NewBookingUrgency = { #routine; #urgent; #emergency };
  type NewBookingStatus  = { #pending; #approved; #declined; #completed; #cancelled };

  type NewBooking = {
    bookingId     : Nat;
    patientId     : Principal;
    dentistEmail  : Text;
    requestedDate : Text;
    notes         : Text;
    urgency       : NewBookingUrgency;
    status        : NewBookingStatus;
    createdAt     : Time.Time;
  };

  // ─── Actor state shapes ───────────────────────────────────────────────────

  type OldActor = {
    bookings             : Map.Map<Nat, OldBooking>;
    paymentRecords       : List.List<OldPaymentRecord>;
    dentistSubscriptions : Map.Map<Principal, OldDentistSubscription>;
    nextPaymentIdRef     : { var id : Nat };
  };

  type NewActor = {
    bookings : Map.Map<Nat, NewBooking>;
  };

  // ─── Migration function ───────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Strip paymentStatus and amountRupees from every booking.
    let bookings = old.bookings.map<Nat, OldBooking, NewBooking>(
      func(_id, b) {
        {
          bookingId     = b.bookingId;
          patientId     = b.patientId;
          dentistEmail  = b.dentistEmail;
          requestedDate = b.requestedDate;
          notes         = b.notes;
          urgency       = b.urgency;
          status        = b.status;
          createdAt     = b.createdAt;
        };
      }
    );
    // paymentRecords, dentistSubscriptions, nextPaymentIdRef are consumed
    // (input) but intentionally not produced (output) — they are dropped.
    ignore old.paymentRecords;
    ignore old.dentistSubscriptions;
    ignore old.nextPaymentIdRef.id;

    { bookings };
  };

};
