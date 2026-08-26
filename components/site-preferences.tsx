"use client";

import { useEffect, useState } from "react";

type Lang = "EN" | "DE" | "PL" | "FR" | "ES" | "IT" | "AR";
const labels: Record<Lang, string> = { EN: "English", DE: "Deutsch", PL: "Polski", FR: "Français", ES: "Español", IT: "Italiano", AR: "العربية" };

export default function SitePreferences(){
  const [dark,setDark]=useState(false);
  const [lang,setLang]=useState<Lang>("EN");
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const saved=localStorage.getItem("neondo-theme");
    const savedLang=localStorage.getItem("neondo-language") as Lang|null;
    const prefers=window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next=saved ? saved==="dark" : prefers;
    setDark(next); document.documentElement.classList.toggle("neondo-dark",next);
    if(savedLang && labels[savedLang]){ setLang(savedLang); document.documentElement.lang=savedLang.toLowerCase(); }
  },[]);
  function toggleTheme(){const next=!dark;setDark(next);document.documentElement.classList.toggle("neondo-dark",next);localStorage.setItem("neondo-theme",next?"dark":"light")}
  function choose(next:Lang){setLang(next);setOpen(false);localStorage.setItem("neondo-language",next);document.documentElement.lang=next.toLowerCase()}
  return <div className="neondo-preferences" aria-label="Site preferences">
    <button className="neondo-theme-toggle" onClick={toggleTheme} aria-label={dark?"Switch to light mode":"Switch to dark mode"} title={dark?"Light mode":"Dark mode"}>{dark?"☀":"◐"}</button>
    <div className="neondo-language">
      <button className="neondo-language-trigger" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-haspopup="listbox"><span>{lang}</span><b>{labels[lang]}</b><i>⌄</i></button>
      {open&&<div className="neondo-language-menu" role="listbox">{(Object.keys(labels) as Lang[]).map(code=><button key={code} role="option" aria-selected={code===lang} className={code===lang?"active":""} onClick={()=>choose(code)}><span>{code}</span>{labels[code]}</button>)}</div>}
    </div>
  </div>
}
