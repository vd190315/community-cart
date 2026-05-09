"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  catalogListingNotes,
  categories,
  products,
  type Category,
  type Product
} from "@/lib/residentCatalog";
import { demoSociety, weeklyCycle } from "@/lib/demoData";
import { useResidentCart, type ResidentCartLine } from "../ResidentCartProvider";

/** Catalog card pricing copy from current cart lines (resident catalog only). */
function catalogCardPriceContext(
  productId: string,
  cartLines: ResidentCartLine[],
  minVendorPrice: number
):
  | { state: "none"; minPrice: number }
  | { state: "single"; unitPrice: number; vendorName: string }
  | { state: "multi"; vendorCount: number } {
  const forProduct = cartLines.filter((l) => l.productId === productId);
  if (forProduct.length === 0) {
    return { state: "none", minPrice: minVendorPrice };
  }
  const vendorIds = new Set(forProduct.map((l) => l.vendorId));
  if (vendorIds.size === 1) {
    const line = forProduct[0];
    return { state: "single", unitPrice: line.unitPrice, vendorName: line.vendorName };
  }
  return { state: "multi", vendorCount: vendorIds.size };
}

export default function ResidentCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Staples");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const { residentProfile, cartLines, quantities, addOrIncrementLine, decrementLastLineForProduct } =
    useResidentCart();

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), []);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.category === selectedCategory),
    [selectedCategory]
  );

  const openVendorModal = useCallback((product: Product) => {
    setModalProduct(product);
    setSelectedVendorId(null);
  }, []);

  const closeVendorModal = useCallback(() => {
    setModalProduct(null);
    setSelectedVendorId(null);
  }, []);

  const handleAddFromModal = useCallback(() => {
    if (!modalProduct || !selectedVendorId) return;
    const opt = modalProduct.vendorOptions.find((v) => v.id === selectedVendorId);
    if (!opt) return;
    addOrIncrementLine({
      productId: modalProduct.id,
      vendorId: opt.id,
      vendorName: opt.vendorName,
      unitPrice: opt.price,
      delta: 1
    });
    closeVendorModal();
  }, [modalProduct, selectedVendorId, addOrIncrementLine, closeVendorModal]);

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
          const fromPrice = Math.min(...product.vendorOptions.map((v) => v.price));
          const priceCtx = catalogCardPriceContext(product.id, cartLines, fromPrice);
          return (
            <article key={product.id} className="surface-card space-y-3 transition hover:ring-2 hover:ring-brand-200">
              <button
                type="button"
                className="w-full space-y-3 rounded-2xl text-left outline-none ring-brand-500 focus-visible:ring-2"
                onClick={() => openVendorModal(product)}
              >
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
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      {priceCtx.state === "none" ? (
                        <>Tap to choose a vendor · From ₹{priceCtx.minPrice.toLocaleString("en-IN")}</>
                      ) : priceCtx.state === "single" ? (
                        <>
                          In your cart:{" "}
                          <span className="text-slate-700">{priceCtx.vendorName}</span> · ₹
                          {priceCtx.unitPrice.toLocaleString("en-IN")} / unit
                        </>
                      ) : (
                        <>Added from {priceCtx.vendorCount} vendors</>
                      )}
                    </p>
                  </div>
                  {product.savingsLabel ? (
                    <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700">
                      {product.savingsLabel}
                    </span>
                  ) : null}
                </div>
              </button>

              <div className="flex items-center justify-between gap-3">
                <p
                  className={
                    priceCtx.state === "multi"
                      ? "text-sm font-semibold leading-snug text-slate-800"
                      : "text-lg font-bold text-slate-900"
                  }
                >
                  {priceCtx.state === "none" ? (
                    <>From ₹{priceCtx.minPrice.toLocaleString("en-IN")}</>
                  ) : priceCtx.state === "single" ? (
                    <>₹{priceCtx.unitPrice.toLocaleString("en-IN")}</>
                  ) : (
                    <>See cart for prices</>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrementLastLineForProduct(product.id)}
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
                    onClick={() => openVendorModal(product)}
                    className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700"
                    aria-label={`Choose vendor to add ${product.name}`}
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

      {modalProduct ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vendor-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            aria-label="Close vendor picker"
            onClick={closeVendorModal}
          />
          <div className="relative z-10 flex max-h-[min(90vh,560px)] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-xl ring-1 ring-emerald-100 sm:max-h-[85vh] sm:rounded-2xl">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-emerald-100 px-4 pb-3 pt-4 sm:px-5">
              <div className="min-w-0">
                <p id="vendor-modal-title" className="text-base font-semibold text-slate-900">
                  Choose a vendor
                </p>
                <p className="mt-0.5 text-sm text-slate-600">{modalProduct.name}</p>
                <p className="text-xs text-slate-500">
                  {modalProduct.brand} · {modalProduct.packSize}
                </p>
              </div>
              <button
                type="button"
                onClick={closeVendorModal}
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 sm:px-5">
              <p className="text-xs text-slate-500">
                Pick who fulfills this item. Each vendor is a separate line if prices differ.
              </p>
              <ul className="space-y-2">
                {modalProduct.vendorOptions.map((v) => {
                  const selected = selectedVendorId === v.id;
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedVendorId(v.id)}
                        className={`w-full rounded-2xl border px-3 py-3 text-left transition sm:px-4 ${
                          selected
                            ? "border-brand-500 bg-brand-50 ring-2 ring-brand-400"
                            : "border-emerald-100 bg-white hover:border-emerald-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">{v.vendorName}</p>
                          <p className="shrink-0 text-sm font-bold text-slate-900">
                            ₹{v.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                          <span className="font-medium text-amber-800">★ {v.rating.toFixed(1)}</span>
                          <span>ETA: {v.etaLabel}</span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-slate-700">{v.stockLabel}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="shrink-0 border-t border-emerald-100 px-4 py-3 sm:px-5">
              <button
                type="button"
                disabled={!selectedVendorId}
                onClick={handleAddFromModal}
                className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
