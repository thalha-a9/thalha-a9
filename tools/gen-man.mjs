/**
 * The profile as a manual page: `man thalha`.
 *
 *   man   the top of the page: the command, the header line, NAME, SYNOPSIS,
 *         DESCRIPTION and the pager's status line
 *   run   a real Helix 3.6.0 run on a made-up username (30 Oct 2026), lines
 *         copied from its output, nothing invented
 *   end   the page footer and the pager's (END)
 *
 * Dark is a terminal, light is printed paper. Everything is JetBrains Mono,
 * outlined to paths, so it renders the same everywhere.
 */
import fs from 'node:fs';
import { face, textWidth } from './design/type.mjs';
import { themes, outPath, kb, n } from './design/tokens.mjs';

// The wide layout is for desktops; the narrow one wraps the way man does in a
// small terminal, so the page stays readable on a phone.
const layouts = {
  wide: { W: 900, PAD: 36, suffix: '' },
  narrow: { W: 440, PAD: 22, suffix: '-narrow' },
};
let W, PAD, narrow;

const palette = {
  dark: {
    bg: '#0B0E13', edge: 'rgba(255,255,255,0.10)', text: '#D7DDE4', bold: '#FFFFFF', dim: '#7D8590',
    green: themes.dark.accent.emerald, cyan: themes.dark.accent.sky, amber: themes.dark.accent.amber,
    bar: '#D7DDE4', barText: '#0B0E13',
  },
  light: {
    bg: '#FBF8F1', edge: 'rgba(60,45,20,0.16)', text: '#2B2A28', bold: '#111111', dim: '#7A7468',
    green: themes.light.accent.emerald, cyan: themes.light.accent.sky, amber: '#B45309',
    bar: '#2B2A28', barText: '#FBF8F1',
  },
};

const font = (size, bold) => ({ family: 'mono', weight: bold ? 700 : 400, size });

/**
 * Each glyph is drawn once in <defs> and placed with <use>, which keeps a page
 * of monospace text small. `glyphs` collects them for the SVG being built.
 */
let glyphs = new Map();
function glyph(ch, size, bold) {
  const key = `${bold ? 'b' : 'r'}${size}-${ch.codePointAt(0)}`;
  if (!glyphs.has(key)) {
    const d = face('mono', bold ? 700 : 400).charToGlyph(ch).getPath(0, 0, size).toPathData(1);
    glyphs.set(key, { id: `g${glyphs.size}`, d });
  }
  return glyphs.get(key);
}
function text(s, size, bold, x, y, fill) {
  const ch = textWidth('M', font(size));
  let out = '';
  [...s].forEach((c, i) => {
    if (c === ' ') return;
    const g = glyph(c, size, bold);
    if (g.d) out += `<use href="#${g.id}" x="${n(x + i * ch)}" y="${n(y)}"/>`;
  });
  return out ? `<g fill="${fill}">${out}</g>` : '';
}

/**
 * One line of mixed text. Each segment: [text, colour key, flags], where flags
 * may hold b (bold), u (underline, as man prints arguments) and inv (reverse
 * video, as the pager prints its status line).
 */
function line(p, segs, x, y, size) {
  const ch = textWidth('M', font(size));
  let out = '', pen = x;
  for (const [s, c, f = {}] of segs) {
    const w = ch * [...s].length;
    if (f.inv) out += `<rect x="${n(pen - 3)}" y="${n(y - size * 0.95)}" width="${n(w + 6)}" height="${n(size * 1.32)}" fill="${p.bar}"/>`;
    const fill = f.inv ? p.barText : p[c];
    out += text(s, size, f.b, pen, y, fill);
    if (f.u) out += `<rect x="${n(pen)}" y="${n(y + 3)}" width="${n(w)}" height="1.2" fill="${fill}"/>`;
    pen += w;
  }
  if (pen > W - PAD + 0.5) throw new Error(`line runs ${n(pen - (W - PAD))}px past the edge: ${segs.map((g) => g[0]).join('')}`);
  return { svg: out, width: pen - x, ch };
}

/** Fade in once, after `at` seconds. Without SMIL the line is simply there. */
const appear = (at, total) =>
  `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${(at / total).toFixed(3)};${((at + 0.25) / total).toFixed(3)};1" dur="${total}s" fill="freeze"/>`;

