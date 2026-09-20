import type { RoadRepository } from "@/domain/repositories/road-repository";
import { isValidRoadList } from "@/application/use-cases/road-validation";
import { initialRoads } from "@/infrastructure/dummy/dummy-roads";
import { createRoadRepository } from "@/infrastructure/storage/session-storage";

export function createDummyRoadRepository(): RoadRepository {
  return createRoadRepository(initialRoads, isValidRoadList);
}
