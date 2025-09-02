"use client";
import { useEffect, useState } from "react";
type Props = { slug:string; videoSrc:string; title?:string };
export default function LockedVideo({ slug, videoSrc, title="Activation (Puja) Video" }:Props){
  const key = `unlock:${slug}`;
  const [unlocked,setUnlocked] = useState(false);
  useEffect(()=>{ try{ setUnlocked(localStorage.getItem(key)==="1") }catch{} },[key]);
  return (
    <div className="card p-4 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {!unlocked ? (
        <div className="space-y-3">
          <p className="text-sm text-white/70">This video unlocks after purchase. (Demo: click unlock)</p>
          <button className="btn" onClick={()=>{ try{ localStorage.setItem(key,"1") }catch{}; setUnlocked(true) }}>Unlock (demo)</button>
        </div>
      ) : (
        <video className="w-full rounded-lg" controls preload="metadata">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}