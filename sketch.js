// 円環のモチーフにハーフトーンと RGB のずれをかけるポスター（assets/sound_1104.svg）
// モチーフ以外は SVG のまま。SVG の地の色を「紙」、それ以外を「墨」として、背景の白 / 黒に合わせて塗り直す
// 静止画なので、値を変えたときだけ描き直す（noLoop + redraw）
// 開いたときは、いつも初期値（DEFAULTS）から始まる

// エフェクトなしの値。プリセットは、これに書いた項目だけを上書きする
const BASE = {
  // ハーフトーン
  htOn: false,
  htShape: 'circle',
  htPitch: 10,
  htAngle: 45,
  htSize: 1,
  htBlur: 6,
  gradAmount: 0,
  gradStart: 0,
  gradDir: 'center',
  // RGB のずれ
  rgbOn: false,
  rgbAmount: 6,
  rgbAngle: 0,
  color1: '#00ffff',
  color2: '#ff00ff',
  color3: '#ffff00',
  // 色（虹色）。none / cd / holo / spectro
  colorMode: 'none',
  colorStrength: 1,
  cdRepeat: 3,
  cdRotate: 0,
  cd1: '#8c84c4',
  cd2: '#6fd0c0',
  cd3: '#b9a4dc',
  cd4: '#e6a2cf',
  holoScale: 400,
  holoWarp: 1.5,
  holoBands: 3,
  holoSeed: 1,
  holo1: '#ff3fa4',
  holo2: '#7a2cff',
  holo3: '#2c46ff',
  holo4: '#ff8a3d',
  spec1: '#1e2a9e',
  spec2: '#7b2fd8',
  spec3: '#ff2fb0',
  spec4: '#ff3a3a',
  // 背景。white / black（文字・ロゴ・モチーフは白）/ silver（CD のような銀）。SVG の地が黒なので黒から始める
  bgMode: 'black',
  silverTone: 0.6,
  silverSheen: 0.6,
  silverSpokes: 2,
  silverRotate: 20,
  silverRainbow: 0.35,
};

// 初期値（開いたときと「初期値に戻す」の値）。パネルで調整した値を、エフェクトなしの値に重ねる
const DEFAULTS = {
  ...BASE,
  htOn: true,
  htShape: 'circle',
  htPitch: 2,
  htAngle: 3,
  htSize: 1.5,
  htBlur: 0,
  gradAmount: 0.68,
  gradStart: 0,
  gradDir: 'center',
  rgbOn: false,
  rgbAmount: 17,
  rgbAngle: -67,
  colorMode: 'none',
  colorStrength: 0.57,
  cdRepeat: 4,
  cdRotate: 360,
  bgMode: 'black',
};

// プリセット（パネルの「プリセット」から読み込む。書いていない項目はエフェクトなしの値になる）
// 増やすときは、パネルの「値をコピー（JSON）」で出した値を、名前をつけてここに足す
// 1〜4 は背景が白だったころに作ったので、背景を白に決めておく
const PRESETS = {
  'プリセット 1': {
    bgMode: 'white',
    htOn: true,
    htShape: 'line',
    htPitch: 13.5,
    htAngle: 11,
    htSize: 0.24,
    htBlur: 0,
    rgbOn: true,
    rgbAmount: 26.5,
    rgbAngle: 180,
    color1: '#00ffff',
    color2: '#ff00ff',
    color3: '#ffff00',
  },
  'プリセット 2': {
    bgMode: 'white',
    htOn: true,
    htShape: 'line',
    htPitch: 27,
    htAngle: 0,
    htSize: 0.95,
    htBlur: 40,
    gradAmount: 0.63,
    gradStart: 0,
    gradDir: 'center',
    rgbOn: true,
    rgbAmount: 60,
    rgbAngle: 0,
    color1: '#00ffff',
    color2: '#ff00ff',
    color3: '#ffff00',
  },
  'プリセット 3': {
    bgMode: 'white',
    htOn: true,
    htShape: 'line',
    htPitch: 27,
    htAngle: 0,
    htSize: 0.95,
    htBlur: 0,
    gradAmount: 0.33,
    gradStart: 0.86,
    gradDir: 'outside',
    rgbOn: true,
    rgbAmount: 60,
    rgbAngle: 0,
    color1: '#00ffff',
    color2: '#ff00ff',
    color3: '#ffff00',
  },
  'プリセット 4': {
    bgMode: 'white',
    htOn: true,
    htShape: 'line',
    htPitch: 44,
    htAngle: 43,
    htSize: 0.53,
    htBlur: 19,
    gradAmount: 0,
    gradStart: 0.2,
    gradDir: 'center',
    rgbOn: true,
    rgbAmount: 14.5,
    rgbAngle: -180,
    color1: '#00ffff',
    color2: '#ff00ff',
    color3: '#ffff00',
  },
  'プリセット 5': {
    htOn: true,
    htShape: 'circle',
    htPitch: 52,
    htAngle: 11,
    htSize: 0.55,
    htBlur: 20,
    gradAmount: 0.43,
    gradStart: 0.74,
    gradDir: 'outside',
    rgbOn: true,
    rgbAmount: 13,
    rgbAngle: -51,
    color1: '#00ffff',
    color2: '#ff00ff',
    color3: '#ffff00',
    colorMode: 'cd',
    colorStrength: 0.1,
    cdRepeat: 7,
    cdRotate: 133,
    cd1: '#9c98bc',
    cd2: '#78ffe8',
    cd3: '#6d588f',
    cd4: '#b57ba1',
    bgMode: 'silver',
    silverTone: 1,
    silverSheen: 0.17,
    silverSpokes: 3,
    silverRotate: 235,
    silverRainbow: 0.03,
  },
  'プリセット 6': {
    htOn: false,
    rgbOn: false,
    rgbAmount: 11.5,
    rgbAngle: -35,
    colorMode: 'holo',
    colorStrength: 1,
    holoBands: 6.5,
    holoSeed: 15,
    holo1: '#f891c7',
    holo2: '#e2e2e2',
    holo3: '#6470c5',
    holo4: '#6bcfa4',
    bgMode: 'silver',
    silverTone: 1,
    silverSheen: 0.58,
    silverSpokes: 2,
    silverRotate: 8,
    silverRainbow: 0,
  },
  'プリセット 7': {
    htOn: true,
    htShape: 'circle',
    htPitch: 7,
    htAngle: 34,
    htSize: 0.29,
    htBlur: 0,
    gradStart: 0.38,
    rgbOn: true,
    rgbAmount: 30,
    rgbAngle: -74,
    colorMode: 'cd',
    colorStrength: 0.6,
    bgMode: 'black',
    silverTone: 1,
    silverSheen: 0,
    silverSpokes: 1,
    silverRotate: 0,
    silverRainbow: 0,
  },
  'プリセット 8': {
    htOn: true,
    htShape: 'circle',
    htPitch: 2,
    htAngle: 3,
    htSize: 0.95,
    htBlur: 0,
    gradAmount: 1,
    gradStart: 0,
    gradDir: 'center',
    rgbOn: false,
    rgbAmount: 35,
    rgbAngle: -67,
    colorMode: 'none',
    colorStrength: 0.57,
    cdRepeat: 4,
    cdRotate: 360,
    bgMode: 'black',
  },
};

