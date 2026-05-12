"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [building, setBuilding] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-5 text-center"
        role="status"
      >
        <p className="text-sm font-semibold text-slate-900">You&apos;re on the list</p>
        <p className="mt-2 text-sm text-slate-600">
          This pilot uses a demo form only — no data is stored yet. We&apos;ll plug in your waitlist
          backend next.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="waitlist-email" className="block text-sm font-medium text-slate-800">
          Work email
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm text-slate-900 outline-none ring-brand-300 focus:ring"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="waitlist-society" className="block text-sm font-medium text-slate-800">
          Society / city (optional)
        </label>
        <input
          id="waitlist-society"
          name="society"
          type="text"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          placeholder="e.g. Green Meadows, Chennai"
          className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm text-slate-900 outline-none ring-brand-300 focus:ring"
        />
      </div>
      <Button type="submit" className="w-full py-3 text-base">
        Join waitlist
      </Button>
      <p className="text-center text-xs text-slate-500">Frontend-only for now — no submission API.</p>
    </form>
  );
}
