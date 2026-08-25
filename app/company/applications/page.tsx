"use client";
import "../company.css";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { ArrowLeft, Check, X } from "lucide-react";

export default function Applications(){const supabase=getSupabase();const [items,setItems]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [message,setMessage]=useState("");
 async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user){location.href="/";return}const {data,error}=await supabase.from("applications").select("*").order("created_at",{ascending:false}).limit(100);if(error)setMessage(error.message);setItems(data||[]);setLoading(false)}
 useEffect(()=>{load()},[]);
 async function setStatus(id:string,status:string){const {error}=await supabase.from("applications").update({status}).eq("id",id);if(error)setMessage(error.message);else load()}
 if(loading)return <div className="dashboard-loading">Loading applicants…</div>;
 return <main className="company-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div><nav><a href="/company">← Company workspace</a><a className="active">Applications</a></nav></aside><section className="company-main"><a href="/company" className="back-link"><ArrowLeft size={16}/> Back to workspace</a><header className="company-header"><div><span className="eyebrow">CREW MANAGEMENT</span><h1>Applications.</h1><p>Review people who want to work your shifts.</p></div></header>{message&&<div className="company-error">{message}</div>}<div className="company-shifts">{items.length?items.map(a=><article key={a.id}><div className="company-shift-date">{a.status||"pending"}</div><div><h3>Application {String(a.id).slice(0,8)}</h3><p>Shift: {a.shift_id} · Worker: {a.worker_id}</p></div><strong>{a.status||"pending"}</strong><div className="application-actions"><button onClick={()=>setStatus(a.id,"accepted")} title="Accept"><Check size={15}/></button><button onClick={()=>setStatus(a.id,"rejected")} title="Reject"><X size={15}/></button></div></article>):<div className="company-empty"><h3>No applications yet.</h3><p>Once crew applies to your shifts, they'll appear here.</p></div>}</div></section></main>}
