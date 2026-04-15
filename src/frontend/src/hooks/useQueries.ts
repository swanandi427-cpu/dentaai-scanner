import type { PaymentRecord } from "@/backend.d";
import { useActor } from "@/hooks/useActor";
import type { ScanResult, ScanSeverity, ToothRecord } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// ─── Helper: map frontend ScanSeverity to backend variant ────────────────────
function toBackendSeverity(severity: ScanSeverity) {
  switch (severity) {
    case "mild":
      return { mild: null };
    case "moderate":
      return { moderate: null };
    case "severe":
      return { severe: null };
    default:
      return { mild: null };
  }
}

// ─── Helper: map backend variant to frontend ScanSeverity ─────────────────────
function fromBackendSeverity(
  sv: Record<string, null> | undefined,
): ScanSeverity {
  if (!sv) return "mild";
  if ("severe" in sv) return "severe";
  if ("moderate" in sv) return "moderate";
  return "mild";
}

// ─── Helper: map backend ToothStatus variant to frontend string ───────────────
function fromBackendToothStatus(
  ts: Record<string, null>,
): "healthy" | "risk" | "cavity" {
  if ("cavity" in ts) return "cavity";
  if ("risk" in ts) return "risk";
  return "healthy";
}

// ─── Helper: map frontend ToothRecord to backend format ───────────────────────
function toBackendToothRecord(t: ToothRecord) {
  return {
    toothNumber: t.toothNumber,
    status: { [t.status]: null } as Record<string, null>,
    condition: t.condition,
    recommendation: t.recommendation,
  };
}

// ─── Helper: map backend ScanResult to frontend ScanResult ───────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromBackendScanResult(raw: any): ScanResult {
  return {
    id: raw.id,
    teeth: (raw.teeth ?? []).map((t: any) => ({
      toothNumber: t.toothNumber,
      status: fromBackendToothStatus(t.status),
      condition: t.condition,
      recommendation: t.recommendation,
    })),
    healthScore: raw.healthScore,
    severity: fromBackendSeverity(raw.severity),
    timestamp: raw.timestamp,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useScanHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["scanHistory"],
    queryFn: async (): Promise<ScanResult[]> => {
      if (!actor) return [];
      const result = await actor.getCallerScanHistory();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any[]).map(fromBackendScanResult);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestScan() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["latestScan"],
    queryFn: async (): Promise<ScanResult | null> => {
      if (!actor) return null;
      // ICP option type returns [] or [value]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await actor.getCallerLatestScan()) as any;
      const raw = Array.isArray(result) ? result[0] : result;
      return raw ? fromBackendScanResult(raw) : null;
    },
    enabled: !!actor && !isFetching,
  });
}

interface SubmitScanArgs {
  teeth: ToothRecord[];
  healthScore: number;
  severity: ScanSeverity;
}

export function useSubmitScan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ teeth, healthScore, severity }: SubmitScanArgs) => {
      if (!actor) throw new Error("Not authenticated");
      const backendTeeth = teeth.map(toBackendToothRecord);
      await actor.submitScan(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backendTeeth as any,
        BigInt(Math.round(healthScore)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toBackendSeverity(severity) as any,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scanHistory"] });
      qc.invalidateQueries({ queryKey: ["latestScan"] });
    },
  });
}

export function useVisitorCount() {
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (actor) {
      try {
        actor.recordVisit().catch(() => {});
      } catch {
        // ignore
      }
    }
  }, [actor]);

  return useQuery({
    queryKey: ["visitorCount"],
    queryFn: async (): Promise<number> => {
      if (!actor) return 0;
      try {
        const count = await actor.getVisitorCount();
        return Number(count);
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Payment Queries ──────────────────────────────────────────────────────────

export function useMyPayments() {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentRecord[]>({
    queryKey: ["myPayments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookingPayment(bookingId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentRecord | null>({
    queryKey: ["bookingPayment", bookingId?.toString()],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      return actor.getBookingPayment(bookingId);
    },
    enabled: !!actor && !isFetching && !!bookingId,
  });
}

export function useRecordBookingPayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      amountRupees,
      stripeSessionId,
    }: {
      bookingId: bigint;
      amountRupees: bigint;
      stripeSessionId: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.recordBookingPayment(
        bookingId,
        amountRupees,
        stripeSessionId,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myPayments"] });
      qc.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
}

export function useRecordReimbursementPayment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reimbursementId,
      amountRupees,
      stripeSessionId,
    }: {
      reimbursementId: bigint;
      amountRupees: bigint;
      stripeSessionId: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.recordReimbursementPayment(
        reimbursementId,
        amountRupees,
        stripeSessionId,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myPayments"] });
    },
  });
}
