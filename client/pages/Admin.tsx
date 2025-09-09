import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { useI18n } from "@/context/i18n";
import { FeatureModal } from "@/components/FeatureModal";

type AlertType = "PANIC" | "GEOFENCE" | "LOW_SCORE";

interface AlertItem {
  id: string;
  touristId: string;
  name: string;
  type: AlertType;
  time: number;
  acknowledged?: boolean;
  escalated?: boolean;
  anomaly?: boolean;
  location?: string;
}

const names = [
  "Amit Sharma",
  "Priya Singh",
  "Rohit Kumar",
  "Sanjay Mehta",
  "Anjali Verma",
  "Deepak Rao",
  "Neha Patel",
  "Vikram Joshi",
  "Manish Gupta",
  "Rina K"
];

const LOCATIONS = [
  "Manali, HP",
  "Guwahati, Assam",
  "Shillong, Meghalaya",
  "Mumbai, MH",
  "New Delhi",
  "Kolkata, WB",
  "Chennai, TN",
  "Bengaluru, KA",
];

function randomAlert(): AlertItem {
  const type: AlertType = ["PANIC", "GEOFENCE", "LOW_SCORE"][Math.floor(Math.random() * 3)] as AlertType;
  const name = names[Math.floor(Math.random() * names.length)];
  const idSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  return {
    id: crypto.randomUUID(),
    touristId: name.toLowerCase().replace(/\s+/g, "-") + "-" + idSuffix,
    name,
    type,
    time: Date.now(),
    anomaly: Math.random() > 0.7,
    location,
  };
}

function useLiveAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  useEffect(() => {
    const seed = Array.from({ length: 6 }).map(() => randomAlert());
    setAlerts(seed);
    const id = setInterval(() => {
      setAlerts((prev) => [randomAlert(), ...prev].slice(0, 200));
    }, 5500);
    return () => clearInterval(id);
  }, []);
  const acknowledge = (id: string) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, acknowledged: true } : x)));
  const escalate = (id: string) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, escalated: true } : x)));
  return { alerts, acknowledge, escalate };
}

function Badge({ type }: { type: AlertType }) {
  const color = type === "PANIC" ? "bg-destructive text-destructive-foreground" : type === "GEOFENCE" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{type}</span>;
}

