import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { adminHouseholdOrders, demoSociety, pilotMetrics, weeklyCycle } from "@/lib/demoData";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = await searchParams;
  const showSentStatus = params?.status === "sent-to-vendor";
  const pendingCount = pilotMetrics.participatingHouseholds - pilotMetrics.paidHouseholds;

  return (
    <section className="space-y-5">
      {showSentStatus ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-brand-800">
          <p className="font-medium">Vendor handoff started</p>
          <p className="mt-0.5 text-xs text-brand-900/90">
            Consolidated sheet was sent—open tracking if you need the timeline, or continue below.
          </p>
        </div>
      ) : null}

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Weekly bulk order</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          {demoSociety.city} · {demoSociety.totalFlats} flats · Cycle{" "}
          <span className="font-medium text-slate-800">{weeklyCycle.cycleLabel}</span>
        </p>
        <p className="text-xs text-slate-500">
          Cutoff <span className="font-medium text-slate-700">{weeklyCycle.cutoffLabel}</span> ·
          Delivery <span className="font-medium text-slate-700">{weeklyCycle.deliveryLabel}</span> ·{" "}
          {weeklyCycle.statusLabel}
        </p>
      </div>

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
          Same four flats used in resident and vendor demos—amounts are net of catalogue savings.
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

      <div className="surface-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vendor handoff</p>
          <h2 className="mt-2 text-base font-semibold text-slate-900">Order handoff status</h2>
          <p className="mt-1 text-sm text-slate-600">
            See where the consolidated batch sits on the operations timeline—before and after you
            send it to fulfillment.
          </p>
        </div>
        <Button href="/admin/tracking" variant="outline" className="w-full shrink-0 sm:w-auto">
          View status
        </Button>
      </div>

      <div className="space-y-2">
        <Button href="/admin/consolidation" className="w-full py-3 text-base font-semibold">
          Review consolidation &amp; vendor sheet
        </Button>
        <p className="text-center text-xs text-slate-500">
          Roll up paid quantities and send the batch to your vendor.
        </p>
      </div>

      <Link href="/welcome" className="inline-block text-sm text-slate-600 hover:text-slate-800">
        ← Back to welcome
      </Link>
    </section>
  );
}
