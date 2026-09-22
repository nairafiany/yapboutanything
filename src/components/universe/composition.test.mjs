import test from 'node:test';
import assert from 'node:assert/strict';
import { rootNode } from '../../content/universe.js';
import { buildWorld, composeLabels, contextAt, destination, insideCircle, intersects, layoutMode, projectWorld } from './composition.mjs';

const views=[{width:1440,height:900},{width:1280,height:720},{width:390,height:844},{width:320,height:568},{width:844,height:390}];
for(const view of views) {
  test(`every destination has readable, bounded composition at ${view.width} x ${view.height}`,()=>{
    const world=buildWorld(rootNode,layoutMode(view));
    for(const node of world.flat) {
      const projected=projectWorld(world,destination(node,view));
      const context=contextAt(projected,view);
      assert.equal(context?.id,node.id,`${node.id}: the selected thought owns its destination`);
      const {labels,prompt,safe}=composeLabels(projected,context,view);
      assert.ok(labels.some(l=>l.node.id===node.id),`${node.id}: context heading is visible`);
      const boxes=[...labels,...(prompt?[prompt]:[])];
      for(const box of boxes) {
        assert.ok(box.size>=14&&box.size<=72,`${node.id}: bounded readable type`);
        assert.ok(insideCircle(box,box.node),`${node.id}: circle text padding`);
        assert.ok(box.x>=safe.x&&box.x+box.width<=safe.x+safe.width+.01,`${node.id}: horizontal safe zone`);
        assert.ok(box.y>=safe.y&&box.y+box.height<=safe.y+safe.height+.01,`${node.id}: vertical safe zone`);
      }
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!intersects(boxes[i],boxes[j],0),`${node.id}: text collision`);
      if(!node.children?.length&&node.prompts?.length)assert.ok(prompt&&prompt.opacity>.95,`${node.id}: question and CTA resolve`);
      if(node.children?.length) {
        const readable=labels.filter(l=>l.node.parentId===node.id);
        assert.ok(readable.length>=Math.min(3,node.children.length),`${node.id}: several children remain readable while smaller cells stay quiet`);
      }
    }
  });
  test(`panning and intermediate zoom keep text inside safe regions at ${view.width} x ${view.height}`,()=>{
    const world=buildWorld(rootNode,layoutMode(view));
    for(const node of world.flat.filter(n=>n.depth<=3)) {
      const from=destination(world.byId[node.parentId],view),to=destination(node,view);
      for(const t of [.15,.4,.7,1]) {
        const camera={x:from.x+(to.x-from.x)*t+view.width*.1,y:from.y+(to.y-from.y)*t,scale:from.scale+(to.scale-from.scale)*t};
        const projected=projectWorld(world,camera),context=contextAt(projected,view);
        const {labels,prompt}=composeLabels(projected,context,view);
        const boxes=[...labels,...(prompt?[prompt]:[])];
        for(const box of boxes)assert.ok(insideCircle(box,box.node));
        for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!intersects(boxes[i],boxes[j],0));
      }
    }
  });
}
test('child geometry is deterministic and remains nested',()=>{
  for(const mobile of ['desktop','portrait','landscape']) {
    const world=buildWorld(rootNode,mobile);
    assert.deepEqual(world,buildWorld(rootNode,mobile));
    for(const n of world.flat.filter(n=>n.parentId)) {
      const parent=world.byId[n.parentId];
      assert.ok(Math.hypot(n.x-parent.x,n.y-parent.y)+n.radius<parent.radius,`${n.id}: physically nested`);
    }
  }
});
