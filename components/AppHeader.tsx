"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function headerHomeHref(pathname: string): string {
  if (pathname.startsWith("/resident")) return "/resident/home";
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return "/welcome";
    return "/admin/dashboard";
  }
  if (pathname.startsWith("/vendor")) {
    if (pathname === "/vendor/login") return "/welcome";
    return "/vendor/orders";
  }
  return "/welcome";
}

export function AppHeader() {
  const pathname = usePathname() ?? "";
  const brandHref = headerHomeHref(pathname);

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <Link href={brandHref} className="flex items-center gap-2">
          <span className="text-xl">🛒</span>
          <div>
            <p className="text-base font-semibold text-slate-900">Community Cart</p>
            <p className="text-xs text-slate-500">Save Together, Shop Smarter.</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
