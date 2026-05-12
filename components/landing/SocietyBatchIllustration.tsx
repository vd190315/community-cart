/**
 * Custom hero illustration: many flats → one weekly batch → gate handoff.
 * Inline SVG only — no external assets.
 */
export function SocietyBatchIllustration() {
  return (
    <figure className="mx-auto w-full max-w-[18.5rem] sm:max-w-[21rem]" aria-labelledby="landing-illustration-caption">
      <svg
        viewBox="0 0 320 292"
        className="h-auto w-full drop-shadow-sm"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>From apartment windows to one batch to the society gate</title>
        {/* Ground */}
        <ellipse cx="160" cy="272" rx="142" ry="12" fill="#e9f3e6" opacity="0.9" />
        {/* Towers */}
        <g fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.25">
          <rect x="22" y="124" width="46" height="120" rx="5" />
          <rect x="78" y="96" width="54" height="148" rx="5" />
          <rect x="142" y="110" width="44" height="134" rx="5" />
        </g>
        {/* Lit windows — warm */}
        <g className="landing-illu-windows" fill="#fde68a" opacity="0.95">
          <rect x="32" y="140" width="6" height="6" rx="1" />
          <rect x="44" y="156" width="6" height="6" rx="1" />
          <rect x="32" y="176" width="6" height="6" rx="1" />
          <rect x="90" y="108" width="6" height="6" rx="1" />
          <rect x="108" y="124" width="6" height="6" rx="1" />
          <rect x="90" y="152" width="6" height="6" rx="1" />
          <rect x="154" y="122" width="6" height="6" rx="1" />
          <rect x="168" y="144" width="6" height="6" rx="1" />
        </g>
        {/* Converging guides */}
        <path
          className="landing-illu-converge"
          d="M 48 214 C 92 206 120 200 158 196"
          fill="none"
          stroke="#4ade80"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="landing-illu-converge"
          d="M 106 214 C 132 206 150 200 158 196"
          fill="none"
          stroke="#4ade80"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="landing-illu-converge"
          d="M 172 214 C 154 206 150 200 158 196"
          fill="none"
          stroke="#4ade80"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Batch crate */}
        <rect
          x="130"
          y="166"
          width="60"
          height="48"
          rx="9"
          fill="#ffffff"
          stroke="#2f7d32"
          strokeWidth="2"
        />
        <path
          d="M 142 188 h36 M 142 198 h28"
          stroke="#2f7d32"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text x="160" y="158" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="0.08em">
          ONE BATCH
        </text>
        {/* Dotted route */}
        <path
          className="landing-illu-route"
          d="M 190 188 C 228 182 248 158 256 128"
          fill="none"
          stroke="#15803d"
          strokeOpacity="0.45"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Van */}
        <g transform="translate(232, 98)">
          <rect x="0" y="22" width="52" height="22" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.25" />
          <rect x="8" y="28" width="20" height="12" rx="2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="14" cy="48" r="5" fill="#334155" />
          <circle cx="40" cy="48" r="5" fill="#334155" />
          <rect x="36" y="26" width="12" height="10" rx="1" fill="#e9f8e4" stroke="#2f7d32" strokeWidth="1" />
        </g>
        {/* Gate */}
        <g transform="translate(248, 44)">
          <path
            d="M 6 70 L 6 22 Q 6 10 18 10 L 54 10 Q 66 10 66 22 L 66 70"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <path d="M 22 70 L 22 48 L 50 48 L 50 70" fill="none" stroke="#cbd5e1" strokeWidth="1.25" />
          <circle cx="36" cy="32" r="5" fill="#2f7d32" />
        </g>
        <text x="282" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600" letterSpacing="0.08em">
          GATE
        </text>
      </svg>
      <p id="landing-illustration-caption" className="mt-3 text-center text-[13px] leading-snug text-slate-500 sm:text-sm">
        Flats → one weekly batch → one stop at your gate.
      </p>
    </figure>
  );
}
