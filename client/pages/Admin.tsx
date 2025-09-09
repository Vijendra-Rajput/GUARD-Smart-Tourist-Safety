import { useEffect, useMemo, useState } from "react";
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
}

const names = ["Amit Sharma", "Lucia Gomez", "John Doe", "Priya Singh", "Carlos Diaz", "Mia Chen"];

function randomAlert(): AlertItem {
  const type: AlertType = ["PANIC", "GEOFENCE", "LOW_SCORE"][Math.floor(Math.random() * 3)] as AlertType;
  const name = names[Math.floor(Math.random() * names.length)];
  const idSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return {
    id: crypto.randomUUID(),
    touristId: name.toLowerCase().replace(/\s+/g, "-") + "-" + idSuffix,
    name,
    type,
    time: Date.now(),
  };
}

function useLiveAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  useEffect(() => {
    const seed = Array.from({ length: 3 }).map(() => randomAlert());
    setAlerts(seed);
    const id = setInterval(() => {
      setAlerts((prev) => [randomAlert(), ...prev].slice(0, 50));
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
  const filtered = useMemo(() => alerts.filter((a) => a.touristId.toLowerCase().includes(query.toLowerCase())), [alerts, query]);
  const selected = filtered[0];

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">{t("liveAlerts")}</CardTitle>
              <div className="flex items-center gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchById")} className="h-11 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border bg-card/60 p-3">
                <div className="flex items-center gap-3">
                  <Badge type={a.type} />
                  <div>
                    <div className="text-sm font-semibold">{a.name}<span className="text-muted-foreground"> · {a.touristId}</span></div>
                    <div className="text-xs text-muted-foreground">{new Date(a.time).toLocaleTimeString()}</div>
                    {/* AI Anomaly */}
                    {Math.random() > 0.7 && <div className="mt-1 inline-block rounded-full bg-yellow-400/90 px-2 py-0.5 text-xs font-bold">AI: Anomaly</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="h-10 px-4" variant={a.acknowledged ? "secondary" : "default"} onClick={() => acknowledge(a.id)} disabled={a.acknowledged}>
                    {t("acknowledge")}
                  </Button>
                  <Button className="h-10 px-4" variant={a.escalated ? "secondary" : "destructive"} onClick={() => escalate(a.id)} disabled={a.escalated}>
                    {t("escalate")}
                  </Button>
                  <Button className="h-10 px-4" variant="outline" onClick={() => alert("Auto e-FIR (mock) generated for " + a.touristId)}>
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
    </div>
  );
}
