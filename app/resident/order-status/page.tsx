"use client";

import { Button } from "@/components/ui/Button";
import { demoOrderProgress, demoSociety, sampleOrderId, weeklyCycle, type ResidentOrderStage } from "@/lib/demoData";
import { readHasAdminHandoffFromSession } from "@/lib/demoSessionGates";
import {
  getResidentNotificationsForFlat,
  readOperationalState,
  residentStageFromBatch,
  type VendorOperationalState
} from "@/lib/vendorPackingSession";
import { useResidentCart } from "../ResidentCartProvider";
import { useEffect, useMemo, useState } from "react";

const STAGE_HINTS: Record<ResidentOrderStage, string> = {
  Paid: "Payment is in—your items are locked into this week’s society batch.",
  Packed: "Vendor has packed your flat’s bag; dispatch to the gate is next (same story as admin “Packing”).",
  "Delivered to society gate": "Shipment reached your society—bags are being sorted for flats.",
  "Ready for pickup": "Collect from the society pickup desk during the window they announce."
};

export default function ResidentOrderStatusPage() {
  const { sessionOrderHydrated, hasSessionOrder, residentProfile } = useResidentCart();
  const [hasHandoff, setHasHandoff] = useState(false);
  const [operational, setOperational] = useState<VendorOperationalState | null>(null);

  useEffect(() => {
    function syncHandoff() {
      setHasHandoff(readHasAdminHandoffFromSession());
    }
    syncHandoff();
    window.addEventListener("focus", syncHandoff);
    return () => window.removeEventListener("focus", syncHandoff);
  }, []);

  useEffect(() => {
    if (!hasSessionOrder || !hasHandoff) {
      setOperational(null);
      return;
    }
    function refresh() {
      setOperational(readOperationalState());
    }
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [hasSessionOrder, hasHandoff]);

  const { stages, vendorFulfillmentLegs } = demoOrderProgress.resident;
  const vendorLegs = [...vendorFulfillmentLegs];
  const showVendorSplit = vendorLegs.length > 1;

  const derivedStage: ResidentOrderStage | null =
    operational != null
      ? residentStageFromBatch(operational.batchStatus, operational.dispatched)
      : null;

  const currentStage = derivedStage ?? "Paid";
  const currentStageIndex = stages.indexOf(currentStage);
  const hint = STAGE_HINTS[currentStage];

  const flat = residentProfile.flat;
  const residentFeed = useMemo(() => {
    if (!operational || !hasHandoff) return [];
    return getResidentNotificationsForFlat(operational, flat)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
  }, [operational, flat, hasHandoff]);

  const myBagPacked = operational?.packedByFlat[flat] ?? false;
  const myRemark = operational?.notPackedRemarkByFlat[flat]?.trim() ?? "";
  const batchOps = operational?.batchStatus;

  if (sessionOrderHydrated && !hasSessionOrder) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order status</h1>
        </div>

        <div className="surface-card space-y-3">
          <p className="text-base font-semibold text-slate-900">No previous orders yet</p>
          <p className="text-sm text-slate-600">
            Place this week&apos;s grocery order to start tracking packing, dispatch, and pickup
            updates.
          </p>
          <Button href="/resident/catalog" className="w-full">
            Browse weekly catalog
          </Button>
          <Button href="/resident/home" variant="outline" className="w-full">
            Back to home
          </Button>
        </div>
      </section>
    );
  }

  if (!sessionOrderHydrated) {
    return (
      <section className="space-y-4">
        <p className="text-sm text-slate-600">Loading…</p>
      </section>
    );
  }

  if (hasSessionOrder && !hasHandoff) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order status</h1>
          <p className="text-xs text-slate-500">
            {weeklyCycle.cycleLabel} · Order <span className="font-mono font-medium">{sampleOrderId}</span>
          </p>
        </div>

        <div className="surface-card space-y-2">
          <p className="text-sm font-semibold text-slate-900">Payment received</p>
          <p className="text-sm text-slate-600">
            Your order is in this week&apos;s society batch. After the coordinator hands off to vendors,
            you&apos;ll see packing progress, any batch updates, and pickup timing here.
          </p>
        </div>

        <Button href="/resident/home" className="w-full">
          Back to home
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order status</h1>
        <p className="text-xs text-slate-500">
          {weeklyCycle.cycleLabel} · Order <span className="font-mono font-medium">{sampleOrderId}</span>
        </p>
      </div>

      {operational && batchOps === "Partially packed" && myBagPacked ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
          <p className="font-medium text-slate-800">Batch update</p>
          <p className="mt-1">
            Some flats in this society batch are still being completed at the vendor. Your bag is
            marked packed—weekly delivery is still planned for{" "}
            <span className="font-medium text-slate-900">{weeklyCycle.deliveryLabel}</span>.
          </p>
        </div>
      ) : null}

      {operational && !myBagPacked && myRemark ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-sm text-amber-950">
          <p className="font-semibold">Packing update</p>
          <p className="mt-1">
            Your bag is still pending vendor packing. Reason: {myRemark}.
          </p>
        </div>
      ) : null}

      {residentFeed.length > 0 ? (
        <div className="surface-card space-y-2">
          <p className="text-sm font-semibold text-slate-900">Operational updates</p>
          <ul className="space-y-2 text-sm text-slate-600">
            {residentFeed.map((n) => (
              <li key={n.id} className="border-b border-emerald-50 pb-2 last:border-0 last:pb-0">
                {n.body}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showVendorSplit ? (
        <>
          <div className="surface-card space-y-2">
            <p className="text-sm font-semibold text-slate-900">Suppliers for this order</p>
            <p className="text-sm text-slate-600">
              Part of your order may come from different partners. Each supplier has its own status
              below until everything reaches {demoSociety.name}—still one order for your flat.
            </p>
          </div>

          {vendorLegs.map((leg) => {
            const stageForLeg = currentStage;
            const legHint = STAGE_HINTS[stageForLeg];
            return (
              <div key={leg.vendorName} className="surface-card space-y-2">
                <p className="text-sm font-semibold text-slate-900">{leg.vendorName}</p>
                <p className="text-sm text-slate-800">
                  <span className="font-medium">Now:</span> {stageForLeg}
                </p>
                <p className="text-sm text-slate-600">{legHint}</p>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="surface-card space-y-2">
            <p className="text-sm font-semibold text-slate-900">Now: {currentStage}</p>
            <p className="text-sm text-slate-600">{hint}</p>
            <p className="text-xs text-slate-500">
              Admin coordinates handoff; the vendor updates packing and dispatch—this timeline follows
              that flow after handoff.
            </p>
          </div>

          <div className="surface-card">
            <p className="mb-3 text-sm font-semibold text-slate-900">Progress</p>
            <ol className="space-y-3">
              {stages.map((stage, index) => {
                const isCurrent = stage === currentStage;
                const isCompleted = currentStageIndex >= 0 && index < currentStageIndex;
                return (
                  <li key={stage} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isCurrent
                          ? "bg-brand-600 text-white"
                          : isCompleted
                            ? "bg-brand-100 text-brand-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </span>
                    <span
                      className={`text-sm ${isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}`}
                    >
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Pickup</p>
        <p className="text-sm text-slate-600">
          {weeklyCycle.deliveryLabel} delivery to {demoSociety.name}. {weeklyCycle.pickupWindowHint}
        </p>
      </div>

      <p className="text-xs text-slate-500">
        For live orders, contact your society office or admin through your usual channel.
      </p>

      <Button href="/resident/home" className="w-full">
        Back to home
      </Button>
    </section>
  );
}
