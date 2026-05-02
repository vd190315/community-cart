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
import { residentProfile as demoResidentProfile } from "@/lib/demoData";

/** sessionStorage key: set after demo UPI checkout; cleared by closing tab or DevTools. */
export const RESIDENT_DEMO_ORDER_PLACED_SESSION_KEY = "cc-demo-resident-order-placed";

type CartContextValue = {
  quantities: Record<string, number>;
  updateQuantity: (productId: string, change: number) => void;
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
};

const ResidentCartContext = createContext<CartContextValue | null>(null);

export function ResidentCartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
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

  const updateQuantity = useCallback((productId: string, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] ?? 0;
      const nextQty = Math.max(0, currentQty + change);

      if (nextQty === 0) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [productId]: nextQty };
    });
  }, []);

  const clearCart = useCallback(() => {
    setQuantities({});
  }, []);

  const value = useMemo(
    () => ({
      quantities,
      updateQuantity,
      clearCart,
      residentProfile,
      setResidentProfile,
      sessionOrderHydrated,
      hasSessionOrder,
      markSessionOrderPlaced
    }),
    [
      quantities,
      residentProfile,
      updateQuantity,
      clearCart,
      sessionOrderHydrated,
      hasSessionOrder,
      markSessionOrderPlaced
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
