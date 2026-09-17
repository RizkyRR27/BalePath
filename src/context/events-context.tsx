"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initialEvents, isCeremonyEvent, type CeremonyEvent } from "@/lib/data";
import { useAuth } from "./auth-context";

type EventsState = { events: CeremonyEvent[]; ready: boolean; saveEvent: (event: CeremonyEvent) => boolean; togglePublished: (id: string) => void; deleteEvent: (id: string) => void };
const EventsContext = createContext<EventsState | null>(null);
const KEY = "balepath.demo.events.v1";

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<CeremonyEvent[]>(initialEvents);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
        if (Array.isArray(stored) && stored.every(isCeremonyEvent)) setEvents(stored);
      } catch { }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (ready) {
      try { sessionStorage.setItem(KEY, JSON.stringify(events)); } catch { }
    }
  }, [events, ready]);
  function saveEvent(event: CeremonyEvent) {
    if (!user || event.banjarId !== user.banjarId || !isCeremonyEvent(event) || !event.name.trim()) return false;
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
