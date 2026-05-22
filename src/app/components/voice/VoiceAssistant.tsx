"use client";

import { useEffect } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

interface VoiceAssistantProps {
  prompt?: string;
  autoSpeak?: boolean;
  onTranscript?: (transcript: string) => void;
  showMicButton?: boolean;
  className?: string;
}

export function VoiceAssistant({
  prompt,
  autoSpeak = false,
  onTranscript,
  showMicButton = true,
  className = "",
}: VoiceAssistantProps) {
  const {
    isSpeaking,
    isListening,
    transcript,
    speak,
    stopSpeaking,
    listen,
    stopListening,
    isSupported,
    isSpeechSupported,
    isRecognitionSupported,
  } = useVoiceAssistant({ onTranscript });

  useEffect(() => {
    if (autoSpeak && prompt && isSpeechSupported) {
      const timer = setTimeout(() => {
        speak(prompt);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSpeak, prompt, speak, isSpeechSupported]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isSpeechSupported && (
        <button
          type="button"
          onClick={() => (isSpeaking ? stopSpeaking() : prompt && speak(prompt))}
          className={`
            p-3 rounded-full transition-all duration-200
            ${isSpeaking
              ? "bg-primary text-primary-foreground animate-pulse"
              : "bg-surface-elevated text-muted hover:text-primary hover:bg-primary/10"
            }
          `}
          aria-label={isSpeaking ? "Διακοπή ομιλίας" : "Ακούστε τις οδηγίες"}
          title={isSpeaking ? "Διακοπή ομιλίας" : "Ακούστε τις οδηγίες"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            {isSpeaking ? (
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            ) : (
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
            )}
          </svg>
        </button>
      )}

      {showMicButton && isRecognitionSupported && (
        <button
          type="button"
          onClick={() => (isListening ? stopListening() : listen())}
          className={`
            p-3 rounded-full transition-all duration-200
            ${isListening
              ? "bg-secondary text-secondary-foreground animate-pulse"
              : "bg-surface-elevated text-muted hover:text-primary hover:bg-primary/10"
            }
          `}
          aria-label={isListening ? "Διακοπή εγγραφής" : "Μιλήστε"}
          title={isListening ? "Διακοπή εγγραφής" : "Μιλήστε"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        </button>
      )}

      {isListening && transcript && (
        <span className="text-sm text-muted italic">{transcript}</span>
      )}
    </div>
  );
}
