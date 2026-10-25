// Audio manager, hardened for iOS (Safari, home-screen PWA and file:// WKWebView apps).
// - Unlock happens synchronously inside a real user gesture (touchend/click/keydown).
// - Silent-switch workaround: navigator.audioSession.type='playback' (iOS 16.4+) and a looping
//   silent <audio> element, which moves the iOS audio session into "playback" so Web Audio is audible.
// - Assets are decoded straight from embedded base64 (no fetch needed on file://), with fetch/XHR for URLs.
// - If Web Audio fails, BGM falls back to a plain HTMLAudioElement.
import { ASSETS } from './assets.js';

function silentWavURL(){ // 0.5 s of silence, 8 kHz mono 8-bit
  const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer); const w = (o, s) => [...s].forEach((c, i) => b[o + i] = c.charCodeAt(0));
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
  let s = ''; for (const x of b) s += String.fromCharCode(x); return 'data:audio/wav;base64,' + btoa(s);
}
function b64ToArrayBuffer(dataUrl){ const i = dataUrl.indexOf(','); const bin = atob(dataUrl.slice(i + 1)); const u = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u[k] = bin.charCodeAt(k); return u.buffer; }
function xhrBuffer(url){ return new Promise((res, rej) => { const x = new XMLHttpRequest(); x.open('GET', url); x.responseType = 'arraybuffer'; x.onload = () => (x.status === 0 || x.status === 200) && x.response ? res(x.response) : rej(new Error('xhr ' + x.status)); x.onerror = () => rej(new Error('xhr error')); x.send(); }); }

