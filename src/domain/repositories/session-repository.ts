export type Session = { id: string; expires: number };

export interface SessionRepository {
  load(): Session | null;
  save(session: Session): void;
  clear(): void;
}
