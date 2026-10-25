import { bus } from './bus.js';
import { GameState, Player, stepPlayer, groundAt } from './state.js';
import { InputManager } from './input.js';
import { LocalAdapter, REPLICATED } from './net.js';
import { Renderer } from './render.js';
import { AudioManager } from './audio.js';
import { save, SLOTS } from './save.js';
import { ASSETS } from './assets.js';
import { strangeLayer, glitchText, DEFAULT_WHISPERS } from './strange.js';
import CHAPTERS from '../chapters/manifest.js';

const $ = s => document.querySelector(s);
const chapters = new Map(CHAPTERS.map(c => [c.id, c]));
// Totals are derived from chapter data, so new chapters automatically count.
const allObjs = c => [...c.objects, ...(c.mutations || []).flatMap(m => m.add || [])];
const GLOBAL_SECRETS = ['title7', 'still'];
const SECRET_IDS = [...new Set([...CHAPTERS.flatMap(c => allObjs(c).filter(o => o.secret).map(o => o.secret)), ...GLOBAL_SECRETS])];
const ROOM_IDS = [...new Set(CHAPTERS.flatMap(c => allObjs(c).filter(o => o.room).map(o => o.room)))];
const S = save.load();
const state = new GameState();
const net = new LocalAdapter();
const audio = new AudioManager(); audio.setVolume(S.settings.volume);
const renderer = new Renderer($('#gl'));
renderer.setPS1(S.settings.ps1);
const input = new InputManager($('#touch'), $('#joy'), $('#jumpbtn')); input.sens = 0.0055 * S.settings.sens;
let mode = 'title', things = [], fading = false, msgTimer = 0, dreamStart = 0, stillTime = 0, stillFired = false, whisperT = 40, titleGlitchT = 3, autosaveT = 30, curCh = null;
const dream = { calm: 0, strange: 0, scenes: [] };

// ---- networking hook: mirror replicated events to the adapter (no-op locally)
bus.on('*', (p, msg) => { if (msg.meta.local && REPLICATED.includes(msg.type)) net.send({ type: msg.type, payload: p }); });
net.onMessage(m => { if (m.type === 'player:state'){ let p = state.players.get(m.payload.id); if (!p) p = state.addPlayer(new Player(m.payload.id, false)); p.applySnapshot(m.payload); } });
net.connect().then(({ peerId }) => state.addPlayer(new Player(peerId, true)));

