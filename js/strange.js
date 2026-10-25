// Strangeness layer: turns a chapter's `strangeness` (0..1) into extra uncanny content.
// Chapters can tune with `strange: { spots, watchers, skyfaces, nowhere, flipped, giants, whispers, auto:false }`.
export const DEFAULT_WHISPERS = ['여기는 집이 아니야.', '괜찮아. 천천히 와.', '누가 불을 켜 두었을까?', '아까도 이 길이었어.', '문은 항상 같은 곳에 있지 않아.', '너를 기다리는 사람이 있어.', '조금만 더 가면 돼.', '지금 몇 시지?', '뒤를 돌아봐도 괜찮아. 아무도 없어.', '이 노래, 거꾸로 들린다.', '키는 컸는데, 마음은 그대로야.', '어른인 척하느라 피곤했지?'];
const GLITCH = ['ㅁ', 'ㅇ', 'ㆍ', '□', '…', 'ㅎ', '집', '　'];
export function glitchText(t, s, rng = Math.random){
  if (s < .25) return t; const p = (s - .2) * .12; let out = '';
  for (const ch of t){ const r = rng(); if (ch !== ' ' && r < p) out += GLITCH[(rng() * GLITCH.length) | 0]; else if (r < p * 1.6 && /[가-힣]/.test(ch)) out += ch + ch; else out += ch; }
  return out;
}
export function strangeLayer(ch, rng){
  const s = ch.strangeness || 0, cfg = ch.strange || {}; const objs = [];
  if (cfg.auto === false || s < .15) return objs;
  const b = ch.bounds || [-20, -20, 20, 20];
  const spot = () => { if (cfg.spots?.length){ const p = cfg.spots[(rng() * cfg.spots.length) | 0]; return [p[0] + (rng() - .5) * 1.5, p[1] + (rng() - .5) * 1.5]; } return [b[0] + rng() * (b[2] - b[0]), b[1] + rng() * (b[3] - b[1])]; };
  const n = (k, f) => cfg[k] ?? Math.round(f);
  for (let i = 0; i < n('nowhere', s >= .2 ? s * 4 : 0); i++){ const [x, z] = spot(); objs.push({ type: 'door', x, z, rot: rng() * 6.28, y: rng() < s * .6 ? 1 + rng() * 4 * s : 0, color: '#f4eef8' }); }
  for (let i = 0; i < n('watchers', s >= .3 ? s * 7 : 0); i++){ const [x, z] = spot(); objs.push({ type: 'watcher', x, z, rot: rng() * 6.28, h: 2 + rng() * s * 1.6, watch: rng() < .7 ? .12 + rng() * .15 : false, face: rng() < s, color: ['#eae4ee', '#e4ecf0', '#f0e4e4'][i % 3], r: s > .6 && i % 3 === 0 ? 1.1 : 0, text: s > .6 && i % 3 === 0 ? ['그것은 아무 말도 하지 않는다. 그냥 거기 있다.', '가까이 다가가니, 그것도 집을 찾고 있다고 말한다.', '"너도 길을 잃었구나."'][i % 3] : undefined, mood: [0, 1] }); }
  for (let i = 0; i < n('skyfaces', s >= .4 ? s * 4 : 0); i++){ const a = rng() * 6.28; objs.push({ type: 'skyface', x: Math.cos(a) * 90, y: 28 + rng() * 25, z: Math.sin(a) * 90 - 20, s: 24 + rng() * 20, opacity: .35 + s * .5 }); }
  for (let i = 0; i < n('flipped', s >= .5 ? s * 5 : 0); i++){ const [x, z] = spot(); objs.push({ type: ['chair', 'table', 'chair', 'tv'][i % 4], x, z, flip: true, y: 2.6 + rng() * 1.5, rot: rng() * 6.28 }); }
  for (let i = 0; i < n('giants', s >= .4 ? s * 2.5 : 0); i++){ const a = rng() * 6.28; objs.push({ type: ['duck', 'chair', 'bunny', 'clock'][i % 4], x: Math.cos(a) * 45, z: Math.sin(a) * 45, scale: 6 + rng() * 8 * s, y: i % 4 === 3 ? 12 : 0, rot: rng() * 6 }); }
  return objs;
}
