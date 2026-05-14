import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SocietyBatchIllustration } from "@/components/landing/SocietyBatchIllustration";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import {
  LIVE_APP_PATH,
  LIVE_APP_URL,
  USE_EXTERNAL_QR_IMAGE,
  WAITLIST_FORM_URL,
} from "@/lib/landingConfig";

function qrImageSrc(): string | null {
  if (!USE_EXTERNAL_QR_IMAGE) return null;
  const url = LIVE_APP_URL.trim();
  if (!url.startsWith("https://")) return null;
  if (url.includes("YOUR_APP")) return null;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
}

export function PublicLanding() {
  const qrSrc = qrImageSrc();
  const useExternalWaitlist = WAITLIST_FORM_URL.trim().length > 0;

  return (
    <article className="relative flex w-full min-w-0 flex-col overflow-x-hidden pb-12 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10 landing-bg-motif" aria-hidden />

      {/* 1 · Hero — mobile stack: copy → CTAs → illustration */}
      <header className="relative order-1 z-0 overflow-hidden border-b border-emerald-100/90 bg-brand-50">
        <div
          className="pointer-events-none absolute inset-0 landing-hero-siteplan opacity-[0.42] sm:opacity-[0.38]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto w-full px-4 pb-10 pt-8 sm:pb-12 sm:pt-10">
          <div className="flex flex-col gap-8">
            <div className="flex min-w-0 flex-col gap-5">
              <p className="w-fit rounded-full border border-emerald-200/90 bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700 sm:text-xs">
                Weekly batch · Pilot
              </p>

              <h1 className="text-balance text-[2rem] font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl sm:leading-[1.1] lg:text-5xl lg:leading-[1.08]">
                One society. One weekly grocery cycle.
              </h1>

              <div className="space-y-2 text-[1.0625rem] leading-snug text-slate-600 sm:text-lg sm:leading-relaxed">
                <p>
                  One cutoff for your society. One vendor batch to the gate — not scattered
                  door-to-door drops.
                </p>
                <p>
                  Built for gated communities: one cutoff every flat follows, one consolidated handoff
                  to the vendor, then flat-wise bags to your society gate.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-1">
                {useExternalWaitlist ? (
                  <Button
                    href={WAITLIST_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 text-[1.05rem] shadow-sm sm:max-w-xs"
                  >
                    Join waitlist
                  </Button>
                ) : (
                  <a
                    href="#waitlist"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-4 text-[1.05rem] font-semibold text-white shadow-sm ring-1 ring-black/5 transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-[0.99] sm:max-w-xs"
                  >
                    Join waitlist
                  </a>
                )}
                <Button
                  href={LIVE_APP_PATH}
                  variant="outline"
                  className="w-full rounded-2xl border-slate-300/90 py-3.5 text-[0.95rem] font-semibold text-slate-800 hover:bg-white sm:max-w-xs"
                >
                  Open live app
                </Button>
              </div>

              <p className="text-sm text-slate-500">
                Live pilot opens at <span className="font-medium text-slate-700">{LIVE_APP_PATH}</span>.
              </p>
            </div>

            <div className="landing-gentle-float flex min-w-0 justify-center">
              <div className="w-full max-w-[20.5rem] rounded-[1.65rem] border border-emerald-100/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03] sm:max-w-md sm:p-6">
                <SocietyBatchIllustration />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2 · Waitlist + QR — directly under hero on phones */}
      <section
        id="waitlist"
        className="relative order-2 z-0 border-b border-emerald-100/80 bg-white/82 backdrop-blur-[2px]"
        aria-labelledby="waitlist-heading"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14">
          <div className="flex flex-col gap-10">
            <div>
              <h2
                id="waitlist-heading"
                className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                Join the waitlist
              </h2>
              <p className="mt-3 max-w-lg text-[1.02rem] leading-snug text-slate-600 sm:text-lg sm:leading-relaxed">
                Pilot societies only. Leave your email — or use the entry card to open the same live
                app on your phone.
              </p>
              <div className="mt-6">
                {useExternalWaitlist ? (
                  <p className="text-[1.02rem] text-slate-600">
                    Waitlist is hosted externally.{" "}
                    <Link
                      href={WAITLIST_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-700 underline-offset-2 hover:underline"
                    >
                      Open the form
                    </Link>
                    .
                  </p>
                ) : (
                  <WaitlistForm />
                )}
              </div>
              <div className="mt-8">
                <Button href={LIVE_APP_PATH} variant="outline" className="rounded-2xl px-5 py-3">
                  Open live app
                </Button>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[1.4rem] border border-emerald-200/90 bg-gradient-to-b from-brand-50 via-white to-white p-5 shadow-md ring-1 ring-slate-900/[0.04] sm:p-6">
              <div
                className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-brand-100/50"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent"
                aria-hidden
              />

              <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-brand-800">
                Society access
              </p>
              <h3 className="relative mt-1 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Enter the live pilot
              </h3>
              <p className="relative mt-2 text-left text-[13px] leading-snug text-slate-600 sm:text-sm">
                Same URL as <span className="font-medium text-slate-800">Open live app</span> — scan to
                load it on your device.
              </p>

              <div className="relative mt-6 flex justify-center">
                <div className="rounded-2xl border border-emerald-200/95 bg-white p-3 shadow-inner ring-2 ring-brand-50">
                  <div className="flex h-[11.25rem] w-[11.25rem] items-center justify-center rounded-xl bg-brand-50/30 sm:h-48 sm:w-48">
                    {qrSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element -- third-party QR image URL
                      <img
                        src={qrSrc}
                        alt="QR code to open the live Community Cart app"
                        width={176}
                        height={176}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="max-w-[12.5rem] px-2 text-center">
                        <p className="text-sm font-semibold text-slate-800">QR ready after deploy</p>
                        <p className="mt-2 text-left text-[12px] leading-snug text-slate-500">
                          Set{" "}
                          <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-emerald-100">
                            LIVE_APP_URL
                          </code>{" "}
                          in{" "}
                          <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-emerald-100">
                            lib/landingConfig.ts
                          </code>{" "}
                          to your https URL.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <p className="relative mt-5 text-center text-[12px] leading-relaxed text-slate-500">
                {qrSrc
                  ? "Encodes your configured live URL for this pilot."
                  : "Configure LIVE_APP_URL to show a scannable society entry code."}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* 3 · Operating loop — connected spine, not equal cards */}
      <section
        className="relative order-3 z-0 bg-white/65 backdrop-blur-[1px]"
        aria-labelledby="loop-heading"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16">
          <h2
            id="loop-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            The society loop
          </h2>
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-snug text-slate-600 sm:text-lg sm:leading-relaxed">
            Residents build the list, admin locks the batch, vendor packs to the gate — same route
            every week.
          </p>

          <div className="relative mt-12 max-w-3xl sm:mt-14">
            <span
              className="absolute bottom-12 left-[0.6rem] top-4 w-px bg-gradient-to-b from-brand-300/90 via-brand-500/35 to-emerald-200/90 sm:left-[0.7rem]"
              aria-hidden
            />
            <ol className="relative m-0 list-none p-0">
              <li className="relative flex gap-4 pb-11 sm:gap-5 sm:pb-14">
                <div className="relative z-[1] flex flex-col items-center pt-1.5">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-brand-600 shadow-sm ring-2 ring-brand-100" />
                </div>
                <div className="group min-w-0 flex-1 rounded-2xl border border-emerald-100/95 bg-white/95 p-5 shadow-sm ring-1 ring-slate-900/[0.03] transition duration-200 hover:-translate-y-px hover:border-emerald-200 hover:shadow-md focus-within:border-emerald-200 focus-within:shadow-md focus-within:ring-2 focus-within:ring-brand-300/50 focus-within:ring-offset-2 focus-within:ring-offset-white sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
                    Step 1 · Resident
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">Residents order</h3>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                    Build your weekly order in one window
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-slate-600 sm:text-[1.02rem]">
                    Add staples and fresh lines before society cutoff — everyone shares the same weekly
                    window.
                  </p>
                </div>
              </li>

              <li className="relative flex gap-4 pb-11 sm:gap-5 sm:pb-14">
                <div className="relative z-[1] flex flex-col items-center pt-1.5">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-slate-700 shadow-sm ring-2 ring-slate-200" />
                </div>
                <div className="min-w-0 flex-1 sm:ml-4 sm:max-w-xl">
                  <div className="group rounded-2xl border border-slate-200/95 bg-slate-50/95 px-5 py-5 shadow-sm ring-1 ring-slate-900/[0.03] transition duration-200 hover:-translate-y-px hover:border-slate-300 hover:bg-white hover:shadow-md focus-within:border-slate-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-slate-300/50 focus-within:ring-offset-2 focus-within:ring-offset-white sm:px-6 sm:py-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Step 2 · Admin
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
                      Admin consolidates
                    </h3>
                    <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                      Consolidate society demand before handoff
                    </p>
                    <p className="mt-2 text-[0.98rem] leading-relaxed text-slate-600 sm:text-[1.02rem]">
                      RWA merges flats into one vendor-facing batch — totals are frozen before pickup
                      planning.
                    </p>
                  </div>
                </div>
              </li>

              <li className="relative flex gap-4 sm:gap-5">
                <div className="relative z-[1] flex flex-col items-center pt-1.5">
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-emerald-700 shadow-sm ring-2 ring-emerald-100" />
                </div>
                <div className="group min-w-0 flex-1 rounded-2xl border-2 border-emerald-200/85 bg-gradient-to-br from-emerald-50/95 to-white p-5 shadow-sm ring-1 ring-emerald-900/[0.04] transition duration-200 hover:-translate-y-px hover:border-emerald-300 hover:shadow-md focus-within:border-emerald-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-emerald-400/45 focus-within:ring-offset-2 focus-within:ring-offset-white sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                    Step 3 · Vendor
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
                    Vendor packs · one stop at the gate
                  </h3>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                    Pack flat-wise bags for one gate delivery
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-slate-700 sm:text-[1.02rem]">
                    Labels per flat, one dispatch to the society gate — residents collect on the agreed
                    slot.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 4 · Why */}
      <section
        className="relative order-4 z-0 border-y border-emerald-100/80 bg-brand-50/45 backdrop-blur-[1px]"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-14">
          <h2 id="why-heading" className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Why it matters
          </h2>
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-snug text-slate-600 sm:text-lg sm:leading-relaxed">
            Same three roles as the loop — here&apos;s what each gains in practice.
          </p>
          <div className="mt-8 flex flex-col gap-6">
            <div className="group rounded-r-lg border-l-[3px] border-brand-600 bg-white/30 py-2 pl-4 pr-2 transition duration-200 hover:bg-white/85 hover:shadow-sm focus-within:bg-white/85 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-brand-200/40 focus-within:ring-offset-2 focus-within:ring-offset-brand-50/0 sm:rounded-xl sm:border sm:border-emerald-100/70 sm:border-t-[3px] sm:border-t-brand-600 sm:py-4 sm:pl-4 sm:pr-4 sm:hover:shadow-md">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Residents
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                Build your weekly order in one window
              </p>
              <p className="mt-2 text-[1.02rem] leading-relaxed text-slate-600 sm:text-[0.98rem]">
                One cutoff and gate pickup — fewer delivery apps and last-minute runs.
              </p>
            </div>
            <div className="group rounded-r-lg border-l-[3px] border-slate-800 bg-white/30 py-2 pl-4 pr-2 transition duration-200 hover:bg-white/85 hover:shadow-sm focus-within:bg-white/85 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-slate-300/45 focus-within:ring-offset-2 focus-within:ring-offset-brand-50/0 sm:rounded-xl sm:border sm:border-emerald-100/70 sm:border-t-[3px] sm:border-t-slate-800 sm:py-4 sm:pl-4 sm:pr-4 sm:hover:shadow-md">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Admin / RWA
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                Consolidate society demand before handoff
              </p>
              <p className="mt-2 text-[1.02rem] leading-relaxed text-slate-600 sm:text-[0.98rem]">
                One batch view before you release totals to the vendor and announce pickup.
              </p>
            </div>
            <div className="group rounded-r-lg border-l-[3px] border-emerald-700 bg-white/30 py-2 pl-4 pr-2 transition duration-200 hover:bg-white/85 hover:shadow-sm focus-within:bg-white/85 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-emerald-300/40 focus-within:ring-offset-2 focus-within:ring-offset-brand-50/0 sm:rounded-xl sm:border sm:border-emerald-100/70 sm:border-t-[3px] sm:border-t-emerald-700 sm:py-4 sm:pl-4 sm:pr-4 sm:hover:shadow-md">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Vendors
              </h3>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-800 sm:text-sm">
                Pack flat-wise bags for one gate delivery
              </p>
              <p className="mt-2 text-[1.02rem] leading-relaxed text-slate-600 sm:text-[0.98rem]">
                One labelled run to the gate — less criss-cross across the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative order-5 z-0 border-t border-emerald-100/80 bg-white/88 backdrop-blur-[1px]">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 px-4 py-8 text-center text-[13px] text-slate-500 sm:px-6">
          <p className="max-w-md">Community Cart — weekly apartment grocery operating system.</p>
          <Link
            href={LIVE_APP_PATH}
            className="shrink-0 font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Enter app →
          </Link>
        </div>
      </footer>
    </article>
  );
}
