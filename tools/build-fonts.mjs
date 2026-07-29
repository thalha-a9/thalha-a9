// Inter ships as woff2; opentype.js needs the raw sfnt. Decompress once into fonts/.
import { decompress } from 'wawoff2';
import fs from 'node:fs';
import path from 'node:path';

const out = new URL('./fonts/', import.meta.url);
fs.mkdirSync(out, { recursive: true });

const FAMILIES = {
  inter: { pkg: 'inter', weights: ['400', '500', '600', '700'] },
  mono: { pkg: 'jetbrains-mono', weights: ['400', '500', '700'] },
};

for (const [name, { pkg, weights }] of Object.entries(FAMILIES)) {
  for (const weight of weights) {
    const src = new URL(
      `./node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`,
      import.meta.url,
    );
    const ttf = Buffer.from(await decompress(fs.readFileSync(src)));
    fs.writeFileSync(new URL(`${name}-${weight}.ttf`, out), ttf);
    console.log(`fonts/${name}-${weight}.ttf  ${(ttf.length / 1024).toFixed(1)} KB`);
  }
}
