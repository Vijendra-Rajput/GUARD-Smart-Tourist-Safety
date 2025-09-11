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
  // Map uses a mock satellite image as background with overlayed svg paths and heat layers.
  const bg = "https://cdn.builder.io/api/v1/image/assets%2F54db72644cde408b844f73b2e4d133f1%2Fb5e8ea85976646bc87d3215c7c267687?format=webp&width=1200";
  return (
    <div className="relative bg-black rounded-md overflow-hidden h-72 md:h-[60vh] lg:h-[80vh]">
      <img src={bg} alt="map mock" className="absolute inset-0 w-full h-full object-cover opacity-90" />

      {/* dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" aria-hidden />

      {/* foreground SVG for paths and marker */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {/* subtle grid */}
        <defs>
          <linearGradient id="pathGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* winding path */}
        {path && (
          <polyline
            points={path.map((p: any) => `${p[0]},${p[1]}`).join(" ")}
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.95"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(79,70,229,0.35))' }}
          />
        )}

        {/* avatar marker */}
        {markerPos && (
          <g>
            <circle cx={markerPos[0]} cy={markerPos[1]} r="1.4" fill="#4F46E5" />
            <circle cx={markerPos[0]} cy={markerPos[1]} r="2.6" fill="#4F46E5" opacity="0.14" />
          </g>
        )}
      </svg>

      {/* heat overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {layer === "Safe" && <div className="absolute inset-0 bg-emerald-600/10 mix-blend-screen" />}
        {layer === "RiskingSoon" && <div className="absolute inset-0 bg-amber-500/14 mix-blend-screen" />}
        {layer === "Unsafe" && <div className="absolute inset-0 bg-red-600/16 mix-blend-screen" />}
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
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [visitingModalOpen, setVisitingModalOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [scamOpen, setScamOpen] = useState(false);
  const [quickModesOpen, setQuickModesOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [trustOpen, setTrustOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [demoControlsOpen, setDemoControlsOpen] = useState(false);
  const [altPath, setAltPath] = useState<number[][] | null>(null);
  const [currentPath, setCurrentPath] = useState<number[][] | null>(null);
  const [visitingMarkers, setVisitingMarkers] = useState<number[][]>([]);
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

  // map placeholders - generate a shorter, winding path with more turns to mimic realistic tourist path
  function generateWavyPath(h: number, segments = 6) {
    const baseX = 10;
    const baseY = 50;
    const pts: number[][] = [];
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);
      const x = baseX + t * (70) + (Math.sin((i + h) * 1.9) * 6);
      const y = baseY + Math.cos((i + h) * 2.3) * (6 + (i % 2 === 0 ? 3 : -3));
      pts.push([Math.max(2, Math.min(98, parseFloat(x.toFixed(2)))), Math.max(2, Math.min(98, parseFloat(y.toFixed(2))))]);
    }
    return pts;
  }
  const defaultPath = generateWavyPath(hour, 7);
  const path = currentPath ?? defaultPath;
  const markerPos = path && path.length ? path[0] : [10, 50];

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
                      <div className="text-sm">Scenario progress: <span className="font-semibold">Hour +{hour}</span></div>
                      <div className="ml-auto flex gap-2">
                        <Button onClick={onPlayToggle} aria-pressed={playing}>{playing ? "Stop" : "Play"}</Button>
                        <Button variant="outline" onClick={() => { setHour(0); setPlaying(false); setCurrentPath(null); }}>Reset</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* moved feature cards to horizontal strip below the map for compact layout */}
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
                    className={cn("px-2 py-1 rounded-md text-sm focus:outline focus:ring", layer === "RiskingSoon" ? "bg-amber-500 text-white" : "bg-slate-100")}
                    onClick={() => { setLayer("RiskingSoon"); }}
                    aria-pressed={layer === "RiskingSoon"}
                    aria-label="Show RiskingSoon heatmap"
                  >
                    RiskingSoon
                  </button>
                  <button
                    className={cn("px-2 py-1 rounded-md text-sm focus:outline focus:ring", layer === "Unsafe" ? "bg-red-600 text-white" : "bg-slate-100")}
                    onClick={() => { setLayer("Unsafe"); }}
                    aria-pressed={layer === "Unsafe"}
                    aria-label="Show Unsafe heatmap"
                  >
                    Unsafe
                  </button>
                </div>
              </div>

              <MapPanel markerPos={markerPos} path={path} layer={layer} altPath={altPath} visitingMarkers={visitingMarkers} />

              <div className="flex gap-2">
                <Button onClick={() => { const alt = generateWavyPath(hour+1,7).map(p=>[Math.min(96,p[0]+3),Math.min(96,p[1]+3)]); setAltPath(alt); setRouteModalOpen(true); }} aria-label="Safe route suggestion">Safe Route Suggestion</Button>
                <Button onClick={() => { setVisitingMarkers((m)=>[...m, path[path.length-1]]); setVisitingModalOpen(true); }} aria-label="Mark as visiting">Mark As Visiting</Button>
                <Button onClick={onShare} aria-label="Share with family">Share With Family</Button>
                <Button className="bg-red-600 text-white" onClick={() => { /* open existing panic UI */ window.dispatchEvent(new Event('open-panic-ui')); }} aria-label="Panic">Panic</Button>
              </div>

              {/* Horizontal feature strip below the map */}
              <div className="mt-4 overflow-x-auto">
                <div className="flex gap-4 py-2">
                  <div className="min-w-[220px]">
                    <Card className="bg-gradient-to-br from-sky-800/40 to-indigo-900/40">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md bg-sky-600 flex items-center justify-center text-white">💧</div>
                            <CardTitle className="text-sm">Personalized Advisor</CardTitle>
                          </div>
                          <div className="text-xs text-muted-foreground">Stamina</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Hydration reminder: Drink 200ml water<br/>Battery: 62% • Steps: 1,234</div>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setAdvisorOpen(true)}>Open</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card className="bg-gradient-to-br from-amber-700/10 to-amber-900/10">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-amber-500 flex items-center justify-center text-white">🚕</div>
                          <CardTitle className="text-sm">AI Scam Prevention</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm">
                          <li>Taxi overcharge — verify meter</li>
                          <li>Fake guide — use official counter</li>
                        </ul>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setScamOpen(true)}>View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card className="bg-gradient-to-br from-slate-800/20 to-slate-900/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-violet-600 flex items-center justify-center text-white">👀</div>
                          <CardTitle className="text-sm">Quick Modes</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => { setQuickModesOpen(true); }}>Silent Alarm</Button>
                          <Button variant="outline" onClick={() => { setQuickModesOpen(true); }}>Watch Me</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center text-white">⚠️</div>
                          <CardTitle className="text-sm">Why?</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Tap to see why this area is flagged.</div>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setWhyOpen(true)}>Explain</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-emerald-600 flex items-center justify-center text-white">📦</div>
                          <CardTitle className="text-sm">Automated Evidence</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Location pinned • Photo stored • Hash created</div>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setEvidenceOpen(true)}>View</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-sky-500 flex items-center justify-center text-white">🤝</div>
                          <CardTitle className="text-sm">Trust Network</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Nearby Guardians: 4 • Rating: 4.5/5</div>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setTrustOpen(true)}>Open</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-pink-600 flex items-center justify-center text-white">📸</div>
                          <CardTitle className="text-sm">AR Overlay</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Open AR preview (demo)</div>
                        <div className="mt-2">
                          <Button variant="ghost" onClick={() => setArOpen(true)}>Open</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="min-w-[220px]">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-gray-700 flex items-center justify-center text-white">⚙️</div>
                          <CardTitle className="text-sm">Demo Controls</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Use synthetic ML</label>
                          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Show data sources</label>
                          <Button variant="ghost" onClick={() => setDemoControlsOpen(true)}>Open</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
