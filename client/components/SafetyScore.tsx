import React from "react";

export const SafetyScore: React.FC<{ score: number }> = ({ score }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 54;
  const stroke = 12;
  const c = 2 * Math.PI * radius;
  const offset = c - (clamped / 100) * c;
  const color = clamped < 40 ? "hsl(var(--destructive))" : clamped < 70 ? "hsl(var(--accent))" : "hsl(var(--primary))";
  return (
    <div className="flex items-center gap-4">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={radius} stroke="hsl(var(--muted-foreground))" strokeWidth={stroke} fill="none" opacity={0.2} />
        <circle
          cx={70}
          cy={70}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-foreground text-3xl font-extrabold">
          {clamped}
        </text>
      </svg>
      <div>
        <div className="text-sm uppercase tracking-wide text-muted-foreground">Safety Score</div>
        <div className="text-2xl font-semibold">{clamped} / 100</div>
        <div className="text-xs text-muted-foreground">Calculated from recent activity and geofence risk</div>
      </div>
    </div>
  );
};