function frame(p, H, body, label, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <clipPath id="f"><rect width="${W}" height="${H}" rx="12"/></clipPath>${extra}
    ${[...glyphs.values()].map((g) => `<path id="${g.id}" d="${g.d}"/>`).join('\n    ')}
  </defs>
  <g clip-path="url(#f)">
    <rect width="${W}" height="${H}" fill="${p.bg}"/>
    ${body}
    <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${p.edge}"/>
  </g>
</svg>
`;
}

/** Text split over three columns, as man prints its header and footer. */
function spread(p, left, mid, right, y, size, colour = 'text') {
  const w = (s) => textWidth(s, font(size));
  return line(p, [[left, colour]], PAD, y, size).svg
    + line(p, [[mid, colour]], n((W - w(mid)) / 2), y, size).svg
    + line(p, [[right, colour]], n(W - PAD - w(right)), y, size).svg;
}

// ── man: the top of the page ─────────────────────────────────────────────
function man(p) {
  const S = narrow ? 14 : 14.5, LH = narrow ? 22 : 23, T = 4.2;
  const IND = PAD + textWidth('M', font(S)) * (narrow ? 4 : 7);
  const b = (s) => [s, 'bold', { b: 1 }], t = (s) => [s, 'text'];
  const cmd = line(p, [['$ ', 'dim'], ['man thalha', 'bold']], PAD, PAD + 14, S);

  const page = [
    null,
    [['NAME', 'bold', { b: 1 }]],
    [['Thalha Ahmed, ', 'text'], ['thalha-a9', 'text', { b: 1 }], [' on GitHub', 'text']],
    null,
    [['SYNOPSIS', 'bold', { b: 1 }]],
    ...(narrow ? [
      [b('thalha'), t(' ['), b('--osint'), t('] ['), b('--network'), t(']')],
      [t('       ['), b('--pentest'), t('] ['), b('--automate'), t(']')],
      [t('       '), ['problem', 'text', { u: 1 }]],
    ] : [
      [b('thalha'), t(' ['), b('--osint'), t('] ['), b('--network'), t('] ['), b('--pentest'), t('] ['), b('--automate'), t('] '), ['problem', 'text', { u: 1 }]],
    ]),
    null,
    [['DESCRIPTION', 'bold', { b: 1 }]],
    ...(narrow ? [
      [t('Writes command line tools that check')],
      [t('their own answers before showing them')],
      [t('to you. Mostly Python, mostly async,')],
      [t('all open source.')],
      null,
      [t('Author of '), b('helix'), t('(1), which asks 11,988')],
      [t('sites about a username and re-checks')],
      [t('every account it finds before it')],
      [t('reports it.')],
    ] : [
      [t('Writes command line tools that check their own answers before')],
      [t('showing them to you. Mostly Python, mostly async, all open source.')],
      null,
      [t('Author of '), b('helix'), t('(1), which asks 11,988 sites about a username')],
      [t('and re-checks every account it finds before it reports it.')],
    ]),
  ];

  let y = PAD + 14 + 40;
  let body = `<g clip-path="url(#typing)">${cmd.svg}</g>`;
  body += `<g opacity="1">${appear(1.4, T)}${spread(p, 'THALHA(1)', 'Field Manual', 'THALHA(1)', y, S)}`;
  page.forEach((segs, i) => {
    y += LH;
    if (!segs) return;
    const heading = segs.length === 1 && segs[0][2] && segs[0][0] === segs[0][0].toUpperCase();
    body += line(p, segs, heading ? PAD : IND, y, S).svg;
  });
  body += '</g>';

  const H = y + 74;
  const status = narrow ? ' Manual page thalha(1) line 1' : ' Manual page thalha(1) line 1 (press h for help or q to quit)';
  body += `<g opacity="1">${appear(1.6, T)}${line(p, [[status, 'text', { inv: 1 }]], PAD, H - 26, 13).svg}</g>`;

  const clip = `
    <clipPath id="typing"><rect x="0" y="0" width="${n(PAD + cmd.width + 4)}" height="${PAD + 30}">
      <animate attributeName="width" values="${n(PAD + cmd.ch * 2)};${n(PAD + cmd.ch * 2)};${n(PAD + cmd.width + 4)};${n(PAD + cmd.width + 4)}" keyTimes="0;${(0.3 / T).toFixed(3)};${(1.1 / T).toFixed(3)};1" dur="${T}s" fill="freeze"/>
    </rect></clipPath>`;
  return frame(p, H, body, 'man thalha. NAME: Thalha Ahmed, thalha-a9 on GitHub. Writes command line tools that check their own answers before showing them to you.', clip);
}

// ── run: a real Helix scan of a made-up name ─────────────────────────────
function run(p) {
  const S = 12.5, LH = 20.5;
  const d = (s) => [s, 'dim'], t = (s) => [s, 'text'];
  const rows = narrow ? [
    [d('$ '), ['helix-osint -u 4tj4jneu4byr --all \\', 'bold']],
    [['    --record-attempt', 'bold']],
    null,
    [d('Target   : '), ['@4tj4jneu4byr', 'cyan']],
    [d('Platforms: '), ['11988', 'cyan']],
    [t('Re-checking 1560 site(s) that timed out')],
    [t('on the fast pass...')],
    [['[control]', 'amber'], t(' Discarded 111 platform(s) that')],
    [t("also 'find' a random nonexistent username")],
    'rule',
    [t('Found '), ['0', 'green', { b: 1 }], t('/11988'), d('    Time 176.5s')],
    'rule',
    null,
    [['  RECORD ATTEMPT | Helix 3.6.0', 'bold', { b: 1 }]],
    [d('  Started   '), t('2026-10-30T19:59:35+00:00')],
    [d('  Finished  '), t('2026-10-30T20:02:31+00:00')],
    [d('  Sites     '), t('11988 attempted')],
    [d('            '), ['10436 answered', 'green']],
    [d('            '), ['1552 no clear answer', 'amber']],
    [d('  Found     '), ['0', 'green', { b: 1 }], t(' accounts')],
    [d('FINGERPRINT')],
    [t('  1865626625b7ab8076d8bb2a54dd53b7')],
    [t('  2c717dd1dd67773ca95d11776196149d')],
  ] : [
    [['$ ', 'dim'], ['helix-osint -u 4tj4jneu4byr --all --record-attempt', 'bold']],
    null,
    [['Target   : ', 'dim'], ['@4tj4jneu4byr', 'cyan']],
    [['Platforms: ', 'dim'], ['11988', 'cyan']],
    [['Scanning @4tj4jneu4byr across 11988 platforms...', 'text']],
    [['Re-checking 1560 site(s) that timed out on the fast pass...', 'text']],
    [['[control]', 'amber'], [" Discarded 111 platform(s) that also 'find' a random", 'text']],
    [['          nonexistent username', 'text']],
    'rule',
    [['Found ', 'text'], ['0', 'green', { b: 1 }], ['/11988', 'text'], ['    Cross-links 0    Time 176.5s', 'dim']],
    'rule',
    null,
    [['  RECORD ATTEMPT | Helix 3.6.0 | @4tj4jneu4byr', 'bold', { b: 1 }]],
    [['  Started   ', 'dim'], ['2026-10-30T19:59:35+00:00', 'text'], ['   Finished ', 'dim'], ['2026-10-30T20:02:31+00:00', 'text']],
    [['  Sites     ', 'dim'], ['11988 attempted | ', 'text'], ['10436 answered', 'green'], [' | ', 'text'], ['1552 no clear answer', 'amber']],
    [['  Found     ', 'dim'], ['0', 'green', { b: 1 }], [' accounts, each verified live against two impossible usernames', 'text']],
    [['FINGERPRINT  ', 'dim'], ['1865626625b7ab8076d8bb2a54dd53b72c717dd1dd67773ca95d11776196149d', 'text']],
  ];
  let y = PAD - 4, body = '';
  for (const r of rows) {
    y += LH;
    if (r === 'rule') body += `<rect x="${PAD}" y="${y - 10}" width="${W - PAD * 2}" height="1" fill="${p.dim}" opacity=".5"/>`;
    else if (r) body += line(p, r, PAD, y, S).svg;
  }
  return frame(p, y + PAD, body, 'A real Helix 3.6.0 run: a made-up username checked on 11,988 sites, 0 accounts found, 176.5 seconds.');
}

// ── end: the footer and the pager's (END) ────────────────────────────────
function end(p) {
  const S = 14.5, H = 96;
  const body = spread(p, 'thalha-a9', 'October 2026', 'THALHA(1)', 38, S)
    + line(p, [['(END)', 'text', { inv: 1 }]], PAD, 72, 13).svg;
  return frame(p, H, body, 'thalha-a9, October 2026, THALHA(1). END');
}

for (const [layout, L] of Object.entries(layouts)) {
  ({ W, PAD } = L);
  narrow = layout === 'narrow';
  for (const name of ['dark', 'light']) {
    const p = palette[name], th = themes[name];
    for (const [base, make] of [['man', man], ['run', run], ['end', end]]) {
      glyphs = new Map();
      const svg = make(p);
      fs.writeFileSync(outPath(base + L.suffix, th), svg);
      console.log(`assets/${base}${L.suffix}-${name}.svg  ${kb(svg)} KB`);
    }
  }
}
