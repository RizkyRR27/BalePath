"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "@/presentation/providers/auth-provider";
import { useBanjarProfile } from "@/presentation/providers/banjar-profile-provider";
import { useTranslation } from "@/presentation/i18n/translation-provider";

export default function BanjarProfileAdminPage() {
  const { user } = useAuth();
  const { profile, saveProfile } = useBanjarProfile();
  const { t } = useTranslation();
  const d = t.management;
  // Nama banjar tersinkron akun login — tidak dapat diubah manual.
  const syncedName = user?.banjar ?? "";
  const [form, setForm] = useState(() => ({ banjarId: user?.banjarId ?? "", name: profile?.name ?? user?.banjar ?? "", location: profile?.location ?? "", description: profile?.description ?? "", contactName: profile?.contactName ?? "", contactPhone: profile?.contactPhone ?? "" }));
  const [message, setMessage] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!user) { setMessage(d.invalid); return; }
    setMessage(saveProfile({ ...form, banjarId: user.banjarId, name: syncedName }) ? d.saved : d.invalid);
  }
  return <><div className="breadcrumb">{d.profileTitle}</div><section className="admin-welcome"><div><p className="eyebrow">{t.adminShell.portalTag}</p><h1>{d.profileTitle}</h1><p className="muted">{d.profileIntro}</p></div></section><section className="panel"><form className="stack" onSubmit={submit}><label>{d.banjarName}<input required readOnly value={syncedName} aria-readonly="true" /><span className="muted small">{d.syncedNote}</span></label><label>{d.location}<input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label><label>{d.description}<textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>{d.contactName}<input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></label><label>{d.contactPhone}<input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></label>{message && <p className="success-message" role="status">{message}</p>}<button className="button primary" type="submit"><Save size={17} />{d.saveProfile}</button></form></section></>;
}
