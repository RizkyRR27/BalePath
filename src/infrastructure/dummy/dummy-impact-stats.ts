import type { ImpactStat } from "@/domain/entities/impact-stat";

export const initialImpactStat: ImpactStat = {
  emissionKg: 1420,
  idlingPercent: 28.4,
  idlingMinPercent: 25,
  idlingTargetPercent: 30,
  ceremonyCount: 34,
  avoidedDistanceKm: 3.8,
  co2KgPerLiter: 2.3,
};
