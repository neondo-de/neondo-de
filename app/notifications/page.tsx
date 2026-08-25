"use client";
import { ArrowLeft, Bell, CheckCircle2, CalendarDays, BriefcaseBusiness } from "lucide-react";

const items=[
 {icon:BriefcaseBusiness,title:"Your crew updates live here",text:"New applications, shift changes and company updates will appear here.",time:"Ready"},
 {icon:CalendarDays,title:"Keep your schedule up to date",text:"Accepted shifts will be shown in your schedule so you always know where to be.",time:"Tip"},
 {icon:CheckCircle2,title:"You're all set",text:"There are no unread notifications right now.",time:"Now"}
];
export default function NotificationsPage(){return <main className="simple-page"><a className="back" href="/dashboard"><ArrowLeft size={16}/> Back to dashboard</a><div className="simple-card wide"><div className="title-line"><div><span className="eyebrow">UPDATES</span><h1>Notifications</h1></div><Bell size={25}/></div><p className="muted">One simple place for everything that needs your attention.</p><div className="notice-list">{items.map(({icon:Icon,...x})=><article className="notice-item" key={x.title}><div className="notice-icon"><Icon size={18}/></div><div><b>{x.title}</b><p>{x.text}</p></div><small>{x.time}</small></article>)}</div></div></main>}
