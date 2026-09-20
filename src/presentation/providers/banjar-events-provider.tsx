"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { isBanjarEvent, isBanjarEventList } from "@/domain/rules/is-banjar-event";
import { banjarEventSeeds } from "@/data/catalog/banjar-seeds";

const STORAGE_KEY = "balepath.banjar-events.v1";

type BanjarEventsState = {
  events: BanjarEvent[];
  ready: boolean;
  saveBanjarEvent: (event: BanjarEvent) => boolean;
  removeBanjarEvent: (id: string) => void;
};

const BanjarEventsContext = createContext<BanjarEventsState | null>(null);

function loadStored(): BanjarEvent[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return isBanjarEventList(raw) ? raw : banjarEventSeeds;
  } catch {
    return banjarEventSeeds;
  }
}

/**
 * Shared store Admin <-> Publik berbasis React Context + localStorage.
 * - localStorage (bukan sessionStorage) agar data admin tetap ada saat
 *   berpindah rute / tab antara portal prajuru dan portal publik.
 * - Load divalidasi; jika kosong/rusak, fallback ke seed bawaan.
 * - Load dilakukan di useEffect agar SSR dan render pertama client identik
 *   (ready=false) — bebas hydration mismatch.
 */
export function BanjarEventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BanjarEvent[]>(banjarEventSeeds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(loadStored());
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      /* storage unavailable */
    }
  }, [events, ready]);

  function saveBanjarEvent(event: BanjarEvent) {
    if (!isBanjarEvent(event)) return false;
    setEvents((current) =>
      current.some((item) => item.id === event.id)
        ? current.map((item) => (item.id === event.id ? event : item))
        : [...current, event],
    );
    return true;
  }

  function removeBanjarEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
  }

  return (
    <BanjarEventsContext.Provider value={{ events, ready, saveBanjarEvent, removeBanjarEvent }}>
      {children}
    </BanjarEventsContext.Provider>
  );
}

export function useBanjarEvents() {
  const context = useContext(BanjarEventsContext);
  if (!context) throw new Error("BanjarEventsProvider belum terpasang");
  return context;
}
