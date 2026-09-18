export type Closure = "Tutup Total" | "Buka-Tutup";

export type CeremonyEvent = {
  id: string;
  name: string;
  banjarId: string;
  banjar: string;
  date: string;
  startTime: string;
  endTime: string;
  closure: Closure;
  roadId: string;
  published: boolean;
  meaning: string;
};
