// Pure game state / entity model. No three.js here — renderer reads this.
import { bus } from './bus.js';
let nextId = 1;
export class Entity {
  constructor(kind, data = {}){ this.id = data.id || `${kind}-${nextId++}`; this.kind = kind; Object.assign(this, data); }
}
export class Player extends Entity {
  constructor(id, isLocal = true){
    super('player', { id });
    this.isLocal = isLocal; this.pos = { x: 0, y: 0, z: 0 }; this.yaw = 0; this.pitch = 0;
    this.vel = { x: 0, z: 0 }; this.vy = 0; this.grounded = true; this.coyote = 0; this.jumpBuf = 0; this.safe = null; this.radius = 0.35; this.height = 1.55; this.stepDist = 0;
  }
  snapshot(){ return { id: this.id, pos: { ...this.pos }, yaw: this.yaw, pitch: this.pitch }; }
  applySnapshot(s){ Object.assign(this.pos, s.pos); this.yaw = s.yaw; this.pitch = s.pitch; }
}
export class GameState {
  constructor(){ this.players = new Map(); this.entities = new Map(); this.sceneId = null; this.colliders = []; this.grounds = []; this.killY = -6; this.time = 0; this.dream = null; }
  addPlayer(p){ this.players.set(p.id, p); bus.emit('player:join', { id: p.id, local: p.isLocal }); return p; }
  removePlayer(id){ this.players.delete(id); bus.emit('player:leave', { id }); }
  get localPlayer(){ for (const p of this.players.values()) if (p.isLocal) return p; }
  clearScene(){ this.entities.clear(); this.colliders = []; this.grounds = []; }
  addEntity(e){ this.entities.set(e.id, e); return e; }
}
// Moving platforms: pure function of time so every client computes the same position.
export function platformOffset(m, t){ if (!m) return ZERO; const v = Math.sin(t * (m.speed || .5) + (m.phase || 0)) * (m.amp || 1);
  return m.axis === 'x' ? { x: v, y: 0, z: 0 } : m.axis === 'z' ? { x: 0, y: 0, z: v } : { x: 0, y: v, z: 0 }; }
