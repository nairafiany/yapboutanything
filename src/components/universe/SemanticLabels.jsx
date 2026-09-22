"use client";

import { useEffect, useState } from "react";
import { composeLabels, reveal } from "./composition.mjs";

export default function SemanticLabels({ nodes, context, camera, view, hovered, onPrompt }) {
  const [metrics,setMetrics]=useState(null);
  useEffect(()=>{
    let active=true;
    document.fonts.ready.then(()=>{
      if(!active)return;
      const ctx=document.createElement("canvas").getContext("2d");
      if(!ctx)return;
      setMetrics({measure:(text,size,family)=>{
        ctx.font=`400 ${size}px "${family==='sans'?'DM Sans':'Instrument Serif'}"`;
        return ctx.measureText(text).width;
      }});
    });
    return()=>{active=false};
  },[]);
  const brand={x:1450*camera.scale+camera.x-116,y:770*camera.scale+camera.y-26,width:232,height:54};
  const brandOpacity=1-reveal(camera.scale,.48,.76);
  const showBrand=brandOpacity>0 && brand.x>24 && brand.x+brand.width<view.width-24 && brand.y>90 && brand.y+brand.height<view.height-100
    && !nodes.some(n=>Math.hypot(Math.max(brand.x,Math.min(n.cx,brand.x+brand.width))-n.cx,Math.max(brand.y,Math.min(n.cy,brand.y+brand.height))-n.cy)<n.r);
  const {labels,prompt}=composeLabels(nodes,context,view,metrics?.measure,showBrand?[brand]:[]);
  return <div className="semantic-layer">
    {showBrand && <aside className="world-brand" style={{left:brand.x,top:brand.y,width:brand.width,opacity:brandOpacity}}>
      <h1>yapboutanything<span>.</span></h1><p>find something. think a little. yap about it.</p>
    </aside>}
    {labels.map(label=><div key={label.node.id} data-label-for={label.node.id}
      className={`spatial-label ${label.current?'context-label':''} ${label.prompt?'prompt-topic':''} ${hovered===label.node.id?'label-hovered':''}`}
      style={{left:label.x,top:label.y,width:label.width,fontSize:label.size,opacity:label.opacity}}>
      <h2>{label.lines.map((line,i)=><span key={i}>{line}</span>)}</h2>
      {!!label.description.length && <p>{label.description.map((line,i)=><span key={i}>{line}</span>)}</p>}
    </div>)}
    {prompt && <section className="spatial-prompt" aria-label={`${prompt.node.title} question`} style={{left:prompt.x,top:prompt.y,width:prompt.width,opacity:prompt.opacity}}>
      <p className="spatial-eyebrow">something worth yapping about</p>
      <blockquote style={{fontSize:prompt.size}}>{prompt.lines.map((line,i)=><span key={i}>{line}</span>)}</blockquote>
      <button className="prompt-start" style={{pointerEvents:prompt.opacity>.8?'auto':'none'}} tabIndex={prompt.opacity>.8?0:-1} onClick={()=>onPrompt(prompt.node.prompts[0],prompt.node)}>start yapping <span aria-hidden="true">&rarr;</span></button>
    </section>}
  </div>;
}
