// Chapter 7 — 별 없는 정거장. The platform repeats; the moon has a face; everyone waits.
const PI = Math.PI;
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
    { type: 'bench', x: -2, z: -48.1, color: '#c8b8e8', solid: [1.6, .45], solidTop: .5 },
    // HIDDEN ROOM 1: sit (stand still) by the bench for 10 seconds
    { type: 'zone', x: -2, z: -47, r: 1.3, still: 10, room: 'ch7_waiting', warp: { x: 260, z: 3, yaw: 0 }, text: '벤치 옆에서 기다렸다. 기다리는 동안, 정거장이 사라졌다.' },
    { type: 'room', x: 260, z: 0, w: 10, d: 9, height: 3.5, floor: 'checker', wallTex: 'wallpaper', ceilColor: '#e0d8f8' },
    { type: 'clock', x: 258, y: 2.2, z: -4.38 }, { type: 'clock', x: 262, y: 2.2, z: -4.38, spin: .9 }, { type: 'watcher', x: 262, z: 1, h: 1.9, watch: .3, face: false },
    { type: 'orb', x: 259, z: -2, y: 1.2, color: '#d8c8ff', r: 1.1, room: 'ch7_waiting', text: '기억의 조각 · 대합실. 어릴 때 마중 나와 주던 사람이 앉아 있던 자리. 아직 따뜻하다.' },
    { type: 'bench', x: 260, z: -4, solid: [1.6, .45] }, // 대합실 자리
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
    // ---- v7: things to touch ----
    { type: 'speaker', x: -3, z: -15, act: { kind: 'play', label: '듣기', lines: ['…안내 방송입니다. 이번 열차는 "집"으로 가지 않습니다.', '…이번 열차는 "집"으로 갑니다. 정정합니다.', '…이번 열차는 어린이만 탈 수 있습니다. 어른이 된 승객은 그대로 기다려 주세요.'], mood: [0, 2] } },
    { type: 'walltext', x: -3.3, y: 1.8, z: -9, rot: PI / 2, w: 1.8, write: '다음 열차 · 어제\n그다음 · 아주 오래전', ink: '#e8e0ff', font: 'print' },
    { type: 'cardbox', x: -2.6, z: -32, scale: 1.6, act: { kind: 'open', lines: ['분실물 상자. 안에 어린이 승차권 한 장이 있다.', '승차권 뒷면에 내 이름이 적혀 있다.'], frag: 'ch7_ticket', fragText: '혼자 처음 버스를 탄 날의 어린이 승차권. 내릴 곳을 지나칠까 봐 창밖만 보고 있었다.' } },
    { type: 'vending', x: -2.9, z: -43, rot: PI / 2, act: { kind: 'open', label: '누르기', lines: ['동전을 넣지 않았는데 표가 나온다.', '"어린이 1장". 표가 아직 따뜻하다.'], give: 'kidticket', item: 'kidticket', name: '어린이 표', icon: '🎫', empty: '자판기 화면에 "매진"이라고 떠 있다.' } },
    { type: 'gate', x: 0, z: -100, act: { kind: 'use', label: '표 넣기', need: 'kidticket', needText: '개찰구가 닫혀 있다. 표가 있어야 지나갈 수 있을 것 같다.', lines: ['개찰구가 "어린이"라고 말하며 열린다.', '개찰구 너머는 승강장이 아니라, 막차의 마지막 칸이다…'], room: 'ch7_carriage', warp: { x: 300, z: 5, yaw: 0 }, warpDelay: 3600 } },
    { type: 'rotary', x: -2.8, z: -64, rot: PI / 2, act: { kind: 'ring', ringText: '승강장 공중전화가 울린다.', lines: ['"…거기 정거장이지? 마중 나갈게. 몇 번 출구야?"', '"…출구가 없다고? 괜찮아. 기다릴게. 계속 기다릴게."'], mood: [2, 2] } },
    { type: 'watcher', x: -1.5, z: -22, h: 2.2, face: false, color: '#e0d8ec', follow: { min: 6, speed: .6, leash: 30 }, act: { kind: 'lines', r: 1.6, lines: ['그들은 나와 같은 기차를 기다린다고 한다. 몇 년째.', '"어른이 되면 다 이 기차를 타요. 내리는 역은 각자 달라요."'], mood: [0, 2] } },
    { type: 'watcher', x: 1.5, z: -112, h: 2.4, face: false, color: '#d8d0e8', follow: { min: 7, speed: .5, leash: 25 } },
    { type: 'mirror', x: -3.3, y: .3, z: -82, rot: PI / 2, w: .8, h: 1.7, reflection: { face: true, color: '#e8e0f8' }, act: { kind: 'mirror', lines: ['역 거울 속의 나는 교복을 입고 있다.', '거울 속 아이가 시계를 본다. "늦었다, 늦었어." 그런데 어디에 늦은 걸까.'], mood: [1, 2] } },
    { type: 'frag', x: -2, y: 1.1, z: -88, act: { kind: 'frag', frag: 'ch7_window', fragText: '버스 창문에 입김을 불어 그린 집. 그림이 사라지기 전에 내려야 했다.' } },
    { type: 'wallswitch', x: -2.95, y: 1.3, z: -70, rot: PI / 2, act: { kind: 'toggle', label: '스위치', flag: 'dark', dark: true, lines: ['정거장의 불을 껐다. 별 없는 하늘에 별이 하나씩 켜진다.', '별은 꺼진 게 아니라, 숨어 있었던 거다.'], offLines: ['불이 다시 켜지자 별들이 숨었다.'], mood: [1, 1] } },
    { type: 'orb', x: -20, y: 22, z: -60, size: 3, color: '#fffbe0', showIf: 'dark' }, { type: 'orb', x: 10, y: 30, z: -90, size: 3, color: '#fff0f8', showIf: 'dark' }, { type: 'orb', x: -30, y: 26, z: -110, size: 4, color: '#f0f8ff', showIf: 'dark' },
    { type: 'orb', x: 25, y: 18, z: -40, size: 3, color: '#fffbe0', showIf: 'dark' }, { type: 'orb', x: -12, y: 34, z: -20, size: 3, color: '#fff0f8', showIf: 'dark' }, { type: 'orb', x: 30, y: 24, z: -130, size: 4, color: '#fffbe0', showIf: 'dark' },
    { type: 'bench', x: -2, z: -120, color: '#c8b8e8' },
    { type: 'teddy', x: -2, y: .48, z: -119.9, act: { kind: 'toy', lines: ['벤치에 두고 간 곰 인형. 누군가를 기다리며 노래한다.', '곰 인형의 목에 쪽지가 걸려 있다. "보호자가 데리러 올 때까지 기다리세요."'], mood: [2, 1] } },
    { type: 'clock', x: -2.9, y: 2.4, z: -128, rot: PI / 2, spin: .4, act: { kind: 'lines', r: 2.2, lines: ['시계마다 시간이 다르다. 그런데 모두 저녁 일곱 시 근처다.'] } },
    { type: 'walltext', x: -3.3, y: 1.4, z: -135, rot: PI / 2, w: 2.2, write: '내려야 할 역을 지나쳤어요', ink: '#c8b8f0', appear: true },
    // HIDDEN ROOM (child ticket): the last carriage of the last train
    { type: 'room', x: 300, z: 0, w: 3.4, d: 12, height: 2.6, floor: 'carpet', wallTex: 'concrete', wallColor: '#d8d0e8', ceilColor: '#e8e0f0' },
    { type: 'lamp', x: 300, y: 2.55, z: -2, light: true, color: '#fff0d0', intensity: 5 }, { type: 'bench', x: 298.95, z: -2, rot: PI / 2, color: '#a898c8' }, { type: 'bench', x: 301.05, z: -2, rot: -PI / 2, color: '#a898c8' }, { type: 'bench', x: 298.95, z: 2, rot: PI / 2, color: '#a898c8' },
    { type: 'watcher', x: 301, z: 2, h: 1.3, face: false, color: '#f0e8f0' },
    { type: 'orb', x: 300, z: -4.5, y: 1.2, color: '#e8d8ff', r: 1, room: 'ch7_carriage', text: '기억의 조각 · 막차의 마지막 칸. 졸다가 깨면 늘 누군가의 어깨에 기대 있었다. 그 어깨가 누구였는지, 이제야 알 것 같다.' },
    { type: 'door', x: 300, z: 5.88, rot: PI, glow: '#fff', r: 1, warp: { x: 0, z: -104, yaw: 0 }, text: '승강장으로.' },
  ],
  mutations: [
    { when: { dayMod: [2, 1] }, add: [{ type: 'whale', orbit: 60, y: 30, cz: -70, speed: .03 }] },
    { when: { dayMin: 7 }, palette: { skyMid: '#3a6aa0', fog: '#3a4a7a' }, text: '오늘은 달이 눈을 떴다. 다정한 눈이다.' },
  ],
};
