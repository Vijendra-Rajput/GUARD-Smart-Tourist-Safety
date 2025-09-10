import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const PanicButton: React.FC<{ onConfirm?: () => void; placement?: "bottom" | "header" }> = ({ onConfirm, placement = "bottom" }) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [progress, setProgress] = useState(0);
  const pressRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);
  const reportId = `REP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const DURATION = 1500; // ms to hold

  useEffect(() => {
    // inject keyframes once
    if (typeof window === "undefined") return;
    if ((window as any).__panic_keyframes_injected) return;
    const style = document.createElement("style");
    style.innerHTML = `@keyframes pulse-animation {0%{transform:scale(1);box-shadow:0 0 12px rgba(220,38,38,0.7);}50%{transform:scale(1.05);box-shadow:0 0 20px rgba(220,38,38,1);}100%{transform:scale(1);box-shadow:0 0 12px rgba(220,38,38,0.7);}}`;
    document.head.appendChild(style);
    (window as any).__panic_keyframes_injected = true;
  }, []);

  const triggerPanic = () => {
    setSent(true);
    onConfirm?.();
    window.dispatchEvent(new CustomEvent("panic-sent", { detail: { id: reportId } }));
    toast({
      title: (
        <span>
          Panic reported <span style={{ color: "#16A34A", fontWeight: 600 }}>successfully ✅</span>
        </span>
      ),
      description: "Authorities and your emergency contacts have been notified.",
    });
  };

  const startHold = () => {
    if (sent) return;
    startRef.current = performance.now();
    const loop = (now: number) => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      if (p >= 1) {
        // complete
        cancelHold();
        triggerPanic();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const cancelHold = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setProgress(0);
  };

  // handler for header placement (press-and-hold UI)
  if (placement === "header") {
    return (
      <div className="inline-block">
        <div
          role="button"
          aria-pressed={sent}
          onMouseDown={(e) => {
            e.preventDefault();
            startHold();
          }}
          onMouseUp={() => cancelHold()}
          onMouseLeave={() => cancelHold()}
          onTouchStart={(e) => {
            e.preventDefault();
            startHold();
          }}
          onTouchEnd={() => cancelHold()}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-md text-white font-bold shadow-lg select-none",
            sent ? "bg-[#4F46E5]" : "bg-[#DC2626]",
            sent ? "" : "animate-[pulse-animation_2.5s_infinite_ease-in-out] hover:scale-110",
          )}
          style={{ boxShadow: sent ? "0 0 8px rgba(79,70,229,0.3)" : "0 0 12px rgba(220,38,38,0.7)" }}
        >
          <span className="text-lg">{sent ? "✅" : "🚨"}</span>
          <span className="uppercase">{sent ? "ALERT SENT" : "PANIC"}</span>

          {/* radial progress */}
          {!sent && (
            <svg className="absolute -inset-1 h-[46px] w-[46px] pointer-events-none" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="20" stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill="none" />
              <circle
                cx="22"
                cy="22"
                r="20"
                stroke="#ffffff"
                strokeWidth="4"
                fill="none"
                strokeDasharray={126}
                strokeDashoffset={126 - 126 * progress}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
              />
            </svg>
          )}

        </div>
      </div>
    );
  }

  // bottom placement uses existing AlertDialog confirmation flow
  const triggerButton = (
    <button
      aria-label={t("panic")}
      className={cn(
        "relative grid place-items-center shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-destructive/40",
        placement === "bottom"
          ? "size-20 rounded-full bg-destructive text-destructive-foreground"
          : "rounded-lg px-3 py-1 bg-destructive text-white panic-3d panic-blink"
      )}
    >
      {placement === "bottom" ? (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/40" />
          <span className="relative text-lg font-extrabold tracking-wide">{t("panic")}</span>
        </>
      ) : (
        <span className="text-sm font-semibold">{t("panic")}</span>
      )}
    </button>
  );

  return (
    <>
      <div className={placement === "bottom" ? "fixed bottom-6 right-6 z-50" : "inline-block"}>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmPanicTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="text-sm font-medium">This will notify authorities and your emergency contacts immediately even if <span className="text-destructive font-semibold">OFFLINE</span></span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => { triggerPanic(); setOpen(false); }}>{sent ? t("sent") : t("panic")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </>
  );
};
