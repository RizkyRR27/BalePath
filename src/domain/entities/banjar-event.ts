import type { RoadSegment } from "./road-segment";

/**
 * BanjarEvent — model kanonis kegiatan + penutupan jalan.
 * Dipakai bersama oleh modul Admin (form input) dan modul Publik (peta user).
 * roadSegments selalu membawa koordinat [lat, lng] hasil snap OSRM.
 */
export interface BanjarEvent {
  id: string;
  /** Kunci relasi ke banjar pemilik — distempel otomatis dari akun admin saat menyimpan. */
  banjarId: string;
  title: string;
  banjarName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  description?: string;
  roadSegments: RoadSegment[];
  createdAt: string; // ISO timestamp
}
