"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, CalendarDays, UserRound, BriefcaseBusiness, LogOut, MapPin, Clock3, Euro, ChevronRight } from "lucide-react";

export type Shift = { id:string; title:string; role:string; start_at:string; end_at:string|null; hourly_rate:number|null; location?:string|null; status:string };

export default function DashboardClient({ initialShifts, displayName, onLogout }:{initialShifts:Shift[];displayName:string;onLogout:()=>void}) {
 const [query,setQuery]=useState(""); const [role,setRole]=useState("All roles");
 const roles=["All roles",...Array.from(new Set(initialShifts.map(s=>s.role).filter(Boolean)))];
 const shifts=useMemo(()=>initialShifts.filter(s=>`${s.title} ${s.role} ${s.location||""}`.toLowerCase().includes(query.toLowerCase())&&(role==="All roles"||s.role===role)),[initialShifts,query,role]);
 return <main className="dashboard"><aside className="sidebar"><div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div><nav><a className="active"><BriefcaseBusiness size={17}/> Discover shifts</a><a href="/schedule"><CalendarDays size={17}/> My schedule</a><a href="/profile"><UserRound size={17}/> My profile</a></nav><button className="logout" onClick={onLogout}><LogOut size={16}/> Log out</button></aside>
 <section className="dashboard-main"><header className="dash-header"><div><span className="eyebrow">NEONDO NETWORK</span><h1>Good to see you, {displayName}.</h1><p>Find your next opportunity in Berlin.</p></div><a href="/profile" className="profile-chip"><span>{displayName[0]?.toUpperCase()||"N"}</span>{displayName}</a></header>
 <div className="searchbar"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search roles, shifts or locations"/><span>Berlin</span></div>
 <div className="filters"><SlidersHorizontal size={15}/>{roles.map(r=><button className={role===r?"selected":""} key={r} onClick={()=>setRole(r)}>{r}</button>)}</div>
 <div className="dash-section-head"><div><span className="eyebrow">OPEN NOW</span><h2>Available shifts <small>{shifts.length}</small></h2></div></div>
 <div className="shift-list">{shifts.length?shifts.map(s=><a className="shift-item" href={`/shifts/${s.id}`} key={s.id}><div className="shift-date">{new Date(s.start_at).toLocaleDateString("en-DE",{weekday:"short",day:"2-digit",month:"short"})}</div><div className="shift-info"><h3>{s.title}</h3><p>{s.role} · <Clock3 size={12}/>{new Date(s.start_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}{s.end_at?` – ${new Date(s.end_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`:""}</p><p><MapPin size={12}/>{s.location||"Berlin"}</p></div><div className="shift-rate">{s.hourly_rate?<><Euro size={14}/>{s.hourly_rate}/h</>:"Rate on request"}</div><ChevronRight className="chevron" size={18}/></a>):<div className="empty"><span>✦</span><h3>No matching shifts.</h3><p>Try another role or search term.</p></div>}</div></section></main>
}
