import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Status = "Online" | "Offline" | "Low Battery";

type Device = {
  id: string;
  deviceName: string;
  assignedTo: string;
  status: Status;
  battery: number;
  signal: number;
  lastUpdate: string; // ISO
  vitals: {
    heartRate: number;
    temperature: number;
    steps: number;
  };
};

const MOCK_DEVICES: Device[] = [
  {
    id: "sw-001",
    deviceName: "Smartwatch SW-001",
    assignedTo: "John Smith",
    status: "Online",
    battery: 78,
    signal: 95,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    vitals: { heartRate: 72, temperature: 36.5, steps: 8750 },
  },
  {
    id: "sw-002",
    deviceName: "Smartwatch SW-002",
    assignedTo: "Asha Verma",
    status: "Low Battery",
    battery: 18,
    signal: 62,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    vitals: { heartRate: 80, temperature: 36.9, steps: 4200 },
  },
  {
    id: "sw-003",
    deviceName: "Smartwatch SW-003",
    assignedTo: "Rohit Kumar",
    status: "Offline",
    battery: 0,
    signal: 0,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    vitals: { heartRate: 0, temperature: 0, steps: 0 },
  },
  {
    id: "sw-004",
    deviceName: "Smartwatch SW-004",
    assignedTo: "Neha Patel",
    status: "Online",
    battery: 94,
    signal: 88,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    vitals: { heartRate: 68, temperature: 36.4, steps: 12000 },
  },
  {
    id: "sw-005",
    deviceName: "Smartwatch SW-005",
    assignedTo: "Vikram Joshi",
    status: "Online",
    battery: 45,
    signal: 74,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    vitals: { heartRate: 76, temperature: 37.0, steps: 6500 },
  },
  {
    id: "sw-006",
    deviceName: "Smartwatch SW-006",
    assignedTo: "Anjali Verma",
    status: "Low Battery",
    battery: 12,
    signal: 40,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    vitals: { heartRate: 85, temperature: 37.2, steps: 2300 },
  },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function StatusBadge({ status }: { status: Status }) {
  const map = {
    Online: "bg-emerald-100 text-emerald-800",
    Offline: "bg-gray-100 text-gray-700",
    "Low Battery": "bg-yellow-100 text-yellow-800",
  } as const;
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status}
    </div>
  );
}

function IconBattery({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
        <rect x="4" y="9" width={`${(12 * Math.max(0, Math.min(100, value)))/100}`} height="6" rx="1" fill="currentColor" opacity="0.6" />
      </svg>
      <div className="font-semibold text-sm">{value}%</div>
    </div>
  );
}

function IconSignal({ value }: { value: number }) {
  const strength = Math.round((value / 100) * 4);
  return (
    <div className="flex items-center gap-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h2V14H3v7zM8 21h2V11H8v10zM13 21h2V8h-2v13zM18 21h2V4h-2v17z" fill="currentColor" opacity="0.9" />
      </svg>
      <div className="font-semibold text-sm">{value}%</div>
    </div>
  );
}

export default function Devices() {
  const [filter, setFilter] = useState<"All" | Status | "Low Battery">("All");

  const devices = useMemo(() => {
    if (filter === "All") return MOCK_DEVICES;
    return MOCK_DEVICES.filter((d) => d.status === filter);
  }, [filter]);

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Device Monitoring</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of connected wearable devices</p>
      </div>

      <div className="flex gap-2 flex-wrap items-center mb-4">
        {(["All", "Online", "Offline", "Low Battery"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setFilter(b as any)}
            className={`px-3 py-2 rounded-full text-sm font-semibold border transition ${filter === b ? "bg-primary text-white border-primary" : "bg-white/60 hover:bg-white"}`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((d) => (
          <Card key={d.id} className="transform transition hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{d.deviceName}</div>
                <div className="text-xs text-muted-foreground mt-1">Assigned to: {d.assignedTo}</div>
              </div>
              <StatusBadge status={d.status} />
            </CardHeader>

            <CardContent className="pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Battery</div>
                  <div className="mt-1 flex items-center gap-2">
                    <IconBattery value={d.battery} />
                    <div className="flex-1 bg-slate-100 h-2 rounded overflow-hidden">
                      <div className="h-2 bg-emerald-400" style={{ width: `${d.battery}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Signal</div>
                  <div className="mt-1 flex items-center gap-2">
                    <IconSignal value={d.signal} />
                    <div className="flex-1 bg-slate-100 h-2 rounded overflow-hidden">
                      <div className="h-2 bg-sky-400" style={{ width: `${d.signal}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="p-2 rounded-md bg-red-50 flex flex-col items-start">
                  <div className="text-xs text-red-600 font-semibold">Heart Rate</div>
                  <div className="text-lg font-bold">{d.vitals.heartRate} <span className="text-sm font-normal">bpm</span></div>
                </div>
                <div className="p-2 rounded-md bg-blue-50 flex flex-col items-start">
                  <div className="text-xs text-sky-600 font-semibold">Temperature</div>
                  <div className="text-lg font-bold">{d.vitals.temperature} <span className="text-sm font-normal">°C</span></div>
                </div>
                <div className="p-2 rounded-md bg-emerald-50 flex flex-col items-start">
                  <div className="text-xs text-emerald-700 font-semibold">Steps</div>
                  <div className="text-lg font-bold">{d.vitals.steps}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="text-xs text-muted-foreground">Last update: {timeAgo(d.lastUpdate)}</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
