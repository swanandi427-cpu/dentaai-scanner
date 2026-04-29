import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import T "../types/payments";

/// Domain logic for dentist tiers and connection requests.
/// No payment processing — the platform is purely a matchmaking directory.
module {

  // ─── Dentist tier helpers ─────────────────────────────────────────────────

  /// Upsert the tier for a dentist (free self-selection, no payment required).
  public func setTier(
    tiers     : Map.Map<Principal, T.DentistTier>,
    dentistId : Principal,
    tier      : T.DentistTier,
  ) : () {
    tiers.add(dentistId, tier);
  };

  /// Return the tier for a dentist, defaulting to #free if unset.
  public func getTier(
    tiers     : Map.Map<Principal, T.DentistTier>,
    dentistId : Principal,
  ) : T.DentistTier {
    switch (tiers.get(dentistId)) {
      case (?t) { t };
      case (null) { #free };
    };
  };

  // ─── Connection request helpers ───────────────────────────────────────────

  /// Create and store a new connection request; returns the new id.
  public func createConnectionRequest(
    requests     : List.List<T.ConnectionRequest>,
    nextId       : Nat,
    from         : Principal,
    dentistEmail : Text,
    message      : Text,
  ) : Nat {
    let req : T.ConnectionRequest = {
      id = nextId;
      fromPrincipal = from;
      dentistEmail;
      message;
      status = #pending;
      createdAt = Time.now();
      respondedAt = null;
    };
    requests.add(req);
    nextId;
  };

  /// Return all pending/accepted/declined requests sent to a given dentist email.
  public func getRequestsForDentist(
    requests     : List.List<T.ConnectionRequest>,
    dentistEmail : Text,
  ) : [T.ConnectionRequest] {
    requests.filter(func(r) { r.dentistEmail == dentistEmail }).toArray();
  };

  /// Return all requests initiated by a given principal.
  public func getRequestsByRequester(
    requests : List.List<T.ConnectionRequest>,
    from     : Principal,
  ) : [T.ConnectionRequest] {
    requests.filter(func(r) { r.fromPrincipal == from }).toArray();
  };

  /// Transition a connection request to #accepted or #declined.
  public func respondToRequest(
    requests : List.List<T.ConnectionRequest>,
    id       : Nat,
    accept   : Bool,
  ) : () {
    requests.mapInPlace(
      func(r) {
        if (r.id == id and r.status == #pending) {
          {
            r with
            status = if (accept) { #accepted } else { #declined };
            respondedAt = ?Time.now();
          };
        } else { r };
      }
    );
  };

  /// Return a single connection request by id, or null.
  public func getRequestById(
    requests : List.List<T.ConnectionRequest>,
    id       : Nat,
  ) : ?T.ConnectionRequest {
    requests.find(func(r) { r.id == id });
  };

};
