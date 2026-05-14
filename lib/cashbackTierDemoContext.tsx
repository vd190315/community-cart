"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  CASHBACK_DEMO_TIER_PERCENTS,
  type CashbackDemoTierPercent
} from "@/lib/demoData";

export const CASHBACK_DEMO_TIERS = CASHBACK_DEMO_TIER_PERCENTS;

export type CashbackDemoTier = CashbackDemoTierPercent;

type CashbackTierDemoContextValue = {
  tierPercent: CashbackDemoTier;
  setTierPercent: (tier: CashbackDemoTier) => void;
};

const CashbackTierDemoContext = createContext<CashbackTierDemoContextValue | null>(null);

export function CashbackTierDemoProvider({ children }: { children: ReactNode }) {
  const [tierPercent, setTierPercentState] = useState<CashbackDemoTier>(3);
  const setTierPercent = useCallback((tier: CashbackDemoTier) => {
    setTierPercentState(tier);
  }, []);

  const value = useMemo(
    () => ({ tierPercent, setTierPercent }),
    [tierPercent, setTierPercent]
  );

  return (
    <CashbackTierDemoContext.Provider value={value}>{children}</CashbackTierDemoContext.Provider>
  );
}

export function useCashbackTierDemo() {
  const ctx = useContext(CashbackTierDemoContext);
  if (!ctx) {
    throw new Error("useCashbackTierDemo must be used within CashbackTierDemoProvider");
  }
  return ctx;
}
