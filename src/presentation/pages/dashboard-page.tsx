"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, FilePenLine, MapPin, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/presentation/providers/auth-provider";
import { useBanjarEvents } from "@/presentation/providers/banjar-events-provider";
import { DEMO_DATE } from "@/data/catalog/demo-data";
import type { BanjarEvent } from "@/domain/entities/banjar-event";
import { SEGMENT_META, type RoadSegment } from "@/domain/entities/road-segment";
import { formatDate } from "@/domain/formatters/format-date";
import { AdminRoadPicker } from "@/presentation/components/admin-road-picker";
import { useTranslation } from "@/presentation/i18n/translation-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const { events, ready, saveBanjarEvent, removeBanjarEvent } = useBanjarEvents();
  const { locale, t } = useTranslation();
  const d = t.dashboard;

  const [title, setTitle] = useState("");
  const [banjarName, setBanjarName] = useState("");
  const [banjarTouched, setBanjarTouched] = useState(false);
  const [startDate, setStartDate] = useState(DEMO_DATE);
  const [endDate, setEndDate] = useState(DEMO_DATE);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("15:00");
  const [description, setDescription] = useState("");
  const [segments, setSegments] = useState<RoadSegment[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || banjarTouched || banjarName !== "") return;
    const timer = setTimeout(() => setBanjarName(user.banjar), 0);
    return () => clearTimeout(timer);
  }, [user, banjarTouched, banjarName]);

  const totalSegments = events.reduce((sum, event) => sum + event.roadSegments.length, 0);
  const fullClosed = events.reduce(
    (sum, event) => sum + event.roadSegments.filter((segment) => segment.status === "TUTUP_TOTAL").length,
    0,
  );

  function reset() {
    setTitle("");
    setBanjarTouched(false);
    setBanjarName(user?.banjar ?? "");
    setStartDate(DEMO_DATE);
    setEndDate(DEMO_DATE);
    setStartTime("10:00");
    setEndTime("15:00");
    setDescription("");
    setSegments([]);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!user) return;
    if (!title.trim()) { setError(d.invalidName); return; }
    if (!banjarName.trim()) { setError(d.invalidBanjar); return; }
    if (!startDate || !endDate || endDate < startDate) { setError(d.invalidDateRange); return; }
    if (startDate === endDate && startTime >= endTime) { setError(d.invalidTime); return; }
    if (segments.length < 1) { setError(d.needSegment); return; }
    const payload: BanjarEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      banjarName: banjarName.trim(),
      startDate,
      endDate,
      startTime,
      endTime,
      description: description.trim() ? description.trim() : undefined,
      roadSegments: segments,
      createdAt: new Date().toISOString(),
    };
    if (saveBanjarEvent(payload)) {
      setMessage(`${d.savedEvent} (${segments.length} ${d.segUnit}.)`);
      reset();
    } else {
      setError(d.saveError);
    }
  }

  function dateRange(event: BanjarEvent) {
    return event.startDate === event.endDate
      ? formatDate(event.startDate, locale)
      : `${formatDate(event.startDate, locale)} – ${formatDate(event.endDate, locale)}`;
  }

  if (!ready) return <div className="loading-screen" role="status">{t.common.loading}</div>;

  return <>
    <div className="breadcrumb">{d.breadcrumbPortal} <ChevronRight size={14} /> {d.breadcrumbDashboard}</div>
    <section className="admin-welcome">
      <div>
        <p className="eyebrow"><span className="poleng" /> {user?.banjar}</p>
        <h1>{d.welcome}<br /><em>{d.welcomeEmphasis}</em></h1>
        <p className="muted">{d.welcomeText}<br />{d.welcomeText2}</p>
      </div>
      <div className="welcome-aside">
        <span className="badge demo-badge"><ShieldCheck size={14} /> {d.demoMode}</span>
        <p><CalendarDays size={16} /> {formatDate(DEMO_DATE, locale)}</p>
        <small>{d.dummySchedule}</small>
      </div>
    </section>

    <section className="stats-grid" aria-label={d.summary}>
      <div className="stat-card">
        <span className="stat-icon"><CalendarDays size={22} /></span>
        <div><span className="muted">{d.statsEvents}</span><strong>{events.length.toString().padStart(2, "0")}</strong></div>
        <small>{d.statsEventsHelp}</small>
      </div>
      <div className="stat-card">
        <span className="stat-icon green"><MapPin size={22} /></span>
        <div><span className="muted">{d.statsSegments}</span><strong>{totalSegments.toString().padStart(2, "0")}</strong></div>
        <small>{d.statsSegmentsHelp}</small>
      </div>
      <div className="stat-card">
        <span className="stat-icon clay"><ShieldCheck size={22} /></span>
        <div><span className="muted">{d.statsFull}</span><strong>{fullClosed.toString().padStart(2, "0")}</strong></div>
        <small>{d.statsFullHelp}</small>
      </div>
    </section>

    <div className="section-title">
      <div><p className="eyebrow">{d.workspace}</p><h2>{d.planTitle}</h2></div>
      <span className="muted small">{d.steps} <ChevronRight size={13} /> {d.step2} <ChevronRight size={13} /> {d.step3}</span>
    </div>

    <div className="admin-workspace">
      <section className="panel event-editor">
        <div className="section-title"><h3><FilePenLine size={20} /> {d.newTitle}</h3></div>
        <p className="muted small">{d.clearInfo}</p>
        <form className="stack" onSubmit={submit}>
          <label>{d.ceremonyName}
            <input ref={titleInput} required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={d.ceremonyPlaceholder} />
          </label>
          <label>{d.banjarName}
            <input required maxLength={120} value={banjarName} onChange={(e) => { setBanjarName(e.target.value); setBanjarTouched(true); }} />
          </label>
          <div className="form-grid">
            <label>{d.startDate}<input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
            <label>{d.endDate}<input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
          </div>
          <div className="form-grid">
            <label>{d.startTime}<input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
            <label>{d.endTime}<input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} /></label>
          </div>
          <label>{d.meaning} <span className="muted">({d.optional})</span>
            <textarea rows={3} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={d.meaningPlaceholder} />
          </label>
          {error && <p role="alert" className="error-message">{error}</p>}
          <p className="muted small" aria-live="polite">
            {segments.length === 0 ? d.segNone : `${segments.length} ${d.segReady}`}
          </p>
          <button type="submit" className="button primary"><Save size={17} />{d.saveEvent}</button>
          <p className="muted small">{d.storedNote}</p>
        </form>
      </section>

      <section className="panel spatial-editor">
        <div className="section-title">
          <div><h3><MapPin size={20} /> {d.mapInteractive}</h3><p className="eyebrow">{d.mapInteractiveSub}</p></div>
        </div>
        <AdminRoadPicker segments={segments} onSegmentsChange={setSegments} />
        <div className="notice"><ShieldCheck size={19} /><p>{d.storedNote}</p></div>
      </section>
    </div>

    <section className="agenda-managed">
      <div className="section-title">
        <div><p className="eyebrow">{d.coordination}</p><h2>{d.listTitle}</h2><p className="muted small">{d.listSub}</p></div>
      </div>
      {message && <p className="success-message" role="status"><Check size={18} />{message}</p>}
      <div className="managed-list">
        {events.length === 0 ? (
          <div className="panel empty-state">
            <CalendarDays size={32} />
            <h3>{d.emptyEvents}</h3>
            <button className="button secondary" onClick={() => titleInput.current?.focus()}><Plus size={16} /> {d.create}</button>
          </div>
        ) : events.map((event) => (
          <article className="managed-event" key={event.id}>
            <div>
              <span className="muted small"><MapPin size={14} />{event.banjarName} · {event.roadSegments.length} {d.segUnit}</span>
              <h3>{event.title}</h3>
              <p className="muted small">
                {event.roadSegments.map((segment) => (
                  <span key={segment.id} className="admin-road-badge" style={{ backgroundColor: SEGMENT_META[segment.status].color }}>
                    {SEGMENT_META[segment.status].label}
                  </span>
                ))}
              </p>
            </div>
            <div className="event-schedule">
              <strong>{dateRange(event)}</strong>
              <span><Clock3 size={14} /> {event.startTime} – {event.endTime} WITA</span>
            </div>
            <div className="event-actions">
              <div className="row">
                <button className="icon-button danger" aria-label={`${d.delete} ${event.title}`} onClick={() => setDeleting(event.id)}><Trash2 size={16} /></button>
              </div>
              {deleting === event.id && (
                <div className="delete-confirm" role="group" aria-label={d.deleteConfirm}>
                  <p>{d.deleteQuestion}</p>
                  <button className="button secondary" onClick={() => setDeleting(null)}>{d.cancel}</button>
                  <button className="button danger" onClick={() => { removeBanjarEvent(event.id); setDeleting(null); setMessage(d.deletedSuccess); }}>{d.confirmDelete}</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  </>;
}
