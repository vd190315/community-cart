/** sessionStorage: flat id → sealed in vendor packing demo (same tab). */
export const VENDOR_PACKED_BY_FLAT_SESSION_KEY = "cc-demo-vendor-packed-by-flat";

export function readPackedByFlatFromSession(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(VENDOR_PACKED_BY_FLAT_SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function writePackedByFlatToSession(packed: Record<string, boolean>): void {
  try {
    sessionStorage.setItem(VENDOR_PACKED_BY_FLAT_SESSION_KEY, JSON.stringify(packed));
  } catch {
    /* quota / private mode */
  }
}
