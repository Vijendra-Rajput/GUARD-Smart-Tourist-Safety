import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DevicesPanel: React.FC = () => {
  const [devices] = useState(() => [
    { id: "w-001", name: "WristBand Pro", battery: 78 },
    { id: "w-002", name: "Lanyard Beacon", battery: 56 },
  ]);
  const [sms] = useState(() => [
    { id: 1, to: "+91 99999 00001", body: "Fallback: I need help", time: Date.now() - 1000 * 60 * 30 },
    { id: 2, to: "+91 99999 00002", body: "Auto alert triggered", time: Date.now() - 1000 * 60 * 5 },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices & SMS Fallback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-2">
          {devices.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-md border p-2">
              <div>
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-muted-foreground">ID: {d.id}</div>
              </div>
              <div className="text-sm">Battery: {d.battery}%</div>
            </div>
          ))}
        </div>
        <div>
          <div className="font-medium">SMS Fallback Log</div>
          <div className="space-y-2 mt-2 max-h-36 overflow-auto">
            {sms.map((s) => (
              <div key={s.id} className="rounded-md border bg-card/50 p-2 text-xs">
                <div className="font-mono">To: {s.to}</div>
                <div className="text-muted-foreground">{s.body}</div>
                <div className="text-xs text-muted-foreground">{new Date(s.time).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" variant="outline">Manage Devices</Button>
        </div>
      </CardContent>
    </Card>
  );
};
