"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Compass, MapPin, Palette, Users } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import "../stagework-home.css";

type EventRow = { id: string; title: string; event_date: string; city: string | null; venue: string | null; image_url: string | null; event_type: string | null };

const genres = ["Techno", "House", "Drum & Bass", "Trance", "Hard Techno", "Electro"];

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
}

export default function ScenePage() {
  const supabase = getSupabase();
  const [city, setCity] = useState("Berlin");
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("id,title,event_date,city,venue,image_url,event_type")
        .neq("status", "draft")
        .gte("event_date", new Date().toISOString().slice(0, 10))
        .order("event_date", { ascending: true })
        .limit(8);
      if (active) setEvents((data || []) as EventRow[]);
    })();
    return () => { active = false; };
  }, [supabase]);

  const cityEvents = events.filter((event) => !event.city || event.city.toLowerCase() === city.toLowerCase()).slice(0, 4);

  return (
    <main className="scene-page">
      <nav className="scene-nav">
        <a href="/" className="stage-logo scene-logo"><span className="stage-logo-mark">N</span><span className="neondo-word"><b>NEON</b><strong>DO</strong></span></a>
        <div className="scene-links">
          <a href="/events">Discover</a>
          <a href="/#opportunities">Work</a>
          <a href="/#how">Create</a>
        </div>
        <a href="/?signup=1" className="scene-join">Join NEONDO <ArrowUpRight size={14} /></a>
      </nav>

      <section className="scene-hero">
        <div className="scene-kicker"><span /> YOUR SCENE, IN ONE PLACE</div>
        <h1>Find what’s<br /><em>moving.</em></h1>
        <p>Discover what’s happening, find work around it, and meet the people creating the scene.</p>
        <div className="scene-city"><MapPin size={17} /><input value={city} onChange={(e) => setCity(e.target.value)} aria-label="City" /><span>Change city</span></div>
      </section>

      <section className="scene-pillars">
        <a href="/events" className="scene-pillar night">
          <div className="pillar-icon"><CalendarDays size={22} /></div>
          <span>01 · DISCOVER</span>
          <h2>What’s<br /><em>happening.</em></h2>
          <p>Club nights, DJs, parties, festivals and the events worth leaving home for.</p>
          <b>Explore events <ArrowUpRight size={16} /></b>
        </a>
        <a href="/#opportunities" className="scene-pillar work">
          <div className="pillar-icon"><BriefcaseBusiness size={22} /></div>
          <span>02 · WORK</span>
          <h2>Find work<br /><em>that moves.</em></h2>
          <p>Event crew, production, hospitality and creative gigs connected to your scene.</p>
          <b>Find opportunities <ArrowUpRight size={16} /></b>
        </a>
        <a href="/#proof" className="scene-pillar create">
          <div className="pillar-icon"><Palette size={22} /></div>
          <span>03 · CREATE</span>
          <h2>Make<br /><em>something.</em></h2>
          <p>Creative projects, collaborators and people who are building what comes next.</p>
          <b>Build your profile <ArrowUpRight size={16} /></b>
        </a>
      </section>

      <section className="scene-events">
        <div className="scene-section-head">
          <div><span>TONIGHT / {city.toUpperCase()}</span><h2>What's happening.</h2></div>
          <a href={`/events?city=${encodeURIComponent(city)}`}>See all <ArrowUpRight size={15} /></a>
        </div>
        {cityEvents.length ? <div className="scene-event-grid">{cityEvents.map((event) => (
          <a href={`/events/${event.id}`} className="scene-event" key={event.id}>
            {event.image_url ? <img src={event.image_url} alt="" /> : <div className="scene-event-image" />}
            <div><small>{formatDate(event.event_date)} · {event.event_type || "Event"}</small><h3>{event.title}</h3><p>{event.venue || "Venue TBA"} · {event.city || city}</p></div>
          </a>
        ))}</div> : <div className="scene-empty"><Compass size={22} /><span>No live events loaded yet.</span><a href="/events">Open the guide →</a></div>}
        <div className="genre-row">{genres.map((genre) => <a key={genre} href={`/events?genre=${encodeURIComponent(genre)}`}>{genre}</a>)}</div>
      </section>

      <section className="scene-connect">
        <div><span>THE NEONDO LOOP</span><h2>Discover.<br /><em>Connect.</em><br />Create.</h2></div>
        <div className="loop-copy"><p>An event is more than a date on a calendar. It can be the place you find your next gig, meet a collaborator, discover an artist or become part of a new scene.</p><div className="loop-items"><b><CalendarDays /> EVENT</b><b><BriefcaseBusiness /> WORK</b><b><Users /> PEOPLE</b><b><Palette /> CREATE</b></div></div>
      </section>

      <footer className="scene-footer"><a href="/" className="stage-logo scene-logo"><span className="stage-logo-mark">N</span><span className="neondo-word"><b>NEON</b><strong>DO</strong></span></a><span>Discover what’s happening. Find where you fit.</span><a href="/events">Explore the scene ↗</a></footer>

      <style jsx global>{`
        .scene-page{min-height:100vh;background:#f4f3ed;color:#11120f}.scene-nav{height:78px;padding:0 6%;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d9d8d0;position:sticky;top:0;z-index:10;background:#f4f3edee;backdrop-filter:blur(14px)}.scene-logo{font-weight:800;font-size:20px;letter-spacing:-.07em;color:#11120f}.scene-logo span{font-weight:500;color:#70736a}.scene-logo i{display:inline-block;width:5px;height:5px;background:#a7c51f;border-radius:50%;margin-left:4px}.scene-links{display:flex;gap:30px;font-size:12px;font-weight:700;color:#6e7068}.scene-join{display:flex;align-items:center;gap:7px;background:#11120f;color:#fff;border-radius:999px;padding:11px 15px;font-size:11px;font-weight:800}.scene-hero{padding:100px 7% 80px;border-bottom:1px solid #d9d8d0;position:relative}.scene-kicker,.scene-pillar>span,.scene-section-head span,.scene-connect>div>span{font-size:9px;font-weight:800;letter-spacing:.16em;color:#777a71}.scene-kicker span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#a7c51f;margin-right:8px}.scene-hero h1{font-size:clamp(72px,11vw,150px);line-height:.78;letter-spacing:-.085em;margin:22px 0 30px}.scene-hero em,.scene-pillar em,.scene-connect em{font-style:normal;color:#91a91c}.scene-hero p{max-width:560px;color:#696b63;font-size:17px;line-height:1.6}.scene-city{margin-top:35px;display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid #dcdad1;border-radius:999px;padding:11px 15px;color:#8da31c}.scene-city input{width:120px;border:0;outline:0;background:transparent;font-weight:800;font-size:12px;color:#11120f}.scene-city span{font-size:10px;color:#85877e}.scene-pillars{display:grid;grid-template-columns:repeat(3,1fr);padding:0 7%;gap:1px;background:#d9d8d0}.scene-pillar{min-height:430px;padding:40px;background:#f4f3ed;display:flex;flex-direction:column}.scene-pillar.night{background:#161713;color:#f5f4ef}.scene-pillar.night>span{color:#a7aaa0}.pillar-icon{width:45px;height:45px;border-radius:50%;display:grid;place-items:center;background:#e6e5dc;margin-bottom:55px}.night .pillar-icon{background:#282922;color:#b5cf2b}.scene-pillar>h2{font-size:48px;line-height:.9;letter-spacing:-.06em;margin:15px 0}.scene-pillar>p{font-size:13px;line-height:1.55;color:#777970;max-width:290px}.night p{color:#a7aaa0}.scene-pillar>b{margin-top:auto;display:flex;align-items:center;gap:7px;font-size:11px}.scene-pillar b svg{color:#91a91c}.scene-events{padding:90px 7%}.scene-section-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:25px}.scene-section-head h2{font-size:50px;line-height:.9;letter-spacing:-.06em;margin-top:12px}.scene-section-head>a{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:800}.scene-event-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.scene-event{background:#fff;border:1px solid #deddd5;border-radius:16px;padding:9px}.scene-event img,.scene-event-image{width:100%;height:180px;object-fit:cover;border-radius:10px;background:linear-gradient(135deg,#24261f,#858d52);display:block}.scene-event>div:last-child{padding:13px 3px 7px}.scene-event small{font-size:8px;text-transform:uppercase;letter-spacing:.1em;color:#91a91c;font-weight:800}.scene-event h3{font-size:17px;line-height:1.05;margin:8px 0}.scene-event p{font-size:10px;color:#85877e;margin:0}.scene-empty{border:1px dashed #c9c8bf;padding:55px;display:flex;align-items:center;justify-content:center;gap:12px;color:#777970;font-size:12px}.scene-empty svg{color:#91a91c}.scene-empty a{color:#11120f;font-weight:800}.genre-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:25px}.genre-row a{border:1px solid #d5d4cb;border-radius:999px;padding:9px 12px;font-size:10px;font-weight:700;color:#696b63}.scene-connect{background:#181916;color:#f4f3ed;padding:85px 7%;display:grid;grid-template-columns:1fr 1fr;gap:80px}.scene-connect h2{font-size:clamp(55px,7vw,95px);line-height:.82;letter-spacing:-.07em;margin-top:18px}.loop-copy{align-self:end}.loop-copy>p{font-size:16px;line-height:1.65;color:#b7b9b0;max-width:510px}.loop-items{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #3a3b34;margin-top:35px}.loop-items b{display:flex;align-items:center;gap:9px;padding:15px 0;border-bottom:1px solid #3a3b34;font-size:10px;letter-spacing:.1em}.loop-items svg{width:16px;height:16px;color:#a7c51f}.scene-footer{padding:30px 6%;display:flex;justify-content:space-between;align-items:center;gap:20px;font-size:10px;color:#777970}.scene-footer>a:last-child{color:#11120f;font-weight:800}@media(max-width:850px){.scene-nav{padding:0 5%}.scene-links{display:none}.scene-hero{padding:70px 5% 60px}.scene-pillars{grid-template-columns:1fr;padding:0}.scene-pillar{min-height:360px;padding:30px}.scene-event-grid{grid-template-columns:repeat(2,1fr)}.scene-events{padding:65px 5%}.scene-connect{grid-template-columns:1fr;padding:65px 5%;gap:30px}.scene-footer{padding:25px 5%;flex-wrap:wrap}.scene-footer>span{order:3;width:100%}}@media(max-width:520px){.scene-event-grid{grid-template-columns:1fr}.scene-event img,.scene-event-image{height:210px}.scene-section-head h2{font-size:39px}.scene-hero h1{font-size:70px}.scene-city{width:100%}.scene-city input{flex:1}}
      `}</style>
    </main>
  );
}
