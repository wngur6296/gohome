// Input abstraction: devices write into a Command; the sim only sees Commands.
export function emptyCommand(){ return { moveX: 0, moveY: 0, lookX: 0, lookY: 0, run: false, jump: false, jumpHeld: false }; }
export class InputManager {
  constructor(el, joyEl, jumpEl){
    this.cmd = emptyCommand(); this.lookAcc = { x: 0, y: 0 }; this.keys = new Set(); this.sens = 0.0055;
    this.joy = { id: null, x: 0, y: 0, ox: 0, oy: 0 }; this.look = { id: null, x: 0, y: 0 }; this.joyEl = joyEl; this.enabled = false;
    const opts = { passive: false }; this.jumpQ = false; this.jumpHeld = false;
    if (jumpEl){ // dedicated jump button: own touch handling, never becomes a look-drag
      const down = e => { e.preventDefault(); e.stopPropagation(); if (!this.enabled) return; this.jumpQ = true; this.jumpHeld = true; jumpEl.classList.add('press'); };
      const up = e => { e.preventDefault(); e.stopPropagation(); this.jumpHeld = false; jumpEl.classList.remove('press'); };
      jumpEl.addEventListener('touchstart', down, opts); jumpEl.addEventListener('touchend', up, opts); jumpEl.addEventListener('touchcancel', up, opts);
      jumpEl.addEventListener('mousedown', down); jumpEl.addEventListener('mouseup', up); }
    addEventListener('keydown', e => { if (e.code === 'Space'){ if (!e.repeat && this.enabled) this.jumpQ = true; this.jumpHeld = true; e.preventDefault(); } });
    addEventListener('keyup', e => { if (e.code === 'Space') this.jumpHeld = false; });
    el.addEventListener('touchstart', e => this.ts(e), opts);
    el.addEventListener('touchmove', e => this.tm(e), opts);
    el.addEventListener('touchend', e => this.te(e), opts);
    el.addEventListener('touchcancel', e => this.te(e), opts);
    addEventListener('keydown', e => this.keys.add(e.code)); addEventListener('keyup', e => this.keys.delete(e.code));
    el.addEventListener('mousedown', e => { this.mdown = true; this.mx = e.clientX; this.my = e.clientY; });
    addEventListener('mouseup', () => this.mdown = false);
    addEventListener('mousemove', e => { if (!this.mdown) return; this.lookAcc.x += (e.clientX - this.mx) * this.sens; this.lookAcc.y += (e.clientY - this.my) * this.sens; this.mx = e.clientX; this.my = e.clientY; });
  }
  ts(e){ e.preventDefault(); if (!this.enabled) return;
    for (const t of e.changedTouches){
      if (t.clientX < innerWidth * 0.45 && this.joy.id === null){ Object.assign(this.joy, { id: t.identifier, ox: t.clientX, oy: t.clientY, x: 0, y: 0 }); this.showJoy(true, t.clientX, t.clientY); }
      else if (this.look.id === null){ Object.assign(this.look, { id: t.identifier, x: t.clientX, y: t.clientY }); }
    } }
  tm(e){ e.preventDefault();
    for (const t of e.changedTouches){
      if (t.identifier === this.joy.id){ let dx = t.clientX - this.joy.ox, dy = t.clientY - this.joy.oy; const m = Math.hypot(dx, dy), R = 55; if (m > R){ dx *= R / m; dy *= R / m; } this.joy.x = dx / R; this.joy.y = dy / R; this.moveKnob(dx, dy); }
      else if (t.identifier === this.look.id){ this.lookAcc.x += (t.clientX - this.look.x) * this.sens; this.lookAcc.y += (t.clientY - this.look.y) * this.sens; this.look.x = t.clientX; this.look.y = t.clientY; }
    } }
  te(e){ for (const t of e.changedTouches){ if (t.identifier === this.joy.id){ this.joy.id = null; this.joy.x = this.joy.y = 0; this.showJoy(false); } if (t.identifier === this.look.id) this.look.id = null; } }
  showJoy(v, x, y){ const j = this.joyEl; if (!j) return; j.classList.toggle('on', v); if (v){ j.style.left = x + 'px'; j.style.top = y + 'px'; this.moveKnob(0, 0); } }
  moveKnob(dx, dy){ const k = this.joyEl?.firstElementChild; if (k) k.style.transform = `translate(${dx}px,${dy}px)`; }
  /** Produce this frame's command for the local player. */
  poll(){
    const c = this.cmd, k = this.keys;
    let mx = this.joy.x, my = -this.joy.y;
    if (k.has('KeyW') || k.has('ArrowUp')) my += 1; if (k.has('KeyS') || k.has('ArrowDown')) my -= 1;
    if (k.has('KeyA')) mx -= 1; if (k.has('KeyD')) mx += 1;
    if (k.has('ArrowLeft')) this.lookAcc.x -= 0.035; if (k.has('ArrowRight')) this.lookAcc.x += 0.035;
    const m = Math.hypot(mx, my); if (m > 1){ mx /= m; my /= m; }
    c.moveX = this.enabled ? mx : 0; c.moveY = this.enabled ? my : 0;
    c.lookX = this.enabled ? this.lookAcc.x : 0; c.lookY = this.enabled ? this.lookAcc.y : 0; this.lookAcc.x = this.lookAcc.y = 0;
    c.jump = this.enabled && this.jumpQ; this.jumpQ = false; c.jumpHeld = this.jumpHeld || k.has('Space');
    c.run = k.has('ShiftLeft') || Math.hypot(this.joy.x, this.joy.y) > 0.95;
    return c;
  }
  reset(){ this.joy.id = this.look.id = null; this.joy.x = this.joy.y = 0; this.showJoy(false); }
}
