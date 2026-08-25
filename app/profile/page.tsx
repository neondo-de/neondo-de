"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { ArrowLeft, Save, Upload, Trash2, FileText, Check, Plus, X } from "lucide-react";

const roleOptions=["Stagehand","Stage Manager","Lighting Technician","Sound Technician","Production Assistant","Production Manager","Event Crew","Runner","AV Technician","Rigging","Sound Engineer","Videographer"];
const skillOptions=["Stagehand","Load-in / Load-out","Lighting","Lighting Technician","Audio","Sound Engineer","AV","AV Technician","Rigging","Production Assistant","Production Manager","Event Crew","Runner","Forklift","Accreditation","Artist Liaison"];

type Doc={id:string;name:string;document_path:string;mime_type?:string;file_size?:number;created_at:string};

export default function ProfilePage(){
 const supabase=getSupabase();
 const [user,setUser]=useState<any>(null);
 const [form,setForm]=useState<any>({first_name:"",last_name:"",primary_role:"",experience_level:"",years_experience:"",city:"Berlin",postcode:"",bio:"",previous_experience:"",availability_status:"available"});
 const [skills,setSkills]=useState<string[]>([]); const [docs,setDocs]=useState<Doc[]>([]); const [newSkill,setNewSkill]=useState("");
 const [saved,setSaved]=useState(false); const [loading,setLoading]=useState(true); const [uploading,setUploading]=useState(false); const [error,setError]=useState("");

 useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser();if(!user){location.href="/";return}setUser(user);
   const [{data:profile},{data:workerSkills},{data:documents}]=await Promise.all([
    supabase.from("worker_profiles").select("*").eq("id",user.id).maybeSingle(),
    supabase.from("worker_skills").select("skill_id,skills(name)").eq("worker_id",user.id),
    supabase.from("worker_profile_documents").select("*").eq("worker_id",user.id).order("created_at",{ascending:false})
   ]);
   if(profile)setForm({first_name:profile.first_name||"",last_name:profile.last_name||"",primary_role:profile.primary_role||"",experience_level:profile.experience_level||"",years_experience:profile.years_experience??"",city:profile.city||"Berlin",postcode:profile.postcode||"",bio:profile.bio||"",previous_experience:profile.previous_experience||"",availability_status:profile.availability_status||"available"});
   setSkills((workerSkills||[]).map((x:any)=>x.skills?.name).filter(Boolean)); setDocs((documents||[]) as Doc[]); setLoading(false);
 })()},[]);

 async function save(){if(!user)return;setError("");const {error}=await supabase.from("worker_profiles").upsert({id:user.id,...form,years_experience:form.years_experience?Number(form.years_experience):null,updated_at:new Date().toISOString()});if(error){setError(error.message);return}
   const {data:allSkills}=await supabase.from("skills").select("id,name"); await supabase.from("worker_skills").delete().eq("worker_id",user.id);
   const rows=skills.map(name=>{const s=(allSkills||[]).find((x:any)=>x.name===name);return s?{worker_id:user.id,skill_id:s.id}:null}).filter(Boolean); if(rows.length)await supabase.from("worker_skills").insert(rows);
   setSaved(true);setTimeout(()=>setSaved(false),2200);
 }
 async function uploadDocument(file:File){if(!user)return;if(file.size>10*1024*1024){setError("Documents must be 10 MB or smaller.");return}if(!["application/pdf","image/jpeg","image/png","image/webp"].includes(file.type)){setError("Use PDF, JPG, PNG or WEBP files.");return}setUploading(true);setError("");
   const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");const path=`${user.id}/${crypto.randomUUID()}-${safe}`;const {error:uploadError}=await supabase.storage.from("worker-documents").upload(path,file,{contentType:file.type,upsert:false});
   if(uploadError){setError(uploadError.message);setUploading(false);return}
   const {data,error:dbError}=await supabase.from("worker_profile_documents").insert({worker_id:user.id,name:file.name,document_path:path,mime_type:file.type,file_size:file.size}).select("*").single();
   if(dbError){await supabase.storage.from("worker-documents").remove([path]);setError(dbError.message)}else setDocs(d=>[db as Doc,...d]);setUploading(false);
 }
 async function openDocument(doc:Doc){const {data,error}=await supabase.storage.from("worker-documents").createSignedUrl(doc.document_path,300);if(error){setError(error.message);return}window.open(data.signedUrl,"_blank")}
 async function removeDocument(doc:Doc){const {error}=await supabase.storage.from("worker-documents").remove([doc.document_path]);if(error){setError(error.message);return}await supabase.from("worker_profile_documents").delete().eq("id",doc.id);setDocs(d=>d.filter(x=>x.id!==doc.id))}
 function addSkill(){const value=newSkill.trim();if(value&&!skills.includes(value)){setSkills([...skills,value]);setNewSkill("")}}
 if(loading)return <div className="dashboard-loading">Loading profile…</div>;
 return <main className="profile-page"><div className="profile-top"><a href="/dashboard"><ArrowLeft size={18}/> Back to dashboard</a><div className="brand"><span className="brand-mark">N</span><span>NEONDO</span></div></div>
 <section className="profile-form"><span className="eyebrow">YOUR NEONDO PROFILE</span><h1>Make your profile<br/><em>work for you.</em></h1><p>Tell crews and companies what you do, where you work and what you're good at.</p>
 {error&&<div className="profile-alert">{error}</div>}
 <div className="profile-section"><div><span className="eyebrow">BASIC INFORMATION</span><h2>Your details</h2></div><div className="form-grid"><label>First name<input value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})}/></label><label>Last name<input value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})}/></label><label>Primary role<select value={form.primary_role} onChange={e=>setForm({...form,primary_role:e.target.value})}><option value="">Select a role</option>{roleOptions.map(x=><option key={x}>{x}</option>)}</select></label><label>Experience<select value={form.experience_level} onChange={e=>setForm({...form,experience_level:e.target.value})}><option value="">Select level</option><option>Entry level</option><option>Intermediate</option><option>Experienced</option><option>Senior</option></select></label><label>Years of experience<input type="number" min="0" max="60" value={form.years_experience} onChange={e=>setForm({...form,years_experience:e.target.value})}/></label><label>Availability<select value={form.availability_status} onChange={e=>setForm({...form,availability_status:e.target.value})}><option value="available">Available</option><option value="limited">Limited availability</option><option value="unavailable">Not available</option></select></label><label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>Postcode<input value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})}/></label><label className="wide">Bio<textarea rows={5} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} placeholder="A short introduction about you and your experience…"/></label><label className="wide">Previous experience<textarea rows={5} value={form.previous_experience} onChange={e=>setForm({...form,previous_experience:e.target.value})} placeholder="Companies, venues, productions or events you've worked on…"/></label></div></div>
 <div className="profile-section"><div><span className="eyebrow">SKILLS</span><h2>What you can do</h2><p className="section-note">Add the skills companies should see on your profile.</p></div><div className="skill-editor"><div className="skill-list">{skills.map(s=><span key={s}>{s}<button onClick={()=>setSkills(skills.filter(x=>x!==s))}><X size={13}/></button></span>)}</div><div className="skill-add"><select value={newSkill} onChange={e=>setNewSkill(e.target.value)}><option value="">Choose a skill</option>{skillOptions.filter(x=>!skills.includes(x)).map(x=><option key={x}>{x}</option>)}</select><button onClick={addSkill}><Plus size={15}/> Add skill</button></div></div></div>
 <div className="profile-section"><div><span className="eyebrow">DOCUMENTS</span><h2>Certificates & documents</h2><p className="section-note">Keep certificates and work documents here. They're private and only accessible from your account unless you choose to share them later.</p></div><div className="documents-box"><label className="upload-drop"><Upload size={20}/><strong>{uploading?"Uploading…":"Upload a document"}</strong><span>PDF, JPG, PNG or WEBP · max 10 MB</span><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" disabled={uploading} onChange={e=>{const f=e.target.files?.[0];if(f)uploadDocument(f);e.currentTarget.value=""}}/></label>{docs.length>0&&<div className="document-list">{docs.map(doc=><div className="document-item" key={doc.id}><FileText size={20}/><div><strong>{doc.name}</strong><span>{doc.file_size?`${Math.max(1,Math.round(doc.file_size/1024))} KB`:"Document"}</span></div><div className="document-actions"><button onClick={()=>openDocument(doc)}>View</button><button onClick={()=>removeDocument(doc)} aria-label="Delete"><Trash2 size={15}/></button></div></div>)}</div>}</div></div>
 <div className="form-actions"><span>{saved?<><Check size={15}/> Profile saved</>:""}</span><button onClick={save}><Save size={16}/> Save profile</button></div>
 </section></main>
}
