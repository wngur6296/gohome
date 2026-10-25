// Mood-driven look (data). The mood graph's four directions accumulate over every dream
// (x>0 고요 / x<0 일렁임 / y>0 기묘함 / y<0 익숙함). The strongest one reshapes how the SAME spaces look:
// texture variant pass (js/textures.js), material swaps, palette and post-FX nudges. Scaled by `level` (0..1).
// To add a mood look: add an entry here; the engine needs no change.
export default {
  calm: {
    label: '고요', axis: ['x', 1],
    hint: '고요가 쌓이고 있다. 다음 꿈은 소리가 줄고, 색이 옅어지고, 벽이 부드러워질 것 같다.',
    tex: { tint: [196, 214, 236], tintAmt: .28, soften: .55, pattern: 'mist', contrast: .8 },
    swap: { wallpaper: 'wallpaper', facepaper: 'wallpaper2' },
    palette: { satMul: .78, hueAdd: .03, fogFarMul: 1.35 }, post: { grain: .55, wobble: .6, aber: .6, bloom: 1.15 },
  },
  sway: {
    label: '일렁임', axis: ['x', -1],
    hint: '일렁임이 쌓이고 있다. 다음 꿈은 벽과 바닥이 물결처럼 흔들리고, 빛이 수면처럼 아른거릴 것 같다.',
    tex: { tint: [150, 214, 226], tintAmt: .22, wave: 3.2, pattern: 'caustic', contrast: 1.05 },
    swap: {},
    palette: { satMul: 1.1, hueAdd: -.04, fogFarMul: .9 }, post: { grain: 1, wobble: 2.4, aber: 1.6, bloom: 1.1 }, warpAdd: .25,
  },
  familiar: {
    label: '익숙함', axis: ['y', -1],
    hint: '익숙함이 쌓이고 있다. 다음 꿈은 오래된 집처럼 따뜻한 빛바랜 색, 낡은 얼룩과 크레파스 낙서가 보일 것 같다.',
    tex: { tint: [238, 206, 160], tintAmt: .3, pattern: 'worn', contrast: .95 },
    swap: { facepaper: 'wallpaper2', eyestars: 'stars' },
    palette: { satMul: .92, hueAdd: .06, fogFarMul: 1.1 }, post: { grain: 1.4, wobble: .8, aber: .8, bloom: 1.05 },
  },
  strange: {
    label: '기묘함', axis: ['y', 1],
    hint: '기묘함이 쌓이고 있다. 다음 꿈은 무늬 사이로 눈이 생기고, 색이 뒤바뀌고, 익숙한 방이 조금 틀어질 것 같다.',
    tex: { tint: [200, 150, 220], tintAmt: .2, pattern: 'eyes', invert: .25, contrast: 1.2 },
    swap: { wallpaper: 'wallpaper2', plain: 'checkerfaint' },
    palette: { satMul: 1.2, hueAdd: .12, fogFarMul: .85 }, post: { grain: 1.3, wobble: 1.8, aber: 2, bloom: 1.2 }, warpAdd: .2,
  },
};
