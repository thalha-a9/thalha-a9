/**
 * The remaining surfaces: a code panel and a closing strip.
 *
 * The code panel deliberately drops the window chrome that dates most terminal
 * graphics — no traffic lights, no scanlines. It reads as a modern code surface:
 * a filename tab, a hairline, and monospace that types itself out once.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { color, accent, radius, white } from './design/tokens.mjs';

const OUT = new URL('../assets/', import.meta.url);
const n = (v) => Number(v.toFixed(1));
const MONO = { family: 'mono', weight: 400, size: 13.5 };
const CH = textWidth('M', MONO);              // monospace advance, measured once

const path = (s, o, x, y, fill, op = 1) =>
  `<path d="${textPath(s, { ...o, x, y }).d}" fill="${fill}"${op !== 1 ? ` fill-opacity="${op}"` : ''}/>`;

// ── code panel ───────────────────────────────────────────────────────────
{
  const W = 900, H = 268, PAD = 28, BAR = 46;
  const LOOP = 13;                            // seconds
  const lines = [
    { t: 0.06, seg: [['$ ', color.text3], ['helix --map-identity --deep', color.text]] },
    { t: 0.30, seg: [['  resolving surfaces', color.text2], ['  5 found', accent.sky]] },
    { t: 0.40, seg: [['  extracting bio-linked profiles', color.text2]] },
    { t: 0.50, seg: [['  verifying via native email checks', color.text2]] },
    { t: 0.62, seg: [['✓ ', accent.emerald], ['identity graph resolved — ', color.text2], ['0 false positives', accent.emerald]] },
  ];

  let body = '';
  const cmd = '$ helix --map-identity --deep';
  const cmdW = CH * cmd.length;

  lines.forEach((ln, i) => {
    const y = BAR + 40 + i * 30 + (i === 4 ? 14 : 0);
    let x = PAD;
    let inner = '';
    for (const [s, fill] of ln.seg) {
      inner += path(s, MONO, x, y, fill);
      x += CH * s.length;
    }
    if (i === 0) {
      // the command types itself in, revealed by a clip that widens
      body += `<g clip-path="url(#typing)">${inner}</g>`;
    } else {
      body += `<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" ` +
              `keyTimes="0;${ln.t};${(ln.t + 0.04).toFixed(2)};0.93;0.97;1" dur="${LOOP}s" repeatCount="indefinite"/>${inner}</g>`;
    }
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="helix --map-identity --deep — identity graph resolved with zero false positives">
  <title>helix — identity mapping</title>
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${color.surface0}"/><stop offset="1" stop-color="${color.surface1}"/>
    </linearGradient>
    <clipPath id="f"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
    <clipPath id="typing"><rect x="${PAD}" y="${BAR + 20}" width="0" height="26">
      <animate attributeName="width" values="0;0;${n(cmdW)};${n(cmdW)};${n(cmdW)};0" keyTimes="0;0.04;0.22;0.93;0.97;1" dur="${LOOP}s" repeatCount="indefinite"/>
    </rect></clipPath>
    <style>
      .car{animation:b 1.1s steps(1) infinite}
      @keyframes b{0%,50%{opacity:1}51%,100%{opacity:0}}
      @media (prefers-reduced-motion: reduce){*{animation:none!important}}
    </style>
  </defs>
  <g clip-path="url(#f)">
    <rect width="${W}" height="${H}" fill="url(#s)"/>
    <line x1="0" y1="${BAR}" x2="${W}" y2="${BAR}" stroke="${white(0.07)}"/>
    ${path('~/helix', { family: 'mono', weight: 500, size: 12.5 }, PAD, 29, color.text2)}
    ${path('zsh', { family: 'mono', weight: 400, size: 11.5 }, W - PAD - textWidth('zsh', { family: 'mono', weight: 400, size: 11.5 }), 29, color.text3)}
    ${body}
    <rect class="car" x="${n(PAD + cmdW + 3)}" y="${BAR + 22}" width="8" height="17" fill="${accent.emerald}" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.93;0.97;1" dur="${LOOP}s" repeatCount="indefinite"/>
    </rect>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="${white(0.09)}"/>
  </g>
</svg>
`;
  fs.writeFileSync(new URL('code.svg', OUT), svg);
  console.log(`assets/code.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}

// ── closing strip ────────────────────────────────────────────────────────
{
  const W = 1200, H = 104;
  const line = 'local-first  ·  no telemetry  ·  no third-party services';
  const w = textWidth(line, { size: 13, weight: 400 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${line}">
  <title>${line}</title>
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${accent.emerald}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${accent.emerald}" stop-opacity=".5"/>
      <stop offset="1" stop-color="${accent.emerald}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="g"><stop offset="0" stop-color="${accent.emerald}" stop-opacity=".10"/><stop offset="1" stop-color="${accent.emerald}" stop-opacity="0"/></radialGradient>
    <clipPath id="f"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
  </defs>
  <g clip-path="url(#f)">
    <rect width="${W}" height="${H}" fill="${color.surface1}"/>
    <ellipse cx="600" cy="104" rx="420" ry="90" fill="url(#g)"/>
    <rect x="300" y="0" width="600" height="1" fill="url(#b)"/>
    ${path(line, { size: 13, weight: 400 }, n((W - w) / 2), 60, color.text3)}
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="${white(0.08)}"/>
  </g>
</svg>
`;
  fs.writeFileSync(new URL('footer.svg', OUT), svg);
  console.log(`assets/footer.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
