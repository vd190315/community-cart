import type { Metadata } from "next";
import { PublicLanding } from "@/components/landing/PublicLanding";

export const metadata: Metadata = {
  title: "Community Cart — Weekly apartment groceries",
  description:
    "Residents order on one weekly cycle. Admin consolidates society demand. Vendors pack flat-wise and deliver to the gate.",
};

export default function HomePage() {
  return <PublicLanding />;
}
