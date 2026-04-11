import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Prim "mo:prim";



actor {
  // ===================== AUTH TYPES ==============================

  type UserRole = {
    #admin;
    #dentist;
    #patient;
    #anonymous;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  func acInitState() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = Map.empty<Principal, UserRole>();
    };
  };

  func acGetUserRole(state : AccessControlState, caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #anonymous };
    switch (state.userRoles.get(caller)) {
      case (?role) { role };
      case (null) { #patient };
    };
  };

  func acIsAdmin(state : AccessControlState, caller : Principal) : Bool {
    acGetUserRole(state, caller) == #admin;
  };

  func acInitialize(state : AccessControlState, caller : Principal, adminToken : Text, userProvidedToken : Text) {
    if (caller.isAnonymous()) { return };
    switch (state.userRoles.get(caller)) {
      case (?_) {};
      case (null) {
        if (not state.adminAssigned and userProvidedToken == adminToken) {
          state.userRoles.add(caller, #admin);
          state.adminAssigned := true;
        } else {
          state.userRoles.add(caller, #patient);
        };
      };
    };
  };

  // ===================== DOMAIN TYPES ==============================

  type ToothStatus = {
    #healthy;
    #risk;
    #cavity;
  };

  type ScanSeverity = {
    #mild;
    #moderate;
    #severe;
  };

  public type ToothRecord = {
    toothNumber : Nat;
    status : ToothStatus;
    condition : Text;
    recommendation : Text;
  };

  public type ScanResult = {
    id : Nat;
    timestamp : Time.Time;
    healthScore : Nat;
    severity : ScanSeverity;
    teeth : [ToothRecord];
  };

  public type UserProfile = {
    principalId : Text;
    name : Text;
    email : Text;
    createdAt : Time.Time;
  };

  public type FeedbackEntry = {
    id : Nat;
    author : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  public type DentistProfile = {
    name : Text;
    email : Text;
    licenseNumber : Text;
    specialties : [Text];
    location : Text;
    bio : Text;
    available : Bool;
    isVerified : Bool;
  };

  public type AvailabilitySlot = {
    slotId : Nat;
    dentistId : Principal;
    dateTimeLabel : Text;
    isBooked : Bool;
  };

  type BookingUrgency = {
    #routine;
    #urgent;
    #emergency;
  };

  public type BookingStatus = {
    #pending;
    #approved;
    #declined;
    #completed;
    #cancelled;
  };

  type PaymentStatusInternal = {
    #pending;
    #paid;
    #refunded;
  };

  public type Booking = {
    bookingId : Nat;
    patientId : Principal;
    dentistEmail : Text;
    requestedDate : Text;
    notes : Text;
    urgency : BookingUrgency;
    status : BookingStatus;
    paymentStatus : PaymentStatusInternal;
    amountRupees : Nat;
    createdAt : Time.Time;
  };

  public type Message = {
    id : Nat;
    bookingId : Nat;
    senderPrincipal : Text;
    senderName : Text;
    content : Text;
    createdAt : Time.Time;
  };

  public type Testimonial = {
    testimonialId : Nat;
    author : Principal;
    name : Text;
    location : Text;
    role : Text;
    content : Text;
    rating : Nat;
    timestamp : Time.Time;
  };

  public type PassportRecord = {
    id : Nat;
    patientPrincipal : Text;
    patientEmail : Text;
    passportCode : Text;
    preApprovedBudget : Nat;
    treatmentHistory : Text;
    currentConditions : Text;
    allergies : Text;
    notes : Text;
    issuedBy : Text;
    issuedAt : Time.Time;
    isActive : Bool;
  };

  public type ReimbursementStatus = {
    #pending;
    #approved;
    #declined;
    #settled;
  };

  public type ReimbursementRequest = {
    id : Nat;
    passportCode : Text;
    requestedBy : Text;
    treatmentDetails : Text;
    amountRupees : Nat;
    platformFeeRupees : Nat;
    netAmountRupees : Nat;
    status : ReimbursementStatus;
    createdAt : Time.Time;
    passportOwnerId : Text;
  };

  // ===================== STATE ==============================

  let accessControlState = acInitState();

  let userScanResults = Map.empty<Principal, [ScanResult]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let feedbackList = Map.empty<Nat, FeedbackEntry>();
  let dentistProfiles = Map.empty<Principal, DentistProfile>();
  let availabilitySlots = Map.empty<Nat, AvailabilitySlot>();
  let bookings = Map.empty<Nat, Booking>();
  let messages = Map.empty<Nat, Message>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let visitors = Map.empty<Principal, Bool>();
  let emailToDentistPrincipal = Map.empty<Text, Principal>();
  let passports = Map.empty<Nat, PassportRecord>();
  let reimbursementRequests = Map.empty<Nat, ReimbursementRequest>();
  let patientPassportMap = Map.empty<Principal, Nat>();
  let passportCodeMap = Map.empty<Text, Nat>();

  var feedbackCount : Nat = 0;
  var visitorCount : Nat = 0;
  var nextSlotId : Nat = 1;
  var nextBookingId : Nat = 1;
  var nextMessageId : Nat = 1;
  var nextTestimonialId : Nat = 1;
  var nextPassportId : Nat = 1;
  var nextReimbursementId : Nat = 1;
  var nextScanId : Nat = 1;

  // ===================== AUTH MIXIN ENDPOINTS ==============================

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {
        Runtime.trap("CAFFEINE_ADMIN_TOKEN environment variable is not set");
      };
      case (?adminToken) {
        acInitialize(accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async UserRole {
    acGetUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : UserRole) : async () {
    if (not acIsAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can assign user roles");
    };
    accessControlState.userRoles.add(user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    acIsAdmin(accessControlState, caller);
  };

  // ================ VISITOR TRACKING ========================

  public shared ({ caller }) func recordVisit() : async () {
    switch (visitors.get(caller)) {
      case (null) {
        visitors.add(caller, true);
        visitorCount += 1;
      };
      case (?_) {};
    };
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  // ===================== FEEDBACK ===========================

  public shared ({ caller }) func submitFeedback(text : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to submit feedback");
    };
    if (text.size() == 0) {
      Runtime.trap("Feedback cannot be empty");
    };
    let entry : FeedbackEntry = {
      id = feedbackCount;
      author = caller;
      text = text;
      timestamp = Time.now();
    };
    feedbackList.add(feedbackCount, entry);
    feedbackCount += 1;
  };

  public query ({ caller }) func getFeedbackList() : async [FeedbackEntry] {
    if (not acIsAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view feedback");
    };
    feedbackList.values().toArray();
  };

  // ================== USER PROFILE ==========================

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not acIsAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(name : Text, email : Text) : async () {
    let existing = userProfiles.get(caller);
    let createdAt = switch (existing) {
      case (?p) { p.createdAt };
      case (null) { Time.now() };
    };
    let profile : UserProfile = {
      principalId = caller.toText();
      name;
      email;
      createdAt;
    };
    userProfiles.add(caller, profile);
  };

  // ====================== SCANS =============================

  public shared ({ caller }) func submitScan(
    teeth : [ToothRecord],
    healthScore : Nat,
    severity : ScanSeverity
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to submit a scan");
    };
    let scan : ScanResult = {
      id = nextScanId;
      timestamp = Time.now();
      healthScore;
      severity;
      teeth;
    };
    let existingScans = switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans };
    };
    let updatedScans = existingScans.concat([scan]);
    userScanResults.add(caller, updatedScans);
    let id = nextScanId;
    nextScanId += 1;
    id;
  };

  public query ({ caller }) func getCallerScanHistory() : async [ScanResult] {
    switch (userScanResults.get(caller)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  public query ({ caller }) func getUserScanHistory(user : Principal) : async [ScanResult] {
    if (caller != user and not acIsAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own scan history");
    };
    switch (userScanResults.get(user)) {
      case (null) { [] };
      case (?scans) { scans.reverse() };
    };
  };

  public query ({ caller }) func getCallerLatestScan() : async ?ScanResult {
    switch (userScanResults.get(caller)) {
      case (null) { null };
      case (?scans) {
        if (scans.size() == 0) { return null };
        ?scans.reverse()[0];
      };
    };
  };

  public shared ({ caller }) func deleteUserScans() : async () {
    userScanResults.remove(caller);
  };

  // ==================== DENTIST PROFILE =====================

  public shared ({ caller }) func registerDentistProfile(
    name : Text,
    email : Text,
    licenseNumber : Text,
    specialties : [Text],
    location : Text,
    bio : Text,
    available : Bool
  ) : async () {
    let profile : DentistProfile = {
      name;
      email;
      licenseNumber;
      specialties;
      location;
      bio;
      available;
      isVerified = false;
    };
    dentistProfiles.add(caller, profile);
    emailToDentistPrincipal.add(email, caller);
  };

  public shared ({ caller }) func updateDentistProfile(
    name : Text,
    email : Text,
    licenseNumber : Text,
    specialties : [Text],
    location : Text,
    bio : Text,
    available : Bool
  ) : async () {
    let isVerified = switch (dentistProfiles.get(caller)) {
      case (?existing) { existing.isVerified };
      case (null) { false };
    };
    let profile : DentistProfile = {
      name;
      email;
      licenseNumber;
      specialties;
      location;
      bio;
      available;
      isVerified;
    };
    dentistProfiles.add(caller, profile);
    emailToDentistPrincipal.add(email, caller);
  };

  public query func getAllDentists() : async [DentistProfile] {
    dentistProfiles.values().toArray();
  };

  public query func getDentistProfile(dentist : Principal) : async ?DentistProfile {
    dentistProfiles.get(dentist);
  };

  // ================== AVAILABILITY SLOTS ====================

  public shared ({ caller }) func registerAvailabilitySlot(dateTimeLabel : Text) : async Nat {
    let slot : AvailabilitySlot = {
      slotId = nextSlotId;
      dentistId = caller;
      dateTimeLabel;
      isBooked = false;
    };
    availabilitySlots.add(nextSlotId, slot);
    nextSlotId += 1;
    slot.slotId;
  };

  public shared ({ caller }) func updateAvailabilitySlot(slotId : Nat, dateTimeLabel : Text) : async () {
    switch (availabilitySlots.get(slotId)) {
      case (null) { Runtime.trap("Slot does not exist") };
      case (?slot) {
        if (slot.dentistId != caller) {
          Runtime.trap("Unauthorized: Only dentist can update slot");
        };
        if (slot.isBooked) {
          Runtime.trap("Cannot update booked slot");
        };
        let updatedSlot : AvailabilitySlot = { slot with dateTimeLabel };
        availabilitySlots.add(slotId, updatedSlot);
      };
    };
  };

  public query func getAvailabilitySlots(dentistId : Principal) : async [AvailabilitySlot] {
    availabilitySlots.values().filter(
      func(slot) { slot.dentistId == dentistId }
    ).toArray();
  };

  // ==================== BOOKINGS ============================

  public shared ({ caller }) func requestBooking(
    dentistEmail : Text,
    requestedDate : Text,
    notes : Text,
    urgency : BookingUrgency
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to request a booking");
    };
    let booking : Booking = {
      bookingId = nextBookingId;
      patientId = caller;
      dentistEmail;
      requestedDate;
      notes;
      urgency;
      status = #pending;
      paymentStatus = #pending;
      amountRupees = 0;
      createdAt = Time.now();
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.bookingId;
  };

  public shared ({ caller }) func approveBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) {
        // Allow the dentist (matched by email) or any dentist registered with that email to approve
        let callerProfile = dentistProfiles.get(caller);
        let callerEmail = switch (callerProfile) {
          case (?p) { p.email };
          case (null) { "" };
        };
        if (callerEmail != booking.dentistEmail and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the booked dentist can approve this booking");
        };
        if (booking.status != #pending) {
          Runtime.trap("Cannot approve non-pending booking");
        };
        let updatedBooking : Booking = { booking with status = #approved };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func declineBooking(bookingId : Nat) : async () {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) {
        let callerProfile = dentistProfiles.get(caller);
        let callerEmail = switch (callerProfile) {
          case (?p) { p.email };
          case (null) { "" };
        };
        if (callerEmail != booking.dentistEmail and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the booked dentist can decline this booking");
        };
        if (booking.status != #pending) {
          Runtime.trap("Cannot decline non-pending booking");
        };
        let updatedBooking : Booking = { booking with status = #declined };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public shared ({ caller }) func respondToBooking(bookingId : Nat, accept : Bool) : async () {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) {
        let callerProfile = dentistProfiles.get(caller);
        let callerEmail = switch (callerProfile) {
          case (?p) { p.email };
          case (null) { "" };
        };
        if (callerEmail != booking.dentistEmail and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the booked dentist can respond to this booking");
        };
        if (booking.status != #pending) {
          Runtime.trap("Cannot respond to non-pending booking");
        };
        let updatedBooking : Booking = {
          booking with
          status = if (accept) { #approved } else { #declined };
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  public query ({ caller }) func getCallerBookings() : async [Booking] {
    bookings.values().filter(
      func(booking) { booking.patientId == caller }
    ).toArray();
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    bookings.values().filter(
      func(booking) { booking.patientId == caller }
    ).toArray();
  };

  public query ({ caller }) func getDentistBookings() : async [Booking] {
    let callerProfile = dentistProfiles.get(caller);
    let callerEmail = switch (callerProfile) {
      case (?p) { p.email };
      case (null) { "" };
    };
    bookings.values().filter(
      func(booking) { booking.dentistEmail == callerEmail }
    ).toArray();
  };

  public query ({ caller }) func getBookingsForDentist() : async [Booking] {
    let callerProfile = dentistProfiles.get(caller);
    let callerEmail = switch (callerProfile) {
      case (?p) { p.email };
      case (null) { "" };
    };
    bookings.values().filter(
      func(booking) { booking.dentistEmail == callerEmail }
    ).toArray();
  };

  public query func getBooking(bookingId : Nat) : async ?Booking {
    bookings.get(bookingId);
  };

  public shared ({ caller }) func updatePaymentStatus(
    bookingId : Nat,
    status : PaymentStatusInternal,
    amountRupees : Nat
  ) : async () {
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) {
        if (booking.patientId != caller and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot update payment status");
        };
        let updatedBooking : Booking = { booking with paymentStatus = status; amountRupees };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // ==================== MESSAGING ===========================

  public shared ({ caller }) func submitMessage(bookingId : Nat, content : Text) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to send a message");
    };
    let senderName = switch (userProfiles.get(caller)) {
      case (?p) { p.name };
      case (null) { "Unknown" };
    };
    let message : Message = {
      id = nextMessageId;
      bookingId;
      senderPrincipal = caller.toText();
      senderName;
      content;
      createdAt = Time.now();
    };
    messages.add(nextMessageId, message);
    nextMessageId += 1;
    message.id;
  };

  public query ({ caller }) func getMessages(bookingId : Nat) : async [Message] {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to read messages");
    };
    messages.values().filter(
      func(message) { message.bookingId == bookingId }
    ).toArray();
  };

  // ==================== TESTIMONIALS ========================

  public shared ({ caller }) func submitTestimonial(
    name : Text,
    location : Text,
    rating : Nat,
    content : Text,
    role : Text
  ) : async Nat {
    if (name.size() == 0 or content.size() == 0) {
      Runtime.trap("Name and review text are required");
    };
    let clampedRating = if (rating < 1) { 1 } else if (rating > 5) { 5 } else { rating };
    let t : Testimonial = {
      testimonialId = nextTestimonialId;
      author = caller;
      name;
      location;
      role;
      content;
      rating = clampedRating;
      timestamp = Time.now();
    };
    testimonials.add(nextTestimonialId, t);
    nextTestimonialId += 1;
    t.testimonialId;
  };

  public query func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public query func getTestimonialById(id : Nat) : async ?Testimonial {
    testimonials.get(id);
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial does not exist") };
      case (?t) {
        if (t.author != caller and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own testimonial");
        };
        testimonials.remove(id);
      };
    };
  };

  // ==================== DENTAL PASSPORT =====================

  // issuePassport: any authenticated user can issue a passport (no dentist registration required)
  // Arg order: patientEmail, treatmentHistory, currentConditions, allergies, preApprovedBudget, notes
  public shared ({ caller }) func issuePassport(
    patientEmail : Text,
    treatmentHistory : Text,
    currentConditions : Text,
    allergies : Text,
    preApprovedBudget : Nat,
    notes : Text
  ) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to issue a passport");
    };
    let code = "DP-" # nextPassportId.toText();
    let passport : PassportRecord = {
      id = nextPassportId;
      patientPrincipal = caller.toText();
      patientEmail;
      passportCode = code;
      preApprovedBudget;
      treatmentHistory;
      currentConditions;
      allergies;
      notes;
      issuedBy = caller.toText();
      issuedAt = Time.now();
      isActive = true;
    };
    passports.add(nextPassportId, passport);
    patientPassportMap.add(caller, nextPassportId);
    passportCodeMap.add(code, nextPassportId);
    nextPassportId += 1;
    code;
  };

  // selfIssuePassport: patient creates/updates their own passport (upsert — never blocks)
  public shared ({ caller }) func selfIssuePassport(
    treatmentHistory : Text,
    currentConditions : Text,
    allergies : Text,
    preApprovedBudget : Nat,
    notes : Text
  ) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to create a passport");
    };
    // Upsert: update existing passport if one exists
    switch (patientPassportMap.get(caller)) {
      case (?existingId) {
        switch (passports.get(existingId)) {
          case (?existing) {
            let updated : PassportRecord = {
              existing with
              treatmentHistory;
              currentConditions;
              allergies;
              preApprovedBudget;
              notes;
            };
            passports.add(existingId, updated);
            return existing.passportCode;
          };
          case (null) {};
        };
      };
      case (null) {};
    };
    // Create new passport
    let patientEmail = switch (userProfiles.get(caller)) {
      case (?p) { p.email };
      case (null) { "" };
    };
    let code = "DP-" # nextPassportId.toText();
    let passport : PassportRecord = {
      id = nextPassportId;
      patientPrincipal = caller.toText();
      patientEmail;
      passportCode = code;
      preApprovedBudget;
      treatmentHistory;
      currentConditions;
      allergies;
      notes;
      issuedBy = caller.toText();
      issuedAt = Time.now();
      isActive = true;
    };
    passports.add(nextPassportId, passport);
    patientPassportMap.add(caller, nextPassportId);
    passportCodeMap.add(code, nextPassportId);
    nextPassportId += 1;
    code;
  };

  public query ({ caller }) func getCallerPassports() : async [PassportRecord] {
    switch (patientPassportMap.get(caller)) {
      case (null) { [] };
      case (?pid) {
        switch (passports.get(pid)) {
          case (null) { [] };
          case (?p) { [p] };
        };
      };
    };
  };

  public query ({ caller }) func getMyPassports() : async [PassportRecord] {
    switch (patientPassportMap.get(caller)) {
      case (null) { [] };
      case (?pid) {
        switch (passports.get(pid)) {
          case (null) { [] };
          case (?p) { [p] };
        };
      };
    };
  };

  public query func getPassportByCode(code : Text) : async ?PassportRecord {
    let fullCode = if (code.startsWith(#text "DP-")) { code } else { "DP-" # code };
    switch (passportCodeMap.get(fullCode)) {
      case (null) { null };
      case (?pid) { passports.get(pid) };
    };
  };

  public query func lookupPassportByCode(code : Text) : async ?PassportRecord {
    let fullCode = if (code.startsWith(#text "DP-")) { code } else { "DP-" # code };
    switch (passportCodeMap.get(fullCode)) {
      case (null) { null };
      case (?pid) { passports.get(pid) };
    };
  };

  // submitReimbursementRequest: any authenticated user can submit (no dentist registration required)
  public shared ({ caller }) func submitReimbursementRequest(
    passportCode : Text,
    treatmentDetails : Text,
    amountRupees : Nat,
    notes : Text
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to submit a reimbursement request");
    };
    let fullCode = if (passportCode.startsWith(#text "DP-")) { passportCode } else { "DP-" # passportCode };
    switch (passportCodeMap.get(fullCode)) {
      case (null) { Runtime.trap("Passport code not found") };
      case (?pid) {
        switch (passports.get(pid)) {
          case (null) { Runtime.trap("Passport not found") };
          case (?passport) {
            if (not passport.isActive) { Runtime.trap("Passport is not active") };
            let platformFeeRupees = amountRupees * 8 / 100;
            let netAmountRupees = amountRupees - platformFeeRupees;
            let combined = treatmentDetails # " | " # notes;
            let req : ReimbursementRequest = {
              id = nextReimbursementId;
              passportCode = fullCode;
              requestedBy = caller.toText();
              treatmentDetails = combined;
              amountRupees;
              platformFeeRupees;
              netAmountRupees;
              status = #pending;
              createdAt = Time.now();
              passportOwnerId = passport.patientPrincipal;
            };
            reimbursementRequests.add(nextReimbursementId, req);
            let id = nextReimbursementId;
            nextReimbursementId += 1;
            id;
          };
        };
      };
    };
  };

  public shared ({ caller }) func approveReimbursementRequest(requestId : Nat) : async () {
    switch (reimbursementRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?req) {
        if (req.passportOwnerId != caller.toText() and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the passport owner can approve this request");
        };
        if (req.status != #pending) { Runtime.trap("Request already processed") };
        let updatedReq : ReimbursementRequest = { req with status = #approved };
        reimbursementRequests.add(requestId, updatedReq);
      };
    };
  };

  public shared ({ caller }) func declineReimbursementRequest(requestId : Nat, reason : Text) : async () {
    switch (reimbursementRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?req) {
        if (req.passportOwnerId != caller.toText() and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the passport owner can decline this request");
        };
        if (req.status != #pending) { Runtime.trap("Request already processed") };
        // reason is stored as context in treatmentDetails
        let updatedReq : ReimbursementRequest = {
          req with
          status = #declined;
          treatmentDetails = req.treatmentDetails # " | Declined: " # reason;
        };
        reimbursementRequests.add(requestId, updatedReq);
      };
    };
  };

  public shared ({ caller }) func settleReimbursement(requestId : Nat, amountRupees : Nat) : async () {
    switch (reimbursementRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?req) {
        if (req.passportOwnerId != caller.toText() and not acIsAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the passport owner can settle this request");
        };
        if (req.status != #approved) { Runtime.trap("Request must be approved before settling") };
        let platformFeeRupees = amountRupees * 8 / 100;
        let netAmountRupees = amountRupees - platformFeeRupees;
        let updatedReq : ReimbursementRequest = {
          req with
          status = #settled;
          amountRupees;
          platformFeeRupees;
          netAmountRupees;
        };
        reimbursementRequests.add(requestId, updatedReq);
      };
    };
  };

  public query ({ caller }) func getReimbursementRequests() : async [ReimbursementRequest] {
    let callerText = caller.toText();
    reimbursementRequests.values().filter(
      func(r) { r.passportOwnerId == callerText }
    ).toArray();
  };

  public query ({ caller }) func getReimbursementRequestsForMe() : async [ReimbursementRequest] {
    let callerText = caller.toText();
    reimbursementRequests.values().filter(
      func(r) { r.passportOwnerId == callerText }
    ).toArray();
  };

  public query ({ caller }) func getMyReimbursementRequests() : async [ReimbursementRequest] {
    let callerText = caller.toText();
    reimbursementRequests.values().filter(
      func(r) { r.requestedBy == callerText }
    ).toArray();
  };

  // ==================== CONTRACT ALIAS ENDPOINTS ====================
  // These match the exact function names used in the frontend bindings contract.

  /// Alias for registerDentistProfile
  public shared ({ caller }) func registerDentist(
    name : Text,
    email : Text,
    licenseNumber : Text,
    specialties : [Text],
    location : Text,
    bio : Text
  ) : async () {
    let profile : DentistProfile = {
      name;
      email;
      licenseNumber;
      specialties;
      location;
      bio;
      available = true;
      isVerified = false;
    };
    dentistProfiles.add(caller, profile);
    emailToDentistPrincipal.add(email, caller);
  };

  /// Alias for registerAvailabilitySlot
  public shared ({ caller }) func saveDentistAvailability(dateTimeLabel : Text) : async Nat {
    let slot : AvailabilitySlot = {
      slotId = nextSlotId;
      dentistId = caller;
      dateTimeLabel;
      isBooked = false;
    };
    availabilitySlots.add(nextSlotId, slot);
    nextSlotId += 1;
    slot.slotId;
  };

  /// Alias for getAllDentists
  public query func getDentistProfiles() : async [DentistProfile] {
    dentistProfiles.values().toArray();
  };

  /// Alias for requestBooking
  public shared ({ caller }) func requestAppointment(
    dentistEmail : Text,
    requestedDate : Text,
    notes : Text,
    urgency : BookingUrgency
  ) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to request an appointment");
    };
    let booking : Booking = {
      bookingId = nextBookingId;
      patientId = caller;
      dentistEmail;
      requestedDate;
      notes;
      urgency;
      status = #pending;
      paymentStatus = #pending;
      amountRupees = 0;
      createdAt = Time.now();
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.bookingId;
  };

  /// Alias for getDentistBookings
  public query ({ caller }) func getBookingsByDentist() : async [Booking] {
    let callerProfile = dentistProfiles.get(caller);
    let callerEmail = switch (callerProfile) {
      case (?p) { p.email };
      case (null) { "" };
    };
    bookings.values().filter(
      func(booking) { booking.dentistEmail == callerEmail }
    ).toArray();
  };

  /// Alias for getCallerBookings
  public query ({ caller }) func getBookingsByPatient() : async [Booking] {
    bookings.values().filter(
      func(booking) { booking.patientId == caller }
    ).toArray();
  };

  /// Alias for getMessages
  public query ({ caller }) func getMessagesByBooking(bookingId : Nat) : async [Message] {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be authenticated to read messages");
    };
    messages.values().filter(
      func(message) { message.bookingId == bookingId }
    ).toArray();
  };

  /// Alias for getAllTestimonials
  public query func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

};
