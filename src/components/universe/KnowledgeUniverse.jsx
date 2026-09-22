"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LocateFixed, Minus, Plus, Shuffle } from "lucide-react";
import KnowledgeBubble from "./KnowledgeBubble";
import SemanticLabels from "./SemanticLabels";
import DepthTrail from "./DepthTrail";
import { buildWorld, clamp, contextAt, destination, layoutMode, projectWorld } from "./composition.mjs";

const initialView={width:1200,height:760};
const initialCamera=destination(null,initialView);

export default function KnowledgeUniverse({path,explored,hasInteracted,onEnter,onJump,onPrompt,onRandom}) {
  const reduced=useReducedMotion();
  const viewport=useRef(null);
  const gesture=useRef({points:new Map(),moved:false,pinch:null});
  const [view,setView]=useState(initialView);
  const [camera,setCamera]=useState(initialCamera);
  const [renderedCamera,setRenderedCamera]=useState(initialCamera);
  const liveCamera=useRef(initialCamera);
  const [dragging,setDragging]=useState(false);
  const [hovered,setHovered]=useState(null);
  const root=path[0], currentId=path.at(-1).id;
  const mode=layoutMode(view);
  const world=useMemo(()=>buildWorld(root,mode),[root,mode]);
  const focus=useCallback(node=>setCamera(destination(node,view)),[view]);

  useEffect(()=>{
    const resize=()=>setView({width:innerWidth,height:innerHeight});
    resize();addEventListener("resize",resize);return()=>removeEventListener("resize",resize);
  },[]);
  useEffect(()=>{
    // Path changes reverse the same world transform; no screens are exchanged.
    const frame=requestAnimationFrame(()=>focus(world.byId[currentId]));
    return()=>cancelAnimationFrame(frame);
  },[currentId,world,focus]);

  const enterNode=useCallback(node=>{
    if(gesture.current.moved)return;
    focus(node);
    if(node.id!==currentId)onEnter(node);
  },[focus,onEnter,currentId]);
  const zoomAt=useCallback((x,y,factor)=>{
    const c=liveCamera.current;
    const scale=clamp(c.scale*factor,.24,100000);
    setCamera({scale,x:x-(x-c.x)*scale/c.scale,y:y-(y-c.y)*scale/c.scale});
  },[]);
  useEffect(()=>{
    const element=viewport.current;
    const wheel=e=>{
      if(e.target.closest(".map-controls,.depth-trail,.prompt-start"))return;
      e.preventDefault();
      if(e.ctrlKey||Math.abs(e.deltaY)>=Math.abs(e.deltaX))zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.0015));
      else {const c=liveCamera.current;setCamera({...c,x:c.x-e.deltaX,y:c.y-e.deltaY})}
    };
    element.addEventListener("wheel",wheel,{passive:false});
    return()=>element.removeEventListener("wheel",wheel);
  },[zoomAt]);

  const pointerDown=e=>{
    if(e.button!==0 || e.target.closest(".map-controls,.depth-trail,.prompt-start"))return;
    const g=gesture.current;
    g.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
    g.moved=false;g.x=e.clientX;g.y=e.clientY;g.camera=liveCamera.current;
    setCamera(liveCamera.current);
    if(g.points.size===2){
      const [a,b]=[...g.points.values()];
      g.pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),x:(a.x+b.x)/2,y:(a.y+b.y)/2,camera:liveCamera.current};
      g.moved=true;
    }
  };
  const pointerMove=e=>{
    const g=gesture.current;if(!g.points.has(e.pointerId))return;
    g.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(g.points.size===2&&g.pinch){
      const [a,b]=[...g.points.values()],p=g.pinch;
      const scale=clamp(p.camera.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,p.distance),.24,100000);
      g.moved=true;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId);
      setCamera({scale,x:(a.x+b.x)/2-(p.x-p.camera.x)*scale/p.camera.scale,y:(a.y+b.y)/2-(p.y-p.camera.y)*scale/p.camera.scale});return;
    }
    const dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(Math.hypot(dx,dy)>5){g.moved=true;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}
    if(g.moved)setCamera({...g.camera,x:g.camera.x+dx,y:g.camera.y+dy});
  };
  const pointerUp=e=>{
    const g=gesture.current;g.points.delete(e.pointerId);
    if(!g.points.size){setDragging(false);g.pinch=null}
    else {const [point]=g.points.values();g.pinch=null;g.x=point.x;g.y=point.y;g.camera=liveCamera.current}
    // Keep moved through the synthetic click; the next pointerdown clears it.
  };
  const nodes=projectWorld(world,renderedCamera);
  const context=contextAt(nodes,view);
  const visible=nodes.filter(n=>n.r>=1.8&&n.cx+n.r>-100&&n.cx-n.r<view.width+100&&n.cy+n.r>-100&&n.cy-n.r<view.height+100);
  const relation=node=>hovered&&(node.ancestors.includes(hovered)?"hover-child":world.byId[hovered]?.ancestors.includes(node.id)?"hover-parent":node.parentId===world.byId[hovered]?.parentId&&node.id!==hovered?"hover-neighbor":"");
  return <main ref={viewport} className={`world-viewport ${dragging?"dragging":""}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}
    onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')gesture.current.moved=false}}>
    <div className="paper-noise" />
    <motion.div className="camera-world" initial={initialCamera} animate={camera}
      onUpdate={latest=>{const next={x:latest.x,y:latest.y,scale:latest.scale};liveCamera.current=next;setRenderedCamera(next)}}
      transition={dragging||reduced?{duration:0}:{duration:.9,ease:[.16,1,.3,1]}}>
      {visible.map(node=><KnowledgeBubble key={node.id} node={node} cameraScale={renderedCamera.scale}
        interactive={node.r>24 && (!context || node.depth>=context.depth) && node.r<Math.max(view.width,view.height)*2}
        onHover={setHovered} hoverRelation={relation(node)} isCurrent={context?.id===node.id} isExplored={explored.includes(node.id)} onEnter={enterNode}/>)}
    </motion.div>
    <SemanticLabels nodes={visible} context={context} camera={renderedCamera} view={view} hovered={hovered} onPrompt={(prompt,node)=>{if(node.id!==currentId)onEnter(node);onPrompt(prompt)}}/>
    <div className="corner-brand">yapboutanything<span>.</span></div>
    <DepthTrail path={path} onJump={onJump}/>
    <div className="map-controls">
      <button onClick={()=>zoomAt(view.width/2,view.height/2,1.35)} aria-label="Zoom in"><Plus size={16}/></button>
      <button onClick={()=>zoomAt(view.width/2,view.height/2,.74)} aria-label="Zoom out"><Minus size={16}/></button>
      <button onClick={()=>{onJump(0);focus(null)}} aria-label="Reset view"><LocateFixed size={16}/></button>
      <button className="surprise-control" onClick={onRandom}><Shuffle size={15}/> <span>surprise me</span></button>
    </div>
    {!hasInteracted&&<p className="world-hint">drag to explore &middot; scroll to zoom &middot; pick something</p>}
    <div className="scale-readout">{context ? `depth ${context.depth} / ${context.children?.length?'keep exploring':'a thought to sit with'}` : 'a universe of things to think about'}<i/></div>
  </main>;
}
