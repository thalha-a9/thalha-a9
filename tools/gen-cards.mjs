/**
 * Four discipline cards, generated from one template.
 *
 * All copy is outlined to vector paths with Inter, so the cards render
 * identically everywhere without shipping or linking a font. Every string is
 * measured at build time and checked against its column, so a copy edit can
 * never silently overflow the art.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { color, accent, radius, type, white } from './design/tokens.mjs';

const W = 440, H = 220;
const PAD = 26;
const ART_X = 368, ART_Y = 64;      // centre of the decorative art
const TEXT_MAX = 300;               // copy must not reach the art
const OUT = new URL('../assets/', import.meta.url);

const t = (s, style, x, y, fill, extra = '') => {
  const { d } = textPath(s, { ...style, x, y });
  return `<path d="${d}" fill="${fill}"${extra}/>`;
};

// ── decorative art, one per discipline ───────────────────────────────────
const art = {
  // expanding scan rings
  signal: (a) => `
      <circle r="46" fill="none" stroke="${white(0.05)}"/>
      <circle r="31" fill="none" stroke="${white(0.07)}"/>
      <circle r="16" fill="none" stroke="${white(0.09)}"/>
      <circle r="16" fill="none" stroke="${a}" stroke-width="1.2">
        <animate attributeName="r" values="16;48" dur="3.8s" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values=".5;0" dur="3.8s" repeatCount="indefinite"/>
      </circle>
      <circle r="3.2" fill="${a}"/>`,

  // constellation resolving, node by node
  graph: (a) => {
    const pts = [[36, -22], [32, 26], [-34, -15], [-28, 28], [8, -40]];
    let s = '';
    pts.forEach(([x, y], i) => {
      const k = 0.09 * (i + 1);
      s += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${a}" stroke-opacity=".12" stroke-width="1">
        <animate attributeName="stroke-opacity" values=".12;.12;.34;.34;.12;.12" keyTimes="0;${k.toFixed(2)};${(k + 0.05).toFixed(2)};0.88;0.95;1" dur="6.5s" repeatCount="indefinite"/></line>`;
    });
    pts.forEach(([x, y], i) => {
      const k = 0.09 * (i + 1);
      s += `<circle cx="${x}" cy="${y}" r="3" fill="${a}" fill-opacity=".22">
        <animate attributeName="fill-opacity" values=".22;.22;.95;.95;.22;.22" keyTimes="0;${k.toFixed(2)};${(k + 0.05).toFixed(2)};0.88;0.95;1" dur="6.5s" repeatCount="indefinite"/></circle>`;
    });
    return s + `<circle r="4.5" fill="${a}"/>`;
  },

  // staged descent with a travelling head
  chain: (a) => {
    let s = `<line x1="0" y1="-40" x2="0" y2="40" stroke="${white(0.08)}"/>`;
    [-40, -13.3, 13.3, 40].forEach((y, i) => {
      const k = 0.14 + 0.17 * i;
      s += `<circle cx="0" cy="${y}" r="4.5" fill="none" stroke="${a}" stroke-opacity=".3"/>
        <circle cx="0" cy="${y}" r="2.2" fill="${a}" fill-opacity=".15">
          <animate attributeName="fill-opacity" values=".15;.15;1;1;.15;.15" keyTimes="0;${k.toFixed(2)};${(k + 0.05).toFixed(2)};0.88;0.95;1" dur="6.5s" repeatCount="indefinite"/></circle>`;
    });
    return s + `<circle r="3" fill="${a}">
        <animate attributeName="cy" values="-40;-40;40;40" keyTimes="0;0.12;0.74;1" dur="6.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;.85;.85;0;0" keyTimes="0;0.12;0.74;0.8;1" dur="6.5s" repeatCount="indefinite"/></circle>`;
  },

  // a cycle that never stops
  loop: (a) => `
      <circle r="38" fill="none" stroke="${white(0.08)}"/>
      <path d="M38 0 A38 38 0 1 1 0 -38" fill="none" stroke="${a}" stroke-opacity=".4" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M-5.5 -38 L0.5 -43.5 L0.5 -32.5 Z" fill="${a}" fill-opacity=".65"/>
      <circle r="3.6" fill="${a}">
        <animateMotion dur="7.5s" repeatCount="indefinite" path="M0 -38 A38 38 0 1 1 -0.1 -38"/>
      </circle>`,
};

// ── glyphs for the icon tile (drawn centred on the tile) ─────────────────
const icon = {
  shield: (a) => `<path d="M0 -9.5 L8.4 -5.8 V1 C8.4 6.8 4.7 10 0 11.5 C-4.7 10 -8.4 6.8 -8.4 1 V-5.8 Z" fill="none" stroke="${a}" stroke-width="1.7" stroke-linejoin="round"/>`,
  nodes: (a) => `<g stroke="${a}" stroke-width="1.5" fill="none" stroke-linecap="round"><line x1="-6.2" y1="5.2" x2="0" y2="-6.4"/><line x1="0" y1="-6.4" x2="7.2" y2="4.2"/><line x1="-6.2" y1="5.2" x2="7.2" y2="4.2"/></g><g fill="${a}"><circle cx="0" cy="-6.4" r="2.5"/><circle cx="-6.2" cy="5.2" r="2.5"/><circle cx="7.2" cy="4.2" r="2.5"/></g>`,
  target: (a) => `<circle r="8.2" fill="none" stroke="${a}" stroke-width="1.6"/><circle r="2.5" fill="${a}"/><g stroke="${a}" stroke-width="1.6" stroke-linecap="round"><line x1="0" y1="-11.6" x2="0" y2="-8.8"/><line x1="0" y1="8.8" x2="0" y2="11.6"/><line x1="-11.6" y1="0" x2="-8.8" y2="0"/><line x1="8.8" y1="0" x2="11.6" y2="0"/></g>`,
  cycle: (a) => `<path d="M8.6 -2 A8.6 8.6 0 1 1 3.2 -8" fill="none" stroke="${a}" stroke-width="1.7" stroke-linecap="round"/><path d="M9 -8.6 L9 -1.8 L2.6 -1.8 Z" fill="${a}"/>`,
};

const CARDS = [
  { file: 'card-netsec.svg', sheen: 10.5, a: accent.emerald, icon: 'shield', art: 'signal',
    label: '01 · DEFENSIVE', title: 'Network Security',
    body: ['Traffic and protocol analysis, service', 'exposure mapping and hardening review.'],
    meta: 'packet analysis · exposure mapping' },
  { file: 'card-osint.svg', sheen: 12.0, a: accent.sky, icon: 'nodes', art: 'graph',
    label: '02 · INTELLIGENCE', title: 'OSINT Frameworks',
    body: ['Identity correlation and footprint', 'mapping, with verification built in.'],
    meta: 'correlation · verification · reporting' },
  { file: 'card-pentest.svg', sheen: 13.5, a: accent.rose, icon: 'target', art: 'chain',
    label: '03 · OFFENSIVE', title: 'Penetration Testing',
    body: ['Recon, enumeration, exploitation and', 'privilege escalation — scoped work.'],
    meta: 'authorized engagements only' },
  { file: 'card-automation.svg', sheen: 15.0, a: accent.amber, icon: 'cycle', art: 'loop',
    label: '04 · ENGINEERING', title: 'Automation',
    body: ['Scheduled and event-driven pipelines', 'that run unattended, and retry safely.'],
    meta: 'idempotent · retry-safe · logged' },
];

let worst = 0;
for (const c of CARDS) {
  // measure every string before it is committed to the art
  for (const [name, s, style] of [
    ['label', c.label, type.label], ['title', c.title, type.title],
    ['body0', c.body[0], type.body], ['body1', c.body[1], type.body],
    ['meta', c.meta, type.meta],
  ]) {
    const w = textWidth(s, style);
    worst = Math.max(worst, w);
    if (w > TEXT_MAX) console.warn(`  ! ${c.file} ${name} is ${w.toFixed(0)}px, over the ${TEXT_MAX}px column`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${c.title} — ${c.body.join(' ')}">
  <title>${c.title}</title>
  <desc>${c.body.join(' ')}</desc>
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${color.surface0}"/><stop offset="1" stop-color="${color.surface1}"/>
    </linearGradient>
    <radialGradient id="w" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${c.a}" stop-opacity="0.13"/>
      <stop offset="1" stop-color="${c.a}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.14"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.09"/>
    </linearGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.075"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="c"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
    <style>
      @media (prefers-reduced-motion: reduce){*{animation:none!important}}
    </style>
  </defs>
  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="url(#s)"/>
    <ellipse cx="${ART_X}" cy="${ART_Y}" rx="190" ry="150" fill="url(#w)"/>

    <g transform="translate(${ART_X},${ART_Y})">${art[c.art](c.a)}
    </g>

    <g transform="translate(${PAD + 19},${24 + 19})">
      <rect x="-19" y="-19" width="38" height="38" rx="${radius.tile}" fill="${c.a}" fill-opacity="0.11" stroke="${c.a}" stroke-opacity="0.24">
        <animate attributeName="fill-opacity" values="0.11;0.17;0.11" dur="5.5s" calcMode="spline" keyTimes="0;0.5;1" keySplines=".4 0 .6 1;.4 0 .6 1" repeatCount="indefinite"/>
        <animate attributeName="stroke-opacity" values="0.24;0.4;0.24" dur="5.5s" calcMode="spline" keyTimes="0;0.5;1" keySplines=".4 0 .6 1;.4 0 .6 1" repeatCount="indefinite"/>
      </rect>
      ${icon[c.icon](c.a)}
    </g>

    <g>
      ${t(c.label, type.label, PAD, 92, c.a, ' fill-opacity=".9"')}
      ${t(c.title, type.title, PAD, 122, color.text)}
    </g>
    <g>
      ${t(c.body[0], type.body, PAD, 148, color.text2)}
      ${t(c.body[1], type.body, PAD, 166, color.text2)}
      <line x1="${PAD}" y1="184" x2="${W - PAD}" y2="184" stroke="${white(0.07)}"/>
      ${t(c.meta, type.meta, PAD, 202, color.text3)}
    </g>

    <g transform="skewX(-14)">
      <rect x="-300" y="-30" width="150" height="${H + 60}" fill="url(#sh)">
        <animate attributeName="x" values="-300;-300;${W + 120};${W + 120}" keyTimes="0;0.10;0.38;1" dur="${c.sheen}s" repeatCount="indefinite"/>
      </rect>
    </g>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="url(#edge)"/>
  </g>
</svg>
`;
  fs.writeFileSync(new URL(c.file, OUT), svg);
  console.log(`assets/${c.file}  ${(svg.length / 1024).toFixed(1)} KB`);
}
console.log(`widest string ${worst.toFixed(0)}px / ${TEXT_MAX}px column — ${worst > TEXT_MAX ? 'OVERFLOW' : 'fits'}`);
