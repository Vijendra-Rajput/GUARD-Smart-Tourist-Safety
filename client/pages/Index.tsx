import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockQR } from "@/components/MockQR";
import { SafetyScore } from "@/components/SafetyScore";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { PanicButton } from "@/components/PanicButton";
import { useI18n } from "@/context/i18n";

interface Tourist {
  id: string;
  name: string;
  phone: string;
  consent: boolean;
}

function useSafetyScore() {
  const [score, setScore] = useState(82);
  useEffect(() => {
    const id = setInterval(() => {
      setScore((s) => Math.max(0, Math.min(100, s + (Math.random() * 6 - 3))));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return Math.round(score);
}

export default function Index() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const safety = useSafetyScore();

  const [sharing, setSharing] = useState(false);
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);

  const touristId = useMemo(() => {
    if (!tourist) return "";
    return (
      tourist.name.trim().toLowerCase().replace(/\s+/g, "-") +
      "-" +
      tourist.phone.replace(/\D/g, "").slice(-4)
    );
  }, [tourist]);

  const crumbs = useMemo(() => {
    const now = new Date();
    const format = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return [
      { label: "Hotel", time: format(new Date(now.getTime() - 1000 * 60 * 45)) },
      { label: "Museum", time: format(new Date(now.getTime() - 1000 * 60 * 20)) },
      { label: "Cafe", time: format(new Date(now.getTime() - 1000 * 60 * 5)) },
    ];
  }, []);

  const itinerary = [
    { time: "09:00", title: "Old Fort", note: "Guided tour" },
    { time: "12:00", title: "City Museum", note: "Ticket QR in ID" },
    { time: "15:30", title: "Cafe Central", note: "Break" },
    { time: "18:00", title: "River Walk", note: "Geofenced area" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 grid gap-6">
        {!tourist ? (
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">{t("register")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="name">{t("name")}</label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amit Sharma" className="h-12 text-base" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" htmlFor="phone">{t("phone")}</label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-12 text-base" />
                </div>
              </div>
              <label className="inline-flex items-start gap-3 sm:col-span-2 select-none">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-5 accent-accent" />
                <span className="text-sm leading-tight">{t("consent")}</span>
              </label>
              <div className="sm:col-span-2">
                <Button
                  className="h-12 w-full text-base font-semibold"
                  disabled={!name || !phone || !consent}
                  onClick={() => setTourist({ id: crypto.randomUUID(), name, phone, consent })}
                >
                  {t("generateId")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("yourId")}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <MockQR value={tourist.id} />
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{tourist.name}</div>
                  <div className="text-sm text-muted-foreground">{tourist.phone}</div>
                  <div className="text-sm">
                    <span className="font-medium">ID:</span> {touristId}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                    Verified • Guardian Network
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="relative">
              <CardHeader>
                <CardTitle>{t("dashboard")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <SafetyScore score={safety} />
                <div>
                  <div className="mb-2 text-sm font-semibold">{t("breadcrumb")}</div>
                  <BreadcrumbTrail crumbs={crumbs} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("map")}</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPlaceholder trace={trace}>
                  <div className="absolute right-4 top-4 rounded-md bg-background/80 px-3 py-1 text-xs shadow">{t("map")}: City Center</div>
                  <div className="absolute left-6 top-12 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow outline outline-2 outline-white" />
                  <div className="absolute left-24 top-24 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow outline outline-2 outline-white" />
                </MapPlaceholder>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t("itinerary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {itinerary.map((it) => (
                  <div key={it.time} className="flex items-center justify-between rounded-md border bg-card/60 px-3 py-2">
                    <div>
                      <div className="text-sm font-semibold">{it.title}</div>
                      <div className="text-xs text-muted-foreground">{it.note}</div>
                    </div>
                    <div className="text-sm font-mono">{it.time}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-baseline justify-between">
                <CardTitle className="text-xl">{t("tagline")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                GUARD provides proactive safety for tourists with geofencing, emergency alerts, and privacy-first tracking.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fast QR-based identification</li>
                <li>Instant panic alerts</li>
                <li>Secure blockchain-backed audit</li>
              </ul>
            </CardContent>
          </Card>

          {tourist && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Real-time Tracking</div>
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="accent-primary size-5" id="rt" checked={sharing} onChange={(e) => setSharing(e.target.checked)} />
                    </label>
                  </div>
                  <div className="mt-3">
                    <Button size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href + "?share=" + touristId); }}>Share Temporary Link</Button>
                    <Button size="sm" variant="outline" className="ml-2">Privacy</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Devices & SMS</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* simple inline device list */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">WristBand Pro</div>
                        <div className="text-xs text-muted-foreground">Battery 78%</div>
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div className="font-mono">{touristId}</div>
                    <div className="text-xs text-muted-foreground mt-1">Last tx: 0x{Math.random().toString(16).slice(2, 12)}</div>
                    <div className="mt-3">
                      <Button size="sm" onClick={() => console.log("view proof")}>View Proof</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="default" onClick={() => setChatOpen(true)}>AI Pre-Trip Chat</Button>
                <Button variant="outline">Settings</Button>
              </div>
            </>
          )}
        </div>
      </aside>

      {tourist && <PanicButton onConfirm={() => console.log("panic sent for", touristId)} />}
    </div>
  );
}
