"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { demoSociety, sampleOrderId, weeklyCycle } from "@/lib/demoData";
import { products } from "@/lib/residentCatalog";
import { useResidentCart } from "../ResidentCartProvider";

function amountPaidFromQuantities(quantities: Record<string, number>): number {
  return products.reduce((sum, product) => {
    const qty = quantities[product.id] ?? 0;
    const savings = product.savingsPerUnit ?? 0;
    return sum + qty * Math.max(0, product.price - savings);
  }, 0);
}

export default function ResidentConfirmationPage() {
  const { quantities, residentProfile, clearCart } = useResidentCart();
  const [amountPaid] = useState(() => amountPaidFromQuantities(quantities));

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <section className="space-y-4">
      <div className="surface-card space-y-2 text-center">
        <p className="text-3xl">✅</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment received</h1>
        <p className="text-sm text-slate-600">
          Demo UPI succeeded. Your order is confirmed for this society cycle—we&apos;ll include your
          flat in the bulk run.
        </p>
      </div>

      <div className="surface-card space-y-3">
        <p className="text-sm font-semibold text-slate-900">What happens next</p>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-slate-600">
          <li>
            <span className="font-medium text-slate-800">This cycle:</span> {weeklyCycle.cycleLabel}
          </li>
          <li>
            Orders stay open until <span className="font-medium text-slate-800">{weeklyCycle.cutoffLabel}</span>
            ; you&apos;re already paid for your items.
          </li>
          <li>
            Groceries aim for <span className="font-medium text-slate-800">{weeklyCycle.deliveryLabel}</span>{" "}
            to the society gate.
          </li>
          <li>{weeklyCycle.pickupWindowHint}</li>
        </ul>
      </div>

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Order details</p>
        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Order ID:</span>{" "}
            <span className="font-mono text-slate-900">{sampleOrderId}</span>
          </p>
          <p>
            <span className="font-medium text-slate-800">Household:</span> {residentProfile.name}, flat{" "}
            {residentProfile.flat}
          </p>
          <p>
            <span className="font-medium text-slate-800">Society:</span> {demoSociety.name},{" "}
            {demoSociety.city}
          </p>
          <p>
            <span className="font-medium text-slate-800">Amount paid:</span> ₹
            {amountPaid.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Button href="/resident/order-status" className="w-full">
          Track order status
        </Button>
        <Button href="/resident/meal-builder" variant="outline" className="w-full">
          View meal ideas
        </Button>
        <Button href="/resident/home" variant="outline" className="w-full">
          Back to home
        </Button>
      </div>
    </section>
  );
}
