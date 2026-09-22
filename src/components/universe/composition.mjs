// World geometry and screen typography deliberately have different coordinate systems.
export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export const reveal = (value, low, high) => clamp((value - low) / (high - low), 0, 1);
const territories = [[490,610,390],[1240,370,315],[2050,420,455],[2760,430,300],[170,1280,320],[750,1360,345],[1430,1110,250],[1960,1390,370],[2680,1220,410],[350,1940,290],[1070,1900,350],[1640,1850,260],[2220,1970,330],[2900,1870,310],[-120,420,280]];
const desktop = [[-.38,-.16,.32],[.38,-.05,.29],[-.26,.49,.29],[.4,.5,.25],[.02,-.27,.19]];
const portrait = [[-.24,-.2,.27],[.25,.05,.25],[-.22,.37,.26],[.2,.61,.25],[.26,-.45,.19]];
const landscape = [[-.66,.12,.22],[-.22,.2,.23],[.23,.08,.23],[.66,.2,.21],[.05,-.28,.17]];
export const layoutMode = view => view.width<640?'portrait':view.height<500?'landscape':'desktop';

const packingCache=new Map();
// Unequal cells fill the available body, leaving a quiet header pocket.
export function packChildren(count,mode) {
  const key=`${mode}:${count}`;
  if(packingCache.has(key))return packingCache.get(key);
  const mobile=mode==='portrait',short=mode==='landscape',placed=[];
  const desired=short?[.21,.2,.18,.155,.14,.13,.12,.11,.1,.095]:[.3,.26,.24,.205,.18,.165,.15,.135,.12,.11];
  const anchors=mobile?[[-.22,-.12],[.23,.21],[-.2,.54]]:short?[[-.6,.15],[.02,.13],[.58,.17]]:[[-.36,-.1],[.36,.04],[-.18,.5]];
  const candidates=Array.from({length:1800},(_,i)=>{
    const angle=i*2.399963229728653,reach=Math.sqrt((i+.5)/1800)*.96;
    return [Math.cos(angle)*reach,Math.sin(angle)*reach];
  });
  for(let i=0;i<count;i++) {
    let radius=(desired[i]||.085)*(mobile?.88:1),best=null;
    for(let attempt=0;attempt<36&&!best;attempt++,radius*=.95) {
      let score=Infinity;
      for(const [x,y] of candidates) {
        if(Math.hypot(x,y)+radius>.955)continue;
        if(mobile&&Math.abs(x)+radius>.53)continue;
        if(short&&(y-radius<-.12||y+radius>.39))continue;
        if(!short&&y-radius<-.45&&Math.abs(x)<.58+radius)continue;
        if(placed.some(([px,py,pr])=>Math.hypot(x-px,y-py)<(radius+pr)*.99))continue;
        const anchor=anchors[i];
        const cost=anchor?Math.hypot(x-anchor[0],y-anchor[1]):Math.min(...placed.map(([px,py,pr])=>Math.hypot(x-px,y-py)-pr-radius))+.08*Math.hypot(x,y);
        if(cost<score){score=cost;best=[x,y,radius]}
      }
    }
    if(!best)throw new Error(`Cannot pack ${count} topics in ${mode}`);
    placed.push(best);
  }
  packingCache.set(key,placed);
  return placed;
}

function placeTerritories(root) {
  const placed=territories.map(slot=>[...slot]);
  const center=[1500,1000];
  root.children.slice(territories.length).forEach((item,i)=>{
    const outer=i>=22;
    const nearIndex=root.children.findIndex(n=>n.id===item.near);
    const anchor=outer?[center[0]+Math.cos((i-22)*2.39996)*2450,center[1]+Math.sin((i-22)*2.39996)*1850]:territories[nearIndex]||center;
    let radius=outer?[265,205,310,235][i%4]:[145,110,175,95,130,155][i%6],best=null;
    for(let attempt=0;attempt<24&&!best;attempt++,radius*=.94) {
      let score=Infinity;
      for(let j=0;j<4000;j++) {
        const x=-1250+((j*.61803398875)%1)*5500,y=-1100+((j*.41421356237)%1)*4300;
        if(!outer&&(x<-350||x>3350||y<-150||y>2270))continue;
        // Retain a small intentional pocket for the root wordmark.
        if(Math.hypot(x-1450,y-770)<radius+185)continue;
        if(placed.some(([px,py,pr])=>Math.hypot(x-px,y-py)<radius+pr+8))continue;
        const cost=Math.hypot(x-anchor[0],y-anchor[1])+(outer?0:Math.hypot(x-center[0],y-center[1])*.16);
        if(cost<score){score=cost;best=[x,y,radius]}
      }
    }
    if(!best)throw new Error(`No territory space for ${item.id}`);
    placed.push(best);
  });
  return placed;
}

