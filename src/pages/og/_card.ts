/**
 * The site's social cards, 1200 × 630 PNGs rendered at build time: the focus-ring
 * mark and wordmark over a hairline, then the page's section and title, on the
 * site's dark ink ground. `og/[...slug].ts` draws one per page and `og.png.ts`
 * the site's own. This file is the cards' look; edit it freely.
 *
 * `@cloudflare/nimbus-docs/og` does the rest: it loads the fonts, fits text to
 * its lines by measuring it, and renders the PNG. Inter sets the Latin; Noto
 * Sans SC follows it in `fonts` and draws the Chinese glyphs Inter lacks.
 *
 * The leading underscore keeps Astro from routing this file or `_fonts/`.
 */
import { createCardRenderer, type CardNode, type CardTypography } from "@cloudflare/nimbus-docs/og";
import { root } from "astro:config/server";

import { logo } from "@/components/logo";

// The site's dark theme (src/styles/globals.css), in hex for Satori.
const BACKGROUND = "#070d18";
const FOREGROUND = "#eaeff5";
const MUTED = "#95a0ab";
const BORDER = "#202938";
const BRAND = "#5fa7ff";
const AGENT = "#ff893b";

const WIDTH = 1200;
const HEIGHT = 630;
const LEFT = 80;
const COLUMN = WIDTH - LEFT - 200;

const TITLE: CardTypography = { fontFamily: "Inter", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.12, color: FOREGROUND };
const SECTION: CardTypography = { fontFamily: "Inter", fontWeight: 400, lineHeight: 1.2, color: MUTED };
const WORDMARK: CardTypography = { fontFamily: "Inter", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1, color: FOREGROUND };

// Fonts sit beside this file, not in public/, so they never ship. Read from
// the project so `astro build --root <site>` finds them.
const font = (file: string) => new URL(`src/pages/og/_fonts/${file}`, root);
const renderer = await createCardRenderer({
  width: WIDTH,
  height: HEIGHT,
  fonts: [
    { name: "Inter", source: font("Inter-Regular.ttf"), weight: 400 },
    { name: "Inter", source: font("Inter-Medium.ttf"), weight: 500 },
    { name: "Noto Sans SC", source: font("NotoSansSC-Regular.otf"), weight: 400 },
    { name: "Noto Sans SC", source: font("NotoSansSC-Medium.otf"), weight: 500 },
  ],
  emoji: "strip",
});

type Style = Record<string, string | number>;
const el = (type: string, style: Style, children?: CardNode | (CardNode | undefined)[] | string): CardNode => ({
  type,
  props: { style, children },
});

const Logo = (height: number, color: string): CardNode => ({
  type: "svg",
  props: {
    width: Math.round((height * logo.width) / logo.height),
    height,
    viewBox: `0 0 ${logo.width} ${logo.height}`,
    children: logo.paths.map((d) => ({ type: "path", props: { d, fill: color, fillRule: "evenodd" } })),
  },
});

// The mark, blown up and cropped at the right edge: a faint echo of the logo
// that gives the ground some depth without competing with the title.
const RingMotif = (): CardNode => ({
  type: "svg",
  props: {
    width: 380,
    height: 380,
    viewBox: "0 0 32 32",
    style: { position: "absolute", right: -70, top: 150 },
    children: [
      { type: "rect", props: { x: 4, y: 4, width: 24, height: 24, rx: 7.5, fill: "none", stroke: BRAND, strokeOpacity: 0.16, strokeWidth: 1.1 } },
      { type: "circle", props: { cx: 16, cy: 16, r: 3.4, fill: BRAND, fillOpacity: 0.16 } },
    ],
  },
});

async function card({ section, title, sizes }: { section?: string; title: string; sizes: number[] }): Promise<CardNode> {
  const heading = await renderer.fit(title, { width: COLUMN, sizes, lines: 3, style: TITLE });
  const label = section ? await renderer.fit(section, { width: COLUMN - 28, sizes: [26], lines: 1, style: SECTION }) : undefined;
  return el("div", { width: WIDTH, height: HEIGHT, display: "flex", position: "relative", background: BACKGROUND }, [
    RingMotif(),
    // Mark + wordmark.
    el("div", { position: "absolute", left: LEFT, top: 64, display: "flex", alignItems: "center", gap: 14 }, [
      Logo(34, BRAND),
      el("div", { display: "flex", fontSize: 30, ...WORDMARK }, "UI SDK"),
    ]),
    el("div", { position: "absolute", left: LEFT, right: LEFT, top: 138, height: 0, borderTop: `1.5px solid ${BORDER}` }),
    // Section, hung from the hairline with a signal-orange tick.
    el("div", { position: "absolute", left: LEFT, top: 182, display: "flex", flexDirection: "column" }, [
      label &&
        el("div", { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }, [
          el("div", { width: 9, height: 9, background: AGENT, borderRadius: 2, display: "flex" }),
          label.node,
        ]),
      heading.node,
    ]),
    // The domain, set low so X's 2:1 crop keeps it clear of the title.
    el("div", { position: "absolute", left: LEFT, bottom: 52, display: "flex", fontSize: 22, fontFamily: "Inter", fontWeight: 400, color: MUTED, letterSpacing: "0.01em" }, "ui-sdk.dev"),
  ]);
}

/** A page's card. */
export const renderPageCard = async (input: { section?: string; title: string }) =>
  renderer.png(await card({ ...input, sizes: [64, 56, 50, 44] }));

/** The site's card: its description, or its title when it has none. */
export const renderSiteCard = async (input: { title: string }) =>
  renderer.png(await card({ ...input, sizes: [72, 64, 56, 50, 44] }));