"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { demoSociety, sampleOrderId, weeklyCycle } from "@/lib/demoData";
import { readHasAdminHandoffFromSession, readHasResidentOrderFromSession } from "@/lib/demoSessionGates";
import { readOperationalState, type VendorOperationalState } from "@/lib/vendorPackingSession";
import { AdminPurchasesAndHouseholds } from "./AdminPurchasesAndHouseholds";

function AdminDashboardEmptyState() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Order cutoff</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {weeklyCycle.cutoffLabel}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Delivery</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {weeklyCycle.deliveryLabel}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Cycle status</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
            {weeklyCycle.statusLabel}
          </p>
        </div>
        <div className="surface-card p-3">
          <p className="text-xs text-slate-500">Society total flats</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{demoSociety.totalFlats}</p>
        </div>
      </div>

      <div className="surface-card space-y-2">
        <p className="text-base font-semibold text-slate-900">No resident orders received yet</p>
        <p className="text-sm text-slate-600">
          Once residents place their weekly grocery orders, the consolidation view will appear here.
        </p>
      </div>
    </>
  );
}

function AdminDashboardPostHandoffState({
  headline,
  detail
}: {
  headline: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">This cycle</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{headline}</p>
      <p className="mt-1 text-sm text-slate-700">{detail}</p>
      <p className="mt-3 text-xs text-slate-600">
        Order / cycle ID{" "}
        <span className="font-mono font-medium text-slate-900">{sampleOrderId}</span>
      </p>
      <Button href="/admin/tracking" className="mt-4 w-full py-3 text-base font-semibold">
        View status
      </Button>
    </div>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const showSentParam = searchParams.get("status") === "sent-to-vendor";
  const [sessionReadComplete, setSessionReadComplete] = useState(false);
  const [hasResidentOrder, setHasResidentOrder] = useState(false);
  const [hasHandoff, setHasHandoff] = useState(false);
  const [handoffOps, setHandoffOps] = useState<VendorOperationalState | null>(null);

  useLayoutEffect(() => {
    setHasResidentOrder(readHasResidentOrderFromSession());
    setHasHandoff(readHasAdminHandoffFromSession());
    setSessionReadComplete(true);
  }, []);

  useEffect(() => {
    function onFocusOrShow() {
      setHasResidentOrder(readHasResidentOrderFromSession());
      setHasHandoff(readHasAdminHandoffFromSession());
    }
    window.addEventListener("focus", onFocusOrShow);
    window.addEventListener("pageshow", onFocusOrShow);
    return () => {
      window.removeEventListener("focus", onFocusOrShow);
      window.removeEventListener("pageshow", onFocusOrShow);
    };
  }, []);

  useEffect(() => {
    if (!sessionReadComplete || !hasResidentOrder || !hasHandoff) {
      setHandoffOps(null);
      return;
    }
    function refreshOps() {
      setHandoffOps(readOperationalState());
    }
    refreshOps();
    window.addEventListener("focus", refreshOps);
    window.addEventListener("pageshow", refreshOps);
    return () => {
      window.removeEventListener("focus", refreshOps);
      window.removeEventListener("pageshow", refreshOps);
    };
  }, [sessionReadComplete, hasResidentOrder, hasHandoff]);

  const showSentStatus = Boolean(showSentParam && hasHandoff);

  const mainPanel: "loading" | "empty" | "pre_handoff" | "post_handoff" = !sessionReadComplete
    ? "loading"
    : !hasResidentOrder
      ? "empty"
      : hasHandoff
        ? "post_handoff"
        : "pre_handoff";

  const postHandoffDelivered = Boolean(handoffOps?.deliveredToSocietyGate);
  const postHandoffHeadline = postHandoffDelivered
    ? "Delivered to society gate"
    : "Batch sent to vendors";
  const postHandoffDetail = postHandoffDelivered
    ? `Vendor confirmed the batch is at ${demoSociety.name} for ${weeklyCycle.cycleLabel}. Fulfillment for this demo cycle is complete—open status for the timeline.`
    : `The consolidated sheet is with fulfillment for ${weeklyCycle.cycleLabel}. Track packing and gate dispatch from status—handoff for this demo cycle is complete on the coordinator side.`;

  return (
    <section className="space-y-5">
      {showSentStatus ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-brand-800">
          <p className="font-medium">Vendor handoff started</p>
          <p className="mt-0.5 text-xs text-brand-900/90">
            Consolidated sheet was sent—open tracking if you need the timeline, or continue below.
          </p>
        </div>
      ) : null}

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Weekly bulk order</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          {demoSociety.city} · {demoSociety.totalFlats} flats · Cycle{" "}
          <span className="font-medium text-slate-800">{weeklyCycle.cycleLabel}</span>
        </p>
        <p className="text-xs text-slate-500">
          Cutoff <span className="font-medium text-slate-700">{weeklyCycle.cutoffLabel}</span> ·
          Delivery <span className="font-medium text-slate-700">{weeklyCycle.deliveryLabel}</span> ·{" "}
          {weeklyCycle.statusLabel}
        </p>
      </div>

      {mainPanel === "loading" ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : mainPanel === "empty" ? (
        <AdminDashboardEmptyState />
      ) : mainPanel === "post_handoff" ? (
        <AdminDashboardPostHandoffState headline={postHandoffHeadline} detail={postHandoffDetail} />
      ) : (
        <AdminPurchasesAndHouseholds />
      )}

      {mainPanel === "post_handoff" ? null : (
        <div className="surface-card flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vendor handoff</p>
            <h2 className="mt-2 text-base font-semibold text-slate-900">Order handoff status</h2>
            <p className="mt-1 text-sm text-slate-600">
              See where the consolidated batch sits on the operations timeline—before and after you
              send it to fulfillment.
            </p>
          </div>
          <Button href="/admin/tracking" variant="outline" className="w-full shrink-0 sm:w-auto">
            View status
          </Button>
        </div>
      )}

      {mainPanel === "post_handoff" ? (
        <div className="space-y-2">
          <p className="text-center text-xs text-slate-500">
            Consolidation was already sent for this cycle. Open below only if you need the sheet for
            reference.
          </p>
          <Button href="/admin/consolidation" variant="outline" className="w-full py-3 text-base font-semibold">
            View consolidation (reference)
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button href="/admin/consolidation" className="w-full py-3 text-base font-semibold">
            Review consolidation &amp; vendor sheet
          </Button>
          <p className="text-center text-xs text-slate-500">
            Roll up paid quantities and send the batch to your vendor.
          </p>
        </div>
      )}

      <Link href="/welcome" className="inline-block text-sm text-slate-600 hover:text-slate-800">
        ← Back to welcome
      </Link>
    </section>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <section className="space-y-5">
          <p className="text-sm text-slate-600">Loading…</p>
        </section>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
