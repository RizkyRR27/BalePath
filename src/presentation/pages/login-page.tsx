"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { BrandIcon } from "@/presentation/components/brand-icon";
import { LanguageSwitcher } from "@/presentation/components/language-switcher";
import { localePath } from "@/presentation/i18n/locale";
import { useTranslation } from "@/presentation/i18n/translation-provider";
import { useAuth } from "@/presentation/providers/auth-provider";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const { locale, t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => { if (ready && user) router.replace(localePath("/admin", locale)); }, [ready, user, router, locale]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    if (login(email, password)) router.replace(localePath("/admin", locale));
    else { setError(t.login.errorInvalid); setPending(false); }
  }
  if (!ready || user) return <main className="loading-screen" role="status">{t.login.loading}</main>;
  return <main className="login-page">
    <section className="login-story"><Link href={localePath("/", locale)} className="brand"><BrandIcon size={36} /><span>BalePath<span className="brand-dot">.</span><small>{t.nav.brandTagline}</small></span></Link><div className="login-story-copy"><p className="eyebrow">{t.login.eyebrow}</p><h1>{t.login.storyTitle}<br /><em>{t.login.storyEmphasis}</em></h1><p>{t.login.storyText}</p><div className="story-emblem" aria-hidden="true"><BrandIcon size={110} style={{ transform: "rotate(-45deg)" }} /></div></div><div className="row muted"><span className="poleng" /> {t.login.storyFooter}</div></section>
    <section className="login-form-section"><div className="row" style={{ justifyContent: "space-between" }}><Link href={localePath("/", locale)} className="back-link"><ArrowLeft size={17} /> {t.login.back}</Link><LanguageSwitcher className="public-lang" /></div><div className="login-card"><div className="login-lock"><LockKeyhole size={25} /></div><p className="eyebrow">{t.login.om}</p><h2>{t.login.welcome}</h2><p className="muted">{t.login.description}</p><form className="stack" onSubmit={submit}><label>{t.login.email}<input required autoComplete="username" type="email" placeholder={t.login.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>{t.login.password}<div className="password-field"><input required minLength={1} autoComplete="current-password" type={show ? "text" : "password"} placeholder={t.login.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={show ? t.login.hidePassword : t.login.showPassword} onClick={() => setShow(!show)}>{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>{error && <p className="error-message" role="alert">{error}</p>}<button className="button primary" disabled={pending} type="submit">{pending ? t.login.pending : t.login.submit}<ArrowRight size={18} /></button></form><div className="demo-account"><div className="row"><ShieldCheck size={18} /><strong>{t.login.demoTitle}</strong></div><p>admin@banjarkaja.id · Banjar Ubud Kaja<br />admin@padangtegal.id · Banjar Padangtegal<br />{t.login.demoPassword}: <code>admin123</code></p><button type="button" className="text-button" onClick={() => { setEmail("admin@banjarkaja.id"); setPassword("admin123"); setError(""); }}>{t.login.useDemo} · Ubud Kaja <ArrowRight size={15} /></button><button type="button" className="text-button" onClick={() => { setEmail("admin@padangtegal.id"); setPassword("admin123"); setError(""); }}>{t.login.useDemo} · Padangtegal <ArrowRight size={15} /></button></div><p className="login-disclaimer">{t.login.disclaimer}</p></div><p className="login-bottom">{t.login.footer} <span>·</span> {t.login.footerTagline}</p></section>
  </main>;
}
