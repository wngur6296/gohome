const PI = Math.PI;
export default {
  id: 'secret', order: 99, strangeness: .15, hidden: true, title: '작은 꿈', subtitle: '꿈속의 꿈', art: 'title', music: 'secret',
  intro: ['아주 작아졌다.', '여기는 꿈속의 꿈.'],
  palette: { skyTop: '#ffd0ec', skyMid: '#fff4c8', skyBottom: '#d0f4ff', fog: '#fff0f6', fogNear: 6, fogFar: 50, hemi: 1.3, sun: '#ffffff', sunI: .5, sat: 1.15, ambientI: .9 },
  spawn: { x: 0, z: 8, yaw: 0 }, bounds: [-30, -30, 30, 30],
  objects: [
    { type: 'floor', x: 0, z: 0, w: 60, d: 60, tex: 'checker', color: '#ffffff', texRepeat: .5 },
    { type: 'musicbox', x: 0, z: -6, scale: 9, solid: [4.6, 3.4], r: 4, secret: 'musicbox', text: '거대한 오르골 위에서 작은 발레리나가 나에게 인사한다.', mood: [3, 2] },
    { type: 'sheep', x: -6, z: 0, wander: 5, speed: .5 }, { type: 'sheep', x: 6, z: 2, wander: 5, speed: .4 }, { type: 'sheep', x: 0, z: 10, wander: 6, speed: .6 },
    { type: 'orb', x: -4, z: -2, y: 2, color: '#ffe0f0' }, { type: 'orb', x: 5, z: -3, y: 2.6, color: '#e0f0ff' }, { type: 'orb', x: 2, z: 6, y: 1.6, color: '#fff8c0' },
    { type: 'pillar', x: -12, z: -12, h: 14, tex: 'stars' }, { type: 'pillar', x: 12, z: -12, h: 14, tex: 'stars' },
    { type: 'cloud', x: 0, y: 9, z: -14, s: 2.2 }, { type: 'cloud', x: -10, y: 6, z: 4, s: 1.6 },
    { type: 'door', x: 0, z: 18, rot: Math.PI, glow: '#ffffff', goal: true, r: 1.6, text: '눈을 뜨면, 원래 꿈으로 돌아간다.' },
    // ---- v7 ----
    { type: 'toypiano', x: 5, z: 5, scale: 3, act: { kind: 'toy', tone: 'piano', label: '치기', r: 2, lines: ['커다란 장난감 피아노. 건반 하나가 지금의 내 몸만 하다.', '양들이 피아노 소리에 맞춰 고개를 끄덕인다.'] } },
    { type: 'frag', x: -8, y: 1.1, z: 8, act: { kind: 'frag', frag: 'secret_sheep', fragText: '잠이 안 오는 밤에 세던 양들. 백 마리를 넘기기 전에 늘 잠들었다.' } },
  ],
};
