import { router } from 'expo-router';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  CallContext,
  CallState,
  createIdleContext,
  createScamContext,
  createVerifiedContext,
} from '@/domain/verification';
import { notifyScamCall, requestNotificationPermission } from '@/lib/notifications';

interface CallDetectionValue {
  /** The current call state (idle / verified / scam). */
  callContext: CallContext;
  /** True when a call is in progress (verified or scam). */
  isCallActive: boolean;
  /** Low-level setter — used by the demo controls. */
  setCallContext: (context: CallContext) => void;
  /** Demo helper: pretend a verified Epirus Bank call is in progress. */
  simulateVerified: (callerNumber?: string, department?: string) => void;
  /** Demo helper: pretend an unidentified (scam) call is in progress. */
  simulateScam: (callerNumber?: string) => void;
  /** Return to the idle state. */
  clearCall: () => void;
}

const CallDetectionContext = createContext<CallDetectionValue | undefined>(
  undefined,
);

export function CallDetectionProvider({ children }: { children: ReactNode }) {
  const [callContext, setCallContext] =
    useState<CallContext>(createIdleContext);

  // Ask for local-notification permission once, up front.
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // React to entering the SCAM state — from the demo controls for now.
  const previousState = useRef<CallState>(CallState.IDLE);
  useEffect(() => {
    const enteredScam =
      callContext.state === CallState.SCAM &&
      previousState.current !== CallState.SCAM;
    previousState.current = callContext.state;

    if (enteredScam) {
      notifyScamCall();
      router.navigate('/warning');
    }
  }, [callContext]);

  const value = useMemo<CallDetectionValue>(
    () => ({
      callContext,
      isCallActive: callContext.state !== CallState.IDLE,
      setCallContext,
      simulateVerified: (
        callerNumber = '+302101234567',
        department = 'Εξυπηρέτηση Πελατών',
      ) => setCallContext(createVerifiedContext(callerNumber, department)),
      simulateScam: (callerNumber) =>
        setCallContext(createScamContext(callerNumber)),
      clearCall: () => setCallContext(createIdleContext()),
    }),
    [callContext],
  );

  return (
    <CallDetectionContext.Provider value={value}>
      {children}
    </CallDetectionContext.Provider>
  );
}

export function useCallDetection(): CallDetectionValue {
  const ctx = useContext(CallDetectionContext);
  if (!ctx) {
    throw new Error(
      'useCallDetection must be used within a CallDetectionProvider',
    );
  }
  return ctx;
}
