// Chapter 5 — 물빛 복도 (poolrooms). Impossible architecture: a looping corridor.
const PI = Math.PI;
export default {
  id: 'ch5', order: 5, strangeness: .58, title: '물빛 복도', subtitle: '다섯 번째 꿈', art: 'ch5', music: 'ch5',
  intro: ['타일. 물. 타일. 물.', '어른이 되는 길은 이렇게 끝없이 되풀이되는 복도 같았다.'],
  palette: { skyTop: '#e8fbff', skyMid: '#f4ffff', skyBottom: '#d8f4f4', fog: '#d8eeee', fogNear: 6, fogFar: 42, hemi: .8, sun: '#ffffff', sunI: .4, ground: '#a8d0d0', ambient: '#e0f4f4', ambientI: .9, sat: .9 },
  spawn: { x: 0, z: 10, yaw: 0 },
  bounds: [-16, -66, 16, 16], next: 'ch6',
  strange: { spots: [[-10, -8], [10, 6], [-8, 8], [9, -10], [-6, -58], [6, -52]], skyfaces: 0, giants: 0, whispers: ['물이 따뜻하다. 누가 데워 놓았을까?', '이 복도, 세 번째야.', '타일 하나가 나를 본다.', '여기서 수영을 배웠던가?', '물이 무서울 때 누가 손을 잡아 줬더라.'] },
  objects: [
    { type: 'room', x: 0, z: 0, w: 30, d: 30, height: 5, floor: 'pool', wallTex: 'pool', ceilTex: 'pool', ceilColor: '#f4ffff', gaps: [{ wall: 'n', at: 0, w: 3 }, { wall: 'e', at: 5, w: 2 }] },
    { type: 'water', y: .06, size: 29, color: '#c8f4f8', opacity: .55 },
    { type: 'pillar', x: -7, z: -7, h: 5, tex: 'pool' }, { type: 'pillar', x: 7, z: -7, h: 5, tex: 'pool' }, { type: 'pillar', x: -7, z: 7, h: 5, tex: 'pool' }, { type: 'pillar', x: 7, z: 7, h: 5, tex: 'pool' },
    { type: 'lamp', x: 0, y: 4.95, z: 0, w: 6, d: 6, light: true, color: '#f0ffff', intensity: 4, range: 20 },
    { type: 'stairs', x: 10, z: -12, n: 14, rot: Math.PI / 2, tex: 'pool', color: '#f0ffff' },
    { type: 'text', x: 0, z: 4, r: 3, text: '물소리가 너무 가까이에서 들린다. 내 숨소리 같기도 하다.', mood: [1, 1] },
    { type: 'duck', x: -12, z: 12, scale: 3, r: 2.2, secret: 'ch5_duck2', text: '커다란 고무 오리. "또 만났네. 몸은 커졌는데, 표정은 그대로구나."', mood: [2, 1] },
    // HIDDEN ROOM 1: fake tile wall on the east side
    { type: 'box', x: 15, z: 5, w: .2, d: 2, h: 5, tex: 'pool', solid: false },
    { type: 'room', x: 18.5, z: 5, w: 7, d: 5, height: 2.5, floor: 'tiles', wallTex: 'pool', gaps: [{ wall: 'w', at: 0, w: 2 }] },
    { type: 'orb', x: 20.5, z: 5, y: 1, color: '#d0fff0', r: 1, room: 'ch5_drain', text: '기억의 조각 · 배수구 옆에 젖은 운동화 한 켤레. 내 신발이다. 이제는 발이 들어가지 않는다.' },
    { type: 'sneakers', x: 20.9, z: 5.6, rot: .4 }, // 운동화 (memory orb mentions it)
    // HIDDEN ROOM 2: a doorway set too high on the wall — look at it for a while
    { type: 'door', x: -14.8, y: 3.2, z: -5, rot: Math.PI / 2, glow: '#f0ffff', gaze: 4, gazeY: 1.1, gazeAngle: .15, gazeDist: 25, room: 'ch5_high', warp: { x: 200, z: 4, yaw: 0 }, text: '높은 곳의 문을 오래 올려다보았더니, 어느새 문 안쪽에 서 있다.' },
    { type: 'room', x: 200, z: 0, w: 8, d: 10, height: 6, floor: 'pool', wallTex: 'pool', ceiling: false },
    { type: 'water', x: 200, z: 0, y: .3, size: 8, color: '#b8f0ff', opacity: .7 },
    { type: 'orb', x: 200, z: -3, y: 1.6, color: '#ffffff', r: 1.2, room: 'ch5_high', text: '기억의 조각 · 천장이 없는 수영장. 하늘에서 누군가 "저녁 먹자!" 하고 부른다. 대답하려는데, 내 목소리가 어른의 목소리다.' },
    { type: 'door', x: 200, z: 4.8, rot: Math.PI, glow: '#e8ffff', r: 1, warp: { x: -11, z: -5, yaw: Math.PI / 2 }, text: '다시 아래로.' },
    // looping corridor north (impossible architecture)
    { type: 'corridor', x: 0, z: -45, len: 30, dir: 'z', width: 3, height: 3, floor: 'pool', wallTex: 'pool', ceilTex: 'pool', lampEvery: 5, lights: true, lampColor: '#f0ffff' },
    { type: 'zone', x: 0, z: -40, r: 1.6, loop: { times: 3, dz: 18, texts: ['…방금 지나온 복도다.', '타일의 금까지 똑같다.', '이번이 마지막일 거야.'] } },
    { type: 'room', x: 0, z: -55, w: 20, d: 20, height: 4, floor: 'pool', wallTex: 'pool', ceilTex: 'pool', gaps: [{ wall: 's', at: 0, w: 3 }] },
    { type: 'water', x: 0, z: -55, y: .06, size: 19, color: '#c8f4f8', opacity: .55 },
    // JUMP: floating tiles rise to the door
    { type: 'platform', style: 'tile', x: -4, y: .6, z: -55.5, w: 1.6, d: 1.6 },
    { type: 'platform', style: 'tile', x: -2, y: 1.15, z: -58, w: 1.6, d: 1.6, move: { axis: 'y', amp: .3, speed: .7 } },
    { type: 'platform', style: 'tile', x: 0, y: 1.6, z: -61.6, w: 4, d: 3, h: .5 },
    { type: 'door', id: 'goal5', x: 0, y: 1.6, z: -62.8, glow: '#ffffff', goal: true, r: 1.5, text: '물속에 비친 문이 진짜 문보다 선명하다.' },
    // ---- v7: things to touch ----
    { type: 'chair', x: 12, z: -2, scale: 3.2, rot: -PI / 2, visitAlts: [[-12, -4, PI / 2], [11, 10, PI]], act: { kind: 'lines', r: 1.8, lines: ['안전요원 의자. 아무도 없는데 호루라기 소리가 난다.', '"수영장 안에서는 뛰지 마세요." 목소리가 내 머리 위에서 들린다.'], mood: [0, 1] } },
    { type: 'radio', x: -4, y: .06, z: -2, act: { kind: 'play', lines: ['…안내 방송입니다. 지금 물속에 계신 분은… 한 명입니다.', '…두 명입니다.', '…한 명입니다. 정정합니다. 처음부터 한 명이었습니다.'], mood: [0, 2] } },
    { type: 'locker', x: -14.6, z: 1.4, rot: PI / 2 }, { type: 'locker', x: -14.6, z: 2.6, rot: PI / 2 },
    { type: 'locker', x: -14.6, z: 2, rot: PI / 2, act: { kind: 'open', lines: ['사물함 안에 이름표가 붙은 수영모가 있다.', '이름표의 글씨는 내 글씨인데, 이름이 조금 다르다.'], frag: 'ch5_cap', fragText: '이름표를 꿰매 붙인 수영모. 밤늦게 바느질해 준 글씨는 삐뚤었지만 한 번도 떨어지지 않았다.', mood: [1, 1] } },
    { type: 'wallswitch', x: 7, y: 1.3, z: 7.42, act: { kind: 'toggle', label: '스위치', flag: 'dark', dark: true, lines: ['불을 끄자 물이 스스로 빛나기 시작한다. 물속에 글씨가 떠 있다.'], offLines: ['불이 켜졌다. 물은 다시 아무것도 아닌 척한다.'], mood: [0, 2] } },
    { type: 'walltext', x: 0, y: .1, z: 6, w: 6, flat: true, write: '숨 참지 않아도 돼', ink: '#c8fff8', showIf: 'dark' },
    { type: 'walltext', x: -6, y: .1, z: -9, w: 4, flat: true, write: '여기서 살아도 돼', ink: '#c8fff8', showIf: 'dark' },
    { type: 'mirror', x: 14.88, y: .4, z: -6, rot: -PI / 2, w: 1.2, h: 1.6, glass: '#f0fafa', act: { kind: 'mirror', lines: ['김 서린 거울에 손가락으로 쓴 글씨. "나 여기 있어."', '내 글씨다. 아주 어릴 적의.', '거울 속 아이가 같은 글씨를 쓰고 있다. 거꾸로.'], mood: [1, 2] } },
    { type: 'child', x: 0, z: -22, opacity: .75, follow: { min: 5, speed: .5, leash: 9 }, act: { kind: 'lines', lines: ['돌아보면 멈춘다. 같이 걷고 싶은 것 같다.', '젖은 발자국이 아이의 발밑에서 끝난다.'], mood: [1, 2] } },
    { type: 'duck', x: 9, z: 11, act: { kind: 'pickup', item: 'duck', name: '고무 오리', icon: '🐤', lines: ['작은 고무 오리. 꾹 누르면 "꽥" 하고 운다.'] } },
    { type: 'tub', x: -10, z: -11, rot: .2, act: { kind: 'use', label: '띄우기', need: 'duck', needText: '물이 받아진 욕조. 무언가 띄우고 싶다.', lines: ['오리를 띄우자, 욕조 물에서 저녁 냄새가 난다.', '욕실 문틈으로 누군가 "다 씻었니?" 하고 묻는다…'], room: 'ch5_bath', warp: { x: 300, z: 3, yaw: 0 }, warpDelay: 4000 } },
    { type: 'frag', x: 1, y: 1.1, z: -28, act: { kind: 'frag', frag: 'ch5_goggles', fragText: '물안경 자국이 남은 얼굴로 먹던 컵라면. 수영장 매점의 김 서린 유리창.' } },
    { type: 'rotary', x: 8.5, z: -52, rot: -PI / 2, act: { kind: 'ring', ringText: '타일 벽 너머에서 전화가 울린다.', lines: ['"…물이 차오르고 있어. 괜찮아, 따뜻한 물이야."', '"발이 닿지 않으면, 그냥 떠 있으면 돼."', '"너는 원래 물에 잘 떴잖아."'], mood: [1, 2] } },
    { type: 'fish', x: -6, z: 8, y: .3, wander: 1.5, speed: .3, scale: .6, color: '#ff9a6a', act: { kind: 'toy', lines: ['태엽 물고기가 물 위를 맴돈다. 같은 자리만 계속.', '물고기가 멈추지 않는다. 태엽은 이미 다 풀렸는데.'] } },
    // ambient: writing that repeats, a wet teddy that is never where you left it
    { type: 'walltext', x: -1.45, y: 1.5, z: -30, rot: PI / 2, w: 1.8, write: '여기는 처음이야', ink: '#5a8a90', appear: true },
    { type: 'walltext', x: 1.45, y: 1.5, z: -36, rot: -PI / 2, w: 1.8, write: '여기는 처음이야', ink: '#5a8a90', appear: true },
    { type: 'teddy', x: -10, z: 6, scale: 1.4, color: '#b8a090', unseen: [[10, -6, 0], [-6, -10, 1], [4, 12, 3]] },
    // HIDDEN ROOM (float the duck): the bathroom of the house I grew up in
    { type: 'room', x: 300, z: 0, w: 6, d: 8, height: 2.6, floor: 'tiles', wallTex: 'pool', ceilColor: '#f4ffff' },
    { type: 'tub', x: 298.4, z: -2, rot: PI / 2 }, { type: 'duck', x: 298.4, y: .35, z: -2 }, { type: 'mirror', x: 302.9, y: .6, z: -1, rot: -PI / 2, w: .7, h: 1 },
    { type: 'orb', x: 300.5, z: -2.5, y: 1.2, color: '#e8ffff', r: 1, room: 'ch5_bath', text: '기억의 조각 · 어릴 적 욕실. 머리를 감을 때 눈에 물이 들어갈까 봐 꼭 감던 눈. 수건으로 감싸 안아 주던 팔.' },
    { type: 'door', x: 300, z: 3.88, rot: PI, glow: '#e8ffff', r: 1, warp: { x: 0, z: 8, yaw: 0 }, text: '물빛 복도로.' },
  ],
  mutations: [
    { when: { dayMod: [2, 1] }, palette: { fog: '#f0f4ff' }, hueDrift: .2, text: '물빛이 어제와 다르다.' },
    { when: { dayMin: 6 }, add: [{ type: 'watcher', x: 0, z: -48, h: 2, watch: .2 }] },
  ],
};
