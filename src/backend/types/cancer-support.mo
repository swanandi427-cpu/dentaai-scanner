import Time "mo:core/Time";

module {

  // ─── Support type for donors ──────────────────────────────────────────────

  public type SupportType = {
    #financial;
    #volunteer;
    #awareness;
  };

  // ─── Cancer type for patient requests ────────────────────────────────────

  public type CancerType = {
    #oral;
    #brain;
  };

  // ─── Donor registration ───────────────────────────────────────────────────

  public type DonorRegistration = {
    id          : Nat;
    name        : Text;
    email       : Text;
    phone       : Text;
    supportType : SupportType;
    preferredOrg : Text;
    timestamp   : Time.Time;
  };

  // ─── Patient support request ──────────────────────────────────────────────

  public type PatientSupportRequest = {
    id                : Nat;
    name              : Text;
    email             : Text;
    phone             : Text;
    cancerType        : CancerType;
    story             : Text;
    supportPreference : Text;
    timestamp         : Time.Time;
  };

  // ─── Aggregate impact stats ───────────────────────────────────────────────

  public type CancerImpactStats = {
    donorCount   : Nat;
    patientCount : Nat;
    pledgeCount  : Nat;
  };

};
