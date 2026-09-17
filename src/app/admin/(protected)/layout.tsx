"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowUpRight, LayoutDashboard, LogOut } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { useAuth } from "@/context/auth-context";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  useEffect(() => { if (ready && !user) router.replace("/admin/login"); }, [ready, user, router]);
  if (!ready || !user) return <main className="loading-screen" role="status">Memeriksa sesi admin…</main>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="brand"><BrandIcon size={31} /><span>BalePath<span className="brand-dot">.</span><small>PORTAL PRAJURU</small></span></Link><nav aria-label="Navigasi admin"><Link href="/admin" className="admin-nav-active" aria-current="page"><LayoutDashboard size={17} /> Dasbor banjar</Link><Link href="/">Portal publik <ArrowUpRight size={16} /></Link></nav><div className="admin-identity"><span className="avatar">WA</span><div><strong>{user.name}</strong><small>PRAJURU BANJAR</small></div><button type="button" aria-label="Keluar dari akun" onClick={() => { logout(); router.replace("/admin/login"); }}><LogOut size={19} /></button></div></aside><div className="admin-body"><header className="admin-topbar"><span className="eyebrow">PUSAT KENDALI SPASIAL BANJAR</span><strong>DASBOR ADMIN BANJAR</strong></header><main className="page-container">{children}</main><footer className="admin-footer"><span className="poleng" /><span>BalePath · Menjaga keharmonisan ruang bersama.</span><span className="eyebrow">DEMO LOKAL · TANPA BACKEND</span></footer></div></div>;
}
