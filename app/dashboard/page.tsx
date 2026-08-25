"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import DashboardClient, { Shift } from "./DashboardClient";

export default function Dashboard() {
 const supabase=getSupabase(); const [data,setData]=useState<{shifts:Shift[];name:string}|null>(null);
 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){location.href="/";return}const [{data:p},{data:s}]=await Promise.all([supabase.from("profiles").select("*").eq("id",user.id).maybeSingle(),supabase.from("shifts").select("id,title,role,start_at,end_at,hourly_rate,location,status").order("start_at",{ascending:true}).limit(50)]);setData({shifts:(s||[]) as Shift[],name:p?.first_name||p?.full_name||user.email?.split("@")[0]||"there"})})()},[]);
 if(!data)return <div className="dashboard-loading">Loading your network…</div>;
 return <DashboardClient initialShifts={data.shifts} displayName={data.name} onLogout={async()=>{await supabase.auth.signOut();location.href="/"}}/>;
}
