"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { residentProfile as demoResidentProfile } from "@/lib/demoData";
import { useResidentCart } from "../resident/ResidentCartProvider";

const DIETARY_OPTIONS = [
  { value: "", label: "Select preference" },
  { value: "south-indian", label: "South Indian" },
  { value: "north-indian", label: "North Indian" },
  { value: "jain", label: "Jain" },
  { value: "vegan", label: "Vegan" },
  { value: "mixed", label: "Mixed" }
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { residentProfile, setResidentProfile } = useResidentCart();
  const [flat, setFlat] = useState(residentProfile.flat || demoResidentProfile.flat);
  const [familySize, setFamilySize] = useState("4");
  const [dietary, setDietary] = useState("");
  const [name, setName] = useState(residentProfile.name || demoResidentProfile.name);
  const [flatError, setFlatError] = useState(false);
  const [familyError, setFamilyError] = useState(false);
  const [dietaryError, setDietaryError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const flatTrim = flat.trim();
    const n = Number.parseInt(familySize, 10);
    const familyOk = Number.isFinite(n) && n >= 1 && n <= 20;
    const dietaryOk = dietary.length > 0;

    setFlatError(flatTrim.length === 0);
    setFamilyError(!familyOk);
    setDietaryError(!dietaryOk);

    if (flatTrim.length === 0 || !familyOk || !dietaryOk) return;

    setResidentProfile({
      name: name.trim() || demoResidentProfile.name,
      flat: flatTrim
    });
    router.push("/resident/home");
  }

  return (
    <section className="space-y-5">
      <Link
        href="/join"
        className="inline-block text-sm text-slate-600 underline-offset-2 hover:text-slate-800 hover:underline"
      >
        ← Back to invite code
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your household</h1>
        <p className="text-sm text-slate-600">
          A few details so checkout and reminders match your flat. Takes under a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card space-y-4" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="flat">
            Flat / unit number
          </label>
          <p className="mb-1.5 text-xs text-slate-500">As on your door or society directory (e.g. B-1204).</p>
          <input
            id="flat"
            value={flat}
            onChange={(event) => {
              setFlat(event.target.value);
              setFlatError(false);
            }}
            placeholder={demoResidentProfile.flat}
            aria-invalid={flatError}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring aria-invalid:border-amber-400"
          />
          {flatError ? (
            <p className="mt-1.5 text-xs text-amber-800">Please enter your flat or unit number.</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="family-size">
            Family size
          </label>
          <p className="mb-1.5 text-xs text-slate-500">People you usually cook for at home.</p>
          <input
            id="family-size"
            type="number"
            min={1}
            max={20}
            inputMode="numeric"
            value={familySize}
            onChange={(event) => {
              setFamilySize(event.target.value);
              setFamilyError(false);
            }}
            aria-invalid={familyError}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring aria-invalid:border-amber-400"
          />
          {familyError ? (
            <p className="mt-1.5 text-xs text-amber-800">Enter a whole number from 1 to 20.</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="dietary-preference">
            Dietary preference
          </label>
          <p className="mb-1.5 text-xs text-slate-500">Helps us keep meal ideas relevant for your home.</p>
          <select
            id="dietary-preference"
            value={dietary}
            onChange={(event) => {
              setDietary(event.target.value);
              setDietaryError(false);
            }}
            aria-invalid={dietaryError}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring aria-invalid:border-amber-400"
          >
            {DIETARY_OPTIONS.map((opt) =>
              opt.value === "" ? (
                <option key={opt.value} value={opt.value} disabled>
                  {opt.label}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )
            )}
          </select>
          {dietaryError ? (
            <p className="mt-1.5 text-xs text-amber-800">Please choose the option that fits best.</p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="resident-name">
            What should we call you?
          </label>
          <p className="mb-1.5 text-xs text-slate-500">Shown on your home screen and order summaries.</p>
          <input
            id="resident-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={demoResidentProfile.name}
            className="w-full rounded-xl border border-emerald-200 px-3 py-2.5 text-sm outline-none ring-brand-300 focus:ring"
          />
        </div>

        <Button type="submit" className="w-full">
          Save and go to home
        </Button>
        <p className="text-center text-xs text-slate-500">
          Pilot demo: your name and flat are saved for checkout; family size and diet help you complete
          setup—full profiles come later.
        </p>
      </form>
    </section>
  );
}
