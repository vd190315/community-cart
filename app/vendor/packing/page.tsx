"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { sampleOrderId, vendorPackingHouseholdsPaid, weeklyCycle } from "@/lib/demoData";
import { readHasAdminHandoffFromSession } from "@/lib/demoSessionGates";
import {
  appendNotificationsForBatchChange,
  computeBatchStatus,
  readOperationalState,
  stripFlatNotificationsForFlat,
  upsertFlatNotPackedNotifications,
  writeOperationalState,
  type VendorOperationalState
} from "@/lib/vendorPackingSession";

export default function VendorPackingPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [vendorBatchAvailable, setVendorBatchAvailable] = useState(false);
  const [operational, setOperational] = useState<VendorOperationalState | null>(null);
  const [continueError, setContinueError] = useState(false);
  const households = vendorPackingHouseholdsPaid;
  const flatIds = useMemo(() => households.map((h) => h.flat), [households]);

  useEffect(() => {
    setVendorBatchAvailable(readHasAdminHandoffFromSession());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!vendorBatchAvailable) {
      setOperational(null);
      return;
    }
    let s = readOperationalState();
    if (s.dispatched) {
      setOperational(s);
      return;
    }
    if (!s.packingViewVisited) {
      const nextStatus = computeBatchStatus(
        s.packedByFlat,
        flatIds,
        s.dispatched,
        true,
        s.deliveredToSocietyGate
      );
      let notifications = s.notifications;
      if (s.batchStatus !== nextStatus) {
        notifications = appendNotificationsForBatchChange(s.batchStatus, nextStatus, notifications);
      }
      s = {
        ...s,
        packingViewVisited: true,
        batchStatus: nextStatus,
        notifications
      };
      writeOperationalState(s);
    }
    setOperational(s);
  }, [flatIds, vendorBatchAvailable]);

  useEffect(() => {
    if (!vendorBatchAvailable) return;
    function refresh() {
      setOperational(readOperationalState());
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [vendorBatchAvailable]);

  const packedByFlat = operational?.packedByFlat ?? {};
  const remarks = operational?.notPackedRemarkByFlat ?? {};

  const packedCount = useMemo(
    () => households.filter((household) => packedByFlat[household.flat]).length,
    [packedByFlat, households]
  );

  const totalBags = households.length;
  const allPacked = packedCount === totalBags && totalBags > 0;
  const isPartial = packedCount > 0 && packedCount < totalBags;

  const canContinueToDispatch = useMemo(() => {
    if (packedCount === 0) return true;
    if (allPacked) return true;
    for (const h of households) {
      if (!packedByFlat[h.flat] && !remarks[h.flat]?.trim()) {
        return false;
      }
    }
    return true;
  }, [packedCount, allPacked, households, packedByFlat, remarks]);

  function commit(next: VendorOperationalState) {
    writeOperationalState(next);
    setOperational(next);
  }

  function applyStateChange(
    prev: VendorOperationalState,
    patch: Partial<
      Pick<VendorOperationalState, "packedByFlat" | "notPackedRemarkByFlat" | "notifications">
    >
  ): VendorOperationalState {
    const next: VendorOperationalState = {
      ...prev,
      packedByFlat: patch.packedByFlat ?? prev.packedByFlat,
      notPackedRemarkByFlat: patch.notPackedRemarkByFlat ?? prev.notPackedRemarkByFlat,
      notifications: patch.notifications ?? prev.notifications
    };
    const nextStatus = computeBatchStatus(
      next.packedByFlat,
      flatIds,
      next.dispatched,
      next.packingViewVisited,
      next.deliveredToSocietyGate
    );
    let notifications = next.notifications;
    if (prev.batchStatus !== nextStatus) {
      notifications = appendNotificationsForBatchChange(prev.batchStatus, nextStatus, notifications);
    }
    return { ...next, batchStatus: nextStatus, notifications };
  }

  function togglePacked(flat: string) {
    if (!operational) return;
    const prev = operational;
    const nextPacked = !packedByFlat[flat];
    const packed = { ...packedByFlat, [flat]: nextPacked };
    const nextRemarks = { ...remarks };
    let notifications = prev.notifications;
    if (nextPacked) {
      delete nextRemarks[flat];
      notifications = stripFlatNotificationsForFlat(notifications, flat);
    }
    commit(
      applyStateChange(prev, {
        packedByFlat: packed,
        notPackedRemarkByFlat: nextRemarks,
        notifications
      })
    );
  }

  function updateRemark(flat: string, text: string) {
    if (!operational) return;
    if (packedByFlat[flat]) return;
    const prev = operational;
    const nextRemarks = { ...remarks, [flat]: text };
    const notifications = upsertFlatNotPackedNotifications(
      { ...prev, notPackedRemarkByFlat: nextRemarks },
      flat,
      households.find((h) => h.flat === flat)?.resident ?? "",
      text
    );
    commit(applyStateChange(prev, { notPackedRemarkByFlat: nextRemarks, notifications }));
  }

  function handleContinueToDispatch() {
    if (!canContinueToDispatch) {
      setContinueError(true);
      return;
    }
    setContinueError(false);
    router.push("/vendor/dispatch");
  }

  if (!hydrated || !vendorBatchAvailable) {
    return (
      <section className="space-y-4 pb-28">
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
              Packing opens only after the admin sends the consolidated batch in this session.
            </p>
            <Button href="/vendor/orders" className="w-full">
              Back to vendor orders
            </Button>
          </div>
        )}
      </section>
    );
  }

  if (!operational) {
    return (
      <section className="space-y-4 pb-28">
        <p className="text-sm text-slate-600">Loading…</p>
      </section>
    );
  }

  if (operational.deliveredToSocietyGate) {
    return (
      <section className="space-y-4 pb-28">
        <Link
          href="/vendor/orders"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Back to consolidated order
        </Link>
        <div className="surface-card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">This cycle</p>
          <p className="text-base font-semibold text-slate-900">Cycle completed</p>
          <p className="text-sm font-medium text-brand-800">Delivered to society gate</p>
          <p className="text-sm text-slate-600">
            Packing and dispatch are closed for {weeklyCycle.cycleLabel}. Use orders or welcome to
            exit the demo.
          </p>
          <p className="text-xs text-slate-600">
            Order / cycle ID{" "}
            <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
          </p>
        </div>
        <Button href="/vendor/orders" className="w-full">
          Back to vendor orders
        </Button>
        <Button href="/welcome" variant="outline" className="w-full">
          Return to welcome
        </Button>
      </section>
    );
  }

  if (operational.dispatched) {
    return (
      <section className="space-y-4 pb-28">
        <Link
          href="/vendor/orders"
          className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          ← Back to consolidated order
        </Link>
        <div className="surface-card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">This cycle</p>
          <p className="text-base font-semibold text-slate-900">Packing closed — vehicle dispatched</p>
          <p className="text-sm text-slate-600">
            Finish gate confirmation on dispatch: mark delivered to society gate when the handoff is
            complete.
          </p>
          <p className="text-xs text-slate-600">
            Order / cycle ID{" "}
            <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
          </p>
        </div>
        <Button href="/vendor/dispatch" className="w-full">
          Open dispatch
        </Button>
        <Button href="/vendor/orders" variant="outline" className="w-full">
          Back to vendor orders
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4 pb-28">
      <Link
        href="/vendor/orders"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to consolidated order
      </Link>

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Packing</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Flat-wise bags</h1>
        <p className="text-sm text-slate-600">
          <span className="font-mono text-slate-800">{sampleOrderId}</span> · {weeklyCycle.cycleLabel}
        </p>
        <p className="text-xs text-slate-500">
          Paid households only ({households.length} flats)—same lines as the consolidated SKU sheet.
          Label each bag with flat + resident name before dispatch.
        </p>
        <p className="text-xs font-medium text-slate-700">
          Batch ops: <span className="text-brand-800">{operational.batchStatus}</span>
        </p>
      </div>

      <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs text-slate-700">
        Residents in app see order status while you complete this step—society delivery window stays{" "}
        <span className="font-medium">{weeklyCycle.deliveryLabel}</span> for the cycle.
        {isPartial ? (
          <span className="mt-1 block font-medium text-amber-900">
            Partially packed: add a short reason for every flat still queued before dispatch.
          </span>
        ) : null}
      </div>

      <div className="surface-card flex items-center justify-between p-3">
        <p className="text-sm text-slate-600">Bags completed</p>
        <p className="text-sm font-semibold text-slate-900">
          {packedCount} / {totalBags}
        </p>
      </div>

      <div className="space-y-3">
        {households.map((household) => {
          const isPacked = packedByFlat[household.flat] ?? false;
          return (
            <article key={household.flat} className="surface-card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{household.flat}</p>
                  <p className="text-xs text-slate-600">{household.resident}</p>
                  <p className="mt-1 text-[10px] text-slate-500">Print / write flat on outer bag</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    isPacked ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isPacked ? "Packed" : "Queued"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-700">Pick &amp; pack</p>
                {household.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <p className="text-slate-700">{item.name}</p>
                    <p className="font-medium tabular-nums text-slate-900">×{item.qty}</p>
                  </div>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isPacked}
                  onChange={() => togglePacked(household.flat)}
                  className="h-4 w-4 rounded border-emerald-300 text-brand-600 focus:ring-brand-300"
                />
                Bag sealed and checked off
              </label>

              {!isPacked ? (
                <div className="space-y-1">
                  <label
                    htmlFor={`remark-${household.flat}`}
                    className="text-xs font-medium text-slate-700"
                  >
                    Reason not packed
                    {isPartial ? <span className="text-amber-800"> · required while queued</span> : null}
                  </label>
                  <input
                    id={`remark-${household.flat}`}
                    type="text"
                    maxLength={120}
                    value={remarks[household.flat] ?? ""}
                    onChange={(e) => updateRemark(household.flat, e.target.value)}
                    placeholder="e.g. Item unavailable, stock short"
                    className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {allPacked ? (
        <p className="text-center text-xs font-medium text-brand-800">
          All paid flats packed—hand off to dispatch for {weeklyCycle.deliveryLabel} run.
        </p>
      ) : null}

      {continueError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950">
          Add a short reason for each flat still queued before continuing to dispatch.
        </p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-3">
          <Button type="button" onClick={handleContinueToDispatch} className="w-full py-3 text-base font-semibold">
            Continue to dispatch
          </Button>
          {totalBags > 0 && !allPacked ? (
            <p className="mt-1.5 text-center text-[10px] leading-snug text-amber-800">
              Some flat bags are still queued. If any stay queued through dispatch, reasons are logged
              for admin and residents.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
