/**
 * The hero — rendered twice, once per theme, from a single computed scene.
 *
 *   · a drifting gradient mesh          (blurred radial gradients, SMIL)
 *   · a living particle constellation   (topology computed here, at build time)
 *   · film grain                        (feTurbulence)
 *   · a light sweep across the wordmark (animated gradient stops)
 *   · Inter, outlined — no font to load, no fallback to go wrong
 *
 * Particles are grouped into clusters. Links only ever join nodes inside one
 * cluster, so a cluster can drift and turn as a single transform and the lines
 * follow for free — no per-endpoint animation, which keeps the file small.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { themes, type, outPath, kb, n } from './design/tokens.mjs';

const W = 1200, H = 360, R = 18, X = 64;

const rng = (seed) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const rand = rng(20260729);

// ── scene geometry: computed once so both themes share it exactly ────────
const CLUSTERS = 5;
const LINK_DIST = 98;
const SAFE = { x0: 0, y0: 42, x1: 672, y1: 318 };          // keep clear of the type
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
      x, y, r: n(0.8 + depth * 1.5), o: n(0.12 + depth * 0.34),
      tint: rand() < 0.16 ? (rand() < 0.5 ? 'emerald' : 'sky') : null,
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
    dx: n((rand() - 0.5) * 26), dy: n((rand() - 0.5) * 20), dur: n(18 + rand() * 16),
    cx: n(nodes.reduce((a, q) => a + q.x, 0) / nodes.length),
    cy: n(nodes.reduce((a, q) => a + q.y, 0) / nodes.length),
    rot: n((rand() - 0.5) * 2.4), rdur: n(26 + rand() * 20),
  });
}

const motes = [];
while (motes.length < 22) {
  const x = 20 + rand() * (W - 40), y = 14 + rand() * (H - 28);
  if (inSafe(x, y)) continue;
  motes.push({ x, y, r: n(0.7 + rand() * 1.1), o: n(0.08 + rand() * 0.16) });
}

const TRAILS = [
  { d: 'M690 316 C 830 250, 960 300, 1176 168', dur: 17, r: 1.8, c: 'emerald' },
  { d: 'M1180 60 C 1010 130, 880 90, 686 210', dur: 23, r: 1.5, c: 'sky' },
  { d: 'M700 40 C 870 120, 1000 60, 1170 260', dur: 29, r: 1.3, c: null },
];

// ── type, outlined once ──────────────────────────────────────────────────
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
if (X + name.width > SAFE.x1) throw new Error(`wordmark overruns the safe zone: ${n(X + name.width)} > ${SAFE.x1}`);

let px = X;
const pills = PILLS.map((label) => {
  const w = n(textWidth(label, type.pill) + 30);
  const p = { x: n(px), w, d: textPath(label, { ...type.pill, x: px + 15, y: 298 }).d };
  px += w + 10;
  return p;
});

// ── render ───────────────────────────────────────────────────────────────
const spline = 'calcMode="spline" keyTimes="0;0.5;1" keySplines=".42 0 .58 1;.42 0 .58 1" repeatCount="indefinite"';

function render(t) {
  const col = (k) => (k ? t.accent[k] : t.inkHex);

  const constellation = clusters.map((c) => {
    const drift = `<animateTransform attributeName="transform" type="translate" values="0 0;${c.dx} ${c.dy};0 0" dur="${c.dur}s" ${spline}/>`;
    const spin = `<animateTransform attributeName="transform" type="rotate" values="0 ${c.cx} ${c.cy};${c.rot} ${c.cx} ${c.cy};0 ${c.cx} ${c.cy}" dur="${c.rdur}s" ${spline}/>`;
    const lines = c.links.map(([i, j, o]) =>
      `<line x1="${n(c.nodes[i].x)}" y1="${n(c.nodes[i].y)}" x2="${n(c.nodes[j].x)}" y2="${n(c.nodes[j].y)}" stroke="${t.inkHex}" stroke-opacity="${n(o * t.node)}"/>`).join('');
    const dots = c.nodes.map((p) =>
      `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="${p.r}" fill="${col(p.tint)}" fill-opacity="${n(p.o * t.node)}"/>`).join('');
    return `<g>${drift}<g>${spin}${lines}${dots}</g></g>`;
  }).join('\n      ');

  const moteDots = motes.map((m) =>
    `<circle cx="${n(m.x)}" cy="${n(m.y)}" r="${m.r}" fill="${t.inkHex}" fill-opacity="${n(m.o * t.node)}"/>`).join('');

  const trails = TRAILS.map((tr) =>
    `<circle r="${tr.r}" fill="${col(tr.c)}" opacity="0">
        <animate attributeName="opacity" values="0;0.75;0.75;0" keyTimes="0;0.12;0.8;1" dur="${tr.dur}s" repeatCount="indefinite"/>
        <animateMotion dur="${tr.dur}s" repeatCount="indefinite" path="${tr.d}" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .6 1"/>
      </circle>`).join('\n      ');

  const pillMarkup = pills.map((p) =>
    `<rect x="${p.x}" y="278" width="${p.w}" height="32" rx="16" fill="${t.ink(t.pill.fill)}" stroke="${t.ink(t.pill.stroke)}"/>` +
    `<path d="${p.d}" fill="${t.text2}"/>`).join('\n      ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${NAME} — developer and security researcher. ${LEAD.join(' ')}">
  <title>${NAME} — Developer &amp; security researcher</title>
  <desc>${LEAD.join(' ')}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="${t.bgTo}"/><stop offset="1" stop-color="${t.bg}"/>
    </linearGradient>
    <radialGradient id="m1"><stop offset="0" stop-color="${t.accent.emerald}" stop-opacity="${n(0.30 * t.mesh)}"/><stop offset="1" stop-color="${t.accent.emerald}" stop-opacity="0"/></radialGradient>
    <radialGradient id="m2"><stop offset="0" stop-color="${t.accent.sky}" stop-opacity="${n(0.22 * t.mesh)}"/><stop offset="1" stop-color="${t.accent.sky}" stop-opacity="0"/></radialGradient>
    <radialGradient id="m3"><stop offset="0" stop-color="${t.accent.indigo}" stop-opacity="${n(0.18 * t.mesh)}"/><stop offset="1" stop-color="${t.accent.indigo}" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="34"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="g"/>
      <feColorMatrix in="g" type="saturate" values="0"/>
    </filter>
    <radialGradient id="vig" cx="0.42" cy="0.5" r="0.75">
      <stop offset="0.35" stop-color="${t.bg}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.bg}" stop-opacity="${t.vignette}"/>
    </radialGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${t.text}" offset="-0.4"><animate attributeName="offset" values="-0.4;-0.4;1;1" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/></stop>
      <stop stop-color="${t.shineHi}" offset="-0.25"><animate attributeName="offset" values="-0.25;-0.25;1.15;1.15" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/></stop>
      <stop stop-color="${t.text}" offset="-0.1"><animate attributeName="offset" values="-0.1;-0.1;1.3;1.3" keyTimes="0;0.55;0.85;1" dur="9s" repeatCount="indefinite"/></stop>
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
      <ellipse cx="210" cy="70" rx="300" ry="210" fill="url(#m1)"><animateTransform attributeName="transform" type="translate" values="0 0;70 34;0 0;-52 -22;0 0" dur="22s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="980" cy="256" rx="300" ry="200" fill="url(#m2)"><animateTransform attributeName="transform" type="translate" values="0 0;-64 -30;0 0;48 26;0 0" dur="26s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="640" cy="300" rx="250" ry="170" fill="url(#m3)"><animateTransform attributeName="transform" type="translate" values="0 0;56 -26;0 0;-44 20;0 0" dur="19s" repeatCount="indefinite"/></ellipse>
    </g>

    <g>
      ${constellation}
      <g>${moteDots}</g>
      ${trails}
    </g>

    <rect width="${W}" height="${H}" fill="url(#vig)"/>

    <g><circle class="pulse" cx="${X + 4}" cy="85" r="3.5" fill="${t.accent.emerald}"/><path d="${eyebrow.d}" fill="${t.text2}"/></g>
    <g><path d="${name.d}" fill="url(#shine)"/></g>
    <g>${lead.map((l) => `<path d="${l.d}" fill="${t.text2}"/>`).join('')}</g>
    <g>
      ${pillMarkup}
    </g>

    <rect width="${W}" height="${H}" filter="url(#grain)" opacity="${t.grain}" style="mix-blend-mode:overlay"/>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${R}" fill="none" stroke="${t.ink(t.hair)}"/>
  </g>
</svg>
`;
}

for (const t of Object.values(themes)) {
  const svg = render(t);
  fs.writeFileSync(outPath('hero', t), svg);
  console.log(`assets/hero-${t.name}.svg  ${kb(svg)} KB`);
}
const nodes = clusters.reduce((a, c) => a + c.nodes.length, 0);
const links = clusters.reduce((a, c) => a + c.links.length, 0);
console.log(`  constellation: ${nodes} nodes, ${links} links, ${CLUSTERS} clusters · wordmark ${n(name.width)}px · lead ${lead.map((l) => n(l.width)).join('/')}px`);
