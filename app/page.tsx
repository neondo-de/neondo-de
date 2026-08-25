"use client";

import { useState } from "react";

const features = [
  { icon: "◈", title: "Find your crew", text: "Discover reliable event professionals in Berlin and build your network." },
  { icon: "✦", title: "Find your next shift", text: "See opportunities that match your role, availability and experience." },
  { icon: "↗", title: "Build your profile", text: "Show what you do, where you work and who you are available for." },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <main className="site-shell">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div>
        <div className="nav-links"><a href="#how">How it works</a><a href="#network">The network</a></div>
        <div className="nav-actions"><button className="ghost" onClick={() => setShowLogin(true)}>Log in</button><button className="primary small" onClick={() => setShowSignup(true)}>Join NEONDO</button></div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> BUILT FOR THE PEOPLE BEHIND THE EVENTS</div>
          <h1>Berlin's event<br /><em>network.</em></h1>
          <p className="hero-text">NEONDO connects the people who make events happen — crews, freelancers, technicians and production teams.</p>
          <div className="hero-buttons"><button className="primary" onClick={() => setShowSignup(true)}>Join the network <span>→</span></button><button className="text-button" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>See how it works ↓</button></div>
          <div className="proof"><div className="avatars"><span>AM</span><span>LK</span><span>JD</span><span>+</span></div><span>Built for Berlin's event community</span></div>
        </div>
        <div className="hero-card-wrap">
          <div className="glow" />
          <div className="network-card">
            <div className="card-top"><span>NEONDO NETWORK</span><span className="live">● LIVE</span></div>
            <div className="profile-row"><div className="avatar large">MK</div><div><strong>Max König</strong><span>Stage Manager · Berlin</span></div><b>•••</b></div>
            <div className="shift"><div><small>OPEN SHIFT</small><strong>Production Crew</strong><span>Tomorrow · 18:00 — 02:00</span></div><button>View →</button></div>
            <div className="mini-stats"><div><b>1,240</b><span>Professionals</span></div><div><b>86</b><span>Open shifts</span></div><div><b>42</b><span>Companies</span></div></div>
          </div>
        </div>
      </section>

      <section className="ticker"><span>STAGEHANDS</span><i>✦</i><span>PRODUCTION</span><i>✦</i><span>TECHNICIANS</span><i>✦</i><span>EVENT CREW</span><i>✦</i><span>FREELANCERS</span><i>✦</i><span>BERLIN</span></section>

      <section id="how" className="features">
        <div className="section-intro"><span className="eyebrow">ONE PLACE. REAL PEOPLE.</span><h2>Made for the people<br />behind the <em>scenes.</em></h2></div>
        <div className="feature-grid">{features.map((f) => <article className="feature" key={f.title}><div className="feature-icon">{f.icon}</div><h3>{f.title}</h3><p>{f.text}</p><a href="#network">Learn more <span>→</span></a></article>)}</div>
      </section>

      <section id="network" className="cta"><div><span className="eyebrow">YOUR NETWORK. YOUR OPPORTUNITIES.</span><h2>Ready to get<br /><em>connected?</em></h2></div><button className="primary" onClick={() => setShowSignup(true)}>Create your profile <span>→</span></button></section>

      <footer><div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div><span>© 2026 NEONDO · Berlin</span><span>Built for the event community.</span></footer>

      {(showLogin || showSignup) && <div className="modal-backdrop" onClick={() => { setShowLogin(false); setShowSignup(false); }}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => { setShowLogin(false); setShowSignup(false); }}>×</button><div className="modal-brand"><span className="brand-mark">N</span></div><span className="eyebrow">WELCOME TO NEONDO</span><h2>{showLogin ? "Welcome back." : "Join the network."}</h2><p>{showLogin ? "Log in to continue to your NEONDO profile." : "Create your profile and start connecting."}</p><button className="provider">Continue with Google <span>G</span></button><button className="provider">Continue with Apple <span>●</span></button><div className="divider"><span>or</span></div><input placeholder="Email address" type="email" /><button className="primary full">Continue <span>→</span></button><small>By continuing, you agree to NEONDO's Terms and Privacy Policy.</small></div></div>}
    </main>
  );
}
