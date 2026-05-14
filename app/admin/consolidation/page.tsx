"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  adminCashbackConsolidationSummaryLine,
  adminCashbackDemo,
  adminHouseholdOrders,
  consolidatedItemsPaidOrders,
  demoSociety,
  getConsolidationVendorRouting,
  paidHouseholdsEstimatedSavings,
  paidHouseholdsNetTotal,
  pilotMetrics,
  weeklyCycle,
  type ConsolidationVendorRoutingRow
} from "@/lib/demoData";
import { useCashbackTierDemo } from "@/lib/cashbackTierDemoContext";
import { markAdminVendorHandoffInSession, readHasResidentOrderFromSession } from "@/lib/demoSessionGates";

export default function AdminConsolidationPage() {
  const router = useRouter();
  const { tierPercent } = useCashbackTierDemo();
  const [hydrated, setHydrated] = useState(false);
  const [hasResidentOrder, setHasResidentOrder] = useState(false);

  useEffect(() => {
    setHasResidentOrder(readHasResidentOrderFromSession());
    setHydrated(true);
  }, []);

  const pendingHousehold = adminHouseholdOrders.find((o) => o.paymentStatus === "Pending");
  const paidCount = pilotMetrics.paidHouseholds;
  const vendorRouting = getConsolidationVendorRouting();

  const vendorRoutingGroups: [string, ConsolidationVendorRoutingRow[]][] = (() => {
    const m = new Map<string, ConsolidationVendorRoutingRow[]>();
    for (const row of vendorRouting.rows) {
      const list = m.get(row.vendorName) ?? [];
      list.push(row);
      m.set(row.vendorName, list);
    }
    return Array.from(m.entries());
  })();

  function handleSendToVendor() {
    if (!hasResidentOrder) return;
    markAdminVendorHandoffInSession();
    router.push("/admin/tracking");
  }

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

      {!hydrated ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : !hasResidentOrder ? (
        <div className="surface-card space-y-2">
          <p className="text-base font-semibold text-slate-900">No resident orders received yet</p>
          <p className="text-sm text-slate-600">
            There is nothing to consolidate until a household completes checkout in this browser
            session.
          </p>
          <Button href="/admin/dashboard" variant="outline" className="w-full">
            Back to admin dashboard
          </Button>
        </div>
      ) : (
        <>
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

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">
              {adminCashbackDemo.consolidationHeading}
            </p>
            <p className="mt-1.5 text-sm font-medium leading-snug text-slate-900">
              {adminCashbackConsolidationSummaryLine(tierPercent)}
            </p>
          </div>

          <div className="surface-card space-y-3">
            <p className="text-sm font-semibold text-slate-900">SKU totals (paid orders only)</p>
            <p className="text-xs text-slate-500">
              Rolled up from the same per-flat lines as the packing flow—one row per catalogue SKU.
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

          <div className="surface-card space-y-3">
            <p className="text-sm font-semibold text-slate-900">Vendor routing for this batch</p>
            <p className="text-xs text-slate-500">
              How paid society demand is allocated to fulfilment partners for this cycle. Routing
              matches tracking legs.
            </p>
            {vendorRouting.isSplit ? (
              <div className="space-y-4">
                {vendorRoutingGroups.map(([vendorName, rows]) => (
                  <div key={vendorName} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {vendorName}
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-emerald-100">
                      <table className="w-full min-w-[280px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-emerald-100 bg-emerald-50/40 text-xs text-slate-600">
                            <th className="px-3 py-2 font-medium">Product</th>
                            <th className="px-3 py-2 font-medium">Total qty</th>
                            <th className="px-3 py-2 font-medium">Society rate / unit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr
                              key={`${vendorName}-${r.productName}`}
                              className="border-b border-emerald-50 last:border-0"
                            >
                              <td className="px-3 py-2 text-slate-800">{r.productName}</td>
                              <td className="px-3 py-2 font-medium text-slate-900">{r.units}</td>
                              <td className="px-3 py-2 text-slate-800">
                                ₹{r.societyRatePerUnit.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-700">
                All items in this batch are being fulfilled by{" "}
                <span className="font-semibold text-slate-900">{vendorRouting.singleVendorName}</span>.
              </p>
            )}
          </div>
        </>
      )}

      {hydrated && hasResidentOrder ? (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleSendToVendor}
            className="w-full py-3 text-base font-semibold"
          >
            Send to vendor and view handoff
          </Button>
          <p className="text-center text-xs text-slate-500">
            Records the handoff and opens tracking so you can confirm the batch left operations.
          </p>
        </div>
      ) : null}

      <Link
        href="/admin/dashboard"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to admin dashboard
      </Link>
    </section>
  );
}
