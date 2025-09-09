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
import { FeatureModal } from "@/components/FeatureModal";
import { PanicTracker } from "@/components/PanicTracker";

export const PanicButton: React.FC<{ onConfirm?: () => void }> = ({ onConfirm }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const reportId = `REP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  const handleConfirm = () => {
    setSent(true);
    onConfirm?.();
    // show success modal
    setSuccessOpen(true);
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            aria-label={t("panic")}
            className="group relative grid size-20 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-destructive/40"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-destructive/40" />
            <span className="relative text-lg font-extrabold tracking-wide">{t("panic")}</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmPanicTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="text-sm font-medium">This will notify authorities and your emergency contacts immediately even if <span className="text-destructive font-semibold">OFFLINE</span></div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{sent ? t("sent") : t("panic")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FeatureModal open={successOpen} title="Panic Alert Sent" onClose={() => setSuccessOpen(false)}>
        <div className="space-y-4">
          <div className="text-sm">Panic Alert Successfully Sent to authorities.</div>
          <div className="flex gap-2">
            <Button onClick={() => { setTrackerOpen(true); setSuccessOpen(false); }}>Track the Request</Button>
            <Button variant="outline" onClick={() => setSuccessOpen(false)}>Thanks</Button>
          </div>
        </div>
      </FeatureModal>

      <FeatureModal open={trackerOpen} title="Track Request" onClose={() => setTrackerOpen(false)}>
        <PanicTracker id={reportId} />
      </FeatureModal>
    </div>
  );
};
