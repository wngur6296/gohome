// Networking adapter interface. Only LocalAdapter ships now (single player).
// A future WebSocketAdapter / WebRTCAdapter implements the same methods.
export class NetAdapter {
  /** @returns {Promise<{peerId:string}>} */ async connect(_room){ throw new Error('not implemented'); }
  send(_msg){} /** broadcast a serialisable message */
  onMessage(_fn){} /** subscribe to remote messages */
  disconnect(){}
  get isMultiplayer(){ return false; }
}
export class LocalAdapter extends NetAdapter {
  constructor(){ super(); this.fns = []; this.peerId = 'local-' + Math.random().toString(36).slice(2, 8); }
  async connect(){ return { peerId: this.peerId }; }
  send(msg){ /* loopback disabled: local state is already authoritative */ void msg; }
  onMessage(fn){ this.fns.push(fn); }
}
// Messages that should be replicated when a real adapter is plugged in.
export const REPLICATED = ['player:state', 'player:join', 'player:leave', 'scene:link', 'object:touch', 'secret:found'];
