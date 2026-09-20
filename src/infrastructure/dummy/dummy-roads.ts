import type { Road } from "@/domain/entities/road";

export const initialRoads: Road[] = [
  { id: "raya-ubud", name: "Jl. Raya Ubud", coordinates: [[-8.5069, 115.257], [-8.5068, 115.262], [-8.5067, 115.267]] },
  { id: "suweta", name: "Jl. Suweta", coordinates: [[-8.501, 115.262], [-8.504, 115.262], [-8.5068, 115.262]] },
  { id: "bisma", name: "Jl. Bisma", coordinates: [[-8.5069, 115.257], [-8.51, 115.2575], [-8.514, 115.259]] },
  { id: "hanoman", name: "Jl. Hanoman", coordinates: [[-8.5067, 115.267], [-8.51, 115.2675], [-8.514, 115.268]] },
];
