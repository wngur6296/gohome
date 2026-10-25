// Renderer: reads GameState, builds three.js scene from chapter data, PS1 + dream post FX.
import * as THREE from '../vendor/three.module.js';
import { tex } from './textures.js';
import { buildModel } from './models.js';
import { platformOffset } from './state.js';

export const psx = { snap: { value: new THREE.Vector2(160, 120) }, on: { value: 1 }, time: { value: 0 }, warp: { value: 0 } };
// Inject vertex snapping (PS1 jitter) into any built-in material.
export function psxify(mat){
  mat.onBeforeCompile = s => {
    s.uniforms.uSnap = psx.snap; s.uniforms.uPsx = psx.on; s.uniforms.uTime = psx.time; s.uniforms.uWarp = psx.warp;
    s.vertexShader = 'uniform vec2 uSnap; uniform float uPsx; uniform float uTime; uniform float uWarp;\n' + s.vertexShader.replace('#include project_vertex', `#include project_vertex
      if (uWarp > 0.001) {
        vec4 wp = modelMatrix * vec4(transformed, 1.0); vec3 rel = wp.xyz - cameraPosition; float dist = length(rel.xz);
        wp.y += uWarp * 0.0025 * dist * dist * sin(uTime * 0.07 + 1.3);
        wp.x += uWarp * 0.22 * sin(wp.z * 0.21 + uTime * 0.23) * max(wp.y, 0.0) * 0.35;
        wp.z += uWarp * 0.18 * sin(wp.x * 0.17 - uTime * 0.19) * max(wp.y, 0.0) * 0.3;
        wp.y *= 1.0 + uWarp * 0.15 * sin(wp.x * 0.11 + wp.z * 0.07 + uTime * 0.15);
        gl_Position = projectionMatrix * viewMatrix * wp; }
      if (uPsx > 0.5) { vec4 p = gl_Position; p.xy = floor(p.xy / p.w * uSnap + 0.5) / uSnap * p.w; gl_Position = p; }`);
  };
  mat.customProgramCacheKey = () => 'psx';
  return mat;
}
const matCache = new Map();
export function mat(opts = {}){
  const key = JSON.stringify(opts) + JSON.stringify(mat.swap || {}); if (matCache.has(key)) return matCache.get(key);
  const m = psxify(new THREE.MeshLambertMaterial({
    color: new THREE.Color(opts.color || '#ffffff'), map: opts.tex ? tex((mat.swap && mat.swap[opts.tex]) || opts.tex) : null,
    emissive: new THREE.Color(opts.emissive || '#000000'), transparent: !!opts.opacity, opacity: opts.opacity ?? 1,
    side: opts.side === 'double' ? THREE.DoubleSide : (opts.side === 'back' ? THREE.BackSide : THREE.FrontSide), depthWrite: opts.opacity ? false : true, fog: opts.fog !== false,
  }));
  matCache.set(key, m); return m;
}

