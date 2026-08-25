"use client";

type Props={role?:string|null; label?:string|null; size?:"sm"|"md"|"lg"};

const normalized=(role:string)=>role.toLowerCase().replace(/[ _-]+/g,"-");

export default function RoleEmblem({role,label,size="md"}:Props){
 const key=normalized(role||"");
 const data:{name:string;kind:"crown"|"shield"|"building"|"gear"|"star"|"crew"|"check"|"tech"} =
  key.includes("co-founder")?{name:"Co-Founder",kind:"crown"}:
  key.includes("founder")?{name:"Founder",kind:"crown"}:
  key.includes("ceo")?{name:"CEO",kind:"crown"}:
  key.includes("coo")?{name:"COO",kind:"crown"}:
  key.includes("admin")?{name:"Admin",kind:"shield"}:
  key.includes("staff")?{name:"Staff",kind:"gear"}:
  key.includes("developer")?{name:"Developer",kind:"tech"}:
  key.includes("moderator")?{name:"Moderator",kind:"shield"}:
  key.includes("verified-company")?{name:"Verified Company",kind:"building"}:
  key.includes("company")?{name:"Company",kind:"building"}:
  key.includes("organizer")?{name:"Organizer",kind:"star"}:
  key.includes("top-crew")?{name:"Top Crew",kind:"star"}:
  key.includes("verified")?{name:"Verified",kind:"check"}:
  {name:label||"Crew",kind:"crew"};
 const title=label||data.name;
 const icon=(()=>{switch(data.kind){case"crown":return <path d="M5 9.5 9 13l5-7 5 7 4-3.5-1.5 10.5h-15L5 9.5Z"/>;case"shield":return <path d="M14 4 21 7v5.4c0 4.2-2.7 7-7 9-4.3-2-7-4.8-7-9V7l7-3Z"/>;case"building":return <path d="M7 21V7h9v3h4v11M10 10h3M10 14h3M10 18h3M4 21h18"/>;case"gear":return <path d="m14 4 .7 2.1 2 .8 2-.8L20 8l-1.3 2 .8 2 2.1.7v2.6l-2.1.7-.8 2 1.3 2-1.8 1.8-2-.8-2 .8L14 20l-.7-2.1-2-.8-2 .8L7.5 16l1.3-2-.8-2-2.1-.7V8.7L8 8l.8-2 2 .8 2-.8L14 4Zm0 6.4A2.6 2.6 0 1 0 14 15.6a2.6 2.6 0 0 0 0-5.2Z"/>;case"star":return <path d="m14 4 2.3 5.1 5.7.6-4.2 3.8 1.2 5.6-5-2.8-5 2.8 1.2-5.6L6 9.7l5.7-.6L14 4Z"/>;case"check":return <path d="M14 4a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.5 13-4-4 2-2 2 2 5-5 2 2-7 7Z"/>;case"tech":return <path d="m9 8 4-4 4 4-2 2 3 3-4 4-3-3-2 2-4-4 4-4Zm5 6 5 5m-8-8 7-7"/>;default:return <path d="M7 17V8l7-4 7 4v9l-7 4-7-4Zm4-4h6m-3-3v6"/>}})();
 return <span className={`role-emblem role-${data.kind} role-size-${size}`} title={title} aria-label={title}><svg viewBox="0 0 28 28" aria-hidden="true">{icon}</svg><span>{title}</span></span>;
}