const SVG_PATH = 'assets/sound_1104.svg';
// 文字の図形（tools/outline_text.py で SVG から作る）。フォントを持たない PC でも同じ形で出すため
const OUTLINES_PATH = 'assets/text_outlines.json';
const EXPORT_DPI = 300;
const P = { ...DEFAULTS };
let uiWidth = 0;

let svgLines;
let textOutlines;
let poster;
const canvases = {}; // 画面に出ない下書き用キャンバス（網点・モチーフの型・色版）
// パーツの表示・非表示（ロゴと、文字の各行）。文字の行は SVG を読んだあとに足す
const show = { logo: true };
let toneCache = { key: '', fn: null };
let htCells = { key: '', rows: [] };
let htLayerKey = '';
let fieldCache = { key: '', field: null };

function preload() {
  svgLines = loadStrings(SVG_PATH);
  textOutlines = loadJSON(OUTLINES_PATH);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  poster = parsePoster(svgLines.join('\n'));
  for (const line of poster.lines) show[line.key] = true;
  window.addVisibility?.(poster.lines);
  noLoop();
}

function draw() {
  // ポスターの外は、ポスターの地と逆の色にして、用紙の端が見えるようにする（黒地なら白、白地・銀なら黒）
  background(isDark() ? 255 : 0);
  renderPoster(drawingContext, screenMatrix());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function applyPreset(name) {
  Object.assign(P, BASE, PRESETS[name]);
}

// ---- SVG を読む ----

// 円環のモチーフ = 同じ点から伸びる扇形（6 本以上）と、その点を中心とする円
// それ以外の path / rect / circle はそのまま描く。text は文字
function parsePoster(text) {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = document.importNode(doc.documentElement, true);
  // 線の太さや字間を CSS から読むため、見えない場所に一時的に置く
  const holder = document.createElement('div');
  holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
  holder.appendChild(svg);
  document.body.appendChild(holder);

  const css = (el) => getComputedStyle(el);
  const isNone = (c) => c === 'none';
  const isLight = (c) => {
    const [r, g, b] = (c.match(/\d+(\.\d+)?/g) || [0, 0, 0]).map(Number);
    return 0.299 * r + 0.587 * g + 0.114 * b > 127.5;
  };
  const vb = svg.viewBox.baseVal;

  // 用紙全体を覆う四角 = 背景。その色を「紙」とし、同じ明るさの図形も紙の色で塗る（ほかは墨）
  const covers = (el) => {
    const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((a) => parseFloat(el.getAttribute(a)) || 0);
    return x <= vb.x && y <= vb.y && x + w >= vb.x + vb.width && y + h >= vb.y + vb.height;
  };
  const backEl = [...svg.querySelectorAll('rect')].find((el) => covers(el) && !isNone(css(el).fill));
  const paperLight = backEl ? isLight(css(backEl).fill) : true;
  const toItem = (el, path) => {
    const cs = css(el);
    return {
      path,
      fill: !isNone(cs.fill),
      stroke: isNone(cs.stroke) ? 0 : parseFloat(cs.strokeWidth) || 1,
      paper: isLight(isNone(cs.fill) ? cs.stroke : cs.fill) === paperLight,
    };
  };

  // モチーフの中心を探す
  const starts = new Map();
  for (const el of svg.querySelectorAll('path')) {
    const [x, y] = numbers(el.getAttribute('d'));
    const key = `${x},${y}`;
    starts.set(key, (starts.get(key) || 0) + 1);
  }
  const [centerKey, count] = [...starts].sort((a, b) => b[1] - a[1])[0] || ['0,0', 0];
  const [cx, cy] = centerKey.split(',').map(Number);
  const inMotif = (el) => {
    if (count < 6) return false;
    if (el.tagName === 'path') return numbers(el.getAttribute('d')).slice(0, 2).join(',') === centerKey;
    if (el.tagName === 'circle') {
      return Math.hypot(parseFloat(el.getAttribute('cx')) - cx, parseFloat(el.getAttribute('cy')) - cy) < 1;
    }
    return false;
  };

  const out = { view: { x: vb.x, y: vb.y, w: vb.width, h: vb.height }, items: [], motif: { cx, cy, items: [], bbox: null }, texts: [] };
  const bbox = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };

  for (const el of svg.querySelectorAll('path, rect, circle')) {
    let path;
    let rect = null;
    if (el.tagName === 'path') path = new Path2D(el.getAttribute('d'));
    else if (el.tagName === 'rect') {
      path = new Path2D();
      const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((a) => parseFloat(el.getAttribute(a)) || 0);
      path.rect(x, y, w, h);
      rect = { x, y, w, h };
    } else {
      path = new Path2D();
      const [ccx, ccy, r] = ['cx', 'cy', 'r'].map((a) => parseFloat(el.getAttribute(a)));
      path.arc(ccx, ccy, r, 0, Math.PI * 2);
    }
    const item = toItem(el, path);
    if (el === backEl) item.background = rect; // 銀にするときは、ここを銀に置き換える
    if (inMotif(el)) {
      out.motif.items.push(item);
      const b = el.getBBox();
      const m = item.stroke / 2;
      bbox.x0 = Math.min(bbox.x0, b.x - m);
      bbox.y0 = Math.min(bbox.y0, b.y - m);
      bbox.x1 = Math.max(bbox.x1, b.x + b.width + m);
      bbox.y1 = Math.max(bbox.y1, b.y + b.height + m);
    } else {
      item.logo = !item.background; // 背景とモチーフ以外の図形 = ロゴ
      out.items.push(item);
    }
  }
  out.motif.bbox = { x: bbox.x0, y: bbox.y0, w: bbox.x1 - bbox.x0, h: bbox.y1 - bbox.y0 };

  for (const el of svg.querySelectorAll('text')) {
    const m = el.transform.baseVal.consolidate()?.matrix;
    const cs = css(el);
    const size = parseFloat(cs.fontSize);
    const family = cs.fontFamily.includes('Hira') ? 'hiragino' : cs.fontFamily.includes('Futura') ? 'futura' : 'abc';
    const font = {
      hiragino: `600 ${size}px "Hiragino Kaku Gothic ProN", "Hiragino Sans"`,
      futura: `500 ${size}px Futura`,
      abc: `500 ${size}px "ABC Walter Neue"`,
    }[family];
    const spans = [...el.querySelectorAll('tspan')];
    const spacing = (node) => (css(node).letterSpacing === 'normal' ? '0px' : css(node).letterSpacing);
    // tspan ごとに SVG と同じ位置・字間で置く。MoN の行だけは 1 行で組み直す
    const parts = el.textContent.includes('Mon Takanawa')
      ? [[0, el.textContent.replace('Mon Takanawa', 'MoN Takanawa'), '0px']]
      : (spans.length ? spans : [el]).map((s) => [parseFloat(s.getAttribute('x')) || 0, s.textContent, spacing(s)]);
    // 文字の図形を足す（[x, 文字, 字間, 図形]）。図形がない文字は PC のフォントで描く
    for (const part of parts) {
      const d = textOutlines.outlines?.[`${family}|${size.toFixed(2)}|${parseFloat(part[2]).toFixed(2)}|${part[1]}`];
      part.push(d === undefined ? null : new Path2D(d));
      if (d === undefined) console.warn(`文字の図形がありません（tools/outline_text.py を実行し直す）: ${part[1]}`);
    }
    // Illustrator でグループにした文字（レイヤー直下ではない <g> の中）は、まとめて 1 つのパーツにする
    const parent = el.parentElement;
    out.texts.push({
      x: m ? m.e : 0,
      y: m ? m.f : 0,
      font,
      parts,
      group: parent !== svg && parent.parentElement !== svg ? parent : el,
    });
  }

  // 文字のパーツ（表示・非表示の単位）を上から順に並べる。名前はパーツの文字から付ける
  // パネルの名前の欄（半角 16 文字ぶん）に収まるよう、長い名前は切って「…」にする（全角は 2 文字ぶん）
  // 同じ文字が上下 2 か所にあるときは（上）（下）を付けて見分ける
  const width = (s) => [...s].reduce((w, ch) => w + (/[^\x00-\x7f]/.test(ch) ? 2 : 1), 0);
  const fit = (s, max) => {
    if (width(s) <= max) return s;
    let cut = '';
    for (const ch of s) {
      if (width(cut + ch) > max - 1) break;
      cut += ch;
    }
    return `${cut}…`;
  };
  const groups = [...new Set(out.texts.map((t) => t.group))].map((group) =>
    out.texts.filter((t) => t.group === group).sort((a, b) => a.x - b.x)
  );
  groups.sort((a, b) => a[0].y - b[0].y || a[0].x - b[0].x);
  out.lines = groups.map((texts, i) => {
    for (const t of texts) t.line = `text${i + 1}`;
    return { key: `text${i + 1}`, name: texts.map((t) => t.parts.map((p) => p[1]).join('')).join(' ') };
  });
  for (const line of out.lines) {
    const same = out.lines.filter((l) => l.name === line.name);
    const tag = same.length < 2 ? '' : same.length === 2 ? (same[0] === line ? '（上）' : '（下）') : `（${same.indexOf(line) + 1}）`;
    line.label = fit(line.name, 16 - width(tag)) + tag;
  }

  holder.remove();
  return out;
}

