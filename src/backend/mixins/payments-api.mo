import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import T "../types/payments";
import DirectoryLib "../lib/payments";

/// Public API mixin for dentist tiers and connection requests.
/// All Stripe/payment logic has been removed.
/// The platform is purely a matchmaking directory — no money changes hands here.
mixin (
  dentistTiers        : Map.Map<Principal, T.DentistTier>,
  connectionRequests  : List.List<T.ConnectionRequest>,
  nextConnectionIdRef : { var id : Nat },
) {

  // ─── Dentist tier (self-select badge) ────────────────────────────────────

  /// Return the calling dentist's current tier badge (defaults to #free).
  public query ({ caller }) func getMyTier() : async T.DentistTier {
    DirectoryLib.getTier(dentistTiers, caller);
  };

  /// Return any dentist's tier badge by principal.
  public query func getDentistTier(dentistId : Principal) : async T.DentistTier {
    DirectoryLib.getTier(dentistTiers, dentistId);
  };

  /// Set the calling dentist's tier badge (no payment required).
  public shared ({ caller }) func setMyTier(tier : T.DentistTier) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to set a tier");
    };
    DirectoryLib.setTier(dentistTiers, caller, tier);
  };

  // ─── Connection requests ─────────────────────────────────────────────────

  /// Send a connection request to a dentist (by email).
  /// A patient or another dentist can initiate this.
  public shared ({ caller }) func sendConnectionRequest(
    dentistEmail : Text,
    message      : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to send a connection request");
    };
    if (dentistEmail.size() == 0) {
      Runtime.trap("dentistEmail must not be empty");
    };
    let id = DirectoryLib.createConnectionRequest(
      connectionRequests,
      nextConnectionIdRef.id,
      caller,
      dentistEmail,
      message,
    );
    nextConnectionIdRef.id += 1;
    id;
  };

  /// Return all connection requests sent by the caller.
  public query ({ caller }) func getMyConnectionRequests() : async [T.ConnectionRequest] {
    DirectoryLib.getRequestsByRequester(connectionRequests, caller);
  };

  /// Return all connection requests directed at the calling dentist (matched by email).
  /// The dentist must be registered; their email is looked up from the caller context.
  /// Callers who are not registered dentists receive an empty list.
  public query ({ caller }) func getIncomingConnectionRequests(dentistEmail : Text) : async [T.ConnectionRequest] {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to view connection requests");
    };
    DirectoryLib.getRequestsForDentist(connectionRequests, dentistEmail);
  };

  /// Accept or decline a connection request (dentist action).
  public shared ({ caller }) func respondToConnectionRequest(id : Nat, accept : Bool) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to respond to a connection request");
    };
    switch (DirectoryLib.getRequestById(connectionRequests, id)) {
      case (null) { Runtime.trap("Connection request not found") };
      case (?_req) {
        DirectoryLib.respondToRequest(connectionRequests, id, accept);
      };
    };
  };

  /// Return a single connection request by id (visible to either party).
  public query ({ caller }) func getConnectionRequest(id : Nat) : async ?T.ConnectionRequest {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to view a connection request");
    };
    DirectoryLib.getRequestById(connectionRequests, id);
  };

};
