import type { Admin } from "@/domain/entities/admin";
import type { CeremonyEvent, Closure } from "@/domain/entities/ceremony-event";
import type { Road } from "@/domain/entities/road";

export type { CeremonyEvent, Closure, Road };

/** Static demo dataset (seed data). No business rules or formatting live here. */

export const DEMO_DATE = "2026-09-17";

export const dummyAdmin: Admin = {
  id: "admin-kaja",
  name: "I Wayan Wira Adnyana",
  email: "admin@banjarkaja.id",
  banjarId: "ubud-kaja",
  banjar: "Banjar Ubud Kaja",
};

export const roads: Road[] = [
  { id: "raya-ubud", name: "Jl. Raya Ubud", coordinates: [[-8.5069, 115.257], [-8.5068, 115.262], [-8.5067, 115.267]] },
  { id: "suweta", name: "Jl. Suweta", coordinates: [[-8.501, 115.262], [-8.504, 115.262], [-8.5068, 115.262]] },
  { id: "bisma", name: "Jl. Bisma", coordinates: [[-8.5069, 115.257], [-8.51, 115.2575], [-8.514, 115.259]] },
  { id: "hanoman", name: "Jl. Hanoman", coordinates: [[-8.5067, 115.267], [-8.51, 115.2675], [-8.514, 115.268]] },
];

export const initialEvents: CeremonyEvent[] = [
  { id: "YDN-001", name: "Pitra Yadnya · Ngaben Ageng", banjarId: "ubud-kaja", banjar: "Banjar Ubud Kaja", date: DEMO_DATE, startTime: "11:00", endTime: "16:30", closure: "Tutup Total", roadId: "raya-ubud", published: true, meaning: "Ngaben adalah upacara penghormatan kepada yang telah berpulang, mengembalikan unsur tubuh kepada alam. Hormati prosesi dan ikuti arahan pecalang." },
  { id: "YDN-002", name: "Piodalan Pura Desa & Puseh", banjarId: "ubud-kaja", banjar: "Banjar Ubud Kaja", date: "2026-09-19", startTime: "14:00", endTime: "21:00", closure: "Buka-Tutup", roadId: "suweta", published: true, meaning: "Piodalan merupakan peringatan hari suci sebuah pura. Berikan ruang kepada umat yang bersembahyang dan hindari membunyikan klakson di sekitar prosesi." },
  { id: "YDN-003", name: "Pawiwahan Krama Banjar", banjarId: "ubud-kaja", banjar: "Banjar Ubud Kaja", date: "2026-09-21", startTime: "08:00", endTime: "13:00", closure: "Buka-Tutup", roadId: "bisma", published: false, meaning: "Pawiwahan adalah upacara pernikahan dalam tradisi Hindu Bali. Berkendaralah perlahan dan hormati keluarga serta tamu yang hadir." },
  { id: "YDN-004", name: "Prosesi Melasti Padangtegal", banjarId: "padangtegal", banjar: "Banjar Padangtegal", date: "2026-09-23", startTime: "06:00", endTime: "10:00", closure: "Tutup Total", roadId: "hanoman", published: true, meaning: "Melasti merupakan ritual penyucian yang berkaitan dengan sumber air suci. Jangan memotong barisan iring-iringan upacara." },
];
