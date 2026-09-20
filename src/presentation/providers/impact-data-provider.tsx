"use client";

import { createContext, useContext } from "react";
import type { ImpactStat } from "@/domain/entities/impact-stat";
import type { Vehicle } from "@/domain/entities/vehicle";
import { initialVehicles } from "@/infrastructure/dummy/dummy-vehicles";
import { initialImpactStat } from "@/infrastructure/dummy/dummy-impact-stats";

type ImpactState = { vehicles: Vehicle[]; impactStat: ImpactStat };
const ImpactContext = createContext<ImpactState | null>(null);
const value = { vehicles: initialVehicles, impactStat: initialImpactStat };

// Read-only pass-through: keeps pages free of dummy imports without building an
// unnecessary CRUD API. Swap to a repository call here when real data exists.
export function ImpactDataProvider({ children }: { children: React.ReactNode }) {
  return <ImpactContext.Provider value={value}>{children}</ImpactContext.Provider>;
}

export function useImpactData() {
  const context = useContext(ImpactContext);
  if (!context) throw new Error("ImpactDataProvider belum terpasang");
  return context;
}
