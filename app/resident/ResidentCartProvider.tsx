"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { residentCartLineId } from "@/lib/residentCatalog";
import { residentProfile as demoResidentProfile } from "@/lib/demoData";
import {
  RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY,
  clearAdminVendorHandoffFromSession
} from "@/lib/demoSessionGates";
import { clearVendorOperationalSessionStorage } from "@/lib/vendorPackingSession";

export { RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY };

export type ResidentCartLine = {
  lineId: string;
  productId: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  /** One row per product + vendor; separate vendors stay separate lines. */
  cartLines: ResidentCartLine[];
  /** Total units per product (all vendors); useful for catalog card totals. */
  quantities: Record<string, number>;
  addOrIncrementLine: (args: {
    productId: string;
    vendorId: string;
    vendorName: string;
    unitPrice: number;
    delta?: number;
  }) => void;
  updateLineQuantity: (lineId: string, change: number) => void;
  /** Removes one unit from the last matching line (catalog “−” when multiple vendors exist). */
  decrementLastLineForProduct: (productId: string) => void;
  clearCart: () => void;
  residentProfile: {
    name: string;
    flat: string;
  };
  setResidentProfile: (profile: { name: string; flat: string }) => void;
  /** True after first client read of sessionStorage (avoids hydration mismatch). */
  sessionOrderHydrated: boolean;
  /** True when this browser tab has completed demo checkout this session. */
  hasSessionOrder: boolean;
  markSessionOrderPlaced: () => void;
  /** Call after onboarding / new household setup so order-status stays empty until the next checkout. */
  resetSessionOrderForNewResident: () => void;
};

const ResidentCartContext = createContext<CartContextValue | null>(null);

export function ResidentCartProvider({ children }: { children: ReactNode }) {
  const [cartLines, setCartLines] = useState<ResidentCartLine[]>([]);
  const [residentProfile, setResidentProfile] = useState<{ name: string; flat: string }>({
    name: demoResidentProfile.name,
    flat: demoResidentProfile.flat
  });
  const [sessionOrderHydrated, setSessionOrderHydrated] = useState(false);
  const [hasSessionOrder, setHasSessionOrder] = useState(false);

  useEffect(() => {
    try {
      setHasSessionOrder(sessionStorage.getItem(RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY) === "1");
    } catch {
      setHasSessionOrder(false);
    }
    setSessionOrderHydrated(true);
  }, []);

  const markSessionOrderPlaced = useCallback(() => {
    try {
      sessionStorage.setItem(RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
    setHasSessionOrder(true);
  }, []);

  const resetSessionOrderForNewResident = useCallback(() => {
    try {
      sessionStorage.removeItem(RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY);
    } catch {
      /* ignore */
    }
    clearAdminVendorHandoffFromSession();
    clearVendorOperationalSessionStorage();
    setHasSessionOrder(false);
    setCartLines([]);
  }, []);

  const quantities = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const line of cartLines) {
      acc[line.productId] = (acc[line.productId] ?? 0) + line.quantity;
    }
    return acc;
  }, [cartLines]);

  const addOrIncrementLine = useCallback(
    (args: {
      productId: string;
      vendorId: string;
      vendorName: string;
      unitPrice: number;
      delta?: number;
    }) => {
      const delta = args.delta ?? 1;
      if (delta === 0) return;

      setCartLines((prev) => {
        const lineId = residentCartLineId(args.productId, args.vendorId);
        const idx = prev.findIndex((l) => l.lineId === lineId);
        if (idx === -1) {
          if (delta < 0) return prev;
          return [
            ...prev,
            {
              lineId,
              productId: args.productId,
              vendorId: args.vendorId,
              vendorName: args.vendorName,
              unitPrice: args.unitPrice,
              quantity: delta
            }
          ];
        }
        const nextQty = prev[idx].quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((_, i) => i !== idx);
        }
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: nextQty };
        return next;
      });
    },
    []
  );

  const updateLineQuantity = useCallback((lineId: string, change: number) => {
    if (change === 0) return;
    setCartLines((prev) => {
      const idx = prev.findIndex((l) => l.lineId === lineId);
      if (idx === -1) return prev;
      const nextQty = prev[idx].quantity + change;
      if (nextQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      }
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: nextQty };
      return next;
    });
  }, []);

  const decrementLastLineForProduct = useCallback((productId: string) => {
    setCartLines((prev) => {
      for (let i = prev.length - 1; i >= 0; i--) {
        const line = prev[i];
        if (line.productId === productId && line.quantity > 0) {
          if (line.quantity <= 1) {
            return prev.filter((_, j) => j !== i);
          }
          const next = [...prev];
          next[i] = { ...line, quantity: line.quantity - 1 };
          return next;
        }
      }
      return prev;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartLines([]);
  }, []);

  const value = useMemo(
    () => ({
      cartLines,
      quantities,
      addOrIncrementLine,
      updateLineQuantity,
      decrementLastLineForProduct,
      clearCart,
      residentProfile,
      setResidentProfile,
      sessionOrderHydrated,
      hasSessionOrder,
      markSessionOrderPlaced,
      resetSessionOrderForNewResident
    }),
    [
      cartLines,
      quantities,
      addOrIncrementLine,
      updateLineQuantity,
      decrementLastLineForProduct,
      clearCart,
      residentProfile,
      sessionOrderHydrated,
      hasSessionOrder,
      markSessionOrderPlaced,
      resetSessionOrderForNewResident
    ]
  );

  return <ResidentCartContext.Provider value={value}>{children}</ResidentCartContext.Provider>;
}

export function useResidentCart() {
  const context = useContext(ResidentCartContext);
  if (!context) {
    throw new Error("useResidentCart must be used within ResidentCartProvider");
  }
  return context;
}