export default function Admin() {
  const { t } = useI18n();
  const { alerts, acknowledge, escalate } = useLiveAlerts();
  const [query, setQuery] = useState("");

  // filter states
  const [typeFilter, setTypeFilter] = useState<"ALL" | AlertType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "ACK" | "ESC">("ALL");
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [timeRange, setTimeRange] = useState<"any" | "1h" | "24h" | "7d">("any");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const now = Date.now();
    return alerts
      .filter((a) => a.touristId.toLowerCase().includes(query.toLowerCase()))
      .filter((a) => (typeFilter === "ALL" ? true : a.type === typeFilter))
      .filter((a) => (anomalyOnly ? !!a.anomaly : true))
      .filter((a) => {
        if (timeRange === "any") return true;
        if (timeRange === "1h") return now - a.time < 1000 * 60 * 60;
        if (timeRange === "24h") return now - a.time < 1000 * 60 * 60 * 24;
        if (timeRange === "7d") return now - a.time < 1000 * 60 * 60 * 24 * 7;
        return true;
      })
      .filter((a) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "OPEN") return !a.acknowledged && !a.escalated;
        if (statusFilter === "ACK") return !!a.acknowledged;
        if (statusFilter === "ESC") return !!a.escalated;
        return true;
      })
      .sort((x, y) => (sortOrder === "newest" ? y.time - x.time : x.time - y.time));
  }, [alerts, query, typeFilter, anomalyOnly, timeRange, statusFilter, sortOrder]);

  const selected = filtered[0];

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-2xl">{t("liveAlerts")}</CardTitle>
              <div className="flex items-center gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchById")} className="h-11 w-56" />
                <select className="rounded-md border px-2 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
                  <option value="ALL">All Types</option>
                  <option value="PANIC">PANIC</option>
                  <option value="GEOFENCE">GEOFENCE</option>
                  <option value="LOW_SCORE">LOW_SCORE</option>
                </select>
                <select className="rounded-md border px-2 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                  <option value="ALL">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="ACK">Acknowledged</option>
                  <option value="ESC">Escalated</option>
                </select>
                <select className="rounded-md border px-2 py-2 text-sm" value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)}>
                  <option value="any">Any time</option>
                  <option value="1h">Last 1h</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                </select>
                <select className="rounded-md border px-2 py-2 text-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={anomalyOnly} onChange={(e) => setAnomalyOnly(e.target.checked)} className="accent-accent" />
                  AI Anomaly
                </label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} onClick={() => { setSelectedAlert(a); setDetailOpen(true); }} className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border bg-card/60 p-3">
                <div className="flex items-center gap-3">
                  <Badge type={a.type} />
                  <div>
                    <div className="text-sm font-semibold">{a.name}<span className="text-muted-foreground"> · {a.touristId}</span></div>
                    <div className="text-xs text-muted-foreground">{new Date(a.time).toLocaleTimeString()}</div>
                    {/* AI Anomaly */}
                    {a.anomaly && <div className="mt-1 inline-block rounded-full bg-yellow-400/90 px-2 py-0.5 text-xs font-bold">AI: Anomaly</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="h-10 px-4" variant={a.acknowledged ? "secondary" : "default"} onClick={(e) => { e.stopPropagation(); acknowledge(a.id); }} disabled={a.acknowledged}>
                    {t("acknowledge")}
                  </Button>
                  <Button className="h-10 px-4" variant={a.escalated ? "secondary" : "destructive"} onClick={(e) => { e.stopPropagation(); escalate(a.id); }} disabled={a.escalated}>
                    {t("escalate")}
                  </Button>
                  <Button className="h-10 px-4" variant="outline" onClick={(e) => { e.stopPropagation(); alert("Auto e-FIR (mock) generated for " + a.touristId); }}>
                    Auto e-FIR
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <aside className="lg:col-span-1 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Map & Trace</CardTitle>
          </CardHeader>
          <CardContent>
            <MapPlaceholder height={260}>
              <div className="absolute left-8 top-24 h-1 w-28 rotate-12 rounded bg-primary/60" />
              <div className="absolute left-36 top-40 h-1 w-20 -rotate-6 rounded bg-primary/60" />
              <div className="absolute left-56 top-48 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive outline outline-2 outline-white shadow" />
              <div className="absolute right-3 top-3 rounded-md bg-background/80 px-2 py-1 text-[10px] shadow">
                {selected ? selected.touristId : "—"}
              </div>
            </MapPlaceholder>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("blockchain")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Network</span>
              <span className="font-mono">Polygon zkEVM</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-accent">{t("committed")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Block</span>
              <span className="font-mono">0x{(Math.random() * 1e16).toString(16).slice(0, 12)}</span>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Alert detail modal */}
      <FeatureModal open={detailOpen} title={selectedAlert ? `${selectedAlert.type} · ${selectedAlert.touristId}` : "Alert Detail"} onClose={() => setDetailOpen(false)}>
        {selectedAlert ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold">{selectedAlert.name}</div>
              <div className="text-xs text-muted-foreground">ID: {selectedAlert.touristId}</div>
              <div className="mt-2 text-xs text-muted-foreground">Time: {new Date(selectedAlert.time).toLocaleString()}</div>
              <div className="mt-3">
                <div className="text-sm font-medium">AI Analysis</div>
                <div className="text-xs text-muted-foreground">Anomaly score: {(Math.random()*100).toFixed(0)}%</div>
                <div className="mt-2 text-xs">Suggested action: {selectedAlert.type === "PANIC" ? "Immediate dispatch" : "Investigate & contact tourist"}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => { acknowledge(selectedAlert.id); setDetailOpen(false); }}>Acknowledge</Button>
                <Button variant="destructive" onClick={() => { escalate(selectedAlert.id); alert("Escalated (mock)"); }}>Escalate</Button>
                <Button variant="outline" onClick={() => alert("Generate e-FIR (mock) for " + selectedAlert.touristId)}>Generate e-FIR</Button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Map Snapshot</div>
              <MapPlaceholder height={200}>
                <div className="absolute left-6 top-12 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow outline outline-2 outline-white" />
              </MapPlaceholder>
            </div>
          </div>
        ) : (
          <div>No alert selected</div>
        )}
      </FeatureModal>

    </div>
  );
}
