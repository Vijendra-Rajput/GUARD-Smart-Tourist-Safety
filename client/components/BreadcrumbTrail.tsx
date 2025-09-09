import React from "react";

export interface Crumb { label: string; time: string }

export const BreadcrumbTrail: React.FC<{ crumbs: Crumb[] }> = ({ crumbs }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow">
            {c.label}
          </div>
          <span className="text-xs text-muted-foreground">{c.time}</span>
          {i < crumbs.length - 1 && <span className="mx-1 text-muted-foreground">›</span>}
        </div>
      ))}
    </div>
  );
};
