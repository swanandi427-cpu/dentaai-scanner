import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ScanResult {
    id: bigint;
    teeth: Array<ToothRecord>;
    timestamp: Time;
    severity: ScanSeverity;
    healthScore: bigint;
}
export interface PaymentRecord {
    id: bigint;
    kind: PaymentKind;
    createdAt: Time;
    referenceId: bigint;
    amountRupees: bigint;
    state: PaymentState;
    payer: Principal;
    stripeSessionId: string;
    settledAt?: Time;
}
export interface FeedbackEntry {
    id: bigint;
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface DentistSubscription {
    startedAt: Time;
    stripeSubscriptionId: string;
    tier: SubscriptionTier;
    renewsAt?: Time;
    monthlyAmountRupees: bigint;
    state: SubscriptionState;
    dentistId: Principal;
}
export interface TierInfo {
    features: Array<string>;
    name: string;
    tier: SubscriptionTier;
    monthlyAmountRupees: bigint;
    yearlyAmountRupees: bigint;
}
export interface ToothRecord {
    status: ToothStatus;
    recommendation: string;
    toothNumber: bigint;
    condition: string;
}
export interface Booking {
    status: BookingStatus;
    paymentStatus: PaymentStatusInternal;
    bookingId: bigint;
    urgency: BookingUrgency;
    patientId: Principal;
    dentistEmail: string;
    createdAt: Time;
    amountRupees: bigint;
    notes: string;
    requestedDate: string;
}
export interface ReimbursementRequest {
    id: bigint;
    status: ReimbursementStatus;
    createdAt: Time;
    passportCode: string;
    treatmentDetails: string;
    amountRupees: bigint;
    passportOwnerId: string;
    netAmountRupees: bigint;
    platformFeeRupees: bigint;
    requestedBy: string;
}
export interface BookingFeeBreakdown {
    urgency: BookingUrgency;
    totalAmountRupees: bigint;
    platformFeeRupees: bigint;
    baseAmountRupees: bigint;
}
export interface AvailabilitySlot {
    dateTimeLabel: string;
    slotId: bigint;
    isBooked: boolean;
    dentistId: Principal;
}
export interface PassportRecord {
    id: bigint;
    patientEmail: string;
    treatmentHistory: string;
    preApprovedBudget: bigint;
    passportCode: string;
    isActive: boolean;
    currentConditions: string;
    patientPrincipal: string;
    notes: string;
    issuedAt: Time;
    issuedBy: string;
    allergies: string;
}
export interface DentistProfile {
    bio: string;
    name: string;
    email: string;
    available: boolean;
    isVerified: boolean;
    licenseNumber: string;
    specialties: Array<string>;
    location: string;
}
export interface Message {
    id: bigint;
    content: string;
    bookingId: bigint;
    createdAt: Time;
    senderPrincipal: string;
    senderName: string;
}
export interface ReimbursementFeeBreakdown {
    netAmountRupees: bigint;
    platformFeeRupees: bigint;
    grossAmountRupees: bigint;
}
export interface UserProfile {
    name: string;
    createdAt: Time;
    email: string;
    principalId: string;
}
export interface Testimonial {
    content: string;
    testimonialId: bigint;
    name: string;
    role: string;
    author: Principal;
    timestamp: Time;
    rating: bigint;
    location: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    approved = "approved",
    declined = "declined"
}
export enum BookingUrgency {
    emergency = "emergency",
    routine = "routine",
    urgent = "urgent"
}
export enum PaymentKind {
    reimbursement = "reimbursement",
    bookingFee = "bookingFee"
}
export enum PaymentState {
    pending = "pending",
    paid = "paid",
    refunded = "refunded",
    failed = "failed"
}
export enum PaymentStatusInternal {
    pending = "pending",
    paid = "paid",
    refunded = "refunded"
}
export enum ReimbursementStatus {
    settled = "settled",
    pending = "pending",
    approved = "approved",
    declined = "declined"
}
export enum ScanSeverity {
    mild = "mild",
    severe = "severe",
    moderate = "moderate"
}
export enum SubscriptionState {
    active = "active",
    cancelled = "cancelled",
    expired = "expired"
}
export enum SubscriptionTier {
    pro = "pro",
    free = "free",
    elite = "elite"
}
export enum ToothStatus {
    risk = "risk",
    healthy = "healthy",
    cavity = "cavity"
}
export enum UserRole {
    patient = "patient",
    admin = "admin",
    dentist = "dentist",
    anonymous = "anonymous"
}
export interface backendInterface {
    /**
     * / addScanResult: alias for submitScan
     */
    addScanResult(teeth: Array<ToothRecord>, healthScore: bigint, severity: ScanSeverity): Promise<bigint>;
    approveBooking(bookingId: bigint): Promise<void>;
    approveReimbursementRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelMySubscription(): Promise<void>;
    confirmPayment(stripeSessionId: string): Promise<void>;
    /**
     * / createAvailabilitySlot: alias for registerAvailabilitySlot
     */
    createAvailabilitySlot(dateTimeLabel: string): Promise<bigint>;
    /**
     * / createBooking: alias for requestBooking
     */
    createBooking(dentistEmail: string, requestedDate: string, notes: string, urgency: BookingUrgency): Promise<bigint>;
    /**
     * / createPassport: alias for selfIssuePassport — patient creates their own passport
     */
    createPassport(treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<string>;
    declineBooking(bookingId: bigint): Promise<void>;
    declineReimbursementRequest(requestId: bigint, reason: string): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    deleteUserScans(): Promise<void>;
    failPayment(stripeSessionId: string): Promise<void>;
    /**
     * / findDentistByEmail: look up a dentist profile by email address
     */
    findDentistByEmail(email: string): Promise<DentistProfile | null>;
    getAllDentists(): Promise<Array<DentistProfile>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getAvailabilitySlots(dentistId: Principal): Promise<Array<AvailabilitySlot>>;
    /**
     * / getAvailableSlots: return unbooked slots for a given dentist
     */
    getAvailableSlots(dentistId: Principal): Promise<Array<AvailabilitySlot>>;
    getBooking(bookingId: bigint): Promise<Booking | null>;
    getBookingFee(urgency: BookingUrgency): Promise<BookingFeeBreakdown>;
    getBookingPayment(bookingId: bigint): Promise<PaymentRecord | null>;
    /**
     * / Alias for getDentistBookings
     */
    getBookingsByDentist(): Promise<Array<Booking>>;
    /**
     * / Alias for getCallerBookings
     */
    getBookingsByPatient(): Promise<Array<Booking>>;
    getBookingsForDentist(): Promise<Array<Booking>>;
    getCallerBookings(): Promise<Array<Booking>>;
    getCallerLatestScan(): Promise<ScanResult | null>;
    /**
     * / getCallerMessages: return messages for a booking (accessible by both parties)
     */
    getCallerMessages(bookingId: bigint): Promise<Array<Message>>;
    getCallerPassports(): Promise<Array<PassportRecord>>;
    /**
     * / getCallerProfile: alias for getCallerUserProfile
     */
    getCallerProfile(): Promise<UserProfile | null>;
    getCallerScanHistory(): Promise<Array<ScanResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDentistBookings(): Promise<Array<Booking>>;
    getDentistProfile(dentist: Principal): Promise<DentistProfile | null>;
    /**
     * / Alias for getAllDentists
     */
    getDentistProfiles(): Promise<Array<DentistProfile>>;
    getDentistSubscription(dentistId: Principal): Promise<DentistSubscription | null>;
    getFeedbackList(): Promise<Array<FeedbackEntry>>;
    getMessages(bookingId: bigint): Promise<Array<Message>>;
    /**
     * / Alias for getMessages
     */
    getMessagesByBooking(bookingId: bigint): Promise<Array<Message>>;
    getMyBookings(): Promise<Array<Booking>>;
    getMyPassports(): Promise<Array<PassportRecord>>;
    getMyPayments(): Promise<Array<PaymentRecord>>;
    getMyReimbursementRequests(): Promise<Array<ReimbursementRequest>>;
    getMySubscription(): Promise<DentistSubscription | null>;
    getPassportByCode(code: string): Promise<PassportRecord | null>;
    getPricingTiers(): Promise<Array<TierInfo>>;
    getReimbursementFee(grossAmountRupees: bigint): Promise<ReimbursementFeeBreakdown>;
    getReimbursementPayment(reimbursementId: bigint): Promise<PaymentRecord | null>;
    getReimbursementRequests(): Promise<Array<ReimbursementRequest>>;
    getReimbursementRequestsForMe(): Promise<Array<ReimbursementRequest>>;
    /**
     * / getReimbursementsByPassportCode: return all reimbursement requests for a given passport code
     */
    getReimbursementsByPassportCode(code: string): Promise<Array<ReimbursementRequest>>;
    getTestimonialById(id: bigint): Promise<Testimonial | null>;
    /**
     * / Alias for getAllTestimonials
     */
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserScanHistory(user: Principal): Promise<Array<ScanResult>>;
    /**
     * / getVerifiedDentists: return all dentists (available for patient matching)
     */
    getVerifiedDentists(): Promise<Array<DentistProfile>>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    issuePassport(patientEmail: string, treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<string>;
    lookupPassportByCode(code: string): Promise<PassportRecord | null>;
    recordBookingPayment(bookingId: bigint, amountRupees: bigint, stripeSessionId: string): Promise<bigint>;
    recordReimbursementPayment(reimbursementId: bigint, amountRupees: bigint, stripeSessionId: string): Promise<bigint>;
    recordVisit(): Promise<void>;
    registerAvailabilitySlot(dateTimeLabel: string): Promise<bigint>;
    /**
     * / Alias for registerDentistProfile
     */
    registerDentist(name: string, email: string, licenseNumber: string, specialties: Array<string>, location: string, bio: string): Promise<void>;
    registerDentistProfile(name: string, email: string, licenseNumber: string, specialties: Array<string>, location: string, bio: string, available: boolean): Promise<void>;
    /**
     * / Alias for requestBooking
     */
    requestAppointment(dentistEmail: string, requestedDate: string, notes: string, urgency: BookingUrgency): Promise<bigint>;
    requestBooking(dentistEmail: string, requestedDate: string, notes: string, urgency: BookingUrgency): Promise<bigint>;
    respondToBooking(bookingId: bigint, accept: boolean): Promise<void>;
    saveCallerUserProfile(name: string, email: string): Promise<void>;
    /**
     * / Alias for registerAvailabilitySlot
     */
    saveDentistAvailability(dateTimeLabel: string): Promise<bigint>;
    selfIssuePassport(treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<string>;
    setDentistSubscription(dentistId: Principal, tier: SubscriptionTier, stripeSubscriptionId: string, monthlyAmountRupees: bigint): Promise<void>;
    settleReimbursement(requestId: bigint, amountRupees: bigint): Promise<void>;
    submitFeedback(text: string): Promise<void>;
    submitMessage(bookingId: bigint, content: string): Promise<bigint>;
    submitReimbursementRequest(passportCode: string, treatmentDetails: string, amountRupees: bigint, notes: string): Promise<bigint>;
    submitScan(teeth: Array<ToothRecord>, healthScore: bigint, severity: ScanSeverity): Promise<bigint>;
    submitTestimonial(name: string, location: string, rating: bigint, content: string, role: string): Promise<bigint>;
    /**
     * / submitUserProfile: alias for saveCallerUserProfile
     */
    submitUserProfile(name: string, email: string): Promise<void>;
    updateAvailabilitySlot(slotId: bigint, dateTimeLabel: string): Promise<void>;
    /**
     * / updateBookingStatus: dentist or admin updates a booking's status
     */
    updateBookingStatus(bookingId: bigint, status: BookingStatus): Promise<void>;
    updateDentistProfile(name: string, email: string, licenseNumber: string, specialties: Array<string>, location: string, bio: string, available: boolean): Promise<void>;
    updatePaymentStatus(bookingId: bigint, status: PaymentStatusInternal, amountRupees: bigint): Promise<void>;
    /**
     * / updateReimbursementStatus: passport owner or admin updates a reimbursement status
     */
    updateReimbursementStatus(requestId: bigint, status: ReimbursementStatus): Promise<void>;
}
