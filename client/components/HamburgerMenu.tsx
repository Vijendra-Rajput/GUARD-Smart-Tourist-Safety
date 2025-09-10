import React, { useEffect, useRef, useState } from "react";
import { Chatbot } from "@/components/Chatbot";
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
          {/* Mobile full-screen panel */}
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-3/4 bg-card p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setOpen(false)} className="px-2 py-1 rounded-md">Close</button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="font-medium mb-1">Navigation</div>
                  <ul role="list" className="space-y-2">
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
                </div>

                <div>
                  <div className="font-medium mb-1">Utilities</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium mb-1">Language</div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded-md border" onClick={() => { window.dispatchEvent(new CustomEvent('set-lang',{detail:{lang:'en'}})); setOpen(false); }}>English</button>
                        <button className="px-2 py-1 rounded-md border" onClick={() => { window.dispatchEvent(new CustomEvent('set-lang',{detail:{lang:'hi'}})); setOpen(false); }}>हिंदी</button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">AI Guide</div>
                      <Chatbot />
                    </div>

                    <div>
                      <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event('open-settings')); setOpen(false); }}>Settings</button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-medium mb-1">Feedback</div>
                  <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted" onClick={() => { window.dispatchEvent(new Event('open-feedback')); setOpen(false); }}>Share Feedback</button>
                </div>
              </div>
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
