import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useI18n } from "@/context/i18n";

const canned = [
  { q: "How to stay safe at night?", a: "Avoid isolated streets, use well-lit routes, share ETA with family, and enable real-time tracking." },
  { q: "What to do if my phone dies?", a: "Enable offline mode in the app, have emergency SMS fallback configured, and visit nearby check-in kiosks." },
  { q: "Is my data shared?", a: "Personal data is encrypted and shared only upon user consent or with emergency services as needed." },
];

export const Chatbot: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const ask = (q: string) => {
    const found = canned.find((c) => c.q === q) || { q, a: "This is a mock AI: sounds great — please check local guidelines and always stay alert." };
    setHistory((h) => [{ q: found.q, a: found.a }, ...h].slice(0, 6));
    setQuery("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:opacity-90">AI Guide</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pre-Trip AI Guide</AlertDialogTitle>
          <AlertDialogDescription>Ask quick safety questions before you head out. (Mock AI)</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-3">
          <div className="mb-2 flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a question" className="flex-1 rounded-md border px-3 py-2" />
            <Button onClick={() => query && ask(query)} disabled={!query}>Ask</Button>
          </div>
          <div className="space-y-3 max-h-60 overflow-auto">
            {history.map((h, i) => (
              <div key={i} className="space-y-1">
                <div className="text-sm font-medium">Q: {h.q}</div>
                <div className="text-sm text-muted-foreground">A: {h.a}</div>
              </div>
            ))}
            <div className="grid gap-2">
              {canned.map((c) => (
                <button key={c.q} className="text-left rounded-md px-2 py-1 hover:bg-muted" onClick={() => ask(c.q)}>{c.q}</button>
              ))}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
