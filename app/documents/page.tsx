"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import "../app-pages.css";

type Doc = { id: string; name: string; document_path: string; mime_type: string | null; file_size: number | null; created_at: string };

export default function DocumentsPage() {
  const supabase = getSupabase();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { location.href = "/"; return; }
    const { data, error } = await supabase.from("worker_profile_documents").select("id,name,document_path,mime_type,file_size,created_at").eq("worker_id", user.id).order("created_at", { ascending: false });
    if (!error) setDocs((data || []) as Doc[]);
  }

  useEffect(() => { load(); }, []);

  async function upload() {
    if (!file) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in again.");
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${user.id}/${crypto.randomUUID()}-${safe}`;
      const { error: uploadError } = await supabase.storage.from("worker-documents").upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (uploadError) throw uploadError;
      const { error: rowError } = await supabase.from("worker_profile_documents").insert({ worker_id: user.id, name: name.trim() || file.name, document_path: path, mime_type: file.type || null, file_size: file.size });
      if (rowError) { await supabase.storage.from("worker-documents").remove([path]); throw rowError; }
      setFile(null); setName(""); setMessage("Document uploaded securely.");
      const input = document.getElementById("document-file") as HTMLInputElement | null; if (input) input.value = "";
      await load();
    } catch (e: any) { setError(e.message || "Upload failed."); }
    finally { setBusy(false); }
  }

  async function removeDoc(doc: Doc) {
    if (!confirm(`Delete ${doc.name}?`)) return;
    setError("");
    const { error: storageError } = await supabase.storage.from("worker-documents").remove([doc.document_path]);
    if (storageError) { setError(storageError.message); return; }
    const { error: rowError } = await supabase.from("worker_profile_documents").delete().eq("id", doc.id);
    if (rowError) { setError(rowError.message); return; }
    setDocs(current => current.filter(d => d.id !== doc.id));
  }

  function size(bytes: number | null) { if (!bytes) return "—"; if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

  return <main className="simple-page">
    <a className="back" href="/dashboard">← Back to dashboard</a>
    <section className="simple-card wide">
      <span className="stage-label">NEONDO / DOCUMENTS</span>
      <h1>Your documents.</h1>
      <p>Keep CVs, permits, certificates and other work documents securely attached to your profile.</p>
      <div className="upload-drop" style={{ padding: 24, marginTop: 28 }}>
        <input id="document-file" type="file" accept="application/pdf,image/*,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
        <input aria-label="Document name" value={name} onChange={e => setName(e.target.value)} placeholder="Document name (optional)" style={{ display: "block", width: "100%", marginTop: 12, padding: 12, border: "1px solid #111", background: "#f8f5ed" }} />
        <button className="setting-button" disabled={!file || busy} onClick={upload} style={{ marginTop: 12, padding: "12px 16px", fontWeight: 800 }}>{busy ? "Uploading…" : "Upload document ↗"}</button>
      </div>
      {message && <p style={{ marginTop: 16, fontWeight: 700 }}>{message}</p>}
      {error && <p style={{ marginTop: 16, color: "#b4362e", fontWeight: 700 }}>{error}</p>}
      <div className="simple-list" style={{ marginTop: 30 }}>
        {docs.length === 0 ? <article style={{ padding: "20px 0" }}>No documents yet. Add your first one above.</article> : docs.map(doc => <article className="document-item" key={doc.id} style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", padding: 18, marginBottom: 10 }}><div><strong>{doc.name}</strong><div style={{ fontSize: 12, marginTop: 5 }}>{size(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString()}</div></div><button className="document-actions" onClick={() => removeDoc(doc)} style={{ border: "1px solid #111", background: "transparent", padding: "8px 12px", fontWeight: 800 }}>Delete</button></article>)}
      </div>
    </section>
  </main>;
}
