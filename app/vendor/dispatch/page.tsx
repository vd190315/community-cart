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
import { readPackedByFlatFromSession } from "@/lib/vendorPackingSession";

export default function VendorDispatchPage() {
  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchedAt, setDispatchedAt] = useState<string | null>(null);
  const [packedByFlat, setPackedByFlat] = useState<Record<string, boolean>>({});

  const households = vendorPackingHouseholdsPaid;
  const totalBags = households.length;

  useEffect(() => {
    setPackedByFlat(readPackedByFlatFromSession());
  }, []);

  const bagsCompleted = useMemo(
    () => households.filter((h) => packedByFlat[h.flat]).length,
    [households, packedByFlat]
  );

  const allPacked = totalBags > 0 && bagsCompleted === totalBags;

  function markDispatched() {
    if (isDispatched) return;
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
          <span className="text-slate-600">Flat bags (packing)</span>
          <span className="font-medium text-slate-900">
            {bagsCompleted} / {totalBags} marked packed
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Dispatch status</span>
          <span className={`font-medium ${isDispatched ? "text-brand-700" : "text-slate-900"}`}>
            {isDispatched ? "En route to society gate" : "Ready for vehicle"}
          </span>
        </div>
        {totalBags > 0 && !allPacked ? (
          <p className="border-t border-amber-100 pt-2 text-[11px] leading-snug text-amber-900">
            Warning: {bagsCompleted} of {totalBags} flat bags are marked packed. In a real run,
            complete all bags in the packing view before dispatch.
          </p>
        ) : null}
        {dispatchedAt ? (
          <p className="border-t border-emerald-100 pt-2 text-xs text-slate-500">
            Marked at <span className="font-medium text-slate-700">{dispatchedAt}</span> (device
            time, demo).
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
              {totalBags} flat bags expected—{bagsCompleted} checked off in packing (demo); none
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

      <button
        type="button"
        onClick={markDispatched}
        disabled={isDispatched}
        className="w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isDispatched ? "Dispatched" : "Mark vehicle dispatched"}
      </button>

      {isDispatched ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-brand-800">
            <p className="font-medium">Dispatch recorded</p>
            <p className="mt-0.5 text-xs text-brand-900/90">
              Coordinator and residents can treat the batch as moving to the society gate for this
              cycle.
            </p>
          </div>
          <Button href="/welcome" className="w-full py-3 text-base font-semibold">
            Return to welcome
          </Button>
        </div>
      ) : null}

      <Link
        href="/vendor/orders"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to consolidated order
      </Link>
    </section>
  );
}
