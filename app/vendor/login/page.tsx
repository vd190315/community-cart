import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { demoSociety } from "@/lib/demoData";

export default function VendorLoginPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Fulfilment partner</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Vendor access</h1>
        <p className="text-sm text-slate-600">
          View the consolidated society batch for {demoSociety.name}: SKU summary, flat-wise packing,
          and gate dispatch—same data the coordinator sent from admin.
        </p>
        <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
          Pilot demo: login is not verified. Continue opens the paid-batch order—no live POS or
          settlement.
        </p>
      </div>

      <div className="surface-card space-y-4">
        <p className="text-xs font-medium text-slate-500">Optional placeholders (not checked)</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="vendor-id">
            Email or vendor ID
          </label>
          <input
            id="vendor-id"
            type="text"
            placeholder="vendor@store.com or VND-102"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring"
            autoComplete="username"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700"
            htmlFor="vendor-password"
          >
            Password
          </label>
          <input
            id="vendor-password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring"
            autoComplete="current-password"
          />
        </div>

        <Button href="/vendor/orders" className="w-full py-3 text-base font-semibold">
          Continue to consolidated order
        </Button>
      </div>

      <Link
        href="/welcome"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to welcome
      </Link>
    </section>
  );
}
