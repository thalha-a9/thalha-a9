/**
 * The remaining surfaces, in both themes: a code panel and a closing strip.
 *
 * The code panel deliberately drops the window chrome that dates most terminal
 * graphics — no traffic lights, no scanlines. A filename tab, a hairline, and
 * monospace that types itself out once.
 */
import fs from 'node:fs';
import { textPath, textWidth } from './design/type.mjs';
import { themes, radius, outPath, kb, n } from './design/tokens.mjs';

const MONO = { family: 'mono', weight: 400, size: 13.5 };
const CH = textWidth('M', MONO);              // monospace advance, measured once

const path = (s, o, x, y, fill) => `<path d="${textPath(s, { ...o, x, y }).d}" fill="${fill}"/>`;

for (const th of Object.values(themes)) {
  // ── code panel ─────────────────────────────────────────────────────────
  {
    const W = 900, H = 268, PAD = 28, BAR = 46, LOOP = 13;
    const lines = [
      { t: 0.06, seg: [['$ ', th.text3], ['helix --map-identity --deep', th.text]] },
      { t: 0.30, seg: [['  resolving surfaces', th.text2], ['  5 found', th.accent.sky]] },
      { t: 0.40, seg: [['  extracting bio-linked profiles', th.text2]] },
      { t: 0.50, seg: [['  verifying via native email checks', th.text2]] },
      { t: 0.62, seg: [['✓ ', th.accent.emerald], ['identity graph resolved — ', th.text2], ['0 false positives', th.accent.emerald]] },
    ];
    const cmd = '$ helix --map-identity --deep';
    const cmdW = CH * cmd.length;
    let body = '';
    lines.forEach((ln, i) => {
      const y = BAR + 40 + i * 30 + (i === 4 ? 14 : 0);
      let x = PAD, inner = '';
      for (const [s, fill] of ln.seg) { inner += path(s, MONO, x, y, fill); x += CH * s.length; }
      body += i === 0
        ? `<g clip-path="url(#typing)">${inner}</g>`
        : `<g><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;${ln.t};${(ln.t + 0.04).toFixed(2)};0.93;0.97;1" dur="${LOOP}s" repeatCount="indefinite"/>${inner}</g>`;
    });
    const zshW = textWidth('zsh', { family: 'mono', weight: 400, size: 11.5 });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="helix --map-identity --deep — identity graph resolved with zero false positives">
  <title>helix — identity mapping</title>
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${th.surface0}"/><stop offset="1" stop-color="${th.surface1}"/>
    </linearGradient>
    <clipPath id="f"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
    <clipPath id="typing"><rect x="${PAD}" y="${BAR + 20}" width="${n(cmdW)}" height="26">
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
    <line x1="0" y1="${BAR}" x2="${W}" y2="${BAR}" stroke="${th.ink(0.08)}"/>
    ${path('~/helix', { family: 'mono', weight: 500, size: 12.5 }, PAD, 29, th.text2)}
    ${path('zsh', { family: 'mono', weight: 400, size: 11.5 }, W - PAD - zshW, 29, th.text3)}
    ${body}
    <rect class="car" x="${n(PAD + cmdW + 3)}" y="${BAR + 22}" width="8" height="17" fill="${th.accent.emerald}">
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.93;0.97;1" dur="${LOOP}s" repeatCount="indefinite"/>
    </rect>
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="${th.ink(th.hair)}"/>
  </g>
</svg>
`;
    fs.writeFileSync(outPath('code', th), svg);
    console.log(`assets/code-${th.name}.svg  ${kb(svg)} KB`);
  }

  // ── closing strip ──────────────────────────────────────────────────────
  {
    const W = 1200, H = 104;
    const line = 'local-first  ·  no telemetry  ·  no third-party services';
    const w = textWidth(line, { size: 13, weight: 400 });
    const a = th.accent.emerald;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${line}">
  <title>${line}</title>
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${a}" stop-opacity="0"/><stop offset="0.5" stop-color="${a}" stop-opacity=".5"/><stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="g"><stop offset="0" stop-color="${a}" stop-opacity=".10"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient>
    <clipPath id="f"><rect width="${W}" height="${H}" rx="${radius.card}"/></clipPath>
    <style>@media (prefers-reduced-motion: reduce){*{animation:none!important}}</style>
  </defs>
  <g clip-path="url(#f)">
    <rect width="${W}" height="${H}" fill="${th.surface1}"/>
    <ellipse cx="600" cy="104" rx="420" ry="90" fill="url(#g)"/>
    <rect x="300" y="0" width="600" height="1" fill="url(#b)"/>
    <circle cy="0.5" r="34" fill="url(#g)" opacity="0.9">
      <animate attributeName="cx" values="300;900;300" dur="14s" calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" repeatCount="indefinite"/>
    </circle>
    <circle cy="0.5" r="1.6" fill="${a}">
      <animate attributeName="cx" values="300;900;300" dur="14s" calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".3;1;.3" dur="14s" repeatCount="indefinite"/>
    </circle>
    ${path(line, { size: 13, weight: 400 }, n((W - w) / 2), 60, th.text3)}
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="${radius.card}" fill="none" stroke="${th.ink(th.hair)}"/>
  </g>
</svg>
`;
    fs.writeFileSync(outPath('footer', th), svg);
    console.log(`assets/footer-${th.name}.svg  ${kb(svg)} KB`);
  }
}