// ---- helpers
const rngFrom = seed => { let s = (Math.abs(seed * 2654435761) % 2147483647) || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const strangeNow = () => curCh?.strangeness || 0;
function say(text, dur = 4.5){ const el = $('#say'); el.textContent = glitchText(text, strangeNow()); el.classList.add('on'); msgTimer = dur; }
function fadeTo(color, v, ms){ return new Promise(res => { const u = renderer.postU; const start = u.uFade.value, t0 = performance.now(); if (color) u.uFadeColor.value.set(color);
  (function f(){ const k = Math.min(1, (performance.now() - t0) / ms); const e = k * k * (3 - 2 * k); u.uFade.value = start + (v - start) * e; if (k < 1) requestAnimationFrame(f); else res(); })(); }); }
function show(id){ document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fadeColor = () => strangeNow() > .6 ? '#f0e8ff' : '#fff4fb';

function applyMutations(ch, day, rng){
  const out = { objects: [], palette: {}, hueDrift: (Math.sin(day * 1.7) * .08), notes: [] };
  for (const m of ch.mutations || []){ const w = m.when || {}; let ok = true;
    if (w.dayMod) ok = ok && day % w.dayMod[0] === w.dayMod[1]; if (w.dayMin != null) ok = ok && day >= w.dayMin; if (w.chance != null) ok = ok && rng() < w.chance;
    if (!ok) continue; if (m.add) out.objects.push(...m.add); if (m.palette) Object.assign(out.palette, m.palette); if (m.hueDrift) out.hueDrift += m.hueDrift; if (m.text) out.notes.push(m.text); }
  return out;
}
function boundsFor(ch, objs){ if (!ch.bounds) return null; const b = [...ch.bounds];
  for (const o of objs) if (o.type === 'room' || o.type === 'floor'){ b[0] = Math.min(b[0], o.x - o.w / 2); b[2] = Math.max(b[2], o.x + o.w / 2); b[1] = Math.min(b[1], o.z - o.d / 2); b[3] = Math.max(b[3], o.z + o.d / 2); }
  return b; }

async function loadScene(id, spawnName, { first = false, at = null } = {}){
  if (id === 'random'){ const pool = CHAPTERS.filter(c => !c.hidden && c.id !== state.sceneId && (S.unlocked.includes(c.id) || c.order <= 3)); id = pool[Math.floor(Math.random() * pool.length)].id; }
  const ch = chapters.get(id); if (!ch) return; curCh = ch;
  const visits = (S.visited[id] = (S.visited[id] || 0) + 1); save.write();
  const rng = rngFrom(S.day * 31 + visits * 7 + id.length * 13);
  const mut = applyMutations(ch, S.day, rng);
  mut.objects.push(...strangeLayer(ch, rng));
  const chView = { ...ch, palette: { ...ch.palette, ...mut.palette } };
  state.clearScene(); state.sceneId = id; state.bounds = boundsFor(ch, [...ch.objects, ...mut.objects]);
  const built = renderer.build(chView, rng, mut); state.colliders = built.colliders; state.grounds = built.grounds; state.killY = ch.killY ?? -6; things = built.things.map(t => ({ ...t, used: false, acc: 0, count: 0 }));
  const p = state.localPlayer; const sp = at || (spawnName && ch.spawns?.[spawnName]) || ch.spawn;
  placePlayer(p, sp.x, sp.z, sp.yaw || 0); p.pitch = 0;
  dream.scenes.push(id); if (!ch.hidden) save.unlock(id);
  audio.playMusic(ch.music, 2.5, ch.strangeness || 0);
  $('#chapname').textContent = ch.title; $('#day').textContent = `${S.day + 1}일째 꿈`;
  bus.emit('scene:enter', { id, visits });
  whisperT = 25 + Math.random() * 20;
  const lines = visits === 1 ? ch.intro || [] : [mut.notes[0] || ['어딘가 조금 달라졌다.', '전에도 여기 왔었다.', '꿈이 기억을 바꾸고 있다.'][visits % 3]];
  (async () => { for (const l of lines){ await sleep(first ? 1400 : 900); if (state.sceneId === id) say(l, 3.6); await sleep(3400); } })();
  autosave();
}
function placePlayer(p, x, z, yaw){ const g = groundAt(state, x, z, 60, state.time);
  Object.assign(p.pos, { x, y: g ? g.top : 0, z }); if (yaw != null) p.yaw = yaw; p.vel.x = p.vel.z = 0; p.vy = 0; p.grounded = true; p.falling = false; p.safe = { x, y: p.pos.y, z, yaw: p.yaw }; }
// Gentle fall: soft fade, then wake up at the last safe spot. Never sudden.
async function respawn(){
  if (fading) { state.localPlayer.falling = false; return; } fading = true; input.reset(); const p = state.localPlayer;
  await fadeTo(fadeColor(), 1, 900); const sp = p.safe || curCh.spawn; placePlayer(p, sp.x, sp.z, sp.yaw);
  say(['꿈이 나를 살며시 받아 주었다.', '떨어지는 꿈. 아프지 않다.', '구름이 나를 제자리에 내려놓았다.', '다시, 조금 전의 자리.'][(Math.random() * 4) | 0], 3);
  await sleep(250); await fadeTo(null, 0, 1100); fading = false;
}
bus.on('player:fall', () => respawn());
bus.on('player:jump', () => audio.sfx('step1', .12, 1.5 * (1 - strangeNow() * .2)));
bus.on('player:land', ({ v }) => audio.sfx('step0', Math.min(.45, v * .06), .72 * (1 - strangeNow() * .15)));
function autosave(){ const p = state.localPlayer; if (!p || !state.sceneId) return; const sp0 = p.safe || p.pos; save.saveSlot(0, { scene: state.sceneId, pos: { x: sp0.x, z: sp0.z }, yaw: p.yaw, title: curCh?.title }); }

async function link(to, spawn){
  if (fading) return; fading = true; input.enabled = false; input.reset(); audio.sfx('link', .45);
  bus.emit('scene:link', { from: state.sceneId, to }); dream.strange += 1;
  if (to === 'self') to = state.sceneId;
  await fadeTo(fadeColor(), 1, 1400); await loadScene(to, spawn); await sleep(200);
  await fadeTo(null, 0, 1600); input.enabled = true; fading = false;
}
// In-scene teleport (hidden rooms, odd paths). Soft fade, no sound spike.
async function warp(w, quick){
  if (fading) return; fading = true; input.reset(); const p = state.localPlayer;
  if (!quick){ input.enabled = false; audio.sfx('link', .25, .7); await fadeTo(fadeColor(), 1, 1100); }
  placePlayer(p, w.x, w.z, w.yaw);
  for (const th of things) if (Math.hypot(th.x - w.x, th.z - w.z) < (th.r || 0) + 1) th.used = true; // don't re-trigger on arrival
  if (!quick){ await sleep(250); await fadeTo(null, 0, 1300); input.enabled = true; }
  fading = false;
}

function touch(t){
  bus.emit('object:touch', { id: t.id, scene: state.sceneId });
  // impossible architecture: `loop:{times, warp, texts}` sends you back silently N times before the thing acts normally
  if (t.loop && t.count < t.loop.times){ t.count++; t.used = false; t.rearm = true; const lt = t.loop.texts || ['…아까 그 길이다.', '같은 곳이다. 분명히.', '세어 보는 걸 그만두자.'];
    if (t.count > 1 || t.loop.sayFirst) say(lt[(t.count - 1) % lt.length], 3.5); dream.strange += .5;
    if (t.loop.warp) warp(t.loop.warp, true); else { const p = state.localPlayer; p.pos.x += t.loop.dx || 0; p.pos.z += t.loop.dz || 0; }
    return; }
  if (t.mood){ dream.calm += t.mood[0]; dream.strange += t.mood[1]; }
  if (t.text) say(t.text, 5.5);
  if (t.secret) foundSecret(t.secret);
  if (t.room) foundRoom(t.room);
  if (!t.secret && !t.room && !t.goal && !t.link && !t.warp) audio.sfx('chime', .25, (.9 + Math.random() * .2) * (1 - strangeNow() * .25));
  if (t.goal) return setTimeout(() => endDream(t), 1800);
  if (t.warp) setTimeout(() => warp(t.warp), t.text ? 1700 : 300);
  else if (t.link) setTimeout(() => link(t.link.to, t.link.spawn), t.secret ? 2600 : 1600);
  if (t.rearm !== false && (t.text && !t.link && !t.goal && !t.warp && !t.secret && !t.room)) t.rearmAfter = true;
}
function foundSecret(id){ if (save.secret(id)){ audio.sfx('secret_found', .5); setTimeout(() => toast(`✧ 비밀을 발견했다 (${S.secrets.filter(s => SECRET_IDS.includes(s)).length}/${SECRET_IDS.length})`), 1200); bus.emit('secret:found', { id }); } }
function foundRoom(id){ if (save.room(id)){ audio.sfx('secret_found', .45, .8); setTimeout(() => toast(`◇ 숨겨진 방을 찾았다 (${S.rooms.filter(r => ROOM_IDS.includes(r)).length}/${ROOM_IDS.length})`), 1400); bus.emit('secret:found', { id, room: true }); } }
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); }

