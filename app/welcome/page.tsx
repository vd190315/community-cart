import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <section className="space-y-6">
      <div className="surface-card space-y-4">
        <p className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Pilot · Community ordering
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Community Cart</h1>
        <p className="text-sm font-medium text-slate-700">Save Together, Shop Smarter.</p>
        <p className="text-sm leading-6 text-slate-600">
          Residents in the same society pool the weekly grocery order, unlock better prices, and
          cut repeated deliveries.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Residents</p>
          <Button href="/join" className="w-full py-3 text-base">
            Join with your society code
          </Button>
          <p className="text-center text-xs text-slate-500">Start here if you live in the society</p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Society office &amp; vendor
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Separate sign-in—use only if you are running the pilot for your community or fulfilling
            orders.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/admin/login"
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-emerald-50/80"
            >
              Admin
              <span className="mt-0.5 block text-[10px] font-normal text-slate-500">Dashboard</span>
            </Link>
            <Link
              href="/vendor/login"
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-emerald-50/80"
            >
              Vendor
              <span className="mt-0.5 block text-[10px] font-normal text-slate-500">Orders &amp; dispatch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
