/**
 * Integrity check for the generated artwork.
 *
 * A dangling `url(#id)` or a class with no matching rule fails silently in an
 * SVG — the browser just draws nothing and the page looks subtly wrong. This
 * catches both, plus malformed XML and SMIL timing that browsers discard.
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = new URL('../assets/', import.meta.url);
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();
const problems = [];

for (const file of files) {
  const src = fs.readFileSync(new URL(file, dir), 'utf8');
  const fail = (msg) => problems.push(`${file}: ${msg}`);

  // every url(#…) must point at an id that exists
  const ids = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const ref of new Set([...src.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]))) {
    if (!ids.has(ref)) fail(`url(#${ref}) has no matching id`);
  }

  // every class used must have a rule, or the element renders unstyled
  const used = new Set(
    [...src.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean),
  );
  const defined = new Set([...src.matchAll(/\.([A-Za-z][\w-]*)\s*\{/g)].map((m) => m[1]));
  for (const c of used) if (!defined.has(c)) fail(`class "${c}" has no rule`);

  // SMIL discards the whole animation if keyTimes is malformed
  for (const [tag] of src.matchAll(/<animate(?:Motion|Transform)?\b[^>]*>/g)) {
    const kt = tag.match(/keyTimes="([^"]+)"/);
    if (!kt) continue;
    const k = kt[1].split(';').map(Number);
    if (k[0] !== 0 || k.at(-1) !== 1) fail(`keyTimes must run 0..1 — got ${kt[1]}`);
    if (k.some((v, i) => i && v < k[i - 1])) fail(`keyTimes not monotonic — ${kt[1]}`);
    for (const attr of ['values', 'keyPoints']) {
      const m = tag.match(new RegExp(`${attr}="([^"]+)"`));
      if (m && m[1].split(';').length !== k.length) {
        fail(`${attr} has ${m[1].split(';').length} entries but keyTimes has ${k.length}`);
      }
    }
  }

  // balanced tags, cheaply: let the XML parser in the browser agree
  const opens = (src.match(/<[a-zA-Z]/g) || []).length;
  const closes = (src.match(/<\/[a-zA-Z]/g) || []).length + (src.match(/\/>/g) || []).length;
  if (opens !== closes) fail(`tag mismatch: ${opens} opened, ${closes} closed/self-closed`);

  const kb = (Buffer.byteLength(src) / 1024).toFixed(1);
  console.log(`  ${file.padEnd(24)} ${kb.padStart(6)} KB`);
}

if (problems.length) {
  console.error('\nFAILED:\n' + problems.map((p) => '  ' + p).join('\n'));
  process.exit(1);
}
console.log(`\n${files.length} assets, no dangling references, timing valid.`);
