"use client";

import { motion, useReducedMotion } from "motion/react";
import { clamp, reveal } from "./composition.mjs";

const tints = ["204 214 197", "225 203 183", "211 207 191", "205 213 211"];

export default function KnowledgeBubble({ node, cameraScale, isCurrent, isExplored, onEnter, onHover, hoverRelation, interactive }) {
  const reduced = useReducedMotion();
  const projected = node.radius * 2 * cameraScale;
  const unit = 1 / cameraScale;
  const seed = [...(node.ancestors[0] || node.id)].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return <motion.button
    className={`world-bubble depth-${node.depth} ${isCurrent ? "current" : ""} ${isExplored ? "explored" : ""} ${hoverRelation || ""}`}
    data-bubble-id={node.id}
    style={{
      left:node.x-node.radius,top:node.y-node.radius,width:node.radius*2,height:node.radius*2,zIndex:node.depth,
      pointerEvents:interactive?"auto":"none",
      "--unit":`${unit}px`,"--tint":tints[seed%tints.length],
      "--material-unit":`${unit*clamp(projected/140,.08,1)}px`,
      "--edge":`${unit*Math.min(.85,projected*.065)}px`,
      "--surface-alpha":Math.min(.57,.23+node.depth*.055),
      "--label-opacity":reveal(projected,90,160),
      "--blur":`${projected>100 && projected<1800 ? 1.4*unit : 0}px`,
    }}
    onClick={event=>{event.stopPropagation();onEnter(node)}}
    onHoverStart={()=>onHover(node.id)} onHoverEnd={()=>onHover(null)}
    onFocus={()=>onHover(node.id)} onBlur={()=>onHover(null)}
    tabIndex={interactive?0:-1} aria-label={`Enter ${node.title}`}
    whileHover={reduced?undefined:{scale:1.008}} transition={{duration:.4}}
  ><span className="territory-wash" aria-hidden="true" /></motion.button>;
}
