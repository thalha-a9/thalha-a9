# profile studio

Every graphic in [`../assets`](../assets) is generated here, in a dark and a
light theme. Nothing is edited by hand: change the text in `gen-man.mjs` and
rebuild. CI does the same on every push.

```bash
npm install
npm run build
```

| script | output |
|:--|:--|
| `build-fonts.mjs` | unpacks Inter and JetBrains Mono from woff2 into `fonts/` |
| `gen-man.mjs` | `assets/man-*.svg`, `assets/run-*.svg`, `assets/end-*.svg` |
| `check.mjs` | fails the build on anything a browser would skip without a word |

## Notes

**It is a manual page.** The profile reads like `man thalha`: header line,
NAME, SYNOPSIS and DESCRIPTION in the art, the other sections in the README,
and the footer with the pager's `(END)` at the bottom. Dark is a terminal,
light is printed paper.

**The Helix run is real.** `run-*.svg` copies its lines from the Helix 3.6.0
record run of 30 October 2026 on the made-up name `4tj4jneu4byr`, fingerprint
included. If the numbers change, they change from a new run, not by hand.

**Type is outlined.** Each glyph is drawn once from JetBrains Mono and placed
with `<use>`, so the art needs no webfont and stays small.

**Motion is a bonus.** `man thalha` types itself and the page fades in once.
Without animation, every line is simply there.

**`check.mjs` catches the quiet failures.** A dangling `url(#id)`, SMIL timing
that doesn't run from 0 to 1, an asset missing its other theme, or a README
that points at an asset that doesn't exist. A browser shows none of these as
an error. The build does.
