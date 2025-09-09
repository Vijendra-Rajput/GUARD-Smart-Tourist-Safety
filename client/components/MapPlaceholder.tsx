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

        {/* parks */}
        <g fill="hsl(140 45% 88%)" opacity="0.9">
          <ellipse cx="200" cy="120" rx="120" ry="50" />
          <ellipse cx="420" cy="240" rx="80" ry="40" />
          <ellipse cx="980" cy="420" rx="140" ry="60" />
        </g>

        {/* water */}
        <path d="M0,320 C120,280 260,260 380,300 C520,350 660,320 800,340 C920,355 1060,330 1200,360 L1200,600 L0,600 Z" fill="url(#water)" opacity="0.95" />

        {/* roads */}
        <g stroke="#2d3748" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
          <path d="M60 80 L380 120 L540 200 L760 180 L980 220" fill="none" stroke="#cbd5e1" strokeWidth="8" />
          <path d="M0 500 L240 420 L480 460 L720 420 L960 460 L1200 420" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        </g>

        {/* small streets */}
        <g stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <path d="M160 40 L160 200" />
          <path d="M220 20 L220 260" />
          <path d="M300 60 L300 220" />
          <path d="M840 120 L840 360" />
        </g>

        {/* buildings */}
        <g fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1">
          <rect x="560" y="80" width="120" height="80" rx="6" />
          <rect x="640" y="220" width="90" height="60" rx="5" />
          <rect x="240" y="320" width="140" height="90" rx="6" />
          <rect x="940" y="60" width="180" height="120" rx="8" />
        </g>

        {/* labels */}
        <g fill="#1f2937" fontFamily="Inter, Arial, sans-serif" fontSize="18">
          <text x="80" y="60">Old Town</text>
          <text x="420" y="220">Museum</text>
          <text x="940" y="160">Harbor</text>
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

        {/* subtle grid for visual texture */}
        <g opacity="0.06" stroke="#000" strokeWidth="1">
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={i * 80} y1={0} x2={i * 80} y2={600} />
          ))}
        </g>

        {/* trace polyline (real-time tracking) */}
        {points.length > 0 && (
          <g>
            <polyline points={points} fill="none" stroke="rgba(59,130,246,0.9)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            {/* animated moving dot */}
            {last && (
              <circle cx={last.x * 1200} cy={last.y * 600} r={8} fill="#3b82f6">
                <animate attributeName="r" values="8;12;8" dur="1.6s" repeatCount="indefinite" />
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
