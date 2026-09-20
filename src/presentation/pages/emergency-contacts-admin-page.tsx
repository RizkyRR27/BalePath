"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { EmergencyContact } from "@/domain/entities/emergency-contact";
import { useAuth } from "@/presentation/providers/auth-provider";
import { useEmergencyContacts } from "@/presentation/providers/emergency-contact-provider";
import { useTranslation } from "@/presentation/i18n/translation-provider";

export default function EmergencyContactsAdminPage() {
  const { user } = useAuth();
  const { contacts, saveContact, deleteContact } = useEmergencyContacts();
  const { t } = useTranslation();
  const d = t.management;
  const blank = { id: "", postName: "", phone: "", whatsapp: "", verified: false };
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  function edit(contact: EmergencyContact) { setForm({ id: contact.id, postName: contact.postName, phone: contact.phone, whatsapp: contact.whatsapp, verified: contact.verified }); setMessage(""); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const contact = { ...form, id: form.id.trim(), banjarId: user?.banjarId ?? "", postName: form.postName.trim() };
    if (!saveContact(contact)) { setMessage(d.invalid); return; }
    setForm(blank); setMessage(d.saved);
  }
  const owned = contacts.filter((contact) => contact.banjarId === user?.banjarId);
  return <><div className="breadcrumb">{d.contactsTitle}</div><section className="admin-welcome"><div><p className="eyebrow">{t.adminShell.portalTag}</p><h1>{d.contactsTitle}</h1><p className="muted">{d.contactsIntro}</p></div></section><div className="admin-workspace"><section className="panel"><div className="section-title"><h3><Plus size={20} />{form.id ? d.editContact : d.addContact}</h3>{form.id && <button className="text-button" type="button" onClick={() => setForm(blank)}>{d.cancel}</button>}</div><form className="stack" onSubmit={submit}><label>{d.postName}<input required value={form.postName} onChange={(e) => setForm({ ...form, postName: e.target.value })} /></label><label>{d.phone}<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>{d.whatsapp}<input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></label><label><input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} /> {d.verified}</label>{message && <p className="success-message" role="status">{message}</p>}<button className="button primary" type="submit"><Save size={17} />{d.saveContact}</button></form></section><section className="panel"><div className="section-title"><h3>{d.contactsTitle}</h3></div>{owned.length === 0 ? <p className="muted">{d.noContacts}</p> : <div className="stack">{owned.map((contact) => <article className="managed-event" key={contact.id}><div><h3>{contact.postName}</h3><p className="muted small">{contact.phone || d.noContacts} · {contact.verified ? d.verified : t.impact.unverified}</p></div><div className="row"><button className="button secondary" type="button" onClick={() => edit(contact)}><Pencil size={15} />{d.editContact}</button><button className="icon-button danger" type="button" aria-label={`${d.delete} ${contact.postName}`} onClick={() => window.confirm(d.confirmDelete) && deleteContact(contact.id)}><Trash2 size={16} /></button></div></article>)}</div>}</section></div></>;
}
