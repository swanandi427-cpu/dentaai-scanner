// ─── Domain types aligned with backend IDL bindings ───────────────────────

export type ToothStatus = "healthy" | "risk" | "cavity";

export type ScanSeverity = "mild" | "moderate" | "severe";

export interface ToothRecord {
  toothNumber: bigint;
  status: ToothStatus;
  condition: string;
  recommendation: string;
}

export interface ScanResult {
  id?: bigint;
  teeth: ToothRecord[];
  healthScore: bigint;
  severity?: ScanSeverity;
  timestamp: bigint;
}

export interface UserProfile {
  principalId: string;
  name: string;
  email: string;
  createdAt: bigint;
}

export interface DentistProfile {
  name: string;
  email: string;
  licenseNumber: string;
  specialties: string[];
  location: string;
  bio: string;
  available: boolean;
  isVerified?: boolean;
}

export interface BookingRecord {
  bookingId: bigint;
  patientPrincipal?: string;
  dentistEmail: string;
  requestedDate: string;
  notes: string;
  urgency: "routine" | "urgent" | "emergency";
  status: "pending" | "approved" | "declined" | "completed" | "cancelled";
  amountRupees: bigint;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: bigint;
}

export interface PassportRecord {
  id: bigint;
  patientPrincipal: string;
  patientEmail: string;
  passportCode: string;
  preApprovedBudget: bigint;
  treatmentHistory: string;
  currentConditions: string;
  allergies: string;
  notes: string;
  issuedBy: string;
  issuedAt: bigint;
  isActive?: boolean;
}

export interface ReimbursementRequest {
  id: bigint;
  passportCode: string;
  requestedBy: string;
  treatmentDetails: string;
  amountRupees: bigint;
  platformFeeRupees: bigint;
  netAmountRupees: bigint;
  passportOwnerId?: string;
  status: "pending" | "approved" | "declined" | "settled";
  createdAt: bigint;
}
