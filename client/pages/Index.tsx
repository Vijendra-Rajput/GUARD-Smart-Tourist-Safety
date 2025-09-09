import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockQR } from "@/components/MockQR";
import { SafetyScore } from "@/components/SafetyScore";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import { PanicButton } from "@/components/PanicButton";
import { useI18n } from "@/context/i18n";
import { Chatbot } from "@/components/Chatbot";
import { DevicesPanel } from "@/components/DevicesPanel";
import { BlockchainProof } from "@/components/BlockchainProof";
import { FeatureModal } from "@/components/FeatureModal";

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

// Location widget component (in-file for simplicity)
const LOCATIONS: Record<string, any> = {
  Manali: {
    title: "Manali, Himachal Pradesh",
    about: "Mountain town in the Himalayas, popular for trekking and scenic views.",
    mustVisit: ["Hadimba Temple", "Solang Valley", "Rohtang Pass"],
    mustTry: ["Sidu", "Tibetan bread", "Local trout"],
    hotels: ["Snow View Cottage", "Hotel Manali Heights", "Riverdale"],
    rescue: { name: "Himachal Rescue 5", eta: "15-25 mins", contact: "+91 181 123456" },
    rates: { avgMeal: "₹200-700", taxiPerKm: "₹20-40" },
  },
  Guwahati: {
    title: "Guwahati, Assam",
    about: "Gateway to Northeast India, rich culture and riverfronts.",
    mustVisit: ["Kamakhya Temple", "Assam State Zoo", "Umananda Island"],
    mustTry: ["Assam tea", "Pitha", "Fish curry"],
    hotels: ["Hotel Brahmaputra", "The Gateway" , "City Inn"],
    rescue: { name: "Assam Emergency", eta: "8-15 mins", contact: "+91 361 654321" },
    rates: { avgMeal: "₹150-500", taxiPerKm: "₹15-30" },
  },
  Meghalaya: {
    title: "Meghalaya (Shillong)",
    about: "Lush hills, waterfalls and living root bridges nearby.",
    mustVisit: ["Cherrapunji", "Nohkalikai Falls", "Living Root Bridges"],
    mustTry: ["Jadoh", "Tungrymbai", "Local pumpkin delicacy"],
    hotels: ["Hilltop Retreat", "Meghalaya Inn", "Cloud View"],
    rescue: { name: "Meghalaya Rescue", eta: "20-35 mins", contact: "+91 364 987654" },
    rates: { avgMeal: "₹180-600", taxiPerKm: "₹20-45" },
  },
};

function pickLocationForUser(name?: string) {
  if (!name) return "Manali";
  const keys = Object.keys(LOCATIONS);
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
  return keys[Math.abs(h) % keys.length];
}

