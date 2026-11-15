// Endings: data + tiny procedural pixel scenes (drawn at 240×160, scaled up nearest-neighbour for the PS1 look).
// To add an ending: add an entry here and a condition in pickEnding (main.js). Conditions are documented in SECRETS.md.
const W = 240, H = 160;
const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x | 0, y | 0, Math.max(1, w | 0), Math.max(1, h | 0)); };
function sky(g, top, bot){ const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function stars(g, t, n = 40, c = '255,250,220'){ let s = 9; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < n; i++){ const x = r() * W, y = r() * H * .6, a = .4 + .6 * Math.abs(Math.sin(t * (.5 + r()) + i)); px(g, x, y, 1, 1, `rgba(${c},${a})`); } }
function person(g, x, y, h, c, child){ const hw = child ? h * .2 : h * .13, head = child ? h * .2 : h * .12; px(g, x - hw, y - h + head * 2, hw * 2, h - head * 2 - h * .25, c); px(g, x - hw * .8, y - h * .25, hw * .6, h * .25, c); px(g, x + hw * .2, y - h * .25, hw * .6, h * .25, c);
  g.fillStyle = c; g.beginPath(); g.arc(x, y - h + head, head, 0, 7); g.fill(); }
function glowAt(g, x, y, r, c){ const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
function dither(g){ const d = g.getImageData(0, 0, W, H), a = d.data; for (let i = 0; i < a.length; i += 4){ const k = ((i / 4) % W + ((i / 4 / W) | 0)) % 2 ? 3 : -3; a[i] = (a[i] + k) & 0xf8; a[i + 1] = (a[i + 1] + k) & 0xf8; a[i + 2] = (a[i + 2] + k) & 0xf8; } g.putImageData(d, 0, 0); }
export const ENDINGS = [
  { id: 'home', title: '집으로', hint: '마지막 꿈의 현관문을 열기',
    lines: ['현관문을 열자 따뜻한 불빛이 쏟아졌다.', '"왔구나."', '키는 문틀보다 커졌지만, 그 목소리 앞에서 나는 여전히 아이였다.', '어른인 나도, 아이인 나도. 둘 다 집에 돌아왔다.'],
    draw(g, t){ sky(g, '#3a2a5a', '#a07aa8'); stars(g, t, 30); px(g, 0, 120, W, 40, '#5a4060'); px(g, 70, 30, 100, 92, '#e8d0c0'); px(g, 98, 52, 44, 70, '#ffd8a0'); glowAt(g, 120, 90, 70 + Math.sin(t) * 3, 'rgba(255,210,150,.55)');
      g.fillStyle = 'rgba(255,215,160,.35)'; g.beginPath(); g.moveTo(98, 122); g.lineTo(142, 122); g.lineTo(190, 160); g.lineTo(50, 160); g.fill(); person(g, 120, 122, 46, '#3a2840'); person(g, 128, 160, 24, 'rgba(58,40,64,.55)', true); } },
  { id: 'calm', title: '불 켜진 부엌', hint: '고요하거나 익숙한 마음을 오래 쌓은 채 집에 돌아가기',
    lines: ['부엌에 불이 켜져 있다. 밥 짓는 냄새가 난다.', '식탁에는 수저가 두 벌. 하나는 어른 것, 하나는 아이 것.', '어느 자리에 앉아야 할지 몰라 잠시 서 있었다.', '"아무 데나 앉아. 다 네 자리야."', '오늘 밤은 깨지 않고 푹 잘 수 있을 것 같다.'],
    draw(g, t){ sky(g, '#f4e0c8', '#e8c8a8'); px(g, 0, 110, W, 50, '#c8a080'); px(g, 30, 20, 60, 50, '#a8c8e8'); px(g, 58, 20, 4, 50, '#e8d0b8'); px(g, 30, 43, 60, 4, '#e8d0b8'); glowAt(g, 120, 40, 60, 'rgba(255,230,170,.7)'); px(g, 118, 0, 4, 30, '#806050'); px(g, 108, 28, 24, 10, '#fff0c8');
      px(g, 70, 92, 100, 8, '#a07050'); px(g, 76, 100, 6, 30, '#806040'); px(g, 158, 100, 6, 30, '#806040'); for (const x of [95, 140]){ px(g, x, 84, 14, 8, '#fff8f0'); for (let i = 0; i < 3; i++){ const y = 80 - ((t * 10 + i * 9) % 26); px(g, x + 4 + Math.sin(t * 2 + i + y * .2) * 3, y, 2, 3, `rgba(255,255,255,${(y - 54) / 30})`); } }
      px(g, 60, 70, 4, 60, '#906850'); px(g, 50, 100, 20, 5, '#906850'); px(g, 178, 96, 3, 34, '#906850'); px(g, 172, 108, 14, 4, '#906850'); } },
  { id: 'strange', title: '창문이 하나 더 많은 집', hint: '기묘하거나 일렁이는 마음을 오래 쌓은 채 집에 돌아가기',
    lines: ['집에 도착했다. 분명히 우리 집이다.', '그런데 창문이 하나 더 많다. 그 창문에만 불이 켜져 있다.', '창문 안의 아이가 나를 보고 손을 흔든다. 나는 그 아이의 이름을 안다.', '문을 두드리자, 안에서 내 목소리가 대답한다. "누구세요?"', '…나는 아직 이 꿈에서 나갈 준비가 되지 않았다.'],
    draw(g, t){ sky(g, '#2a1a4a', '#c07ab0'); stars(g, t, 50, '230,220,255'); g.fillStyle = 'rgba(255,240,255,.12)'; g.beginPath(); g.ellipse(190, 40, 30, 18, 0, 0, 7); g.fill(); px(g, 180, 36, 3, 5, 'rgba(60,40,80,.35)'); px(g, 198, 36, 3, 5, 'rgba(60,40,80,.35)');
      px(g, 0, 128, W, 32, '#3a2a4a'); px(g, 60, 40, 120, 88, '#d8c8d8'); g.fillStyle = '#8a6a8a'; g.beginPath(); g.moveTo(52, 42); g.lineTo(120, 8); g.lineTo(188, 42); g.fill();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++){ const lit = r === 1 && c === 2; px(g, 70 + c * 27, 50 + r * 24, 16, 14, lit ? '#ffe0a0' : '#4a3a5a'); if (lit){ glowAt(g, 132 + 8, 62 + 7, 24, 'rgba(255,220,150,.5)'); person(g, 140, 64, 10 + Math.sin(t * 2) * .5, '#5a3a4a', true); } }
      px(g, 112, 104, 16, 24, '#6a4a5a'); person(g, 120, 152, 34, '#1a1028'); } },
  { id: 'sleep', title: '아이처럼 잠들기', hint: '마지막 꿈, 작아진 내 방에서 다시 잠들기',
    lines: ['작아진 침대에 몸을 웅크렸다. 무릎이 이불 밖으로 삐져나온다.', '천장의 야광별이 하나씩 켜진다.', '누군가 문틈으로 "잘 자" 하고 말했다.', '어른이 되는 건 내일 해도 괜찮겠지.', '꿈속에서, 나는 다시 아이로 잠들었다.'],
    draw(g, t){ sky(g, '#1a1838', '#2a2450'); let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 24; i++){ const x = r() * W, y = r() * 60, on = (t * .8) % 8 > i * .3; if (on){ glowAt(g, x, y, 5, 'rgba(200,255,200,.5)'); px(g, x, y, 2, 2, '#e0ffd0'); } }
      px(g, 200, 40, 30, 100, '#2a2648'); px(g, 200, 40, 3, 100, `rgba(255,220,160,${.6 + Math.sin(t) * .1})`); px(g, 0, 130, W, 30, '#3a3058'); px(g, 50, 104, 110, 26, '#c8b8f0'); px(g, 40, 92, 14, 38, '#8a78b8');
      px(g, 60, 98, 70, 12, '#e8d8ff'); g.fillStyle = '#e8d8ff'; g.beginPath(); g.arc(68, 96, 9, 0, 7); g.fill(); px(g, 150, 104, 26, 8, '#f0d8c8'); px(g, 170, 106, 8, 10, '#f0d8c8'); } },
  { id: 'threshold', title: '문 앞에서', hint: '마지막 꿈의 현관문 앞에서 서두르지 않기',
    lines: ['문을 열지 않았다. 문 앞에 앉아 등을 기댔다.', '문 너머에서 텔레비전 소리, 그릇 부딪히는 소리, 웃음소리.', '들어가지 않아도, 거기 있다는 걸 아는 것만으로 충분했다.', '"천천히 와도 돼." 문 너머의 목소리가 말했다.', '나는 조금 더 여기 있기로 했다.'],
    draw(g, t){ sky(g, '#4a3a5a', '#6a5068'); px(g, 0, 124, W, 36, '#3a2a3a'); px(g, 84, 20, 72, 104, '#a07a6a'); px(g, 90, 26, 60, 96, '#c8a090'); px(g, 140, 72, 4, 4, '#e8c56a'); glowAt(g, 120, 124, 50, `rgba(255,210,150,${.45 + Math.sin(t * 1.3) * .08})`); px(g, 90, 121, 60, 3, '#ffe0b0');
      px(g, 104, 96, 20, 18, '#2a1a2a'); g.fillStyle = '#2a1a2a'; g.beginPath(); g.arc(114, 90, 7, 0, 7); g.fill(); px(g, 120, 108, 26, 8, '#2a1a2a'); px(g, 150, 118, 10, 5, '#ff9ab8'); px(g, 162, 118, 10, 5, '#ff9ab8'); } },
  { id: 'frags', title: '모든 조각', hint: '모든 기억의 조각을 모은 채 집에 돌아가기',
    lines: ['주머니 속 기억의 조각들이 따뜻해진다.', '조각들이 모여 작은 아이가 되었다. 아이가 내 손을 잡는다.', '"기억해 줘서 고마워. 나 계속 여기 있었어."', '우리는 나란히 언덕을 넘었다. 언덕 너머에 우리 집 불빛이 보였다.', '이제 나는 혼자 집에 가지 않는다.'],
    draw(g, t){ sky(g, '#6a5aa8', '#ffc8b0'); stars(g, t, 20); g.fillStyle = '#5a4a78'; g.beginPath(); g.ellipse(120, 175, 170, 60, 0, 0, 7); g.fill(); px(g, 196, 104, 14, 10, '#d8c8d8'); px(g, 200, 107, 4, 4, '#ffe0a0'); glowAt(g, 202, 108, 14, 'rgba(255,220,150,.6)');
      person(g, 108, 128, 40, '#2a2040'); person(g, 124, 128, 22, '#2a2040', true); px(g, 112, 108, 10, 2, '#2a2040');
      for (let i = 0; i < 14; i++){ const a = i * .45 + t * .3, x = 116 + Math.cos(a) * (30 + i * 2), y = 90 - ((t * 6 + i * 11) % 80); glowAt(g, x, y, 5, 'rgba(255,240,200,.6)'); px(g, x, y, 2, 2, '#fffaf0'); } } },
  { id: 'true', title: '어른인 채로, 아이인 채로', hint: '숨겨진 방을 모두 찾고, 다른 엔딩을 셋 이상 보고, 집 열쇠를 가진 채 집에 돌아가기', true: true,
    lines: ['열쇠를 돌리자, 문이 아니라 아침이 열렸다.', '모든 꿈의 방이 한 집 안에 있었다. 복도도, 바다도, 놀이터도, 정거장도. 전부 우리 집의 방이었다.', '어린 내가 앞장서서 걷고, 나는 그 뒤를 따라 걷는다.', '"이제 깨어나도 돼. 나는 네 안에 있을게."', '눈을 뜨니 아침이다. 마음은 여전히 조금 어리고, 그래서 괜찮다.'],
    draw(g, t){ const k = Math.min(1, t / 12); sky(g, `rgb(${120 + 135 * k | 0},${150 + 90 * k | 0},${220 - 20 * k | 0})`, '#fff0d0'); glowAt(g, 120, 118, 120, `rgba(255,240,200,${.5 + k * .4})`); px(g, 0, 118, W, 42, '#c8e0b0');
      px(g, 104, 58, 32, 60, '#fffaf0'); px(g, 100, 56, 40, 4, '#e8d0b8'); px(g, 100, 56, 4, 62, '#e8d0b8'); px(g, 136, 56, 4, 62, '#e8d0b8'); const w = (t * 3) % 30; person(g, 118 - w * .2, 140 - w * .3, 26 - w * .3, '#4a3a5a', true); person(g, 100 - w * .2, 150 - w * .3, 44 - w * .4, '#3a2a4a');
      for (let i = 0; i < 18; i++){ const x = (i * 37 + t * 4) % W, y = 110 - ((t * 8 + i * 13) % 110); px(g, x, y, 2, 2, 'rgba(255,255,255,.7)'); } } },
];
/** Draws ending `id` into canvas `c` with time t (seconds). */
export function drawEnding(c, id, t){ const e = ENDINGS.find(x => x.id === id); if (!e) return; c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; e.draw(g, t); dither(g); }
