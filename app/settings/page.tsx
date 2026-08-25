"use client";
import "../simple.css";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { ArrowLeft, Bell, LogOut, Mail, Shield, UserRound } from "lucide-react";

export default function SettingsPage(){
 const supabase=getSupabase(); const [email,setEmail]=useState(""); const [notice,setNotice]=useState(""); const [saving,setSaving]=useState(false);
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setEmail(data.user?.email||""))},[]);
 async function reset(){setSaving(true);setNotice("");const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/settings`});setNotice(error?.message||"Password reset email sent.");setSaving(false)}
 async function logout(){await supabase.auth.signOut();location.href="/"}
 return <main className="simple-page"><a className="back" href="/dashboard"><ArrowLeft size={16}/> Back to dashboard</a><div className="simple-card"><span className="eyebrow">ACCOUNT</span><h1>Settings</h1><p className="muted">Keep your NEONDO account simple and under your control.</p><div className="setting-row"><UserRound size={18}/><div><b>Account</b><span>{email||"Signed in"}</span></div></div><div className="setting-row"><Mail size={18}/><div><b>Email</b><span>{email||"No email available"}</span></div></div><button className="setting-button" onClick={reset} disabled={!email||saving}><Shield size={16}/> {saving?"Sending…":"Reset password"}</button><div className="setting-row"><Bell size={18}/><div><b>Notifications</b><span>Managed from your notification center.</span></div></div><a className="setting-button" href="/notifications"><Bell size={16}/> Open notifications</a><button className="setting-button danger" onClick={logout}><LogOut size={16}/> Log out</button>{notice&&<p className="notice">{notice}</p>}</div></main>
}
