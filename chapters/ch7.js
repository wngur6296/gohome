// Chapter 7 — 별 없는 정거장. The platform repeats; the moon has a face; everyone waits.
export default {
  id: 'ch7', order: 7, strangeness: .85, title: '별 없는 정거장', subtitle: '일곱 번째 꿈', art: 'ch7', music: 'ch7',
  intro: ['막차가 서 있다. 문은 열려 있다.', '어른이 되면 모두 어딘가로 떠나는 기차를 탄다. 나도 그랬다.'],
  palette: { skyTop: '#2a1a5a', skyMid: '#6a3aa0', skyBottom: '#3a2a6a', fog: '#4a3a7a', fogNear: 8, fogFar: 60, hemi: .9, sun: '#b8a8ff', sunI: .5, ground: '#2a2a4a', ambient: '#a898e0', ambientI: 1.6, sat: 1.15 },
  spawn: { x: 0, z: 0, yaw: 0 },
  bounds: [-6, -160, 12, 8], next: 'ch8',
  strange: { spots: [[-2, -30], [-2, -45], [-2, -70], [-2, -85], [1, -110], [-2, -125]], watchers: 6, flipped: 0, giants: 0, whispers: ['다음 역은… 다음 역은… 다음 역은…', '모두 같은 기차를 기다린다.', '표는 주머니에 있어. 처음부터.', '달이 잠꼬대를 한다. 너의 이름이었어.'] },
  objects: [
    // JUMP: the platform is broken — a gap to jump (falling is gentle)
    { type: 'floor', x: 0, z: -33, w: 7, d: 82, tex: 'concrete', color: '#d8d0f0', texRepeat: .6 },
    { type: 'floor', x: 0, z: -118, w: 7, d: 84, tex: 'concrete', color: '#d8d0f0', texRepeat: .6 },
    { type: 'text', x: 0, z: -70, r: 2, text: '승강장이 끊겨 있다. 아래는 별 없는 어둠.', mood: [0, 2] },
    { type: 'floor', x: 6.75, z: -75, y: -.9, w: 6.5, d: 170, tex: 'rail', color: '#a8a0c0', texRepeat: .5 },
    { type: 'box', x: 3.6, z: -75, w: .2, d: 170, h: .1, color: '#ffe870', solid: false },
    { type: 'train', x: 7.5, z: -20, color: '#c8e8f0', solid: [3, 14] },
    { type: 'zone', x: 4.6, z: -20, r: 1.4, secret: 'ch7_train', text: '기차 안은 비어 있다. 좌석마다 같은 꿈 일기가 펼쳐져 있다. 아이의 글씨와 어른의 글씨가 한 줄씩 번갈아 적혀 있다.', mood: [0, 3] },
    { type: 'moon', x: -60, y: 45, z: -120, r: 14 }, { type: 'skyface', x: -60, y: 45, z: -118, s: 50, opacity: .7, color: '#e8e0ff' },
    { type: 'lamppost', x: -3, z: -10 }, { type: 'lamppost', x: -3, z: -25 }, { type: 'lamppost', x: -3, z: -40 }, { type: 'lamppost', x: -3, z: -55 }, { type: 'lamppost', x: -3, z: -70 }, { type: 'lamppost', x: -3, z: -85 }, { type: 'lamppost', x: -3, z: -100 }, { type: 'lamppost', x: -3, z: -115 },
    { type: 'sign', x: -2.5, z: -6, color: '#e8f0ff', r: 1.4, text: '역 이름: "집". 그 아래 작은 글씨: "(이 역이 아닙니다)"', mood: [0, 2] },
    { type: 'sign', x: -2.5, z: -60, color: '#e8f0ff', r: 1.4, text: '역 이름: "집". 아까와 같은 표지판이다.', mood: [0, 2] },
    { type: 'box', x: -2, z: -48, w: 2, h: .45, d: .6, tex: 'wood', color: '#c8b8e8' },
    // HIDDEN ROOM 1: sit (stand still) by the bench for 10 seconds
    { type: 'zone', x: -2, z: -47, r: 1.3, still: 10, room: 'ch7_waiting', warp: { x: 260, z: 3, yaw: 0 }, text: '벤치 옆에서 기다렸다. 기다리는 동안, 정거장이 사라졌다.' },
    { type: 'room', x: 260, z: 0, w: 10, d: 9, height: 3.5, floor: 'checker', wallTex: 'wallpaper', ceilColor: '#e0d8f8' },
    { type: 'clock', x: 258, y: 2.2, z: -4.38 }, { type: 'clock', x: 262, y: 2.2, z: -4.38, spin: .9 }, { type: 'watcher', x: 262, z: 1, h: 1.9, watch: .3, face: false },
    { type: 'orb', x: 259, z: -2, y: 1.2, color: '#d8c8ff', r: 1.1, room: 'ch7_waiting', text: '기억의 조각 · 대합실. 어릴 때 마중 나와 주던 사람이 앉아 있던 자리. 아직 따뜻하다.' },
    { type: 'door', x: 260, z: 4.38, rot: Math.PI, glow: '#fff', r: 1, warp: { x: -1, z: -50, yaw: 0 }, text: '승강장으로.' },
    // HIDDEN ROOM 2: walk down onto the tracks, all the way to the end
    { type: 'zone', x: 7, z: -150, r: 2.5, room: 'ch7_tunnel', warp: { x: 200, z: 3, yaw: 0 }, text: '선로 끝, 어둠 속 작은 문틈으로 빛이 새어 나온다.' },
    { type: 'room', x: 200, z: 0, w: 7, d: 8, height: 2.6, floor: 'rail', wallTex: 'concrete', ceilColor: '#3a3050' },
    { type: 'lamp', x: 200, y: 2.55, z: 0, light: true, color: '#ffd8a0', intensity: 6 },
    { type: 'orb', x: 200, z: -2.5, y: 1, color: '#ffe0b0', r: 1, room: 'ch7_tunnel', text: '기억의 조각 · 터널 속 작은 방. 벽에 분필로 "어른이 되어도, 여기서 쉬었다 가도 돼".' },
    { type: 'door', x: 200, z: 3.88, rot: Math.PI, glow: '#fff', r: 1, warp: { x: 0, z: -140, yaw: 0 }, text: '다시 승강장 끝으로.' },
    // the platform repeats twice before the end appears
    { type: 'zone', x: 0, z: -95, r: 3.4, loop: { times: 2, dz: 55, texts: ['…가로등 개수가 같다.', '같은 사람들이 같은 자리에 서 있다.'] } },
    { type: 'door', id: 'goal7', x: 0, z: -148, glow: '#e8d8ff', goal: true, r: 1.8, text: '승강장 끝의 문. 문 너머에서 익숙한 현관 냄새.' },
  ],
  mutations: [
    { when: { dayMod: [2, 1] }, add: [{ type: 'whale', orbit: 60, y: 30, cz: -70, speed: .03 }] },
    { when: { dayMin: 7 }, palette: { skyMid: '#3a6aa0', fog: '#3a4a7a' }, text: '오늘은 달이 눈을 떴다. 다정한 눈이다.' },
  ],
};
