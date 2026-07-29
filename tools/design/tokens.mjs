/** The single source of truth for every graphic in ../assets. */

export const color = {
  bg: '#08090B',
  surface0: '#101318',
  surface1: '#0C0E12',
  text: '#F3F5F7',
  text2: '#98A2AE',
  text3: '#68727E',
  hair: 0.09,          // border alpha, white
};

export const accent = {
  emerald: '#34D399',
  sky: '#38BDF8',
  rose: '#FB7185',
  amber: '#FBBF24',
};

export const radius = { card: 18, tile: 12, pill: 999 };

/** Type ramp — sizes, weights and tracking, in one place. */
export const type = {
  display: { size: 84, weight: 700, tracking: -3.1 },
  title: { size: 19, weight: 700, tracking: -0.4 },
  lead: { size: 18, weight: 400, tracking: -0.1 },
  body: { size: 12.5, weight: 400, tracking: 0 },
  label: { size: 10.5, weight: 600, tracking: 1.5 },
  meta: { size: 11, weight: 400, tracking: 0 },
  pill: { size: 12.5, weight: 500, tracking: 0 },
};

export const space = { pad: 26, gap: 12 };

/** rgba() helper so alpha values stay readable at the call site. */
export const white = (a) => `rgba(255,255,255,${a})`;