function LocationWidget({ itinerary }: { itinerary: any[] }) {
  const [selected, setSelected] = useState<string>(Object.keys(LOCATIONS)[0]);
  const info = LOCATIONS[selected];

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{info.title}</div>
          <div className="text-xs text-muted-foreground">{info.about}</div>
        </div>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
          {Object.keys(LOCATIONS).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border bg-card/60 p-3">
          <div className="text-sm font-semibold">Places to visit</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {info.mustVisit.map((p: string) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border bg-card/60 p-3">
          <div className="text-sm font-semibold">Must try</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {info.mustTry.map((p: string) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border bg-card/60 p-3">
          <div className="text-sm font-semibold">Nearest Hotels</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {info.hotels.map((p: string) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-md border bg-card/60 p-3">
          <div className="text-sm font-semibold">Nearest Rescue</div>
          <div className="mt-2 text-sm">{info.rescue.name}</div>
          <div className="text-xs text-muted-foreground">ETA: {info.rescue.eta} • Contact: {info.rescue.contact}</div>
        </div>
      </div>

      <div className="rounded-md border bg-card/60 p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Price Rates</div>
          <div className="text-xs text-muted-foreground">Estimates</div>
        </div>
        <div className="mt-2 text-sm">Avg meal: {info.rates.avgMeal} • Taxi per km: {info.rates.taxiPerKm}</div>
      </div>

      <div className="rounded-md border bg-card/60 p-3">
        <div className="text-sm font-semibold">Itinerary</div>
        <div className="mt-2 space-y-2">
          {itinerary.map((it) => (
            <div key={it.time} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.note}</div>
              </div>
              <div className="text-sm font-mono">{it.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [tourist, setTourist] = useState<Tourist | null>(null);
  const [locationPreset, setLocationPreset] = useState<string | null>(null);
  const safety = useSafetyScore();

  const [sharing, setSharing] = useState(false);
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // simulate real-time trace when sharing is enabled
  useEffect(() => {
    if (!sharing) return;
    setTrace([]);
    let i = 0;
    const id = setInterval(() => {
      i++;
      const tpos = { x: 0.1 + Math.random() * 0.8, y: 0.15 + Math.random() * 0.7 };
      setTrace((p) => [...p, tpos].slice(-20));
      if (i > 120) {
        // stop after some time
        clearInterval(id);
        setSharing(false);
      }
    }, 1200);
    return () => clearInterval(id);
  }, [sharing]);

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
                  onClick={() => {
                    const newTourist = { id: crypto.randomUUID(), name, phone, consent };
                    setTourist(newTourist);
                    setLocationPreset(pickLocationForUser(name));
                  }}
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
                <div className="flex items-center justify-between w-full">
                  <CardTitle>{t("itinerary")}</CardTitle>
                  <div className="text-sm text-muted-foreground">Where am I?</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location selector & info merged with itinerary */}
                <LocationWidget itinerary={itinerary} />
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
                    <Button size="sm" onClick={() => setShareOpen(true)}>Share Temporary Link</Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => setSettingsOpen(true)}>Privacy</Button>
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
                      <Button size="sm" variant="outline" onClick={() => setDevicesOpen(true)}>Manage</Button>
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
                      <Button size="sm" onClick={() => setProofOpen(true)}>View Proof</Button>
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

      {/* Feature Modals */}
      <FeatureModal open={proofOpen} title="Blockchain Proof" onClose={() => setProofOpen(false)}>
        {tourist ? <BlockchainProof id={tourist.id} /> : <div className="text-sm text-muted-foreground">No tourist selected</div>}
      </FeatureModal>

      <FeatureModal open={devicesOpen} title="Manage Devices & SMS" onClose={() => setDevicesOpen(false)}>
        <DevicesPanel />
      </FeatureModal>

      <FeatureModal open={shareOpen} title="Share Temporary Link" onClose={() => setShareOpen(false)}>
        <div className="text-sm">
          <p className="mb-2">Share this temporary tracking link with family or emergency contacts:</p>
          <div className="flex items-center gap-2">
            <input readOnly value={tourist ? window.location.href + "?share=" + touristId : ""} className="flex-1 rounded-md border px-3 py-2 font-mono text-xs" />
            <Button onClick={() => navigator.clipboard?.writeText(tourist ? window.location.href + "?share=" + touristId : "")}>Copy</Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Link expires in 2 hours (mock)</div>
        </div>
      </FeatureModal>

      <FeatureModal open={settingsOpen} title="Privacy Settings" onClose={() => setSettingsOpen(false)}>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>Share real-time location</div>
            <input type="checkbox" className="size-5" checked={sharing} onChange={(e) => setSharing(e.target.checked)} />
          </div>
          <div className="flex items-center justify-between">
            <div>Allow SMS fallback</div>
            <input type="checkbox" className="size-5" defaultChecked />
          </div>
          <div className="text-xs text-muted-foreground">These are mock settings for the demo.</div>
        </div>
      </FeatureModal>

      {/* Chatbot modal */}
      <div className="fixed left-4 bottom-6 z-40">
        <Chatbot />
      </div>

    </div>
  );
}
