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

const BANJAR_ID_BY_NAME: Record<string, string> = {
  "Banjar Ubud Kaja": "ubud-kaja",
  "Banjar Padangtegal": "padangtegal",
};

/** Event lama (sebelum ada banjarId) dinormalisasi berdasarkan nama banjarnya. */
function withBanjarId(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((item) => {
    if (!item || typeof item !== "object") return item;
    const event = item as Record<string, unknown>;
    if (typeof event.banjarId === "string" && event.banjarId.trim().length > 0) return item;
    const name = typeof event.banjarName === "string" ? event.banjarName : "";
    return { ...event, banjarId: BANJAR_ID_BY_NAME[name] ?? "ubud-kaja" };
  });
}

function loadStored(): BanjarEvent[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    const normalized = withBanjarId(raw);
    if (!isBanjarEventList(normalized)) return banjarEventSeeds;
    const storedIds = new Set(normalized.map((event) => event.id));
    const missingSeeds = banjarEventSeeds.filter((seed) => !storedIds.has(seed.id));
    return missingSeeds.length > 0 ? [...normalized, ...missingSeeds] : normalized;
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
