// v7 interaction engine: tap-to-use props described entirely by chapter data (`act: { kind, … }`).
// kinds: open · lines · mirror · sit · play · ring · toy · pickup · use · toggle · frag · step (puzzles)
// Effects (on act, act.after{n}, puzzle reward): text, lines, mood, secret, room, frag, give, flag, dark, warp, ending, hideSelf, unhide
import { bus } from './bus.js';
export const LABELS = { open: '열기', lines: '살펴보기', mirror: '들여다보기', sit: '앉기', play: '켜기', ring: '받기', toy: '만지기', pickup: '줍기', use: '놓기', toggle: '누르기', frag: '줍기', step: '누르기' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
/** Walk every chapter and collect fragment ids/texts + item names (journal + HUD use these; new chapters count automatically). */
export function scanChapters(chs){
  const frags = [], items = {};
  const visit = (e, ch) => { if (!e || typeof e !== 'object') return; if (e.frag && e.fragText && !frags.some(f => f.id === e.frag)) frags.push({ id: e.frag, ch: ch.id, text: e.fragText });
    if (e.item && e.name) items[e.item] = { name: e.name, icon: e.icon || '◦' }; for (const k of ['after', 'reward', 'on']) visit(e[k], ch); };
  for (const ch of chs){ for (const o of [...ch.objects, ...(ch.mutations || []).flatMap(m => m.add || [])]) visit(o.act, ch); for (const pz of ch.puzzles || []) visit(pz.reward, ch); }
  return { frags, items };
}
export function createInteract(ctx){
  const btn = document.querySelector('#actbtn'), lab = btn.querySelector('span'), ret = document.querySelector('#reticle');
  let list = [], flags = {}, cur = null, puzzles = {}, ch = null;
  const S = ctx.S, A = () => ctx.audio, st = () => ctx.strange();
  function hide(t){ t.hidden = true; if (t.mesh) t.mesh.visible = false; }
  function reset(things, chapter){ ch = chapter; list = things.filter(t => t.act); flags = {}; puzzles = {}; cur = null;
    for (const t of list){ t.st = { n: 0, open: 0, target: 0, on: false, rt: 2 + Math.random() * 4, wob: 0, answered: false, busy: false };
      if (t.act.kind === 'frag' && S.frags.includes(t.act.frag)) hide(t);
      if (t.act.kind === 'pickup' && S.inv.includes(t.act.item)) hide(t);
      if (t.act.kind === 'ring' && t.mesh?.userData.ring) t.mesh.userData.ring.material.opacity = 0; }
    ctx.renderer.applyFlags(flags); ctx.renderer.setDark(false); show(null); }
  function show(t){ cur = t; if (!t){ btn.classList.remove('on'); ret.classList.remove('on'); return; } lab.textContent = t.act.label || LABELS[t.act.kind] || '만지기'; btn.classList.add('on'); ret.classList.add('on'); }
  const giveItem = id => { if (!S.inv.includes(id)){ S.inv.push(id); ctx.save.write(); ctx.renderInv(); } };
  const takeItem = id => { const i = S.inv.indexOf(id); if (i >= 0){ S.inv.splice(i, 1); ctx.save.write(); ctx.renderInv(); } };
  async function lines(ls, gap = 3400){ const id = ctx.sceneId(); for (const l of ls){ if (ctx.sceneId() !== id) return; ctx.say(l, gap / 1000 + .6); await sleep(gap); } }
  function fx(e, t){ if (!e) return; const d = ctx.dream;
    if (e.mood){ d.calm += e.mood[0]; d.strange += e.mood[1]; }
    if (e.give) { giveItem(e.give); ctx.toast(`손에 넣었다 · ${ctx.itemName(e.give)}`); }
    if (e.flag){ flags[e.flag] = true; ctx.renderer.applyFlags(flags); }
    if (e.unflag){ flags[e.unflag] = false; ctx.renderer.applyFlags(flags); }
    if (e.dark != null) ctx.renderer.setDark(!!e.dark);
    if (e.frag) ctx.foundFrag(e.frag);
    if (e.secret) ctx.foundSecret(e.secret);
    if (e.room) ctx.foundRoom(e.room);
    if (e.hideSelf && t) hide(t);
    if (e.snuff && t?.mesh?.userData.flames) t.mesh.userData.flames.visible = false;
    if (e.unhide) for (const o of list) if (o.id === e.unhide){ o.hidden = false; if (o.mesh) o.mesh.visible = true; }
    if (e.text) setTimeout(() => ctx.say(e.text, 5.5), e.delay ?? 0);
    if (e.lines) setTimeout(() => lines(e.lines), e.delay ?? 0);
    if (e.warp) setTimeout(() => ctx.warp(e.warp), e.warpDelay ?? 2200);
    if (e.ending) setTimeout(() => ctx.ending(e.ending, t), e.endDelay ?? 2600);
  }
  function step(t){ const a = t.act, pz = (ch.puzzles || []).find(p => p.id === a.puzzle); if (!pz) return; const P = puzzles[pz.id] || (puzzles[pz.id] = { seq: [], on: new Set(), done: false });
    if (P.done){ ctx.say(pz.doneText || '이미 끝난 일이다.', 3); return; }
    const ki = pz.keys.indexOf(a.key);
    if (pz.mode === 'all'){ t.st.on = !t.st.on; t.st.target = t.st.on ? 1 : 0; t.st.on ? P.on.add(a.key) : P.on.delete(a.key); A().tone(a.tone || 'click', .8, st());
      if (a.lines) ctx.say(a.lines[(t.st.n - 1) % a.lines.length], 3.2);
      if (pz.keys.every(k => P.on.has(k))){ P.done = true; A().tone('frag', .8); fx(pz.reward); } return; }
    A().tone(a.tone || 'bell', .9, st(), a.pitch || (1 + ki * .19)); t.st.wob = 1.2; P.seq.push(a.key);
    const ok = P.seq.every((k, i) => pz.keys[i] === k);
    if (!ok){ P.seq = []; setTimeout(() => { A().tone('wrong', .7); ctx.say(pz.wrong || '…아니다. 처음부터 다시.', 3); }, 500); return; }
    if (P.seq.length === pz.keys.length){ P.done = true; setTimeout(() => A().tone('frag', .8), 600); fx(pz.reward); }
    else if (pz.progress) ctx.say(pz.progress[(P.seq.length - 1) % pz.progress.length], 2.6); }
  async function use(){ const t = cur; if (!t || t.st.busy) return; const a = t.act, k = a.kind; bus.emit('object:act', { id: t.id, scene: ctx.sceneId(), kind: k });
    if (a.need && !t.st.done){ if (!S.inv.includes(a.need)){ A().tone('wrong', .5); ctx.say(a.needText || '무언가가 있어야 할 것 같다.', 3.6); return; }
      if (!a.keep){ takeItem(a.need); } ctx.toast(`${ctx.itemName(a.need)} · 사용했다`); }
    t.st.n++; const first = t.st.n === 1, cyc = arr => arr[(t.st.n - 1) % arr.length];
    switch (k){
      case 'open': if (!t.st.opened){ t.st.opened = true; t.st.target = 1; A().tone('open', .9, st()); if (a.lines) lines(a.lines); fx(a, t); }
        else ctx.say(a.empty || '안은 이제 비어 있다.', 3); break;
      case 'lines': case 'mirror': case 'sit': ctx.say(cyc(a.lines || ['…']), a.dur || 5); if (a.tone) A().tone(a.tone, .7, st()); if (first) fx(a, t); break;
      case 'play': t.st.busy = true; t.st.playing = true; A().tone(a.tone || 'static', .9, st()); await lines(a.lines || [], a.gap || 3400); t.st.playing = false; t.st.busy = false; if (first) fx(a, t); break;
      case 'ring': if (t.st.answered){ ctx.say(a.after?.text || '수화기 너머로 아무 소리도 들리지 않는다. 그런데 누군가 숨 쉬는 것 같다.', 3.4); break; }
        t.st.answered = true; t.st.busy = true; A().tone('click', 1); t.st.wob = .6; await sleep(500); await lines(a.lines || [], a.gap || 3400); t.st.busy = false; fx(a, t); break;
      case 'toy': A().tone(a.tone || 'toy', .9, st()); t.st.wob = 2.4; if (a.lines) ctx.say(cyc(a.lines), 4.5); if (first) fx(a, t); break;
      case 'pickup': hide(t); A().tone('pick', .9); giveItem(a.item); ctx.toast(`손에 넣었다 · ${a.icon || ''} ${a.name}`); if (a.lines) lines(a.lines); fx(a, t); break;
      case 'use': t.st.done = true; t.st.target = 1; t.st.wob = 6; A().tone(a.tone || 'pick', .9, st()); if (a.lines) lines(a.lines); fx(a, t); list = list.filter(x => x !== t || a.repeat); show(null); break;
      case 'toggle': { t.st.on = !t.st.on; t.st.target = t.st.on ? 1 : 0; flags[a.flag || t.id] = t.st.on; ctx.renderer.applyFlags(flags); if (a.dark) ctx.renderer.setDark(t.st.on); A().tone('click', 1);
        const L = t.st.on ? a.lines : a.offLines; if (L) ctx.say(L[((t.st.n - 1) >> 1) % L.length], 4.5); if (t.st.on && t.st.n === 1) fx(a, t); break; }
      case 'frag': hide(t); fx(a, t); if (a.lines) lines(a.lines); break;
      case 'step': step(t); break;
    }
    if (a.after && t.st.n === (a.after.n || 2)) fx(a.after, t);
  }
  function update(dt, p, fwd, active){
    let best = null, bd = 1e9; const strange = st();
    for (const t of list){ const m = t.mesh, mx = m ? m.position.x : t.x, mz = m ? m.position.z : t.z; const dx = mx - p.pos.x, dz = mz - p.pos.z, d = Math.hypot(dx, dz); t.st.d = d;
      // ambient animation: opening parts, wobbles, ringing, flickering screens
      if (m){ const u = m.userData; if (u.part && u.open){ const o = u.open, cur0 = t.st.open || 0, tg = t.st.target; const v = cur0 + (tg - cur0) * Math.min(1, dt * 4); t.st.open = v === 0 ? 0 : Math.max(v, 1e-4); const P = u.part, f = o.from || 0, val = f + (o.to - f) * v;
          if (o.axis === 'z') P.position.z = .03 + val; else if (o.axis === 'y') P.position.y = -.2 + val; else if (o.axis === 'ry') P.rotation.y = val; else if (o.axis === 'rx') P.rotation.x = val; else if (o.axis === 'rz') P.rotation.z = val; else if (o.axis === 'scale') P.scale.set(.25 + .75 * v, 1.6 - 1.2 * v, .25 + .75 * v);
          if (u.hidePart && v > .5) u.hidePart.visible = false; }
        if (u.wob && t.st.wob > 0){ t.st.wob -= dt; u.wob.rotation.z = Math.sin(t.st.wob * 14) * .12 * Math.min(1, t.st.wob); if (u.spin) u.spin.rotation.y += dt * 4; }
        if (u.screen && (t.st.playing || (t.act.kind === 'toggle' && t.st.on))) u.screen.emissive?.setHSL(Math.random(), .4, .25 + Math.random() * .2);
        if (t.act.kind === 'ring' && !t.st.answered){ t.st.rt -= dt; const ring = u.ring; if (ring) ring.material.opacity = Math.max(0, ring.material.opacity - dt * .6);
          if (t.st.rt <= 0 && d < (t.act.hear || 18)){ t.st.rt = t.act.every || 8; A().tone('ring', Math.max(.15, 1 - d / (t.act.hear || 18)) * .9, strange); t.st.wob = 1.6; if (ring) ring.material.opacity = .8; if (d < 7 && t.act.ringText && !t.st.told){ t.st.told = true; ctx.say(t.act.ringText, 3); } } } }
      if (!active || t.hidden) continue;
      const ty = (m ? m.position.y : (t.y || 0)) - (t.act.kind === 'frag' ? 1.1 : 0), vy = p.pos.y - ty; if (vy > 1.9 || vy < -2.9) continue;
      const r = t.act.r || t.r || 1.5; if (d > r + .35) continue; const dot = d < .7 ? 1 : (dx * fwd.x + dz * fwd.z) / (d * Math.hypot(fwd.x, fwd.z) || 1); if (dot < .25) continue;
      const score = d - dot; if (score < bd){ bd = score; best = t; } }
    if (best !== cur) show(best);
  }
  btn.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); btn.classList.add('press'); use(); }, { passive: false });
  btn.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); btn.classList.remove('press'); }, { passive: false });
  btn.addEventListener('click', e => { e.stopPropagation(); if (!('ontouchstart' in window)) use(); });
  addEventListener('keydown', e => { if (e.code === 'KeyE' || e.code === 'Enter') use(); });
  return { reset, update, use, hideAll: () => show(null), flags: () => flags, current: () => cur, list: () => list, step };
}
