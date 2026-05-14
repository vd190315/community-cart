"use client";

import Link from "next/link";
import { Button } from '@/components/ui/Button'
import { useResidentCart } from '../ResidentCartProvider'
import {
  demoSociety,
  pilotMetrics,
  residentCashbackMainLine,
  residentProfile as defaultResidentProfile,
  residentWalletDemoBalance,
  sampleOrderId,
  weeklyCycle,
} from '@/lib/demoData'
import { useCashbackTierDemo } from "@/lib/cashbackTierDemoContext";

export default function ResidentHomePage() {
  const { residentProfile, sessionOrderHydrated, hasSessionOrder } = useResidentCart()
  const { tierPercent } = useCashbackTierDemo()
  const cashbackMainLine = residentCashbackMainLine(tierPercent)

  const activeResidentProfile = {
    ...defaultResidentProfile,
    ...residentProfile,
  }

  const lastOrder = {
    id: sampleOrderId,
    amountPaid: 3035,
    status: 'Paid · Awaiting society dispatch',
    helperText: `Delivery ${weeklyCycle.deliveryLabel}`,
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Your household
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {activeResidentProfile.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Flat {activeResidentProfile.flat} · {demoSociety.name}, {demoSociety.city}
            </p>
          </div>
          <Link
            href="/resident/wallet"
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Wallet {residentWalletDemoBalance}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">This week&apos;s bulk order</h2>
        <p className="mt-3 text-sm text-slate-600">
          Same window for every flat — one consolidated delivery to the society.
        </p>

        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-900">Cycle:</span>{' '}
            {weeklyCycle.cycleLabel}
          </p>
          <p>
            <span className="font-medium text-slate-900">Status:</span>{' '}
            {weeklyCycle.statusLabel}
          </p>
          <p>
            <span className="font-medium text-slate-900">Cutoff:</span>{' '}
            {weeklyCycle.cutoffLabel}
          </p>
          <p>
            <span className="font-medium text-slate-900">Delivery:</span>{' '}
            {weeklyCycle.deliveryLabel}
          </p>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add items before {weeklyCycle.cutoffLabel} to lock in this week&apos;s society
          price and delivery slot.
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Est. savings vs retail</p>
          <p className="mt-2 text-2xl font-semibold text-green-700">
            ₹{pilotMetrics.estimatedSavings.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-slate-500">Society pool this cycle</p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Neighbours in</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {pilotMetrics.participatingHouseholds} flats
          </p>
          <p className="mt-1 text-xs text-slate-500">Ordering this week</p>
        </div>
      </section>

      {sessionOrderHydrated && hasSessionOrder ? (
        <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Last order
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-900">{lastOrder.id}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Amount paid: ₹{lastOrder.amountPaid.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-sm text-slate-600">Status: {lastOrder.status}</p>
              <p className="mt-1 text-xs text-slate-500">{lastOrder.helperText}</p>
            </div>

            <Button
              href="/resident/order-status"
              variant="outline"
              className="shrink-0"
            >
              View status
            </Button>
          </div>
        </section>
      ) : null}

      {sessionOrderHydrated && !hasSessionOrder ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Orders &amp; tracking
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-900">Order status</h2>
            </div>
            <Button
              href="/resident/order-status"
              variant="outline"
              className="w-full shrink-0 sm:w-auto"
            >
              View status
            </Button>
          </div>
        </section>
      ) : null}

      <section
        className="rounded-xl border border-emerald-100 bg-emerald-50/90 py-2 shadow-sm"
        aria-label={cashbackMainLine}
      >
        <p
          className="hidden px-3 text-center text-xs font-medium leading-snug text-emerald-950 motion-reduce:block"
          aria-hidden="true"
        >
          {cashbackMainLine}
        </p>
        <div className="motion-reduce:hidden overflow-hidden" aria-hidden="true">
          <div className="resident-cashback-marquee-track">
            <span className="inline-block shrink-0 whitespace-nowrap px-6 text-xs font-medium text-emerald-950">
              {cashbackMainLine}
            </span>
            <span className="inline-block shrink-0 whitespace-nowrap px-6 text-xs font-medium text-emerald-950">
              {cashbackMainLine}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Button href="/resident/catalog" className="w-full">
          Browse weekly catalog &amp; add items
        </Button>
        <p className="text-center text-xs text-slate-500">
          Staples, oil, dal, vegetables — priced for your society run.
        </p>
      </section>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">After you shop</h2>
        <p className="mt-2 text-sm text-slate-600">
          Meal ideas line up with what you bought.
        </p>
        <div className="mt-4">
          <Button href="/resident/meal-builder" variant="outline" className="w-full">
            Open AI Meal Builder
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Smart Cart</h2>
        <p className="mt-2 text-sm text-slate-600">
          Prefilled from your usual weekly staples.
        </p>
        <div className="mt-4">
          <Button href="/resident/smart-cart" variant="outline" className="w-full">
            Open Smart Cart
          </Button>
        </div>
      </section>
    </div>
  )
}