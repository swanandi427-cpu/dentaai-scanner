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
  /// Called by the frontend after a successful Stripe subscription event.
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

  /// Record a new booking-fee payment intent (called by frontend after creating Stripe session).
  public shared ({ caller }) func recordBookingPayment(
    bookingId       : Nat,
    amountRupees    : Nat,
    stripeSessionId : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to record a payment");
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
  public shared ({ caller }) func recordReimbursementPayment(
    reimbursementId : Nat,
    amountRupees    : Nat,
    stripeSessionId : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to record a payment");
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

  /// Mark a payment as paid by Stripe session ID (called on Stripe webhook / success redirect).
  public shared ({ caller }) func confirmPayment(stripeSessionId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to confirm a payment");
    };
    PaymentsLib.markPaymentPaid(payments, stripeSessionId);
  };

  /// Mark a payment as failed by Stripe session ID.
  public shared ({ caller }) func failPayment(stripeSessionId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to fail a payment");
    };
    PaymentsLib.markPaymentFailed(payments, stripeSessionId);
  };

};
