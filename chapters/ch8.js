// Chapter 8 — 집. The most bizarre dream: your home, wrong, repeating — and finally home.
export default {
  id: 'ch8', order: 8, strangeness: 1.0, title: '집', subtitle: '마지막 꿈', art: 'ch8', music: 'ch8',
  intro: ['우리 집 복도다.', '어릴 땐 끝이 보이지 않던 복도. 지금은 몇 걸음이면 끝나야 하는데.'],
  palette: { skyTop: '#ffb8a0', skyMid: '#ffd8b0', skyBottom: '#c8a0c8', fog: '#e8c0a8', fogNear: 4, fogFar: 34, hemi: 1.0, sun: '#ffd0a0', sunI: .6, ground: '#a07888', ambient: '#ffe0c8', ambientI: 1.3, hue: .05 },
  spawn: { x: 0, z: 2, yaw: Math.PI },
  bounds: [-14, -2, 14, 75], next: null, ending: true,
  endText: '현관문을 열자 따뜻한 불빛이 쏟아졌다. "왔구나." 키는 문틀보다 커졌지만, 그 목소리 앞에서 나는 여전히 아이였다. 어른인 나도, 아이인 나도 — 둘 다 집에 돌아왔다. …그리고 내일 밤, 또 다른 꿈이 기다린다.',
  strange: { spots: [[0, 12], [0, 22], [0, 32], [-6, 52], [6, 56], [-4, 62], [5, 60], [0, 48]], watchers: 6, flipped: 4, giants: 0, skyfaces: 2,
    whispers: ['어서 와. 아니, 아직이야.', '많이 컸구나. 그래도 그대로네.', '어른이어도 집에 와도 돼.', '이 액자 속 사람, 원래 누구였지?', '복도는 네가 셀 때만 길어져.', '현관은 저 끝에 있어. 늘 그랬어.', '괜찮아. 다 왔어.'] },
  objects: [
    { type: 'corridor', x: 0, z: 0, len: 44, dir: 'z', width: 3, height: 2.8, capStart: true, floor: 'wood', wallTex: 'wallpaper', wallColor: '#ffe8d8', lampEvery: 5.5, lights: true, lampColor: '#ffd8a8', flicker: true,
      gaps: [{ at: 20, side: 'l', w: 1.4 }] },
    { type: 'frame', x: -1.45, y: 1.6, z: 8, rot: Math.PI / 2 }, { type: 'frame', x: 1.45, y: 1.6, z: 13, rot: -Math.PI / 2 }, { type: 'frame', x: 1.45, y: 1.6, z: 26, rot: -Math.PI / 2 },
    { type: 'frame', x: -1.45, y: 1.6, z: 32, rot: Math.PI / 2, color: '#fff8f0', gaze: 5, gazeY: 0, gazeAngle: .12, gazeDist: 8, room: 'ch8_photo', warp: { x: 200, z: 3, yaw: 0 }, text: '빈 액자를 오래 바라보니, 그 안으로 걸어 들어가게 되었다.' },
    { type: 'door', x: 1.45, z: 17, rot: -Math.PI / 2, r: .9, text: '내 방 문이다. 열어 보니 또 이 복도다.', mood: [0, 2] },
    { type: 'door', x: -1.45, z: 38, rot: Math.PI / 2, r: .9, text: '안방 문. 문 너머에서 TV 소리. 열리지 않는다.', mood: [1, 2] },
    { type: 'heightmarks', x: -1.48, z: 11, rot: Math.PI / 2, marks: [.7, .85, 1.0, 1.12, 1.25, 1.36], r: 1.2, text: '문틀에 키 재기 눈금. 다섯 살, 일곱 살, 열 살… 맨 위 눈금이 지금 내 가슴께에 있다.', mood: [2, 1] },
    { type: 'text', x: 0, z: 6, r: 2, text: '벽지 무늬가 나를 보고 웃는다. 이상하게 반갑다.', mood: [1, 2] },
    // the hallway repeats four times
    { type: 'zone', x: 0, z: 36, r: 1.6, loop: { times: 4, dz: -24, texts: ['…같은 복도다.', '액자가 하나 늘었다.', '전등이 나를 따라 깜빡인다.', '괜찮아. 거의 다 왔어.'] } },
    // JUMP: boxes piled in the hallway
    { type: 'box', x: 0, z: 41, w: 3, h: .8, d: .6, tex: 'wood', color: '#e8c8a8' },
    { type: 'box', x: -.8, z: 41, w: 1, h: 1.4, d: .6, tex: 'wood', color: '#d8b898' },
    // HIDDEN ROOM 1: a narrow gap in the left wall, hidden by a fake panel
    { type: 'box', x: -1.6, z: 20, w: .2, d: 1.4, h: 2.8, tex: 'wallpaper', color: '#ffe8d8', solid: false },
    { type: 'room', x: -5, z: 20, w: 6.4, d: 5, height: 1.75, floor: 'wood', wallTex: 'stars', ceilTex: 'stars', gaps: [{ wall: 'e', at: 0, w: 1.4 }] },
    { type: 'bed', x: -6.5, z: 20, rot: Math.PI / 2, scale: .7 }, { type: 'bunny', x: -4.8, z: 18.4 },
    { type: 'orb', x: -6, z: 21.5, y: 1, color: '#fff0c8', r: 1, room: 'ch8_childroom', text: '기억의 조각 · 고개를 숙여야 겨우 들어가는, 아주 작아진 내 방. 문에 붙은 메모: "늦어도 괜찮아. 문은 열어 둘게. — 엄마"' },
    // HIDDEN ROOM 2: inside the photograph
    { type: 'room', x: 200, z: 0, w: 9, d: 9, height: 3, ceiling: false, floor: 'grass', wallColor: '#fff4e8' },
    { type: 'tree', x: 198, z: -2, color: '#ffd8a8' }, { type: 'table', x: 201, z: -1 }, { type: 'chair', x: 202, z: -1 }, { type: 'chair', x: 200, z: -1 },
    { type: 'orb', x: 201, z: -3, y: 1.3, color: '#ffe8b0', r: 1.1, room: 'ch8_photo', text: '기억의 조각 · 사진 속 소풍날. 이번엔 모두의 얼굴이 또렷하다. 작은 나와 지금의 내가 나란히 서서 웃고 있다.' },
    { type: 'door', x: 200, z: 4.38, rot: Math.PI, glow: '#fff', r: 1, warp: { x: 0, z: 30, yaw: Math.PI }, text: '사진 밖으로.' },
    // living room & front door
    { type: 'room', x: 0, z: 56, w: 18, d: 24, height: 3.2, floor: 'wood', wallTex: 'wallpaper', wallColor: '#ffe0d0', ceilColor: '#f8e0d8', gaps: [{ wall: 'n', at: 0, w: 3 }] },
    { type: 'lamp', x: 0, y: 3.15, z: 54, w: 2, d: 2, light: true, color: '#ffd8a8', intensity: 9, range: 18 },
    { type: 'table', x: 0, z: 54, scale: 1.4 },
    { type: 'watcher', x: -1.4, z: 53, h: 1.5, watch: .05, face: false, color: '#f8e8e0' }, { type: 'watcher', x: 1.4, z: 53, h: 1.6, watch: .05, face: false, color: '#f0e8f0' }, { type: 'watcher', x: 0, z: 52.2, h: 1.2, watch: .05, face: false, color: '#fff0e8' },
    { type: 'zone', x: 0, z: 50, r: 2, text: '식탁에 가족 같은 형체들이 앉아 있다. 얼굴은 흐릿하지만, 내 자리는 어릴 때 그대로 비워 두었다.', mood: [2, 3] },
    { type: 'fridge', x: 7.6, z: 46, r: 1.3, secret: 'ch8_fridge', text: '냉장고 속에 내가 좋아하던 반찬. 뚜껑에 "데워 먹어"라는 메모. 아직 따뜻하다.', mood: [3, 1] },
    { type: 'clock', x: -8.85, y: 2, z: 56, rot: Math.PI / 2, spin: -2 },
    { type: 'tv', x: 7.5, z: 60, rot: -Math.PI / 2, r: 1.3, text: 'TV 화면에 이 거실이 나온다. 화면 속의 나는 이미 현관 앞에 서 있다.', mood: [0, 3] },
    { type: 'door', id: 'home', x: 0, z: 67.85, rot: Math.PI, goal: true, r: 1.7, frame: '#a07a6a', color: '#d8b090', glow: '#ffd8a0', text: '현관문. 손잡이가 따뜻하다. 이번엔 확실하다.' },
  ],
  mutations: [
    { when: { dayMod: [2, 0] }, palette: { fog: '#e0b8c8', skyMid: '#f0c8d8' }, hueDrift: .3, text: '벽지 색이 어제와 다르다. 아니, 원래 이 색이었나.' },
  ],
};
