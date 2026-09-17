"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dummyAdmin } from "@/lib/data";

type AuthState = { user: typeof dummyAdmin | null; ready: boolean; login: (email: string, password: string) => boolean; logout: () => void };
const AuthContext = createContext<AuthState | null>(null);
const KEY = "balepath.demo.session.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<typeof dummyAdmin | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
        if (saved?.id === dummyAdmin.id && typeof saved.expires === "number" && saved.expires > Date.now()) setUser(dummyAdmin);
        else sessionStorage.removeItem(KEY);
      } catch { }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function login(email: string, password: string) {
    if (email.trim().toLowerCase() !== dummyAdmin.email || password !== "admin123") return false;
    try { sessionStorage.setItem(KEY, JSON.stringify({ id: dummyAdmin.id, expires: Date.now() + 8 * 60 * 60 * 1000 })); } catch { }
    setUser(dummyAdmin);
    return true;
  }
  function logout() {
    try { sessionStorage.removeItem(KEY); } catch { }
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider belum terpasang");
  return context;
}
