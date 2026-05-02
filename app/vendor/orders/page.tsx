import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  consolidatedItemsPaidOrders,
  demoSociety,
  paidHouseholdsEstimatedSavings,
  paidHouseholdsGrossTotal,
  pilotMetrics,
  sampleOrderId,
  weeklyCycle
} from "@/lib/demoData";

export default function VendorOrdersPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Consolidated batch</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          Paid households only—matches the admin consolidation sheet for this cycle.
        </p>
        <p className="text-xs text-slate-500">
          Cycle {weeklyCycle.cycleLabel} · Cutoff {weeklyCycle.cutoffLabel} · Delivery{" "}
          {weeklyCycle.deliveryLabel}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-3 col-span-2">
          <p className="text-xs text-slate-500">Order / cycle ID</p>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-900">{sampleOrderId}</p>
          <p className="mt-1 text-[10px] text-slate-500">Same ID on admin tracking and resident confirmation</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Paid households</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{pilotMetrics.paidHouseholds}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">In this dispatch batch</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Order cutoff</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {weeklyCycle.cutoffLabel}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Delivery window</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{weeklyCycle.deliveryLabel}</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">List GMV (paid batch)</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            ₹{paidHouseholdsGrossTotal.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Est. bulk savings (paid)</p>
          <p className="mt-1 text-lg font-bold text-brand-700">
            ₹{paidHouseholdsEstimatedSavings.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="surface-card space-y-3">
        <p className="text-sm font-semibold text-slate-900">SKU totals (paid orders)</p>
        <p className="text-xs text-slate-500">
          Line-for-line same rollup as admin → consolidation → vendor sheet.
        </p>
        <div className="space-y-2">
          {consolidatedItemsPaidOrders.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/20 px-3 py-2"
            >
              <p className="text-sm text-slate-800">{item.name}</p>
              <p className="text-sm font-semibold text-slate-900">{item.units} units</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button href="/vendor/packing" className="w-full py-3 text-base font-semibold">
          Start flat-wise packing
        </Button>
        <p className="text-center text-xs text-slate-500">
          One labelled bag per paid flat—quantities below match this list.
        </p>
      </div>

      <Link
        href="/vendor/login"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to vendor sign-in
      </Link>
    </section>
  );
}