async function endDream(goalThing){
  if (fading) return; fading = true; input.enabled = false; input.reset();
  const ch = chapters.get(state.sceneId);
  audio.sfx('wake', .5);
  if (goalThing && ch.next) save.unlock(ch.next);
  if (goalThing && !S.cleared.includes(ch.id)) S.cleared.push(ch.id);
  const mins = (performance.now() - dreamStart) / 60000; dream.calm += Math.min(4, mins * 1.2);
  const ending = goalThing && ch.ending;
  await fadeTo('#fffaf2', 1, 2200);
  const tot = Math.max(1, dream.calm + dream.strange);
  const pt = { day: S.day + 1, x: Math.max(-1, Math.min(1, (dream.calm - dream.strange * .5) / tot * 1.4)), y: Math.max(-1, Math.min(1, (dream.strange - dream.calm * .4) / tot * 1.4)), scenes: [...new Set(dream.scenes)] };
  S.moods.push(pt); S.day++; save.write(); mode = 'mood';
  showMood(pt, ending, goalThing && ch.endText);
  fading = false;
}
function showMood(pt, ending, endText){
  show('mood'); $('#moodday').textContent = `${pt.day}일째 꿈`;
  $('#moodscenes').textContent = pt.scenes.map(id => chapters.get(id)?.title).join(' → ');
  $('#moodend').textContent = endText || (ending ? '집에 도착했다.' : '');
  const c = $('#moodcv'), g = c.getContext('2d'), W = c.width = 560, H = c.height = 560; g.clearRect(0, 0, W, H);
  const X = v => W / 2 + v * W * .42, Y = v => H / 2 - v * H * .42;
  const bg = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2); bg.addColorStop(0, 'rgba(255,255,255,.55)'); bg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(120,100,150,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(-1), Y(0)); g.lineTo(X(1), Y(0)); g.moveTo(X(0), Y(-1)); g.lineTo(X(0), Y(1)); g.stroke();
  g.font = '30px "AppleMyungjo","Nanum Myeongjo",serif'; g.fillStyle = '#6a5a86'; g.textAlign = 'center';
  g.fillText('기묘함', X(0), Y(1) - 8); g.fillText('익숙함', X(0), Y(-1) + 26); g.textAlign = 'left'; g.fillText('고요', X(1) - 60, Y(0) - 10); g.fillText('일렁임', X(-1), Y(0) - 10);
  const all = S.moods.slice(-12); g.lineWidth = 1.5; g.strokeStyle = 'rgba(200,140,190,.5)'; g.beginPath(); all.forEach((m, i) => i ? g.lineTo(X(m.x), Y(m.y)) : g.moveTo(X(m.x), Y(m.y))); g.stroke();
  all.forEach((m, i) => { const last = i === all.length - 1; g.fillStyle = last ? '#ff7ab6' : 'rgba(160,130,200,.6)'; g.beginPath(); g.arc(X(m.x), Y(m.y), last ? 10 : 5, 0, 7); g.fill(); if (last){ g.strokeStyle = 'rgba(255,122,182,.4)'; g.lineWidth = 6; g.beginPath(); g.arc(X(m.x), Y(m.y), 18, 0, 7); g.stroke(); } });
}

