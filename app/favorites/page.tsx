"use client";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function FavoritesPage(){
 const supabase=getSupabase(); const [items,setItems]=useState<any[]>([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href="/";return} const {data}=await supabase.from("neondo_favorites").select("id,shift_id,created_at").eq("user_id",user.id).order("created_at",{ascending:false}); setItems(data||[]); setLoading(false)})()},[]);
 async function remove(id:string){await supabase.from("neondo_favorites").delete().eq("id",id);setItems(v=>v.filter(x=>x.id!==id))}
 return <main className="simple-page"><a className="back" href="/dashboard"><ArrowLeft size={16}/> Back to dashboard</a><div className="simple-card wide"><span className="eyebrow">YOUR SAVED SHIFTS</span><h1>Favorites</h1><p className="muted">Keep interesting opportunities in one simple list.</p>{loading?<Loader2 className="spin"/>:items.length?<div className="simple-list">{items.map(x=><article key={x.id}><div><b>Saved shift</b><span>Shift ID: {x.shift_id}</span></div><button className="icon-button" onClick={()=>remove(x.id)} aria-label="Remove favorite"><Heart size={17} fill="currentColor"/></button></article>)}</div>:<div className="simple-empty"><Heart size={25}/><h3>No saved shifts yet.</h3><p>Save a shift when you find one you like.</p><a href="/shifts">Find shifts →</a></div>}</div></main>
}
