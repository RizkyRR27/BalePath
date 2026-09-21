"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowUpRight, BookOpen, LayoutDashboard, LogOut, PhoneCall, UserRound } from "lucide-react";
import { BrandIcon } from "@/presentation/components/brand-icon";
import { LanguageSwitcher } from "@/presentation/components/language-switcher";
import { localePath } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";
import { useAuth } from "@/presentation/providers/auth-provider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const { locale, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  // Inisial & identitas mengikuti akun banjar yang sedang login.
  const nameWords = user?.name.split(" ").filter((word) => word.length > 0) ?? [];
  const initials = (nameWords.slice(-2).map((word) => word[0]).join("") || "?").toUpperCase();
  useEffect(() => { if (ready && !user) router.replace(localePath("/admin/login", locale)); }, [ready, user, router, locale]);
  if (!ready || !user) return <main className="loading-screen" role="status">{t.adminShell.checking}</main>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href={localePath("/admin", locale)} className="brand"><BrandIcon size={31} /><span>BalePath<span className="brand-dot">.</span><small>{t.adminShell.portalTag}</small></span></Link><nav aria-label={t.adminShell.navLabel}>{[{ href: "/admin", label: t.adminShell.dashboard, icon: LayoutDashboard }, { href: "/admin/profil-banjar", label: t.adminShell.profile, icon: UserRound }, { href: "/admin/kontak-darurat", label: t.adminShell.contacts, icon: PhoneCall }].map(({ href, label, icon: Icon }) => { const active = pathname === localePath(href, locale); return <Link key={href} href={localePath(href, locale)} className={active ? "admin-nav-active" : undefined} aria-current={active ? "page" : undefined}><Icon size={17} /> {label}</Link>; })}<Link href={localePath("/", locale)}><BookOpen size={17} /> {t.adminShell.publicPortal} <ArrowUpRight size={16} /></Link></nav><div className="admin-identity"><span className="avatar">{initials}</span><div><strong>{user.name}</strong><small>{user.banjar}</small></div><button type="button" aria-label={t.adminShell.logout} onClick={() => { logout(); router.replace(localePath("/admin/login", locale)); }}><LogOut size={19} /></button></div></aside><div className="admin-body"><header className="admin-topbar"><span className="eyebrow">{t.adminShell.topbarEyebrow}</span><strong>{t.adminShell.topbarTitle}</strong><LanguageSwitcher className="public-lang" /></header><main className="page-container">{children}</main><footer className="admin-footer"><span className="poleng" /><span>BalePath · {t.adminShell.footer}</span><span className="eyebrow">{t.adminShell.localDemo}</span></footer></div></div>;
}
