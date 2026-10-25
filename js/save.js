// Save system: one live profile + manual slots (1..3) + autosave (slot 0) + export/import code.
const KEY = 'gohome.save.v1', SLOT = n => 'gohome.slot.' + n;
const def = () => ({ day: 0, unlocked: ['ch1'], visited: {}, secrets: [], rooms: [], moods: [], settings: { ps1: true, volume: 0.8, sens: 1 }, cleared: [] });
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } }, del: k => { try { localStorage.removeItem(k); } catch {} } };
export const SLOTS = [0, 1, 2, 3];
export const save = {
  data: def(),
  load(){ try { this.data = Object.assign(def(), JSON.parse(ls.get(KEY) || '{}')); } catch { this.data = def(); } return this.data; },
  write(){ ls.set(KEY, JSON.stringify(this.data)); },
  replace(d){ const s = this.data.settings; for (const k of Object.keys(this.data)) delete this.data[k]; Object.assign(this.data, def(), d, { settings: s }); this.write(); },
  reset(){ this.replace(def()); },
  unlock(id){ if (!this.data.unlocked.includes(id)) { this.data.unlocked.push(id); this.write(); return true; } return false; },
  secret(id){ if (!this.data.secrets.includes(id)) { this.data.secrets.push(id); this.write(); return true; } return false; },
  room(id){ if (!this.data.rooms.includes(id)) { this.data.rooms.push(id); this.write(); return true; } return false; },
  /** where = { scene, pos:{x,z}, yaw, title } */
  saveSlot(n, where){ const rec = { v: 1, savedAt: Date.now(), where, profile: JSON.parse(JSON.stringify({ ...this.data, settings: undefined })) }; return ls.set(SLOT(n), JSON.stringify(rec)); },
  readSlot(n){ try { return JSON.parse(ls.get(SLOT(n)) || 'null'); } catch { return null; } },
  deleteSlot(n){ ls.del(SLOT(n)); },
  loadSlot(n){ const r = this.readSlot(n); if (!r) return null; this.replace(r.profile); return r.where; },
  exportCode(){ const all = { app: 'gohome', v: 1, profile: this.data, slots: Object.fromEntries(SLOTS.map(n => [n, this.readSlot(n)])) };
    return 'GOHOME1:' + btoa(unescape(encodeURIComponent(JSON.stringify(all)))); },
  importCode(code){ const raw = String(code).trim().replace(/^GOHOME1:/, ''); const all = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (all.app !== 'gohome') throw new Error('Go Home 기록이 아니에요');
    for (const n of SLOTS){ const s = all.slots?.[n]; if (s) ls.set(SLOT(n), JSON.stringify(s)); } this.replace(all.profile || {}); return true; },
};
