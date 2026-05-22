"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { CallState, CallContext, createIdleContext } from "@/domain/verification";

interface CallStateContextValue {
  callContext: CallContext;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const CallStateContext = createContext<CallStateContextValue | null>(null);

interface CallStateProviderProps {
  children: ReactNode;
  pollInterval?: number;
}

export function CallStateProvider({ children, pollInterval = 500 }: CallStateProviderProps) {
  const [callContext, setCallContext] = useState<CallContext>(createIdleContext());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCallState = useCallback(async () => {
    try {
      const res = await fetch("/api/call-state");
      if (res.ok) {
        const data = await res.json();
        setCallContext(data);
      }
    } catch (error) {
      console.error("Failed to fetch call state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCallState();
    const interval = setInterval(fetchCallState, pollInterval);
    return () => clearInterval(interval);
  }, [fetchCallState, pollInterval]);

  // DEMO: Check URL params for instant override
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const callParam = params.get("call");

    if (callParam === "verified") {
      setCallContext({
        state: CallState.VERIFIED,
        callerNumber: "+302101234567",
        department: "Εξυπηρέτηση Πελατών",
        label: "Demo",
        detectedAt: new Date(),
      });
    } else if (callParam === "scam") {
      setCallContext({
        state: CallState.SCAM,
        callerNumber: "+30697XXXXXXX",
        detectedAt: new Date(),
      });
    }
  }, []);

  return (
    <CallStateContext.Provider value={{ callContext, isLoading, refresh: fetchCallState }}>
      {children}
    </CallStateContext.Provider>
  );
}

export function useCallState() {
  const context = useContext(CallStateContext);
  if (!context) {
    throw new Error("useCallState must be used within CallStateProvider");
  }
  return context;
}
