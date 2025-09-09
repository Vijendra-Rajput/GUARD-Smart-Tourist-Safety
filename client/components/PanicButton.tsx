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

export const PanicButton: React.FC<{ onConfirm?: () => void }> = ({ onConfirm }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
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
              <div>{t("confirmPanicDesc")}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                This will notify authorities and your emergency contacts immediately even if{' '}
                <span className="inline-block px-1 rounded font-semibold text-white bg-gradient-to-r from-destructive to-accent">OFFLINE</span>
                .
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setSent(true);
                onConfirm?.();
                setTimeout(() => {
                  setOpen(false);
                  setSent(false);
                }, 1200);
              }}
            >
              {sent ? t("sent") : t("panic")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
