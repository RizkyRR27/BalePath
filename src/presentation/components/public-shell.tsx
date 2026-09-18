"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Map, Menu, Sprout, X } from "lucide-react";
import { BrandIcon } from "@/presentation/components/brand-icon";
import { LanguageSwitcher } from "@/presentation/components/language-switcher";
import { useTranslation } from "@/presentation/i18n/translation-provider";
import { localePath } from "@/presentation/i18n/locale";
import "@/presentation/styles/public.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const links = [
    { href: localePath("/", locale), label: t.nav.map, icon: Map },
    { href: localePath("/kalender", locale), label: t.nav.calendar, icon: CalendarDays },
    { href: localePath("/tri-hita-karana", locale), label: t.nav.impact, icon: Sprout },
  ];
  return (
    <div className="public-shell">
      <a className="public-skip" href="#public-content">{t.common.skipToContent}</a>
      <header className="public-header">
        <Link href={localePath("/", locale)} className="public-brand" aria-label={t.nav.brandAria} onClick={() => setOpen(false)}>
          <span className="public-brand-mark"><BrandIcon size={36} /></span>
          <span>Bale<span className="public-gold">Path</span><small>{t.nav.brandTagline}</small></span>
        </Link>
        <nav className="public-nav" aria-label={t.nav.ariaLabel}>
          {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={17} aria-hidden="true" />{label}</Link>)}
        </nav>
        <div className="public-header-actions">
          <LanguageSwitcher />
          <Link href={localePath("/admin/login", locale)} className="public-login">{t.nav.adminPortal} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button type="button" className="public-menu-toggle" aria-expanded={open} aria-controls="public-mobile-nav" aria-label={open ? t.nav.closeMenu : t.nav.openMenu} onClick={() => setOpen(!open)}>{open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
        </div>
      </header>
      {open && <nav id="public-mobile-nav" className="public-mobile-nav" aria-label={t.nav.mobileAriaLabel}>
        <LanguageSwitcher />
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={19} aria-hidden="true" />{label}</Link>)}
        <Link href={localePath("/admin/login", locale)} onClick={() => setOpen(false)}><ArrowUpRight size={19} aria-hidden="true" />{t.nav.adminPortal}</Link>
      </nav>}
      <main id="public-content" tabIndex={-1}>{children}</main>
      <footer className="public-footer">
        <span className="public-footer-message"><span className="public-poleng" aria-hidden="true" />{t.nav.footerMessage}</span>
        <span><Link href={localePath("/tri-hita-karana", locale)} className="public-footer-link"><Sprout size={15} aria-hidden="true" /> {t.nav.footerLink}</Link> <span className="public-footer-place">{t.nav.location}</span></span>
      </footer>
    </div>
  );
}
