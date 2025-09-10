import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/MapPlaceholder";

export const PanicTracker: React.FC<{ id?: string }> = ({ id }) => {
  const steps = [
    {
      key: "received",
      label: "Report received by Call Center",
      eta: "—",
      status: "completed",
      time: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      key: "police",
      label: "Police notified",
      eta: "5-8 mins",
      status: "in_progress",
      time: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      key: "rescue",
      label: "Rescue team dispatched",
      eta: "12-18 mins",
      status: "pending",
      time: null,
    },
    {
      key: "medics",
      label: "Medics en route",
      eta: "15-20 mins",
      status: "pending",
      time: null,
    },
    {
      key: "fir",
      label: "e-FIR filed",
      eta: "—",
      status: "pending",
      time: null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold">
            Panic Alert Successfully Sent
          </h4>
          <div className="text-sm text-muted-foreground">
            Report ID: <span className="font-mono">{id ?? "N/A"}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          ETA: <span className="font-semibold">~15 mins</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-2">
                <div
                  className={`h-2 w-2 rounded-full ${s.status === "completed" ? "bg-accent" : s.status === "in_progress" ? "bg-primary" : "bg-muted"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.eta}</div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted/40">
                  <div
                    className={`h-2 rounded-full ${s.status === "completed" ? "bg-accent" : s.status === "in_progress" ? "bg-primary" : "bg-muted/60"}`}
                    style={{
                      width:
                        s.status === "completed"
                          ? "100%"
                          : s.status === "in_progress"
                            ? "45%"
                            : "8%",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Map Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <MapPlaceholder height={140}>
              <div className="absolute left-6 top-12 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive shadow outline outline-2 outline-white" />
            </MapPlaceholder>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Units</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Police Unit 12</div>
                  <div className="text-xs text-muted-foreground">
                    ETA: 6 mins
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Vehicle • 4 pax
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Rescue Team A</div>
                  <div className="text-xs text-muted-foreground">
                    ETA: 14 mins
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Ambulance • 3 pax
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground">
        This tracker is a mock UI showing simulated progress from rescue
        management, police and medics.
      </div>
    </div>
  );
};
