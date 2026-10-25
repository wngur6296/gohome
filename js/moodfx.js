// Accumulated mood → look. Pure functions over the saved mood history (deterministic, multiplayer-safe).
import MOODS from '../chapters/moods.js';
export { MOODS };
/** Exponentially-weighted sum of every past dream's mood point, newest weighted most. */
export function moodProfile(history = []){
  const w = { calm: 0, sway: 0, familiar: 0, strange: 0 }; let norm = 0;
  history.forEach((m, i) => { const k = Math.pow(.82, history.length - 1 - i); norm += k;
    for (const id in MOODS){ const [ax, sg] = MOODS[id].axis; w[id] += Math.max(0, (m[ax] || 0) * sg) * k; } });
  const n = Math.max(1, norm); for (const id in w) w[id] /= n;
  let dominant = null, best = .08; for (const id in w) if (w[id] > best){ best = w[id]; dominant = id; }
  // level grows with both strength and number of dreams (accumulation), capped at 1
  const level = dominant ? Math.min(1, w[dominant] * 1.6 * Math.min(1, .35 + history.length * .13)) : 0;
  return { weights: w, dominant, level: +level.toFixed(2), def: dominant ? MOODS[dominant] : null };
}
