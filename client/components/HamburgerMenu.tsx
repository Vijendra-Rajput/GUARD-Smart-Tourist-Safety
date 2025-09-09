import React, { useEffect, useRef, useState } from "react";

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
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-card p-2 shadow-lg">
          <div className="flex flex-col gap-2">
            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
              onClick={() => {
                window.dispatchEvent(new Event("open-kiosk"));
                setOpen(false);
              }}
            >
              Issue Digital ID (Kiosk)
            </button>

            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
              onClick={() => {
                window.dispatchEvent(new Event("open-emergency"));
                setOpen(false);
              }}
            >
              Emergency Access
            </button>

            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
              onClick={() => {
                window.dispatchEvent(new Event("open-settings"));
                setOpen(false);
              }}
            >
              Settings
            </button>

            <button
              className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted"
              onClick={() => {
                window.dispatchEvent(new Event("open-feedback"));
                setOpen(false);
              }}
            >
              Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
