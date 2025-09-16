import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/i18n";
import { Chatbot } from "@/components/Chatbot";
import { PanicButton } from "@/components/PanicButton";
import HamburgerMenu from "@/components/HamburgerMenu";
import { FeatureModal } from "@/components/FeatureModal";
import Mockups from "@/pages/Mockups";
import { useAuth } from "@/context/auth";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 md:gap-4">
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F54db72644cde408b844f73b2e4d133f1%2F4b37b2a2e5d847de87e16f39d87d991c?format=webp&width=800"
        alt="GUARD logo"
        className="h-10 w-10 object-contain rounded-md shadow-inner"
      />
      <div className="leading-tight flex flex-col">
        <div className="text-base md:text-lg font-extrabold tracking-tight">
          GUARD
        </div>
        <div className="text-xs md:text-xs text-muted-foreground -mt-0.5">
          Smart Tourist Safety
        </div>
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
        <span className="font-medium">
          {langs.find((l) => l.code === lang)?.label ?? lang}
        </span>
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
                    lang === l.code
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
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

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t, setLang } = useI18n();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mockupsOpen, setMockupsOpen] = useState(false);
  const [mockupsTab, setMockupsTab] = useState<string | undefined>(undefined);

  // close menu on outside click
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest || !(document.getElementById("signin-btn")?.contains(target) || document.getElementById("signin-menu")?.contains(target))) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    const onOpenMockups = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev?.detail?.tab) setMockupsTab(ev.detail.tab);
      setMockupsOpen(true);
    };
    window.addEventListener("open-mockups", onOpenMockups as EventListener);
    const onSetLang = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev?.detail?.lang) {
        const apply = (lang: string) => {
          try {
            // access i18n via custom event handled below
            window.dispatchEvent(
              new CustomEvent("__set-lang-internal", { detail: { lang } }),
            );
          } catch (err) {}
        };
        apply(ev.detail.lang);
      }
    };
    window.addEventListener("set-lang", onSetLang as EventListener);

    // internal listener will be registered below in another effect
    return () => {
      window.removeEventListener(
        "open-mockups",
        onOpenMockups as EventListener,
      );
      window.removeEventListener("set-lang", onSetLang as EventListener);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev?.detail?.lang) {
        try {
          setLang(ev.detail.lang);
        } catch (err) {}
      }
    };
    window.addEventListener("__set-lang-internal", handler as EventListener);
    return () =>
      window.removeEventListener(
        "__set-lang-internal",
        handler as EventListener,
      );
  }, [setLang]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between gap-3 py-3">
          <Brand />
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )
              }
            >
              {t("touristView")}
            </NavLink>

            {/* Panic button alongside Tourist View on desktop */}
            <div className="ml-2">
              <PanicButton placement="header" />
            </div>

            {/* Digital Twin desktop link */}
            <NavLink
              to="/digital-twin"
              className={({ isActive }) =>
                cn(
                  "ml-2 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2",
                  isActive ? "bg-primary text-white" : "hover:bg-muted",
                )
              }
              title="Open Saarthi"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3 7v10a2 2 0 0 0 2 2h14V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 4h10v4H7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Saarthi</span>
            </NavLink>

            <button
              onClick={() =>
                window.dispatchEvent(new Event("open-inline-tracker"))
              }
              className="ml-2 inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground"
            >
              Track Panic Progress
            </button>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )
              }
            >
              Police Dashboard
            </NavLink>
            {/* AI Guide next to nav (desktop) */}
            {/* AI Guide removed from header per redesign */}
          </nav>

          <div className="flex items-center gap-2">
            <HamburgerMenu />
            {/* Panic visible on mobile header */}
            <div className="md:hidden flex items-center gap-2">
              <PanicButton placement="header" />
              <Link
                to="/digital-twin"
                aria-label="Open Saarthi"
                className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M3 7v10a2 2 0 0 0 2 2h14V7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 4h10v4H7z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Saarthi</span>
              </Link>
            </div>
            {/* hide AI Guide and LanguageSelect on header for mobile; they'll be in hamburger menu */}
            <div className="hidden md:block">
              <LanguageSelect />
            </div>
            {/* Sign In dropdown */}
            <div className="ml-3 relative">
              <button
                id="signin-btn"
                onClick={() => setMenuOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-white text-gray-900 shadow-sm hover:bg-[#f5f5f5] focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.632 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">Sign In</span>
              </button>

              {menuOpen && (
                <div
                  id="signin-menu"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
                  style={{ animation: "fadeIn 200ms ease" }}
                >
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm w-full text-gray-900 hover:bg-gray-100"
                    onClick={() => { setMenuOpen(false); /* sign in as guest */ login({ name: 'Guest', phone: '0000000000', consent: true }); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.632 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Sign in as Guest</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm w-full text-gray-900 hover:bg-gray-100"
                    onClick={() => { setMenuOpen(false); login({ name: 'Admin', phone: '0000000001', consent: true }); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3h3l-1 4h-2" />
                    </svg>
                    <span>Sign in as Admin</span>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm w-full text-red-600 font-bold hover:bg-red-100 hover:text-white"
                    onClick={() => { setMenuOpen(false); logout(); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            <OfflineBadge />
            {/* Mobile admin switch moved into hamburger menu; hidden in header */}
            <div className="hidden" />
          </div>
        </div>
      </header>
      <main className="w-full flex flex-col mx-auto py-6 px-4 sm:px-6 md:px-8">
        {children}
      </main>

      <FeatureModal
        open={mockupsOpen}
        title={
          mockupsTab
            ? mockupsTab === "forum"
              ? "Community Forum"
              : mockupsTab === "chat"
                ? "Real-time Chat"
                : "Guardian Gamification"
            : "Mockups"
        }
        onClose={() => setMockupsOpen(false)}
      >
        <Mockups />
      </FeatureModal>

      <footer className="mt-8 bg-gradient-to-tr from-sidebar to-background border-t">
        <div className="container py-10">
          <div className="grid gap-8 md:grid-cols-3 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F54db72644cde408b844f73b2e4d133f1%2F4b37b2a2e5d847de87e16f39d87d991c?format=webp&width=800"
                  className="h-10 w-10 object-contain rounded-md"
                  alt="GUARD"
                />
                <div>
                  <div className="text-lg font-extrabold">GUARD</div>
                  <div className="text-xs text-muted-foreground">
                    Smart Tourist Safety & Incident Response System
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Built as part of{" "}
                <span className="font-medium">Smart India Hackathon 2025</span>
              </div>
            </div>

            <div className="text-center">
              <nav aria-label="Footer Quick Links" className="mb-4">
                <ul className="flex flex-wrap items-center justify-center gap-3 text-sm">
                  {["Home", "Features", "Dashboard", "About", "Contact"].map(
                    (l, i) => (
                      <li key={l} className="inline-flex items-center gap-2">
                        <a
                          href="#"
                          className="text-sm text-slate-700 hover:text-primary hover:underline"
                        >
                          {l}
                        </a>
                        {i < 4 && (
                          <span className="text-muted-foreground">·</span>
                        )}
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium mb-2">
                Developed by{" "}
                <span className="font-semibold">
                  Team Rescue24, JEC Jabalpur
                </span>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {[
                  "Vijendra",
                  "Anushka",
                  "Diksha",
                  "Aman",
                  "Aman Kumar",
                  "Priyanshi",
                ]
                  .slice()
                  .sort((a, b) => a.localeCompare(b))
                  .map((n) => (
                    <li key={n} className="py-0.5">
                      {n}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t bg-gradient-to-r from-primary/10 to-transparent">
          <div className="container flex flex-col items-center justify-between gap-2 py-3 md:flex-row">
            <div className="text-xs text-muted-foreground">
              © 2025 GUARD · Built with <span aria-hidden>❤</span> by Students
            </div>
            <div className="text-xs text-muted-foreground">
              Disclaimer: Demo prototype, not for real emergency use.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
