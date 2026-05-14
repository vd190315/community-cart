"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { demoOrderProgress, demoSociety, sampleOrderId, vendorPackingHouseholdsPaid } from "@/lib/demoData";
import { readHasAdminHandoffFromSession, readHasResidentOrderFromSession } from "@/lib/demoSessionGates";
import {
  adminLegCopyFromBatch,
  adminTimelineIndexFromBatch,
  getAdminNotifications,
  readOperationalState,
  type VendorOperationalState
} from "@/lib/vendorPackingSession";

export default function AdminTrackingPage() {
  const { stages, vendorFulfillmentLegs } = demoOrderProgress.admin;
  const adminVendorLegs = [...vendorFulfillmentLegs];
  const showVendorSplit = adminVendorLegs.length > 1;

  const [hydrated, setHydrated] = useState(false);
  const [hasResidentOrder, setHasResidentOrder] = useState(false);
  const [hasHandoff, setHasHandoff] = useState(false);
  const [operational, setOperational] = useState<VendorOperationalState | null>(null);

  useEffect(() => {
    setHasResidentOrder(readHasResidentOrderFromSession());
    setHasHandoff(readHasAdminHandoffFromSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHandoff) {
      setOperational(null);
      return;
    }
    function refresh() {
      setOperational(readOperationalState());
    }
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [hasHandoff]);

  const queuedWithReasons = useMemo(() => {
    if (!hasHandoff || !operational) return [];
    return vendorPackingHouseholdsPaid
      .filter((h) => {
        const notPacked = !operational.packedByFlat[h.flat];
        const reason = operational.notPackedRemarkByFlat[h.flat]?.trim();
        return notPacked && Boolean(reason);
      })
      .map((h) => ({
        flat: h.flat,
        resident: h.resident,
        reason: operational!.notPackedRemarkByFlat[h.flat]!.trim()
      }));
  }, [hasHandoff, operational]);

  const adminFeed = useMemo(() => {
    if (!hasHandoff || !operational) return [];
    return getAdminNotifications(operational)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6);
  }, [hasHandoff, operational]);

  const currentStageIndex =
    operational != null
      ? adminTimelineIndexFromBatch(operational.batchStatus, operational.dispatched)
      : 0;

  const singleLegCopy =
    operational != null ? adminLegCopyFromBatch(operational.batchStatus) : adminLegCopyFromBatch("Sent to vendor");

  const showPartialAlert =
    Boolean(
      hasHandoff &&
        operational &&
        (operational.batchStatus === "Partially packed" || queuedWithReasons.length > 0)
    );

  if (!hydrated) {
    return (
      <section className="space-y-5">
        <p className="text-sm text-slate-600">Loading…</p>
      </section>
    );
  }

  if (!hasHandoff) {
    return (
      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Admin Tracking</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
          <p className="text-sm text-slate-600">
            Consolidated batch handoff—use this after you send the vendor sheet so fulfillment status
            stays aligned with operations.
          </p>
        </div>

        <div className="surface-card space-y-2">
          <p className="text-base font-semibold text-slate-900">No vendor handoff yet</p>
          <p className="text-sm text-slate-600">
            {hasResidentOrder
              ? "Review consolidation and tap “Send to vendor and view handoff” to release this batch to fulfillment partners."
              : "Complete a resident checkout first, then prepare consolidation and send the batch to the vendor."}
          </p>
        </div>

        <Button href="/admin/consolidation" variant="outline" className="w-full">
          Go to consolidation
        </Button>

        <Button href="/admin/dashboard" className="w-full">
          Go back to admin dashboard
        </Button>

        <Link
          href="/welcome"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Exit to welcome
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Admin Tracking</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          Consolidated batch handoff—vendor packing and dispatch update this timeline after handoff.
        </p>
      </div>

      {showPartialAlert ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-sm text-amber-950">
          <p className="font-semibold">Vendor packing alert</p>
          {operational?.batchStatus === "Partially packed" ? (
            <p className="mt-1">Batch is partially packed—some flat bags are still queued at the vendor.</p>
          ) : null}
          {queuedWithReasons.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {queuedWithReasons.map((q) => (
                <li key={q.flat}>
                  <span className="font-medium">{q.flat}</span> ({q.resident}) — not packed. Reason:{" "}
                  {q.reason}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {adminFeed.length > 0 ? (
        <div className="surface-card space-y-2">
          <p className="text-sm font-semibold text-slate-900">Operational updates</p>
          <ul className="space-y-2 text-sm text-slate-600">
            {adminFeed.map((n) => (
              <li key={n.id} className="border-b border-emerald-50 pb-2 last:border-0 last:pb-0">
                {n.body}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="surface-card space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Order/Cycle ID</span>
          <span className="font-medium text-slate-900">{hasResidentOrder ? sampleOrderId : "—"}</span>
        </div>
        {showVendorSplit ? (
          <p className="text-xs text-slate-600">
            This batch has multiple fulfilment partners—status below is shown per partner for the same
            consolidated order.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Status</span>
              <span className="font-medium text-brand-700">{singleLegCopy.statusLabel}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Next step</span>
              <span className="font-medium text-slate-900">{singleLegCopy.nextStepLabel}</span>
            </div>
          </>
        )}
      </div>

      {showVendorSplit ? (
        <div className="surface-card space-y-3">
          <p className="text-sm font-semibold text-slate-900">Fulfilment by partner</p>
          <ul className="space-y-3">
            {adminVendorLegs.map((leg) => {
              const copy =
                operational != null ? adminLegCopyFromBatch(operational.batchStatus) : adminLegCopyFromBatch("Sent to vendor");
              return (
                <li
                  key={leg.vendorName}
                  className="rounded-xl border border-emerald-100 bg-white px-3 py-3 sm:px-4"
                >
                  <p className="text-sm font-semibold text-slate-900">{leg.vendorName}</p>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Status:</span> {copy.statusLabel}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Next step:</span> {copy.nextStepLabel}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Timeline</p>
        {showVendorSplit ? (
          <p className="text-xs text-slate-500">
            Society-wide batch milestones—partner-specific status is in “Fulfilment by partner” above.
          </p>
        ) : null}
        <ol className="space-y-2">
          {stages.map((stage, index) => {
            const isCurrent = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            return (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isCurrent
                      ? "bg-brand-600 text-white"
                      : isCompleted
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                <span className={isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}>
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-sm text-slate-600">
        Packing and gate dispatch are handled in the vendor interface; this view stays the
        coordinator reference for the same batch.
      </p>

      <Button href="/admin/dashboard?status=sent-to-vendor" className="w-full">
        Go back to admin dashboard
      </Button>

      <Link
        href="/admin/consolidation"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to consolidation
      </Link>

      <Link
        href="/welcome"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Exit to welcome
      </Link>
    </section>
  );
}