export class AudioManager {
  constructor(){
    this.ctx = null; this.buf = {}; this.music = null; this.vol = 0.8; this.want = null; this.errors = []; this.listeners = new Set();
    this.unmuteEl = null; this.el = null; this.mode = 'webaudio';
    const g = () => this.unlock();
    for (const ev of ['touchend', 'click', 'keydown', 'pointerup']) document.addEventListener(ev, g, true);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.resume(); });
    addEventListener('pageshow', () => this.resume()); addEventListener('focus', () => this.resume());
  }
  onChange(fn){ this.listeners.add(fn); } changed(){ for (const f of this.listeners) f(this.status()); }
  /** Must run inside a user gesture. Safe to call many times. */
  unlock(){
    try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch {}
    const C = window.AudioContext || window.webkitAudioContext;
    if (!this.ctx && C){ try { this.ctx = new C(); this.master = this.ctx.createGain(); this.master.gain.value = this.vol; this.master.connect(this.ctx.destination); this.ctx.onstatechange = () => { if (this.ctx.state === 'running' && this.want && !this.music?.src && this.mode === 'webaudio') this.playMusic(this.want.name, 1, this.want.strange, true); this.changed(); }; } catch (e){ this.errors.push('ctx ' + e.message); } }
    if (this.ctx){
      if (this.ctx.state !== 'running'){ try { this.ctx.resume(); } catch {} }
      try { const o = this.ctx.createBufferSource(); o.buffer = this.ctx.createBuffer(1, 1, 22050); o.connect(this.ctx.destination); o.start(0); } catch {}
    }
    if (!this.unmuteEl){ const a = this.unmuteEl = document.createElement('audio'); a.setAttribute('playsinline', ''); a.setAttribute('x-webkit-airplay', 'deny'); a.preload = 'auto'; a.loop = true; a.src = silentWavURL(); a.volume = 0.01; }
    if (!this.el){ // prime the fallback BGM element inside the gesture so iOS lets it play later
      const e = this.el = document.createElement('audio'); e.setAttribute('playsinline', ''); e.loop = true; e.volume = this.vol; e.src = silentWavURL(); e.dataset.name = '';
      const p = e.play(); p && p.then(() => { if (this.mode !== 'element') e.pause(); }).catch(() => {}); }
    if (this.unmuteEl.paused){ const p = this.unmuteEl.play(); p && p.catch(() => {}); }
    if (this.mode === 'element' && this.el && this.el.paused && this.want){ const p = this.el.play(); p && p.catch(() => {}); }
    if (this.want && this.mode === 'webaudio' && !this.music?.src && this.ctx?.state === 'running') this.playMusic(this.want.name, 1, this.want.strange, true);
    this.changed();
  }
  resume(){ if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed'){ const p = this.ctx.resume(); p && p.then(() => this.changed()).catch(() => {}); } }
  status(){ return { ctx: this.ctx?.state || 'none', mode: this.mode, music: this.want?.name || null,
    playing: this.mode === 'element' ? !!(this.el && !this.el.paused) : !!(this.music?.src && this.ctx?.state === 'running'), unmute: !!(this.unmuteEl && !this.unmuteEl.paused), errors: this.errors.slice(-5) }; }
  blocked(){ const s = this.status(); return !!this.want && !s.playing; }
  setVolume(v){ this.vol = v; if (this.master) this.master.gain.value = v; if (this.el) this.el.volume = v; }
  async load(name){
    if (this.buf[name]) return this.buf[name]; if (!this.ctx) return null;
    const url = ASSETS.audio[name]; if (!url) return null;
    try {
      let ab;
      if (url.startsWith('data:')) ab = b64ToArrayBuffer(url);
      else { try { const r = await fetch(url); if (!r.ok) throw new Error('fetch ' + r.status); ab = await r.arrayBuffer(); } catch { ab = await xhrBuffer(url); } }
      this.buf[name] = await new Promise((res, rej) => { const p = this.ctx.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
    } catch (e){ this.errors.push(`decode ${name}: ${e?.message || e}`); return null; }
    return this.buf[name];
  }
  reversed(name, b){ const k = name + ':rev'; if (this.buf[k]) return this.buf[k]; const r = this.ctx.createBuffer(b.numberOfChannels, b.length, b.sampleRate);
    for (let c = 0; c < b.numberOfChannels; c++){ const src = b.getChannelData(c), dst = r.getChannelData(c); for (let i = 0, n = src.length; i < n; i++) dst[i] = src[n - 1 - i]; } return (this.buf[k] = r); }
  /** strange (0..1): detunes/slows the track and blends in a slowed reversed ghost layer. Persists across scene changes. */
  async playMusic(name, fade = 2.5, strange = 0, force = false){
    this.want = { name, strange };
    if (this.mode === 'element') return this.playElement(name, strange);
    if (!this.ctx || this.ctx.state !== 'running'){ this.changed(); return; }
    if (!force && this.music?.name === name && this.music.strange === strange && this.music.src) return;
    const old = this.music; const now = this.ctx.currentTime;
    if (old?.g){ old.g.gain.cancelScheduledValues(now); old.g.gain.setValueAtTime(old.g.gain.value, now); old.g.gain.linearRampToValueAtTime(0, now + fade); setTimeout(() => { try { old.src.stop(); old.rev?.stop(); } catch {} }, fade * 1000 + 100); }
    this.music = { name, strange }; const me = this.music;
    const b = await this.load(name);
    if (!b){ this.fallbackToElement(); return; }
    if (this.music !== me) return;
    const src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true; src.playbackRate.value = 1 - strange * .06;
    const g = this.ctx.createGain(); g.gain.value = 0; src.connect(g); g.connect(this.master); src.start();
    g.gain.setValueAtTime(0, this.ctx.currentTime); g.gain.linearRampToValueAtTime(0.75, this.ctx.currentTime + fade);
    if (strange > .15){ const rv = this.ctx.createBufferSource(); rv.buffer = this.reversed(name, b); rv.loop = true; rv.playbackRate.value = .5 + (1 - strange) * .2;
      const rg = this.ctx.createGain(); rg.gain.value = strange * .35; const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      rv.connect(lp); lp.connect(rg); rg.connect(g); rv.start(); me.rev = rv; }
    me.src = src; me.g = g; this.changed();
  }
  fallbackToElement(){ if (this.mode === 'element') return; this.errors.push('fallback: HTMLAudioElement'); this.mode = 'element'; if (this.want) this.playElement(this.want.name, this.want.strange); }
  playElement(name, strange){
    if (!this.el){ this.el = document.createElement('audio'); this.el.setAttribute('playsinline', ''); this.el.loop = true; this.el.volume = this.vol; }
    const url = ASSETS.audio[name]; if (this.el.dataset.name !== name){ this.el.src = url; this.el.dataset.name = name; }
    try { this.el.preservesPitch = false; this.el.webkitPreservesPitch = false; } catch {}
    this.el.playbackRate = 1 - strange * .06; const p = this.el.play(); p && p.then(() => this.changed()).catch(e => { this.errors.push('element: ' + e.message); this.changed(); });
  }
  async sfx(name, vol = 0.5, rate = 1){
    if (!this.ctx || this.ctx.state !== 'running') return; const b = await this.load(name); if (!b) return;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate;
    const g = this.ctx.createGain(); g.gain.value = vol; s.connect(g); g.connect(this.master); s.start();
  }
  preload(names){ names.forEach(n => this.load(n)); }
}
