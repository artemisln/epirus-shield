"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Input } from "@/app/components/ui";
import { VerifiedNumber, VerifiedDomain, CallState } from "@/domain/verification";

export default function AdminPage() {
  const [numbers, setNumbers] = useState<VerifiedNumber[]>([]);
  const [domains, setDomains] = useState<VerifiedDomain[]>([]);
  const [newPhone, setNewPhone] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newOrg, setNewOrg] = useState("Epirus Bank");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [numbersRes, domainsRes] = await Promise.all([
        fetch("/api/verification/numbers"),
        fetch("/api/verification/domains"),
      ]);
      const numbersData = await numbersRes.json();
      const domainsData = await domainsRes.json();
      setNumbers(numbersData.numbers || []);
      setDomains(domainsData.domains || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNumber = async () => {
    if (!newPhone || !newDepartment) return;
    try {
      await fetch("/api/verification/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newPhone,
          department: newDepartment,
          label: newLabel || undefined,
        }),
      });
      setNewPhone("");
      setNewDepartment("");
      setNewLabel("");
      fetchData();
    } catch (error) {
      console.error("Failed to add number:", error);
    }
  };

  const handleDeleteNumber = async (id: string) => {
    try {
      await fetch(`/api/verification/numbers?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete number:", error);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain || !newOrg) return;
    try {
      await fetch("/api/verification/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newDomain,
          organization: newOrg,
        }),
      });
      setNewDomain("");
      fetchData();
    } catch (error) {
      console.error("Failed to add domain:", error);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await fetch(`/api/verification/domains?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete domain:", error);
    }
  };

  const triggerCallState = async (state: CallState, department?: string) => {
    try {
      await fetch("/api/call-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          callerNumber: state === CallState.VERIFIED ? "+302101234567" : "+30697XXXXXXX",
          department,
          label: state === CallState.VERIFIED ? "Demo Agent" : undefined,
        }),
      });
    } catch (error) {
      console.error("Failed to trigger call state:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-background rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Demo Controls
        </h2>
        <p className="text-sm text-muted mb-4">
          Χρησιμοποιήστε αυτά τα κουμπιά για να προσομοιώσετε κλήσεις στο PWA demo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => triggerCallState(CallState.VERIFIED, "Εξυπηρέτηση Πελατών")}
          >
            ✓ Verified Call
          </Button>
          <Button
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
            onClick={() => triggerCallState(CallState.SCAM)}
          >
            ⚠ Scam Call
          </Button>
          <Button
            variant="outline"
            onClick={() => triggerCallState(CallState.IDLE)}
          >
            Reset (Idle)
          </Button>
        </div>
      </section>

      <section className="bg-background rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Επαληθευμένοι Αριθμοί Τηλεφώνου
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Input
            placeholder="Τηλέφωνο (+30...)"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
          <Input
            placeholder="Τμήμα"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Ετικέτα (προαιρ.)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <Button onClick={handleAddNumber} disabled={!newPhone || !newDepartment}>
              +
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {numbers.map((num) => (
            <div key={num.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">{num.phone}</p>
                <p className="text-sm text-muted">
                  {num.department}
                  {num.label && ` — ${num.label}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNumber(num.id)}
                className="text-muted hover:text-error transition-colors"
                aria-label="Διαγραφή"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {numbers.length === 0 && (
            <p className="py-4 text-muted text-center">Δεν υπάρχουν καταχωρήσεις</p>
          )}
        </div>
      </section>

      <section className="bg-background rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Επαληθευμένα Email Domains
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <Input
            placeholder="Domain (π.χ. epirusbank.gr)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <Input
            placeholder="Οργανισμός"
            value={newOrg}
            onChange={(e) => setNewOrg(e.target.value)}
          />
          <Button onClick={handleAddDomain} disabled={!newDomain || !newOrg}>
            Προσθήκη
          </Button>
        </div>

        <div className="divide-y divide-border">
          {domains.map((dom) => (
            <div key={dom.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">{dom.domain}</p>
                <p className="text-sm text-muted">{dom.organization}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteDomain(dom.id)}
                className="text-muted hover:text-error transition-colors"
                aria-label="Διαγραφή"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {domains.length === 0 && (
            <p className="py-4 text-muted text-center">Δεν υπάρχουν καταχωρήσεις</p>
          )}
        </div>
      </section>
    </div>
  );
}
