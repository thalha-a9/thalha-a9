/**
 * Full-width feature cards for the two flagship projects, in both themes.
 *
 * Each carries a small narrative animation of what the tool actually does:
 * Helix resolves an identity graph and rejects a false positive; git-mistake
 * walks back from HEAD and recovers a commit history had forgotten.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { themes, radius, type, outPath, kb, n } from './design/tokens.mjs';

const W = 896, H = 200, PAD = 32;
const ART_X = 702, ART_Y = 100;
const TEXT_MAX = 480;               // the copy column; art begins at ~540
const f = (v) => v.toFixed(2);

const t = (s, style, x, y, fill, extra = '') =>
  `<path d="${textPath(s, { ...style, x, y }).d}" fill="${fill}"${extra}/>`;

// ── Helix: a target resolves across five surfaces; one is rejected ───────
const helix = (a, th) => {
  const rose = th.accent.rose;
  const ys = [-60, -30, 0, 30, 60];
  let s = `<circle cx="-112" cy="0" r="30" fill="none" stroke="${th.ink(0.06)}"/>
      <circle cx="-112" cy="0" r="50" fill="none" stroke="${th.ink(0.04)}"/>`;
  ys.forEach((y, i) => {
    const col = i === 4 ? rose : a, k = 0.06 + 0.09 * i;
    s += `<path d="M-99 0 Q -20 0 52 ${y}" fill="none" stroke="${col}" stroke-opacity=".11" stroke-width="1.2"/>
      <path d="M-99 0 Q -20 0 52 ${y}" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="260" stroke-dashoffset="260">
        <animate attributeName="stroke-dashoffset" values="260;260;0;0;260" keyTimes="0;${f(k)};${f(k + 0.08)};0.92;1" dur="10s" repeatCount="indefinite"/></path>`;
  });
  s += `<circle cx="-112" cy="0" r="13" fill="none" stroke="${a}" stroke-width="1">
        <animate attributeName="r" values="13;34" dur="3.2s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values=".55;0" dur="3.2s" repeatCount="indefinite"/></circle>
      <circle cx="-112" cy="0" r="13" fill="${th.surface0}" stroke="${a}" stroke-width="1.6"/>
      <circle cx="-112" cy="0" r="4" fill="${a}"/>`;
  ys.forEach((y, i) => {
    const col = i === 4 ? rose : a, k = 0.14 + 0.09 * i;
    s += `<circle cx="58" cy="${y}" r="5" fill="${th.surface0}" stroke="${col}" stroke-width="1.4" stroke-opacity=".35">
        <animate attributeName="stroke-opacity" values=".35;.35;1;1;.35" keyTimes="0;${f(k)};${f(k + 0.04)};0.92;1" dur="10s" repeatCount="indefinite"/></circle>`;
  });
  ys.forEach((y, i) => {
    const k = 0.58 + 0.06 * i;
    const d = i < 4 ? `M86 ${y} l3.5 3.5 l7 -7.5` : `M87 ${y - 4} l8 8 M95 ${y - 4} l-8 8`;
    s += `<path d="${d}" fill="none" stroke="${i < 4 ? a : rose}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${f(k)};${f(k + 0.03)};0.92;1" dur="10s" repeatCount="indefinite"/></path>`;
  });
  return s;
};

// ── git-mistake: walk back from HEAD, recover the commit history dropped ─
const gitmistake = (a, th) => {
  const main = [-130, -82, -34, 14, 62];
  const LOST = 118;
  let s = `<line x1="-150" y1="22" x2="62" y2="22" stroke="${th.ink(0.16)}" stroke-width="1.4"/>
      <line x1="62" y1="22" x2="${LOST}" y2="22" stroke="${th.ink(0.16)}" stroke-width="1.4" stroke-dasharray="3 4"/>
      <line x1="62" y1="22" x2="${LOST}" y2="22" stroke="${a}" stroke-width="1.6" stroke-dasharray="60" stroke-dashoffset="60">
        <animate attributeName="stroke-dashoffset" values="60;60;0;0;60" keyTimes="0;0.18;0.46;0.92;1" dur="9s" repeatCount="indefinite"/></line>
      <path d="M14 22 C14 -4, 34 -26, 58 -26 L 140 -26" fill="none" stroke="${th.ink(0.16)}" stroke-width="1.4"/>`;
  for (const x of main) s += `<circle cx="${x}" cy="22" r="5" fill="${th.surface0}" stroke="${a}" stroke-width="1.5" stroke-opacity=".7"/>`;
  for (const x of [72, 118]) s += `<circle cx="${x}" cy="-26" r="4.5" fill="${th.surface0}" stroke="${th.inkHex}" stroke-opacity=".35" stroke-width="1.4"/>`;
  s += `<circle cx="${LOST}" cy="22" r="5.5" fill="none" stroke="${th.inkHex}" stroke-opacity=".3" stroke-dasharray="2.5 2.5"/>
      <circle cx="${LOST}" cy="22" r="5.5" fill="${a}" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.46;0.52;0.92;1" dur="9s" repeatCount="indefinite"/></circle>
      <circle cx="${LOST}" cy="22" r="5.5" fill="none" stroke="${a}" opacity="0">
        <animate attributeName="r" values="5.5;5.5;24;24" keyTimes="0;0.46;0.62;1" dur="9s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0;.8;0;0" keyTimes="0;0.46;0.47;0.62;1" dur="9s" repeatCount="indefinite"/></circle>
      <path d="M58 8 L66 8 L62 13 Z" fill="${a}"/>
      <circle cy="22" r="3.2" fill="${a}" opacity="0">
        <animate attributeName="cx" values="62;62;${LOST};${LOST}" keyTimes="0;0.18;0.46;1" dur="9s" calcMode="spline" keySplines="0 0 1 1;.4 0 .6 1;0 0 1 1" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.9;.9;0;0" keyTimes="0;0.18;0.46;0.5;1" dur="9s" repeatCount="indefinite"/></circle>`;
  return s;
};

const PROJECTS = [
  { base: 'project-helix', ak: 'emerald', sheen: 12, art: helix,
    eyebrow: '01  ·  OPEN SOURCE', title: 'Helix',
    tagline: 'OSINT identity mapping, built to eliminate false positives.',
    tags: ['Asynchronous', 'OSINT', 'Native email verification'] },
  { base: 'project-git-mistake', ak: 'sky', sheen: 14, art: gitmistake,
    eyebrow: '02  ·  OPEN SOURCE', title: 'git-mistake',
    tagline: 'Recover lost commits and undo catastrophic git mistakes — safely.',
    tags: ['Interactive CLI', 'Detached HEAD', 'Commit recovery'] },
];

for (const p of PROJECTS) {
  for (const [name, s, style] of [['title', p.title, type.h1], ['tagline', p.tagline, type.tagline]]) {
    const w = textWidth(s, style);
    if (w > TEXT_MAX) throw new Error(`${p.base} ${name} is ${w.toFixed(0)}px, over the ${TEXT_MAX}px column`);
  }
  // tag geometry, measured
  let x = PAD;
  const tags = p.tags.map((label) => {
    const w = n(textWidth(label, type.tag) + 24);
    const g = { x: n(x), w, label };
    x += w + 8;
    return g;
  });
  if (x - 8 - PAD > TEXT_MAX) throw new Error(`${p.base} tag row is ${n(x - 8 - PAD)}px wide`);

  for (const th of Object.values(themes)) {
    const a = th.accent[p.ak];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${p.title} — ${p.tagline}">
  <title>${p.title}</title>
  <desc>${p.tagline}</desc>
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${th.surface0}"/><stop offset="1" stop-color="${th.surface1}"/>
    </linearGradient>
    <radialGradient id="w" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${a}" stop-opacity="0.12"/><stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${th.inkHex}" stop-opacity="${th.edge[0]}"/>
      <stop offset="0.5" stop-color="${th.inkHex}" stop-opacity="${th.edge[1]}"/>
      <stop offset="1" stop-color="${th.inkHex}" stop-opacity="${th.edge[2]}"/>
    </linearGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${th.sheen.color}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${th.sheen.color}" stop-opacity="${th.sheen.alpha}"/>
      <stop offset="1" stop-color="${th.sheen.color}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="c"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
    <style>@media (prefers-reduced-motion: reduce){*{animation:none!important}}</style>
  </defs>
  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="url(#s)"/>
    <ellipse cx="${ART_X}" cy="${ART_Y}" rx="300" ry="170" fill="url(#w)"/>
    <g transform="translate(${ART_X},${ART_Y})">
      ${p.art(a, th)}
    </g>
    ${t(p.eyebrow, type.label, PAD, 58, a, ' fill-opacity=".9"')}
    ${t(p.title, type.h1, PAD, 96, th.text)}
    ${t(p.tagline, type.tagline, PAD, 124, th.text2)}
    ${tags.map((g) =>
      `<rect x="${g.x}" y="146" width="${g.w}" height="26" rx="13" fill="${th.ink(th.pill.fill)}" stroke="${th.ink(th.pill.stroke)}"/>` +
      t(g.label, type.tag, g.x + 12, 163, th.text2)).join('\n    ')}
    <g transform="skewX(-14)">
      <rect x="-320" y="-30" width="170" height="${H + 60}" fill="url(#sh)">
        <animate attributeName="x" values="-320;-320;${W + 140};${W + 140}" keyTimes="0;0.10;0.42;1" dur="${p.sheen}s" repeatCount="indefinite"/>
      </rect>
    </g>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="url(#edge)"/>
  </g>
</svg>
`;
    fs.writeFileSync(outPath(p.base, th), svg);
    console.log(`assets/${p.base}-${th.name}.svg  ${kb(svg)} KB`);
  }
}
