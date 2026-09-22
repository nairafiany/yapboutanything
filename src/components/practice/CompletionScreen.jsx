"use client";

import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { friendlyTime } from "@/lib/sound";

export default function CompletionScreen({ prompt, yapTime, feeling, onFeel, onAgain, onAnother, onUniverse, onShare }) {
  return <motion.main className="focus-screen completion-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <section className="completion-card">
      <p className="eyebrow">{friendlyTime(yapTime)} · out loud</p>
      <h1>that&apos;s a yap.</h1>
      <p className="completion-copy">you just spent {friendlyTime(yapTime)} actually saying what you think.</p>
      <blockquote>{prompt.question}</blockquote>
      <div className="feeling-group">
        <p>how did that one feel?</p>
        <div>{["got stuck", "could've been clearer", "pretty solid"].map((item) => <button className={feeling === item ? "selected" : ""} onClick={() => onFeel(item)} key={item}>{item}</button>)}</div>
      </div>
      <div className="completion-actions">
        <button onClick={onAgain}><RotateCcw size={16} /> yap again</button>
        <button onClick={onAnother}>another thing <ArrowRight size={16} /></button>
        <button className="share-action" onClick={onShare}><Share2 size={16} /> share this yap</button>
      </div>
      <button className="text-action" onClick={onUniverse}>return to universe</button>
    </section>
  </motion.main>;
}
