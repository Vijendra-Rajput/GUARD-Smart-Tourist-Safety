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
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2 overflow-hidden">
        <div
          className={cn(
            "h-3 rounded-full transition-all duration-700 bg-gradient-to-r",
            pct <= 30 ? "from-emerald-400 to-emerald-600" : pct <= 70 ? "from-amber-400 to-amber-600" : "from-red-400 to-red-700",
          )}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function RadialGauge({label, value, size=64, stroke=8}:{label:string,value:number,size?:number,stroke?:number}){
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const [anim, setAnim] = useState(0);
  useEffect(()=>{
    let raf: any;
    let start: number | null = null;
    const duration = 900;
    function step(ts:number){
      if (!start) start = ts;
      const t = Math.min(1, (ts-start)/duration);
      setAnim(Math.round(value * t));
      if (t<1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return ()=> cancelAnimationFrame(raf);
  },[value]);
  const dash = (anim/100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="block">
        <defs>
          <linearGradient id={`g-${label}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={radius} stroke="#e6e9ee" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={`url(#g-${label})`} strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={`${dash} ${circ-dash}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm font-semibold fill-current text-white" style={{fontSize: size/6}}>{anim}%</text>
      </svg>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function AvatarCard({ risk, lastUpdated }: { risk: number; lastUpdated: string }) {
  const pulseColor = risk<=30 ? 'from-emerald-400 to-emerald-600' : risk<=70 ? 'from-amber-400 to-amber-600' : 'from-red-400 to-red-600';
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>My Safety Twin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`absolute -inset-1 rounded-full blur-xl opacity-30 bg-gradient-to-r ${pulseColor} animate-pulse-slow`} aria-hidden />
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="3.2" fill="#fff" opacity="0.95" />
                <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" fill="#fff" opacity="0.9" />
              </svg>
            </div>
            {/* risk ring */}
            <svg className="absolute -bottom-1 -right-1" width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" stroke="#e6e6e6" strokeWidth="4" fill="none" />
              <circle cx="30" cy="30" r="26" strokeWidth="4" strokeLinecap="round" fill="none"
                stroke={risk<=30? '#10b981' : risk<=70? '#f59e0b' : '#ef4444'}
                strokeDasharray={`${(risk/100)*163} ${163 - (risk/100)*163}`} transform="rotate(-90 30 30)" className="transition-all duration-700" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="text-sm font-semibold">Guest Twin</div>
            <div className="text-xs text-muted-foreground">Last update: {lastUpdated}</div>
          </div>
        </div>

        <div className="mt-4">
          <RiskMeter risk={risk} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 items-center">
          <div className="flex flex-col items-center">
            <RadialGauge label="Stamina" value={78} />
          </div>
          <div className="flex flex-col items-center">
            <RadialGauge label="Battery" value={62} />
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

function MapPanel({ markerPos, path, layer, altPath, visitingMarkers }: any) {
  // Map uses a mock satellite image as background with overlayed svg paths and heat layers.
  const bg = "https://cdn.builder.io/api/v1/image/assets%2F54db72644cde408b844f73b2e4d133f1%2Fb5e8ea85976646bc87d3215c7c267687?format=webp&width=1200";
  return (
    <div className="relative bg-black rounded-md overflow-hidden h-64 md:h-[50vh] lg:h-[60vh]">
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
            className="dt-path"
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
            <circle cx={markerPos[0]} cy={markerPos[1]} r="3.2" fill="#4F46E5" opacity="0.12" className="dt-marker-pulse" />
            {/* breathing glow */}
            <circle cx={markerPos[0]} cy={markerPos[1]} r="5" fill="#4F46E5" opacity="0.08" className="animate-pulse-slow" />
          </g>
        )}
      </svg>

      {/* heat overlays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        {/* draw heat circles along the path */}
        {path && path.map((p:any,i:number)=>{
          const intensity = (1 - i / path.length) * 0.9;
          const color = layer === 'Safe' ? 'rgba(34,197,94,'+ (0.06+intensity*0.18) +')' : layer === 'RiskingSoon' ? 'rgba(245,158,11,'+(0.06+intensity*0.18)+')' : 'rgba(220,38,38,'+(0.06+intensity*0.18)+')';
          return (
            <circle key={i} cx={p[0]} cy={p[1]} r={3 + (i%3)} fill={color} style={{filter:'url(#blur)'}} />
          )
        })}

        {/* altPath heat or path overlay */}
        {altPath && altPath.length>0 && (
          <polyline
            points={altPath.map((p:any)=>p.join(',')).join(' ')}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.95"
            className="dt-altpath"
          />
        )}

        {/* visiting markers */}
        {visitingMarkers && visitingMarkers.map((p:any,idx:number)=>(
          <g key={idx}>
            <circle cx={p[0]} cy={p[1]} r={1.6} fill="#0ea5e9" />
            <circle cx={p[0]} cy={p[1]} r={3.2} fill="#0ea5e9" opacity="0.1" className="dt-marker-pulse" />
          </g>
        ))}
      </svg>
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
            <li key={i} className="flex flex-col fade-up" style={{animationDelay: `${i*80}ms`}}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center text-white text-sm">{r.icon || "!"}</div>
                <div className="flex-1">
                  <div className="font-semibold">{r.text}</div>
                  <div className="text-xs text-muted-foreground">Confidence: {r.score}%</div>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" style={{width: Math.max(6, Math.min(100, r.score)) + '%'}} />
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
  // parallel world simulation states
  const [simPath, setSimPath] = useState<number[][] | null>(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simPlaying, setSimPlaying] = useState(false);
  const [simBlocked, setSimBlocked] = useState(false);
  const [simData, setSimData] = useState({ crowd: 0, trust: 0, cctv: false, police: 0 });
  const [trustOpen, setTrustOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [demoControlsOpen, setDemoControlsOpen] = useState(false);
  const [parallelOpen, setParallelOpen] = useState(false);
  const [altPath, setAltPath] = useState<number[][] | null>(null);
  const [currentPath, setCurrentPath] = useState<number[][] | null>(null);
  const [visitingMarkers, setVisitingMarkers] = useState<number[][]>([]);
  const [consent, setConsent] = useLocalStorage("dt-consent", { allowTracking: false, location: false, trust: false, ts: null });
  const [consentOpen, setConsentOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [familyLink, setFamilyLink] = useState("");
  const [mockEmotion, setMockEmotion] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [quickModesMessage, setQuickModesMessage] = useState<string | null>(null);

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

  // memory log entries
  const memoryLog = [
    { title: 'Safe Experience: navigated Paharganj market with no incidents', date: 'Yesterday', color: 'bg-emerald-400' },
    { title: 'Risk Encountered: crowd density alert near Red Fort', date: '2 days ago', color: 'bg-red-400' },
    { title: 'Safe Experience: followed community-verified safe route', date: '3 days ago', color: 'bg-emerald-400' },
  ];

  useEffect(() => {
    // set heat layer based on risk bands
    if (current.risk <= 30) setLayer("Safe");
    else if (current.risk <= 70) setLayer("RiskingSoon");
    else setLayer("Unsafe");
  }, [hour, scenarioKey]);

  // simulation runner for Parallel World
  useEffect(()=>{
    let iv: any;
    if (simPlaying && simPath && simPath.length) {
      iv = setInterval(()=>{
        setSimIndex((i)=>{
          const next = i + 1;
          // predict risk ahead simplistically
          const riskAhead = current.risk + next * 3;
          if (riskAhead > 90) {
            setSimBlocked(true);
            setSimPlaying(false);
            return i;
          }
          // update sim data mock
          setSimData({
            crowd: Math.min(98, Math.round(40 + next * 3 + current.risk / 2)),
            trust: Math.max(10, Math.round(35 - next)),
            cctv: next % 3 === 0,
            police: Math.max(100, 500 - next * 12),
          });
          if (next >= (simPath?.length||0)-1) {
            setSimPlaying(false);
          }
          return Math.min(next, (simPath?.length||1)-1);
        });
      }, 600);
    }
    return ()=> clearInterval(iv);
  }, [simPlaying, simPath, current.risk]);

  function onPlayToggle() {
    setPlaying((p) => !p);
  }

  function onShare() {
    const link = `https://demo/track/${Date.now().toString(36)}`;
    setFamilyLink(link);
    setShareOpen(true);
  }

  // explainability is shown via modal (setWhyOpen)

  function toggleEmotion() {
    const list = ["Calm", "Anxious", "Neutral"];
    setMockEmotion(list[Math.floor(Math.random() * list.length)]);
  }

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col gap-3">
          {/* Left / avatar & tabs */}
          <div className="md:col-span-1 flex flex-col">
            <AvatarCard risk={current.risk} lastUpdated={new Date().toLocaleTimeString()} />

            <div className="mt-3">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Twin's Memory Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {memoryLog.map((m,i)=> (
                      <li key={i} className="flex items-start gap-3 fade-up" style={{animationDelay: `${i*90}ms`}}>
                        <div className={`${m.color} h-3 w-3 rounded-full mt-1`} />
                        <div>
                          <div className="text-sm font-medium">{m.title}</div>
                          <div className="text-xs text-muted-foreground">{m.date}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-3 space-y-2">
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

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button onClick={onPlayToggle} className="p-2 rounded-md bg-blue-600 text-white flex items-center justify-center" aria-pressed={playing} title="Play">
                          {playing ? '■' : '▶'}
                        </button>
                        <div className="text-sm">Hour <span className="font-semibold">+{hour}</span></div>
                      </div>
                      <input type="range" min={0} max={4} value={hour} onChange={(e)=>{ setHour(parseInt(e.target.value)); setCurrentPath(null); }} className="w-full mx-2" />
                      <Button variant="outline" onClick={() => { setHour(0); setPlaying(false); setCurrentPath(null); }}>Reset</Button>
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

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> <span>Safe</span></div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> <span>RiskingSoon</span></div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> <span>Unsafe</span></div>
                </div>
              </div>

              <MapPanel markerPos={markerPos} path={path} layer={layer} altPath={altPath} visitingMarkers={visitingMarkers} />

              {/* prominent quick mode buttons moved out of grid */}
              <div className="mt-2 flex gap-2 items-center">
                <Button variant="outline" onClick={() => setQuickModesOpen(true)}>Silent Alarm</Button>
                <Button variant="outline" onClick={() => setQuickModesOpen(true)}>Watch Me</Button>
              </div>

              <div className="flex gap-2">
                <Button className="bg-blue-600 text-white" onClick={() => { const alt = generateWavyPath(hour+1,7).map(p=>[Math.min(96,p[0]+3),Math.min(96,p[1]+3)]); setAltPath(alt); setRouteModalOpen(true); }} aria-label="Safe route suggestion">Safe Route Suggestion</Button>
                <Button variant="outline" onClick={() => { setVisitingMarkers((m)=>[...m, path[path.length-1]]); setVisitingModalOpen(true); }} aria-label="Mark as visiting">Mark As Visiting</Button>
                <Button variant="outline" onClick={onShare} aria-label="Share with family">Share With Family</Button>
                <Button variant="outline" onClick={() => setParallelOpen(true)} aria-label="Parallel World Simulation">Parallel World</Button>
                <Button className="bg-red-600 text-white" onClick={() => { /* open existing panic UI */ window.dispatchEvent(new Event('open-panic-ui')); }} aria-label="Panic">Panic</Button>
              </div>

              {/* Feature grid below the map (table-like) - updated hierarchy */}
              <div className="mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Personalized Advisor - larger */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gradient-to-br from-sky-700/20 to-indigo-900/10 card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-sky-600 flex items-center justify-center text-white text-lg">💧</div>
                        <div>
                          <CardTitle className="text-sm">Personalized Advisor</CardTitle>
                          <div className="text-xs text-muted-foreground">Next reminder: 12m</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2 relative">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Battery</div>
                          <div className="font-semibold">62%</div>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <div className="text-muted-foreground">Steps</div>
                          <div className="font-semibold">1,234</div>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <div className="text-muted-foreground">Hydration</div>
                          <div className="font-semibold">200ml due</div>
                        </div>
                        <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Scam Prevention */}
                  <div>
                    <Card className="bg-gradient-to-br from-amber-100 to-amber-50 card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-500 flex items-center justify-center text-white text-lg">🚕</div>
                        <div>
                          <CardTitle className="text-sm">AI Scam Prevention</CardTitle>
                          <div className="text-xs text-muted-foreground">Incidents (48h): 2 • Last: 1h ago</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2 relative">
                        <ul className="text-sm space-y-1">
                          <li>Suspicious taxis detected: 1</li>
                          <li>Reported fraudulent guides near POI: 0</li>
                          <li className="text-xs text-muted-foreground">Advice: Verify official counters and fares</li>
                        </ul>
                        <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AR Overlay */}
                  <div>
                    <Card className="card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-pink-600 flex items-center justify-center text-white text-lg">📸</div>
                        <div>
                          <CardTitle className="text-sm">AR Overlay</CardTitle>
                          <div className="text-xs text-muted-foreground">Hotspots: 5 • Camera: disconnected</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="text-sm">Preview AR overlays on camera (demo)</div>
                        <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Why? Explainability */}
                  <div>
                    <Card className="card-hover">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center text-white text-lg">⚠️</div>
                        <div>
                          <CardTitle className="text-sm">Why?</CardTitle>
                          <div className="text-xs text-muted-foreground">Top signals contributing to risk</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ul className="space-y-2">
                          {reasons.map((r,i)=> (
                            <li key={i} className="text-sm fade-up" style={{animationDelay: `${i*80}ms`}}>
                              <div className="flex items-center justify-between"><div className="font-medium">{r.text}</div><div className="text-xs text-muted-foreground">{r.score}%</div></div>
                              <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden"><div className="h-2 bg-red-500" style={{width: Math.max(8, Math.min(100, r.score)) + '%'}} /></div>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <Button variant="ghost" onClick={() => setWhyOpen(true)}>Explain</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Automated Evidence */}
                  <div>
                    <Card className="card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-lg">📦</div>
                        <div>
                          <CardTitle className="text-sm">Automated Evidence</CardTitle>
                          <div className="text-xs text-muted-foreground">Photos: 3 • Hash stored</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="text-sm">Last capture: 18m ago</div>
                        <div className="text-xs text-muted-foreground mt-1">Hash: a3f5...9b2c (demo)</div>
                        <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trust Network */}
                  <div>
                    <Card className="card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-sky-500 flex items-center justify-center text-white text-lg">🤝</div>
                        <div>
                          <CardTitle className="text-sm">Trust Network</CardTitle>
                          <div className="text-xs text-muted-foreground">Nearby: 4 �� Avg response: 3m</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="text-sm">Last guardian online: 2m ago</div>
                        <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Demo Controls */}
                  <div>
                    <Card className="card-hover relative">
                      <CardHeader className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center text-white text-lg">⚙️</div>
                        <div>
                          <CardTitle className="text-sm">Demo Controls</CardTitle>
                          <div className="text-xs text-muted-foreground">Reset & testing toggles</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Use synthetic ML</label>
                          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Show data sources</label>
                          <div className="mt-2">
                            <div className="absolute right-3 bottom-3 text-muted-foreground">→</div>
                          </div>
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
            <div className="mt-3">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Risk Score Personality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm">Risk Pulse corresponds to current risk bands</div>
                      <div className="text-xs text-muted-foreground mt-2">0-30: Green • 31-70: Orange • 71-100: Red</div>
                    </div>
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
          <div className="flex gap-2 items-center">
            <Button onClick={() => { navigator.clipboard?.writeText(familyLink); setShareCopied(true); setTimeout(()=>setShareCopied(false),2000); }}>Copy</Button>
            <Button variant="outline" onClick={() => setShareOpen(false)}>Close</Button>
            {shareCopied && <div className="text-sm text-emerald-600 ml-2">Copied</div>}
          </div>
        </div>
      </FeatureModal>

      {/* Route Modal */}
      <FeatureModal open={routeModalOpen} title="Safe Route Suggestion" onClose={() => setRouteModalOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">Preview alternative safe route (demo). You can apply this route to the map.</div>
          <div className="h-40 bg-slate-900/10 rounded p-2">Route preview shown on map overlay.</div>
          <div className="flex gap-2">
            <Button onClick={() => { setCurrentPath(altPath); setRouteModalOpen(false); }}>Apply Route</Button>
            <Button variant="outline" onClick={() => setRouteModalOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Visiting Modal */}
      <FeatureModal open={visitingModalOpen} title="Marking as Visiting" onClose={() => setVisitingModalOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">You've marked this destination as visiting. Family will be notified (demo)</div>
          <div className="flex gap-2">
            <Button onClick={() => setVisitingModalOpen(false)}>OK</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Advisor Modal */}
      <FeatureModal open={advisorOpen} title="Personalized Advisor" onClose={() => setAdvisorOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">Hydration plan, rest spots, and battery-saving tips (demo).</div>
          <div className="flex gap-2">
            <Button onClick={() => setAdvisorOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Scam Modal */}
      <FeatureModal open={scamOpen} title="AI Scam Prevention" onClose={() => setScamOpen(false)}>
        <div className="space-y-3">
          <ul className="text-sm">
            <li>Taxi overcharge — check meter</li>
            <li>Fake guide — pay at official counters</li>
          </ul>
          <div className="flex gap-2">
            <Button onClick={() => setScamOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Parallel World Simulation Modal */}
      <FeatureModal open={parallelOpen} title="Parallel World Simulation" onClose={() => { setParallelOpen(false); setSimPlaying(false); setSimPath(null); setSimIndex(0); setSimBlocked(false); }}>
        <div className="flex gap-4">
          <div className="w-2/3">
            <div className="h-64 bg-slate-900/10 rounded p-2 relative">
              <div className="text-sm text-muted-foreground">Map preview (demo)</div>
              {/* render sim path and avatar */}
              <svg viewBox="0 0 100 100" className="w-full h-44 mt-2">
                <polyline points={(simPath||[]).map(p=>p.join(',')).join(' ')} fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeLinecap="round" className={simPath? 'dt-altpath':''} />
                {simPath && simPath[simIndex] && (
                  <g>
                    <circle cx={simPath[simIndex][0]} cy={simPath[simIndex][1]} r="1.6" fill="#06b6d4" />
                    <circle cx={simPath[simIndex][0]} cy={simPath[simIndex][1]} r="2.8" fill="#06b6d4" opacity="0.12" className="dt-marker-pulse" />
                  </g>
                )}
                {simBlocked && (
                  <rect x="40" y="40" width="20" height="4" fill="#ef4444" opacity="0.95" />
                )}
              </svg>

              <div className="mt-2 flex gap-2">
                <Button onClick={() => {
                  const sp = generateWavyPath(hour+1, 20);
                  setSimPath(sp);
                  setSimIndex(0);
                  setSimBlocked(false);
                  setSimPlaying(true);
                }}>Start Simulation</Button>
                <Button variant="outline" onClick={() => { setSimPlaying(false); setSimPath(null); setSimIndex(0); }}>Stop</Button>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <div className="space-y-3">
              <div className="text-sm font-semibold">Simulation Analysis</div>
              <div className="p-2 bg-card rounded">
                <div className="flex items-center justify-between text-sm"><div>Crowd Density</div><div className="font-semibold">{simData.crowd}%</div></div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden"><div className="h-2 bg-amber-400" style={{width: simData.crowd + '%'}} /></div>
                <div className="flex items-center justify-between text-sm mt-2"><div>Community Trust</div><div className="font-semibold">{(simData.trust/10).toFixed(1)}/5</div></div>
                <div className="text-sm mt-1">CCTV: {simData.cctv ? 'Detected' : 'Not detected'}</div>
                <div className="text-sm mt-1">Nearest Police Booth: {simData.police}m</div>
                {simBlocked && <div className="mt-3 p-2 rounded bg-red-100 text-red-700 font-semibold">ALERT: Route Ahead Blocked Due to High Security Risk</div>}
              </div>
            </div>
          </div>
        </div>
      </FeatureModal>

      {/* Quick Modes Modal */}
      <FeatureModal open={quickModesOpen} title="Quick Modes" onClose={() => { setQuickModesOpen(false); setQuickModesMessage(null); }}>
        <div className="space-y-3">
          <div className="text-sm">Silent Alarm, Watch Mode and quick settings (demo)</div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => { setQuickModesMessage('Silent Alarm sent quietly (demo)'); }} aria-label="Silent Alarm">Silent Alarm</Button>
            <Button onClick={() => { setQuickModesMessage('Watch Me started — family notified (demo)'); }} aria-label="Watch Me">Watch Me</Button>
            {quickModesMessage && <div className="p-2 rounded bg-slate-100 text-sm text-muted-foreground">{quickModesMessage}</div>}
            <div className="flex gap-2 mt-2">
              <Button onClick={() => { setQuickModesMessage(null); setQuickModesOpen(false); }}>Close</Button>
            </div>
          </div>
        </div>
      </FeatureModal>

      {/* Why Modal */}
      <FeatureModal open={whyOpen} title="Explainability" onClose={() => setWhyOpen(false)}>
        <div className="space-y-3">
          <ul className="text-sm">
            <li>Recent incidents near POI — local police reports</li>
            <li>High crowd density — aggregated sensor data</li>
            <li>Weather alert — public weather feed</li>
          </ul>
          <div className="flex gap-2">
            <Button onClick={() => setWhyOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Evidence Modal */}
      <FeatureModal open={evidenceOpen} title="Automated Evidence" onClose={() => setEvidenceOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">Logs: Location pinned, photo stored, blockchain hash (demo)</div>
          <div className="flex gap-2">
            <Button onClick={() => setEvidenceOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Trust Modal */}
      <FeatureModal open={trustOpen} title="Trust Network" onClose={() => setTrustOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">Nearby guardians profiles (demo)</div>
          <div className="flex gap-2">
            <Button onClick={() => setTrustOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* AR Modal */}
      <FeatureModal open={arOpen} title="AR Overlay" onClose={() => setArOpen(false)}>
        <div className="space-y-3">
          <div className="text-sm">AR Overlay mock preview (icons overlayed on camera) — demo only.</div>
          <div className="flex gap-2">
            <Button onClick={() => setArOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>

      {/* Demo Controls Modal */}
      <FeatureModal open={demoControlsOpen} title="Demo Controls" onClose={() => setDemoControlsOpen(false)}>
        <div className="space-y-3">
          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Use synthetic ML</label>
          <label className="text-xs flex items-center gap-2"><input type="checkbox" /> Show data sources</label>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => window.location.reload()}>Reset twin</Button>
            <Button variant="outline" onClick={() => setDemoControlsOpen(false)}>Close</Button>
          </div>
        </div>
      </FeatureModal>
    </div>
  );
}
