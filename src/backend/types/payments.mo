import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {

  // ─── Stripe checkout session ──────────────────────────────────────────────

  /// Outcome of a Stripe checkout creation attempt.
  public type CheckoutResult = {
    #ok : { sessionId : Text; url : Text };
    #err : Text;
  };

  // ─── Payment record (booking fee or reimbursement) ───────────────────────

  public type PaymentKind = {
    #bookingFee;
    #reimbursement;
  };

  public type PaymentState = {
    #pending;
    #paid;
    #failed;
    #refunded;
  };

  /// Booking urgency — mirrors main.mo BookingUrgency for fee computation.
  public type BookingUrgency = {
    #routine;
    #urgent;
    #emergency;
  };

  /// Breakdown of a computed booking fee.
  public type BookingFeeBreakdown = {
    baseAmountRupees   : Nat;
    platformFeeRupees  : Nat;
    totalAmountRupees  : Nat;
    urgency            : BookingUrgency;
  };

  /// Breakdown of a computed reimbursement fee.
  public type ReimbursementFeeBreakdown = {
    grossAmountRupees  : Nat;
    platformFeeRupees  : Nat;
    netAmountRupees    : Nat;
  };

  /// Stored per booking-fee or reimbursement payment.
  public type PaymentRecord = {
    id : Nat;
    kind : PaymentKind;
    /// bookingId for #bookingFee, reimbursementRequestId for #reimbursement
    referenceId : Nat;
    payer : Principal;
    amountRupees : Nat;
    stripeSessionId : Text;
    state : PaymentState;
    createdAt : Time.Time;
    settledAt : ?Time.Time;
  };

  // ─── Dentist subscription tiers ──────────────────────────────────────────

  public type SubscriptionTier = {
    #free;
    #pro;
    #elite;
  };

  public type SubscriptionState = {
    #active;
    #cancelled;
    #expired;
  };

  /// Per-dentist subscription record.
  public type DentistSubscription = {
    dentistId : Principal;
    tier : SubscriptionTier;
    state : SubscriptionState;
    stripeSubscriptionId : Text;
    /// Amount charged per billing cycle in Rupees (for display only).
    monthlyAmountRupees : Nat;
    startedAt : Time.Time;
    renewsAt : ?Time.Time;
  };

  // ─── Pricing tier info (static, returned for display) ────────────────────

  public type TierInfo = {
    tier : SubscriptionTier;
    name : Text;
    monthlyAmountRupees : Nat;
    yearlyAmountRupees  : Nat;
    features : [Text];
  };

};
