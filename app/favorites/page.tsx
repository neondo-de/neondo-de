"use client";
import { useEffect,useState } from "react";
import { Heart, ArrowLeft, Loader2, MapPin, Clock3, Euro } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function FavoritesPage(){
 const supabase=getSupabase(); const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 async function load(){const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href="/";return} const {data,error}=await supabase.from("neondo_favorites").select("id,shift_id,created_at,shifts(id,title,role,start_at,end_at,location,hourly_rate,status)").eq("user_id",user.id).order("created_at",{ascending:false}); if(error)setError(error.message); setItems(data||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function remove(id:string){const {error}=await supabase.from("neondo_favorites").delete().eq("id",id);if(error){setError(error.message);return}setItems(v=>v.filter(x=>x.id!==id))}
 return <main className="simple-page"><a className="back" href="/dashboard"><ArrowLeft size={16}/> Back to dashboard</a><div className="simple-card wide"><span className="eyebrow">YOUR SAVED SHIFTS</span><h1>Favorites</h1><p className="muted">Keep interesting opportunities in one simple list.</p>{error&&<p className="notice">{error}</p>}{loading?<Loader2 className="spin"/>:items.length?<div className="simple-list">{items.map(x=>{const s=x.shifts;return <article key={x.id}><div><b>{s?.title||"Saved shift"}</b><span>{s?.role||"Event crew"} · {s?.location||"Berlin"}</span><span>{s?.start_at?new Date(s.start_at).toLocaleDateString("en-DE",{weekday:"short",day:"2-digit",month:"short"}):""} {s?.hourly_rate?`· €${s.hourly_rate}/h`:""}</span></div><div className="document-actions"><a className="view" href={`/shifts/${x.shift_id}`}>View</a><button className="icon-button" onClick={()=>remove(x.id)} aria-label="Remove favorite"><Heart size={17} fill="currentColor"/></button></div></article>})}</div>:<div className="simple-empty"><Heart size={25}/><h3>No saved shifts yet.</h3><p>Save a shift when you find one you like.</p><a href="/dashboard">Find shifts →</a></div>}</div></main>
}
