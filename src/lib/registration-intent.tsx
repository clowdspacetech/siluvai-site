"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EVENT_OPTIONS } from "./types";

interface RegistrationIntentValue {
  intendedEvent: string;
  prefillEvent: (title: string) => void;
  clearIntent: () => void;
}

const RegistrationIntentContext = createContext<RegistrationIntentValue | null>(null);

export function resolveEventOption(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "";

  const exact = EVENT_OPTIONS.find((option) => option.toLowerCase() === trimmed.toLowerCase());
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  if (lower.includes("masterclass") || lower.includes("media production")) {
    return "Media Production Masterclass";
  }
  if (lower.includes("gala")) return "Annual Charity Gala";
  if (lower.includes("leadership")) return "Leadership Training Workshop";
  if (lower.includes("outreach")) return "Community Outreach Day";
  if (lower.includes("youth") || lower.includes("fellowship")) return "Youth Fellowship Evening";
  if (lower.includes("community")) return "Community Outreach Day";

  return trimmed;
}

export function RegistrationIntentProvider({ children }: { children: React.ReactNode }) {
  const [intendedEvent, setIntendedEvent] = useState("");

  const prefillEvent = useCallback((title: string) => {
    setIntendedEvent(resolveEventOption(title));
  }, []);

  const clearIntent = useCallback(() => setIntendedEvent(""), []);

  const value = useMemo(
    () => ({ intendedEvent, prefillEvent, clearIntent }),
    [intendedEvent, prefillEvent, clearIntent]
  );

  return (
    <RegistrationIntentContext.Provider value={value}>{children}</RegistrationIntentContext.Provider>
  );
}

export function useRegistrationIntent() {
  const ctx = useContext(RegistrationIntentContext);
  if (!ctx) throw new Error("useRegistrationIntent must be used within RegistrationIntentProvider");
  return ctx;
}
