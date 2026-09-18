"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dummyAdmin } from "@/data/catalog/demo-data";
import { createSessionRepository } from "@/infrastructure/storage/session-storage";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

type AuthState = { user: typeof dummyAdmin | null; ready: boolean; login: (email: string, password: string) => boolean; logout: () => void };
const AuthContext = createContext<AuthState | null>(null);
const repository = createSessionRepository();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<typeof dummyAdmin | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = repository.load();
      if (saved?.id === dummyAdmin.id && saved.expires > Date.now()) setUser(dummyAdmin);
      else repository.clear();
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function login(email: string, password: string) {
    if (email.trim().toLowerCase() !== dummyAdmin.email || password !== "admin123") return false;
    repository.save({ id: dummyAdmin.id, expires: Date.now() + SESSION_TTL_MS });
    setUser(dummyAdmin);
    return true;
  }
  function logout() {
    repository.clear();
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider belum terpasang");
  return context;
}
