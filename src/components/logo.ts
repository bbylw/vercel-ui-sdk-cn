/**
 * The site's logo, drawn once for every place it appears: the navbar and docs
 * layout (`Logo.astro`), the social cards (`src/pages/og/_card.ts`), and the
 * favicons (`public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`).
 *
 * Twin 180°-symmetric focus brackets framing a shared core — representing human
 * interaction and agent bridge converging around one state primitive.
 */
const BRACKET_BOTTOM_LEFT =
	"M 3.5 9.0 A 2.3 2.3 0 0 1 8.1 9.0 V 21.0 A 2.9 2.9 0 0 0 11.0 23.9 H 18.5 A 2.3 2.3 0 0 1 18.5 28.5 H 11.0 A 7.5 7.5 0 0 1 3.5 21.0 Z";
const BRACKET_TOP_RIGHT =
	"M 28.5 23.0 A 2.3 2.3 0 0 1 23.9 23.0 V 11.0 A 2.9 2.9 0 0 0 21.0 8.1 H 13.5 A 2.3 2.3 0 0 1 13.5 3.5 H 21.0 A 7.5 7.5 0 0 1 28.5 11.0 Z";
const FOCUS_CORE =
	"M 20.5 16 A 4.5 4.5 0 1 1 11.5 16 A 4.5 4.5 0 1 1 20.5 16 Z";

export const logo = {
	/** The drawing's coordinate box; callers size it equally in width and height. */
	width: 32,
	height: 32,
	brackets: [BRACKET_BOTTOM_LEFT, BRACKET_TOP_RIGHT] as const,
	core: FOCUS_CORE,
	paths: [BRACKET_BOTTOM_LEFT, BRACKET_TOP_RIGHT, FOCUS_CORE] as const,
};