async function startDream(id, at){
  audio.unlock(); show('none'); mode = 'play'; $('#hud').classList.add('on');
  Object.assign(dream, { calm: 0, strange: 0, scenes: [] }); dreamStart = performance.now(); stillTime = 0; stillFired = false;
  renderer.postU.uFade.value = 1; renderer.postU.uFadeColor.value.set('#fff4fb');
  await loadScene(id, null, { first: !at, at }); await sleep(300); input.enabled = true; fadeTo(null, 0, 2400);
}

// ---- UI: menu
function buildMenu(){
  $('#menuday').textContent = S.day ? `지금까지 ${S.day}번의 꿈을 꾸었다` : '아직 아무 꿈도 꾸지 않았다';
  $('#secrets').textContent = `✧ 비밀 ${S.secrets.filter(s => SECRET_IDS.includes(s)).length}/${SECRET_IDS.length}   ◇ 숨겨진 방 ${S.rooms.filter(r => ROOM_IDS.includes(r)).length}/${ROOM_IDS.length}`;
  const list = $('#chapters'); list.innerHTML = '';
  for (const ch of [...CHAPTERS].sort((a, b) => a.order - b.order)){
    const open = ch.hidden ? (S.visited[ch.id] > 0) : S.unlocked.includes(ch.id);
    if (ch.hidden && !open) continue;
    const el = document.createElement('button'); el.className = 'card' + (open ? '' : ' locked') + (S.cleared.includes(ch.id) ? ' cleared' : '');
    const st = ch.strangeness || 0; const title = open ? glitchText(ch.title, st * .8) : '???';
    el.innerHTML = `<div class="art" style="background-image:url(${ASSETS.img[ch.art] || ASSETS.img.title});${open ? `filter:hue-rotate(${st * 40}deg) saturate(${1 + st * .4})` : ''}"></div><div class="meta"><small>${ch.subtitle}</small><b>${title}</b><span>${open ? (S.cleared.includes(ch.id) ? '깨어남 ✓' : (S.visited[ch.id] ? `${S.visited[ch.id]}번 방문` : '새로운 꿈')) : '아직 꾸지 못한 꿈'}</span><i class="strange" style="--s:${st}"></i></div>`;
    if (open) el.onclick = () => { audio.sfx('chime', .3); startDream(ch.id); };
    list.appendChild(el);
  }
  $('#optps1').checked = S.settings.ps1; $('#optvol').value = S.settings.volume; $('#optsens').value = S.settings.sens;
}
function toMenu(){ mode = 'menu'; input.enabled = false; $('#hud').classList.remove('on'); buildMenu(); show('menu'); audio.playMusic('title'); }

