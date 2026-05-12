"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function headerHomeHref(pathname: string): string {
  if (pathname === "/") return "/";
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
  const isPublicLanding = pathname === "/";

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        <Link
          href={brandHref}
          className={`flex min-w-0 items-center gap-2.5 rounded-xl outline-none ring-brand-300/50 transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
            isPublicLanding ? "pr-1" : ""
          }`}
        >
          <span
            className={`flex shrink-0 select-none items-center justify-center text-[1.15rem] leading-none ${
              isPublicLanding
                ? "h-10 w-10 rounded-xl border border-emerald-200/90 bg-brand-50 shadow-sm"
                : "text-xl"
            }`}
            aria-hidden
          >
            🛒
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight text-slate-900">
              Community Cart
            </p>
            <p
              className={`truncate text-xs leading-snug ${
                isPublicLanding ? "font-medium text-brand-700" : "text-slate-500"
              }`}
            >
              {isPublicLanding ? "Weekly society groceries · Pilot" : "Save Together, Shop Smarter."}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
