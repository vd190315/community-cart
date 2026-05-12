/**
 * Public landing page configuration.
 * Replace before production deploy as needed.
 */

/** Absolute URL used for QR encoding and optional outbound links. Include path (e.g. /welcome). */
export const LIVE_APP_URL = "https://YOUR_APP.vercel.app/welcome";

/** In-app route for “Open live app” — works in local dev without changing LIVE_APP_URL. */
export const LIVE_APP_PATH = "/welcome";

/**
 * Optional external waitlist (Typeform, Google Form, etc.).
 * When non-empty, the primary hero CTA opens this URL in a new tab.
 * When empty, the page uses the inline waitlist form shell on the same page.
 */
export const WAITLIST_FORM_URL = "";

/** When true and LIVE_APP_URL looks like a real https URL, show a generated QR image (third-party service). */
export const USE_EXTERNAL_QR_IMAGE = true;
