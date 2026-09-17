"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Map, Menu, Sprout, X } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import "@/app/public.css";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: "Peta Adat", icon: Map },
    { href: "/kalender", label: "Kalender Yadnya", icon: CalendarDays },
    { href: "/tri-hita-karana", label: "Tri Hita Karana", icon: Sprout },
  ];
  return (
    <div className="public-shell">
      <a className="public-skip" href="#public-content">Langsung ke konten</a>
      <header className="public-header">
        <Link href="/" className="public-brand" aria-label="BalePath, beranda" onClick={() => setOpen(false)}>
          <span className="public-brand-mark"><BrandIcon size={36} /></span>
          <span>Bale<span className="public-gold">Path</span><small>RUANG ADAT · LANGKAH SELARAS</small></span>
        </Link>
        <nav className="public-nav" aria-label="Navigasi publik">
          {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={17} aria-hidden="true" />{label}</Link>)}
        </nav>
        <div className="public-header-actions">
          <Link href="/admin/login" className="public-login">Portal Prajuru <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button type="button" className="public-menu-toggle" aria-expanded={open} aria-controls="public-mobile-nav" aria-label={open ? "Tutup menu" : "Buka menu"} onClick={() => setOpen(!open)}>{open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
        </div>
      </header>
      {open && <nav id="public-mobile-nav" className="public-mobile-nav" aria-label="Navigasi publik seluler">
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={19} aria-hidden="true" />{label}</Link>)}
        <Link href="/admin/login" onClick={() => setOpen(false)}><ArrowUpRight size={19} aria-hidden="true" />Portal Prajuru</Link>
      </nav>}
      <main id="public-content" tabIndex={-1}>{children}</main>
      <footer className="public-footer">
        <span className="public-footer-message"><span className="public-poleng" aria-hidden="true" />Menjaga tradisi. Menyelaraskan perjalanan.</span>
        <span><Link href="/tri-hita-karana" className="public-footer-link"><Sprout size={15} aria-hidden="true" /> Berlandaskan Tri Hita Karana</Link> <span className="public-footer-place">UBUD, BALI</span></span>
      </footer>
    </div>
  );
}
