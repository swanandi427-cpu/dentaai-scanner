import List "mo:core/List";
import Time "mo:core/Time";
import T "../types/cancer-support";

/// Domain logic for cancer support — donor registrations and patient requests.
/// Pure connector model: no payments, just matchmaking and awareness.
module {

  // ─── Donor helpers ────────────────────────────────────────────────────────

  /// Add a new donor registration and return its assigned id.
  public func addDonor(
    donors      : List.List<T.DonorRegistration>,
    nextId      : Nat,
    name        : Text,
    email       : Text,
    phone       : Text,
    supportType : T.SupportType,
    preferredOrg : Text,
  ) : Nat {
    let donor : T.DonorRegistration = {
      id = nextId;
      name;
      email;
      phone;
      supportType;
      preferredOrg;
      timestamp = Time.now();
    };
    donors.add(donor);
    nextId;
  };

  /// Return all donor registrations as a shared array.
  public func listDonors(
    donors : List.List<T.DonorRegistration>,
  ) : [T.DonorRegistration] {
    donors.toArray();
  };

  // ─── Patient request helpers ──────────────────────────────────────────────

  /// Add a new patient support request and return its assigned id.
  public func addPatientRequest(
    requests          : List.List<T.PatientSupportRequest>,
    nextId            : Nat,
    name              : Text,
    email             : Text,
    phone             : Text,
    cancerType        : T.CancerType,
    story             : Text,
    supportPreference : Text,
  ) : Nat {
    let req : T.PatientSupportRequest = {
      id = nextId;
      name;
      email;
      phone;
      cancerType;
      story;
      supportPreference;
      timestamp = Time.now();
    };
    requests.add(req);
    nextId;
  };

  // ─── Impact stats ─────────────────────────────────────────────────────────

  /// Compute aggregate impact stats directly from array sizes.
  /// pledgeCount equals donorCount (each registration is one pledge).
  public func computeStats(
    donors   : List.List<T.DonorRegistration>,
    patients : List.List<T.PatientSupportRequest>,
  ) : T.CancerImpactStats {
    let donorCount = donors.size();
    {
      donorCount;
      patientCount = patients.size();
      pledgeCount  = donorCount;
    };
  };

};