// ---- UI: save slots + backup
let slotMode = 'load', slotBack = 'menu';
function fmt(ts){ const d = new Date(ts); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
function openSlots(m, back){ slotMode = m; slotBack = back; $('#slottitle').textContent = m === 'save' ? '꿈 기록하기' : '기록 불러오기'; renderSlots(); show('slots'); }
function renderSlots(){
  const box = $('#slotlist'); box.innerHTML = '';
  for (const n of SLOTS){ if (slotMode === 'save' && n === 0) continue; const r = save.readSlot(n);
    const el = document.createElement('button'); el.className = 'slot' + (r ? '' : ' empty');
    el.innerHTML = `<b>${n === 0 ? '자동 기록' : `기록 ${n}`}</b><span>${r ? `${r.where?.title || ''} · ${(r.profile?.day || 0) + 1}일째 · ✧${r.profile?.secrets?.length || 0} ◇${r.profile?.rooms?.length || 0} · ${fmt(r.savedAt)}` : '비어 있음'}</span>`;
    el.onclick = () => {
      if (slotMode === 'save'){ const p = state.localPlayer; if (r && !confirm('이 기록을 덮어쓸까요?')) return; const sp1 = p.safe || p.pos; save.saveSlot(n, { scene: state.sceneId, pos: { x: sp1.x, z: sp1.z }, yaw: p.yaw, title: curCh?.title }); toast('기록했다'); renderSlots(); }
      else if (r){ const where = save.loadSlot(n); Object.assign(S, save.data); toast('기록을 불러왔다'); if (where?.scene && chapters.has(where.scene)) startDream(where.scene, { x: where.pos.x, z: where.pos.z, yaw: where.yaw }); else toMenu(); }
    };
    box.appendChild(el); }
}
$('#slotback').onclick = () => { if (slotBack === 'pause') show('pause'); else toMenu(); };
$('#exportbtn').onclick = () => { const code = save.exportCode(); $('#codebox').value = code; $('#codebox').select(); try { navigator.clipboard?.writeText(code); toast('백업 코드를 복사했다'); } catch {} };
$('#exportfile').onclick = () => { const blob = new Blob([save.exportCode()], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `gohome-save-day${S.day}.txt`; document.body.appendChild(a); a.click(); a.remove(); };
$('#importbtn').onclick = () => { try { save.importCode($('#codebox').value); Object.assign(S, save.data); toast('백업을 불러왔다'); renderSlots(); } catch (e){ alert('코드를 읽을 수 없어요: ' + e.message); } };
$('#importfile').onchange = async e => { const f = e.target.files[0]; if (!f) return; try { save.importCode(await f.text()); Object.assign(S, save.data); toast('백업 파일을 불러왔다'); renderSlots(); } catch (err){ alert('파일을 읽을 수 없어요: ' + err.message); } e.target.value = ''; };
$('#codebox').addEventListener('touchstart', e => e.stopPropagation(), { passive: true });

let titleTaps = 0, titleTapT = 0;
$('#logo').addEventListener('click', e => { e.stopPropagation(); const now = performance.now(); titleTaps = now - titleTapT < 700 ? titleTaps + 1 : 1; titleTapT = now;
  $('#logo').style.transform = `scale(${1 + titleTaps * .015}) rotate(${(titleTaps % 2 ? 1 : -1) * titleTaps * .3}deg)`;
  if (titleTaps >= 7){ titleTaps = 0; $('#logo').style.transform = ''; $('#titlehint').textContent = '“집은 장소가 아니라, 돌아가고 싶은 마음이야.”'; audio.unlock(); foundSecret('title7'); } });
$('#title').addEventListener('click', () => { audio.unlock(); audio.playMusic('title'); audio.preload(['chime', 'link', 'step0', 'step1', 'step2', 'secret_found', 'wake']); toMenu(); });
$('#pausebtn').addEventListener('click', e => { e.stopPropagation(); if (mode !== 'play' || fading) return; mode = 'pause'; input.enabled = false; input.reset(); show('pause'); });
$('#resume').onclick = () => { show('none'); mode = 'play'; input.enabled = true; };
$('#savebtn').onclick = () => openSlots('save', 'pause');
$('#menuload').onclick = () => openSlots('load', 'menu');
$('#wake').onclick = () => { show('none'); mode = 'play'; endDream(null); };
$('#tomenu').onclick = () => { autosave(); renderer.postU.uFade.value = 1; toMenu(); };
$('#moodnext').onclick = () => toMenu();
$('#optps1').onchange = e => { S.settings.ps1 = e.target.checked; renderer.setPS1(S.settings.ps1); save.write(); };
$('#optvol').oninput = e => { S.settings.volume = +e.target.value; audio.setVolume(S.settings.volume); save.write(); };
$('#optsens').oninput = e => { S.settings.sens = +e.target.value; input.sens = 0.0055 * S.settings.sens; save.write(); };
$('#optreset').onclick = () => { if (confirm('현재 진행 기록을 지울까요? (저장 슬롯은 남아요)')){ save.reset(); Object.assign(S, save.data); toMenu(); } };
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'play') $('#pausebtn').click(); });

