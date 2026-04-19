import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import T "../types/payments";
import PaymentsLib "../lib/payments";

/// Public API mixin for the payments domain.
/// State slices are injected by main.mo via mixin parameters.
mixin (
  payments          : List.List<T.PaymentRecord>,
  subscriptions     : Map.Map<Principal, T.DentistSubscription>,
  nextPaymentIdRef  : { var id : Nat },
) {

  // ─── Pricing catalogue ───────────────────────────────────────────────────

  /// Return the static pricing tier catalogue (Free / Pro / Elite).
  public query func getPricingTiers() : async [T.TierInfo] {
    PaymentsLib.getTierCatalogue();
  };

  // ─── Fee computation queries ──────────────────────────────────────────────

  /// Compute the total booking fee for the given urgency level.
  /// Routine → ₹499 base + 8 % platform fee = ₹539.
  /// Urgent / Emergency → ₹999 base + 8 % platform fee = ₹1079.
  /// Call this before creating a Stripe Checkout session on the frontend.
  public query func getBookingFee(urgency : T.BookingUrgency) : async T.BookingFeeBreakdown {
    PaymentsLib.computeBookingFee(urgency);
  };

  /// Compute the reimbursement net payout for a given gross amount.
  /// Platform deducts 8 %; home dentist receives the net amount.
  public query func getReimbursementFee(grossAmountRupees : Nat) : async T.ReimbursementFeeBreakdown {
    PaymentsLib.computeReimbursementFee(grossAmountRupees);
  };

  // ─── Subscription management ─────────────────────────────────────────────

  /// Return the calling dentist's active subscription, or null.
  public query ({ caller }) func getMySubscription() : async ?T.DentistSubscription {
    PaymentsLib.getSubscription(subscriptions, caller);
  };

  /// Return a dentist's subscription by principal (self only).
  public query ({ caller }) func getDentistSubscription(dentistId : Principal) : async ?T.DentistSubscription {
    if (caller != dentistId) {
      Runtime.trap("Unauthorized: Can only view your own subscription");
    };
    PaymentsLib.getSubscription(subscriptions, dentistId);
  };

  /// Upsert a dentist subscription after Stripe webhook confirmation.
  /// Called by the frontend after a successful Stripe subscription checkout.
  public shared ({ caller }) func setDentistSubscription(
    dentistId            : Principal,
    tier                 : T.SubscriptionTier,
    stripeSubscriptionId : Text,
    monthlyAmountRupees  : Nat,
  ) : async () {
    if (caller != dentistId) {
      Runtime.trap("Unauthorized: Can only set your own subscription");
    };
    PaymentsLib.upsertSubscription(subscriptions, dentistId, tier, stripeSubscriptionId, monthlyAmountRupees);
  };

  /// Cancel the calling dentist's subscription.
  public shared ({ caller }) func cancelMySubscription() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to cancel a subscription");
    };
    PaymentsLib.cancelSubscription(subscriptions, caller);
  };

  // ─── Payment records ─────────────────────────────────────────────────────

  /// Return all payment records for the calling user.
  public query ({ caller }) func getMyPayments() : async [T.PaymentRecord] {
    PaymentsLib.getPaymentsByPayer(payments, caller);
  };

  /// Return the payment record for a specific booking fee.
  public query ({ caller }) func getBookingPayment(bookingId : Nat) : async ?T.PaymentRecord {
    PaymentsLib.getPaymentByReference(payments, #bookingFee, bookingId);
  };

  /// Return the payment record for a specific reimbursement.
  public query ({ caller }) func getReimbursementPayment(reimbursementId : Nat) : async ?T.PaymentRecord {
    PaymentsLib.getPaymentByReference(payments, #reimbursement, reimbursementId);
  };

  /// Record a new booking-fee payment intent.
  /// amountRupees MUST equal getBookingFee(urgency).totalAmountRupees for the booking.
  /// stripeSessionId is obtained by the frontend from the Stripe Checkout Session API.
  public shared ({ caller }) func recordBookingPayment(
    bookingId       : Nat,
    amountRupees    : Nat,
    stripeSessionId : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to record a payment");
    };
    if (stripeSessionId.size() == 0) {
      Runtime.trap("stripeSessionId must not be empty");
    };
    let id = PaymentsLib.createPaymentRecord(
      payments,
      nextPaymentIdRef.id,
      #bookingFee,
      bookingId,
      caller,
      amountRupees,
      stripeSessionId,
    );
    nextPaymentIdRef.id += 1;
    id;
  };

  /// Record a new reimbursement payment intent.
  /// amountRupees is the gross amount; platform deducts 8 % at settlement.
  /// stripeSessionId is obtained by the frontend from the Stripe Checkout Session API.
  public shared ({ caller }) func recordReimbursementPayment(
    reimbursementId : Nat,
    amountRupees    : Nat,
    stripeSessionId : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to record a payment");
    };
    if (stripeSessionId.size() == 0) {
      Runtime.trap("stripeSessionId must not be empty");
    };
    let id = PaymentsLib.createPaymentRecord(
      payments,
      nextPaymentIdRef.id,
      #reimbursement,
      reimbursementId,
      caller,
      amountRupees,
      stripeSessionId,
    );
    nextPaymentIdRef.id += 1;
    id;
  };

  /// Mark a payment as paid by Stripe session ID.
  /// Called on Stripe success redirect or webhook reconciliation.
  /// Transitions state: #pending → #paid.
  public shared ({ caller }) func confirmPayment(stripeSessionId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to confirm a payment");
    };
    PaymentsLib.markPaymentPaid(payments, stripeSessionId);
  };

  /// Mark a payment as failed by Stripe session ID.
  /// Called on Stripe cancel redirect or webhook reconciliation.
  /// Transitions state: #pending → #failed.
  public shared ({ caller }) func failPayment(stripeSessionId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to fail a payment");
    };
    PaymentsLib.markPaymentFailed(payments, stripeSessionId);
  };

};
