import { sampleOrderId, type ResidentOrderStage } from "./demoData";

/** sessionStorage: flat id → sealed in vendor packing demo (same tab). Legacy key — merged into operational blob on read. */
export const VENDOR_PACKED_BY_FLAT_SESSION_KEY = "cc-demo-vendor-packed-by-flat";

/** Unified vendor operational demo state (packing, remarks, batch status, in-memory notification feed). */
export const VENDOR_OPERATIONAL_SESSION_KEY = "cc-demo-vendor-operational";

export type VendorBatchOperationalStatus =
  | "Sent to vendor"
  | "Packing started"
  | "Partially packed"
  | "Packed"
  | "Dispatched to society gate"
  | "Delivered to society gate";

export type DemoOpNotification = {
  id: string;
  createdAt: string;
  audience: "resident" | "admin";
  /** When set, resident feed shows only for this flat (demo profile match). */
  flatFilter?: string;
  body: string;
  kind: "batch" | "flat";
  batchStatus?: VendorBatchOperationalStatus;
};

export type VendorOperationalState = {
  packedByFlat: Record<string, boolean>;
  /** Shown when flat remains Queued; required before dispatch if partial packing. */
  notPackedRemarkByFlat: Record<string, string>;
  batchStatus: VendorBatchOperationalStatus;
  dispatched: boolean;
  /** Vendor confirms vehicle left; final step confirms arrival at society gate (demo session). */
  deliveredToSocietyGate: boolean;
  /** True after vendor has opened packing at least once (session). */
  packingViewVisited: boolean;
  notifications: DemoOpNotification[];
};

const DEFAULT_OPERATIONAL: VendorOperationalState = {
  packedByFlat: {},
  notPackedRemarkByFlat: {},
  batchStatus: "Sent to vendor",
  dispatched: false,
  deliveredToSocietyGate: false,
  packingViewVisited: false,
  notifications: []
};

function normalizeOperational(raw: unknown): VendorOperationalState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_OPERATIONAL };
  }
  const o = raw as Record<string, unknown>;
  const packed =
    o.packedByFlat && typeof o.packedByFlat === "object" && !Array.isArray(o.packedByFlat)
      ? (o.packedByFlat as Record<string, boolean>)
      : {};
  const remarks =
    o.notPackedRemarkByFlat &&
    typeof o.notPackedRemarkByFlat === "object" &&
    !Array.isArray(o.notPackedRemarkByFlat)
      ? (o.notPackedRemarkByFlat as Record<string, string>)
      : {};
  const notifications = Array.isArray(o.notifications)
    ? (o.notifications as DemoOpNotification[])
    : [];
  const batchStatus =
    typeof o.batchStatus === "string" ? (o.batchStatus as VendorBatchOperationalStatus) : "Sent to vendor";
  const allowed: VendorBatchOperationalStatus[] = [
    "Sent to vendor",
    "Packing started",
    "Partially packed",
    "Packed",
    "Dispatched to society gate",
    "Delivered to society gate"
  ];
  const safeStatus = allowed.includes(batchStatus) ? batchStatus : "Sent to vendor";

  return {
    packedByFlat: packed,
    notPackedRemarkByFlat: remarks,
    batchStatus: safeStatus,
    dispatched: Boolean(o.dispatched),
    deliveredToSocietyGate: Boolean(o.deliveredToSocietyGate),
    packingViewVisited: Boolean(o.packingViewVisited),
    notifications
  };
}

export function readOperationalState(): VendorOperationalState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_OPERATIONAL };
  }
  try {
    const raw = sessionStorage.getItem(VENDOR_OPERATIONAL_SESSION_KEY);
    if (raw) {
      return normalizeOperational(JSON.parse(raw));
    }
    const legacyPacked = sessionStorage.getItem(VENDOR_PACKED_BY_FLAT_SESSION_KEY);
    if (legacyPacked) {
      const parsed = JSON.parse(legacyPacked) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return normalizeOperational({
          packedByFlat: parsed,
          notPackedRemarkByFlat: {},
          batchStatus: "Sent to vendor",
          dispatched: false,
          deliveredToSocietyGate: false,
          packingViewVisited: false,
          notifications: []
        });
      }
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_OPERATIONAL };
}

export function writeOperationalState(state: VendorOperationalState): void {
  try {
    sessionStorage.setItem(VENDOR_OPERATIONAL_SESSION_KEY, JSON.stringify(state));
    sessionStorage.setItem(VENDOR_PACKED_BY_FLAT_SESSION_KEY, JSON.stringify(state.packedByFlat));
  } catch {
    /* quota / private mode */
  }
}

