"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { formatTime, playChime } from "@/lib/sound";

export default function SessionTimer({ mode, duration, prompt, sound, onDone, onExit }) {
  const [remaining, setRemaining] = useState(duration);
  useEffect(() => {
    if (remaining <= 0) {
      if (sound) playChime(mode);
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setRemaining((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, mode, sound, onDone]);

  const progress = remaining / duration;
  return <motion.main className={`focus-screen timer-screen ${mode} ${remaining <= 10 ? "ending" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button className="sound-toggle" onClick={onExit} aria-label="Exit timer"><X size={19} /></button>
    <section className="timer-content">
      <motion.p className="mode-word" key={mode} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{mode === "think" ? "THINK." : "YAP."}</motion.p>
      <div className="timer-ring" style={{ "--progress": `${progress * 360}deg` }}><span>{formatTime(remaining)}</span></div>
      <blockquote>{prompt.question}</blockquote>
      <p className="timer-note">{mode === "think" ? "let the first answer pass. see what comes next." : "out loud. messy is completely fine."}</p>
    </section>
    <div className="progress-line"><motion.span animate={{ scaleX: progress }} transition={{ duration: .4, ease: "linear" }} /></div>
  </motion.main>;
}
