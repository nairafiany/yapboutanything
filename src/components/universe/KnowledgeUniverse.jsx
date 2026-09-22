"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Shuffle } from "lucide-react";
import KnowledgeBubble from "./KnowledgeBubble";
import DepthTrail from "./DepthTrail";

export default function KnowledgeUniverse({ path, explored, hasInteracted, onEnter, onJump, onPrompt, onRandom }) {
  const current = path[path.length - 1];
  const isRoot = current.id === "root";
  const children = current.children || [];
  const prompts = current.prompts || [];

  return (
    <motion.main className={`universe ${isRoot ? "at-root" : "inside"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .84 }}>
      <div className="paper-noise" />
      <DepthTrail path={path} onJump={onJump} />
      <button className="random-button" onClick={onRandom} aria-label="Take me to a random question"><Shuffle size={15} /> surprise me</button>
      <AnimatePresence mode="popLayout">
        <motion.section className="universe-stage" key={current.id} initial={{ opacity: 0, scale: .58 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2.2 }} transition={{ duration: .7, ease: [.16,1,.3,1] }}>
          <header className="universe-heading">
            {isRoot ? <>
              <h1>yapboutanything<span>.</span></h1>
              <p>find something. think a little. yap about it.</p>
            </> : <>
              <span className="level-label">inside</span>
              <h1>{current.title}</h1>
              <p>{current.blurb}</p>
            </>}
          </header>

          <div className="bubble-field">
            {children.map((item, index) => <KnowledgeBubble key={item.id} item={item} index={index} total={children.length} root={isRoot} isExplored={explored.includes(item.id)} onEnter={onEnter} />)}
          </div>

          {prompts.length > 0 && <div className="prompt-discovery">
            <span className="prompt-kicker">something worth yapping about</span>
            <blockquote>{prompts[0].question}</blockquote>
            <button onClick={() => onPrompt(prompts[0])}>start yapping <ArrowRight size={18} /></button>
          </div>}

          {!children.length && !prompts.length && <button className="empty-reroute" onClick={onRandom}>another rabbit hole <ArrowRight size={16} /></button>}
        </motion.section>
      </AnimatePresence>
      {isRoot && !hasInteracted && <motion.p className="first-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>pick something. keep going.</motion.p>}
      <span className="edge-note">drag the universe · esc to go back</span>
    </motion.main>
  );
}
