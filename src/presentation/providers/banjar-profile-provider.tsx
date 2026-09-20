"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { BanjarProfile } from "@/domain/entities/banjar-profile";
import { initialBanjarProfiles } from "@/infrastructure/dummy/dummy-banjar-profiles";
import { isValidBanjarProfile } from "@/application/use-cases/banjar-profile-validation";
import { createDummyBanjarProfileRepository } from "@/infrastructure/repositories/dummy-banjar-profile-repository";
import { useAuth } from "./auth-provider";

type ProfileState = { profile: BanjarProfile | null; ready: boolean; saveProfile: (profile: BanjarProfile) => boolean };
const ProfileContext = createContext<ProfileState | null>(null);
const repository = createDummyBanjarProfileRepository();

export function BanjarProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<BanjarProfile[]>(initialBanjarProfiles);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setProfiles(repository.load()); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) repository.save(profiles); }, [profiles, ready]);
  function saveProfile(profile: BanjarProfile) {
    if (!user || profile.banjarId !== user.banjarId || !isValidBanjarProfile(profile)) return false;
    setProfiles((current) => current.some((item) => item.banjarId === profile.banjarId) ? current.map((item) => item.banjarId === profile.banjarId ? profile : item) : [...current, profile]);
    return true;
  }
  const profile = profiles.find((item) => item.banjarId === user?.banjarId) ?? null;
  return <ProfileContext.Provider value={{ profile, ready, saveProfile }}>{children}</ProfileContext.Provider>;
}

export function useBanjarProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("BanjarProfileProvider belum terpasang");
  return context;
}
