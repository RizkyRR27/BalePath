"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { Road } from "@/domain/entities/road";
import { useRoads } from "@/presentation/providers/roads-provider";
import { useTranslation } from "@/presentation/i18n/translation-provider";

export default function RoadsAdminPage() {
  const { roads, saveRoad, deleteRoad } = useRoads();
  const { t } = useTranslation();
  const d = t.management;
  const blank = { id: "", name: "", coordinates: "" };
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  function edit(road: Road) { setForm({ id: road.id, name: road.name, coordinates: road.coordinates.map((point) => point.join(", ")).join("\n") }); setMessage(""); }
  function submit(event: FormEvent) {
    event.preventDefault();
    const coordinates = form.coordinates.split(/\n+/).map((line) => line.split(",").map(Number)).filter((point): point is [number, number] => point.length === 2 && point.every(Number.isFinite));
    if (!saveRoad({ id: form.id.trim(), name: form.name.trim(), coordinates })) { setMessage(d.invalid); return; }
    setForm(blank); setMessage(d.saved);
  }
  return <><div className="breadcrumb">{d.roadsTitle}</div><section className="admin-welcome"><div><p className="eyebrow">{t.adminShell.portalTag}</p><h1>{d.roadsTitle}</h1><p className="muted">{d.roadsIntro}</p></div></section><div className="admin-workspace"><section className="panel"><div className="section-title"><h3><Plus size={20} />{form.id ? d.editRoad : d.addRoad}</h3>{form.id && <button className="text-button" type="button" onClick={() => setForm(blank)}>{d.cancel}</button>}</div><form className="stack" onSubmit={submit}><label>{d.roadId}<input required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></label><label>{d.roadName}<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>{d.coordinates}<textarea required rows={6} value={form.coordinates} onChange={(e) => setForm({ ...form, coordinates: e.target.value })} /><span className="muted small">{d.coordinatesHelp}</span></label>{message && <p className="success-message" role="status">{message}</p>}<button className="button primary" type="submit"><Save size={17} />{d.saveRoad}</button></form></section><section className="panel"><div className="section-title"><h3>{d.roadsTitle}</h3></div>{roads.length === 0 ? <p className="muted">{d.noRoads}</p> : <div className="stack">{roads.map((road) => <article className="managed-event" key={road.id}><div><h3>{road.name}</h3><p className="muted small">{road.id} · {road.coordinates.length} points</p></div><div className="row"><button className="button secondary" type="button" onClick={() => edit(road)}><Pencil size={15} />{d.editRoad}</button><button className="icon-button danger" type="button" aria-label={`${d.delete} ${road.name}`} onClick={() => window.confirm(d.confirmDelete) && deleteRoad(road.id)}><Trash2 size={16} /></button></div></article>)}</div>}</section></div></>;
}
