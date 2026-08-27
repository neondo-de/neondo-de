export function eventFingerprint(event:{title:string;event_date:string;venue?:string|null}):string{
 const clean=(value:string)=>value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g," ").trim();
 return [clean(event.title),event.event_date.slice(0,10),clean(event.venue||"")].join("|");
}

export function dedupeEvents<T extends {title:string;event_date:string;venue?:string|null}>(events:T[]):T[]{
 const seen=new Set<string>();
 return events.filter(event=>{const key=eventFingerprint(event);if(seen.has(key))return false;seen.add(key);return true;});
}