const POST_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
const POST_FS = `precision highp float; varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uTime, uFade, uHue, uSat, uGrain, uAber, uBloom, uDither, uWobble, uStrange; uniform vec3 uFadeColor;
vec3 hue(vec3 c, float a){ const vec3 k = vec3(0.57735); float ca = cos(a); return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1. - ca); }
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 uv = vUv; uv.x += sin(uv.y * 18. + uTime * 1.3) * 0.0015 * uWobble; uv.y += sin(uv.x * 14. + uTime) * 0.0012 * uWobble;
  vec2 d = (uv - .5);
  uv = .5 + d * (1. + uStrange * .05 * sin(uTime * .4) * dot(d, d) * 4.);
  uv.x += uStrange * .004 * step(.985, fract(uv.y * 3. + uTime * .05)) * sin(uTime * 3.);
  d = uv - .5; float r2 = dot(d, d);
  vec2 off = d * uAber * (0.6 + r2 * 2.);
  vec3 c = vec3(texture2D(tDiffuse, uv + off).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - off).b);
  // cheap bloom: wide taps of bright parts
  vec3 b = vec3(0.); vec2 px = 1. / uRes;
  for (int i = 0; i < 8; i++){ float a = float(i) * 0.785 + 0.3; vec2 o = vec2(cos(a), sin(a)) * px * 7.;
    vec3 s1 = texture2D(tDiffuse, uv + o).rgb, s2 = texture2D(tDiffuse, uv + o * 2.4).rgb;
    b += max(s1 - .78, 0.) + max(s2 - .78, 0.) * .7; }
  c += b * uBloom * .16;
  c = hue(c, uHue + uStrange * .35 * sin(uTime * .05 + uv.y * 2.));
  if (uStrange > .5){ float lum = dot(c, vec3(.33)); vec3 band = .5 + .5 * cos(6.28 * (lum * 1.5 + vec3(0., .33, .67) + uTime * .01)); c = mix(c, band * (lum + .3), (uStrange - .5) * .4); }
  float l = dot(c, vec3(.299, .587, .114)); c = mix(vec3(l), c, uSat);
  c = mix(c, c * vec3(1.03, .98, 1.06) + vec3(.02, .0, .04), .5); // dreamy lift
  c *= 1. - r2 * 0.95; // vignette
  c += (h(uv * uRes + fract(uTime) * 91.) - .5) * uGrain;
  if (uDither > .5){ float dd = (h(floor(uv * uRes)) - .5) / 32.; c = floor((c + dd) * 32.) / 32.; } // 15-bit colour
  c = mix(c, uFadeColor, uFade);
  gl_FragColor = vec4(c, 1.);
}`;

