import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/i18n";

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

function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-md border bg-background p-1 text-sm">
      {["en", "es", "hi"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l as any)}
          className={cn(
            "px-2.5 py-1.5 rounded-md",
            lang === l ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
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
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={({ isActive }) => cn("px-3 py-2 rounded-md text-sm font-medium", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{t("touristView")}</NavLink>
            <NavLink to="/admin" className={({ isActive }) => cn("px-3 py-2 rounded-md text-sm font-medium", isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{t("adminDashboard")}</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
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
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GUARD · Built for safer journeys
      </footer>
    </div>
  );
};