/** Clears vendor packing/dispatch demo progress (e.g. new resident session). */
export function clearVendorOperationalSessionStorage(): void {
  try {
    sessionStorage.removeItem(VENDOR_OPERATIONAL_SESSION_KEY);
    sessionStorage.removeItem(VENDOR_PACKED_BY_FLAT_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** @deprecated Prefer readOperationalState — kept for older call sites. */
export function readPackedByFlatFromSession(): Record<string, boolean> {
  return readOperationalState().packedByFlat;
}

/** @deprecated Prefer writeOperationalState */
export function writePackedByFlatToSession(packed: Record<string, boolean>): void {
  const prev = readOperationalState();
  writeOperationalState({ ...prev, packedByFlat: packed });
}

function shortId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function computeBatchStatus(
  packedByFlat: Record<string, boolean>,
  flats: readonly string[],
  dispatched: boolean,
  packingViewVisited: boolean,
  deliveredToSocietyGate = false
): VendorBatchOperationalStatus {
  if (deliveredToSocietyGate) {
    return "Delivered to society gate";
  }
  if (dispatched) {
    return "Dispatched to society gate";
  }
  const total = flats.length;
  if (total === 0) {
    return "Sent to vendor";
  }
  let packed = 0;
  for (const f of flats) {
    if (packedByFlat[f]) packed++;
  }
  if (packed === total) {
    return "Packed";
  }
  if (packed > 0) {
    return "Partially packed";
  }
  if (packingViewVisited) {
    return "Packing started";
  }
  return "Sent to vendor";
}

export function appendNotificationsForBatchChange(
  prevStatus: VendorBatchOperationalStatus,
  nextStatus: VendorBatchOperationalStatus,
  existing: DemoOpNotification[]
): DemoOpNotification[] {
  if (prevStatus === nextStatus) {
    return existing;
  }
  const at = new Date().toISOString();
  const residentBody = `Order update: batch is now “${nextStatus}” for this society cycle.`;
  const adminBody = `Batch status: ${nextStatus} (${sampleOrderId}).`;
  return [
    ...existing,
    {
      id: shortId(),
      createdAt: at,
      audience: "resident",
      body: residentBody,
      kind: "batch",
      batchStatus: nextStatus
    },
    {
      id: shortId(),
      createdAt: at,
      audience: "admin",
      body: adminBody,
      kind: "batch",
      batchStatus: nextStatus
    }
  ];
}

export function stripFlatNotificationsForFlat(
  notifications: DemoOpNotification[],
  flat: string
): DemoOpNotification[] {
  return notifications.filter((n) => !(n.kind === "flat" && n.flatFilter === flat));
}

export function upsertFlatNotPackedNotifications(
  state: VendorOperationalState,
  flat: string,
  _residentName: string,
  remark: string
): DemoOpNotification[] {
  const trimmed = remark.trim();
  const withoutFlat = stripFlatNotificationsForFlat(state.notifications, flat);
  if (!trimmed) {
    return withoutFlat;
  }

  const residentBody = `Your bag is still pending vendor packing. Reason: ${trimmed}.`;
  const adminBody = `Flat ${flat} was not packed in this cycle. Reason: ${trimmed}.`;

  const at = new Date().toISOString();
  return [
    ...withoutFlat,
    {
      id: shortId(),
      createdAt: at,
      audience: "resident",
      flatFilter: flat,
      body: residentBody,
      kind: "flat"
    },
    {
      id: shortId(),
      createdAt: at,
      audience: "admin",
      flatFilter: flat,
      body: adminBody,
      kind: "flat"
    }
  ];
}

export function getResidentNotificationsForFlat(
  state: VendorOperationalState,
  flat: string
): DemoOpNotification[] {
  return state.notifications.filter(
    (n) =>
      n.audience === "resident" && (!n.flatFilter || n.flatFilter === flat)
  );
}

export function getAdminNotifications(state: VendorOperationalState): DemoOpNotification[] {
  return state.notifications.filter((n) => n.audience === "admin");
}

/** Admin batch timeline index: Sent → Packing → Dispatched → Delivered (society gate). */
export function adminTimelineIndexFromBatch(
  batchStatus: VendorBatchOperationalStatus,
  dispatched: boolean
): number {
  if (batchStatus === "Delivered to society gate") return 3;
  if (dispatched || batchStatus === "Dispatched to society gate") return 2;
  if (
    batchStatus === "Packing started" ||
    batchStatus === "Partially packed" ||
    batchStatus === "Packed"
  ) {
    return 1;
  }
  return 0;
}

/** Resident-facing stage from vendor operational batch (after admin handoff). */
export function residentStageFromBatch(
  batchStatus: VendorBatchOperationalStatus,
  _dispatched: boolean
): ResidentOrderStage {
  if (batchStatus === "Delivered to society gate") return "Delivered to society gate";
  if (batchStatus === "Dispatched to society gate") return "Packed";
  if (batchStatus === "Packed") return "Packed";
  return "Paid";
}

export function adminLegCopyFromBatch(batchStatus: VendorBatchOperationalStatus): {
  statusLabel: string;
  nextStepLabel: string;
} {
  switch (batchStatus) {
    case "Packing started":
      return { statusLabel: "Packing", nextStepLabel: "Vendor finishing flat-wise bags" };
    case "Partially packed":
      return { statusLabel: "Partially packed", nextStepLabel: "Vendor finishing remaining flat bags" };
    case "Packed":
      return { statusLabel: "Packing complete", nextStepLabel: "Awaiting dispatch to society gate" };
    case "Dispatched to society gate":
      return { statusLabel: "Dispatched", nextStepLabel: "In transit to society gate" };
    case "Delivered to society gate":
      return {
        statusLabel: "Delivered to society gate",
        nextStepLabel: "Pickup coordination with society"
      };
    default:
      return { statusLabel: "Sent to vendor", nextStepLabel: "Batch queued for this partner" };
  }
}
