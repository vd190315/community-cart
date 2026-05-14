import type { ReactNode } from "react";

export function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
}