function numbers(str) {
  return (str.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
}

// ---- 描画 ----

// pt → 画面のピクセル。パネルのぶんを除いた範囲に、上下左右へ SCREEN_MARGIN の余白を残してポスター全体を収める
const SCREEN_MARGIN = 24;

function screenMatrix() {
  const b = poster.view;
  const d = pixelDensity();
  const w = width - uiWidth;
  const s = Math.min((w - SCREEN_MARGIN * 2) / b.w, (height - SCREEN_MARGIN * 2) / b.h);
  return new DOMMatrix([s * d, 0, 0, s * d, (w / 2 - s * (b.x + b.w / 2)) * d, (height / 2 - s * (b.y + b.h / 2)) * d]);
}

// ポスター全体を g に描く。m は pt → g のピクセルへの変換（画面でも、書き出し用の大きなキャンバスでも同じ処理）
// backgroundOnly のときは背景（白 / 銀）だけを描く
function renderPoster(g, m, { backgroundOnly = false } = {}) {
  g.save();
  g.setTransform(m);
  for (const item of poster.items) {
    if (item.background && P.bgMode === 'silver') drawSilver(g, item.background);
    else if (item.background) drawItem(g, item, paperColor());
    else if (!backgroundOnly && (!item.logo || show.logo)) drawItem(g, item, item.paper ? paperColor() : inkColor());
  }
  if (!backgroundOnly) {
    drawMotif(g);
    drawText(g);
  }
  g.restore();
}

// 銀の背景（CD のような金属の反射）。円環モチーフの中心を CD の中心にする
// 1. 地の銀：明るい所と暗い所がゆるやかに入れ替わる（周りの景色の映り込み）
// 2. 光の筋：中心のまわりで明暗が放射状に入れ替わる（オーバーレイ）
// 3. 虹のにじみ：光の筋の 1 周期ごとに七色をめぐる（ソフトライト）
function drawSilver(g, r) {
  const { cx, cy } = poster.motif;
  const gray = (v) => `rgb(${v},${v},${v})`;
  const L = P.silverTone;
  const n = Math.max(1, Math.round(P.silverSpokes));
  g.save();

  const base = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
  base.addColorStop(0, gray(Math.round(lerp(190, 245, L))));
  base.addColorStop(0.45, gray(Math.round(lerp(140, 205, L))));
  base.addColorStop(0.7, gray(Math.round(lerp(185, 240, L))));
  base.addColorStop(1, gray(Math.round(lerp(130, 195, L))));
  g.fillStyle = base;
  g.fillRect(r.x, r.y, r.w, r.h);

  const spokes = g.createConicGradient(radians(P.silverRotate), cx, cy);
  const tones = [255, 128, 40, 128];
  for (let i = 0; i <= n * 4; i++) spokes.addColorStop(i / (n * 4), gray(tones[i % 4]));
  g.globalCompositeOperation = 'overlay';
  g.globalAlpha = P.silverSheen;
  g.fillStyle = spokes;
  g.fillRect(r.x, r.y, r.w, r.h);

  const rainbow = g.createConicGradient(radians(P.silverRotate), cx, cy);
  const HUES = 12;
  for (let i = 0; i <= n * HUES; i++) rainbow.addColorStop(i / (n * HUES), `hsl(${(i % HUES) * (360 / HUES)}, 90%, 60%)`);
  g.globalCompositeOperation = 'soft-light';
  g.globalAlpha = P.silverRainbow;
  g.fillStyle = rainbow;
  g.fillRect(r.x, r.y, r.w, r.h);

  g.restore();
}

// SVG の 1 要素を描く（塗りと線）
function drawItem(g, item, color) {
  g.save();
  g.lineCap = 'butt';
  g.lineJoin = 'miter';
  g.miterLimit = 10;
  if (item.fill) {
    g.fillStyle = color;
    g.fill(item.path);
  }
  if (item.stroke) {
    g.strokeStyle = color;
    g.lineWidth = item.stroke;
    g.stroke(item.path);
  }
  g.restore();
}

// 墨（文字・ロゴ・モチーフ）と紙（背景）の色。背景が黒のときは入れ替える
function isDark() {
  return P.bgMode === 'black';
}

function inkColor() {
  return isDark() ? '#fff' : '#000';
}

function paperColor() {
  return isDark() ? '#000' : '#fff';
}

// モチーフを g に color で描く（ハーフトーンなら網点の画像、そうでなければ SVG のままの画像を貼る）
function paintMotif(g, color) {
  // どちらの画像も g の今の座標で作るので、座標を戻す前に用意する
  const layer = P.htOn ? halftoneLayer(g, color) : motifLayer(g, color);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(layer, 0, 0);
  g.restore();
}

// モチーフの図形を SVG の順に描く。紙の色の図形（黒地の SVG で黒く塗った扇形など）は、それまでに描いた墨を消して穴にする
// 穴からは下の背景（白・黒・銀）が見える
function drawShapes(g, color) {
  for (const item of poster.motif.items) {
    g.globalCompositeOperation = item.paper ? 'destination-out' : 'source-over';
    drawItem(g, item, color);
  }
  g.globalCompositeOperation = 'source-over';
}

// SVG のままのモチーフを、描き先と同じ解像度の下書き用キャンバスに描く（穴を開けるため、描き先には直接描かない）
function motifLayer(target, color) {
  const g = offscreen('motif', target.canvas);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.setTransform(target.getTransform());
  drawShapes(g, color);
  return g.canvas;
}

// モチーフ：別のキャンバスに「紙の色の地＋墨のモチーフ（RGB のずれ）＋虹色」を作ってから重ねる
// 白地は乗算、黒地はスクリーンで重ねる。どちらも紙の色は下の絵を変えないので、モチーフ以外（文字・ロゴ）はそのまま
function drawMotif(g) {
  if (!P.rgbOn && P.colorMode === 'none') {
    paintMotif(g, inkColor());
    return;
  }
  const m = g.getTransform();
  const art = offscreen('art', g.canvas);
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.globalCompositeOperation = 'source-over';
  art.globalAlpha = 1;
  art.fillStyle = paperColor();
  art.fillRect(0, 0, art.canvas.width, art.canvas.height);
  art.setTransform(m);
  if (P.rgbOn) shiftColors(art);
  else paintMotif(art, inkColor());
  if (P.colorMode !== 'none') colorize(art);

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = isDark() ? 'screen' : 'multiply';
  g.drawImage(art.canvas, 0, 0);
  g.restore();
}

// RGB のずれ：モチーフを別のキャンバスに描き、3 色に染めてずらしながら重ねる
// 白地は乗算（3 色が重なる所は黒）、黒地はスクリーン（3 色が重なる所は白）
// 初期のシアン・マゼンタ・イエローなら、白地で RGB チャンネルをずらしたのと同じ見え方
function shiftColors(g) {
  const m = g.getTransform();
  const mask = offscreen('mask', g.canvas);
  mask.setTransform(1, 0, 0, 1, 0, 0);
  mask.clearRect(0, 0, mask.canvas.width, mask.canvas.height);
  mask.setTransform(m);
  paintMotif(mask, '#000');

  const tint = offscreen('tint', g.canvas);
  const step = P.rgbAmount * Math.hypot(m.a, m.b);
  const a = radians(P.rgbAngle);
  [P.color1, P.color2, P.color3].forEach((color, i) => {
    tint.globalCompositeOperation = 'copy';
    tint.drawImage(mask.canvas, 0, 0);
    tint.globalCompositeOperation = 'source-in';
    tint.fillStyle = color;
    tint.fillRect(0, 0, tint.canvas.width, tint.canvas.height);
    const k = i - 1; // -1, 0, +1
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = isDark() ? 'screen' : 'multiply';
    g.drawImage(tint.canvas, k * step * Math.cos(a), k * step * Math.sin(a));
    g.restore();
  });
}

// ---- 色（虹色） ----

// 虹色を重ねる。白地はスクリーン（黒いモチーフがその色になり、白は白のまま）、
// 黒地は乗算（白いモチーフがその色になり、黒は黒のまま）。どちらもモチーフの部分だけが色になる
// cd      : モチーフの中心のまわりを一周する虹色（CD の放射状の筋）
// holo    : ゆらいだ縞のマーブル（ホログラムのワッペン）
// spectro : 濃さで色が変わる（スペクトログラム。薄い = 色 1 → 濃い = 色 4）
function colorize(g) {
  const { cx, cy, bbox } = poster.motif;
  const pad = (P.rgbOn ? P.rgbAmount : 0) + 20;
  g.save();
  g.globalCompositeOperation = isDark() ? 'multiply' : 'screen';
  g.globalAlpha = P.colorStrength;
  if (P.colorMode === 'cd') {
    const grad = g.createConicGradient(radians(P.cdRotate - 90), cx, cy);
    const cols = [P.cd1, P.cd2, P.cd3, P.cd4];
    const n = Math.max(1, Math.round(P.cdRepeat)) * cols.length;
    for (let i = 0; i <= n; i++) grad.addColorStop(i / n, cols[i % cols.length]);
    g.fillStyle = grad;
    g.fillRect(bbox.x - pad, bbox.y - pad, bbox.w + pad * 2, bbox.h + pad * 2);
  } else {
    const field = colorField(pad);
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    g.drawImage(field.canvas, field.x, field.y, field.w, field.h);
  }
  g.restore();
}

// ホログラムとスペクトログラムの色の画像（4pt に 1 画素の粗さで作り、なめらかに引き伸ばして使う）
function colorField(pad) {
  const STEP = 4;
  const { bbox } = poster.motif;
  const x = bbox.x - pad;
  const y = bbox.y - pad;
  const W = Math.ceil((bbox.w + pad * 2) / STEP);
  const H = Math.ceil((bbox.h + pad * 2) / STEP);
  const holo = P.colorMode === 'holo';
  const key = holo
    ? ['holo', x, y, W, H, P.holoScale, P.holoWarp, P.holoBands, P.holoSeed, P.holo1, P.holo2, P.holo3, P.holo4].join()
    : ['spec', x, y, W, H, toneKey(), P.spec1, P.spec2, P.spec3, P.spec4].join();
  if (fieldCache.key === key) return fieldCache.field;

  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const img = c.getContext('2d').createImageData(W, H);
  const cols = (holo ? [P.holo1, P.holo2, P.holo3, P.holo4] : [P.spec1, P.spec2, P.spec3, P.spec4]).map(rgbOf);
  const tone = holo ? null : toneMap();
  noiseSeed(P.holoSeed);
  const s = 1 / P.holoScale;
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const px = x + (i + 0.5) * STEP;
      const py = y + (j + 0.5) * STEP;
      let rgb;
      if (holo) {
        // 位置をノイズでゆがめてから、もう一度ノイズを引く → 流れるような縞になる
        const wx = noise(px * s, py * s, 0) - 0.5;
        const wy = noise(px * s, py * s, 10) - 0.5;
        const v = noise(px * s + P.holoWarp * wx * 2, py * s + P.holoWarp * wy * 2, 20);
        rgb = cyclePalette(cols, (v * P.holoBands) % 1);
      } else {
        rgb = rampPalette(cols, tone(px, py));
      }
      const o = (j * W + i) * 4;
      img.data[o] = rgb[0];
      img.data[o + 1] = rgb[1];
      img.data[o + 2] = rgb[2];
      img.data[o + 3] = 255;
    }
  }
  c.getContext('2d').putImageData(img, 0, 0);
  const field = { canvas: c, x, y, w: W * STEP, h: H * STEP };
  fieldCache = { key, field };
  return field;
}

