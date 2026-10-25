// Chapter 4 — 빈 놀이터. Strangeness starts to show: still figures, faces in the sky.
export default {
  id: 'ch4', order: 4, strangeness: .45, title: '빈 놀이터', subtitle: '네 번째 꿈', art: 'ch4', music: 'ch4',
  intro: ['해가 지지 않는 놀이터.', '그네에 앉으니 무릎이 땅에 닿는다. 나는 너무 커 버렸다.'],
  palette: { skyTop: '#9a88d0', skyMid: '#ffb894', skyBottom: '#f0c8c0', fog: '#e8b8b4', fogNear: 10, fogFar: 75, hemi: 1.0, sun: '#ffc8a0', sunI: .9, ground: '#c89a90', ambient: '#ffe0e0', ambientI: 1.1, hue: -.05 },
  spawn: { x: 0, z: 12, yaw: 0 },
  bounds: [-45, -80, 45, 30], next: 'ch5',
  strange: { spots: [[-20, -30], [22, -25], [-30, 0], [28, 5], [0, -50], [-12, -60], [14, -62]], whispers: ['그네는 혼자 타는 게 아니야.', '해는 아까부터 저 자리에 있다.', '모래 속에 뭔가 묻혀 있어.', '집에 갈 시간이야. 다들 그렇게 말했지.', '언제부터 아무도 데리러 오지 않게 됐을까.'] },
  objects: [
    { type: 'floor', x: 0, z: -25, w: 90, d: 110, tex: 'sand', color: '#f4dcc8', texRepeat: .5 },
    { type: 'sun', x: -30, y: 6, z: -170, r: 80, color: '#ffc0a0' },
    { type: 'text', x: 0, z: 6, r: 3, text: '저녁 먹으라는 소리가 들릴 것 같은 시간.', mood: [1, 1] },
    // sandbox (HIDDEN ROOM: stand still in it)
    { type: 'box', x: -8, z: -6, w: 5, h: .3, d: .3, tex: 'wood' }, { type: 'box', x: -8, z: -1, w: 5, h: .3, d: .3, tex: 'wood' }, { type: 'box', x: -10.5, z: -3.5, w: .3, h: .3, d: 5, tex: 'wood' }, { type: 'box', x: -5.5, z: -3.5, w: .3, h: .3, d: 5, tex: 'wood', solid: false },
    { type: 'floor', x: -8, z: -3.5, y: .05, w: 4.6, d: 4.6, tex: 'sand', color: '#fff0d8' },
    { type: 'zone', x: -8, z: -3.5, r: 1.8, still: 8, room: 'ch4_classroom', warp: { x: 200, z: 6, yaw: 0 }, text: '발이 모래 속으로 천천히 가라앉는다. 무섭지 않다.' },
    { type: 'swing', x: 8, z: -8, r: 1.4, text: '그네가 흔들린다. 바람은 불지 않는다.', mood: [0, 2] },
    { type: 'swing', x: 11, z: -8 },
    { type: 'slide', x: 4, z: -22, rot: .4, r: 2, text: '미끄럼틀이 끝없이 길다. 예전엔 이게 세상에서 제일 높았다.', mood: [0, 1] },
    { type: 'tree', x: -20, z: -18, color: '#ffb8c8' }, { type: 'tree', x: 18, z: -36, color: '#c8b8ff' }, { type: 'tree', x: -26, z: -44 },
    { type: 'box', x: 0, z: -78, w: 90, h: 1.2, d: .15, color: '#f0f0ff' }, { type: 'box', x: -44, z: -25, w: .15, h: 1.2, d: 110, color: '#f0f0ff' }, { type: 'box', x: 44, z: -25, w: .15, h: 1.2, d: 110, color: '#f0f0ff' },
    { type: 'lamppost', x: -2, z: -30 }, { type: 'lamppost', x: 2, z: -40 }, { type: 'lamppost', x: -2, z: -50 }, { type: 'lamppost', x: 2, z: -60 },
    { type: 'watcher', x: 16, z: -14, h: 2.6, watch: .1, r: 1.3, text: '키 큰 형체가 놀이터를 지키고 있다. 어릴 때 어른들은 늘 저렇게 커 보였다. 이제는 나도 그만큼 크다.', mood: [0, 2] },
    { type: 'sign', x: 38, z: 20, rot: -.8, r: 1.4, secret: 'ch4_sign', text: '표지판: "집 →" 화살표가 하늘을 가리키고 있다.', mood: [0, 2] },
    { type: 'skyface', x: 20, y: 40, z: -110, s: 70, opacity: .55 },
    // JUMP: a low fence stands between you and the door
    { type: 'box', x: 0, z: -62, w: 88, h: .85, d: .3, color: '#f8f0ff' },
    { type: 'text', x: 0, z: -58, r: 3, text: '낮은 울타리. 어릴 땐 이걸 넘으면 혼났었다. 이제는 아무도 혼내지 않는다.', mood: [1, 1] },
    // JUMP (optional): climb the play tower — HIDDEN ROOM
    { type: 'platform', style: 'wood', x: 14, y: .7, z: -30, w: 1.4, d: 1.4, color: '#ffd8a0' },
    { type: 'platform', style: 'wood', x: 15.8, y: 1.4, z: -31.8, w: 1.4, d: 1.4, color: '#a0d8ff' },
    { type: 'platform', style: 'wood', x: 17.4, y: 2.1, z: -30, w: 1.4, d: 1.4, color: '#ffb8d0' },
    { type: 'platform', style: 'wood', x: 19, y: 2.8, z: -27.6, w: 2.6, d: 2.6, color: '#fff0c0' },
    { type: 'pillar', x: 19, z: -27.6, h: 2.6, color: '#c8b8e8' },
    { type: 'orb', x: 19, z: -27.6, y: 4, color: '#ffe0c0', r: 1.1, room: 'ch4_tower', text: '기억의 조각 · 놀이탑 꼭대기. 여기서 우리 집 지붕이 보였다. 지금은 안개뿐이지만, 방향은 기억난다.' },
    { type: 'door', id: 'goal4', x: 0, z: -70, glow: '#ffd8c0', goal: true, r: 1.6, text: '놀이터 끝, 문 하나가 혼자 서 있다. 아이 키 높이에 손자국이 있다.' },
    // hidden room: classroom under the sand
    { type: 'room', x: 200, z: 0, w: 12, d: 14, height: 3, floor: 'wood', wallColor: '#f0f4e8', ceilColor: '#f4f0f8', wallTex: 'wallpaper' },
    { type: 'box', x: 200, z: -6.8, w: 6, h: 1.8, d: .1, y: .8, color: '#3a5a4a', solid: false },
    { type: 'table', x: 198, z: -2, scale: .8 }, { type: 'table', x: 202, z: -2, scale: .8 }, { type: 'table', x: 198, z: 1.5, scale: .8 }, { type: 'table', x: 202, z: 1.5, scale: .8 },
    { type: 'chair', x: 198, z: -1.2 }, { type: 'chair', x: 202, z: -1.2 }, { type: 'chair', x: 198, z: 2.3 }, { type: 'chair', x: 202, z: 2.3, flip: true, y: 2.8 },
    { type: 'orb', x: 200, z: -5.5, y: 1.3, color: '#e8ffd8', r: 1.2, room: 'ch4_classroom', text: '기억의 조각 · 칠판에 "오늘의 숙제: 커서 되고 싶은 것". 다 커 버렸는데, 나는 아직 그 숙제를 끝내지 못했다.' },
    { type: 'door', x: 200, z: 6.8, rot: Math.PI, glow: '#ffe8d0', r: 1, warp: { x: -8, z: 3, yaw: Math.PI }, text: '모래 위로.' },
  ],
  mutations: [
    { when: { dayMod: [2, 0] }, add: [{ type: 'sheep', x: 6, z: -12, wander: 4, speed: .3, r: 1.2, text: '양이 그네를 기다린다.', mood: [1, 1] }] },
    { when: { dayMin: 5 }, add: [{ type: 'watcher', x: 0, z: -66, h: 3.2, watch: .08 }], text: '문 옆에 누군가 서 있다. 아까는 없었다.' },
  ],
};
