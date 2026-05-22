"use client";

import { useState } from "react";
import { CallState } from "@/domain/verification";
import { useCallState } from "./CallStateProvider";
import { ScamActionSheet } from "./ScamActionSheet";

export function ShieldOverlay() {
  const { callContext, isLoading } = useCallState();
  const [showActionSheet, setShowActionSheet] = useState(false);

  if (isLoading || callContext.state === CallState.IDLE) {
    return null;
  }

  const isVerified = callContext.state === CallState.VERIFIED;
  const isScam = callContext.state === CallState.SCAM;

  return (
    <>
      <div
        role="alert"
        aria-live="assertive"
        onClick={() => isScam && setShowActionSheet(true)}
        className={`
          fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 cursor-pointer
          ${isVerified ? "bg-primary" : "bg-secondary"}
        `}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-shrink-0">
            {isVerified ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-primary-foreground"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-secondary-foreground animate-pulse"
              >
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isVerified ? (
              <>
                <p className="text-primary-foreground font-semibold text-sm">
                  ✓ Μιλάτε με την Epirus Bank
                </p>
                {callContext.department && (
                  <p className="text-primary-foreground/80 text-xs truncate">
                    {callContext.department}
                    {callContext.label && ` — ${callContext.label}`}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-secondary-foreground font-bold text-sm">
                  ⚠ ΔΕΝ μιλάμε μαζί σας αυτή τη στιγμή
                </p>
                <p className="text-secondary-foreground/80 text-xs">
                  Πατήστε για περισσότερες πληροφορίες
                </p>
              </>
            )}
          </div>

          {isScam && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-secondary-foreground flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      <ScamActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        callerNumber={callContext.callerNumber}
      />
    </>
  );
}
