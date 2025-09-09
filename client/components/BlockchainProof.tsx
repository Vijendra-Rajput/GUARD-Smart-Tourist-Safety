import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n";

export const BlockchainProof: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const txs = [
    { hash: "0x" + Math.random().toString(16).slice(2, 18), time: Date.now() - 1000 * 60 * 60 },
    { hash: "0x" + Math.random().toString(16).slice(2, 18), time: Date.now() - 1000 * 60 * 10 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blockchain Proof</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setOpen((s) => !s)}>{open ? "Hide" : "View"}</Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="text-sm space-y-2">
          <div className="text-xs text-muted-foreground">Digital ID: <span className="font-mono">{id}</span></div>
          {txs.map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between rounded-md border bg-card/50 p-2">
              <div>
                <div className="font-mono text-sm">{tx.hash}</div>
                <div className="text-xs text-muted-foreground">{new Date(tx.time).toLocaleString()}</div>
              </div>
              <div className="text-xs text-accent font-semibold">Proof</div>
            </div>
          ))}
          <div className="text-xs text-muted-foreground">Mocked blockchain entries for audit trail.</div>
        </CardContent>
      )}
    </Card>
  );
};
