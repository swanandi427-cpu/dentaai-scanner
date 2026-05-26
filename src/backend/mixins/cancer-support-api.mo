import List "mo:core/List";
import Runtime "mo:core/Runtime";
import T "../types/cancer-support";
import CancerLib "../lib/cancer-support";

/// Public API mixin for cancer support — donor registration and patient requests.
/// Platform acts as a pure connector; no payments processed here.
mixin (
  donorRegistrations    : List.List<T.DonorRegistration>,
  patientRequests       : List.List<T.PatientSupportRequest>,
  nextDonorIdRef        : { var id : Nat },
  nextPatientReqIdRef   : { var id : Nat },
  isAdminFn             : (caller : Principal) -> Bool,
) {

  // ─── Donor registration ───────────────────────────────────────────────────

  /// Register a new donor. Returns the assigned registration id.
  public shared ({ caller }) func registerDonor(
    name         : Text,
    email        : Text,
    phone        : Text,
    supportType  : T.SupportType,
    preferredOrg : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to register as a donor");
    };
    if (name.size() == 0)  { Runtime.trap("name must not be empty") };
    if (email.size() == 0) { Runtime.trap("email must not be empty") };
    let id = CancerLib.addDonor(
      donorRegistrations,
      nextDonorIdRef.id,
      name,
      email,
      phone,
      supportType,
      preferredOrg,
    );
    nextDonorIdRef.id += 1;
    id;
  };

  // ─── Patient support request ──────────────────────────────────────────────

  /// Submit a support request on behalf of a cancer patient.
  /// Returns the assigned request id.
  public shared ({ caller }) func submitPatientRequest(
    name              : Text,
    email             : Text,
    phone             : Text,
    cancerType        : T.CancerType,
    story             : Text,
    supportPreference : Text,
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to submit a patient request");
    };
    if (name.size() == 0)  { Runtime.trap("name must not be empty") };
    if (email.size() == 0) { Runtime.trap("email must not be empty") };
    let id = CancerLib.addPatientRequest(
      patientRequests,
      nextPatientReqIdRef.id,
      name,
      email,
      phone,
      cancerType,
      story,
      supportPreference,
    );
    nextPatientReqIdRef.id += 1;
    id;
  };

  // ─── Impact stats ─────────────────────────────────────────────────────────

  /// Return aggregate impact stats computed from array sizes.
  public query func getCancerImpactStats() : async T.CancerImpactStats {
    CancerLib.computeStats(donorRegistrations, patientRequests);
  };

  // ─── Admin-only: list all donor registrations ─────────────────────────────

  /// Return all donor registrations. Admin only.
  public query ({ caller }) func getDonorRegistrations() : async [T.DonorRegistration] {
    if (not isAdminFn(caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    CancerLib.listDonors(donorRegistrations);
  };

};
