"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { EmergencyContact } from "@/domain/entities/emergency-contact";
import { initialEmergencyContacts } from "@/infrastructure/dummy/dummy-emergency-contacts";
import { isValidEmergencyContact } from "@/application/use-cases/emergency-contact-validation";
import { createDummyEmergencyContactRepository } from "@/infrastructure/repositories/dummy-emergency-contact-repository";
import { useAuth } from "./auth-provider";

type ContactsState = { contacts: EmergencyContact[]; ready: boolean; saveContact: (contact: EmergencyContact) => boolean; deleteContact: (id: string) => void };
const ContactsContext = createContext<ContactsState | null>(null);
const repository = createDummyEmergencyContactRepository();

export function EmergencyContactProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialEmergencyContacts);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setContacts(repository.load()); setReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => { if (ready) repository.save(contacts); }, [contacts, ready]);
  function saveContact(contact: EmergencyContact) {
    if (!user || contact.banjarId !== user.banjarId || !isValidEmergencyContact(contact)) return false;
    setContacts((current) => current.some((item) => item.id === contact.id) ? current.map((item) => item.id === contact.id ? contact : item) : [...current, contact]);
    return true;
  }
  function deleteContact(id: string) {
    if (!user) return;
    setContacts((current) => current.filter((contact) => contact.id !== id || contact.banjarId !== user.banjarId));
  }
  // Public consumers (Tri Hita Karana page) have no session — expose all contacts and let
  // them pick; admin screens see the same list but mutations are scoped to user.banjarId.
  return <ContactsContext.Provider value={{ contacts, ready, saveContact, deleteContact }}>{children}</ContactsContext.Provider>;
}

export function useEmergencyContacts() {
  const context = useContext(ContactsContext);
  if (!context) throw new Error("EmergencyContactProvider belum terpasang");
  return context;
}
