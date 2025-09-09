import React, { useMemo, useState } from "react";
import { useI18n } from "@/context/i18n";

export const MapPlaceholder: React.FC<{ height?: number; children?: React.ReactNode; initial?: "physical" | "heat"; trace?: { x: number; y: number }[] }> = ({ height = 220, children, initial = "physical", trace = [] }) => {
  const { t } = useI18n();
  const [tab, setTab] = useState<"physical" | "heat">(initial);

  // normalize trace to svg coordinates (1200x600)
  const points = trace.map((p) => `${p.x * 1200} ${p.y * 600}`).join(" ");
  const last = trace.length ? trace[trace.length - 1] : null;

  // normalize trace to svg coordinates (1200x600)

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

      {/* Map using provided image */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <radialGradient id="h1">
            <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ff7a45" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
          </radialGradient>
        </defs>

        <image href="https://cdn.builder.io/api/v1/image/assets%2F54db72644cde408b844f73b2e4d133f1%2F0c9bfd178d3d4699af561f2d14536fa8?format=webp&width=1200" x="0" y="0" width="1200" height="600" preserveAspectRatio="xMidYMid slice" />

        {/* subtle overlay to improve readability */}
        <rect width="100%" height="100%" fill="rgba(255,255,255,0.04)" />

        {/* labels */}
        <g fill="#07132a" fontFamily="Inter, Arial, sans-serif" fontSize="12" opacity="0.95">
          <text x="70" y="55">Old Town</text>
          <text x="410" y="215">City Museum</text>
          <text x="930" y="155">Harbor Pier</text>
          <text x="200" y="410">Central Park</text>
          <text x="520" y="290">Riverside</text>
          <text x="860" y="90">Highlands</text>
        </g>

        {/* markers on image */}
        <g>
          <g transform="translate(300,200)">
            <circle r="7" fill="#ef4444" stroke="#fff" strokeWidth="2" />
          </g>
          <g transform="translate(700,260)">
            <circle r="8" fill="#16a34a" stroke="#fff" strokeWidth="2" />
          </g>
        </g>

        {/* trace overlay */}
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
            <circle cx="320" cy="220" r="120" fill="url(#h1)" />
            <circle cx="720" cy="260" r="160" fill="url(#h1)" />
          </g>
        )}

      </svg>

      {/* children overlay (pins, UI badges) */}
      <div className="absolute inset-0 p-3 sm:p-4 lg:p-6 pointer-events-none">
        {children}
      </div>

      {/* trip stats panel (exact location, distance, destination, ETA, nearby travellers) */}
      <div className="absolute right-4 top-4 z-40 w-72 rounded-md bg-card p-3 text-sm shadow pointer-events-auto">
        {stats ? (
          <div className="space-y-2">
            <div className="font-semibold">Location</div>
            <div className="text-xs text-muted-foreground">Lat: {stats.lat} · Lon: {stats.lon}</div>

            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-muted-foreground">Km traveled</div>
              <div className="font-medium">{stats.kmTraveled} km</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Destination</div>
              <div className="font-medium">{stats.destination}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Distance</div>
              <div className="font-medium">{stats.distanceToDestinationKm} km</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">ETA</div>
              <div className="font-medium">~{stats.etaMinutes} min</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Travellers nearby</div>
              <div className="font-medium">{stats.nearbyCount}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No tracking data</div>
        )}
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
