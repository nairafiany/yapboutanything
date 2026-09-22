"use client";

import { forwardRef } from "react";
import { friendlyTime } from "@/lib/sound";

const ShareCard = forwardRef(function ShareCard({ prompt, path, thinkTime, yapTime }, ref) {
  const topics = path.slice(1).map((p) => p.title);
  return <div className="share-card" ref={ref}>
    <div className="share-mark">yapboutanything<span>.</span></div>
    <div className="share-body">
      <p>TODAY I YAPPED ABOUT</p>
      <h2>{topics.at(-1)}</h2>
      <blockquote>“{prompt.question}”</blockquote>
      <div className="share-meta"><span>think <b>{friendlyTime(thinkTime)}</b></span><span>yap <b>{friendlyTime(yapTime)}</b></span></div>
      <div className="share-path">{topics.map((topic, i) => <span key={topic}>{topic.toLowerCase()}{i < topics.length - 1 && <i>↓</i>}</span>)}</div>
    </div>
    <div className="share-depth">{Math.max(1, topics.length)} layers deep.</div>
  </div>;
});
export default ShareCard;
