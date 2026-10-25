// Chapter 5 — 물빛 복도 (poolrooms). Impossible architecture: a looping corridor.
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
  ],
  mutations: [
    { when: { dayMod: [2, 1] }, palette: { fog: '#f0f4ff' }, hueDrift: .2, text: '물빛이 어제와 다르다.' },
    { when: { dayMin: 6 }, add: [{ type: 'watcher', x: 0, z: -48, h: 2, watch: .2 }] },
  ],
};
