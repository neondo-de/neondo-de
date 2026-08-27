"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabase();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { params.then(({ id }) => supabase.from("events").select("*").eq("id", id).maybeSingle().then(({ data }) => { setEvent(data); setLoading(false); })); }, [params, supabase]);
  if (loading) return <main className="event-detail-loading">Loading event…</main>;
  if (!event) return <main className="event-detail-loading"><h2>Event not found.</h2><a href="/events">Back to events</a></main>;
  const date = new Date(`${event.event_date}T12:00:00`).toLocaleDateString("en-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return <main className="event-detail-page"><nav className="events-nav"><a href="/events" className="events-logo"><span>NEON</span><b>DO</b><i /></a><a href="/events" className="event-back"><ArrowLeft size={16}/> All events</a></nav><section className="event-detail"><span className="stage-label">{event.event_type || "EVENT"}</span><h1>{event.title}</h1><div className="event-detail-meta"><span><CalendarDays size={18}/> {date}</span><span><MapPin size={18}/> {event.venue || event.location || "Berlin"}</span></div>{event.description && <p>{event.description}</p>}{event.location && event.venue && <div className="event-place"><b>{event.venue}</b><span>{event.location}</span></div>}</section></main>;
}
