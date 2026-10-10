/**
 * Integrity check for the generated artwork. Runs last in `npm run build`.
 *
 * A dangling url(#id), a class with no rule, or malformed SMIL timing all fail
 * silently in a browser — it draws nothing and says nothing. This catches them,
 * confirms every asset exists in both themes, and confirms the README and the
 * assets directory agree with each other.
 */
import fs from 'node:fs';

const dir = new URL('../assets/', import.meta.url);
const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
const problems = [];
let total = 0;

for (const file of files) {
  const src = fs.readFileSync(new URL(file, dir), 'utf8');
  const fail = (msg) => problems.push(`${file}: ${msg}`);
  total += Buffer.byteLength(src);

  const ids = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const ref of new Set([...src.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]))) {
    if (!ids.has(ref)) fail(`url(#${ref}) has no matching id`);
  }

  const used = new Set([...src.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean));
  const defined = new Set([...src.matchAll(/\.([A-Za-z][\w-]*)\s*\{/g)].map((m) => m[1]));
  for (const c of used) if (!defined.has(c)) fail(`class "${c}" has no rule`);

  for (const [tag] of src.matchAll(/<animate(?:Motion|Transform)?\b[^>]*>/g)) {
    const kt = tag.match(/keyTimes="([^"]+)"/);
    if (!kt) continue;
    const k = kt[1].split(';').map(Number);
    if (k[0] !== 0 || k.at(-1) !== 1) fail(`keyTimes must run 0..1 — got ${kt[1]}`);
    if (k.some((v, i) => i && v < k[i - 1])) fail(`keyTimes not monotonic — ${kt[1]}`);
    for (const attr of ['values', 'keyPoints']) {
      const m = tag.match(new RegExp(`${attr}="([^"]+)"`));
      if (m && m[1].split(';').length !== k.length) fail(`${attr} has ${m[1].split(';').length} entries, keyTimes has ${k.length}`);
    }
    const ks = tag.match(/keySplines="([^"]+)"/);
    if (ks && ks[1].split(';').length !== k.length - 1) fail(`keySplines needs ${k.length - 1} entries — ${ks[1]}`);
  }

  const opens = (src.match(/<[a-zA-Z]/g) || []).length;
  const closes = (src.match(/<\/[a-zA-Z]/g) || []).length + (src.match(/\/>/g) || []).length;
  if (opens !== closes) fail(`tag mismatch: ${opens} opened, ${closes} closed`);

  // every theme must have its counterpart, pixel-for-pixel the same scene
  const other = file.endsWith('-dark.svg') ? file.replace('-dark.svg', '-light.svg')
              : file.endsWith('-light.svg') ? file.replace('-light.svg', '-dark.svg') : null;
  if (!other) fail('not named for a theme (expected *-dark.svg or *-light.svg)');
  else if (!files.includes(other)) fail(`missing its ${other} counterpart`);

  console.log(`  ${file.padEnd(30)} ${(Buffer.byteLength(src) / 1024).toFixed(1).padStart(6)} KB`);
}

// the README and the assets directory must agree
const referenced = new Set([...readme.matchAll(/assets\/([\w-]+\.svg)/g)].map((m) => m[1]));
for (const r of referenced) if (!files.includes(r)) problems.push(`README references assets/${r}, which does not exist`);
for (const f of files) if (!referenced.has(f)) problems.push(`assets/${f} is not referenced by the README`);

// every <picture> must offer both themes
for (const [pic] of readme.matchAll(/<picture>[\s\S]*?<\/picture>/g)) {
  if (!/prefers-color-scheme: dark/.test(pic) || !/prefers-color-scheme: light/.test(pic)) problems.push('a <picture> is missing a theme source');
}

if (problems.length) {
  console.error('\nFAILED:\n' + problems.map((p) => '  ' + p).join('\n'));
  process.exit(1);
}
console.log(`\n${files.length} assets · ${(total / 1024).toFixed(0)} KB raw · both themes present · README in sync.`);