export class Renderer {
  constructor(canvas){
    this.r = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    this.r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene(); this.camera = new THREE.PerspectiveCamera(70, 1, 0.08, 400);
    this.rt = new THREE.WebGLRenderTarget(4, 4, { magFilter: THREE.NearestFilter, minFilter: THREE.LinearFilter });
    this.postU = { tDiffuse: { value: this.rt.texture }, uRes: { value: new THREE.Vector2(1, 1) }, uTime: psx.time, uFade: { value: 1 }, uFadeColor: { value: new THREE.Color('#fff4fb') },
      uHue: { value: 0 }, uSat: { value: 1 }, uGrain: { value: 0.05 }, uAber: { value: 0.004 }, uBloom: { value: 1 }, uDither: { value: 1 }, uWobble: { value: 1 }, uStrange: { value: 0 } };
    this.post = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: POST_VS, fragmentShader: POST_FS, uniforms: this.postU, depthTest: false }));
    this.postScene = new THREE.Scene(); this.postScene.add(this.post); this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.world = new THREE.Group(); this.scene.add(this.world); this.anim = []; this.views = new Map(); this.quality = 1;
    this.resize(); addEventListener('resize', () => this.resize());
  }
  setPS1(on){ psx.on.value = on ? 1 : 0; this.postU.uDither.value = on ? 1 : 0; this.resize(); }
  resize(){
    const w = innerWidth, h = innerHeight; this.r.setPixelRatio(1); this.r.setSize(w, h, false);
    // PS1 mode renders ~240 lines tall; HQ mode renders at up to 1.25x CSS px (capped for iPhone fill-rate).
    const ps1 = psx.on.value > .5; const scale = ps1 ? 300 / Math.min(w, h) : Math.min(devicePixelRatio, 1.25) * this.quality;
    const rw = Math.max(64, Math.round(w * scale)), rh = Math.max(64, Math.round(h * scale));
    this.rt.setSize(rw, rh); this.postU.uRes.value.set(rw, rh); psx.snap.value.set(rw / 2, rh / 2);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  clear(){ this.world.traverse(o => { if (o.geometry) o.geometry.dispose(); }); this.scene.remove(this.world); this.world = new THREE.Group(); this.scene.add(this.world); this.anim = []; this.views.clear(); }

  /** Build visuals for a chapter. Returns colliders + interactables to the game. */
  build(ch, rng, extra){
    this.clear(); const P = ch.palette; const st = ch.strangeness || 0; this.strange = st;
    mat.swap = st >= .55 ? { wallpaper: 'facepaper', stars: 'eyestars' } : (st >= .3 ? { wallpaper: 'wallpaper2' } : {});
    psx.warp.value = Math.max(0, st - .2) * 1.2;
    const U = this.postU; U.uWobble.value = 1 + st * 5; U.uAber.value = .004 + st * .01; U.uStrange.value = st;
    this.scene.fog = new THREE.Fog(P.fog, P.fogNear ?? 6, P.fogFar ?? 45); this.r.setClearColor(P.fog);
    this.world.add(new THREE.HemisphereLight(P.skyTop, P.ground || P.fog, P.hemi ?? 1.1)); this.world.add(new THREE.AmbientLight(P.ambient || '#fff2f6', P.ambientI ?? 1.4));
    const sun = new THREE.DirectionalLight(P.sun || '#fff4e0', P.sunI ?? 0.9); sun.position.set(3, 10, 4); this.world.add(sun);
    this.world.add(this.sky(P));
    this.postU.uHue.value = (P.hue || 0) + (extra.hueDrift || 0); this.postU.uSat.value = P.sat ?? 1;
    const colliders = [], things = []; this.grounds = [];
    const objs = [...ch.objects, ...extra.objects];
    for (const o of objs) this.add(o, colliders, things, rng);
    return { colliders, things, grounds: this.grounds };
  }
  sky(P){
    const g = new THREE.SphereGeometry(300, 24, 16);
    const m = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: new THREE.Color(P.skyTop) }, bot: { value: new THREE.Color(P.skyBottom) }, mid: { value: new THREE.Color(P.skyMid || P.skyBottom) }, stars: { value: P.stars ? 1 : 0 }, t: psx.time },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: `varying vec3 vP; uniform vec3 top, bot, mid; uniform float stars, t; float h(vec3 p){ return fract(sin(dot(p, vec3(12.9,78.2,37.7))) * 43758.5); }
        void main(){ vec3 d = normalize(vP); float y = d.y; vec3 c = y > 0. ? mix(mid, top, pow(y, .6)) : mix(mid, bot, pow(-y, .5));
          float cl = sin(d.x * 6. + t * .02) * sin(d.z * 5. - t * .015) * sin(y * 9.); c += vec3(1., .95, 1.) * smoothstep(.55, .95, cl) * .12 * (1. - abs(y));
          if (stars > .5 && y > 0.) { vec3 q = floor(d * 160.); float s = step(.996, h(q)); c += s * (0.6 + 0.4 * sin(t * 2. + h(q) * 40.)); }
          gl_FragColor = vec4(c, 1.); }` });
    const s = new THREE.Mesh(g, m); s.renderOrder = -1; s.frustumCulled = false; this.skyMesh = s; return s;
  }
  box(o, w, h, d, m){ const g = new THREE.BoxGeometry(w, h, d); const r = o.texRepeat || 1;
    // world-scale UVs so textures tile instead of stretch
    const uv = g.attributes.uv, n = g.attributes.normal;
    for (let i = 0; i < uv.count; i++){ const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)); const su = ax > .5 ? d : w, sv = ay > .5 ? d : h; uv.setXY(i, uv.getX(i) * su / 2 * r, uv.getY(i) * sv / 2 * r); }
    return new THREE.Mesh(g, m); }
  add(o, colliders, things, rng){
    const W = this.world; let mesh = null;
    const solid = (x, z, w, d, minY = 0, maxY = 99) => colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, minY, maxY });
    const ground = (x, z, w, d, top, extra) => this.grounds.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, top, ...extra });
    switch (o.type){
      case 'floor': { const m = this.box(o, o.w, 0.2, o.d, mat({ tex: o.tex, color: o.color })); m.position.set(o.x || 0, (o.y || 0) - 0.1, o.z || 0); W.add(m); if (o.walk !== false) ground(o.x || 0, o.z || 0, o.w, o.d, o.y || 0); break; }
      case 'box': { mesh = this.box(o, o.w, o.h, o.d, mat({ tex: o.tex, color: o.color, emissive: o.emissive })); mesh.position.set(o.x, (o.y || 0) + o.h / 2, o.z); if (o.rot) mesh.rotation.y = o.rot; W.add(mesh); if (o.solid !== false){ const sw = o.rot && Math.abs(Math.sin(o.rot)) > .7; solid(o.x, o.z, sw ? o.d : o.w, sw ? o.w : o.d, o.y || 0, (o.y || 0) + o.h); } break; }
      case 'platform': { // jumpable surface: stone / cloud / tile / door / book …, optional `move:{axis,amp,speed,phase}`
        const w = o.w || 1.6, d = o.d || 1.6, h = o.h || .35, st = o.style || 'stone'; const grp = new THREE.Group();
        if (st === 'cloud'){ const cm = mat({ color: o.color || '#ffffff', emissive: o.glow || '#9a8aa0' }); const n = Math.max(3, Math.round(w * 1.6)); for (let i = 0; i < n; i++){ const p = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.min(w, d) * .38 * (0.8 + rng() * .4), 1), cm); p.position.set((i / (n - 1) - .5) * w * .8, -.25, (rng() - .5) * d * .4); p.scale.y = .55; grp.add(p); } }
        else if (st === 'door'){ const m2 = this.box({}, w, .12, d, mat({ tex: 'door', color: o.color || '#ffffff', emissive: o.glow || '#000' })); m2.position.y = -.06; grp.add(m2); }
        else { const m2 = this.box(o, w, h, d, mat({ tex: o.tex || (st === 'tile' ? 'pool' : st === 'wood' ? 'wood' : 'plain'), color: o.color || (st === 'stone' ? '#e8e0f0' : '#ffffff'), emissive: o.emissive })); m2.position.y = -h / 2; grp.add(m2); }
        grp.position.set(o.x, o.y || 0, o.z); if (o.rot) grp.rotation.y = o.rot; W.add(grp); mesh = grp;
        const sw = o.rot && Math.abs(Math.sin(o.rot)) > .7; ground(o.x, o.z, sw ? d : w, sw ? w : d, o.y || 0, { move: o.move, noSafe: !!o.move });
        if (o.move){ const bx = o.x, by = o.y || 0, bz = o.z; this.anim.push(() => { const of = platformOffset(o.move, psx.time.value); grp.position.set(bx + of.x, by + of.y, bz + of.z); }); }
        else if (st === 'cloud'){ const ph = rng() * 6; this.anim.push(t => grp.children.forEach((c, i) => c.position.y = -.25 + Math.sin(t * .8 + i + ph) * .03)); }
        break; }
      case 'corridor': this.corridor(o, colliders); break;
      case 'room': this.room(o, colliders); break;
      case 'water': { const g = new THREE.PlaneGeometry(o.size || 200, o.size || 200, 40, 40); g.rotateX(-Math.PI / 2);
        const m = new THREE.Mesh(g, psxify(new THREE.MeshPhongMaterial({ color: o.color || '#bfe9ef', shininess: 90, specular: '#ffffff', transparent: true, opacity: o.opacity ?? .78, map: tex(o.tex || 'water') })));
        m.material.map = m.material.map.clone(); m.material.map.needsUpdate = true; m.material.map.repeat.set((o.size || 200) / 6, (o.size || 200) / 6); m.position.set(o.x || 0, o.y || 0, o.z || 0); W.add(m); if (o.walk !== false) ground(o.x || 0, o.z || 0, o.size || 200, o.size || 200, o.y || 0); const base = g.attributes.position.array.slice();
        this.anim.push(t => { const a = g.attributes.position.array; for (let i = 0; i < a.length; i += 3) a[i + 1] = base[i + 1] + Math.sin(base[i] * .3 + t * .8) * .05 + Math.cos(base[i + 2] * .25 + t * .6) * .05; g.attributes.position.needsUpdate = true; });
        break; }
      case 'cloud': { const grp = new THREE.Group(); const cm = mat({ color: o.color || '#ffffff', emissive: o.glow || '#8a7a90' }); const n = o.puffs || 5;
        for (let i = 0; i < n; i++){ const s = (o.s || 1) * (0.55 + rng() * 0.5); const p = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 1), cm); p.position.set((i - n / 2) * (o.s || 1) * .6, rng() * .4 * (o.s || 1), (rng() - .5) * (o.s || 1) * .6); grp.add(p); }
        grp.position.set(o.x, o.y, o.z); W.add(grp); const ph = rng() * 6, sp = o.drift ?? .3; this.anim.push(t => { grp.position.y = o.y + Math.sin(t * .4 + ph) * .25; grp.position.x = o.x + Math.sin(t * .05 * sp + ph) * 2 * sp; }); mesh = grp; break; }
      case 'lamp': { const m = new THREE.Mesh(new THREE.BoxGeometry(o.w || 1.4, .08, o.d || .3), mat({ color: o.color || '#fffbe8', emissive: o.color || '#fff6d8', fog: true })); m.position.set(o.x, o.y, o.z); if (o.rot) m.rotation.y = o.rot; W.add(m);
        if (o.light){ const l = new THREE.PointLight(o.color || '#fff6f0', (o.intensity || 6) * .6, o.range || 10, 1.2); l.position.set(o.x, o.y - .3, o.z); W.add(l); }
        if (o.flicker){ const ph = rng() * 9; this.anim.push(t => { m.visible = Math.sin(t * 1.7 + ph) + Math.sin(t * 7.3 + ph * 2) > -1.6; }); } break; }
      default: { mesh = buildModel(o, rng, this.anim); if (!mesh) break; mesh.position.set(o.x || 0, o.y || 0, o.z || 0); if (o.rot) mesh.rotation.y = o.rot; if (o.scale) mesh.scale.setScalar(o.scale); W.add(mesh);
        if (o.reflect){ const rf = mesh.clone(); rf.scale.y *= -1; rf.position.y = (o.reflectY || 0) * 2 - mesh.position.y; rf.traverse(c => { if (c.material){ c.material = c.material.clone(); c.material.transparent = true; c.material.opacity = .35; c.material.side = THREE.DoubleSide; } }); W.add(rf); mesh.userData.reflection = rf; }
        if (o.solid) solid(o.x || 0, o.z || 0, o.solid[0], o.solid[1], 0, o.solidTop ?? 99);
        if (o.watch){ const m = mesh, cam = this.camera, spd = o.watch === true ? .25 : o.watch; this.anim.push((t, dt = .016) => { const want = Math.atan2(cam.position.x - m.position.x, cam.position.z - m.position.z); let dd = want - m.rotation.y; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); m.rotation.y += dd * Math.min(1, dt * spd); }); }
        if (o.flip){ mesh.rotation.z = Math.PI; mesh.position.y = o.y ?? 3; } }
    }
    if (o.link || o.goal || o.secret || o.text || o.touch || o.room || o.warp || o.loop || o.gaze){ things.push({ ...o, mesh, r: o.r || 1.3, id: o.id || `${o.type}@${o.x},${o.z}` }); }
    if (mesh && o.id) this.views.set(o.id, mesh);
  }
  corridor(o, col){ // straight hallway along +x or +z with walls, ceiling, lamps, optional pillars
    const len = o.len, wd = o.width || 3, h = o.height || 3, alongX = o.dir === 'x';
    const cx = o.x + (alongX ? len / 2 : 0), cz = o.z + (alongX ? 0 : len / 2);
    const fw = alongX ? len : wd, fd = alongX ? wd : len;
    this.add({ type: 'floor', x: cx, z: cz, w: fw, d: fd, tex: o.floor || 'carpet', color: o.floorColor }, col, [], Math.random);
    if (o.ceiling !== false){ const c = this.box({}, fw, .2, fd, mat({ tex: o.ceilTex || 'plain', color: o.ceilColor || '#f2ecf5' })); c.position.set(cx, h + .1, cz); this.world.add(c); }
    const gaps = o.gaps || []; // positions along length (0..len) left open on both sides: [{at, side:'l'|'r'|'b', w}]
    for (const side of [-1, 1]){
      let segs = [[0, len]]; for (const gp of gaps) if (gp.side === 'b' || (gp.side === 'l' ? -1 : 1) === side){ segs = segs.flatMap(([a, b]) => { const g0 = gp.at - (gp.w || 2) / 2, g1 = gp.at + (gp.w || 2) / 2; if (g1 <= a || g0 >= b) return [[a, b]]; return [[a, g0], [g1, b]].filter(s => s[1] - s[0] > .05); }); }
      for (const [a, b] of segs){ const L = b - a, mid = a + L / 2;
        const x = alongX ? o.x + mid : o.x + side * (wd / 2 + .1), z = alongX ? o.z + side * (wd / 2 + .1) : o.z + mid;
        this.add({ type: 'box', x, z, w: alongX ? L : .2, d: alongX ? .2 : L, h, tex: o.wallTex || 'wallpaper', color: o.wallColor }, col, [], Math.random); }
    }
    if (o.capStart) this.add({ type: 'box', x: alongX ? o.x - .1 : o.x, z: alongX ? o.z : o.z - .1, w: alongX ? .2 : wd, d: alongX ? wd : .2, h, tex: o.wallTex || 'wallpaper', color: o.wallColor }, col, [], Math.random);
    if (o.capEnd) this.add({ type: 'box', x: alongX ? o.x + len + .1 : o.x, z: alongX ? o.z : o.z + len + .1, w: alongX ? .2 : wd, d: alongX ? wd : .2, h, tex: o.wallTex || 'wallpaper', color: o.wallColor }, col, [], Math.random);
    const step = o.lampEvery || 6;
    for (let s = step / 2; s < len; s += step) this.add({ type: 'lamp', x: alongX ? o.x + s : o.x, z: alongX ? o.z : o.z + s, y: h - .05, rot: alongX ? 0 : Math.PI / 2, color: o.lampColor, light: o.lights && ((s / step) | 0) % 2 === 0, flicker: o.flicker && Math.random() < .2 }, col, [], Math.random);
  }
  room(o, col){ // walled room with optional door gaps [{wall:'n'|'s'|'e'|'w', at, w}]
    const { x, z, w, d } = o, h = o.height || 3.2;
    this.add({ type: 'floor', x, z, w, d, tex: o.floor, color: o.floorColor }, col, [], Math.random);
    if (o.ceiling !== false){ const c = this.box({}, w, .2, d, mat({ tex: o.ceilTex || 'plain', color: o.ceilColor || '#f5f0f8' })); c.position.set(x, h + .1, z); this.world.add(c); }
    const walls = { n: [x, z - d / 2, w, true], s: [x, z + d / 2, w, true], w: [x - w / 2, z, d, false], e: [x + w / 2, z, d, false] };
    for (const k in walls){ const [wx, wz, L, horiz] = walls[k]; let segs = [[-L / 2, L / 2]];
      for (const gp of (o.gaps || []).filter(g => g.wall === k)){ segs = segs.flatMap(([a, b]) => { const g0 = gp.at - (gp.w || 1.6) / 2, g1 = gp.at + (gp.w || 1.6) / 2; if (g1 <= a || g0 >= b) return [[a, b]]; return [[a, g0], [g1, b]].filter(s => s[1] - s[0] > .05); }); }
      for (const [a, b] of segs){ const m = (a + b) / 2, l = b - a; this.add({ type: 'box', x: horiz ? wx + m : wx, z: horiz ? wz : wz + m, w: horiz ? l : .2, d: horiz ? .2 : l, h, tex: o.wallTex || 'wallpaper', color: o.wallColor }, col, [], Math.random); }
    }
  }
  /** Sync remote/other player avatars (future multiplayer) */
  syncAvatars(state){ for (const p of state.players.values()){ if (p.isLocal) continue; let v = this.views.get(p.id); if (!v){ v = buildModel({ type: 'ghostfriend' }, Math.random, this.anim); this.world.add(v); this.views.set(p.id, v); } v.position.set(p.pos.x, 0, p.pos.z); v.rotation.y = p.yaw; } }
  frame(state, t, dt){
    psx.time.value = t; for (const f of this.anim) f(t, dt);
    const p = state.localPlayer; if (p){ const bob = p.grounded === false ? 0 : Math.sin(t * 7) * Math.min(p.moving || 0, 3) * .012;
      this.camera.position.set(p.pos.x, p.pos.y + p.height + bob, p.pos.z); this.camera.rotation.set(p.pitch, p.yaw, Math.sin(t * .35) * .01, 'YXZ'); }
    if (this.skyMesh) this.skyMesh.position.copy(this.camera.position);
    this.syncAvatars(state);
    this.r.setRenderTarget(this.rt); this.r.render(this.scene, this.camera);
    this.r.setRenderTarget(null); this.r.render(this.postScene, this.postCam);
  }
}
