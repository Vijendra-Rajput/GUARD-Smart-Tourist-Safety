import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureModal } from "@/components/FeatureModal";
import { SCENARIOS, SCENARIO_KEYS } from "@/data/digital-twin-scenarios";
import { cn } from "@/lib/utils";

function useLocalStorage(key: string, initial: any) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState] as const;
}

function colorForRisk(risk: number) {
  if (risk <= 30) return "bg-emerald-500";
  if (risk <= 70) return "bg-amber-500";
  return "bg-red-600";
}

function RiskMeter({ risk }: { risk: number }) {
  const pct = Math.max(0, Math.min(100, risk));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>Risk</div>
        <div className="font-semibold">{pct}/100</div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2 overflow-hidden">
        <div
          className={cn("h-2 rounded-full transition-all duration-300", colorForRisk(pct))}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function AvatarCard({ risk, lastUpdated }: { risk: number; lastUpdated: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Safety Twin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">MT</div>
          <div>
            <div className="text-sm font-semibold">Guest Twin</div>
            <div className="text-xs text-muted-foreground">Last update: {lastUpdated}</div>
          </div>
        </div>

        <div className="mt-4">
          <RiskMeter risk={risk} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Stamina</div>
            <div className="font-semibold">78%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Battery</div>
            <div className="font-semibold">62%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Steps</div>
            <div className="font-semibold">1,234</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MapPanel({ markerPos, path, layer }: any) {
  // placeholder map: simple grid with neon roads
  return (
    <div className="relative bg-[#071027] rounded-md overflow-hidden h-72 md:h-[60vh] lg:h-[80vh]">
      <div
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#071027, #071027 24px, rgba(15,22,65,0.3) 24px, rgba(15,22,65,0.3) 25px)]"
        aria-hidden
      />

      {/* neon roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <g strokeWidth="0.6">
          <line x1="0" y1="20" x2="100" y2="20" stroke="#0f62fe" strokeOpacity="0.2" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#0f62fe" strokeOpacity="0.12" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="#0f62fe" strokeOpacity="0.12" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="#0f62fe" strokeOpacity="0.08" />
        </g>

        {/* path */}
        {path && (
          <polyline
            points={path.map((p: any) => `${p[0]},${p[1]}`).join(" ")}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />
        )}

        {/* avatar marker */}
        {markerPos && (
          <g>
            <circle cx={markerPos[0]} cy={markerPos[1]} r="1.2" fill="#4F46E5" />
            <circle cx={markerPos[0]} cy={markerPos[1]} r="2.2" fill="#4F46E5" opacity="0.12" />
          </g>
        )}
      </svg>

      {/* heat overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {layer === "Safe" && <div className="absolute inset-0 bg-emerald-600/6" />}
        {layer === "RiskingSoon" && <div className="absolute inset-0 bg-amber-500/12" />}
        {layer === "Unsafe" && <div className="absolute inset-0 bg-red-600/16" />}
      </div>
    </div>
  );
}

function ReasonsPanel({ reasons }: { reasons: { text: string; score: number; icon?: string }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center text-white text-sm">{r.icon || "!"}</div>
              <div>
                <div className="font-semibold">{r.text}</div>
                <div className="text-xs text-muted-foreground">Confidence: {r.score}%</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function DigitalTwin() {
  const [scenarioKey, setScenarioKey] = useState<typeof SCENARIO_KEYS[number]>(SCENARIO_KEYS[0]);
  const [hour, setHour] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [layer, setLayer] = useState<"Safe" | "RiskingSoon" | "Unsafe">("Safe");
  const [consent, setConsent] = useLocalStorage("dt-consent", { allowTracking: false, location: false, trust: false, ts: null });
  const [consentOpen, setConsentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [familyLink, setFamilyLink] = useState("");
  const [mockEmotion, setMockEmotion] = useState<string | null>(null);

  useEffect(() => {
    if (!consent || !consent.ts) setConsentOpen(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (playing) {
      interval = setInterval(() => {
        setHour((h) => {
          if (h >= 4) {
            setPlaying(false);
            return 4;
          }
          return h + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const scenario = SCENARIOS[scenarioKey];
  const current = scenario.hours[hour];

  // map placeholders
  const markerPos = [10 + hour * 16, 50];
  const path = [
    [10, 50],
    [20 + hour * 6, 48 - hour * 2],
    [40 + hour * 8, 46 - hour * 3],
    [60 + hour * 6, 44 - hour * 2],
  ];

  // reasons seeded
  const reasons = [
    { text: "Festival: high crowd density", score: Math.min(95, 30 + current.risk), icon: "🎉" },
    { text: "Recent local incidents: 2 in 48h", score: Math.min(90, 20 + current.risk), icon: "⚠️" },
    { text: "Weather alert: heavy", score: Math.min(85, 10 + current.risk), icon: "🌧️" },
  ];

  useEffect(() => {
    // set heat layer based on risk bands
    if (current.risk <= 30) setLayer("Safe");
    else if (current.risk <= 70) setLayer("RiskingSoon");
    else setLayer("Unsafe");
  }, [hour, scenarioKey]);

  function onPlayToggle() {
    setPlaying((p) => !p);
  }

  function onShare() {
    const link = `https://demo/track/${Date.now().toString(36)}`;
    setFamilyLink(link);
    setShareOpen(true);
  }

  function openExplain() {
    // placeholder show modal with explainability
    window.alert("Explainability:\n- Recent incidents near POI\n- Crowd density sensors\n- Weather alerts\n(Data sources: Map POI, Weather API, Local Police feed)");
  }

  function toggleEmotion() {
    const list = ["Calm", "Anxious", "Neutral"];
    setMockEmotion(list[Math.floor(Math.random() * list.length)]);
  }

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left / avatar & tabs */}
          <div className="md:col-span-1">
            <AvatarCard risk={current.risk} lastUpdated={new Date().toLocaleTimeString()} />

            <div className="mt-4 space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Scenario</label>
                    <select
                      className="w-full p-2 rounded-md border"
                      value={scenarioKey}
                      onChange={(e) => setScenarioKey(e.target.value as any)}
                    >
                      {SCENARIO_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {SCENARIOS[k].label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        aria-label="Simulate hours"
                        type="range"
                        min={0}
                        max={4}
                        value={hour}
                        onChange={(e) => setHour(Number(e.target.value))}
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-sm">+{hour}h</div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={onPlayToggle}>{playing ? "Stop" : "Play"}</Button>
                      <Button variant="outline" onClick={() => setHour(0)}>Reset</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Advisor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>Hydration reminder: Drink 200ml water</div>
                    <div>Steps today: 1,234</div>
                    <div>Phone battery: 62% — consider power bank</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Scam Prevention</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>Taxi overcharge — verify fare on meter</li>
                    <li>Fake guide offering paid entry — use official counter</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Modes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => alert("Silent Alarm (demo): Alert sent quietly")}>Silent Alarm</Button>
                    <Button variant="ghost" onClick={() => alert("Watch Me (demo): Timer started, family notified")}>Watch Me</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map area */}
          <div className="md:col-span-1 md:col-start-2 lg:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">Map</div>
                  <div className="text-xs text-muted-foreground">Placeholder map—no external API</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={cn("px-2 py-1 rounded-md text-sm", layer === "Safe" ? "bg-emerald-600 text-white" : "bg-slate-100")}
                    onClick={() => setLayer("Safe")}
                    aria-pressed={layer === "Safe"}
                  >
                    Safe
                  </button>
                  <button
                    className={cn("px-2 py-1 rounded-md text-sm", layer === "RiskingSoon" ? "bg-amber-500 text-white" : "bg-slate-100")}
                    onClick={() => setLayer("RiskingSoon")}
                    aria-pressed={layer === "RiskingSoon"}
                  >
                    RiskingSoon
                  </button>
                  <button
                    className={cn("px-2 py-1 rounded-md text-sm", layer === "Unsafe" ? "bg-red-600 text-white" : "bg-slate-100")}
                    onClick={() => setLayer("Unsafe")}
                    aria-pressed={layer === "Unsafe"}
                  >
                    Unsafe
                  </button>
                </div>
              </div>

              <MapPanel markerPos={markerPos} path={path} layer={layer} />

              <div className="flex gap-2">
                <Button onClick={() => alert("Safe Route (demo): alternative path shown")}>Safe Route Suggestion</Button>
                <Button onClick={() => alert("Marking as visiting (demo)")}>Mark As Visiting</Button>
                <Button onClick={onShare}>Share With Family</Button>
                <Button className="bg-red-600 text-white" onClick={() => alert("Panic (demo): mock alert sent")}>Panic</Button>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button aria-label="emotion" className="p-2 rounded-md border" onClick={toggleEmotion}>🎙️</button>
                <div className="text-sm">Emotion: {mockEmotion ?? "—"} <span className="text-xs text-muted-foreground">(Emotion analysis OFF in demo)</span></div>
              </div>
            </div>
          </div>

          {/* Right / reasons */}
          <div className="md:col-span-1 lg:col-span-1">
            <ReasonsPanel reasons={reasons} />

            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm">
                    <li>Location pinned</li>
                    <li>Photo stored (demo)</li>
                    <li>Blockchain hash created</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trust Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>Nearby Guardians: 4</div>
                  <div>Avg Rating: 4.5 / 5</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AR Overlay</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => alert("AR Preview (demo): overlay mock")}>Open AR Preview</Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Demo Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs">Use synthetic ML</label>
                    <input type="checkbox" />
                    <label className="text-xs">Show data sources</label>
                    <input type="checkbox" />
                    <Button variant="ghost" onClick={() => window.location.reload()}>Reset twin</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FeatureModal open={consentOpen} title="Consent" onClose={() => setConsentOpen(false)}>
        <div className="space-y-3">
          <p className="text-sm">This demo stores your consent locally only. No data leaves this device.</p>
          <div className="flex items-center gap-2">
            <input
              id="d1"
              type="checkbox"
              checked={consent.allowTracking}
              onChange={(e) => setConsent({ ...consent, allowTracking: e.target.checked })}
            />
            <label htmlFor="d1" className="text-sm">Allow health tracking</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="d2"
              type="checkbox"
              checked={consent.location}
              onChange={(e) => setConsent({ ...consent, location: e.target.checked })}
            />
            <label htmlFor="d2" className="text-sm">Allow location sharing</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="d3"
              type="checkbox"
              checked={consent.trust}
              onChange={(e) => setConsent({ ...consent, trust: e.target.checked })}
            />
            <label htmlFor="d3" className="text-sm">Join trust network</label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setConsent({ ...consent, ts: new Date().toISOString() });
                setConsentOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </FeatureModal>

      <FeatureModal open={shareOpen} title="Share With Family" onClose={() => setShareOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">Share this link with family (demo):</div>
          <div className="text-xs break-all bg-slate-100 p-2 rounded">{familyLink}</div>
          <div className="flex gap-2">
            <Button onClick={() => { navigator.clipboard?.writeText(familyLink); alert('Link copied (demo)'); }}>Copy</Button>
            <Button variant="outline" onClick={() => setShareOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>
    </div>
  );
}
