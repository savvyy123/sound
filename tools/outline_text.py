# ポスターの文字をアウトライン（図形）にして JSON に書き出す
# フォントファイルは公開サーバーに置けないので、使っている文字の形だけを図形にしてページに入れる
# sketch.js は、この JSON にある文字は図形で描き、ない文字は PC のフォントで描く
#
# 使い方（SVG の文字を変えたら、もう一度実行する）:
#   pip install uharfbuzz fonttools
#   python3 tools/outline_text.py assets/sound_1104.svg assets/text_outlines.json
#
# 字の並べ方（カーニング）は Chrome と同じ HarfBuzz で決め、字間は 1 文字ごとに足す（canvas の letterSpacing と同じ）

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

# sketch.js と同じ割り当て（SVG の font-family → この PC のフォントファイル）
FONTS = {
    'abc': (Path.home() / 'Library/Fonts/ABCWalterNeue-Medium.otf', 0),
    'futura': (Path('/System/Library/Fonts/Supplemental/Futura.ttc'), 0),  # Futura-Medium
    'hiragino': (Path('/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc'), 2),  # HiraKakuProN-W6
}
SVG = '{http://www.w3.org/2000/svg}'


def family_of(css_family):
    if 'Hira' in css_family:
        return 'hiragino'
    if 'Futura' in css_family:
        return 'futura'
    return 'abc'


# Illustrator が書き出す <style> を読む（.cls-1, .cls-3 { ... } の形）
def read_styles(root):
    styles = {}
    css = ''.join(el.text or '' for el in root.iter(f'{SVG}style'))
    for selectors, body in re.findall(r'([^{}]+)\{([^}]*)\}', css):
        props = dict(re.findall(r'([\w-]+)\s*:\s*([^;]+);?', body))
        for sel in selectors.split(','):
            styles.setdefault(sel.strip().lstrip('.'), {}).update({k: v.strip() for k, v in props.items()})
    return styles


def style_of(styles, el):
    out = {}
    for cls in (el.get('class') or '').split():
        out.update(styles.get(cls, {}))
    return out


def em(value):
    return float(value.replace('em', '')) if value and value.endswith('em') else 0.0


# sketch.js の parsePoster と同じ単位（tspan ごと。MoN の行だけは 1 行で組み直す）で、文字・大きさ・字間を集める
def text_parts(svg_path):
    root = ET.parse(svg_path).getroot()
    styles = read_styles(root)
    for el in root.iter(f'{SVG}text'):
        base = style_of(styles, el)
        family = family_of(base.get('font-family', ''))
        size = float(base.get('font-size', '16px').replace('px', ''))
        spans = list(el.iter(f'{SVG}tspan'))
        content = ''.join(el.itertext())
        if 'Mon Takanawa' in content:
            yield family, size, 0.0, content.replace('Mon Takanawa', 'MoN Takanawa')
            continue
        for s in spans or [el]:
            spacing = em(style_of(styles, s).get('letter-spacing', base.get('letter-spacing', '0em'))) * size
            yield family, size, spacing + 0.0, ''.join(s.itertext())


class Shaper:
    def __init__(self, path, index):
        blob = hb.Blob.from_file_path(str(path))
        self.font = hb.Font(hb.Face(blob, index))
        self.tt = TTFont(str(path), fontNumber=index) if str(path).endswith('.ttc') else TTFont(str(path))
        self.upem = self.tt['head'].unitsPerEm
        self.glyphs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()

    # 1 行ぶんの文字の図形（左端のベースラインが原点、単位は pt）
    # Chrome の canvas は単語ごと（スペースで区切って）に字を並べるので、スペースをまたぐカーニングはしない
    def outline(self, text, size, spacing):
        k = size / self.upem
        pen = SVGPathPen(self.glyphs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.') or '0')
        x = 0.0
        for word in re.findall(r' |[^ ]+', text):
            buf = hb.Buffer()
            buf.add_str(word)
            buf.guess_segment_properties()
            hb.shape(self.font, buf)
            infos, positions = buf.glyph_infos, buf.glyph_positions
            for i, (info, pos) in enumerate(zip(infos, positions)):
                name = self.order[info.codepoint]
                self.glyphs[name].draw(TransformPen(pen, (k, 0, 0, -k, x + pos.x_offset * k, -pos.y_offset * k)))
                x += pos.x_advance * k
                if i + 1 == len(infos) or infos[i + 1].cluster != info.cluster:
                    x += spacing
        return pen.getCommands()


def main(svg_path, out_path):
    shapers = {}
    outlines = {}
    for family, size, spacing, text in text_parts(svg_path):
        if family not in shapers:
            shapers[family] = Shaper(*FONTS[family])
        key = f'{family}|{size:.2f}|{spacing:.2f}|{text}'
        outlines[key] = shapers[family].outline(text, size, spacing)
    Path(out_path).write_text(json.dumps({'source': Path(svg_path).name, 'outlines': outlines}, ensure_ascii=False, indent=1) + '\n')
    print(f'{len(outlines)} parts → {out_path}')


if __name__ == '__main__':
    main(*sys.argv[1:3])