export function buildWorld(root, mode = 'desktop') {
  const mobile=mode==='portrait', short=mode==='landscape';
  const flat = [], byId = {};
  const roots=placeTerritories(root);
  function visit(item, x, y, radius, depth, parentId, ancestors) {
    const built = { ...item, x, y, radius, depth, parentId, ancestors };
    flat.push(built); byId[item.id] = built;
    const count = item.children?.length || 0;
    item.children?.forEach((child, i) => {
      let slot = (mobile ? portrait : short ? landscape : desktop)[i];
      if (count === 1) slot = [0, .23, mobile ? .43 : .52];
      if (count === 2) slot = mobile ? [[-.15,-.03,.36],[.12,.57,.31]][i] : short ? [[-.4,.18,.35],[.4,.22,.32]][i] : [[-.36,.1,.39],[.35,.32,.36]][i];
      if (count > 5) slot=packChildren(count,mode)[i];
      visit(child, x+slot[0]*radius, y+slot[1]*radius, radius*slot[2], depth+1, item.id, [...ancestors,item.id]);
    });
  }
  root.children.forEach((item,i) => visit(item,...roots[i],1,null,[]));
  return { flat, byId };
}

export function destination(node, view) {
  if (!node) return { x:view.width/2-1500*rootScale(view), y:view.height/2-1000*rootScale(view), scale:rootScale(view) };
  const mobile = view.width < 640;
  const availableHeight = Math.max(240, view.height-150);
  const radius = node.children?.length
    ? (mobile ? Math.min(availableHeight/1.8, (view.width-32)/1.02) : view.height<500 ? (view.width-64)/1.9 : Math.min((view.width-100)/2, availableHeight/1.72))
    : Math.min((view.width-40)/1.06, availableHeight/.95);
  const scale = radius / node.radius;
  return { x:view.width/2-node.x*scale, y:(view.height+20)/2-node.y*scale, scale };
}
function rootScale(view) { return clamp(view.width/2900,.3,.48); }

export function projectWorld(world, camera) {
  return world.flat.map(node => ({ ...node, cx:node.x*camera.scale+camera.x, cy:node.y*camera.scale+camera.y, r:node.radius*camera.scale }));
}
export function contextAt(nodes, view) {
  return nodes.filter(n => n.r > destination(n,view).scale*n.radius*.86 && Math.hypot(n.cx-view.width/2,n.cy-(view.height+20)/2) < Math.min(n.r*.65,view.width*.36))
    .sort((a,b) => b.depth-a.depth)[0] || null;
}
export function intersects(a,b,gap=8) { return a.x < b.x+b.width+gap && a.x+a.width+gap > b.x && a.y < b.y+b.height+gap && a.y+a.height+gap > b.y; }
export function insideCircle(box,node,padding=.1) {
  return [box.x,box.x+box.width].every(x => [box.y,box.y+box.height].every(y => Math.hypot(x-node.cx,y-node.cy) <= node.r*(1-padding)));
}
const estimate = (text,size) => text.length*size*.51;
export function wrapText(text,width,size,measure=estimate) {
  const lines=[];
  for(const word of text.split(/\s+/)) {
    const last=lines.at(-1);
    if(last && measure(`${last} ${word}`,size)<=width) lines[lines.length-1]=`${last} ${word}`;
    else lines.push(word);
  }
  // Avoid a lonely final word when both resulting lines still fit.
  if(lines.length>1 && !lines.at(-1).includes(' ')) {
    const words=lines.at(-2).split(' '), word=words.pop();
    if(words.length && measure(`${word} ${lines.at(-1)}`,size)<=width) { lines[lines.length-2]=words.join(' '); lines[lines.length-1]=`${word} ${lines.at(-1)}`; }
  }
  return lines;
}

