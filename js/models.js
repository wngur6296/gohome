// Low-poly procedural models. Soft, odd, never scary.
import * as THREE from '../vendor/three.module.js';
import { mat } from './render.js';
import { tex } from './textures.js';
const B = (w, h, d, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; };
const S = (r, m, x = 0, y = 0, z = 0, det = 1) => { const o = new THREE.Mesh(new THREE.IcosahedronGeometry(r, det), m); o.position.set(x, y, z); return o; };
const C = (rt, rb, h, m, x = 0, y = 0, z = 0, seg = 7) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); return o; };
function glowSprite(color, size){ const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); s.scale.setScalar(size); return s; }
const M = {
  door(o){ const g = new THREE.Group(); const frame = mat({ color: o.frame || '#ffffff', emissive: o.glow ? '#554c55' : '#000' });
    g.add(B(1.3, .12, .22, frame, 0, 2.2, 0), B(.12, 2.25, .22, frame, -.6, 1.1, 0), B(.12, 2.25, .22, frame, .6, 1.1, 0));
    const leaf = B(1.06, 2.1, .08, mat({ tex: 'door', color: o.color || '#ffffff', emissive: o.glow ? o.glow : '#000' }), 0, 1.07, 0); g.add(leaf);
    g.add(S(.06, mat({ color: '#e8c56a', emissive: '#4a3a10' }), .4, 1.05, .07, 0));
    if (o.glow){ const s = glowSprite(o.glow, 3.4); s.position.set(0, 1.1, .2); g.add(s); }
    return g; },
  bed(){ const g = new THREE.Group(); const w = mat({ tex: 'wood', color: '#f0d0b0' }); g.add(B(1.6, .4, 2.4, w, 0, .25, 0), B(1.6, 1.1, .12, w, 0, .55, -1.2), B(1.5, .25, 2.2, mat({ color: '#c9b8f0', tex: 'stars' }), 0, .55, .05), B(.9, .18, .45, mat({ color: '#ffffff' }), 0, .75, -.85)); return g; },
  tv(){ const g = new THREE.Group(); g.add(B(1, .8, .8, mat({ color: '#d8d0c8' }), 0, .4, 0)); const scr = B(.8, .6, .02, mat({ color: '#9fe0ff', emissive: '#4aa0c0' }), 0, .42, .41); g.add(scr);
    return g; },
  duck(){ const g = new THREE.Group(); const y = mat({ color: '#ffe04a', emissive: '#3a3000' }); g.add(S(.22, y, 0, .2, 0), S(.14, y, 0, .44, .1), B(.12, .05, .1, mat({ color: '#ff9a3a' }), 0, .42, .24)); return g; },
  phone(){ const g = new THREE.Group(); const red = mat({ color: '#ff9fb8' }); const glass = mat({ color: '#e8fbff', opacity: .35, side: 'double' });
    g.add(B(1, .15, 1, red, 0, 2.5, 0), B(1, .1, 1, red, 0, .05, 0)); for (const [x, z] of [[-.47, -.47], [.47, -.47], [-.47, .47], [.47, .47]]) g.add(B(.08, 2.4, .08, red, x, 1.25, z));
    g.add(B(.9, 2.3, .02, glass, 0, 1.25, .47), B(.02, 2.3, .9, glass, .47, 1.25, 0), B(.02, 2.3, .9, glass, -.47, 1.25, 0), B(.3, .4, .15, mat({ color: '#444466' }), 0, 1.5, -.4));
    const l = glowSprite('#ffe8f0', 1.6); l.position.y = 2.2; g.add(l); return g; },
  house(o){ const g = new THREE.Group(); g.add(B(3, 2.4, 3, mat({ color: '#f6efe6' }), 0, 1.2, 0)); const roof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), mat({ color: o.roof || '#c98a9a' })); roof.position.y = 3.2; roof.rotation.y = Math.PI / 4; g.add(roof);
    g.add(B(.8, .8, .05, mat({ color: '#ffd98a', emissive: '#ffb84a' }), -.7, 1.5, 1.52), B(.8, 1.6, .05, mat({ color: '#a07a6a' }), .6, .8, 1.52)); const s = glowSprite('#ffcf7a', 2.5); s.position.set(-.7, 1.5, 1.7); g.add(s);
    const ch = B(.4, .9, .4, mat({ color: '#d8b8b0' }), .8, 3.6, -.6); g.add(ch); return g; },
  whale(o, rng, anim){ const g = new THREE.Group(); const m = mat({ color: '#b8c8ff', emissive: '#30305a' }); const body = S(1, m, 0, 0, 0, 1); body.scale.set(3, 1.2, 1.3); g.add(body);
    const tail = B(1.6, .1, .6, m, -3.3, .3, 0); g.add(tail); g.add(S(.12, mat({ color: '#202040' }), 2.3, .25, .9, 0));
    const R = o.orbit || 30, sp = o.speed || .05; const ph = rng() * 6; anim.push(t => { const a = t * sp + ph; g.position.set(Math.cos(a) * R + (o.cx || 0), (o.y || 14) + Math.sin(t * .5) * 1.2, Math.sin(a) * R + (o.cz || 0)); g.rotation.y = -a - Math.PI / 2 * -1 + Math.PI; tail.rotation.z = Math.sin(t * 1.5) * .3; });
    return g; },
  tree(o){ const g = new THREE.Group(); g.add(C(.12, .18, 2, mat({ color: '#e8d8c8' }), 0, 1, 0)); g.add(S(1, mat({ color: o.color || '#ffc8e0', emissive: '#30202a' }), 0, 2.6, 0, 1)); return g; },
  pillar(o){ const g = new THREE.Group(); g.add(C(.4, .4, o.h || 4, mat({ color: o.color || '#ffffff', tex: o.tex }), 0, (o.h || 4) / 2, 0, 10)); return g; },
  swing(o, rng, anim){ const g = new THREE.Group(); const m = mat({ color: '#f0a0b8' }); g.add(B(.1, 3, .1, m, -1, 1.5, 0), B(.1, 3, .1, m, 1, 1.5, 0), B(2.2, .1, .1, m, 0, 3, 0));
    const seat = new THREE.Group(); seat.position.y = 3; seat.add(B(.02, 2.3, .02, mat({ color: '#ffffff' }), -.3, -1.15, 0), B(.02, 2.3, .02, mat({ color: '#ffffff' }), .3, -1.15, 0), B(.7, .06, .3, mat({ tex: 'wood' }), 0, -2.3, 0)); g.add(seat);
    anim.push(t => seat.rotation.x = Math.sin(t * 1.1) * .35); return g; },
  fish(o, rng, anim){ const g = new THREE.Group(); const m = mat({ color: o.color || '#ffb07a', emissive: '#4a2010' }); const b = S(.35, m, 0, 0, 0, 1); b.scale.set(1.5, 1, .6); g.add(b); const t = B(.05, .4, .4, m, -.55, 0, 0); t.rotation.x = .78; g.add(t);
    wander(g, o, rng, anim, () => { t.rotation.y = Math.sin(performance.now() * .006) * .5; }, true); return g; },
  mailbox(o, rng, anim){ const g = new THREE.Group(); const m = mat({ color: o.color || '#8fc8ff' }); g.add(B(.5, .5, .7, m, 0, 1.25, 0), C(.04, .04, 1, mat({ color: '#ffffff' }), 0, .5, 0), B(.04, .3, .2, mat({ color: '#ff8a9a' }), .27, 1.45, .2));
    const legs = [B(.06, .5, .06, m, -.15, .25, 0), B(.06, .5, .06, m, .15, .25, 0)]; g.children[1].visible = false; legs.forEach(l => g.add(l));
    wander(g, o, rng, anim, t => { legs[0].rotation.x = Math.sin(t * 6) * .4; legs[1].rotation.x = -Math.sin(t * 6) * .4; }); return g; },
  tallhat(o, rng, anim){ // a very tall gentle figure made of a coat and a hat, waves slowly
    const g = new THREE.Group(); const coat = mat({ color: o.color || '#b8a8d8' }); g.add(C(.25, .45, 2.6, coat, 0, 1.3, 0, 6), S(.25, mat({ color: '#fff0e8' }), 0, 2.8, 0, 1), C(.32, .32, .05, mat({ color: '#504060' }), 0, 3.02, 0, 10), C(.2, .2, .5, mat({ color: '#504060' }), 0, 3.28, 0, 10));
    const arm = B(.1, .9, .1, coat, .35, 2.2, 0); g.add(arm); wander(g, o, rng, anim, t => arm.rotation.z = 2.4 + Math.sin(t * 1.5) * .3); return g; },
  jelly(o, rng, anim){ const g = new THREE.Group(); const m = mat({ color: o.color || '#e0c8ff', emissive: '#5a3a7a', opacity: .75 }); const top = S(.5, m, 0, 0, 0, 1); top.scale.y = .6; g.add(top);
    for (let i = 0; i < 4; i++) g.add(B(.03, .9, .03, m, Math.cos(i * 1.57) * .25, -.5, Math.sin(i * 1.57) * .25));
    wander(g, o, rng, anim, t => top.scale.y = .6 + Math.sin(t * 2) * .08, true); return g; },
  moon(o){ const g = new THREE.Group(); g.add(S(o.r || 6, mat({ color: '#fff6d8', emissive: '#c8b890', fog: false }), 0, 0, 0, 2)); const s = glowSprite('#fff2c8', (o.r || 6) * 5); g.add(s); return g; },
  sun(o){ const s = glowSprite(o.color || '#ffe0f0', o.r || 30); const g = new THREE.Group(); g.add(s); g.add(S((o.r || 30) / 6, mat({ color: '#fff8f0', emissive: '#fff0f0', fog: false }), 0, 0, 0, 2)); return g; },
  stairs(o){ const g = new THREE.Group(); const m = mat({ color: o.color || '#ffffff', tex: o.tex }); for (let i = 0; i < (o.n || 10); i++) g.add(B(1.6, .25, .5, m, 0, i * .25 + .12, -i * .5)); return g; },
  blocks(o, rng){ const g = new THREE.Group(); const cols = ['#ffb3c7', '#b3e0ff', '#fff0a8', '#c8f0c0', '#e0c8ff']; for (let i = 0; i < (o.n || 6); i++){ const s = .3 + rng() * .5; const b = B(s, s, s, mat({ color: cols[i % 5] }), (rng() - .5) * 2, s / 2 + (i > 3 ? .5 : 0), (rng() - .5) * 2); b.rotation.y = rng() * 3; g.add(b); } return g; },
  bunny(o){ const g = new THREE.Group(); const m = mat({ color: o.color || '#fff4f8' }); g.add(S(.3, m, 0, .3, 0), S(.22, m, 0, .72, 0), B(.07, .35, .04, m, -.08, 1.05, 0), B(.07, .35, .04, m, .08, 1.05, 0)); return g; },
  ballerina(o = {}, rng = Math.random, anim){ // tiny spinning dancer (also stands on every music box)
    const g = new THREE.Group(), d = new THREE.Group(); g.add(d); const skin = mat({ color: '#ffe6d8' }), pink = mat({ color: o.color || '#ffb6d2', emissive: '#40182a' });
    d.add(C(.05, .05, .012, mat({ color: '#fff4c8', emissive: '#5a4a20' }), 0, .006, 0, 10)); // little stand
    d.add(C(.007, .006, .12, skin, 0, .07, 0, 5)); // standing leg (en pointe)
    const leg2 = C(.007, .006, .11, skin, .03, .14, 0, 5); leg2.rotation.z = 1.2; d.add(leg2); // raised leg (arabesque)
    d.add(C(.012, .075, .035, pink, 0, .14, 0, 9)); // tutu
    d.add(C(.018, .013, .07, pink, 0, .19, 0, 6)); // bodice
    d.add(S(.022, skin, 0, .245, 0)); d.add(S(.012, mat({ color: '#6a4a3a' }), 0, .262, -.012)); // head + bun
    const armL = C(.005, .005, .085, skin, -.035, .25, 0, 4), armR = armL.clone(); armL.rotation.z = -.7; armR.position.x = .035; armR.rotation.z = .7; d.add(armL, armR); // arms raised in a circle
    if (anim){ const sp = o.spin ?? 1.4, ph = rng() * 6; anim.push(t => { d.rotation.y = t * sp + ph; d.position.y = Math.sin(t * 2 + ph) * .004; }); }
    if (o.scale == null && o.type === 'ballerina') g.scale.setScalar(4);
    return g; },
  sneakers(o = {}){ const g = new THREE.Group(); const sole = mat({ color: '#fff8f0' }), up = mat({ color: o.color || '#8ab8f0' }), lace = mat({ color: '#ffffff' });
    for (const sx of [-.07, .07]){ const s = new THREE.Group(); s.add(B(.09, .025, .2, sole, 0, .012, 0)); s.add(B(.08, .05, .17, up, 0, .05, -.01)); s.add(B(.08, .04, .07, up, 0, .09, .05)); s.add(B(.05, .006, .06, lace, 0, .078, -.02)); s.position.x = sx; s.rotation.y = sx * 2; g.add(s); }
    g.add(B(.32, .004, .26, mat({ color: '#9ad0e0', opacity: .5 }), 0, .002, 0)); return g; }, // small, wet, child-size
  cardbox(o = {}){ const g = new THREE.Group(); const m = mat({ color: '#d8b888' }); g.add(B(.5, .34, .4, m, 0, .17, 0)); const f1 = B(.5, .02, .2, m, 0, .35, -.25); f1.rotation.x = .9; g.add(f1); const f2 = f1.clone(); f2.position.z = .25; f2.rotation.x = -.9; g.add(f2);
    g.add(B(.26, .08, .005, mat({ color: '#fffaf0' }), 0, .22, .202)); g.add(B(.18, .012, .006, mat({ color: '#506090' }), 0, .225, .204)); return g; }, // a name label on the side
  bench(o = {}){ const g = new THREE.Group(); const w = mat({ tex: 'wood', color: o.color || '#d8c0e0' }), leg = mat({ color: '#6a5a7a' }); g.add(B(1.6, .06, .42, w, 0, .45, 0)); g.add(B(1.6, .36, .05, w, 0, .7, -.2));
    for (const x of [-.7, .7]) g.add(B(.06, .45, .38, leg, x, .225, 0)); return g; },
  musicbox(o = {}, rng = Math.random, anim){ const g = new THREE.Group(); g.add(B(.5, .3, .35, mat({ tex: 'wood', color: '#ffd8e8' }), 0, .15, 0)); const lid = B(.5, .04, .35, mat({ color: '#ffb8d0' }), 0, .45, -.15); lid.rotation.x = -1.1; g.add(lid); const s = glowSprite('#fff0c0', .7); s.material.opacity = .45; s.position.y = .5; g.add(s); const bl = M.ballerina({ spin: 1.2 }, rng, anim); bl.position.set(0, .3, .04); g.add(bl); return g; },
  lamppost(o){ const g = new THREE.Group(); g.add(C(.05, .07, 3.2, mat({ color: '#606080' }), 0, 1.6, 0), S(.22, mat({ color: '#fff4d0', emissive: '#ffe0a0' }), 0, 3.3, 0)); const s = glowSprite(o.color || '#ffe8b0', 2.2); s.position.y = 3.3; g.add(s); return g; },
  sign(o){ const g = new THREE.Group(); g.add(C(.04, .04, 1.6, mat({ color: '#ffffff' }), 0, .8, 0), B(1, .5, .05, mat({ color: o.color || '#ffe8a8' }), 0, 1.6, 0)); return g; },
  orb(o, rng, anim){ const g = new THREE.Group(); const s = glowSprite(o.color || '#fff0ff', o.size || 1.2); g.add(s); g.add(S(.08, mat({ color: '#ffffff', emissive: '#ffffff' }), 0, 0, 0, 0)); const by = o.y || 1.2, ph = rng() * 6; anim.push(t => { g.position.y = by + Math.sin(t * 1.3 + ph) * .2; }); return g; },
  fridge(){ const g = new THREE.Group(); g.add(B(.9, 1.9, .8, mat({ color: '#e8f8f4' }), 0, .95, 0), B(.05, .5, .05, mat({ color: '#a0a0b0' }), .35, 1.3, .42)); return g; },
  watcher(o){ const g = new THREE.Group(); const m = mat({ color: o.color || '#e8e0ea' }); const h = o.h || 2.2;
    g.add(C(.18, .3, h, m, 0, h / 2, 0, 6), S(.24, m, 0, h + .2, 0, 1));
    if (o.face !== false){ const e = mat({ color: '#2a2030' }); g.add(B(.04, .06, .02, e, -.08, h + .24, .23), B(.04, .06, .02, e, .08, h + .24, .23)); }
    return g; },
  skyface(o){ const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex('cloudface'), color: o.color || '#ffffff', transparent: true, depthWrite: false, opacity: o.opacity ?? .85, fog: false })); s.scale.set(o.s || 20, (o.s || 20) * .7, 1); const g = new THREE.Group(); g.add(s); return g; },
  chair(o){ const g = new THREE.Group(); const m = mat({ tex: 'wood', color: o.color || '#f0d8c8' }); g.add(B(.5, .06, .5, m, 0, .45, 0), B(.5, .6, .06, m, 0, .78, -.22)); for (const x of [-.22, .22]) for (const z of [-.22, .22]) g.add(B(.05, .45, .05, m, x, .22, z)); return g; },
  table(o){ const g = new THREE.Group(); const m = mat({ tex: 'wood', color: o.color || '#f4e0d0' }); g.add(B(1.4, .08, .9, m, 0, .75, 0)); for (const x of [-.6, .6]) for (const z of [-.38, .38]) g.add(B(.07, .75, .07, m, x, .37, z)); return g; },
  clock(o, rng, anim){ const g = new THREE.Group(); g.add(C(.5, .5, .08, mat({ color: '#fff8f0' }), 0, 0, 0, 16)); g.children[0].rotation.x = Math.PI / 2; const hand = B(.04, .4, .02, mat({ color: '#403040' }), 0, .18, .06); const hp = new THREE.Group(); hp.add(hand); hp.position.z = .02; g.add(hp); const sp = o.spin ?? -.3; anim.push(t => hp.rotation.z = t * sp); return g; },
  slide(o){ const g = new THREE.Group(); const m = mat({ color: o.color || '#ffd070' }); const sl = B(.8, .06, 4, m, 0, 1.2, 0); sl.rotation.x = .55; g.add(sl, B(.06, 2.4, .06, mat({ color: '#a0c8ff' }), -.4, 1.2, -1.8), B(.06, 2.4, .06, mat({ color: '#a0c8ff' }), .4, 1.2, -1.8)); return g; },
  frame(o){ const g = new THREE.Group(); g.add(B(.8, 1, .05, mat({ tex: 'wood', color: '#d8b898' }), 0, 0, 0), B(.66, .86, .02, mat({ color: o.color || '#f0f0f0', emissive: '#202020' }), 0, 0, .03)); return g; },
  train(o){ const g = new THREE.Group(); const m = mat({ color: o.color || '#e8eef8' }); g.add(B(3, 3, 14, m, 0, 1.9, 0)); for (let i = -5; i <= 5; i += 2.5) g.add(B(.05, .9, 1.4, mat({ color: '#ffe8a8', emissive: '#c8a050' }), 1.52, 2.3, i)); return g; },
  heightmarks(o){ const g = new THREE.Group(); const m = mat({ color: '#6a5070' }); const hs = o.marks || [.85, .98, 1.1, 1.22, 1.32];
    hs.forEach((h, i) => g.add(B(.26 - i * .015, .025, .01, m, (i % 2 ? .04 : -.04), h, 0)));
    g.add(B(.03, (hs[hs.length - 1] - hs[0]) + .2, .008, mat({ color: '#b8a0b0' }), -.17, (hs[0] + hs[hs.length - 1]) / 2, 0)); return g; },
  ghostfriend(){ const g = new THREE.Group(); g.add(C(.3, .45, 1.4, mat({ color: '#ffffff', emissive: '#806080', opacity: .8 }), 0, .9, 0, 8), S(.3, mat({ color: '#ffffff', emissive: '#806080', opacity: .8 }), 0, 1.7, 0)); return g; },
  sheep(o, rng, anim){ const g = new THREE.Group(); const w = mat({ color: '#ffffff', emissive: '#403a44' }); for (let i = 0; i < 5; i++) g.add(S(.3, w, (i - 2) * .18, .7 + (i % 2) * .1, (rng() - .5) * .2)); g.add(S(.18, mat({ color: '#d8c8e0' }), .55, .8, 0));
    for (const x of [-.25, .25]) for (const z of [-.12, .12]) g.add(B(.06, .45, .06, mat({ color: '#d8c8e0' }), x, .22, z)); wander(g, o, rng, anim); return g; },
};
// Gentle wandering behaviour; slow, never approaches the player aggressively.
function wander(g, o, rng, anim, extra, fly){
  const cx = o.x || 0, cz = o.z || 0, R = o.wander ?? 4, sp = o.speed ?? .25; let a = rng() * 6, tx = cx, tz = cz, wait = 0;
  anim.push((t, dt = .016) => { if (!g.parent) return; const p = g.position;
    if (o.orbit){ a += dt * sp * .3; p.x = cx + Math.cos(a) * R; p.z = cz + Math.sin(a) * R; g.rotation.y = -a; }
    else { const dx = tx - p.x, dz = tz - p.z, d = Math.hypot(dx, dz);
      if (d < .2){ wait -= dt; if (wait <= 0){ const r = rng() * R, aa = rng() * 6.28; tx = cx + Math.cos(aa) * r; tz = cz + Math.sin(aa) * r; wait = 1 + rng() * 3; } }
      else { p.x += dx / d * sp * dt; p.z += dz / d * sp * dt; const want = Math.atan2(dx, dz) - Math.PI / 2; g.rotation.y += (((want - g.rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI) * dt * 2; } }
    if (fly) p.y = (o.y || 1.5) + Math.sin(t * 1.2 + a) * .2;
    extra && extra(t); });
}
export function buildModel(o, rng, anim){ const f = M[o.type] || M[o.model]; return f ? f(o, rng, anim) : null; }
