import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import T "../types/payments";

/// Domain logic for the payments domain.
/// Receives state slices as parameters — no state owned here.
module {

  // ─── Tier catalogue (static) ─────────────────────────────────────────────

  /// Return the static pricing catalogue for all three tiers.
  public func getTierCatalogue() : [T.TierInfo] {
    [
      {
        tier = #free;
        name = "Free";
        monthlyAmountRupees = 0;
        features = [
          "Up to 5 patient bookings/month",
          "Basic profile listing",
          "Dental Passport lookup",
          "Email support",
        ];
      },
      {
        tier = #pro;
        name = "Pro";
        monthlyAmountRupees = 2499;
        features = [
          "Unlimited patient bookings",
          "Priority listing in search",
          "Full Dental Passport access",
          "Reimbursement processing",
          "Booking analytics dashboard",
          "Priority email support",
        ];
      },
      {
        tier = #elite;
        name = "Elite";
        monthlyAmountRupees = 5999;
        features = [
          "Everything in Pro",
          "Featured dentist badge",
          "Advanced analytics & reports",
          "Dedicated account manager",
          "Corporate dental plan access",
          "API access for clinic integration",
          "24/7 priority support",
        ];
      },
    ];
  };

  // ─── Subscription helpers ────────────────────────────────────────────────

  /// Upsert a dentist subscription record.
  public func upsertSubscription(
    subscriptions : Map.Map<Principal, T.DentistSubscription>,
    dentistId    : Principal,
    tier         : T.SubscriptionTier,
    stripeSubId  : Text,
    monthlyAmountRupees : Nat,
  ) : () {
    let sub : T.DentistSubscription = {
      dentistId;
      tier;
      state = #active;
      stripeSubscriptionId = stripeSubId;
      monthlyAmountRupees;
      startedAt = Time.now();
      renewsAt = null;
    };
    subscriptions.add(dentistId, sub);
  };

  /// Return the active subscription for a dentist, or null.
  public func getSubscription(
    subscriptions : Map.Map<Principal, T.DentistSubscription>,
    dentistId     : Principal,
  ) : ?T.DentistSubscription {
    subscriptions.get(dentistId);
  };

  /// Cancel a dentist subscription (set state to #cancelled).
  public func cancelSubscription(
    subscriptions : Map.Map<Principal, T.DentistSubscription>,
    dentistId     : Principal,
  ) : () {
    switch (subscriptions.get(dentistId)) {
      case (null) { Runtime.trap("No subscription found for this dentist") };
      case (?sub) {
        let updated : T.DentistSubscription = { sub with state = #cancelled };
        subscriptions.add(dentistId, updated);
      };
    };
  };

  // ─── Payment record helpers ───────────────────────────────────────────────

  /// Create and store a new PaymentRecord; returns the new record id.
  public func createPaymentRecord(
    payments    : List.List<T.PaymentRecord>,
    nextId      : Nat,
    kind        : T.PaymentKind,
    referenceId : Nat,
    payer       : Principal,
    amountRupees : Nat,
    stripeSessionId : Text,
  ) : Nat {
    let record : T.PaymentRecord = {
      id = nextId;
      kind;
      referenceId;
      payer;
      amountRupees;
      stripeSessionId;
      state = #pending;
      createdAt = Time.now();
      settledAt = null;
    };
    payments.add(record);
    nextId;
  };

  /// Transition a PaymentRecord to #paid, recording settledAt.
  public func markPaymentPaid(
    payments  : List.List<T.PaymentRecord>,
    sessionId : Text,
  ) : () {
    payments.mapInPlace(
      func(p) {
        if (p.stripeSessionId == sessionId and p.state == #pending) {
          { p with state = #paid; settledAt = ?Time.now() };
        } else { p };
      }
    );
  };

  /// Transition a PaymentRecord to #failed.
  public func markPaymentFailed(
    payments  : List.List<T.PaymentRecord>,
    sessionId : Text,
  ) : () {
    payments.mapInPlace(
      func(p) {
        if (p.stripeSessionId == sessionId and p.state == #pending) {
          { p with state = #failed; settledAt = ?Time.now() };
        } else { p };
      }
    );
  };

  /// Return all payment records for a given payer.
  public func getPaymentsByPayer(
    payments : List.List<T.PaymentRecord>,
    payer    : Principal,
  ) : [T.PaymentRecord] {
    payments.filter(func(p) { p.payer == payer }).toArray();
  };

  /// Return the payment record linked to a specific booking or reimbursement id.
  public func getPaymentByReference(
    payments    : List.List<T.PaymentRecord>,
    kind        : T.PaymentKind,
    referenceId : Nat,
  ) : ?T.PaymentRecord {
    payments.find(func(p) { p.kind == kind and p.referenceId == referenceId });
  };

};
