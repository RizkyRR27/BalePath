"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Flower2, Info, MapPin, Search } from "lucide-react";
import { useEvents } from "@/presentation/providers/events-provider";
import { DEMO_DATE, roads } from "@/data/catalog/demo-data";
import type { CeremonyEvent } from "@/domain/entities/ceremony-event";
import { formatDate } from "@/domain/formatters/format-date";
import { localePath } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";

function dateKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function validDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return DEMO_DATE;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && dateKey(date) === value ? value : DEMO_DATE;
}

function CalendarContent() {
  const { events, ready } = useEvents();
  const { locale, t } = useTranslation();
  const params = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(() => validDate(params.get("date")));
  const [month, setMonth] = useState(() => new Date(`${validDate(params.get("date")).slice(0, 7)}-01T12:00:00Z`));
  const [query, setQuery] = useState("");
  const [closure, setClosure] = useState("all");
  const filters = [{ value: "all", label: t.map.filterAll }, { value: "Tutup Total", label: t.closure["Tutup Total"] }, { value: "Buka-Tutup", label: t.closure["Buka-Tutup"] }];
  const published: CeremonyEvent[] = ready ? events.filter((event: CeremonyEvent) => event.published) : [];
  const filtered = published.filter((event) => (closure === "all" || event.closure === closure) && `${event.name} ${event.banjar} ${roads.find((road) => road.id === event.roadId)?.name ?? ""}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
  const monthKey = dateKey(month).slice(0, 7);
  const monthEvents = filtered.filter((event) => event.date.startsWith(monthKey));
  const dayEvents = filtered.filter((event) => event.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const firstDay = month.getUTCDay();
  const daysInMonth = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const monthLabel = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "id-ID", { month: "long", year: "numeric", timeZone: "UTC" }).format(month);
  function changeMonth(amount: number) {
    const next = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + amount, 1, 12));
    setMonth(next);
    setSelectedDate(dateKey(next));
  }
  function resetDate() {
    setMonth(new Date(`${DEMO_DATE.slice(0, 7)}-01T12:00:00Z`));
    setSelectedDate(DEMO_DATE);
  }

  return (
    <div className="public-container">
      <section className="public-intro public-calendar-intro"><div><p className="public-eyebrow"><span className="public-tiny-diamond" /> {t.calendar.eyebrow}</p><h1>{t.calendar.title} <em>{t.calendar.titleEmphasis}</em></h1><p className="public-lead">{t.calendar.lead}</p></div><div className="public-location"><CalendarDays size={23} strokeWidth={1.5} aria-hidden="true" /><div><strong>{t.calendar.agendaLocation}</strong><span>{t.calendar.demoSchedule}</span></div></div></section>
      <div className="public-calendar-toolbar"><label className="public-search"><Search size={18} aria-hidden="true" /><span className="public-sr-only">{t.calendar.searchLabel}</span><input type="search" placeholder={t.calendar.searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="public-filter-group" aria-label={t.calendar.filterLabel}>{filters.map(({ value, label }) => <button type="button" key={value} aria-pressed={closure === value} onClick={() => setClosure(value)}>{label}</button>)}</div></div>
      <div className="public-calendar-layout">
        <section className="public-calendar-panel" aria-labelledby="month-title">
          <div className="public-calendar-heading"><div><p className="public-eyebrow">{t.calendar.monthly}</p><h2 id="month-title" aria-live="polite">{monthLabel}</h2></div><div className="public-month-actions"><button type="button" className="public-action public-demo-reset" onClick={resetDate}>{t.common.demoDate}</button><button type="button" className="public-icon-button" onClick={() => changeMonth(-1)} aria-label={t.calendar.previousMonth}><ChevronLeft size={20} /></button><button type="button" className="public-icon-button" onClick={() => changeMonth(1)} aria-label={t.calendar.nextMonth}><ChevronRight size={20} /></button></div></div>
          <div className="public-calendar-legend"><span><i className="public-dot public-dot-full" /> {t.closure["Tutup Total"]}</span><span><i className="public-dot public-dot-partial" /> {t.closure["Buka-Tutup"]}</span><span className="public-calendar-total">{monthEvents.length} {t.calendar.monthAgenda}</span></div>
          <div className="public-weekdays" aria-hidden="true">{t.calendar.weekdays.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="public-days" aria-label={`${t.calendar.chooseDate} ${monthLabel}`}>
            {Array.from({ length: cells }, (_, index) => {
              const day = index - firstDay + 1;
              if (day < 1 || day > daysInMonth) return <div key={`empty-${index}`} className="public-day-empty" aria-hidden="true" />;
              const key = `${monthKey}-${String(day).padStart(2, "0")}`;
              const scheduled = monthEvents.filter((event) => event.date === key);
              const full = scheduled.some((event) => event.closure === "Tutup Total");
              const partial = scheduled.some((event) => event.closure === "Buka-Tutup");
              return <button type="button" key={key} className={`public-day ${selectedDate === key ? "public-day-selected" : ""} ${key === DEMO_DATE ? "public-day-demo" : ""}`} onClick={() => setSelectedDate(key)} aria-pressed={selectedDate === key} aria-label={`${formatDate(key, locale)}, ${scheduled.length} ${t.calendar.agendaUnit}${full ? `, ${t.closure["Tutup Total"]}` : ""}${partial ? `, ${t.closure["Buka-Tutup"]}` : ""}${key === DEMO_DATE ? `, ${t.calendar.demoShort}` : ""}`}><span className="public-day-number">{day}</span><span className="public-day-indicators" aria-hidden="true">{full && <i className="public-dot public-dot-full" />}{partial && <i className="public-dot public-dot-partial" />}</span>{scheduled.length > 0 && <span className="public-day-event" aria-hidden="true">{scheduled[0].name}{scheduled.length > 1 ? ` +${scheduled.length - 1}` : ""}</span>}</button>;
            })}
          </div>
          <div className="public-calendar-caption"><Info size={16} aria-hidden="true" /><p>{t.calendar.selectDate}</p></div>
          <div className="public-calendar-stats"><div><strong>{monthEvents.length.toString().padStart(2, "0")}</strong><span>{t.calendar.published}</span></div><div><strong>{new Set(monthEvents.map((event) => event.banjarId)).size.toString().padStart(2, "0")}</strong><span>{t.calendar.participating}</span></div><div><strong>{new Set(monthEvents.map((event) => event.roadId)).size.toString().padStart(2, "0")}</strong><span>{t.calendar.scheduledRoads}</span></div></div>
        </section>
        <section className="public-day-agenda" aria-labelledby="day-title" aria-live="polite">
          <div className="public-section-bar"><div><p className="public-eyebrow">{t.calendar.dateAgenda}</p><h2 id="day-title" className="public-serif-title">{formatDate(selectedDate, locale)}</h2></div><span className="public-count">{dayEvents.length}</span></div>
          {!ready ? <div className="public-empty" role="status">{t.calendar.preparing}</div> : dayEvents.length === 0 ? <div className="public-empty public-calendar-empty"><CalendarDays size={36} strokeWidth={1} aria-hidden="true" /><h3>{t.calendar.emptyTitle}</h3><p>{t.calendar.emptyText}</p>{(query || closure !== "all") && <button type="button" className="public-action" onClick={() => { setQuery(""); setClosure("all"); }}>{t.calendar.clearFilter}</button>}</div> : dayEvents.map((event) => <article key={event.id} className="public-calendar-event"><div className="public-between"><span className={`public-status ${event.closure === "Tutup Total" ? "public-full" : "public-partial"}`}>{t.closure[event.closure]}</span><Flower2 size={21} className="public-gold" strokeWidth={1.5} aria-hidden="true" /></div><h3>{event.name}</h3><p className="public-icon-line"><MapPin size={15} aria-hidden="true" />{event.banjar}</p><div className="public-calendar-event-time"><Clock3 size={17} aria-hidden="true" /><strong>{event.startTime} – {event.endTime} WITA</strong></div><p className="public-event-road">{roads.find((road) => road.id === event.roadId)?.name ?? t.map.roadUnavailable}</p><details className="public-culture-details"><summary>{t.calendar.cultureDetails}</summary><p>{event.meaning || t.calendar.meaningMissing}</p><p>{t.calendar.etiquette}</p></details><Link href={localePath("/", locale)} className="public-text-link">{t.calendar.exploreMap} <ArrowRight size={15} aria-hidden="true" /></Link></article>)}
          <div className="public-calendar-reminder"><span className="public-poleng" aria-hidden="true" /><div><strong>{t.calendar.reminderTitle}</strong><p>{t.calendar.reminderText}</p></div></div>
        </section>
      </div>
      <section className="public-harmony"><Flower2 size={30} strokeWidth={1} aria-hidden="true" /><div><h2>{t.calendar.harmonyTitle}</h2><p>{t.calendar.harmonyText}</p></div><span className="public-small-label">{t.map.harmonyLabel}</span></section>
    </div>
  );
}

export default function CalendarPage() {
  return <Suspense fallback={<div className="public-container public-empty" role="status">Preparing…</div>}><CalendarContent /></Suspense>;
}
