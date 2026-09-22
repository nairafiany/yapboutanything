"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { Download, Share2, X } from "lucide-react";
import ShareCard from "./ShareCard";

export default function ShareModal({ prompt, path, thinkTime, yapTime, onClose }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  async function makeFile() {
    setBusy(true);
    const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true });
    setBusy(false);
    return new File([blob], "my-yap.png", { type: "image/png" });
  }
  async function download() {
    const file = await makeFile();
    const url = URL.createObjectURL(file);
    const a = document.createElement("a"); a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url);
  }
  async function share() {
    const file = await makeFile();
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ title: "my yap", files: [file] }); else download();
  }
  return <div className="share-overlay" role="dialog" aria-modal="true" aria-label="Share your yap">
    <button className="share-close" onClick={onClose}><X size={20} /></button>
    <div className="share-preview"><ShareCard ref={cardRef} prompt={prompt} path={path} thinkTime={thinkTime} yapTime={yapTime} /></div>
    <div className="share-controls"><button onClick={download} disabled={busy}><Download size={17} /> save image</button><button onClick={share} disabled={busy}><Share2 size={17} /> {busy ? "making it…" : "share"}</button></div>
  </div>;
}
