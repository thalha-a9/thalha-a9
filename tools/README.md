# profile studio

Every graphic in [`../assets`](../assets) is generated from this directory, in a
**dark and a light theme from one scene**. Nothing is hand-edited — change the
tokens or the copy here and rebuild. CI does the same on every push.

```bash
npm install
npm run build
```

| script | output |
|:--|:--|
| `build-fonts.mjs` | decompresses Inter and JetBrains Mono from woff2 into `fonts/` |
| `gen-hero.mjs` | `assets/hero-{dark,light}.svg` |
| `gen-cards.mjs` | `assets/card-*-{dark,light}.svg` — the four disciplines |
| `gen-projects.mjs` | `assets/project-*-{dark,light}.svg` — Helix and git-mistake |
| `gen-ui.mjs` | `assets/code-*.svg`, `assets/footer-*.svg` |
| `check.mjs` | fails the build on anything a browser would swallow silently |

## How it holds together

**Two themes, one geometry.** Each generator computes its layout once and renders
it per theme from `design/tokens.mjs`. The README serves the matching one through
`<picture>` and `prefers-color-scheme`, so the page follows the viewer's GitHub
theme instead of forcing a dark slab onto a light page.

**Type is outlined, not linked.** Text is converted to vector paths with
opentype.js, so the artwork renders identically everywhere with no webfont to
load and no fallback to go wrong. `design/type.mjs` composes glyphs straight from
the cmap with kerning applied by hand, because opentype.js' shaper throws on one
of Inter's GSUB lookups.

**Copy is measured before it is drawn.** Every string is checked against its
column at build time. An edit that would overflow the art fails the build
instead of shipping — the hero additionally asserts the wordmark clears the
constellation's safe zone.

**The constellation is computed at build time.** Nodes are rejection sampled
against the hero's text safe zone, and links only join nodes within one drifting
cluster, so a cluster animates as a single transform and its lines follow for
free. That is what keeps the hero small.

**`check.mjs` catches the silent failures.** A dangling `url(#id)`, a class with
no rule, SMIL `keyTimes` that don't run `0..1`, a mismatched `keySplines` count,
a missing theme counterpart, or a README that references an asset that doesn't
exist — a browser renders none of these as an error. The build does.

**Motion is ambient, never load-bearing.** Nothing visible depends on an
animation having run, and everything honours `prefers-reduced-motion`.
