import type { ReactNode } from "react";
import { MobileAppShell } from "@/components/MobileAppShell";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return <MobileAppShell>{children}</MobileAppShell>;
}
