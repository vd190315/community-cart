import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { demoSociety } from "@/lib/demoData";

export default function AdminLoginPage() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Society coordinator</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin access</h1>
        <p className="text-sm text-slate-600">
          For RWA office or pilot lead: review this week&apos;s bulk order, household payments, and
          vendor handoff for {demoSociety.name}.
        </p>
        <p className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
          Pilot demo: credentials are not verified. Continue skips sign-in and opens the operations
          dashboard—use only for walkthroughs.
        </p>
      </div>

      <div className="surface-card space-y-4">
        <p className="text-xs font-medium text-slate-500">Optional placeholders (not checked)</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="admin-email">
            Work email
          </label>
          <input
            id="admin-email"
            type="email"
            placeholder="admin@greenmeadows.in"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring"
            autoComplete="username"
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700"
            htmlFor="admin-password"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring"
            autoComplete="current-password"
          />
        </div>

        <Button href="/admin/dashboard" className="w-full py-3 text-base font-semibold">
          Continue to dashboard
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
