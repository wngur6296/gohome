// Chapter 6 — 뒤집힌 거실. Upside-down furniture, doors to nowhere, a room that loops into itself.
export default {
  id: 'ch6', order: 6, strangeness: .7, title: '뒤집힌 거실', subtitle: '여섯 번째 꿈', art: 'ch6', music: 'ch6',
  intro: ['거실이다. 우리 집 거실과 거의 똑같다.', '거의. 어른이 되어 돌아온 집은 늘 조금씩 뒤집혀 보였다.'],
  palette: { skyTop: '#c8b8e8', skyMid: '#e8d0e8', skyBottom: '#d8c8e0', fog: '#d8c8e0', fogNear: 5, fogFar: 32, hemi: 1.0, sun: '#ffe8d8', sunI: .5, ground: '#b8a8c8', ambient: '#f8e8f0', ambientI: 1.3, hue: .08 },
  spawn: { x: 0, z: 5, yaw: 0 },
  bounds: [-9, -12, 9, 8], next: 'ch7',
  strange: { spots: [[-5, -3], [5, -4], [-6, 3], [6, 2], [0, -5], [3, 4]], skyfaces: 0, giants: 0, watchers: 3, whispers: ['소파는 원래 저기 있었어.', '시계가 거꾸로 가면, 시간은 앞으로 갈까?', '이 방을 나가면 이 방이야.', '엄마 목소리가 벽 너머에서 들린다. 무슨 말인지는 모르겠다.', '어른이 되면 다 알게 될 줄 알았어.'] },
  objects: [
    { type: 'room', x: 0, z: 0, w: 16, d: 14, height: 3.4, floor: 'wallpaper', wallTex: 'wallpaper', wallColor: '#e8e4f4', ceilTex: 'carpet', ceilColor: '#f0e0d0', gaps: [{ wall: 'n', at: 0, w: 1.6 }, { wall: 'w', at: -2, w: 1.6 }] },
    { type: 'lamp', x: 0, y: .1, z: 0, w: 1.4, d: 1.4, light: true, color: '#ffe8c8', intensity: 8, range: 14 },
    { type: 'bed', x: -4, z: -3, flip: true, y: 3.4, scale: 1.2 },
    { type: 'table', x: 3, z: -1, flip: true, y: 3.4 }, { type: 'chair', x: 4.5, z: -1, flip: true, y: 3.4 }, { type: 'chair', x: 1.5, z: -1.2, flip: true, y: 3.4 },
    { type: 'fridge', x: 7, z: 5.5, flip: true, y: 3.4 },
    { type: 'tv', x: -6.5, z: 4, flip: true, y: 3.4, rot: Math.PI / 2, r: 1.8, secret: 'ch6_tv', text: '천장의 TV에서 뉴스가 나온다. "오늘 밤 모든 집이 뒤집혔습니다. 걱정하지 마세요. 아침이면 돌아옵니다."', mood: [1, 3] },
    { type: 'door', x: 7.85, z: -3, rot: -Math.PI / 2, r: 1, text: '문을 열자 벽이 있다. 벽지에 문 그림이 그려져 있다.', mood: [0, 2] },
    { type: 'door', x: -3, z: 6.85, rot: Math.PI, r: 1, text: '이 문은 아무 데도 가지 않는다. 그래도 노크 소리가 들린다.', mood: [0, 2] },
    { type: 'frame', x: 3, y: 1.7, z: -6.85, color: '#f0f0f0', r: 1.4, text: '액자 속 가족사진. 모두의 얼굴이 하얗게 비어 있다. 그래도 다들 웃고 있는 것 같다.', mood: [1, 2] },
    // HIDDEN ROOM 1: stare at the clock (its hand runs backwards)
    { type: 'clock', x: -2, y: 2.2, z: -6.88, spin: -.6, gaze: 5, gazeY: 0, gazeAngle: .12, gazeDist: 14, room: 'ch6_clock', warp: { x: 200, z: 3, yaw: 0 }, text: '시계를 오래 바라보았다. 초침이 나를 안쪽으로 감아 들인다.' },
    { type: 'room', x: 200, z: 0, w: 9, d: 9, height: 4, floor: 'checker', wallTex: 'stars', ceilTex: 'stars' },
    { type: 'clock', x: 198, y: 2, z: -4.38, spin: .2 }, { type: 'clock', x: 202, y: 2.6, z: -4.38, spin: -1.5 }, { type: 'clock', x: 200, y: 1.4, z: -4.38, spin: 0 },
    { type: 'orb', x: 200, z: -2, y: 1.3, color: '#fff0d8', r: 1.1, room: 'ch6_clock', text: '기억의 조각 · 멈춘 시계의 바늘이 저녁 7시를 가리킨다. 온 가족이 둘러앉아 밥을 먹던 시간.' },
    { type: 'door', x: 200, z: 4.38, rot: Math.PI, glow: '#fff', r: 1, warp: { x: -2, z: -3, yaw: Math.PI }, text: '시간 밖으로.' },
    // HIDDEN ROOM 2: the west doorway looks like a door to nowhere but opens into a tiny attic
    { type: 'room', x: -11, z: -2, w: 6, d: 4, height: 2, floor: 'wood', wallTex: 'wood', ceilTex: 'wood', gaps: [{ wall: 'e', at: 0, w: 1.6 }] },
    { type: 'blocks', x: -12, z: -2.5, n: 4 }, { type: 'bunny', x: -13, z: -1.5, flip: true, y: 2 },
    { type: 'orb', x: -12.5, z: -1.6, y: .9, color: '#ffe0f0', r: 1, room: 'ch6_attic', text: '기억의 조각 · 다락방. 내 이름이 적힌 상자 속에 어린 내가 쓴 쪽지: "어른이 된 나에게. 아직도 놀고 있니?"' },
    { type: 'cardbox', x: -12.1, z: -2.9, rot: .2 }, // 이름이 적힌 상자
    // the room loops into itself through the north door, three times
    { type: 'corridor', x: 0, z: -11, len: 4, dir: 'z', width: 1.8, height: 2.6, capStart: true, floor: 'carpet', wallTex: 'wallpaper' },
    // JUMP: an upside-down sofa blocks the way out
    { type: 'box', x: 0, z: -8, w: 1.8, h: .8, d: .7, color: '#f0b8c8', tex: 'carpet' },
    { type: 'door', id: 'goal6', x: 0, z: -10.5, goal: true, r: 1.2, loop: { times: 3, warp: { x: 0, z: 5.5, yaw: 0 }, sayFirst: true, texts: ['문을 열고 나왔는데, 같은 거실이다.', '소파가 조금 더 낮게 내려와 있다.', '이번엔… 바깥 공기가 느껴진다.'] }, text: '문밖으로 차가운 밤바람. 기차 소리가 아주 멀리서.' },
  ],
  mutations: [
    { when: { dayMod: [3, 0] }, palette: { fog: '#e0d0c8', skyMid: '#f0d8c8' }, hueDrift: -.25 },
    { when: { dayMin: 6 }, add: [{ type: 'watcher', x: 5, z: 4, h: 1.2, watch: .3, color: '#f8e8e8', r: 1, text: '작은 형체. 내 어릴 적 키와 똑같다.', mood: [1, 2] }] },
  ],
};
