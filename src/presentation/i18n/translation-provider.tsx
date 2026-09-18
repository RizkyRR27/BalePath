"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./dictionary";
import type { Locale } from "./locale";

type TranslationState = { t: Dictionary; locale: Locale };
const TranslationContext = createContext<TranslationState | null>(null);

export function TranslationProvider({ locale, t, children }: { locale: Locale; t: Dictionary; children: ReactNode }) {
  return <TranslationContext.Provider value={{ locale, t }}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("TranslationProvider belum terpasang");
  return context;
}
