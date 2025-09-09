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

      {/* simplified realistic map */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="terrain" x1="0" x2="1">
            <stop offset="0%" stopColor="#f7fbff" />
            <stop offset="100%" stopColor="#eef6ff" />
          </linearGradient>
          <linearGradient id="water" x1="0" x2="1">
            <stop offset="0%" stopColor="#cfeefc" />
            <stop offset="100%" stopColor="#9fd7ff" />
          </linearGradient>
          <linearGradient id="hill" x1="0" x2="0">
            <stop offset="0%" stopColor="#e6eef7" />
            <stop offset="100%" stopColor="#c7d6e6" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#terrain)" />

        {/* gentle hills */}
        <g fill="url(#hill)" opacity="0.95">
          <path d="M100 260 C150 200 230 200 300 260 C380 320 480 320 560 260 C640 200 720 200 780 260 C860 330 960 330 1040 260 L1040 600 L0 600 Z" />
        </g>

        {/* river */}
        <path d="M60 340 C180 300 320 300 460 340 C620 380 760 360 900 380 C1040 400 1160 380 1200 360" stroke="url(#water)" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.95" />

        {/* main roads simple */}
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M40 80 C220 120 360 150 540 190 C720 230 860 210 1020 240" stroke="#3b4250" strokeWidth="8" opacity="0.9" />
          <path d="M40 80 C220 120 360 150 540 190 C720 230 860 210 1020 240" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
          <path d="M0 520 C200 440 420 470 600 440 C800 410 980 450 1200 420" stroke="#3b4250" strokeWidth="6" opacity="0.9" />
          <path d="M0 520 C200 440 420 470 600 440 C800 410 980 450 1200 420" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
        </g>

        {/* secondary roads subtle */}
        <g stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
          <path d="M160 40 L160 200" />
          <path d="M220 20 L220 260" />
          <path d="M300 60 L300 220" />
          <path d="M840 120 L840 360" />
          <path d="M460 120 L540 180" />
        </g>

        {/* small buildings simplified */}
        <g fill="#ffffff" stroke="#e6eef7" strokeWidth="0.8">
          <rect x="560" y="80" width="90" height="60" rx="6" />
          <rect x="240" y="320" width="110" height="70" rx="6" />
          <rect x="920" y="60" width="140" height="90" rx="6" />
        </g>

        {/* labels */}
        <g fill="#0f172a" fontFamily="Inter, Arial, sans-serif" fontSize="11" opacity="0.95">
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
            <circle r="7" fill="#ef4444" stroke="#fff" strokeWidth="2" />
          </g>
          <g transform="translate(700,260)">
            <circle r="8" fill="#16a34a" stroke="#fff" strokeWidth="2" />
          </g>
        </g>

        {/* trace */}
        {points.length > 0 && (
          <g>
            <polyline points={points} fill="none" stroke="rgba(16,185,129,0.95)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            {last && (
              <circle cx={last.x * 1200} cy={last.y * 600} r={8} fill="#16a34a">
                <animate attributeName="r" values="8;12;8" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.6;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )}

        {/* heat overlay */}
        {tab === "heat" && (
          <g filter="url(#soft)">
            <radialGradient id="h1">
              <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <circle cx="320" cy="220" r="120" fill="url(#h1)" />
            <circle cx="720" cy="260" r="160" fill="url(#h1)" />
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
