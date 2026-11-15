// Chapter 6 — 뒤집힌 거실. Upside-down furniture, doors to nowhere, a room that loops into itself.
const PI = Math.PI;
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
    // ---- v7: things to touch ----
    { type: 'wallswitch', x: -7.86, y: 1.3, z: 4.8, rot: PI / 2, act: { kind: 'toggle', label: '스위치', flag: 'dark', dark: true, lines: ['불을 껐다. 거실이 갑자기 더 넓어진 것 같다. 벽에 야광 글씨가 보인다.'], offLines: ['불을 켰다. 가구들은 여전히 천장에 붙어 있다.'], mood: [0, 2] } },
    { type: 'walltext', x: 7.86, y: 1.6, z: 5.3, rot: -PI / 2, w: 2, write: '다녀왔습니다', ink: '#d8ffe0', showIf: 'dark' },
    { type: 'walltext', x: -5, y: 2.2, z: -6.86, w: 1.8, write: '어서 와', ink: '#d8ffe0', showIf: 'dark' },
    { type: 'radio', x: -5.5, z: -5.5, rot: .4, act: { kind: 'play', lines: ['…오늘의 사연입니다. "어른이 됐는데도 밤마다 불을 켜고 잡니다."', '"…그래도 괜찮을까요?"', '…괜찮습니다. 다음 곡은 자장가입니다.'], mood: [2, 1] } },
    { type: 'dresser', x: 6.6, z: -5.5, rot: -PI / 2, act: { kind: 'open', lines: ['서랍 속에 리모컨이 있다. 건전지 뚜껑이 테이프로 감겨 있다.'], give: 'remote', item: 'remote', name: '리모컨', icon: '📺', empty: '서랍 안에는 고무줄과 건전지 하나뿐이다.' } },
    { type: 'tv', x: -3.4, z: -6.3, act: { kind: 'use', label: '켜기', need: 'remote', needText: '바닥에 놓인 TV. 버튼이 없다. 리모컨이 있어야 할 것 같다.', tone: 'static', lines: ['리모컨을 누르자, 화면에 어린 내가 나온다.', '화면 속 아이가 묻는다. "거기는 지금 몇 시야?"', '"…여기는 아직 저녁 일곱 시야. 다들 밥 먹으러 오래."'], secret: 'ch6_remote', mood: [1, 2] } },
    { type: 'rotary', x: 2, z: 5, act: { kind: 'ring', ringText: '거실 바닥에 놓인 전화가 울린다.', lines: ['"…여보세요. 거기 우리 집 맞죠?"', '"저 거기 살았었어요. 아주 오래전에요."', '"…혹시 제 방, 아직 그대로 있어요?"'], mood: [1, 2] } },
    { type: 'mirror', x: 7.86, y: .4, z: 1.6, rot: -PI / 2, w: 1, h: 1.8, reflection: { face: true }, act: { kind: 'mirror', lines: ['거울 속 거실은 똑바로 서 있다. 그쪽이 진짜 같다.', '거울 속 아이는 소파에 앉아 TV를 보고 있다. 나는 서 있는데.'], mood: [0, 2] } },
    { type: 'rug', x: 0, z: 3.4, w: 2.4, d: 1.6, act: { kind: 'open', label: '들추기', r: 1.6, lines: ['양탄자를 들추자 바닥에 크레파스 낙서가 있다. "여기는 내 자리"'], frag: 'ch6_rug', fragText: '거실 양탄자 밑에 몰래 그린 낙서. "여기는 내 자리." 들킬까 봐 조마조마했는데, 아무도 들추지 않았다.' } },
    { type: 'child', x: -5.5, z: 2.5, h: .8, watch: .25, face: true, act: { kind: 'lines', lines: ['아이가 천장의 TV를 올려다본다. "저거 언제 끝나?"', '"엄마 아빠는 아직 안 왔어. 같이 기다릴래?"'], mood: [1, 2] } },
    // PUZZLE → HIDDEN ROOM: hang all three crooked photos straight
    { type: 'photo', x: 5.5, y: 1.6, z: -6.86, tilt: .5, act: { kind: 'step', label: '바로 걸기', puzzle: 'frames', key: 'a', lines: ['액자를 바로 걸었다. …아니, 다시 기울었나?'] } },
    { type: 'photo', x: -7.86, y: 1.7, z: 1.5, rot: PI / 2, tilt: -.6, color: '#e8f0f8', act: { kind: 'step', label: '바로 걸기', puzzle: 'frames', key: 'b', lines: ['사진 속 사람들이 조금 더 가까이 붙어 선 것 같다.'] } },
    { type: 'photo', x: 4, y: 1.5, z: 6.86, rot: PI, tilt: .7, color: '#f8e8f0', act: { kind: 'step', label: '바로 걸기', puzzle: 'frames', key: 'c', lines: ['액자 뒤에서 오래된 테이프 냄새가 난다.'] } },
    { type: 'cup', x: 4.6, z: 2.5, scale: 5, visitAlts: [[-4, -2, 1], [3, -4, 2]], act: { kind: 'lines', r: 1.6, lines: ['내 키만 한 컵. 어릴 때 쓰던 컵이다. 손잡이에 이빨 자국이 있다.'], mood: [1, 1] } },
    { type: 'frag', x: 5, y: 1.1, z: 5.6, act: { kind: 'frag', frag: 'ch6_slippers', fragText: '현관에 나란히 놓인 가족의 슬리퍼. 내 것만 작았다. 이제는 그 슬리퍼에 발가락도 들어가지 않는다.' } },
    // ambient: furniture that rearranges every time the room loops
    { type: 'chair', x: -1, z: 3, flip: true, y: 3.4, loopAlts: [[2, -3, 1, 3.4], [-4, 1, 2, 3.4], [5, 3, 3, 3.4]] },
    { type: 'walltext', x: 0, y: 2.6, z: 6.86, rot: PI, w: 2, write: '아까도 왔었지?', ink: '#8a6a9a', appear: true },
    // HIDDEN ROOM (photos): the living room under the living room, right way up
    { type: 'room', x: 300, z: 0, w: 9, d: 8, height: 3, floor: 'wood', wallTex: 'wallpaper', wallColor: '#ffe8e0', ceilColor: '#fff0e8' },
    { type: 'lamp', x: 300, y: 2.95, z: 0, light: true, color: '#ffd8a8', intensity: 5 }, { type: 'table', x: 300, z: -1.5 }, { type: 'chair', x: 299, z: -.6, rot: PI }, { type: 'chair', x: 301, z: -.6, rot: PI }, { type: 'cake', x: 300, y: .79, z: -1.5, candles: 7 },
    { type: 'orb', x: 302.5, z: -2.5, y: 1.2, color: '#fff0d8', r: 1, room: 'ch6_basement', text: '기억의 조각 · 똑바로 선 거실. 생일날 불을 끄고 촛불만 켜 두었던 밤. 노래가 끝날 때까지 소원을 고르지 못했다.' },
    { type: 'door', x: 300, z: 3.88, rot: PI, glow: '#fff', r: 1, warp: { x: 0, z: 4, yaw: 0 }, text: '거꾸로 된 거실로.' },
  ],
  puzzles: [{ id: 'frames', mode: 'all', keys: ['a', 'b', 'c'], doneText: '액자들은 이제 똑바로 걸려 있다.',
    reward: { text: '세 액자가 모두 바로 걸리자, 벽 너머에서 딸깍 소리가 났다. 바닥 밑에서 따뜻한 바람이 분다…', room: 'ch6_basement', warp: { x: 300, z: 2.5, yaw: 0 }, warpDelay: 3200 } }],
  mutations: [
    { when: { dayMod: [3, 0] }, palette: { fog: '#e0d0c8', skyMid: '#f0d8c8' }, hueDrift: -.25 },
    { when: { dayMin: 6 }, add: [{ type: 'watcher', x: 5, z: 4, h: 1.2, watch: .3, color: '#f8e8e8', r: 1, text: '작은 형체. 내 어릴 적 키와 똑같다.', mood: [1, 2] }] },
  ],
};
