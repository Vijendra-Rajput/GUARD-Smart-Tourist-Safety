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
  const reportId = `REP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  const handleConfirm = () => {
    setSent(true);
    onConfirm?.();
    // notify app of sent panic with report id
    window.dispatchEvent(new CustomEvent("panic-sent", { detail: { id: reportId } }));

    // show non-modal toast notification at bottom
    toast({
      title: (
        <span>
          Panic reported <span className="text-green-600 font-semibold">successfully ✅</span>
        </span>
      ),
      description: "Authorities and your emergency contacts have been notified.",
    });

    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 400);
  };

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
              <AlertDialogAction onClick={handleConfirm}>{sent ? t("sent") : t("panic")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <FeatureModal open={successOpen} title="Panic Alert Sent" onClose={() => setSuccessOpen(false)} center={true}>
        <div className="space-y-4">
          <div className="text-sm">Panic Alert Successfully Sent to authorities.</div>
          <div className="flex gap-2">
            <Button onClick={() => { window.dispatchEvent(new Event("open-inline-tracker")); setSuccessOpen(false); }}>Track the Request</Button>
            <Button variant="outline" onClick={() => setSuccessOpen(false)}>Thanks</Button>
          </div>
        </div>
      </FeatureModal>
    </>
  );
};
