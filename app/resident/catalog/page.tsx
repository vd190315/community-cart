"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { catalogListingNotes, categories, products, type Category } from "@/lib/residentCatalog";
import { demoSociety, weeklyCycle } from "@/lib/demoData";
import { useResidentCart } from "../ResidentCartProvider";

export default function ResidentCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Staples");
  const { residentProfile, quantities, updateQuantity } = useResidentCart();

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === selectedCategory),
    [selectedCategory]
  );

  const totalUnits = useMemo(
    () => Object.values(quantities).reduce((sum, qty) => sum + qty, 0),
    [quantities]
  );

  const subtotal = useMemo(
    () =>
      products.reduce((sum, product) => sum + (quantities[product.id] ?? 0) * product.price, 0),
    [quantities]
  );

  const estimatedSavings = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (quantities[product.id] ?? 0) * (product.savingsPerUnit ?? 0),
        0
      ),
    [quantities]
  );

  return (
    <section className="space-y-4 pb-28">
      <Link
        href="/resident/home"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to home
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Weekly catalog</h1>
        <p className="text-sm text-slate-600">
          {demoSociety.name} · <span className="font-medium text-slate-800">{weeklyCycle.cycleLabel}</span>
        </p>
        <p className="text-xs text-slate-500">
          {residentProfile.name}, flat {residentProfile.flat} · Cutoff{" "}
          <span className="font-medium text-slate-700">{weeklyCycle.cutoffLabel}</span> · Delivery{" "}
          {weeklyCycle.deliveryLabel}
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === category
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-emerald-200 hover:bg-brand-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleProducts.length === 0 ? (
          <div className="surface-card text-sm text-slate-600">
            No SKUs in this aisle for the pilot week — try Staples, Oils, Pulses, or Vegetables.
          </div>
        ) : null}

        {visibleProducts.map((product) => {
          const qty = quantities[product.id] ?? 0;
          const note = catalogListingNotes[product.id];
          return (
            <article key={product.id} className="surface-card space-y-3">
		  {product.image ? (
   		 <img
    		  src={product.image}
      		alt={product.name}
      		className="h-32 w-full rounded-2xl object-contain bg-slate-50 p-3"
		    />	
		  ) : null}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-slate-900">{product.name}</h2>
                  <p className="text-xs text-slate-500">
                    {product.brand} · {product.packSize}
                  </p>
                  {note ? <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{note}</p> : null}
                </div>
                {product.savingsLabel ? (
                  <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
                    {product.savingsLabel}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString("en-IN")}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, -1)}
                    disabled={qty === 0}
                    className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Decrease ${product.name}`}
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-800">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, 1)}
                    className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700"
                    aria-label={`Increase ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md space-y-1 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Your cart (this session)</p>
              <p className="text-sm font-semibold text-slate-900">
                {totalUnits} {totalUnits === 1 ? "unit" : "units"} · ₹{subtotal.toLocaleString("en-IN")}
                {estimatedSavings > 0 ? (
                  <span className="ml-1 text-xs font-normal text-brand-700">
                    · save ~₹{estimatedSavings.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </p>
            </div>
            <Link
              href="/resident/cart"
              aria-disabled={totalUnits === 0}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                totalUnits === 0
                  ? "pointer-events-none bg-slate-300"
                  : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              Review cart
            </Link>
          </div>
          <p className="text-[10px] text-slate-500">
            Prices are list; savings apply at checkout. Order by {weeklyCycle.cutoffLabel}.
          </p>
        </div>
      </div>
    </section>
  );
}