const ZERO = { x: 0, y: 0, z: 0 };
export const PHYS = { gravity: 12, fallGravity: 7.5, jumpV: 5.6, maxFall: 8, coyote: .16, buffer: .16, step: .38 };
/** Highest walkable surface under (x,z) not above maxY. Returns {top, g} or null. */
export function groundAt(state, x, z, maxY, t){
  let best = null, bt = -1e9; const e = .12;
  for (const g of state.grounds){ const o = g.move ? platformOffset(g.move, t) : ZERO;
    if (x >= g.minX + o.x - e && x <= g.maxX + o.x + e && z >= g.minZ + o.z - e && z <= g.maxZ + o.z + e){ const top = g.top + o.y; if (top <= maxY && top > bt){ bt = top; best = g; } } }
  for (const c of state.colliders){ if (c.maxY == null || c.maxY > 50) continue;
    if (x >= c.minX - e && x <= c.maxX + e && z >= c.minZ - e && z <= c.maxZ + e && c.maxY <= maxY && c.maxY > bt){ bt = c.maxY; best = c; } }
  return best ? { top: bt, g: best } : null;
}
// Simulation step, identical for every player (local input or remote command).
const tmp = { x: 0, z: 0 };
export function stepPlayer(state, p, cmd, dt){
  p.yaw -= cmd.lookX; p.pitch = Math.max(-1.2, Math.min(1.2, p.pitch - cmd.lookY));
  const s = Math.sin(p.yaw), c = Math.cos(p.yaw);
  const speed = cmd.run ? 4.2 : 2.6;
  tmp.x = (-s * cmd.moveY + c * cmd.moveX) * speed; tmp.z = (-c * cmd.moveY - s * cmd.moveX) * speed;
  const k = 1 - Math.exp(-dt * 8);
  p.vel.x += (tmp.x - p.vel.x) * k; p.vel.z += (tmp.z - p.vel.z) * k;
  const ox = p.pos.x, oz = p.pos.z, t = state.time;
  // ride moving platforms
  if (p.grounded && p.groundRef?.move){ const a = platformOffset(p.groundRef.move, t - dt), b2 = platformOffset(p.groundRef.move, t); p.pos.x += b2.x - a.x; p.pos.z += b2.z - a.z; p.pos.y += b2.y - a.y; }
  p.pos.x += p.vel.x * dt; collide(state, p);
  p.pos.z += p.vel.z * dt; collide(state, p);
  // vertical: gravity, coyote time, jump buffer, soft dreamy fall
  const P = PHYS; p.jumpBuf = cmd.jump ? P.buffer : Math.max(0, p.jumpBuf - dt); p.coyote = p.grounded ? P.coyote : Math.max(0, p.coyote - dt);
  if (p.jumpBuf > 0 && p.coyote > 0){ p.vy = P.jumpV; p.grounded = false; p.coyote = 0; p.jumpBuf = 0; bus.emit('player:jump', { id: p.id }); }
  const gnd = groundAt(state, p.pos.x, p.pos.z, p.pos.y + P.step, t);
  if (p.grounded && gnd && p.pos.y - gnd.top < P.step && p.vy <= 0){ p.pos.y = gnd.top; p.vy = 0; p.groundRef = gnd.g; }
  else {
    p.grounded = false; p.groundRef = null;
    p.vy -= (p.vy > 0 ? (cmd.jumpHeld ? P.gravity * .8 : P.gravity * 1.25) : P.fallGravity) * dt; p.vy = Math.max(p.vy, -P.maxFall);
    const ny = p.pos.y + p.vy * dt;
    if (gnd && p.vy <= 0 && ny <= gnd.top){ const impact = -p.vy; p.pos.y = gnd.top; p.vy = 0; p.grounded = true; p.groundRef = gnd.g; if (impact > 2) bus.emit('player:land', { id: p.id, v: impact }); }
    else p.pos.y = ny;
  }
  if (p.grounded && !p.groundRef?.move && !p.groundRef?.noSafe){ const sx = p.pos.x, sz = p.pos.z; // remember last safe spot (with some margin from edges)
    if (groundAt(state, sx + .5, sz, p.pos.y + .05, t) && groundAt(state, sx - .5, sz, p.pos.y + .05, t) && groundAt(state, sx, sz + .5, p.pos.y + .05, t) && groundAt(state, sx, sz - .5, p.pos.y + .05, t)) p.safe = { x: sx, y: p.pos.y, z: sz, yaw: p.yaw }; }
  if (p.pos.y < state.killY && !p.falling){ p.falling = true; bus.emit('player:fall', { id: p.id }); }
  const d = Math.hypot(p.pos.x - ox, p.pos.z - oz); if (p.grounded) p.stepDist += d;
  if (p.stepDist > 1.1){ p.stepDist = 0; bus.emit('player:step', { id: p.id }); }
  p.moving = d / Math.max(dt, 1e-4);
  const b = state.bounds; if (b){ p.pos.x = Math.max(b[0], Math.min(b[2], p.pos.x)); p.pos.z = Math.max(b[1], Math.min(b[3], p.pos.z)); }
}
function collide(state, p){
  for (const c of state.colliders){
    if (c.maxY != null && (p.pos.y >= c.maxY - PHYS.step || p.pos.y + p.height <= c.minY)) continue;
    const cx = Math.max(c.minX, Math.min(p.pos.x, c.maxX)), cz = Math.max(c.minZ, Math.min(p.pos.z, c.maxZ));
    const dx = p.pos.x - cx, dz = p.pos.z - cz, d2 = dx * dx + dz * dz;
    if (d2 < p.radius * p.radius){
      if (d2 < 1e-8){ p.pos.x += p.radius; continue; }
      const d = Math.sqrt(d2), push = (p.radius - d) / d; p.pos.x += dx * push; p.pos.z += dz * push;
    }
  }
}
