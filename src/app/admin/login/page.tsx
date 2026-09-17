"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => { if (ready && user) router.replace("/admin"); }, [ready, user, router]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    if (login(email, password)) router.replace("/admin");
    else { setError("Email atau password tidak sesuai. Silakan coba kembali."); setPending(false); }
  }
  if (!ready || user) return <main className="loading-screen" role="status">Menyiapkan portal prajuru…</main>;
  return <main className="login-page">
    <section className="login-story"><Link href="/" className="brand"><BrandIcon size={36} /><span>BalePath<span className="brand-dot">.</span><small>RUANG ADAT, LANGKAH SELARAS</small></span></Link><div className="login-story-copy"><p className="eyebrow">PORTAL PRAJURU BANJAR</p><h1>Merawat tradisi.<br /><em>Menata harmoni.</em></h1><p>Ruang kerja bersama untuk menjaga kelancaran upacara dan perjalanan masyarakat Bali.</p><div className="story-emblem" aria-hidden="true"><BrandIcon size={110} style={{ transform: "rotate(-45deg)" }} /></div></div><div className="row muted"><span className="poleng" /> Adat terjaga. Masyarakat terhubung.</div></section>
    <section className="login-form-section"><Link href="/" className="back-link"><ArrowLeft size={17} /> Kembali ke portal publik</Link><div className="login-card"><div className="login-lock"><LockKeyhole size={25} /></div><p className="eyebrow">OM SWASTYASTU</p><h2>Selamat datang kembali.</h2><p className="muted">Masuk untuk mengelola agenda dan penataan jalan banjar Anda.</p><form className="stack" onSubmit={submit}><label>Email admin<input required autoComplete="username" type="email" placeholder="nama@banjar.id" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<div className="password-field"><input required minLength={1} autoComplete="current-password" type={show ? "text" : "password"} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" aria-label={show ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShow(!show)}>{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>{error && <p className="error-message" role="alert">{error}</p>}<button className="button primary" disabled={pending} type="submit">{pending ? "Memasuki dasbor…" : "Masuk ke dasbor"}<ArrowRight size={18} /></button></form><div className="demo-account"><div className="row"><ShieldCheck size={18} /><strong>Akun demonstrasi</strong></div><p>admin@banjarkaja.id<br />Password: <code>admin123</code></p><button type="button" className="text-button" onClick={() => { setEmail("admin@banjarkaja.id"); setPassword("admin123"); setError(""); }}>Gunakan akun demo <ArrowRight size={15} /></button></div><p className="login-disclaimer">Autentikasi simulasi di browser, bukan proteksi produksi. Tidak menggunakan database atau layanan backend.</p></div><p className="login-bottom">BALEPATH <span>·</span> TRI HITA KARANA</p></section>
  </main>;
}
