"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Road } from "@/domain/entities/road";
import { initialRoads } from "@/infrastructure/dummy/dummy-roads";
import { isValidRoad } from "@/application/use-cases/road-validation";
import { createDummyRoadRepository } from "@/infrastructure/repositories/dummy-road-repository";

const repository = createDummyRoadRepository();
type RoadsState = { roads: Road[]; ready: boolean; saveRoad: (road: Road) => boolean; deleteRoad: (id: string) => void };
const RoadsContext = createContext<RoadsState | null>(null);

export function RoadsProvider({ children }: { children: React.ReactNode }) {
  const [roads, setRoads] = useState<Road[]>(initialRoads);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setRoads(repository.load()); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) repository.save(roads); }, [roads, ready]);
  function saveRoad(road: Road) {
    if (!isValidRoad(road)) return false;
    setRoads((current) => current.some((item) => item.id === road.id) ? current.map((item) => item.id === road.id ? road : item) : [...current, road]);
    return true;
  }
  function deleteRoad(id: string) { setRoads((current) => current.filter((road) => road.id !== id)); }
  return <RoadsContext.Provider value={{ roads, ready, saveRoad, deleteRoad }}>{children}</RoadsContext.Provider>;
}

export function useRoads() {
  const context = useContext(RoadsContext);
  if (!context) throw new Error("RoadsProvider belum terpasang");
  return context;
}
