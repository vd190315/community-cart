"use client";

import Link from "next/link";
import { residentWalletDemoBalance } from "@/lib/demoData";
import { useCashbackTierDemo } from "@/lib/cashbackTierDemoContext";

export default function ResidentWalletPage() {
  const { tierPercent } = useCashbackTierDemo();

  return (
    <div className="space-y-6">
      <Link
        href="/resident/home"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to home
      </Link>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Wallet</h1>
        <p className="mt-6 text-4xl font-semibold tabular-nums text-slate-900">
          {residentWalletDemoBalance}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Current society cashback tier: {tierPercent}%.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Cashback from weekly society orders will show here in future cycles.
        </p>
      </section>
    </div>
  );
}