// ---- title particles + ken burns (procedural "video" loop)
const pc = $('#particles'), pg = pc.getContext('2d'); const motes = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 2.2, s: .01 + Math.random() * .03, p: Math.random() * 6 }));
function drawParticles(t){ if (!$('#title').classList.contains('on')) return; const w = pc.width = innerWidth, h = pc.height = innerHeight; pg.clearRect(0, 0, w, h);
  for (const m of motes){ m.y -= m.s * .016; if (m.y < -.05){ m.y = 1.05; m.x = Math.random(); } const a = .35 + .35 * Math.sin(t * 1.5 + m.p); pg.fillStyle = `rgba(255,240,250,${a})`; pg.beginPath(); pg.arc((m.x + Math.sin(t * .3 + m.p) * .02) * w, m.y * h, m.r, 0, 7); pg.fill(); } }

// ---- main loop
let last = performance.now(); const fwd = { x: 0, y: 0, z: 0 };
function loop(now){
  requestAnimationFrame(loop); const dt = Math.min(.05, (now - last) / 1000); last = now; const t = now / 1000;
  drawParticles(t);
  const playing = mode === 'play'; if (playing !== document.body.classList.contains('playing')) document.body.classList.toggle('playing', playing);
  const p = state.localPlayer;
  if (p && (mode === 'play' || mode === 'pause')){
    state.time = t; const cmd = input.poll(); stepPlayer(state, p, cmd, dt);
    bus.emit('player:state', p.snapshot());
    const still = (p.moving || 0) < .05 && Math.abs(cmd.lookX) + Math.abs(cmd.lookY) < 1e-4, stillish = (p.moving || 0) < .05;
    if (input.enabled && !fading && mode === 'play'){
      const cp = Math.cos(p.pitch); fwd.x = -Math.sin(p.yaw) * cp; fwd.y = Math.sin(p.pitch); fwd.z = -Math.cos(p.yaw) * cp;
      for (const th of things){ if (!th.r && !th.gaze) continue; const mx = th.mesh ? th.mesh.position.x : th.x, mz = th.mesh ? th.mesh.position.z : th.z; const d = Math.hypot(p.pos.x - mx, p.pos.z - mz);
        if (th.used){ if ((th.rearm || th.rearmAfter) && d > (th.r || 1) + 2.5){ th.used = false; th.rearmAfter = false; } continue; }
        if (th.gaze){ // look at it for N seconds
          const my = (th.mesh ? th.mesh.position.y : th.y || 0) + (th.gazeY ?? 1); const vx = mx - p.pos.x, vy = my - (p.pos.y + p.height), vz = mz - p.pos.z, L = Math.hypot(vx, vy, vz);
          const dot = (vx * fwd.x + vy * fwd.y + vz * fwd.z) / L; if (L < (th.gazeDist || 30) && dot > Math.cos(th.gazeAngle || .14)){ th.acc += dt; if (th.acc > th.gaze){ th.used = true; touch(th); } } else th.acc = Math.max(0, th.acc - dt * 2); continue; }
        const base = th.type === 'orb' ? (th.y ?? 1.2) - 1.2 : (th.y || 0); const vy = p.pos.y - base; const vok = vy < 1.8 && vy > -1.6;
        if (d < th.r + p.radius && vok){ if (th.still){ if (stillish){ th.acc += dt; if (th.acc > th.still){ th.used = true; touch(th); } } else th.acc = 0; } else { th.used = true; touch(th); } } else if (th.still) th.acc = 0; }
      if (still){ stillTime += dt; if (stillTime > 45 && !stillFired){ stillFired = true; say('가만히 있으니, 꿈이 먼저 다가와 속삭인다. "천천히 와도 괜찮아."', 6); foundSecret('still'); } } else stillTime = 0;
      // eerie calm whispers scale with strangeness
      const s = strangeNow(); if (s > .3){ whisperT -= dt; if (whisperT <= 0 && msgTimer <= 0){ const pool = curCh.strange?.whispers || DEFAULT_WHISPERS; say(pool[(Math.random() * pool.length) | 0], 4); whisperT = 60 - s * 30 + Math.random() * 20; } }
      if (s > .45){ titleGlitchT -= dt; if (titleGlitchT <= 0){ const el = $('#chapname'); el.textContent = glitchText(curCh.title, 1); el.classList.add('glitch'); setTimeout(() => { el.textContent = curCh.title; el.classList.remove('glitch'); }, 180 + Math.random() * 300); titleGlitchT = 8 - s * 5 + Math.random() * 6; } }
      autosaveT -= dt; if (autosaveT <= 0){ autosaveT = 30; autosave(); }
    }
  }
  if (msgTimer > 0){ msgTimer -= dt; if (msgTimer <= 0) $('#say').classList.remove('on'); }
  if (mode !== 'title' && mode !== 'menu' && mode !== 'mood' && mode !== 'slots') renderer.frame(state, t, dt);
}
bus.on('player:step', () => audio.sfx('step' + (Math.random() * 3 | 0), .22, (.9 + Math.random() * .2) * (1 - strangeNow() * .2)));
requestAnimationFrame(loop);
// ---- sound unblock helper: shows a '소리 켜기' button if BGM isn't actually playing
const sb = $('#soundbtn'); let blockedFor = 0;
setInterval(() => { const b = (mode !== 'title') && audio.blocked(); blockedFor = b ? blockedFor + 1 : 0; sb.classList.toggle('on', blockedFor >= 2); }, 1000);
sb.addEventListener('click', e => { e.stopPropagation(); audio.unlock(); const w = audio.want; if (w) audio.playMusic(w.name, 1, w.strange, true); toast('소리가 안 들리면 무음 모드(옆 스위치)를 끄고 볼륨을 올려 주세요'); });
show('title'); $('#titlebg').style.backgroundImage = `url(${ASSETS.img.title})`;
window.__gohome = { state, bus, chapters, save, link, warp, loadScene, startDream, renderer, input, audio, things: () => things, busy: () => fading, audioStatus: () => audio.status(), SECRET_IDS, ROOM_IDS, openSlots };
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(() => {});