export function composeLabels(nodes, context, view, measure=estimate, reserved=[]) {
  const mobile=view.width<640;
  const short=view.height<500;
  const safe={x:mobile?22:32,y:short?64:mobile?76:90,width:view.width-(mobile?44:64),height:view.height-(short?130:mobile?170:180)};
  const occupied=[...reserved], labels=[];
  const perParent=new Map();
  const childrenByParent=new Map();
  for(const n of nodes){if(!childrenByParent.has(n.parentId))childrenByParent.set(n.parentId,[]);childrenByParent.get(n.parentId).push(n)}
  const candidates=nodes.filter(n=>n.r>35 && n.cx+n.r>0 && n.cx-n.r<view.width && n.cy+n.r>0 && n.cy-n.r<view.height && (!context || n.id===context.id || (context.children?.length && (n.parentId===context.id || (!context.ancestors.includes(n.id) && n.depth<=context.depth)))))
    .sort((a,b)=>(b.id===context?.id)-(a.id===context?.id) || a.depth-b.depth || b.r-a.r);
  for(const n of candidates) {
    const current=n.id===context?.id;
    // Geometry can be abundant without demanding an equal amount of reading.
    const preview=n.parentId&&n.parentId!==context?.id;
    if(!current&&preview&&(perParent.get(n.parentId)||0)>=3)continue;
    if(!current&&labels.length>=(mobile?12:28))continue;
    const prompt=current && !n.children?.length && n.prompts?.length;
    const titleMeasure=(text,size)=>measure(text,size,prompt?'sans':undefined);
    const arrival=n.r/(destination(n,view).scale*n.radius);
    const intimacy=reveal(arrival,.65,1);
    const leafPrompt=!n.children?.length&&n.prompts?.length;
    const opacity=reveal(n.r*2,74,140) * (!n.children?.length ? 1 : 1-reveal(arrival,1.2,1.9)) * (preview ? .62 : context && !current && n.parentId!==context.id ? .4 : 1);
    if(opacity===0) continue;
    const isBranch=!!n.children?.length;
    const labelSize=clamp(n.r*.21,16,30);
    const preferredSize=leafPrompt ? labelSize+(14-labelSize)*intimacy : labelSize+(clamp(view.width*.032,28,46)-labelSize)*intimacy;
    let placed=null;
    // Secondary copy goes first; type then shrinks within readable bounds.
    const variants=[{size:preferredSize,detail:current&&!prompt&&n.r>230&&!short},{size:preferredSize,detail:false},{size:Math.max(14,preferredSize*.82),detail:false},{size:14,detail:false}];
    for(const {size,detail} of variants) {
      let width=Math.min(safe.width,n.r*(current?1.35:1.76),current?380:280,Math.max(titleMeasure(n.title,size)+4,detail?Math.min(320,n.r):0));
      const lines=wrapText(n.title,width,size,titleMeasure);
      if(lines.some(line=>titleMeasure(line,size)>width))continue;
      const description=detail ? wrapText(n.blurb,width,14,(t,s)=>measure(t,s,'sans')) : [];
      width=Math.min(width,Math.max(...lines.map(line=>titleMeasure(line,size)+4),...description.map(line=>measure(line,14,'sans')+4)));
      const height=lines.length*size*1.12+(description.length?description.length*19+10:0);
      const preferredY=n.cy+(isBranch?-.66:leafPrompt?-.55*intimacy:0)*n.r;
      const anchors=[[n.cx,preferredY],[n.cx,n.cy-n.r*.76],[n.cx,preferredY+n.r*.12],[n.cx,n.cy],[n.cx-n.r*.18,preferredY],[n.cx+n.r*.18,preferredY],[n.cx-n.r*.45,preferredY],[n.cx+n.r*.45,preferredY],[n.cx,n.cy+n.r*.58]];
      for(const [ax,ay] of anchors) {
        const box={x:clamp(ax-width/2,safe.x,safe.x+safe.width-width),y:clamp(ay-height/2,safe.y,safe.y+safe.height-height),width,height};
        if(!insideCircle(box,n) || occupied.some(other=>intersects(box,other)))continue;
        // Parent annotations occupy a clear pocket, never a child's material.
        if(isBranch && (childrenByParent.get(n.id)||[]).some(child=>child.r>30 && Math.hypot(clamp(child.cx,box.x,box.x+width)-child.cx,clamp(child.cy,box.y,box.y+height)-child.cy)<child.r+6))continue;
        placed={...box,node:n,lines,description,size,opacity,current,prompt}; break;
      }
      if(placed)break;
    }
    if(placed){occupied.push(placed);labels.push(placed);perParent.set(n.parentId,(perParent.get(n.parentId)||0)+1);}
  }
  let prompt=null;
  if(context && !context.children?.length && context.prompts?.length) {
    const n=context;
    const width=Math.min(780,safe.width,n.r*1.52);
    const top=labels.find(l=>l.node.id===n.id);
    for(let size=clamp(Math.min(view.width*.049,view.height*.071),30,72);size>=24;size-=2) {
      const lines=wrapText(n.prompts[0].question,width,size,measure);
      const height=lines.length*size*1.1+(short?84:112);
      const box={x:clamp(n.cx-width/2,safe.x,safe.x+safe.width-width),y:clamp(n.cy-height*.47,Math.max(safe.y,top?top.y+top.height+(short?16:28):safe.y),safe.y+safe.height-height),width,height};
      if(box.y<safe.y || box.y+height>safe.y+safe.height || !insideCircle(box,n) || occupied.some(other=>intersects(box,other,short?12:20)))continue;
      prompt={...box,node:n,lines,size,opacity:reveal(n.r/(destination(n,view).scale*n.radius),.86,.99)};break;
    }
  }
  return {labels,prompt,safe};
}
