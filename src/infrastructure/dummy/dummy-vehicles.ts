import type { Vehicle } from "@/domain/entities/vehicle";

export const initialVehicles: Vehicle[] = [
  { id: "motor", label: "Sepeda Motor", fuelRatePerKm: 0.08 },
  { id: "mobil_kecil", label: "Mobil LCGC", fuelRatePerKm: 0.19 },
  { id: "suv_van", label: "Van / SUV", fuelRatePerKm: 0.28 },
];
