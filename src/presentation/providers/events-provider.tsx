"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialEvents } from "@/data/catalog/demo-data";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import { createEventRepository } from "@/infrastructure/storage/session-storage";
import { isValidEvent, isValidEventList } from "@/application/use-cases/event-validation";
import { useAuth } from "./auth-provider";
import { useRoads } from "./roads-provider";

type EventsState = { events: CeremonyEvent[]; ready: boolean; saveEvent: (event: CeremonyEvent) => boolean; togglePublished: (id: string) => void; deleteEvent: (id: string) => void };
const EventsContext = createContext<EventsState | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { roads, ready: roadsReady } = useRoads();
  const [events, setEvents] = useState<CeremonyEvent[]>(initialEvents);
  const [ready, setReady] = useState(false);
  // Recreated (cheaply — no internal state) whenever roads changes, so stored events are
  // (re)validated against the current road catalog instead of a stale static import.
  const repository = useMemo(() => createEventRepository(initialEvents, (value): value is CeremonyEvent[] => isValidEventList(value, roads)), [roads]);
  useEffect(() => {
    if (!roadsReady) return;
    const timer = setTimeout(() => { setEvents(repository.load()); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, [roadsReady, repository]);
  useEffect(() => { if (ready) repository.save(events); }, [events, ready, repository]);
  function saveEvent(event: CeremonyEvent) {
    if (!user || event.banjarId !== user.banjarId || !isValidEvent(event, roads) || !event.name.trim()) return false;
    if (events.some((item) => item.id === event.id && item.banjarId !== user.banjarId)) return false;
    setEvents((current) => current.some((item) => item.id === event.id) ? current.map((item) => item.id === event.id ? event : item) : [...current, event]);
    return true;
  }
  function togglePublished(id: string) {
    if (!user) return;
    setEvents((current) => current.map((event) => event.id === id && event.banjarId === user.banjarId ? { ...event, published: !event.published } : event));
  }
  function deleteEvent(id: string) {
    if (!user) return;
    setEvents((current) => current.filter((event) => event.id !== id || event.banjarId !== user.banjarId));
  }
  return <EventsContext.Provider value={{ events, ready, saveEvent, togglePublished, deleteEvent }}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error("EventsProvider belum terpasang");
  return context;
}
