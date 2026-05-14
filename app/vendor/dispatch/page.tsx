"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  demoSociety,
  demoOrderProgress,
  sampleOrderId,
  vendorPackingHouseholdsPaid,
  weeklyCycle
} from "@/lib/demoData";
import { useCashbackTierDemo } from "@/lib/cashbackTierDemoContext";
import {
  appendNotificationsForBatchChange,
  computeBatchStatus,
  readOperationalState,
  writeOperationalState,
  type VendorOperationalState
} from "@/lib/vendorPackingSession";
import { readHasAdminHandoffFromSession } from "@/lib/demoSessionGates";

export default function VendorDispatchPage() {
  const { tierPercent } = useCashbackTierDemo();
  const [hydrated, setHydrated] = useState(false);
  const [vendorBatchAvailable, setVendorBatchAvailable] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchedAt, setDispatchedAt] = useState<string | null>(null);
  const [deliveredAt, setDeliveredAt] = useState<string | null>(null);
  const [operational, setOperational] = useState<VendorOperationalState | null>(null);
  const [cashbackConfirmChecked, setCashbackConfirmChecked] = useState(false);
  const [showDispatchCashbackDemoNote, setShowDispatchCashbackDemoNote] = useState(false);

  const households = vendorPackingHouseholdsPaid;
  const flatIds = useMemo(() => households.map((h) => h.flat), [households]);

  useEffect(() => {
    setVendorBatchAvailable(readHasAdminHandoffFromSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!vendorBatchAvailable) {
      setOperational(null);
      setIsDispatched(false);
      return;
    }
    const s = readOperationalState();
    setOperational(s);
    setIsDispatched(s.dispatched);
  }, [vendorBatchAvailable]);

  useEffect(() => {
    if (!vendorBatchAvailable) return;
    function refresh() {
      const s = readOperationalState();
      setOperational(s);
      setIsDispatched(s.dispatched);
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [vendorBatchAvailable]);

  const packedByFlat = operational?.packedByFlat ?? {};
  const bagsCompleted = useMemo(
    () => households.filter((h) => packedByFlat[h.flat]).length,
    [households, packedByFlat]
  );

  const totalBags = households.length;
  const allPacked = totalBags > 0 && bagsCompleted === totalBags;
  const batchLabel = operational?.batchStatus ?? "Sent to vendor";

  function markDispatched() {
    if (isDispatched || !operational) return;
    const s = readOperationalState();
    const nextDispatched = true;
    const nextStatus = computeBatchStatus(
      s.packedByFlat,
      flatIds,
      nextDispatched,
      s.packingViewVisited,
      s.deliveredToSocietyGate
    );
    let notifications = s.notifications;
    if (s.batchStatus !== nextStatus) {
      notifications = appendNotificationsForBatchChange(s.batchStatus, nextStatus, notifications);
    }
    const next: VendorOperationalState = {
      ...s,
      dispatched: nextDispatched,
      batchStatus: nextStatus,
      notifications
    };
    writeOperationalState(next);
    setOperational(next);
    setIsDispatched(true);
    setDispatchedAt(
      new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
    );
    setShowDispatchCashbackDemoNote(true);
  }

  if (!hydrated || !vendorBatchAvailable) {
    return (
      <section className="space-y-5 pb-6">
        <Link
          href="/vendor/orders"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Back to consolidated order
        </Link>
        {!hydrated ? (
          <p className="text-sm text-slate-600">Loading…</p>
        ) : (
          <div className="surface-card space-y-3">
            <p className="text-base font-semibold text-slate-900">No vendor batch available yet</p>
            <p className="text-sm text-slate-600">
              Dispatch opens only after the admin hands off the consolidated batch in this session.
            </p>
            <Button href="/vendor/orders" className="w-full">
              Back to vendor orders
            </Button>
          </div>
        )}
      </section>
    );
  }

  function markDeliveredToSocietyGate() {
    if (!operational?.dispatched || operational.deliveredToSocietyGate) return;
    const s = readOperationalState();
    if (!s.dispatched || s.deliveredToSocietyGate) return;
    const nextStatus = computeBatchStatus(
      s.packedByFlat,
      flatIds,
      s.dispatched,
      s.packingViewVisited,
      true
    );
    let notifications = s.notifications;
    if (s.batchStatus !== nextStatus) {
      notifications = appendNotificationsForBatchChange(s.batchStatus, nextStatus, notifications);
    }
    const next: VendorOperationalState = {
      ...s,
      deliveredToSocietyGate: true,
      batchStatus: nextStatus,
      notifications
    };
    writeOperationalState(next);
    setOperational(next);
    setDeliveredAt(
      new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
    );
  }

  if (operational?.deliveredToSocietyGate) {
    return (
      <section className="space-y-5 pb-6">
        <Link
          href="/vendor/orders"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Back to consolidated order
        </Link>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Dispatch</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cycle completed</h1>
          <p className="text-sm font-medium text-brand-800">Delivered to society gate</p>
          <p className="text-sm text-slate-600">
            This batch is recorded as delivered at {demoSociety.name} for {weeklyCycle.cycleLabel}.
          </p>
        </div>
        <div className="surface-card space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Order / cycle ID</span>
            <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Fulfillment status</span>
            <span className="font-medium text-brand-700">Delivered to society gate</span>
          </div>
          {deliveredAt ? (
            <p className="border-t border-emerald-100 pt-2 text-xs text-slate-500">
              Confirmed at <span className="font-medium text-slate-700">{deliveredAt}</span> (device
              time).
            </p>
          ) : null}
        </div>
        <Button href="/vendor/orders" variant="outline" className="w-full py-3 text-base font-semibold">
          View orders summary
        </Button>
        <Button href="/welcome" className="w-full py-3 text-base font-semibold">
          Return to welcome
        </Button>
        <p className="text-center text-[11px] text-slate-500">
          To reset: clear session storage or use a fresh tab to run the flow again.
        </p>
      </section>
    );
  }

  if (isDispatched) {
    return (
      <section className="space-y-5 pb-6">
        <Link
          href="/vendor/orders"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Back to consolidated order
        </Link>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Dispatch</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vehicle dispatched</h1>
          <p className="text-sm text-slate-600">
            The vehicle is en route to {demoSociety.name}. Confirm handoff when the batch is dropped
            at the society gate.
          </p>
        </div>
        {showDispatchCashbackDemoNote ? (
          <p
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-brand-900"
            role="status"
          >
            Dispatch marked and {tierPercent}% cashback confirmed for this cycle.
          </p>
        ) : null}
        <div className="surface-card space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Batch ID</span>
            <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Dispatch status</span>
            <span className="font-medium text-brand-700">Dispatched to society gate</span>
          </div>
          {dispatchedAt ? (
            <p className="border-t border-emerald-100 pt-2 text-xs text-slate-500">
              Dispatched at <span className="font-medium text-slate-700">{dispatchedAt}</span>{" "}
              (device time).
            </p>
          ) : null}
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-brand-800">
          <p className="font-medium">Dispatch recorded</p>
          <p className="mt-0.5 text-xs text-brand-900/90">
            When the gate handoff is complete, confirm below so coordinators and residents see the
            final status.
          </p>
        </div>
        <button
          type="button"
          onClick={markDeliveredToSocietyGate}
          className="w-full rounded-xl border-2 border-brand-600 bg-white px-4 py-3 text-base font-semibold text-brand-800 transition hover:bg-emerald-50"
        >
          Mark delivered to society gate
        </button>
        <Button href="/vendor/orders" variant="outline" className="w-full py-3 text-base font-semibold">
          View orders summary
        </Button>
        <Button href="/welcome" variant="outline" className="w-full py-3 text-base font-semibold">
          Return to welcome
        </Button>
        <p className="text-center text-[11px] text-slate-500">
          To reset: clear session storage or use a fresh tab to run packing and dispatch again.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 pb-6">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Dispatch</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gate handoff</h1>
        <p className="text-sm text-slate-600">
          Final check before vehicle leaves for {demoSociety.name} ({weeklyCycle.deliveryLabel}).
        </p>
      </div>

      <div className="surface-card space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Batch ID</span>
          <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Cycle</span>
          <span className="font-medium text-slate-900">{weeklyCycle.cycleLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Society cutoff (RWA)</span>
          <span className="font-medium text-slate-900">{weeklyCycle.cutoffLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Committed delivery</span>
          <span className="font-medium text-slate-900">{weeklyCycle.deliveryLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Batch packing status</span>
          <span
            className={`font-medium ${batchLabel === "Partially packed" ? "text-amber-800" : "text-slate-900"}`}
          >
            {batchLabel}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Flat bags (packing)</span>
          <span className="font-medium text-slate-900">
            {bagsCompleted} / {totalBags} marked packed
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Dispatch status</span>
          <span className="font-medium text-slate-900">Ready for vehicle</span>
        </div>
        {totalBags > 0 && !allPacked ? (
          <p className="border-t border-amber-100 pt-2 text-[11px] leading-snug text-amber-900">
            Partial batch: {bagsCompleted} of {totalBags} flat bags marked packed. Reasons on file for
            queued flats—coordinator and residents were notified in the order feed.
          </p>
        ) : null}
      </div>

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Pre-flight checklist</p>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="text-brand-600">•</span>
            <span>SKU totals match admin consolidation (paid batch) for {sampleOrderId}</span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-600">•</span>
            <span>
              {totalBags} flat bags expected—{bagsCompleted} checked off in packing; none
              mixed
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-600">•</span>
            <span>Vehicle, driver, and society gate contact confirmed</span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-600">•</span>
            <span>
              After gate drop, residents move toward{" "}
              <span className="font-medium text-slate-800">
                {demoOrderProgress.resident.stages[2]}
              </span>{" "}
              in the app
            </span>
          </li>
        </ul>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm">
        <input
          type="checkbox"
          checked={cashbackConfirmChecked}
          onChange={(e) => setCashbackConfirmChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-emerald-300 text-brand-600 focus:ring-brand-300"
        />
        <span>Confirm {tierPercent}% cashback for all participating flats this cycle</span>
      </label>

      <button
        type="button"
        onClick={markDispatched}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
      >
        Mark vehicle dispatched
      </button>

      <Link
        href="/vendor/orders"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to consolidated order
      </Link>
    </section>
  );
}
