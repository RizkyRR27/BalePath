import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { DEMO_DATE } from "@/data/catalog/demo-data";

/**
 * Data inisial secukupnya untuk shared store BanjarEvent.
 * Dipakai hanya saat localStorage masih kosong — BUKAN hardcoded di komponen peta.
 * Koordinat di kawasan Ubud, Gianyar (sejalan dengan peta publik).
 */
export const banjarEventSeeds: BanjarEvent[] = [
  {
    id: "BE-001",
    title: "Pitra Yadnya · Ngaben Ageng",
    banjarName: "Banjar Ubud Kaja",
    startDate: DEMO_DATE,
    endDate: DEMO_DATE,
    startTime: "11:00",
    endTime: "16:30",
    description:
      "Ngaben adalah upacara penghormatan kepada yang telah berpulang, mengembalikan unsur tubuh kepada alam. Hormati prosesi dan ikuti arahan pecalang.",
    roadSegments: [
      {
        id: "BE-001-seg-1",
        status: "TUTUP_TOTAL",
        coordinates: [
          [-8.5069, 115.257],
          [-8.5068, 115.262],
          [-8.5067, 115.267],
        ],
        createdAt: "2026-09-17T04:00:00.000Z",
      },
      {
        id: "BE-001-seg-2",
        status: "JALUR_ALTERNATIF",
        coordinates: [
          [-8.501, 115.262],
          [-8.504, 115.262],
          [-8.5068, 115.262],
        ],
        createdAt: "2026-09-17T04:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T04:00:00.000Z",
  },
  {
    id: "BE-002",
    title: "Piodalan Pura Desa & Puseh",
    banjarName: "Banjar Ubud Kaja",
    startDate: "2026-09-19",
    endDate: "2026-09-19",
    startTime: "14:00",
    endTime: "21:00",
    description:
      "Piodalan merupakan peringatan hari suci sebuah pura. Berikan ruang kepada umat yang bersembahyang dan hindari membunyikan klakson di sekitar prosesi.",
    roadSegments: [
      {
        id: "BE-002-seg-1",
        status: "BUKA_TUTUP",
        coordinates: [
          [-8.5069, 115.257],
          [-8.51, 115.2575],
          [-8.514, 115.259],
        ],
        createdAt: "2026-09-17T05:00:00.000Z",
      },
      {
        id: "BE-002-seg-2",
        status: "HANYA_MOTOR",
        coordinates: [
          [-8.5067, 115.267],
          [-8.51, 115.2675],
          [-8.514, 115.268],
        ],
        createdAt: "2026-09-17T05:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T05:00:00.000Z",
  },
  {
    id: "BE-003",
    title: "Karya Agung & Pawai Gebogan",
    banjarName: "Banjar Padangtegal",
    startDate: "2026-09-19",
    endDate: "2026-09-21",
    startTime: "08:00",
    endTime: "18:00",
    description:
      "Rangkaian karya selama tiga hari dengan pawai gebogan di sekitar pura. Contoh kegiatan multi-hari untuk menguji filter rentang tanggal (muncul pada 19, 20, maupun 21 September).",
    roadSegments: [
      {
        id: "BE-003-seg-1",
        status: "HANYA_MOTOR",
        coordinates: [
          [-8.5085, 115.259],
          [-8.51, 115.261],
          [-8.5115, 115.2635],
        ],
        createdAt: "2026-09-17T06:00:00.000Z",
      },
      {
        id: "BE-003-seg-2",
        status: "JALUR_ALTERNATIF",
        coordinates: [
          [-8.505, 115.264],
          [-8.507, 115.2655],
          [-8.509, 115.267],
        ],
        createdAt: "2026-09-17T06:05:00.000Z",
      },
    ],
    createdAt: "2026-09-17T06:00:00.000Z",
  },
];
