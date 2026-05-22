"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input } from "@/app/components/ui";
import { useCallState } from "@/app/components/shield";
import { CallState } from "@/domain/verification";

export default function TransferPage() {
  const { callContext } = useCallState();
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const hasActiveCall = callContext.state !== CallState.IDLE;
  const topPadding = hasActiveCall ? "pt-16" : "pt-0";

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${topPadding}`}>
      <header className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-elevated transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">
            Νέα Μεταφορά
          </h1>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Δικαιούχος
            </label>
            <Input
              id="recipient"
              type="text"
              placeholder="Όνομα δικαιούχου"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="iban"
              className="block text-sm font-medium text-foreground mb-2"
            >
              IBAN
            </label>
            <Input
              id="iban"
              type="text"
              placeholder="GR00 0000 0000 0000 0000 0000 000"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Ποσό
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                €
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="bg-surface-elevated rounded-2xl p-4">
            <p className="text-sm text-muted">
              Διαθέσιμο υπόλοιπο: <span className="text-foreground font-semibold">€3.247,65</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-6">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!iban || !amount || !recipient}
          >
            Συνέχεια
          </Button>
        </div>
      </footer>
    </div>
  );
}
