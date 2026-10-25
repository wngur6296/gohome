// Event / message bus. Every gameplay event flows through here so a network
// adapter can mirror them later (see README "멀티플레이 확장").
export class EventBus {
  constructor(){ this.h = new Map(); }
  on(type, fn){ (this.h.get(type) || this.h.set(type, new Set()).get(type)).add(fn); return () => this.off(type, fn); }
  off(type, fn){ this.h.get(type)?.delete(fn); }
  emit(type, payload = {}, meta = {}){
    const msg = { type, payload, meta: { t: performance.now(), local: true, ...meta } };
    for (const fn of this.h.get(type) || []) fn(payload, msg);
    for (const fn of this.h.get('*') || []) fn(payload, msg);
  }
}
export const bus = new EventBus();
