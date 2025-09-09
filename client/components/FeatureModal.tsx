import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const FeatureModal: React.FC<{
  open: boolean;
  title?: string;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
  center?: boolean;
}> = ({ open, title, onClose, className, children, center = false }) => {
  if (!open) return null;
  return (
    <div className={cn("fixed inset-0 z-50 p-4", center ? "flex items-center justify-center" : "flex items-start md:items-center justify-center")}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full max-w-3xl rounded-[20px] bg-card p-4 shadow-none max-h-[90vh] overflow-hidden flex flex-col justify-center items-center",
          !center ? "mt-3 md:mt-0 mx-auto" : "",
          className
        )}
        role="dialog"
        aria-modal="true"
        style={{ border: "0.8px ridge rgb(78, 195, 78)" }}
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <div className="mt-3 overflow-auto max-h-[72vh] w-full">{children}</div>
      </div>
    </div>
  );
};
