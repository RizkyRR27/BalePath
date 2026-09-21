"use client";

// Foto referensi desain: src/presentation/assets/screens/tri-hita-karana.png
// (+ mockup HTML: src/presentation/screens/tri-hita/tri-hita-karana.html) → rute "/tri-hita-karana" halaman ini.

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/presentation/i18n/translation-provider";
import { localePath } from "@/presentation/i18n/locale";
import { useImpactData } from "@/presentation/providers/impact-data-provider";
import { useBanjarProfile } from "@/presentation/providers/banjar-profile-provider";
import { useEmergencyContacts } from "@/presentation/providers/emergency-contact-provider";
import { BadgeCheck, Calculator, Flower2, Handshake, Info, Leaf, Phone, ShieldCheck, Sprout, Sun, TimerOff, Users } from "lucide-react";
import "@/presentation/styles/impact.css";

const pillarMeta = [
  { icon: Flower2, detailIcon: BadgeCheck, tone: "gold" },
  { icon: Users, detailIcon: Handshake, tone: "coral" },
  { icon: Leaf, detailIcon: Sprout, tone: "green" },
];

const ceremonyMeta = [
  // Foto 1 — prosesi Melasti/iringan (tone coral).
  { tone: "coral", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBE2PptZTnNVbFEzYHA5S7MauW5VEnsygp_PA_G7jufpyj0f9w2VWJ6F7sen0nBKtak7FQuZfXkh6uFJKvYqhvSCVFZtlwFxK74c38H3zZ6LYZhSViIX2Kel4lPLQHwRHqXV_gng_x_mw3haShRz7Tv9XFWNHfkOgDmkUGJlFMxPIiasdjFC3IdNyW9LNseJQOJ0Sm-PHbr5rk7g6QVzdWHaS9IHKMg1qWlMxb1XcEqTLNeodNSVaxt" },
  // Foto 2 — upacara dewa yadnya di pura (tone gold).
  { tone: "gold", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-pl2sjlwY5YE4Y-B_A0EzWco6LzPbc0V4mpOU6a2sGd3KgxIN4dke0Qf39R9JMimRbvWGVv2y_--5GyH7iY_PCcOg7imtKC7E9kTvRjX2HmAID2Xlb5KYOK3b1_p7qBeYIPzyUKAEFq7jZolBD3eUdgCgJIU1zRThhKF0VWiqOeQrL0D3TpZn5nWFwtlIYLYd1_zlXwAh7Wdm4w8V40E3HkykMOv0VMyOTsETip0zIgC64SWZqdFK" },
  // Foto 3 — detail sarana/banten (tone stone).
  { tone: "stone", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWR-AgYMcR3e28oaB1ezM2pgKs0CWG9rEoo5WbsmbqK9G51YM3n1_MrrvL0boLpDhiHCjvzhEjmCJA3MAby5Poa5n5diKzVosGishaEvDfmtmHbN7Y2sbNJT2JZd3jI7FDqxdr2XX4VWCfDV_ve-rL1Df83s_u0IjLEZQAJaKW7xfmWjSKQCbDUD8YQjQX07MRM3cKl1XYjJz_EMn5nSidTCvU1acMsGxg2-xpn5mKGZoW2McLnYcq" },
  // Foto 4 — kebersamaan krama / gotong royong (tone green).
  { tone: "green", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLLM_lZS6lLg1EGfVSNbEU7PdOpSV3LP4vfENJ6jXNbhMN3Om8diu_0HhpLfKb1LuI35GIlJaY2uqU7HCayT6merM0jQma7yJn5TWdJtNB9Zbz3pTellrzmfTuI_uIxCpWja2U3XRhIvLZ9OeG1Eml9NZUcbtEIQpgcBM6zzUlXaTSFVpexVkhLsdMX6q1-8LI0gEU8vuTmmCvqyHeASH1uae0YT66T6vusuhkBe03pteehDwOhmTr" },
];

export default function TriHitaKaranaPage() {
  const { t, locale } = useTranslation();
  const impact = t.impact;
  const { vehicles, impactStat } = useImpactData();
  const { profile } = useBanjarProfile();
  const { contacts } = useEmergencyContacts();
  const [vehicleId, setVehicleId] = useState("motor");
  const [frequency, setFrequency] = useState(8);
  const vehicle = vehicles.find((item) => item.id === vehicleId) ?? vehicles[0];
  const fuel = vehicle.fuelRatePerKm * impactStat.avoidedDistanceKm * frequency;
  const co2 = fuel * impactStat.co2KgPerLiter;
  // Public page has no session — show the demo banjar's data, matching existing copy.
  const publicContact = contacts.find((contact) => contact.banjarId === "ubud-kaja") ?? null;
  const contactVerified = publicContact?.verified === true && !!publicContact.phone.trim();

  return (
    <div className="impact-page">
      <section className="impact-section impact-hero" aria-labelledby="impact-title">
        <div className="impact-container">
          <div className="impact-hero-heading">
            <div className="impact-hero-copy">
              <div className="impact-kicker"><span className="impact-badge">{impact.kicker}</span><span aria-hidden="true">·</span><span>{impact.eyebrow}</span></div>
              <h1 id="impact-title">{impact.heroTitle}</h1>
              <p>{impact.heroText}</p>
            </div>
            <a className="impact-hotline" href="#kontak-darurat"><ShieldCheck size={26} aria-hidden="true" /><span><small>{impact.hotlineSmall}</small><strong>{impact.hotline}</strong><span>{impact.hotlineUnavailable}</span></span></a>
          </div>
          <div className="impact-pillars">
            {impact.pillars.map((pillar, index) => {
              const meta = pillarMeta[index];
              const Icon = meta.icon;
              const DetailIcon = meta.detailIcon;
              return (
                <article className={`impact-pillar impact-tone-${meta.tone}`} key={pillar.name}>
                  <div className="impact-pillar-top"><span className="impact-icon"><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span><span className="impact-label">{pillar.label}</span></div>
                  <h2>{pillar.name}</h2><p>{pillar.description}</p>
                  <div className="impact-pillar-detail"><DetailIcon size={16} aria-hidden="true" /><span>{pillar.detail}</span></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="impact-section impact-dark" aria-labelledby="impact-metrics-title">
        <div className="impact-container">
          <div className="impact-section-heading impact-heading-split"><div><p className="impact-eyebrow">{impact.metricEyebrow}</p><h2 id="impact-metrics-title">{impact.metricTitle}</h2></div><p>{impact.metricNote.replace("{banjar}", profile?.name ?? "")}</p></div>
          <div className="impact-metrics">
            <article className="impact-metric impact-tone-green">
              <div className="impact-metric-top"><div><h3>{impact.emissionTitle}</h3><strong className="impact-metric-value">{impactStat.emissionKg.toLocaleString(locale === "en" ? "en-US" : "id-ID")}</strong><p>{impact.emissionUnit}</p></div><span className="impact-icon"><Leaf size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom"><svg className="impact-sparkline" viewBox="0 0 280 40" fill="none" aria-hidden="true"><path d="M0 35 L35 32 L70 28 L105 30 L140 20 L175 22 L210 12 L245 15 L280 4 L280 40 L0 40 Z" fill="currentColor" fillOpacity=".12" /><path d="M0 35 L35 32 L70 28 L105 30 L140 20 L175 22 L210 12 L245 15 L280 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><p><span className="impact-accent">↑ 18.2%</span> {impact.trend}</p></div>
            </article>
            <article className="impact-metric impact-tone-gold">
              <div className="impact-metric-top"><div><h3>{impact.idlingTitle}</h3><strong className="impact-metric-value">{impactStat.idlingPercent}%</strong><p>{impact.idlingUnit.replace("{min}", String(impactStat.idlingMinPercent)).replace("{target}", String(impactStat.idlingTargetPercent))}</p></div><span className="impact-icon"><TimerOff size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom"><progress className="impact-progress" value={impactStat.idlingPercent} max={impactStat.idlingTargetPercent} aria-label={impact.idleAria.replace("{value}", String(impactStat.idlingPercent)).replace("{target}", String(impactStat.idlingTargetPercent))} /><div className="impact-progress-labels"><span>{impact.min.replace("{value}", String(impactStat.idlingMinPercent))}</span><span className="impact-accent">{impact.simulation.replace("{value}", String(impactStat.idlingPercent))}</span><span>{impact.target.replace("{value}", String(impactStat.idlingTargetPercent))}</span></div></div>
            </article>
            <article className="impact-metric impact-tone-gold">
              <div className="impact-metric-top"><div><h3>{impact.harmonyTitle}</h3><strong className="impact-metric-value">{impactStat.ceremonyCount}</strong><p>{impact.harmonyUnit}</p></div><span className="impact-icon"><Sun size={24} aria-hidden="true" /></span></div>
              <div className="impact-metric-bottom impact-ceremony-count"><div className="impact-tokens" aria-hidden="true"><span>OG</span><span>ML</span><span>NG</span></div><p>{impact.harmonyNote}</p><span className="impact-example">{impact.sample}</span></div>
            </article>
          </div>

          <div className="impact-calculator" aria-labelledby="impact-calculator-title">
            <div className="impact-calculator-controls">
              <p className="impact-eyebrow"><Calculator size={20} aria-hidden="true" />{impact.calculatorKicker}</p>
              <h3 id="impact-calculator-title">{impact.calculatorTitle}</h3>
              <p>{impact.calculatorText}</p>
              <fieldset className="impact-vehicle-field"><legend>{impact.vehicleType}</legend><div className="impact-vehicle-options">{vehicles.map((item) => <button type="button" key={item.id} aria-pressed={vehicleId === item.id} onClick={() => setVehicleId(item.id)}>{item.label}</button>)}</div></fieldset>
              <div className="impact-frequency"><div className="impact-frequency-heading"><label htmlFor="detour-range">{impact.frequency}</label><span id="slider-val">{frequency} {impact.rerouting}</span></div><input id="detour-range" type="range" min="1" max="25" step="1" value={frequency} aria-valuetext={`${frequency} ${impact.rerouting}`} aria-describedby="impact-assumptions" onChange={(event) => setFrequency(Number(event.target.value))} /><div className="impact-range-labels"><span>{impact.oneTrip}</span><span>{impact.twentyFiveTrips}</span></div></div>
            </div>
            <div className="impact-result">
              <div className="impact-result-heading"><span>{impact.resultTitle}</span><span className="impact-poleng" aria-hidden="true"><i /><i /><i /></span></div>
              <div className="impact-result-values" role="status" aria-live="polite" aria-atomic="true">
                <div><label htmlFor="calc-fuel">{impact.fuelLabel}</label><output id="calc-fuel" htmlFor="detour-range">{fuel.toFixed(1)} Liter</output><span>{impact.perMonth}</span></div>
                <div><label htmlFor="calc-co2">{impact.co2Label}</label><output id="calc-co2" htmlFor="detour-range">{co2.toFixed(1)} kg</output><span>{impact.perMonth}</span></div>
              </div>
              <div className="impact-result-note"><Sprout size={24} aria-hidden="true" /><p>{impact.resultNote}</p></div>
              <p id="impact-assumptions" className="impact-assumptions">{impact.assumptions.replace("{distance}", String(impactStat.avoidedDistanceKm)).replace("{rates}", vehicles.map((item) => `${item.label} ${item.fuelRatePerKm}`).join(", ")).replace("{co2Rate}", String(impactStat.co2KgPerLiter))}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section impact-editorial" aria-labelledby="impact-ceremonies-title">
        <div className="impact-container">
          <div className="impact-section-heading impact-editorial-heading"><p className="impact-eyebrow">{impact.encyclopedia}</p><h2 id="impact-ceremonies-title">{impact.whyClosed}</h2><p>{impact.ceremonyIntro}</p></div>
          <div className="impact-ceremonies">
            {impact.ceremonies.map((ceremony, index) => {
              const meta = ceremonyMeta[index];
              return (
                <article className="impact-ceremony" key={ceremony.title}><div className="impact-ceremony-image"><Image src={meta.image} alt={ceremony.alt} fill unoptimized sizes="(max-width: 700px) 100vw, (max-width: 1439px) 50vw, 800px" /><span className={`impact-image-label impact-image-label-${meta.tone}`}>{ceremony.label}</span></div><div className="impact-ceremony-body"><h3>{ceremony.title}</h3><p>{ceremony.description}</p><div className="impact-ceremony-etiquette"><Info size={16} aria-hidden="true" /><p><strong>{impact.driverEtiquette}</strong> {ceremony.etiquette}</p></div></div></article>
              );
            })}
          </div>
          <section className="impact-etiquette" aria-labelledby="impact-etiquette-title"><div className="impact-etiquette-heading"><div><p className="impact-eyebrow">{impact.etiquetteGuide}</p><h3 id="impact-etiquette-title">{impact.etiquetteTitle}</h3></div><span className="impact-guidance-badge">{impact.generalGuide}</span></div><div className="impact-etiquette-grid">{impact.etiquette.map((item, index) => <article className="impact-etiquette-card" key={item.title}><span className="impact-step" aria-hidden="true">0{index + 1}</span><h4>{item.title}</h4><p>{item.description}</p></article>)}</div></section>
        </div>
      </section>

      <section className="impact-section impact-dark impact-contact" id="kontak-darurat" aria-labelledby="impact-contact-title" tabIndex={-1}>
        <div className="impact-container">
          <div className="impact-section-heading impact-contact-heading"><p className="impact-eyebrow">{impact.contactEyebrow}</p><h2 id="impact-contact-title">{impact.contactTitle.replace("{banjar}", profile?.name ?? "")}</h2><p>{impact.contactText}</p></div>
          <div className="impact-contacts">
            <article className="impact-contact-card"><div className="impact-contact-card-heading"><span className="impact-icon"><ShieldCheck size={30} aria-hidden="true" /></span><div><p className="impact-eyebrow">{impact.post}</p><h3>{impact.postTitle}</h3><p>{impact.confirmContact}</p></div><span className="impact-contact-status">{contactVerified ? profile?.name ?? impact.postTitle : impact.unverified}</span></div><p>{profile?.description ?? impact.contactStatus}</p><div className="impact-contact-actions">{contactVerified ? <a className="impact-contact-phone" href={`tel:${publicContact.phone}`}><Phone size={16} aria-hidden="true" />{publicContact.phone}</a> : <span className="impact-contact-placeholder"><Phone size={16} aria-hidden="true" />{impact.noNumber}</span>}<span className="impact-unavailable">{publicContact?.whatsapp && contactVerified ? publicContact.whatsapp : impact.noWhatsapp}</span><a className="impact-emergency-call" href="tel:119">{impact.emergencyCall}</a><a className="impact-contact-map-link" href={localePath("/", locale)}>{impact.viewMap}</a></div></article>

          </div>
        </div>
      </section>
    </div>
  );
}
