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
export interface FeedbackEntry {
    id: bigint;
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface AvailabilitySlot {
    dateTimeLabel: string;
    slotId: bigint;
    isBooked: boolean;
    dentistId: Principal;
}
export interface ToothRecord {
    status: ToothStatus;
    recommendation: string;
    toothNumber: bigint;
    condition: string;
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
    approveBooking(bookingId: bigint): Promise<void>;
    approveReimbursementRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    declineBooking(bookingId: bigint): Promise<void>;
    declineReimbursementRequest(requestId: bigint, reason: string): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    deleteUserScans(): Promise<void>;
    getAllDentists(): Promise<Array<DentistProfile>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getAvailabilitySlots(dentistId: Principal): Promise<Array<AvailabilitySlot>>;
    getBooking(bookingId: bigint): Promise<Booking | null>;
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
    getCallerPassports(): Promise<Array<PassportRecord>>;
    getCallerScanHistory(): Promise<Array<ScanResult>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDentistBookings(): Promise<Array<Booking>>;
    getDentistProfile(dentist: Principal): Promise<DentistProfile | null>;
    /**
     * / Alias for getAllDentists
     */
    getDentistProfiles(): Promise<Array<DentistProfile>>;
    getFeedbackList(): Promise<Array<FeedbackEntry>>;
    getMessages(bookingId: bigint): Promise<Array<Message>>;
    /**
     * / Alias for getMessages
     */
    getMessagesByBooking(bookingId: bigint): Promise<Array<Message>>;
    getMyBookings(): Promise<Array<Booking>>;
    getMyPassports(): Promise<Array<PassportRecord>>;
    getMyReimbursementRequests(): Promise<Array<ReimbursementRequest>>;
    getPassportByCode(code: string): Promise<PassportRecord | null>;
    getReimbursementRequests(): Promise<Array<ReimbursementRequest>>;
    getReimbursementRequestsForMe(): Promise<Array<ReimbursementRequest>>;
    getTestimonialById(id: bigint): Promise<Testimonial | null>;
    /**
     * / Alias for getAllTestimonials
     */
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserScanHistory(user: Principal): Promise<Array<ScanResult>>;
    getVisitorCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    issuePassport(patientEmail: string, treatmentHistory: string, currentConditions: string, allergies: string, preApprovedBudget: bigint, notes: string): Promise<string>;
    lookupPassportByCode(code: string): Promise<PassportRecord | null>;
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
    settleReimbursement(requestId: bigint, amountRupees: bigint): Promise<void>;
    submitFeedback(text: string): Promise<void>;
    submitMessage(bookingId: bigint, content: string): Promise<bigint>;
    submitReimbursementRequest(passportCode: string, treatmentDetails: string, amountRupees: bigint, notes: string): Promise<bigint>;
    submitScan(teeth: Array<ToothRecord>, healthScore: bigint, severity: ScanSeverity): Promise<bigint>;
    submitTestimonial(name: string, location: string, rating: bigint, content: string, role: string): Promise<bigint>;
    updateAvailabilitySlot(slotId: bigint, dateTimeLabel: string): Promise<void>;
    updateDentistProfile(name: string, email: string, licenseNumber: string, specialties: Array<string>, location: string, bio: string, available: boolean): Promise<void>;
    updatePaymentStatus(bookingId: bigint, status: PaymentStatusInternal, amountRupees: bigint): Promise<void>;
}
