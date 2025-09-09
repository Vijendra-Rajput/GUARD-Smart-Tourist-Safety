import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EmergencyAccess: React.FC<{ contacts?: { name: string; phone: string }[] }> = ({ contacts = [] }) => {
  const smsTemplate = (name = "") => `EMERGENCY: ${name || "I need help"}. My location: [shared]. Please respond.`;

  const sendSMS = (to?: string) => {
    // mock: copy to clipboard
    const text = smsTemplate();
    navigator.clipboard?.writeText(`To:${to}\n${text}`);
    alert("Mock SMS copied to clipboard. (In production this would send an SMS)");
  };

  const callNow = (to?: string) => {
    alert("Mock call to " + (to ?? "emergency contact") + ". In production this would initiate a phone call.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice / Text Emergency Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-sm">Large easy-access controls for elderly or disabled travellers.</p>
        <div className="space-y-2">
          {contacts.length === 0 && <div className="text-xs text-muted-foreground">No emergency contacts configured.</div>}
          {contacts.map((c) => (
            <div key={c.phone} className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.phone}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => callNow(c.phone)} variant="default">Call</Button>
                <Button onClick={() => sendSMS(c.phone)} variant="outline">SMS</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <div className="text-sm font-medium">Accessibility</div>
          <div className="mt-1 flex items-center gap-3">
            <Button size="sm" onClick={() => alert("Text-to-speech enabled (mock)")}>Large Text</Button>
            <Button size="sm" onClick={() => alert("Voice assistance enabled (mock)")}>Voice Assist</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
