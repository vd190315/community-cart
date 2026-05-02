"use client";

import { Button } from "@/components/ui/Button";
import { demoOrderProgress, demoSociety, sampleOrderId, weeklyCycle } from "@/lib/demoData";
import { useResidentCart } from "../ResidentCartProvider";

const STAGE_HINTS: Record<(typeof demoOrderProgress.resident.stages)[number], string> = {
  Paid: "Payment is in—your items are locked into this week’s society batch.",
  Packed: "Vendor has packed your flat’s bag; dispatch to the gate is next (same story as admin “Packing”).",
  "Delivered to society gate": "Shipment reached your society—bags are being sorted for flats.",
  "Ready for pickup": "Collect from the society pickup desk during the window they announce."
};

export default function ResidentOrderStatusPage() {
  const { sessionOrderHydrated, hasSessionOrder } = useResidentCart();
  const { stages, currentStage } = demoOrderProgress.resident;
  const currentStageIndex = stages.indexOf(currentStage);
  const hint = STAGE_HINTS[currentStage];

  if (sessionOrderHydrated && !hasSessionOrder) {
    return (
      <section className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order status</h1>
        </div>

        <div className="surface-card space-y-3">
          <p className="text-base font-semibold text-slate-900">No previous orders yet</p>
          <p className="text-sm text-slate-600">
            Place this week&apos;s order from the catalog (demo checkout with UPI), then you can
            follow consolidated packing and gate delivery updates here for your flat.
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

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order status</h1>
        <p className="text-xs text-slate-500">
          {weeklyCycle.cycleLabel} · Order <span className="font-mono font-medium">{sampleOrderId}</span>
        </p>
      </div>

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Now: {currentStage}</p>
        <p className="text-sm text-slate-600">{hint}</p>
        <p className="text-xs text-slate-500">
          Admin sees “Packing” and vendor sees flat-wise packing for the same consolidated order—demo
          timelines stay in sync.
        </p>
      </div>

      <div className="surface-card">
        <p className="mb-3 text-sm font-semibold text-slate-900">Progress</p>
        <ol className="space-y-3">
          {stages.map((stage, index) => {
            const isCurrent = stage === currentStage;
            const isCompleted = index < currentStageIndex;
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

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Pickup</p>
        <p className="text-sm text-slate-600">
          {weeklyCycle.deliveryLabel} delivery to {demoSociety.name}. {weeklyCycle.pickupWindowHint}
        </p>
      </div>

      <p className="text-xs text-slate-500">
        Pilot demo: for real orders, contact your society office or admin through your usual channel.
      </p>

      <Button href="/resident/home" className="w-full">
        Back to home
      </Button>
    </section>
  );
}
