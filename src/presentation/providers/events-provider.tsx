"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initialEvents } from "@/data/catalog/demo-data";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import { createEventRepository } from "@/infrastructure/storage/session-storage";
import { isValidEvent, isValidEventList } from "@/application/use-cases/event-validation";
import { useAuth } from "./auth-provider";

type EventsState = { events: CeremonyEvent[]; ready: boolean; saveEvent: (event: CeremonyEvent) => boolean; togglePublished: (id: string) => void; deleteEvent: (id: string) => void };
const EventsContext = createContext<EventsState | null>(null);
const repository = createEventRepository(initialEvents, isValidEventList);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<CeremonyEvent[]>(initialEvents);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setEvents(repository.load()); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) repository.save(events); }, [events, ready]);
  function saveEvent(event: CeremonyEvent) {
    if (!user || event.banjarId !== user.banjarId || !isValidEvent(event) || !event.name.trim()) return false;
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
