"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { demoOrderProgress, sampleOrderId, vendorPackingHouseholdsPaid, weeklyCycle } from "@/lib/demoData";
import { readPackedByFlatFromSession, writePackedByFlatToSession } from "@/lib/vendorPackingSession";

export default function VendorPackingPage() {
  const [packedByFlat, setPackedByFlat] = useState<Record<string, boolean>>({});
  const households = vendorPackingHouseholdsPaid;

  useEffect(() => {
    setPackedByFlat(readPackedByFlatFromSession());
  }, []);

  const packedCount = useMemo(
    () => households.filter((household) => packedByFlat[household.flat]).length,
    [packedByFlat, households]
  );

  const totalBags = households.length;

  function togglePacked(flat: string) {
    setPackedByFlat((prev) => {
      const next = { ...prev, [flat]: !prev[flat] };
      writePackedByFlatToSession(next);
      return next;
    });
  }

  const allPacked = packedCount === totalBags && totalBags > 0;

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
      </div>

      <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs text-slate-700">
        Residents in app see <span className="font-medium">{demoOrderProgress.resident.currentStage}</span>{" "}
        while you complete this step—next is gate delivery, then pickup ready.
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
            </article>
          );
        })}
      </div>

      {allPacked ? (
        <p className="text-center text-xs font-medium text-brand-800">
          All paid flats packed—hand off to dispatch for {weeklyCycle.deliveryLabel} run.
        </p>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-3">
          <Button href="/vendor/dispatch" className="w-full py-3 text-base font-semibold">
            Continue to dispatch
          </Button>
          {totalBags > 0 && !allPacked ? (
            <p className="mt-1.5 text-center text-[10px] leading-snug text-amber-800">
              Some flat bags are still queued. Double-check all bags before vehicle handoff.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
