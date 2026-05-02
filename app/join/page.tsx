"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { demoSociety } from "@/lib/demoData";

export default function JoinPage() {
  const [inviteCode, setInviteCode] = useState("");
  const [attempted, setAttempted] = useState(false);
  const normalizedCode = useMemo(() => inviteCode.trim().toUpperCase(), [inviteCode]);
  const isValidCode = normalizedCode === demoSociety.inviteCode;
  const showEmpty = attempted && normalizedCode.length === 0;
  const showInvalid = attempted && normalizedCode.length > 0 && !isValidCode;
  const showPreview = attempted && isValidCode;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
  }

  return (
    <section className="space-y-5">
      <Link
        href="/welcome"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to welcome
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enter your invite code</h1>
        <p className="text-sm text-slate-600">
          Your society shares this code so only members can join the group order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card space-y-3" noValidate>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700" htmlFor="society-code">
            Society invite code
          </label>
          <p className="text-xs text-slate-500">
            From your notice board, email, or society chat. You can type in any case—we match in
            uppercase.
          </p>
        </div>
        <input
          id="society-code"
          name="society-code"
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value)}
          placeholder={`e.g. ${demoSociety.inviteCode}`}
          autoComplete="off"
          autoCapitalize="characters"
          inputMode="text"
          aria-invalid={showEmpty || showInvalid}
          aria-describedby={showEmpty || showInvalid ? "code-feedback" : "code-hint"}
          className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm uppercase outline-none ring-brand-300 focus:ring aria-invalid:border-amber-400"
        />
        <p id="code-hint" className="sr-only">
          Enter the invite code, then continue to verify.
        </p>
        <Button type="submit" className="w-full">
          Check code
        </Button>
      </form>

      <div id="code-feedback" className="space-y-2" role="status" aria-live="polite">
        {showEmpty ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
            Please enter the code your society gave you, then tap <span className="font-medium">Check code</span>{" "}
            again.
          </p>
        ) : null}
        {showInvalid ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
            We don&apos;t recognize that code yet. Ask your society office for the current invite code,
            or check for a typo and try again.
          </p>
        ) : null}
      </div>

      {showPreview ? (
        <div className="surface-card space-y-3 border border-emerald-200 bg-emerald-50/30">
          <p className="text-sm font-semibold text-brand-800">That code looks good</p>
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-medium text-slate-900">{demoSociety.name}</p>
            <p>
              {demoSociety.city} · {demoSociety.totalFlats} flats in this pilot listing
            </p>
          </div>
          <Button href="/onboarding" className="w-full">
            Continue to household setup
          </Button>
        </div>
      ) : null}
    </section>
  );
}
