/**
 * Pilot demo session gates (sessionStorage, same browser tab).
 * Downstream UIs read these flags so screens stay empty until the prior workflow step runs.
 */

export const RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY = "cc-demo-resident-order-placed";

/** Set when admin sends the consolidated batch to the vendor (demo handoff). */
export const ADMIN_VENDOR_HANDOFF_SESSION_KEY = "cc-demo-admin-vendor-handoff";

export function readHasResidentOrderFromSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function readHasAdminHandoffFromSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(ADMIN_VENDOR_HANDOFF_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markAdminVendorHandoffInSession(): void {
  try {
    sessionStorage.setItem(ADMIN_VENDOR_HANDOFF_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearAdminVendorHandoffFromSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_VENDOR_HANDOFF_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
