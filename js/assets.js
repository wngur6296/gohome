// Asset URL map. tools/build_single.mjs swaps these for inline data URIs.
const A = p => new URL('../assets/' + p, import.meta.url).href;
export const ASSETS = {
  img: { title: A('img/title.jpg'), ch1: A('img/ch1.jpg'), ch2: A('img/ch2.jpg'), ch3: A('img/ch3.jpg'), ch4: A('img/ch4.jpg'), ch5: A('img/ch5.jpg'), ch6: A('img/ch6.jpg'), ch7: A('img/ch7.jpg'), ch8: A('img/ch8.jpg'), icon: A('img/icon-192.png') },
  audio: Object.fromEntries(['title', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'secret', 'step0', 'step1', 'step2', 'chime', 'link', 'secret_found', 'wake'].map(n => [n, A('audio/' + n + '.m4a')])),
};
