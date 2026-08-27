"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, MapPin, Search, Ticket, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type EventRow = {
  id: string;
  title: string;
  event_type: string | null;
  event_date: string;
  venue: string | null;
  location: string | null;
  description: string | null;
  status: string;
};

const categories = ["All", "Music", "Nightlife", "Culture", "Sports", "Community"];

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-DE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function normalizeCategory(value: string | null) {
  const v = (value || "").toLowerCase();
  if (v.includes("music") || v.includes("concert") || v.includes("dj")) return "Music";
  if (v.includes("club") || v.includes("night") || v.includes("party")) return "Nightlife";
  if (v.includes("art") || v.includes("culture") || v.includes("theatre") || v.includes("museum")) return "Culture";
  if (v.includes("sport")) return "Sports";
  if (v.includes("community") || v.includes("market") || v.includes("meet")) return "Community";
  return "Other";
}

export default function EventsPage() {
  const supabase = getSupabase();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [day, setDay] = useState<"all" | "today" | "weekend">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,event_type,event_date,venue,location,description,status")
        .neq("status", "draft")
        .order("event_date", { ascending: true })
        .limit(100);
      if (!mounted) return;
      if (error) setError("We couldn't load events right now.");
      setEvents((data || []) as EventRow[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const filtered = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const end = new Date(now);
    end.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
    const weekendEnd = end.toISOString().slice(0, 10);
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      const haystack = `${event.title} ${event.event_type || ""} ${event.venue || ""} ${event.location || ""}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesCategory = category === "All" || normalizeCategory(event.event_type) === category;
      const matchesDay = day === "all" || (day === "today" ? event.event_date === today : event.event_date <= weekendEnd);
      return matchesQuery && matchesCategory && matchesDay;
    });
  }, [events, query, category, day]);

  return (
    <main className="events-page">
      <nav className="events-nav">
        <a href="/" className="events-logo"><span>NEON</span><b>DO</b><i /></a>
        <div className="events-nav-links"><a className="active" href="/events">Events</a><a href="/dashboard">Opportunities</a><a href="/#how">How it works</a></div>
        <div className="events-nav-actions"><a href="/dashboard">Log in</a><a className="events-join" href="/?signup=1">Join NEONDO <span>↗</span></a></div>
      </nav>

      <section className="events-hero">
        <div>
          <span className="stage-label"><span className="event-pulse" /> BERLIN · LIVE DISCOVERY</span>
          <h1>What’s <i>happening.</i></h1>
          <p>Find the events, nights and things worth showing up for — all in one place.</p>
        </div>
        <div className="events-location"><MapPin size={17} /><span>Berlin, Germany</span><ChevronRight size={16} /></div>
      </section>

      <section className="events-content">
        <div className="events-toolbar">
          <div className="events-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, venues or places" /><button aria-label="Clear search" onClick={() => setQuery("")}><X size={15} /></button></div>
          <div className="events-days"><button className={day === "all" ? "selected" : ""} onClick={() => setDay("all")}>All</button><button className={day === "today" ? "selected" : ""} onClick={() => setDay("today")}>Today</button><button className={day === "weekend" ? "selected" : ""} onClick={() => setDay("weekend")}>This weekend</button></div>
        </div>
        <div className="event-categories">{categories.map((item) => <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>

        <div className="events-heading"><div><span className="stage-label">IN BERLIN</span><h2>{day === "today" ? "Today" : day === "weekend" ? "This weekend" : "Upcoming events"}</h2></div><span>{filtered.length} {filtered.length === 1 ? "event" : "events"}</span></div>

        {loading ? <div className="events-empty"><CalendarDays size={26} /><h3>Loading the city…</h3><p>Finding what’s happening in Berlin.</p></div> : error ? <div className="events-empty"><h3>Events are temporarily unavailable.</h3><p>Please try again in a moment.</p></div> : filtered.length === 0 ? <div className="events-empty"><CalendarDays size={26} /><h3>No events yet.</h3><p>Once events are published to NEONDO, they’ll appear here automatically.</p></div> : <div className="event-grid">{filtered.map((event) => <article className="event-card" key={event.id}><div className="event-date"><b>{formatDate(event.event_date).split(" ")[1]}</b><span>{formatDate(event.event_date).split(" ")[0]}</span></div><div className="event-card-main"><span className="event-type">{normalizeCategory(event.event_type)}</span><h3>{event.title}</h3><p>{event.venue || "Berlin"}{event.location ? ` · ${event.location}` : ""}</p>{event.description && <div className="event-description">{event.description}</div>}</div><a className="event-arrow" href={`/events/${event.id}`} aria-label={`View ${event.title}`}><ChevronRight size={19} /></a></article>)}</div>}
      </section>

      <section className="events-footer-cta"><div><span className="stage-label">MAKE THE CITY YOURS</span><h2>Go where the<br /><i>moment is.</i></h2></div><p>NEONDO brings work and city life together, so you can discover what’s happening and the people making it happen.</p></section>
    </main>
  );
}
