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
import { AppState } from 'react-native';

import {
  CallContext,
  CallState,
  createIdleContext,
  createScamContext,
  createVerifiedContext,
} from '@/domain/verification';
import { notifyScamCall, requestNotificationPermission } from '@/lib/notifications';
import { CallDetector } from '@/modules/call-detector';

interface CallDetectionValue {
  /** The current call state (idle / verified / scam). */
  callContext: CallContext;
  /** True when a call is in progress (verified or scam). */
  isCallActive: boolean;
  /** Low-level setter — used by the native observer (Layer B) and demo controls. */
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

  // Layer B — subscribe to the native foreground call observer.
  // Any active call is treated as a potential scam: Epirus Bank never phones
  // customers, and CXCallObserver exposes no caller number.
  useEffect(() => {
    const subscription = CallDetector.addListener(
      'onCallStateChange',
      (event) => {
        setCallContext(
          event.state === 'active'
            ? createScamContext()
            : createIdleContext(),
        );
      },
    );
    return () => subscription.remove();
  }, []);

  // Revolut-style check: when the app is opened or returns to the foreground,
  // ask whether a call is already in progress (the onCallStateChange listener
  // above only catches calls that *start* while the app is open).
  useEffect(() => {
    const checkForOngoingCall = () => {
      try {
        if (CallDetector.isCallActive()) {
          setCallContext(createScamContext());
        }
      } catch {
        // Native module unavailable (e.g. Expo Go) — ignore.
      }
    };

    checkForOngoingCall();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkForOngoingCall();
      }
    });
    return () => subscription.remove();
  }, []);

  // React to entering the SCAM state — from native detection or demo controls.
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
