import React from "react";

export const MapPlaceholder: React.FC<{ height?: number; children?: React.ReactNode }> = ({ height = 220, children }) => {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border bg-gradient-to-br from-secondary via-secondary/70 to-background"
      style={{ height }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-0 p-3 sm:p-4 lg:p-6">
        {children}
      </div>
    </div>
  );
};
