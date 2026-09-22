"use client";

import { motion } from "motion/react";

export default function IntroLoader({ onDone }) {
  return (
    <motion.section
      className="intro-loader"
      aria-label="Introducing yapboutanything"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="intro-orbit intro-orbit-one" aria-hidden="true" />
      <div className="intro-orbit intro-orbit-two" aria-hidden="true" />
      <div className="intro-copy">
        <p className="intro-kicker">A place for curious minds</p>
        <h1>yapbout<span>anything</span></h1>
        <p className="intro-tagline">Find something worth talking about.</p>
        <div className="intro-progress" aria-hidden="true"><span /></div>
      </div>
      <button className="intro-skip" type="button" onClick={onDone}>Enter now</button>
      <p className="intro-coordinate" aria-hidden="true">thoughts, unfolding</p>
    </motion.section>
  );
}
