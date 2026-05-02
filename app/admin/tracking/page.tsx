import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { demoOrderProgress, demoSociety, sampleOrderId } from "@/lib/demoData";

export default function AdminTrackingPage() {
  const { stages, currentStageIndex, statusLabel, nextStepLabel } = demoOrderProgress.admin;
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Admin Tracking</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{demoSociety.name}</h1>
        <p className="text-sm text-slate-600">
          Consolidated batch handoff—use this while you prepare the vendor sheet and again after you
          send it, so status stays aligned with fulfillment.
        </p>
      </div>

      <div className="surface-card space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Order/Cycle ID</span>
          <span className="font-medium text-slate-900">{sampleOrderId}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Status</span>
          <span className="font-medium text-brand-700">{statusLabel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Next step</span>
          <span className="font-medium text-slate-900">{nextStepLabel}</span>
        </div>
      </div>

      <div className="surface-card space-y-2">
        <p className="text-sm font-semibold text-slate-900">Timeline</p>
        <ol className="space-y-2">
          {stages.map((stage, index) => {
            const isCurrent = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            return (
              <li key={stage} className="flex items-center gap-3 text-sm">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isCurrent
                      ? "bg-brand-600 text-white"
                      : isCompleted
                        ? "bg-brand-100 text-brand-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                <span className={isCurrent ? "font-semibold text-slate-900" : "text-slate-600"}>
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-sm text-slate-600">
        Packing and gate dispatch are handled in the vendor interface; this view stays the
        coordinator reference for the same batch.
      </p>

      <Button href="/admin/dashboard?status=sent-to-vendor" className="w-full">
        Go back to admin dashboard
      </Button>

      <Link
        href="/admin/consolidation"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to consolidation
      </Link>

      <Link
        href="/welcome"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Exit to welcome
      </Link>
    </section>
  );
}
