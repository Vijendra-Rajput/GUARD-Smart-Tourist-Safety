import React, { useState } from "react";
import { useI18n } from "@/context/i18n";

export const MapPlaceholder: React.FC<{ height?: number; children?: React.ReactNode; initial?: "physical" | "heat"; trace?: { x: number; y: number }[] }> = ({ height = 220, children, initial = "physical", trace = [] }) => {
  const { t } = useI18n();
  const [tab, setTab] = useState<"physical" | "heat">(initial);

  // normalize trace to svg coordinates (1200x600)
  const points = trace.map((p) => `${p.x * 1200} ${p.y * 600}`).join(" ");
  const last = trace.length ? trace[trace.length - 1] : null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-background" style={{ height }}>
      {/* Tabs */}
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-md bg-background/70 p-1 shadow backdrop-blur">
        <button
          role="tab"
          aria-selected={tab === "physical"}
          onClick={() => setTab("physical")}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${tab === "physical" ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"}`}
        >
          Physical
        </button>
        <button
          role="tab"
          aria-selected={tab === "heat"}
          onClick={() => setTab("heat")}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${tab === "heat" ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"}`}
        >
          Heat Map
        </button>
      </div>

      {/* Fake map base - looks like simplified Google Maps tiles */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="terrain" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(210 20% 96%)" />
            <stop offset="100%" stopColor="hsl(210 20% 88%)" />
          </linearGradient>
          <linearGradient id="water" x1="0" x2="1">
            <stop offset="0%" stopColor="#a6dafb" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7bc7ff" stopOpacity="0.9" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        {/* base */}
        <rect width="100%" height="100%" fill="url(#terrain)" />

        {/* mountains with contour lines */}
        <defs>
          <linearGradient id="mountainGrad" x1="0" x2="0">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <g>
          <path d="M150 220 L210 140 L270 220 Z" fill="url(#mountainGrad)" stroke="#94a3b8" strokeWidth="1" />
          <path d="M220 200 L260 160 L300 200 Z" fill="#e6eef7" opacity="0.6" />
          <path d="M860 100 L940 20 L1020 100 L940 140 Z" fill="url(#mountainGrad)" stroke="#94a3b8" strokeWidth="1" />
          {/* contour lines */}
          <path d="M150 220 Q210 180 270 220" fill="none" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />
          <path d="M860 100 Q940 60 1020 100" fill="none" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* parks */}
        <g fill="hsl(140 45% 88%)" opacity="0.95">
          <ellipse cx="200" cy="420" rx="100" ry="40" />
          <ellipse cx="520" cy="300" rx="60" ry="30" />
          <ellipse cx="980" cy="480" rx="120" ry="50" />
        </g>

        {/* lakes and rivers */}
        <g>
          <path d="M0,320 C120,280 260,260 380,300 C520,350 660,320 800,340 C920,355 1060,330 1200,360" fill="none" stroke="url(#water)" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          <ellipse cx="420" cy="420" rx="60" ry="30" fill="url(#water)" opacity="0.95" />
        </g>

        {/* major roads (two-tone with center line) */}
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 90 C200 120 360 140 540 180 C740 220 880 200 1020 230" stroke="#374151" strokeWidth="12" opacity="0.9" />
          <path d="M40 90 C200 120 360 140 540 180 C740 220 880 200 1020 230" stroke="#f8fafc" strokeWidth="4" opacity="0.85" />

          <path d="M0 500 C200 430 420 460 600 430 C800 400 980 440 1200 410" stroke="#374151" strokeWidth="10" opacity="0.95" />
          <path d="M0 500 C200 430 420 460 600 430 C800 400 980 440 1200 410" stroke="#f8fafc" strokeWidth="3" opacity="0.8" />
        </g>

        {/* secondary streets */}
        <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.9">
          <path d="M160 40 L160 200" />
          <path d="M220 20 L220 260" />
          <path d="M300 60 L300 220" />
          <path d="M840 120 L840 360" />
          <path d="M460 120 L540 180" />
          <path d="M720 220 L780 240" />
        </g>

        {/* buildings */}
        <g fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1">
          <rect x="560" y="80" width="120" height="80" rx="6" />
          <rect x="640" y="220" width="90" height="60" rx="5" />
          <rect x="240" y="320" width="140" height="90" rx="6" />
          <rect x="940" y="60" width="180" height="120" rx="8" />
          <rect x="300" y="420" width="60" height="40" rx="4" />
        </g>

        {/* location labels small fonts */}
        <g fill="#0f172a" fontFamily="Inter, Arial, sans-serif" fontSize="12" opacity="0.95">
          <text x="70" y="55">Old Town</text>
          <text x="410" y="215">City Museum</text>
          <text x="930" y="155">Harbor Pier</text>
          <text x="200" y="410">Central Park</text>
          <text x="520" y="290">Riverside</text>
          <text x="860" y="90">Highlands</text>
        </g>

        {/* markers */}
        <g>
          <g transform="translate(300,200)">
            <circle r="10" fill="#ef4444" stroke="#fff" strokeWidth="3" />
          </g>
          <g transform="translate(700,260)">
            <circle r="12" fill="#3b82f6" stroke="#fff" strokeWidth="3" />
          </g>
        </g>

        {/* subtle texture lines */}
        <g opacity="0.04" stroke="#000" strokeWidth="0.6">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={i} x1={i * 60} y1={0} x2={i * 60} y2={600} />
          ))}
        </g>

        {/* trace polyline (real-time tracking) */}
        {points.length > 0 && (
          <g>
            <polyline points={points} fill="none" stroke="rgba(59,130,246,0.95)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            {/* animated moving dot */}
            {last && (
              <circle cx={last.x * 1200} cy={last.y * 600} r={9} fill="#3b82f6">
                <animate attributeName="r" values="9;14;9" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.6;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )}

        {/* heat overlay (visible when tab==='heat') */}
        {tab === "heat" && (
          <g filter="url(#soft)">
            <radialGradient id="h1">
              <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="h2">
              <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>

            <circle cx="320" cy="220" r="120" fill="url(#h1)" />
            <circle cx="720" cy="260" r="180" fill="url(#h2)" />
            <circle cx="980" cy="380" r="100" fill="url(#h1)" />
          </g>
        )}
      </svg>

      {/* children overlay (pins, UI badges) */}
      <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 pointer-events-none">
        {children}
      </div>

      {/* bottom legend for heat map */}
      {tab === "heat" && (
        <div className="absolute left-3 bottom-3 z-30 rounded-md bg-background/80 p-2 text-xs font-medium shadow backdrop-blur pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-8 rounded-md bg-red-500/90 shadow-inner" />
            <span className="text-muted-foreground">High</span>
            <span className="ml-3 inline-block h-3 w-8 rounded-md bg-yellow-400/80" />
            <span className="text-muted-foreground">Medium</span>
            <span className="ml-3 inline-block h-3 w-8 rounded-md bg-green-300/80" />
            <span className="text-muted-foreground">Low</span>
          </div>
        </div>
      )}
    </div>
  );
};
