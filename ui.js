import { Pane } from './lib/tweakpane.min.js';

// sketch.js の P（パラメータ）を書き換えるパネル。値が変わったら描き直す
const PANE_WIDTH = 300;
const pane = new Pane({ title: 'Sound halftone' });
uiWidth = PANE_WIDTH + 16;

window.togglePane = () => {
  pane.hidden = !pane.hidden;
  uiWidth = pane.hidden ? 0 : PANE_WIDTH + 16;
  redraw();
};

const add = (folder, key, label, min, max, step) => folder.addBinding(P, key, { label, min, max, step });

// プリセット
const presetState = { name: Object.keys(PRESETS)[0] };
const presets = pane.addFolder({ title: 'プリセット' });
presets.addBinding(presetState, 'name', { label: '選ぶ', options: Object.fromEntries(Object.keys(PRESETS).map((k) => [k, k])) });
presets.addButton({ title: '読み込む' }).on('click', () => {
  applyPreset(presetState.name);
  pane.refresh();
  showColorParams();
  showBgParams();
});

// 表示（ロゴと文字の各行）。文字の行は SVG を読んでから分かるので、sketch.js の setup から addVisibility が呼ばれて足す
const visible = pane.addFolder({ title: '表示' });
visible.addBinding(show, 'logo', { label: 'ロゴ' });
window.addVisibility = (lines) => {
  for (const line of lines) visible.addBinding(show, line.key, { label: line.label });
};

// ハーフトーン
const ht = pane.addFolder({ title: 'ハーフトーン' });
ht.addBinding(P, 'htOn', { label: 'かける' });
ht.addBinding(P, 'htShape', { label: '網点の形', options: { 円: 'circle', 四角: 'square', 線: 'line' } });
add(ht, 'htPitch', '間隔（pt）', 2, 60, 0.5);
add(ht, 'htAngle', '角度（°）', 0, 90, 1);
add(ht, 'htSize', '大きさ', 0.1, 2, 0.01);
add(ht, 'htBlur', 'ぼかし（pt）', 0, 80, 0.5);
add(ht, 'gradAmount', 'グラデーション', 0, 1, 0.01);
add(ht, 'gradStart', 'グラデの始まり', 0, 0.95, 0.01);
ht.addBinding(P, 'gradDir', { label: 'グラデの向き', options: { 中心が濃い: 'center', 外が濃い: 'outside' } });

// RGB のずれ
const rgb = pane.addFolder({ title: 'RGB のずれ' });
rgb.addBinding(P, 'rgbOn', { label: 'かける' });
add(rgb, 'rgbAmount', 'ずれの量（pt）', 0, 120, 0.5);
add(rgb, 'rgbAngle', 'ずれの向き（°）', -180, 180, 1);
rgb.addBinding(P, 'color1', { label: '色 1', view: 'color' });
rgb.addBinding(P, 'color2', { label: '色 2', view: 'color' });
rgb.addBinding(P, 'color3', { label: '色 3', view: 'color' });

// 色（虹色）。選んだ見え方の項目だけを表示する
const color = pane.addFolder({ title: '色（虹色）' });
color
  .addBinding(P, 'colorMode', {
    label: '見え方',
    options: { なし: 'none', CD: 'cd', ホログラム: 'holo', スペクトログラム: 'spectro' },
  })
  .on('change', showColorParams);
const colorStrength = add(color, 'colorStrength', '色の強さ', 0, 1, 0.01);
const pick = (key, label) => color.addBinding(P, key, { label, view: 'color' });
const colorParams = {
  cd: [
    add(color, 'cdRepeat', '繰り返し', 1, 12, 1),
    add(color, 'cdRotate', '回転（°）', 0, 360, 1),
    pick('cd1', '色 1'),
    pick('cd2', '色 2'),
    pick('cd3', '色 3'),
    pick('cd4', '色 4'),
  ],
  holo: [
    add(color, 'holoScale', '模様の大きさ（pt）', 50, 1500, 10),
    add(color, 'holoWarp', 'ゆらぎ', 0, 4, 0.05),
    add(color, 'holoBands', '縞の数', 1, 10, 0.1),
    add(color, 'holoSeed', '模様の種類', 1, 100, 1),
    pick('holo1', '色 1'),
    pick('holo2', '色 2'),
    pick('holo3', '色 3'),
    pick('holo4', '色 4'),
  ],
  spectro: [pick('spec1', '色 1（薄い）'), pick('spec2', '色 2'), pick('spec3', '色 3'), pick('spec4', '色 4（濃い）')],
};
function showColorParams() {
  colorStrength.hidden = P.colorMode === 'none';
  for (const [mode, bindings] of Object.entries(colorParams)) for (const b of bindings) b.hidden = P.colorMode !== mode;
}
showColorParams();

// 背景。銀を選んだときだけ、銀の項目を表示する
const bg = pane.addFolder({ title: '背景' });
bg.addBinding(P, 'bgMode', { label: '背景', options: { 白: 'white', '黒（文字は白）': 'black', '銀（CD）': 'silver' } }).on('change', showBgParams);
const silverParams = [
  add(bg, 'silverTone', '明るさ', 0, 1, 0.01),
  add(bg, 'silverSheen', '反射の強さ', 0, 1, 0.01),
  add(bg, 'silverSpokes', '光の筋の数', 1, 8, 1),
  add(bg, 'silverRotate', '光の向き（°）', 0, 360, 1),
  add(bg, 'silverRainbow', '虹のにじみ', 0, 1, 0.01),
];
function showBgParams() {
  for (const b of silverParams) b.hidden = P.bgMode !== 'silver';
}
showBgParams();

// 書き出し（PNG・300dpi）。書き出している間はボタンを押せなくする
const out = pane.addFolder({ title: `書き出し（PNG・${EXPORT_DPI}dpi）` });
const exportButtons = [
  out.addButton({ title: '今の見た目を書き出す' }),
  out.addButton({ title: '全プリセットを書き出す' }),
  out.addButton({ title: '背景だけを書き出す' }),
];
const run = async (button, job) => {
  const title = button.title;
  exportButtons.forEach((b) => (b.disabled = true));
  button.title = '書き出し中…';
  try {
    await job();
  } finally {
    button.title = title;
    exportButtons.forEach((b) => (b.disabled = false));
    pane.refresh();
    showColorParams();
    showBgParams();
  }
};
exportButtons[0].on('click', () => run(exportButtons[0], () => exportPNG(`sound_1104_${EXPORT_DPI}dpi.png`)));
exportButtons[1].on('click', () => run(exportButtons[1], exportPresets));
exportButtons[2].on('click', () =>
  run(exportButtons[2], () => exportPNG(`sound_1104_background_${EXPORT_DPI}dpi.png`, { backgroundOnly: true }))
);

// 値
const save = pane.addFolder({ title: '値', expanded: false });
save.addButton({ title: '値をコピー（JSON）' }).on('click', () => {
  navigator.clipboard.writeText(JSON.stringify(P, null, 2));
});
save.addButton({ title: '初期値に戻す' }).on('click', () => {
  Object.assign(P, DEFAULTS);
  pane.refresh();
  showColorParams();
  showBgParams();
});

// スライダーを動かしている間も、描き直しは画面の更新 1 回につき 1 回まで（重い設定で処理が溜まらないように）
let pending = false;
pane.on('change', () => {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    redraw();
  });
});
