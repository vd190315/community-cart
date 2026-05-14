import { adminHouseholdOrders, demoSociety, pilotMetrics, weeklyCycle } from "@/lib/demoData";

/**
 * Purchase- and sample-household-backed dashboard panel only.
 */
export function AdminPurchasesAndHouseholds() {
  const pendingCount = pilotMetrics.participatingHouseholds - pilotMetrics.paidHouseholds;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Flats in this cycle</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{pilotMetrics.participatingHouseholds}</p>
          <p className="mt-0.5 text-[10px] text-slate-500">Sample households ordering</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Paid vs pending</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {pilotMetrics.paidHouseholds} paid
            {pendingCount > 0 ? (
              <span className="text-base font-semibold text-amber-800"> · {pendingCount} pending</span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">Matches list below</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Order cutoff</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {weeklyCycle.cutoffLabel}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Society total flats</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{demoSociety.totalFlats}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Total GMV (list)</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            ₹{pilotMetrics.totalGmv.toLocaleString("en-IN")}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">All sample flats, pre-discount</p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Est. bulk savings</p>
          <p className="mt-1 text-lg font-bold text-brand-700">
            ₹{pilotMetrics.estimatedSavings.toLocaleString("en-IN")}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">Vs retail, same basket</p>
        </div>
      </div>

      <div className="surface-card space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">Household orders (sample)</p>
          <p className="text-xs text-slate-500">{weeklyCycle.cycleLabel}</p>
        </div>
        <p className="text-xs text-slate-500">
          Same four flats appear in resident and vendor views—amounts are net of catalogue savings.
        </p>
        <div className="space-y-2">
          {adminHouseholdOrders.map((order) => (
            <div
              key={`${order.flat}-${order.resident}`}
              className="rounded-xl border border-emerald-100 bg-emerald-50/20 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{order.flat}</p>
                <p className="text-sm font-semibold text-slate-900">
                  ₹{order.amount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-600">{order.resident}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.paymentStatus === "Paid"
                      ? "bg-brand-100 text-brand-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
