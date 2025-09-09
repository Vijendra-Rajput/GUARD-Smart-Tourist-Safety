import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/i18n";
import { Chatbot } from "@/components/Chatbot";
import { PanicButton } from "@/components/PanicButton";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="relative size-8 rounded-md bg-gradient-to-br from-primary to-accent shadow-inner">
        <span className="absolute inset-0 m-auto size-2 rounded-sm bg-white/90" />
      </div>
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight">GUARD</div>
        <div className="text-xs text-muted-foreground -mt-1">Smart Tourist Safety</div>
      </div>
    </Link>
  );
}

function OfflineBadge() {
  const { t } = useI18n();
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (online) return null;
  return (
    <div className="ml-2 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-xs font-semibold shadow">
      {t("offline")}
    </div>
  );
}

function LanguageSelect() {
  const { lang, setLang, langs } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-md border bg-background px-3 py-1 text-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="font-medium">{langs.find((l) => l.code === lang)?.label ?? lang}</span>
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-md border bg-card p-2 shadow-lg">
          <ul role="listbox" className="max-h-60 overflow-auto">
            {langs.map((l) => (
              <li key={l.code} role="option">
                <button
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm",
                    lang === l.code ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useI18n();
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Brand />
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => cn("px-3 py-2 rounded-md text-sm font-medium", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              {t("touristView")}
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => cn("px-3 py-2 rounded-md text-sm font-medium", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              {t("adminDashboard")}
            </NavLink>
            {/* AI Guide next to nav (desktop) */}
            <div className="ml-2 hidden md:block">
              <Chatbot />
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <PanicButton placement="header" />
            {/* AI Guide (mobile) */}
            <div className="md:hidden">
              <Chatbot />
            </div>
            <LanguageSelect />
            <OfflineBadge />
            <Button asChild className="md:hidden">
              <Link to={location.pathname === "/admin" ? "/" : "/admin"}>
                {location.pathname === "/admin" ? t("touristView") : t("adminDashboard")}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-6 md:py-8 lg:py-10">{children}</main>
      <footer className="mt-8 bg-gradient-to-tr from-sidebar to-background border-t">
        <div className="container py-10">
          <div className="grid gap-8 md:grid-cols-3 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">G</div>
                <div>
                  <div className="text-lg font-extrabold">GUARD</div>
                  <div className="text-xs text-muted-foreground">Smart Tourist Safety & Incident Response System</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Built as part of <span className="font-medium">Smart India Hackathon 2025</span></div>
            </div>

            <div className="text-center">
              <nav aria-label="Footer Quick Links" className="mb-4">
                <ul className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  {['Home','Features','Dashboard','About','Contact'].map((l, i) => (
                    <li key={l} className="inline-flex items-center gap-2">
                      <a href="#" className="text-sm text-slate-700 hover:text-primary hover:underline">{l}</a>
                      {i < 4 && <span className="text-muted-foreground">·</span>}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="text-sm">Contact: <a href="mailto:touristsafety@collegehackathon.in" className="text-primary hover:underline">touristsafety@collegehackathon.in</a></div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium mb-2">👨‍💻 Developed by <span className="font-semibold">College Hackathon Team</span></div>
              <div className="flex flex-wrap justify-end gap-2">
                {['Vijendra','Anushka','Diksha','Aman','Aman Kumar','Priyanshi'].map((n) => (
                  <div key={n} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/80 to-accent/70 px-3 py-1 text-white text-sm shadow-sm">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{n.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                    <div className="whitespace-nowrap">{n}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t bg-gradient-to-r from-primary/10 to-transparent">
          <div className="container flex flex-col items-center justify-between gap-2 py-3 md:flex-row">
            <div className="text-xs text-muted-foreground">© 2025 GUARD · Built with <span aria-hidden>❤</span> by Students</div>
            <div className="text-xs text-muted-foreground">Disclaimer: Demo prototype, not for real emergency use.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
