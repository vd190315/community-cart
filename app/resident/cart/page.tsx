"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/residentCatalog";
import { demoSociety, weeklyCycle } from "@/lib/demoData";
import { useResidentCart } from "../ResidentCartProvider";

export default function ResidentCartPage() {
  const { residentProfile, cartLines, updateLineQuantity } = useResidentCart();

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), []);

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

  const estimatedPayable = Math.max(0, subtotal - estimatedSavings);

  return (
    <section className="space-y-4 pb-28">
      <Link
        href="/resident/catalog"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Add or edit items in catalog
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your cart</h1>
        <p className="text-sm text-slate-600">
          {residentProfile.name}, flat {residentProfile.flat} · {demoSociety.name}
        </p>
        <p className="text-xs text-slate-500">
          {weeklyCycle.cycleLabel} · Cutoff {weeklyCycle.cutoffLabel} · {weeklyCycle.deliveryLabel}{" "}
          delivery
        </p>
      </div>

      {cartLines.length === 0 ? (
        <div className="surface-card space-y-3 text-center">
          <p className="text-base font-semibold text-slate-900">Your cart is empty</p>
          <p className="text-sm text-slate-600">
            Add items from the weekly catalog — same list and cutoff as the rest of your society.
          </p>
          <Button href="/resident/catalog" className="w-full">
            Browse weekly catalog
          </Button>
          <Button href="/resident/home" variant="outline" className="w-full">
            Back to home
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-amber-900/90">
            Review quantities before{" "}
            <span className="font-semibold">{weeklyCycle.cutoffLabel}</span> so your order counts for
            this Friday run.
          </p>

          <div className="space-y-3">
            {cartLines.map((line) => {
              const product = productById.get(line.productId);
              const name = product?.name ?? line.productId;
              const brandPack =
                product != null ? `${product.brand} · ${product.packSize}` : line.productId;
              const qty = line.quantity;
              const lineGross = qty * line.unitPrice;
              const lineSave = qty * (product?.savingsPerUnit ?? 0);
              return (
                <article key={line.lineId} className="surface-card space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">{name}</h2>
                      <p className="text-xs text-slate-500">{brandPack}</p>
                      <p className="mt-1 text-xs font-medium text-slate-700">
                        Vendor: {line.vendorName}
                      </p>
                      {lineSave > 0 ? (
                        <p className="mt-1 text-xs font-medium text-brand-700">
                          You save ₹{lineSave.toLocaleString("en-IN")} on this line (society rate)
                        </p>
                      ) : null}
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      ₹{lineGross.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      ₹{line.unitPrice.toLocaleString("en-IN")} × {qty}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateLineQuantity(line.lineId, -1)}
                        disabled={qty === 0}
                        className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Decrease ${name} from ${line.vendorName}`}
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-800">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateLineQuantity(line.lineId, 1)}
                        className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700"
                        aria-label={`Increase ${name} from ${line.vendorName}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="surface-card space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal (list)</span>
              <span className="font-semibold text-slate-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Est. savings (bulk)</span>
              <span className="font-semibold text-brand-700">
                − ₹{estimatedSavings.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="border-t border-emerald-100 pt-2" />
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Est. you pay</span>
              <span>₹{estimatedPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
            <div className="mx-auto w-full max-w-md px-4 py-3">
              <Button href="/resident/checkout" className="w-full py-3 text-base font-semibold">
                Proceed to checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
