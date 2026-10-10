/**
 * The single source of truth for every graphic in ../assets.
 *
 * Two themes share one geometry. Generators compute layout once, then render
 * it per theme, so the dark and light artwork are the same scene — only the
 * palette changes. The README serves whichever matches the viewer's GitHub
 * theme through <picture> / prefers-color-scheme.
 */

export const radius = { card: 18, tile: 12, pill: 999 };

/** Type ramp — sizes, weights and tracking, in one place. */
export const type = {
  display: { size: 84, weight: 700, tracking: -3.1 },
  h1: { size: 26, weight: 700, tracking: -0.6 },
  title: { size: 19, weight: 700, tracking: -0.4 },
  lead: { size: 18, weight: 400, tracking: -0.1 },
  tagline: { size: 14.5, weight: 400, tracking: -0.05 },
  body: { size: 12.5, weight: 400, tracking: 0 },
  label: { size: 10.5, weight: 600, tracking: 1.5 },
  meta: { size: 11, weight: 400, tracking: 0 },
  pill: { size: 12.5, weight: 500, tracking: 0 },
  tag: { size: 11.5, weight: 500, tracking: 0 },
};

const rgba = (r, g, b) => (a) => `rgba(${r},${g},${b},${a})`;

export const themes = {
  dark: {
    name: 'dark',
    bg: '#08090B', bgTo: '#0A0C0F',
    surface0: '#101318', surface1: '#0C0E12',
    text: '#F3F5F7', text2: '#98A2AE', text3: '#68727E',
    inkHex: '#FFFFFF', ink: rgba(255, 255, 255),
    accent: { emerald: '#34D399', sky: '#38BDF8', rose: '#FB7185', amber: '#FBBF24', indigo: '#6366F1' },
    mesh: 1, grain: 0.05, vignette: 0.92, node: 1,
    shineHi: '#FFFFFF',
    sheen: { color: '#FFFFFF', alpha: 0.075 },
    hair: 0.09, edge: [0.14, 0.06, 0.09],
    tile: { fill: 0.11, stroke: 0.24 },
    pill: { fill: 0.04, stroke: 0.10 },
  },
  light: {
    name: 'light',
    bg: '#FFFFFF', bgTo: '#F3F5F9',
    surface0: '#FFFFFF', surface1: '#F2F4F8',
    text: '#0F172A', text2: '#475569', text3: '#64748B',
    inkHex: '#0F172A', ink: rgba(15, 23, 42),
    // one step darker than the dark-theme accents, for contrast on white
    accent: { emerald: '#059669', sky: '#0284C7', rose: '#E11D48', amber: '#D97706', indigo: '#4F46E5' },
    mesh: 0.75, grain: 0.035, vignette: 0.85, node: 1.15,
    shineHi: '#475569',
    sheen: { color: '#FFFFFF', alpha: 0.6 },
    hair: 0.10, edge: [0.16, 0.08, 0.11],
    tile: { fill: 0.10, stroke: 0.32 },
    pill: { fill: 0.035, stroke: 0.12 },
  },
};

export const outPath = (base, t) => new URL(`../../assets/${base}-${t.name}.svg`, import.meta.url);
export const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
export const n = (v) => Number(v.toFixed(1));
