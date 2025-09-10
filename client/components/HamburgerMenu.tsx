import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted"
      >
        <span className="sr-only">Open menu</span>
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* Mobile inline panel that pushes content down */}
          <div className="md:hidden w-full">
            <div className="w-full bg-card p-3 shadow rounded-b-md mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setOpen(false)} className="px-2 py-1 rounded-md text-sm">Close</button>
              </div>

              <nav aria-label="Mobile menu">
                <ul role="list" className="flex flex-col gap-2">
                  <li>
                    <Link to="/" onClick={() => setOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted">Tourist View</Link>
                  </li>
                  <li>
                    <Link to="/admin" onClick={() => setOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted">Admin Dashboard</Link>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event('open-inline-tracker')); setOpen(false); }}>Track Panic Progress</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent('open-mockups',{detail:{tab:'forum'}})); setOpen(false); }}>Community Forum</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent('open-mockups',{detail:{tab:'chat'}})); setOpen(false); }}>Real-time Chat</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent('open-mockups',{detail:{tab:'gamification'}})); setOpen(false); }}>Guardian Gamification</button>
                  </li>
                </ul>

                <div className="mt-4 border-t pt-3">
                  <div className="text-sm font-medium mb-2">Language</div>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded-md border" onClick={() => { window.dispatchEvent(new CustomEvent('set-lang',{detail:{lang:'en'}})); setOpen(false); }}>English</button>
                    <button className="px-2 py-1 rounded-md border" onClick={() => { window.dispatchEvent(new CustomEvent('set-lang',{detail:{lang:'hi'}})); setOpen(false); }}>हिंदी</button>
                  </div>
                </div>

                <div className="mt-3">
                  <button className="w-full text-left px-3 py-2 rounded-md text-sm bg-accent text-accent-foreground" onClick={() => { window.dispatchEvent(new Event('open-ai-guide')); setOpen(false); }}>AI Guide</button>
                </div>

                <div className="mt-3">
                  <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event('open-settings')); setOpen(false); }}>Settings</button>
                </div>

                <div className="mt-2">
                  <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event('open-feedback')); setOpen(false); }}>Share Feedback</button>
                </div>
              </nav>
            </div>
          </div>

          {/* Desktop dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-card p-2 shadow-lg hidden md:block">
            <div className="flex flex-col gap-2">
              <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent("open-mockups", { detail: { tab: "forum" } })); setOpen(false); }}>Community Forum</button>

              <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent("open-mockups", { detail: { tab: "chat" } })); setOpen(false); }}>Real-time Chat</button>

              <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new CustomEvent("open-mockups", { detail: { tab: "gamification" } })); setOpen(false); }}>Guardian Gamification</button>

              <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event("open-settings")); setOpen(false); }}>Settings</button>

              <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event("open-feedback")); setOpen(false); }}>Feedback</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
