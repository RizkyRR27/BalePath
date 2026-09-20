import type { Road } from "@/domain/entities/road";

export interface RoadRepository {
  load(): Road[];
  save(roads: Road[]): void;
}
