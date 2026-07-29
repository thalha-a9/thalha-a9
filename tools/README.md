# profile studio

Every graphic in [`../assets`](../assets) is generated from this directory. None
of them are hand-edited — change the tokens or the copy here and rebuild.

```bash
npm install
npm run build
```

| script | output |
|:--|:--|
| `build-fonts.mjs` | decompresses Inter + JetBrains Mono from woff2 into `fonts/` |
| `gen-hero.mjs` | `assets/hero.svg` |
| `gen-cards.mjs` | `assets/card-*.svg` |
| `gen-ui.mjs` | `assets/code.svg`, `assets/footer.svg` |

## Notes

**Type is outlined, not linked.** Text is converted to vector paths with
opentype.js, so the artwork renders identically everywhere with no webfont to
load and no fallback to go wrong. `design/type.mjs` composes glyphs straight from
the cmap with kerning applied by hand, because opentype.js' shaper throws on one
of Inter's GSUB lookups.

**Copy is measured before it is drawn.** `gen-cards.mjs` checks every string
against its column and warns on overflow, so a copy edit cannot silently break
the layout.

**The constellation is computed at build time.** Nodes are rejection sampled
against the hero's text safe zone, and links only ever join nodes within one
drifting cluster — so a cluster animates as a single transform and its lines
follow for free.

**Motion respects `prefers-reduced-motion`.**
