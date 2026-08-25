"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { LogOut, Search, Plus, CalendarDays, UserRound, BriefcaseBusiness } from "lucide-react";

interface Shift { id:string; title:string; role:string; start_at:string; end_at:string; hourly_rate:number|null; location?:string; status:string; }

export default function Dashboard() {
  const supabase = getSupabase();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) { window.location.href = "/"; return; }
      setUser(user);
      const [{ data: p }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("shifts").select("id,title,role,start_at,end_at,hourly_rate,status").order("start_at", { ascending:true }).limit(12),
      ]);
      if (mounted) { setProfile(p); setShifts(s || []); setLoading(false); }
    })();
    return () => { mounted = false };
  }, []);

  async function logout() { await supabase.auth.signOut(); window.location.href = "/"; }
  const displayName = profile?.first_name || profile?.full_name || user?.email?.split("@")[0] || "there";

  if (loading) return <div className="dashboard-loading">Loading your network…</div>;
  return <main className="dashboard">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div>
      <nav><a className="active"><BriefcaseBusiness size={17}/> Discover shifts</a><a><CalendarDays size={17}/> My schedule</a><a href="/profile"><UserRound size={17}/> My profile</a></nav>
      <button className="logout" onClick={logout}><LogOut size={16}/> Log out</button>
    </aside>
    <section className="dashboard-main">
      <header className="dash-header"><div><span className="eyebrow">NEONDO NETWORK</span><h1>Good to see you, {displayName}.</h1><p>Find your next opportunity in Berlin.</p></div><a href="/profile" className="profile-chip"><span>{(displayName[0] || "N").toUpperCase()}</span>{displayName}</a></header>
      <div className="searchbar"><Search size={18}/><input placeholder="Search roles, shifts or locations" /><span>Berlin</span></div>
      <div className="dash-section-head"><div><span className="eyebrow">OPEN NOW</span><h2>Available shifts</h2></div><button><Plus size={16}/> Post a shift</button></div>
      <div className="shift-list">{shifts.length ? shifts.map(s => <article className="shift-item" key={s.id}><div className="shift-date">{new Date(s.start_at).toLocaleDateString("en-DE", { weekday:"short", day:"2-digit", month:"short" })}</div><div className="shift-info"><h3>{s.title}</h3><p>{s.role} · {new Date(s.start_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}{s.end_at ? ` – ${new Date(s.end_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}` : ""}</p></div><div className="shift-rate">{s.hourly_rate ? `€${s.hourly_rate}/h` : "Rate on request"}</div><button className="view">View →</button></article>) : <div className="empty"><span>✦</span><h3>Your next shift is waiting.</h3><p>There are no open shifts yet. Check back soon.</p></div>}</div>
    </section>
  </main>;
}
