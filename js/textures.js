// Procedural low-res textures (PS1 style, nearest filtering). All original.
import * as THREE from '../vendor/three.module.js';
const cache = {};
function mk(size, draw){ const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); draw(g, size); const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter; t.colorSpace = THREE.SRGBColorSpace; return t; }
function rnd(seed){ let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const gens = {
  carpet: (g, n) => { const r = rnd(3); g.fillStyle = '#e8cf8a'; g.fillRect(0, 0, n, n); for (let i = 0; i < 900; i++){ g.fillStyle = `rgba(${150 + r() * 80},${120 + r() * 60},60,${0.15 + r() * 0.2})`; g.fillRect(r() * n | 0, r() * n | 0, 1, 1); } },
  wallpaper: (g, n) => { g.fillStyle = '#efe4c8'; g.fillRect(0, 0, n, n); for (let x = 0; x < n; x += 8){ g.fillStyle = 'rgba(210,180,120,.35)'; g.fillRect(x, 0, 3, n); } g.fillStyle = 'rgba(190,150,110,.4)'; for (let y = 4; y < n; y += 16) for (let x = 2; x < n; x += 8) g.fillRect(x + ((y / 16) % 2) * 4, y, 2, 2); },
  tiles: (g, n) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++){ g.fillStyle = (x + y) % 2 ? '#f6d6e6' : '#d6eaf6'; g.fillRect(x * n / 8, y * n / 8, n / 8, n / 8); } g.strokeStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i <= 8; i++){ g.beginPath(); g.moveTo(i * n / 8, 0); g.lineTo(i * n / 8, n); g.moveTo(0, i * n / 8); g.lineTo(n, i * n / 8); g.stroke(); } },
  pool: (g, n) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++){ g.fillStyle = `hsl(${185 + ((x * 7 + y * 3) % 5)},55%,${86 + ((x + y) % 3) * 2}%)`; g.fillRect(x * n / 16, y * n / 16, n / 16 - 1, n / 16 - 1); } },
  stars: (g, n) => { g.fillStyle = '#b9a6e8'; g.fillRect(0, 0, n, n); const r = rnd(11); g.fillStyle = '#fff7c8'; for (let i = 0; i < 26; i++){ const x = r() * n, y = r() * n, s = 1 + r() * 2; g.fillRect(x, y - s, 1, s * 2 + 1); g.fillRect(x - s, y, s * 2 + 1, 1); } },
  wood: (g, n) => { for (let y = 0; y < n; y++){ g.fillStyle = `hsl(28,${35 + Math.sin(y * 0.7) * 8}%,${52 + Math.sin(y * 0.3) * 6}%)`; g.fillRect(0, y, n, 1); } g.fillStyle = 'rgba(80,40,20,.35)'; for (let y = 0; y < n; y += 16) g.fillRect(0, y, n, 1); },
  door: (g, n) => { g.fillStyle = '#fbf8f2'; g.fillRect(0, 0, n, n); g.strokeStyle = '#d9d2c6'; g.lineWidth = 3; g.strokeRect(n * .15, n * .08, n * .7, n * .38); g.strokeRect(n * .15, n * .54, n * .7, n * .38); },
  cloud: (g, n) => { const gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.6, 'rgba(255,245,250,.7)'); gr.addColorStop(1, 'rgba(255,240,250,0)'); g.fillStyle = gr; g.fillRect(0, 0, n, n); },
  grass: (g, n) => { const r = rnd(5); g.fillStyle = '#bfe6b8'; g.fillRect(0, 0, n, n); for (let i = 0; i < 500; i++){ g.fillStyle = `hsla(${100 + r() * 40},50%,${60 + r() * 20}%,.6)`; g.fillRect(r() * n | 0, r() * n | 0, 1, 2); } },
  water: (g, n) => { const r = rnd(8); g.fillStyle = '#eef8fa'; g.fillRect(0, 0, n, n); for (let i = 0; i < 40; i++){ g.strokeStyle = `rgba(255,255,255,${.3 + r() * .5})`; g.lineWidth = 1; const x = r() * n, y = r() * n, w = 4 + r() * 12; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y - 2, x + w, y); g.stroke(); } },
  wallpaper2: (g, n) => { gens.wallpaper(g, n); g.fillStyle = 'rgba(160,120,170,.35)'; for (let y = 0; y < n; y += 16) for (let x = 0; x < n; x += 16){ g.fillRect(x + 5, y + 5, 2, 2); g.fillRect(x + 10, y + 5, 2, 2); } },
  facepaper: (g, n) => { g.fillStyle = '#efe0d8'; g.fillRect(0, 0, n, n); for (let x = 0; x < n; x += 8){ g.fillStyle = 'rgba(200,160,150,.3)'; g.fillRect(x, 0, 3, n); }
    g.fillStyle = 'rgba(90,60,80,.55)'; for (let y = 6; y < n; y += 16) for (let x = 4; x < n; x += 16){ g.fillRect(x, y, 2, 2); g.fillRect(x + 6, y, 2, 2); g.fillRect(x + 2, y + 6, 4, 1); } },
  eyestars: (g, n) => { gens.stars(g, n); for (const [x, y] of [[14, 20], [44, 40], [30, 54]]){ g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y, 5, 2.5, 0, 0, 7); g.fill(); g.fillStyle = '#4a3a6a'; g.fillRect(x - 1, y - 1, 2, 2); } },
  cloudface: (g, n) => { gens.cloud(g, n); g.fillStyle = 'rgba(120,100,140,.3)'; g.beginPath(); g.ellipse(n * .38, n * .45, 2, 3, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(n * .62, n * .45, 2, 3, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(120,100,140,.25)'; g.lineWidth = 1.5; g.beginPath(); g.arc(n / 2, n * .55, n * .1, .3, Math.PI - .3); g.stroke(); },
  sand: (g, n) => { const r = rnd(4); g.fillStyle = '#f2dcc0'; g.fillRect(0, 0, n, n); for (let i = 0; i < 700; i++){ g.fillStyle = `rgba(${170 + r() * 60},${140 + r() * 50},${110 + r() * 40},.35)`; g.fillRect(r() * n | 0, r() * n | 0, 1, 1); } },
  concrete: (g, n) => { const r = rnd(6); g.fillStyle = '#c8c4cc'; g.fillRect(0, 0, n, n); for (let i = 0; i < 500; i++){ g.fillStyle = `rgba(80,70,90,${r() * .12})`; g.fillRect(r() * n | 0, r() * n | 0, 2, 1); } g.fillStyle = '#e8d870'; g.fillRect(0, n - 6, n, 4); },
  rail: (g, n) => { g.fillStyle = '#6a5a6a'; g.fillRect(0, 0, n, n); g.fillStyle = '#8a7060'; for (let y = 0; y < n; y += 10) g.fillRect(0, y, n, 5); g.fillStyle = '#c8c8d8'; g.fillRect(n * .2, 0, 3, n); g.fillRect(n * .78, 0, 3, n); },
  checker: (g, n) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++){ g.fillStyle = (x + y) % 2 ? '#2b2440' : '#f3eefc'; g.fillRect(x * n / 4, y * n / 4, n / 4, n / 4); } },
  checkerfaint: (g, n) => { gens.plain(g, n); for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if ((x + y) % 2){ g.fillStyle = 'rgba(70,50,110,.10)'; g.fillRect(x * n / 8, y * n / 8, n / 8, n / 8); } },
  plain: (g, n) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n); const r = rnd(2); for (let i = 0; i < 300; i++){ g.fillStyle = `rgba(0,0,0,${r() * .05})`; g.fillRect(r() * n | 0, r() * n | 0, 2, 2); } },
};
export function tex(name){ if (!name || !gens[name]) name = 'plain'; const key = name + '|' + moodKey; return cache[key] || (cache[key] = mkTex(build(name))); }
// ---- higher-quality pipeline that keeps the PS1 look ----
// 64px hand-drawn base -> 128px nearest upscale (optionally wave-warped) -> mood pattern overlay
// -> per-texel micro detail -> mood tint/contrast/invert -> 15-bit colour quantise with 4x4 Bayer dither.
let moodDef = null, moodLv = 0, moodKey = '';
/** Set the accumulated-mood texture variant (see chapters/moods.js). Changing it builds new variants lazily. */
export function setTexMood(def, level){ moodDef = def && level > 0 ? def : null; moodLv = moodDef ? level : 0; moodKey = moodDef ? def.label + ':' + Math.round(level * 10) : ''; }
export function texMoodKey(){ return moodKey; }
function mkTex(c){ const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter; t.colorSpace = THREE.SRGBColorSpace; return t; }
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function build(name){
  const B = 64, N = 128; const base = document.createElement('canvas'); base.width = base.height = B; gens[name](base.getContext('2d'), B);
  const c = document.createElement('canvas'); c.width = c.height = N; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  const T = moodDef?.tex || {}, lv = moodLv, r = rnd(name.length * 97 + name.charCodeAt(0) * 13 + 7);
  if (T.wave && lv > 0){ for (let y = 0; y < N; y++){ const off = Math.round(Math.sin(y / N * Math.PI * 4) * T.wave * lv * 2); g.drawImage(base, 0, y >> 1, B, 1, off, y, N, 1); g.drawImage(base, 0, y >> 1, B, 1, off - N * Math.sign(off || 1), y, N, 1); } }
  else g.drawImage(base, 0, 0, N, N);
  const alphaTex = name === 'cloud' || name === 'cloudface';
  if (lv > 0 && !alphaTex){ g.save();
    if (T.pattern === 'mist'){ for (let y = 0; y < N; y += 32){ const gr = g.createLinearGradient(0, y, 0, y + 32); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(255,255,255,${.16 * lv})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, y, N, 32); } }
    if (T.pattern === 'caustic'){ g.strokeStyle = `rgba(255,255,255,${.32 * lv})`; g.lineWidth = 1; for (let k = 0; k < 6; k++){ const ph = r() * 6.28, y0 = r() * N; g.beginPath(); for (let x = 0; x <= N; x += 4){ const y = y0 + Math.sin(x / N * 6.283 * 2 + ph) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } }
    if (T.pattern === 'worn'){ for (let i = 0; i < 4; i++){ const x = r() * N, y = r() * N, rad = 8 + r() * 18; const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(120,80,40,${.14 * lv})`); gr.addColorStop(1, 'rgba(120,80,40,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
      if (r() < .6 + lv * .4){ const cols = ['#e86a6a', '#5a8ae8', '#e8c03a', '#6ac06a']; g.strokeStyle = cols[(r() * 4) | 0]; g.globalAlpha = .45 * lv; g.lineWidth = 2; g.beginPath(); let x = r() * N * .7, y = r() * N * .7; g.moveTo(x, y); for (let k = 0; k < 6; k++){ x += 4 + r() * 6; y += (k % 2 ? -1 : 1) * (3 + r() * 5); g.lineTo(x, y); } g.stroke();
        g.beginPath(); g.arc(r() * N, r() * N, 4 + r() * 4, 0, 6.3); g.stroke(); g.globalAlpha = 1; } }
    if (T.pattern === 'eyes'){ const n = Math.round(1 + lv * 4); for (let i = 0; i < n; i++){ const x = 10 + r() * (N - 20), y = 10 + r() * (N - 20); g.globalAlpha = .35 + lv * .45; g.fillStyle = '#fbf6ff'; g.beginPath(); g.ellipse(x, y, 5, 2.4, 0, 0, 7); g.fill(); g.fillStyle = '#3a2a52'; g.fillRect(x - 1, y - 1, 3, 3); g.globalAlpha = 1; } }
    g.restore(); }
  const img = g.getImageData(0, 0, N, N), d = img.data;
  const noiseAmp = 7 * (1 - (T.soften || 0) * lv), con = 1 + ((T.contrast ?? 1) - 1) * lv, ta = (T.tintAmt || 0) * lv, tint = T.tint || [255, 255, 255], inv = (T.invert || 0) * lv;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){ const i = (y * N + x) * 4; const nz = (r() - .5) * noiseAmp + ((x & 1) ^ (y & 1) ? 1.5 : -1.5); const dz = BAYER[(y & 3) * 4 + (x & 3)] / 2 - 4;
    for (let k = 0; k < 3; k++){ let v = d[i + k] + nz; v = (v - 128) * con + 128; v = v * (1 - ta) + tint[k] * ta * (v / 200); v = v * (1 - inv) + (255 - v) * inv; v = Math.round((v + dz) / 8) * 8; d[i + k] = v < 0 ? 0 : v > 255 ? 255 : v; } }
  g.putImageData(img, 0, 0); return c;
}
