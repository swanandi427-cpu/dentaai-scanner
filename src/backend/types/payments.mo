import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {

  // ─── Dentist tier (profile badge, no payment) ────────────────────────────

  /// A dentist's self-selected membership tier — purely cosmetic / informational.
  /// No subscription, no payment, no Stripe. Dentists pick their own badge.
  public type DentistTier = {
    #free;
    #pro;
    #elite;
  };

  // ─── Connection request (patient → dentist or dentist → dentist) ─────────

  public type ConnectionStatus = {
    #pending;
    #accepted;
    #declined;
  };

  /// A connection request record. Can represent patient-to-dentist or
  /// dentist-to-dentist introductions — the platform is the middleman.
  public type ConnectionRequest = {
    id : Nat;
    /// Principal of the party initiating the connection.
    fromPrincipal : Principal;
    /// Email of the dentist being contacted.
    dentistEmail : Text;
    /// Optional message from the requester.
    message : Text;
    status : ConnectionStatus;
    createdAt : Time.Time;
    respondedAt : ?Time.Time;
  };

};
