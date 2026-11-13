/**
 * The site's logo, drawn once for every place it appears: the header and the
 * docs layout (Logo.astro) and the social cards (src/pages/og/_card.ts).
 * A focus ring around a point — the mark of a library about focus, selection
 * and the invisible behaviors of an interface. Single colour; each place fills
 * it with its own text colour. Paths rely on the evenodd fill rule.
 */
export const logo = {
  /** The drawing's box; callers size it by height and keep the ratio. */
  width: 32,
  height: 32,
  paths: [
    // Rounded-square ring: outer + inner subpath, evenodd leaves the band.
    "M10.5 2.5 H21.5 A8 8 0 0 1 29.5 10.5 V21.5 A8 8 0 0 1 21.5 29.5 H10.5 A8 8 0 0 1 2.5 21.5 V10.5 A8 8 0 0 1 10.5 2.5 Z M10.5 6 H21.5 A4.5 4.5 0 0 1 26 10.5 V21.5 A4.5 4.5 0 0 1 21.5 26 H10.5 A4.5 4.5 0 0 1 6 21.5 V10.5 A4.5 4.5 0 0 1 10.5 6 Z",
    // The point at the centre of the focus ring.
    "M20 16 A4 4 0 1 1 12 16 A4 4 0 1 1 20 16 Z",
  ],
};
