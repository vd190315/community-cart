"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { demoSociety, weeklyCycle } from "@/lib/demoData";
import { getSmartCartPrefillItems, type SmartCartPrefillMode } from "@/lib/smartCartData";
import { useResidentCart } from "../ResidentCartProvider";

type SmartCartRow = ReturnType<typeof getSmartCartPrefillItems>[number] & {
  isSelected: boolean;
  quantity: number;
};

export default function ResidentSmartCartPage() {
  const router = useRouter();
  const { residentProfile, addOrIncrementLine } = useResidentCart();
  const [mode, setMode] = useState<SmartCartPrefillMode>("best-price");
  const [rows, setRows] = useState<SmartCartRow[]>(
    getSmartCartPrefillItems("best-price").map((item) => ({
      ...item,
      isSelected: true,
      quantity: item.suggestedQuantity
    }))
  );

  const modeHelperText =
    mode === "best-price"
      ? "Lowest available total for this week"
      : "Keeps most items with one vendor where possible";

  const selectedRows = rows.filter((row) => row.isSelected && row.quantity > 0);
  const selectedCount = selectedRows.reduce((sum, row) => sum + row.quantity, 0);
  const selectedTotal = selectedRows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);

  const selectedLabel = useMemo(() => {
    if (selectedRows.length === 0) return "No items selected";
    return `${selectedRows.length} suggested items selected`;
  }, [selectedRows.length]);

  const toggleItem = (id: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, isSelected: !row.isSelected } : row))
    );
  };

  const updateQty = (id: string, delta: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const nextQty = Math.max(0, row.quantity + delta);
        return { ...row, quantity: nextQty, isSelected: nextQty === 0 ? false : row.isSelected };
      })
    );
  };

  const addSelectedToCart = () => {
    for (const row of selectedRows) {
      addOrIncrementLine({
        productId: row.productId,
        vendorId: row.vendorId,
        vendorName: row.vendorName,
        unitPrice: row.unitPrice,
        delta: row.quantity
      });
    }
    router.push("/resident/cart");
  };

  const applyMode = (nextMode: SmartCartPrefillMode) => {
    setMode(nextMode);
    setRows(
      getSmartCartPrefillItems(nextMode).map((item) => ({
        ...item,
        isSelected: true,
        quantity: item.suggestedQuantity
      }))
    );
  };

  return (
    <section className="space-y-4 pb-28">
      <Button href="/resident/home" variant="outline" className="w-full">
        Back to home
      </Button>

      <div className="surface-card space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Smart Cart</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Smart Cart</h1>
        <p className="text-sm text-slate-600">Prefilled from your usual weekly staples.</p>
        <p className="text-xs text-slate-500">
          {residentProfile.name}, flat {residentProfile.flat} · {demoSociety.name}
        </p>
        <p className="text-xs text-slate-500">
          {weeklyCycle.cycleLabel} · Cutoff {weeklyCycle.cutoffLabel}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prefill mode</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => applyMode("best-price")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              mode === "best-price"
                ? "border-green-700 bg-green-50 text-green-800"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            Best price
          </button>
          <button
            type="button"
            onClick={() => applyMode("preferred-vendor")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              mode === "preferred-vendor"
                ? "border-green-700 bg-green-50 text-green-800"
                : "border-slate-300 bg-white text-slate-700"
            }`}
          >
            Preferred vendor
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">{modeHelperText}</p>
      </div>

      <div className="rounded-2xl border border-green-100 bg-green-50/60 px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{selectedLabel}</p>
        <p className="text-xs text-slate-600">
          {selectedCount} units · ₹{selectedTotal.toLocaleString("en-IN")} estimated
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="surface-card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{row.productName}</h2>
                <p className="text-xs text-slate-500">Vendor: {row.vendorName}</p>
                <p className="mt-1 text-xs text-slate-500">{row.reason}</p>
              </div>
              <p className="text-base font-bold text-slate-900">
                ₹{row.unitPrice.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleItem(row.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  row.isSelected
                    ? "border-green-700 bg-green-50 text-green-800"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                {row.isSelected ? "Keep item" : "Add item"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQty(row.id, -1)}
                  disabled={row.quantity === 0}
                  className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Decrease ${row.productName}`}
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-slate-800">
                  {row.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQty(row.id, 1)}
                  className="h-8 w-8 rounded-lg border border-emerald-200 text-lg text-slate-700"
                  aria-label={`Increase ${row.productName}`}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-4 py-3">
          <Button
            onClick={addSelectedToCart}
            disabled={selectedRows.length === 0}
            className="w-full py-3 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add selected to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
