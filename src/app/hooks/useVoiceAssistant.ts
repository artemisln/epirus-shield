"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface VoiceAssistantState {
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
}

interface VoiceAssistantOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  onTranscript?: (transcript: string) => void;
  onSpeakEnd?: () => void;
}

interface VoiceAssistantReturn extends VoiceAssistantState {
  speak: (text: string) => void;
  stopSpeaking: () => void;
  listen: () => void;
  stopListening: () => void;
  isSupported: boolean;
  isSpeechSupported: boolean;
  isRecognitionSupported: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useVoiceAssistant(options: VoiceAssistantOptions = {}): VoiceAssistantReturn {
  const {
    lang = "el-GR",
    rate = 1.0,
    pitch = 1.0,
    onTranscript,
    onSpeakEnd,
  } = options;

  const [state, setState] = useState<VoiceAssistantState>({
    isSpeaking: false,
    isListening: false,
    transcript: "",
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSpeechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const isRecognitionSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const isSupported = isSpeechSupported || isRecognitionSupported;

  const findGreekVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!isSpeechSupported) return null;

    const voices = window.speechSynthesis.getVoices();
    const greekVoice = voices.find((v) => v.lang.startsWith("el"));
    return greekVoice || voices[0] || null;
  }, [isSpeechSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSpeechSupported) {
        setState((s) => ({ ...s, error: "Η σύνθεση ομιλίας δεν υποστηρίζεται" }));
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voice = findGreekVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setState((s) => ({ ...s, isSpeaking: true, error: null }));
      };

      utterance.onend = () => {
        setState((s) => ({ ...s, isSpeaking: false }));
        onSpeakEnd?.();
      };

      utterance.onerror = (event) => {
        setState((s) => ({
          ...s,
          isSpeaking: false,
          error: `Σφάλμα ομιλίας: ${event.error}`,
        }));
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSpeechSupported, lang, rate, pitch, findGreekVoice, onSpeakEnd]
  );

  const stopSpeaking = useCallback(() => {
    if (isSpeechSupported) {
      window.speechSynthesis.cancel();
      setState((s) => ({ ...s, isSpeaking: false }));
    }
  }, [isSpeechSupported]);

  const listen = useCallback(() => {
    if (!isRecognitionSupported) {
      setState((s) => ({ ...s, error: "Η αναγνώριση ομιλίας δεν υποστηρίζεται" }));
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setState((s) => ({ ...s, error: "Η αναγνώριση ομιλίας δεν υποστηρίζεται" }));
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState((s) => ({ ...s, isListening: true, transcript: "", error: null }));
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      setState((s) => ({ ...s, transcript }));

      if (event.results[0].isFinal) {
        onTranscript?.(transcript);
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = "Σφάλμα αναγνώρισης ομιλίας";
      if (event.error === "no-speech") {
        errorMessage = "Δεν ακούστηκε ομιλία";
      } else if (event.error === "not-allowed") {
        errorMessage = "Δεν επιτρέπεται η πρόσβαση στο μικρόφωνο";
      }
      setState((s) => ({ ...s, isListening: false, error: errorMessage }));
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isRecognitionSupported, lang, onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState((s) => ({ ...s, isListening: false }));
    }
  }, []);

  useEffect(() => {
    if (isSpeechSupported) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (isSpeechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeechSupported]);

  return {
    ...state,
    speak,
    stopSpeaking,
    listen,
    stopListening,
    isSupported,
    isSpeechSupported,
    isRecognitionSupported,
  };
}
