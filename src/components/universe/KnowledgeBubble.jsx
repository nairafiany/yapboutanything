"use client";

import { motion, useReducedMotion } from "motion/react";

export default function KnowledgeBubble({ item, index, total, isExplored, onEnter, root }) {
  const reduced = useReducedMotion();
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2 + (root ? 0.13 : 0.35);
  const desktopRadius = root ? 38 : Math.min(34, 20 + total * 2);
  const x = 50 + Math.cos(angle) * desktopRadius;
  const y = 50 + Math.sin(angle) * (root ? 37 : 29);
  const size = root ? 150 + ((index * 37) % 66) : 170 + ((index * 41) % 52);

  return (
    <motion.button
      className={`knowledge-bubble ${root ? "root-bubble" : "inner-bubble"} ${isExplored ? "explored" : ""}`}
      style={{ "--x": `${x}%`, "--y": `${y}%`, "--size": `${size}px`, "--delay": `${(index % 6) * -1.3}s` }}
      initial={{ opacity: 0, scale: .65 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2.5 }}
      transition={{ duration: reduced ? 0 : .75, delay: reduced ? 0 : index * .035, ease: [.2,.8,.2,1] }}
      whileHover={reduced ? {} : { scale: 1.055, zIndex: 5 }}
      whileTap={{ scale: .98 }}
      onClick={() => onEnter(item)}
      aria-label={`Explore ${item.title}`}
    >
      <span className="bubble-grain" />
      <span className="bubble-title">{item.title}</span>
      <span className="bubble-blurb">{item.blurb}</span>
      {item.children?.length > 0 && <span className="bubble-preview" aria-hidden="true">
        {item.children.slice(0, 4).map((child, i) => <span key={child.id} style={{ "--i": i }}>{child.title}</span>)}
      </span>}
      <span className="go-deeper">go deeper →</span>
    </motion.button>
  );
}
