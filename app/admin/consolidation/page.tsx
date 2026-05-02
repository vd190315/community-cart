import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  adminHouseholdOrders,
  consolidatedItemsPaidOrders,
  demoSociety,
  paidHouseholdsEstimatedSavings,
  paidHouseholdsNetTotal,
  pilotMetrics,
  weeklyCycle
} from "@/lib/demoData";

export default function AdminConsolidationPage() {
  const pendingHousehold = adminHouseholdOrders.find((o) => o.paymentStatus === "Pending");
  const paidCount = pilotMetrics.paidHouseholds;

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Vendor sheet</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          Quantities below include only <span className="font-medium text-slate-800">paid</span>{" "}
          households for cycle {weeklyCycle.cycleLabel}.
        </p>
        <p className="text-xs text-slate-500">
          Cutoff {weeklyCycle.cutoffLabel} · {weeklyCycle.deliveryLabel} delivery
        </p>
      </div>

      {pendingHousehold ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
          <span className="font-medium">{pendingHousehold.flat}</span> ({pendingHousehold.resident}) is
          still <span className="font-medium">Pending</span>—excluded from SKU totals until payment
          clears.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Paid households</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{paidCount}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">In this vendor batch</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Net collected (paid)</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            ₹{paidHouseholdsNetTotal.toLocaleString("en-IN")}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">Matches paid rows on dashboard</p>
        </div>
        <div className="surface-card p-3 col-span-2">
          <p className="text-xs text-slate-500">Est. savings (paid batch)</p>
          <p className="mt-1 text-lg font-bold text-brand-700">
            ₹{paidHouseholdsEstimatedSavings.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="surface-card space-y-3">
        <p className="text-sm font-semibold text-slate-900">SKU totals (paid orders only)</p>
        <p className="text-xs text-slate-500">
          Rolled up from the same per-flat lines as the packing demo—one row per catalogue SKU.
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
        <Button href="/admin/tracking" className="w-full py-3 text-base font-semibold">
          Send to vendor and view handoff
        </Button>
        <p className="text-center text-xs text-slate-500">
          Opens tracking so you can confirm the batch left operations.
        </p>
      </div>

      <Link
        href="/admin/dashboard"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to admin dashboard
      </Link>
    </section>
  );
}
