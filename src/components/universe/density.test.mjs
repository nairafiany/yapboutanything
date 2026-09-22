import test from 'node:test';
import assert from 'node:assert/strict';
import { domains, findPath, rootNode } from '../../content/universe.js';
import { buildWorld, composeLabels, contextAt, destination, projectWorld } from './composition.mjs';

const world=buildWorld(rootNode);
const view={width:1440,height:900};
const camera=destination(null,view);
const visible=c=>projectWorld(world,c).filter(n=>n.r>=1.8&&n.cx+n.r>0&&n.cx-n.r<view.width&&n.cy+n.r>0&&n.cy-n.r<view.height);

test('the atlas contains distinct real topics and reachable, authored questions',()=>{
  assert.ok(world.flat.length>=500);
  assert.equal(new Set(world.flat.map(n=>n.id)).size,world.flat.length);
  const prompts=world.flat.flatMap(n=>n.prompts);
  assert.ok(prompts.length>=400);
  assert.equal(new Set(prompts.map(p=>p.id)).size,prompts.length);
  assert.equal(new Set(prompts.map(p=>p.question)).size,prompts.length);
  for(const n of world.flat) {
    assert.ok(n.title&&n.blurb,`${n.id}: real topic metadata`);
    assert.equal(findPath(n.id)?.at(-1).id,n.id);
    if(!n.children.length)assert.ok(n.prompts.length,`${n.id}: no empty destinations`);
    for(const p of n.prompts)assert.ok(p.question.length>20&&p.question.endsWith('?'),`${n.id}: authored question`);
  }
  for(const domain of domains) {
    assert.ok(domain.children.length>=9,`${domain.id}: dense territory`);
    assert.ok(domain.children.filter(n=>n.children.length>=4).length>=2,`${domain.id}: visible deeper branches`);
  }
});

test('the root is a dense window with quiet labels and partial edge territories',()=>{
  const nodes=visible(camera);
  assert.ok(nodes.length>=280);
  assert.ok(nodes.filter(n=>n.depth===1).length>=25);
  for(const [min,max] of [[100,Infinity],[40,100],[10,40],[1.8,10]])assert.ok(nodes.filter(n=>n.r>=min&&n.r<max).length>=10);
  const {labels}=composeLabels(nodes,contextAt(nodes,view),view);
  assert.ok(labels.length<=28&&labels.length>=12);
  for(const edge of [n=>n.cx-n.r<0,n=>n.cx+n.r>view.width,n=>n.cy-n.r<0,n=>n.cy+n.r>view.height])assert.ok(nodes.some(n=>n.depth===1&&edge(n)));
});

test('panning discovers meaningful content in every direction',()=>{
  const initial=new Set(visible(camera).map(n=>n.id));
  for(const [x,y] of [[450,0],[-450,0],[0,450],[0,-450]]) {
    const discoveries=visible({...camera,x:camera.x+x,y:camera.y+y}).filter(n=>!initial.has(n.id));
    assert.ok(discoveries.length>=15,`${x}, ${y}: rewarding pan`);
    assert.ok(discoveries.some(n=>n.r>=24),`${x}, ${y}: usable targets`);
  }
});

test('packing preserves distinct sibling centers and variation in scale',()=>{
  for(const mode of ['desktop','portrait','landscape']) {
    const built=buildWorld(rootNode,mode);
    for(const parent of built.flat.filter(n=>n.children.length>5)) {
      const children=parent.children.map(n=>built.byId[n.id]);
      assert.ok(Math.max(...children.map(n=>n.radius))/Math.min(...children.map(n=>n.radius))>=1.6);
      for(let i=0;i<children.length;i++)for(let j=i+1;j<children.length;j++) {
        const a=children[i],b=children[j],distance=Math.hypot(a.x-b.x,a.y-b.y);
        assert.ok(distance>Math.max(a.radius,b.radius),`${parent.id}: no covered centers`);
        assert.ok(distance>=(a.radius+b.radius)*.989,`${parent.id}: only a slight edge overlap`);
      }
    }
  }
});
