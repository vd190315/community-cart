"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { demoSociety, weeklyCycle } from "@/lib/demoData";
import { products } from "@/lib/residentCatalog";
import { useResidentCart } from "../ResidentCartProvider";

export default function ResidentCheckoutPage() {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { cartLines, residentProfile, markSessionOrderPlaced } = useResidentCart();

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), []);

  const totalUnits = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity, 0),
    [cartLines]
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [cartLines]
  );

  const estimatedSavings = useMemo(
    () =>
      cartLines.reduce((sum, line) => {
        const product = productById.get(line.productId);
        return sum + line.quantity * (product?.savingsPerUnit ?? 0);
      }, 0),
    [cartLines, productById]
  );

  const finalPayable = Math.max(0, subtotal - estimatedSavings);

  function handlePayWithUpi() {
    if (totalUnits === 0 || isPaying) return;
    setIsPaying(true);
    window.setTimeout(() => {
      markSessionOrderPlaced();
      router.push("/resident/confirmation");
    }, 700);
  }

  return (
    <section className="space-y-4 pb-28">
      <Link
        href="/resident/cart"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to cart
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Checkout</h1>
        <p className="text-sm text-slate-600">
          {residentProfile.name}, flat {residentProfile.flat} · {demoSociety.name}
        </p>
        <p className="text-xs text-slate-500">
          {weeklyCycle.cycleLabel} · Delivery {weeklyCycle.deliveryLabel} (after{" "}
          {weeklyCycle.cutoffLabel} cutoff)
        </p>
      </div>

      <div className="surface-card space-y-3">
        <p className="text-sm font-semibold text-slate-900">Delivery details</p>
        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Society:</span> {demoSociety.name},{" "}
            {demoSociety.city}
          </p>
          <p>
            <span className="font-medium text-slate-800">Flat / unit:</span> {residentProfile.flat}
          </p>
          <p className="text-xs text-slate-500">Society pickup point — same as your weekly bulk run.</p>
        </div>
      </div>

      {totalUnits > 0 ? (
        <div className="surface-card space-y-3">
          <p className="text-sm font-semibold text-slate-900">Your items ({totalUnits} units)</p>
          <ul className="space-y-3">
            {cartLines.map((line) => {
              const product = productById.get(line.productId);
              const name = product?.name ?? line.productId;
              const brandPack =
                product != null ? `${product.brand} · ${product.packSize}` : line.productId;
              const qty = line.quantity;
              const lineGross = qty * line.unitPrice;
              const lineSave = qty * (product?.savingsPerUnit ?? 0);
              return (
                <li
                  key={line.lineId}
                  className="flex gap-3 border-b border-emerald-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">
                      {line.vendorName} · {brandPack} · ₹{line.unitPrice.toLocaleString("en-IN")} ×{" "}
                      {qty}
                    </p>
                    {lineSave > 0 ? (
                      <p className="mt-0.5 text-xs text-brand-700">
                        Bulk saves ₹{lineSave.toLocaleString("en-IN")} on this line
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    ₹{lineGross.toLocaleString("en-IN")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Payment summary</p>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal (list)</span>
            <span className="font-medium text-slate-900">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Est. savings (society rate)</span>
            <span className="font-medium text-brand-700">
              − ₹{estimatedSavings.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="border-t border-emerald-100 pt-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">You pay with UPI</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{finalPayable.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Payment is simulated here—no charge is made.
        </p>
      </div>

      {totalUnits === 0 ? (
        <div className="surface-card text-sm text-slate-600">
          Your cart is empty. Add items from the catalog to continue checkout.
        </div>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-3">
          <button
            type="button"
            onClick={handlePayWithUpi}
            disabled={totalUnits === 0 || isPaying}
            className="w-full rounded-xl bg-brand-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isPaying ? "Processing..." : `Pay ₹${finalPayable.toLocaleString("en-IN")} with UPI`}
          </button>
        </div>
      </div>
    </section>
  );
}
