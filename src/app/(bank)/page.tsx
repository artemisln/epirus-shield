"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui";
import { useCallState } from "@/app/components/shield";
import { CallState } from "@/domain/verification";

const MOCK_TRANSACTIONS = [
  { id: 1, description: "ΣΚΛΑΒΕΝΙΤΗΣ", amount: -45.80, date: "Σήμερα" },
  { id: 2, description: "ΜΙΣΘΟΔΟΣΙΑ", amount: 1850.00, date: "20 Μαΐ" },
  { id: 3, description: "COSMOTE", amount: -32.50, date: "18 Μαΐ" },
  { id: 4, description: "ΔΕΗ", amount: -78.20, date: "15 Μαΐ" },
  { id: 5, description: "ΕΥΔΑΠ", amount: -24.30, date: "12 Μαΐ" },
  { id: 6, description: "SHELL", amount: -55.00, date: "10 Μαΐ" },
];

const MOCK_BALANCE = 3247.65;

export default function BankDashboard() {
  const { callContext } = useCallState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasActiveCall = callContext.state !== CallState.IDLE;
  const topPadding = hasActiveCall ? "pt-16" : "pt-0";

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${topPadding}`}>
      <header className="bg-primary text-primary-foreground px-6 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-8">
            {mounted && (
              <Image
                src="/epirus_bank_logo.svg"
                alt="Epirus Bank"
                width={100}
                height={12}
                className="brightness-0 invert"
                style={{ width: 100, height: "auto" }}
              />
            )}
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center"
              aria-label="Ειδοποιήσεις"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <p className="text-primary-foreground/70 text-sm mb-1">
            Διαθέσιμο υπόλοιπο
          </p>
          <p className="text-4xl font-bold">
            €{MOCK_BALANCE.toLocaleString("el-GR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </header>

      <main className="px-6 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-3 mb-8">
            <Link href="/transfer" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
                </svg>
                Μεταφορά
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z"
                  clipRule="evenodd"
                />
              </svg>
              Πληρωμές
            </Button>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Πρόσφατες κινήσεις
            </h2>
            <button
              type="button"
              className="text-sm text-primary font-medium"
            >
              Όλες
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
                    {tx.amount > 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-success"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-muted"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0V8.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L6.2 9.74a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted">{tx.date}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    tx.amount > 0 ? "text-success" : "text-foreground"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  €{Math.abs(tx.amount).toLocaleString("el-GR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-3">
        <div className="max-w-lg mx-auto flex justify-around">
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <span className="text-xs font-medium">Αρχική</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
              <path
                fillRule="evenodd"
                d="M1.5 9.75v6.75a3 3 0 003 3h15a3 3 0 003-3V9.75H1.5zm3 3.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">Κάρτες</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 text-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium">Προφίλ</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
