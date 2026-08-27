export type NormalizedEvent={title:string;event_type:string;event_date:string;venue:string|null;location:string|null;description:string|null;source_url:string|null};

// Adapter contract for visitBerlin. The public calendar is the first source selected
// for Batch 2 because it aggregates Berlin cultural, nightlife, sports and festival data.
// Keep parsing isolated so the source can be replaced by an official feed/API without
// changing the rest of the ingestion pipeline.
export function normalizeVisitBerlinEvent(input:Record<string,unknown>):NormalizedEvent|null{
 const title=String(input.title||"").trim();
 const date=String(input.event_date||input.date||"").trim();
 if(!title||!date)return null;
 return {title,event_type:String(input.event_type||input.category||"other"),event_date:date,venue:input.venue?String(input.venue):null,location:input.location?String(input.location):null,description:input.description?String(input.description):null,source_url:input.source_url?String(input.source_url):null};
}
