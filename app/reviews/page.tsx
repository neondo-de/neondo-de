"use client";
import { useEffect, useState } from "react";
import { Star, ArrowLeft } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function ReviewsPage(){
 const supabase=getSupabase(); const [reviews,setReviews]=useState<any[]>([]); const [rating,setRating]=useState(5); const [comment,setComment]=useState(""); const [notice,setNotice]=useState("");
 useEffect(()=>{supabase.from("neondo_reviews").select("rating,comment,created_at").order("created_at",{ascending:false}).limit(20).then(({data})=>setReviews(data||[]))},[]);
 async function submit(e:any){e.preventDefault();setNotice("");const {data:{user}}=await supabase.auth.getUser();if(!user){location.href="/";return}setNotice("Reviews are added after a completed shift, so they stay fair and useful.")}
 return <main className="simple-page"><a className="back" href="/dashboard"><ArrowLeft size={16}/> Back to dashboard</a><div className="simple-card wide"><span className="eyebrow">TRUST</span><h1>Reviews</h1><p className="muted">Simple ratings help great crew and companies find each other.</p><form className="review-form" onSubmit={submit}><div className="stars">{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?"star active":"star"} onClick={()=>setRating(n)}><Star size={22} fill="currentColor"/></button>)}</div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Leave a short note…" maxLength={1000}/><button className="primary" type="submit">Add review →</button></form>{notice&&<p className="notice">{notice}</p>}<div className="review-list">{reviews.map((r,i)=><article key={i}><div className="review-stars">{Array.from({length:r.rating},(_,x)=><Star key={x} size={14} fill="currentColor"/>)}</div><p>{r.comment||"Great experience."}</p></article>)}</div></div></main>
}
