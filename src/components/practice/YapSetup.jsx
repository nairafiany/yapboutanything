"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { friendlyTime } from "@/lib/sound";

const thinkOptions = [15, 30, 60, 120];
const yapOptions = [30, 60, 120, 180, 300];

export default function YapSetup({ prompt, thinkTime, yapTime, sound, onChange, onStart, onBack }) {
  return <motion.main className="focus-screen setup-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button className="corner-back" onClick={onBack}><ArrowLeft size={17} /> universe</button>
    <button className="sound-toggle" onClick={() => onChange({ sound: !sound })} aria-label={sound ? "Mute sounds" : "Enable sounds"}>{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
    <section className="setup-card">
      <p className="eyebrow">before you yap</p>
      <h1>take a sec.</h1>
      <p className="setup-question">{prompt.question}</p>
      <div className="time-group">
        <h2>how long do you want to think?</h2>
        <div className="time-options">{thinkOptions.map((value) => <button className={thinkTime === value ? "selected" : ""} key={value} onClick={() => onChange({ thinkTime: value })}>{friendlyTime(value)}</button>)}</div>
      </div>
      <div className="time-group">
        <h2>how long do you want to yap?</h2>
        <div className="time-options">{yapOptions.map((value) => <button className={yapTime === value ? "selected" : ""} key={value} onClick={() => onChange({ yapTime: value })}>{friendlyTime(value)}</button>)}</div>
      </div>
      <button className="primary-cta" onClick={onStart}>let&apos;s go <ArrowRight size={18} /></button>
    </section>
  </motion.main>;
}
