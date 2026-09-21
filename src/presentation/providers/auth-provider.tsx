"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Admin } from "@/domain/entities/admin";
import { dummyAdmins } from "@/data/catalog/demo-data";
import { createSessionRepository } from "@/infrastructure/storage/session-storage";

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const DEMO_PASSWORD = "admin123";

type AuthState = { user: Admin | null; ready: boolean; login: (email: string, password: string) => boolean; logout: () => void };
const AuthContext = createContext<AuthState | null>(null);
const repository = createSessionRepository();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = repository.load();
      const account = saved && saved.expires > Date.now()
        ? dummyAdmins.find((admin) => admin.id === saved.id) ?? null
        : null;
      if (account) setUser(account);
      else repository.clear();
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function login(email: string, password: string) {
    const account = dummyAdmins.find((admin) => admin.email === email.trim().toLowerCase()) ?? null;
    if (!account || password !== DEMO_PASSWORD) return false;
    repository.save({ id: account.id, expires: Date.now() + SESSION_TTL_MS });
    setUser(account);
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
