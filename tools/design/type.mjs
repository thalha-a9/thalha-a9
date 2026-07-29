import fs from 'node:fs';
import opentype from 'opentype.js';

/**
 * Inter, outlined to vector paths.
 *
 * opentype.js' text shaper throws on one of Inter's GSUB lookups, so glyphs are
 * composed directly from the cmap with kerning applied by hand. That keeps full
 * control of tracking and means the generated SVG carries no font dependency.
 */
const cache = new Map();

export function face(family = 'inter', weight = 600) {
  const key = `${family}-${weight}`;
  if (!cache.has(key)) {
    const b = fs.readFileSync(new URL(`../fonts/${key}.ttf`, import.meta.url));
    cache.set(key, opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)));
  }
  return cache.get(key);
}

/** Lay out `text` and return its path data plus the advance width. */
export function textPath(text, { size, weight = 600, x = 0, y = 0, tracking = 0, family = 'inter' } = {}) {
  const font = face(family, weight);
  const scale = size / font.unitsPerEm;
  const parts = [];
  let pen = x;
  let prev = null;

  for (const ch of [...text]) {
    const glyph = font.charToGlyph(ch);
    if (prev) pen += font.getKerningValue(prev, glyph) * scale;
    if (ch !== ' ') {
      const d = glyph.getPath(pen, y, size).toPathData(1);
      if (d) parts.push(d);
    }
    pen += glyph.advanceWidth * scale + tracking;
    prev = glyph;
  }
  return { d: parts.join(''), width: pen - x - (text.length ? tracking : 0) };
}

/** Advance width only — for centring and for sizing pills around a label. */
export function textWidth(text, opts) {
  return textPath(text, { ...opts, x: 0, y: 0 }).width;
}
