import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface IssuedTourist {
  id: string;
  name: string;
  phone: string;
  kycType: "Aadhaar" | "Passport";
  kycNumber: string;
  emergencyContacts: { name: string; phone: string }[];
  entryPoint: string;
  validUntil: string; // ISO
  txHash: string;
}

export const KioskIssuance: React.FC<{ onIssue: (t: IssuedTourist) => void; defaultName?: string }> = ({ onIssue, defaultName }) => {
  const [name, setName] = useState(defaultName || "");
  const [phone, setPhone] = useState("");
  const [kycType, setKycType] = useState<"Aadhaar" | "Passport">("Aadhaar");
  const [kycNumber, setKycNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);
  const [entryPoint, setEntryPoint] = useState("Airport Check-in");
  const [days, setDays] = useState<number>(7);

  const addContact = () => {
    if (!contactName || !contactPhone) return;
    setContacts((c) => [...c, { name: contactName, phone: contactPhone }]);
    setContactName("");
    setContactPhone("");
  };

  const issue = () => {
    const idSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const id = name.trim().toLowerCase().replace(/\s+/g, "-") + "-" + idSuffix;
    const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const txHash = "0x" + Math.random().toString(16).slice(2, 18);
    const issued: IssuedTourist = {
      id,
      name,
      phone,
      kycType,
      kycNumber,
      emergencyContacts: contacts,
      entryPoint,
      validUntil,
      txHash,
    };
    onIssue(issued);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entry Kiosk — Issue Digital ID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="block text-xs">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <div>
            <label className="block text-xs">ID type</label>
            <select className="rounded-md border px-2 py-2 w-full" value={kycType} onChange={(e) => setKycType(e.target.value as any)}>
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs">ID Number</label>
            <Input value={kycNumber} onChange={(e) => setKycNumber(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-xs">Emergency contact</label>
          <div className="flex gap-2 mt-2">
            <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name" />
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Phone" />
            <Button onClick={addContact} size="sm">Add</Button>
          </div>
          <ul className="mt-2 text-sm list-disc pl-5">
            {contacts.map((c, i) => (
              <li key={i}>{c.name} • {c.phone}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="block text-xs">Entry point</label>
            <select className="rounded-md border px-2 py-2 w-full" value={entryPoint} onChange={(e) => setEntryPoint(e.target.value)}>
              <option>Airport Check-in</option>
              <option>Hotel Front Desk</option>
              <option>Road Check-post</option>
            </select>
          </div>
          <div>
            <label className="block text-xs">Valid for (days)</label>
            <Input type="number" value={String(days)} onChange={(e) => setDays(Number(e.target.value || 1))} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={issue}>Issue Digital ID</Button>
        </div>
      </CardContent>
    </Card>
  );
};