function rgbOf(hex) {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const mixRGB = (a, b, t) => [0, 1, 2].map((k) => Math.round(a[k] + (b[k] - a[k]) * t));

// 4 色を順にめぐって最初の色に戻る（t = 0〜1）
function cyclePalette(cols, t) {
  const f = ((t % 1) + 1) % 1 * cols.length;
  const i = Math.floor(f);
  return mixRGB(cols[i], cols[(i + 1) % cols.length], smoothstep(0, 1, f - i));
}

// 色 1 → 色 4 へ一方向に変わる（t = 0〜1）
function rampPalette(cols, t) {
  const f = constrain(t, 0, 1) * (cols.length - 1);
  const i = Math.min(cols.length - 2, Math.floor(f));
  return mixRGB(cols[i], cols[i + 1], f - i);
}

// 描き先と同じ大きさの下書き用キャンバス
function offscreen(name, like) {
  const c = (canvases[name] ??= document.createElement('canvas'));
  if (c.width !== like.width || c.height !== like.height) {
    c.width = like.width;
    c.height = like.height;
  }
  return c.getContext('2d');
}

function toneKey() {
  return [P.htBlur, P.gradAmount, P.gradStart, P.gradDir].join();
}

// モチーフの濃さ（0〜1）を pt の位置から引く関数。モチーフを htBlur でぼかした濃さに、グラデーションをかける
// グラデーションは、モチーフの中心からの距離に合わせて濃さを弱める（中心が濃い / 外が濃い）
// ハーフトーンの網点の大きさと、スペクトログラムの色の両方に使う
function toneMap() {
  const key = toneKey();
  if (toneCache.key === key) return toneCache.fn;

  const { cx, cy, bbox } = poster.motif;
  const pad = Math.ceil(P.htBlur * 3) + 2; // ぼかしが広がりきる幅（標準偏差の 3 倍）
  const x0 = Math.floor(bbox.x) - pad;
  const y0 = Math.floor(bbox.y) - pad;
  const W = Math.ceil(bbox.w) + pad * 2;
  const H = Math.ceil(bbox.h) + pad * 2;

  const sharp = document.createElement('canvas');
  sharp.width = W;
  sharp.height = H;
  const gs = sharp.getContext('2d');
  gs.translate(-x0, -y0);
  drawShapes(gs, '#000');

  const soft = document.createElement('canvas');
  soft.width = W;
  soft.height = H;
  const gb = soft.getContext('2d', { willReadFrequently: true });
  gb.fillStyle = '#fff';
  gb.fillRect(0, 0, W, H);
  gb.filter = P.htBlur > 0 ? `blur(${P.htBlur}px)` : 'none';
  gb.drawImage(sharp, 0, 0);
  const data = gb.getImageData(0, 0, W, H).data;
  const dark = (x, y) => {
    const ix = Math.round(x - x0);
    const iy = Math.round(y - y0);
    if (ix < 0 || iy < 0 || ix >= W || iy >= H) return 0;
    return 1 - data[(iy * W + ix) * 4] / 255;
  };
  const radius = Math.max(bbox.w, bbox.h) / 2;
  const fade = (rho) => {
    const k = P.gradDir === 'outside' ? 1 - rho : rho;
    return 1 - P.gradAmount * smoothstep(P.gradStart, 1, k);
  };
  const fn = (x, y) => dark(x, y) * fade(Math.min(1, Math.hypot(x - cx, y - cy) / radius));
  toneCache = { key, fn };
  return fn;
}

// ハーフトーンの濃さ：モチーフの中心を原点にした回転格子の点ごとに、toneMap の濃さを測る
// 結果は格子の行ごとの [列番号, 濃さ] の並び。単位は pt なので、画面の大きさを変えても測り直さない
function halftoneCells() {
  const key = [P.htPitch, P.htAngle, toneKey()].join();
  if (htCells.key === key) return htCells.rows;

  const tone = toneMap();
  const { cx, cy, bbox } = poster.motif;
  const p = P.htPitch;
  const a = radians(P.htAngle);
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const n = Math.ceil(Math.hypot(bbox.w, bbox.h) / 2 / p) + 2;
  const rows = [];
  for (let j = -n; j <= n; j++) {
    const cells = [];
    for (let i = -n; i <= n; i++) {
      const u = i * p;
      const v = j * p;
      const d = tone(cx + u * ca - v * sa, cy + u * sa + v * ca);
      if (d >= 0.01) cells.push([i, d]);
    }
    if (cells.length) rows.push({ j, cells });
  }
  htCells = { key, rows };
  return rows;
}

// 網点を、描き先と同じ解像度の下書き用キャンバスに描いておき、そのまま貼る
// 網点を何十万個も 1 つのパスにまとめると、塗りが極端に重くなってブラウザが固まるため、行ごと・1 個ずつ塗る
// 格子に合わせて回した座標で描くので、四角は fillRect、線は行ごとの帯で済む
// 四角と線は隣どうしが辺で接するので、境目に白い筋が出ないよう 0.5 ピクセルぶん大きく描く
function halftoneLayer(target, color) {
  const rows = halftoneCells();
  const m = target.getTransform();
  const g = offscreen('halftone', target.canvas);
  const key = [htCells.key, P.htShape, P.htSize, color, m.a, m.b, m.c, m.d, m.e, m.f, g.canvas.width, g.canvas.height].join();
  if (key === htLayerKey) return g.canvas;
  htLayerKey = key;

  const p = P.htPitch;
  const grow = 0.5 / Math.hypot(m.a, m.b);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.setTransform(m);
  g.translate(poster.motif.cx, poster.motif.cy);
  g.rotate(radians(P.htAngle));
  g.fillStyle = color;

  // 線：続いている網点を、濃さに合わせて太さが変わる帯 1 本にする
  const band = (run, v) => {
    const half = ([, d]) => (p * P.htSize * d) / 2 + grow;
    const first = run[0];
    const last = run[run.length - 1];
    const pts = [[first[0] * p - p / 2, half(first)], ...run.map((c) => [c[0] * p, half(c)]), [last[0] * p + p / 2, half(last)]];
    g.beginPath();
    g.moveTo(pts[0][0], v - pts[0][1]);
    for (const [u, t] of pts.slice(1)) g.lineTo(u, v - t);
    for (const [u, t] of pts.reverse()) g.lineTo(u, v + t);
    g.closePath();
    g.fill();
  };

  for (const { j, cells } of rows) {
    const v = j * p;
    if (P.htShape === 'square') {
      for (const [i, d] of cells) {
        const r = (p / 2) * P.htSize * Math.sqrt(d) + grow;
        g.fillRect(i * p - r, v - r, 2 * r, 2 * r);
      }
    } else if (P.htShape === 'line') {
      let run = [];
      for (const cell of cells) {
        if (run.length && cell[0] !== run[run.length - 1][0] + 1) {
          band(run, v);
          run = [];
        }
        run.push(cell);
      }
      if (run.length) band(run, v);
    } else {
      g.beginPath();
      for (const [i, d] of cells) {
        const r = p * circleRadius(d) * P.htSize;
        g.moveTo(i * p + r, v);
        g.arc(i * p, v, r, 0, Math.PI * 2);
      }
      g.fill();
    }
  }
  return g.canvas;
}

// 円の網点の半径（格子の間隔 = 1）。格子 1 マスに占める黒の割合が濃さ d と同じになるように表から引く
// 隣と接する半径 0.5 では黒は 79% までしか届かないので、濃い所は隣と重ねて、d = 1 で半径 1/√2（ベタ）にする
const CIRCLE_LUT = (() => {
  const cover = (r) => (r <= 0.5 ? Math.PI * r * r : Math.PI * r * r - 4 * (r * r * Math.acos(0.5 / r) - 0.5 * Math.sqrt(r * r - 0.25)));
  const steps = 2048;
  const lut = new Float32Array(257);
  let i = 0;
  for (let k = 0; k <= 256; k++) {
    while (i < steps && cover(((i + 1) / steps) * Math.SQRT1_2) < k / 256) i++;
    lut[k] = (i / steps) * Math.SQRT1_2;
  }
  return lut;
})();

function circleRadius(d) {
  return CIRCLE_LUT[Math.round(constrain(d, 0, 1) * 256)];
}

function smoothstep(a, b, x) {
  if (b <= a) return x < a ? 0 : 1;
  const t = constrain((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function drawText(g) {
  g.save();
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.fillStyle = inkColor();
  for (const line of poster.texts) {
    if (!show[line.line]) continue;
    g.font = line.font;
    for (const [px, str, spacing, outline] of line.parts) {
      if (outline) {
        g.save();
        g.translate(line.x + px, line.y);
        g.fill(outline);
        g.restore();
      } else {
        g.letterSpacing = spacing;
        g.fillText(str, line.x + px, line.y);
      }
    }
  }
  g.restore();
}

// ---- 書き出し（PNG・300dpi） ----

// ポスター全体を EXPORT_DPI で描いて PNG にする。A1 だと約 7000 万画素になり、一度に描くとメモリが足りなくなるので、
// 横長の帯に分けて描いてから 1 枚につなぐ。帯の上下には RGB のずれのぶんの余白をつけて描き、境目で欠けないようにする
async function exportPNG(fileName, options = {}) {
  const b = poster.view;
  const k = EXPORT_DPI / 72; // pt → px
  const W = Math.round(b.w * k);
  const H = Math.round(b.h * k);
  const full = document.createElement('canvas');
  full.width = W;
  full.height = H;
  const fg = full.getContext('2d');

  const STRIP = 1024;
  const pad = Math.ceil((P.rgbOn ? P.rgbAmount : 0) * k) + 4;
  const strip = document.createElement('canvas');
  strip.width = W;
  strip.height = STRIP + pad * 2;
  const sg = strip.getContext('2d');
  for (let y = 0; y < H; y += STRIP) {
    sg.setTransform(1, 0, 0, 1, 0, 0);
    sg.fillStyle = paperColor();
    sg.fillRect(0, 0, strip.width, strip.height);
    renderPoster(sg, new DOMMatrix([k, 0, 0, k, -b.x * k, -b.y * k - (y - pad)]), options);
    fg.drawImage(strip, 0, pad, W, STRIP, 0, y, W, STRIP);
    await new Promise((r) => setTimeout(r)); // 帯ごとに一息ついて、画面が固まりきらないようにする
  }

  const blob = await new Promise((r) => full.toBlob(r, 'image/png'));
  const png = withDpi(new Uint8Array(await blob.arrayBuffer()), EXPORT_DPI);
  download(new Blob([png], { type: 'image/png' }), fileName);
  full.width = full.height = 0; // 大きなキャンバスのメモリを早めに手放す
  strip.width = strip.height = 0;
  redraw(); // 下書き用キャンバスを画面の大きさに戻す
}

// プリセットを順に書き出す。終わったら、書き出す前の値に戻す
async function exportPresets() {
  const before = { ...P };
  const names = Object.keys(PRESETS);
  for (const [i, name] of names.entries()) {
    applyPreset(name);
    await exportPNG(`sound_1104_preset${i + 1}_${EXPORT_DPI}dpi.png`);
  }
  Object.assign(P, before);
  redraw();
}

// PNG に解像度（pHYs チャンク）を書き込む。ないと、Illustrator などで 72dpi として開かれる
function withDpi(png, dpi) {
  const ppm = Math.round(dpi / 0.0254); // 1 メートルあたりの画素数
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  chunk[16] = 1; // 単位はメートル
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const at = 33; // PNG の先頭（8 バイト）と IHDR（25 バイト）の直後
  const out = new Uint8Array(png.length + chunk.length);
  out.set(png.subarray(0, at));
  out.set(chunk, at);
  out.set(png.subarray(at), at + chunk.length);
  return out;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function download(blob, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

// ---- 操作 ----

function keyPressed(e) {
  if (e.metaKey || e.ctrlKey) return;
  const el = document.activeElement;
  if (el && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) return;
  if (key === 'h' || key === 'H') {
    window.togglePane?.();
    return false;
  }
}
