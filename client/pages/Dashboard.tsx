import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const SummaryCard = ({ title, value, meta, color, icon }: any) => (
  <Card>
    <CardContent>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className={`text-2xl font-bold ${color || "text-slate-900"}`}>
            {value}
          </div>
          {meta && (
            <div className="text-sm text-muted-foreground mt-1">{meta}</div>
          )}
        </div>
        <div className="opacity-80">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

function AreaChart({ data = [800, 1200, 1600, 2200, 1800, 1400, 1600] }) {
  const w = 600;
  const h = 200;
  const max = Math.max(...data) * 1.1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - (v / max) * h}`)
    .join(" ");
  const path = `M0,${h} L ${points} L ${w},${h} Z`;
  const linePath = `M ${data.map((v, i) => `${i * step} ${h - (v / max) * h}`).join(" L ")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d={path} fill="url(#areaGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={h - (v / max) * h}
          r={3.5}
          fill="#4f46e5"
        />
      ))}
    </svg>
  );
}

function DonutChart() {
  const segments = [55, 20, 15, 10];
  const colors = ["#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];
  const total = segments.reduce((a, b) => a + b, 0);
  let start = 0;
  const radius = 60;
  const cx = 90;
  const cy = 90;

  const arcs = segments.map((s, idx) => {
    const from = start / total;
    start += s;
    const to = start / total;
    const a0 = 2 * Math.PI * from - Math.PI / 2;
    const a1 = 2 * Math.PI * to - Math.PI / 2;
    const x0 = cx + radius * Math.cos(a0);
    const y0 = cy + radius * Math.sin(a0);
    const x1 = cx + radius * Math.cos(a1);
    const y1 = cy + radius * Math.sin(a1);
    const large = to - from > 0.5 ? 1 : 0;
    return {
      d: `M ${cx} ${cy} L ${x0} ${y0} A ${radius} ${radius} 0 ${large} 1 ${x1} ${y1} Z`,
      color: colors[idx],
      value: s,
    };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <g>
          {arcs.map((a, i) => (
            <path key={i} d={a.d} fill={a.color} opacity={0.95} />
          ))}
          <circle cx={cx} cy={cy} r={36} fill="#fff" />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold"
            style={{ fontSize: 18 }}
          >
            78
          </text>
          <text
            x={cx}
            y={cy + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-muted-foreground"
          >
            Safety
          </text>
        </g>
      </svg>

      <div className="flex-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: colors[0] }}
            />
            <div>
              <div className="text-sm font-medium">Excellent</div>
              <div className="text-xs text-muted-foreground">55%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: colors[1] }}
            />
            <div>
              <div className="text-sm font-medium">Good</div>
              <div className="text-xs text-muted-foreground">20%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: colors[2] }}
            />
            <div>
              <div className="text-sm font-medium">Fair</div>
              <div className="text-xs text-muted-foreground">15%</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: colors[3] }}
            />
            <div>
              <div className="text-sm font-medium">Poor</div>
              <div className="text-xs text-muted-foreground">10%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of tourist activity, devices and system health
        </p>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Active Tourists"
          value="12,847"
          meta={<span className="text-emerald-600">+8.2% from last month</span>}
          icon={"👥"}
        />
        <SummaryCard
          title="IoT Devices"
          value="1,234"
          meta={<span>12 offline</span>}
          icon={"📶"}
        />
        <SummaryCard
          title="Critical Alerts"
          value={<span className="text-red-600">23</span>}
          meta={<span>5 new today</span>}
          icon={"⚠️"}
        />
        <SummaryCard
          title="System Uptime"
          value="99.8%"
          meta={<span className="text-emerald-600">+0.1% improvement</span>}
          icon={"📈"}
        />
      </div>

      {/* Middle charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Tourist Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={[800, 1200, 1600, 2200, 1800, 1400, 1600]} />
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Y-axis: visitors — X-axis: days
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart />
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Legend shows proportion of tourist safety scores
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
