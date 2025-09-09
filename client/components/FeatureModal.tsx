import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const FeatureModal: React.FC<{
  open: boolean;
  title?: string;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ open, title, onClose, className, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn("relative z-10 w-full max-w-3xl mt-16 md:mt-0 rounded-lg bg-card p-4 shadow-lg max-h-[90vh] overflow-hidden", className)} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div className="mt-3 overflow-auto max-h-[72vh]">{children}</div>
      </div>
    </div>
  );
};
