/**
 * The hero.
 *
 * Everything a canvas render would have given us, in a vector that stays sharp
 * at any size and costs ~40 KB instead of megabytes of frames:
 *
 *   · a drifting gradient mesh          (blurred radial gradients, SMIL)
 *   · a living particle constellation   (topology computed here, at build time)
 *   · film grain                        (feTurbulence)
 *   · a light sweep across the wordmark (animated gradient stops)
 *   · Inter, outlined — no font to load, no fallback to go wrong
 *
 * Particles are grouped into clusters. Links only ever join nodes inside one
 * cluster, so a cluster can drift as a single transform and the lines follow for
 * free — no per-endpoint animation, which is what keeps the file small.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { color, accent, type, white } from './design/tokens.mjs';

const W = 1200, H = 360, R = 18;
const X = 64;
const OUT = new URL('../assets/hero.svg', import.meta.url);

const rng = (seed) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const rand = rng(20260729);
const n = (v) => Number(v.toFixed(1));

// ── constellation ────────────────────────────────────────────────────────
// Weighted to the right so the copy column stays clean. Nodes are rejection
// sampled against the text safe zone rather than trusted to land well.
const CLUSTERS = 5;
const LINK_DIST = 98;
const SAFE = { x0: 0, y0: 42, x1: 672, y1: 318 };   // keep clear of the type
const inSafe = (x, y) => x > SAFE.x0 && x < SAFE.x1 && y > SAFE.y0 && y < SAFE.y1;
const clusters = [];

for (let c = 0; c < CLUSTERS; c++) {
  const cx = 700 + (c + 0.5) * ((W - 760) / CLUSTERS) + (rand() - 0.5) * 70;
  const cy = 40 + rand() * (H - 80);
  const count = 6 + Math.floor(rand() * 5);
  const nodes = [];
  let guard = 0;
  while (nodes.length < count && guard++ < 400) {
    const x = cx + (rand() - 0.5) * 200;
    const y = cy + (rand() - 0.5) * 180;
    if (inSafe(x, y) || x < 24 || x > W - 24 || y < 16 || y > H - 16) continue;
    const depth = rand();
    nodes.push({
      x, y,
      r: n(0.8 + depth * 1.5),
      o: n(0.12 + depth * 0.34),
      tint: rand() < 0.16 ? (rand() < 0.5 ? accent.emerald : accent.sky) : '#FFFFFF',
    });
  }
  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < LINK_DIST) links.push([i, j, n((1 - d / LINK_DIST) * 0.13)]);
    }
  }
  clusters.push({
    nodes, links,
    dx: n((rand() - 0.5) * 26), dy: n((rand() - 0.5) * 20),
    dur: n(18 + rand() * 16),
  });
}

// a few lone motes for depth, allowed anywhere the type is not
const motes = [];
while (motes.length < 22) {
  const x = 20 + rand() * (W - 40), y = 14 + rand() * (H - 28);
  if (inSafe(x, y)) continue;
  motes.push({ x, y, r: n(0.7 + rand() * 1.1), o: n(0.08 + rand() * 0.16) });
}

const drift = (c) =>
  `<animateTransform attributeName="transform" type="translate" ` +
  `values="0 0;${c.dx} ${c.dy};0 0" dur="${c.dur}s" calcMode="spline" ` +
  `keyTimes="0;0.5;1" keySplines=".42 0 .58 1;.42 0 .58 1" repeatCount="indefinite"/>`;

const constellation = clusters.map((c) => {
  const lines = c.links.map(([i, j, o]) =>
    `<line x1="${n(c.nodes[i].x)}" y1="${n(c.nodes[i].y)}" x2="${n(c.nodes[j].x)}" y2="${n(c.nodes[j].y)}" stroke="#FFFFFF" stroke-opacity="${o}"/>`).join('');
  const dots = c.nodes.map((p) =>
    `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${p.r}" fill="${p.tint}" fill-opacity="${p.o}"/>`).join('');
  return `<g>${drift(c)}${lines}${dots}</g>`;
}).join('\n      ') + '\n      <g>' + motes.map((m) =>
  `<circle cx="${n(m.x)}" cy="${n(m.y)}" r="${m.r}" fill="#FFFFFF" fill-opacity="${m.o}"/>`).join('') + '</g>';

// ── type ─────────────────────────────────────────────────────────────────
const NAME = 'Thalha Ahmed';
const EYEBROW = 'DEVELOPER  ·  SECURITY RESEARCHER';
const LEAD = [
  'I build high-performance, local-first CLI tools,',
  'automation scripts, and advanced OSINT frameworks.',
];
const PILLS = ['Network Security', 'OSINT', 'Penetration Testing', 'Automation'];

const eyebrow = textPath(EYEBROW, { ...type.label, size: 12.5, x: X + 18, y: 90 });
const name = textPath(NAME, { ...type.display, x: X, y: 190 });
const lead = LEAD.map((line, i) => textPath(line, { ...type.lead, x: X, y: 228 + i * 24 }));

let px = X;
const pills = PILLS.map((label) => {
  const tw = textWidth(label, type.pill);
  const w = n(tw + 30);
  const g = `<g><rect x="${n(px)}" y="278" width="${w}" height="32" rx="16" fill="${white(0.04)}" stroke="${white(0.1)}"/>` +
            `<path d="${textPath(label, { ...type.pill, x: px + 15, y: 298 }).d}" fill="${color.text2}"/></g>`;
  px += w + 10;
  return g;
}).join('\n      ');

// ── document ─────────────────────────────────────────────────────────────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${NAME} — developer and security researcher. ${LEAD.join(' ')}">
  <title>${NAME} — Security research &amp; tool engineering</title>
  <desc>${LEAD.join(' ')}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="#0A0C0F"/><stop offset="1" stop-color="${color.bg}"/>
    </linearGradient>

    <radialGradient id="m1"><stop offset="0" stop-color="${accent.emerald}" stop-opacity=".30"/><stop offset="1" stop-color="${accent.emerald}" stop-opacity="0"/></radialGradient>
    <radialGradient id="m2"><stop offset="0" stop-color="${accent.sky}" stop-opacity=".22"/><stop offset="1" stop-color="${accent.sky}" stop-opacity="0"/></radialGradient>
    <radialGradient id="m3"><stop offset="0" stop-color="#6366F1" stop-opacity=".18"/><stop offset="1" stop-color="#6366F1" stop-opacity="0"/></radialGradient>

    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34"/></filter>

    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
    </filter>

    <radialGradient id="vig" cx="0.42" cy="0.5" r="0.75">
      <stop offset="0.35" stop-color="${color.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${color.bg}" stop-opacity="0.92"/>
    </radialGradient>

    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${color.text}" offset="-0.4">
        <animate attributeName="offset" values="-0.4;-0.4;1;1" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/>
      </stop>
      <stop stop-color="#FFFFFF" offset="-0.25">
        <animate attributeName="offset" values="-0.25;-0.25;1.15;1.15" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/>
      </stop>
      <stop stop-color="${color.text}" offset="-0.1">
        <animate attributeName="offset" values="-0.1;-0.1;1.3;1.3" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>

    <clipPath id="frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
    <style>
      .pulse{animation:pulse 3.4s ease-in-out infinite}
      @keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}
      @media (prefers-reduced-motion: reduce){*{animation:none!important}}
    </style>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>

    <g filter="url(#soft)">
      <ellipse cx="210" cy="70" rx="300" ry="210" fill="url(#m1)">
        <animateTransform attributeName="transform" type="translate" values="0 0;70 34;0 0;-52 -22;0 0" dur="22s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="980" cy="256" rx="300" ry="200" fill="url(#m2)">
        <animateTransform attributeName="transform" type="translate" values="0 0;-64 -30;0 0;48 26;0 0" dur="26s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="640" cy="300" rx="250" ry="170" fill="url(#m3)">
        <animateTransform attributeName="transform" type="translate" values="0 0;56 -26;0 0;-44 20;0 0" dur="19s" repeatCount="indefinite"/>
      </ellipse>
    </g>

    <g>
      ${constellation}
    </g>

    <rect width="${W}" height="${H}" fill="url(#vig)"/>

    <circle class="pulse" cx="${X + 4}" cy="85" r="3.5" fill="${accent.emerald}"/>
    <path d="${eyebrow.d}" fill="#8A94A2"/>
    <path d="${name.d}" fill="url(#shine)"/>
    ${lead.map((l) => `<path d="${l.d}" fill="${color.text2}"/>`).join('\n    ')}
    ${pills}

    <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:overlay"/>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${R}" fill="none" stroke="${white(0.1)}"/>
  </g>
</svg>
`;

fs.writeFileSync(OUT, svg);
const nodes = clusters.reduce((a, c) => a + c.nodes.length, 0);
const links = clusters.reduce((a, c) => a + c.links.length, 0);
console.log(`assets/hero.svg  ${(svg.length / 1024).toFixed(1)} KB`);
console.log(`  constellation: ${nodes} nodes, ${links} links across ${CLUSTERS} drifting clusters`);
if (X + name.width > SAFE.x1) throw new Error(`wordmark overruns the safe zone: ${n(X + name.width)} > ${SAFE.x1}`);
console.log(`  wordmark ${n(name.width)}px, lead ${lead.map((l) => n(l.width)).join('/')}px, pills end at ${n(px - 10)}px of ${W}`);
