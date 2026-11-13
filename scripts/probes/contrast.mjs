// WCAG contrast audit for the site's oklch design tokens (dark + light).
// oklch -> OKLab -> linear sRGB -> gamma sRGB -> relative luminance -> ratio.
function oklchToSrgb(L, C, H, alpha = 1) {
	const h = (H * Math.PI) / 180;
	const a = C * Math.cos(h);
	const b = C * Math.sin(h);
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;
	const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
	const lin = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
	const gamma = lin.map((v) => {
		const c = Math.min(1, Math.max(0, v));
		return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
	});
	return { rgb: gamma.map((v) => Math.round(v * 255)), alpha };
}
function parse(str) {
	const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
	if (!m) throw new Error("bad oklch: " + str);
	return oklchToSrgb(+m[1], +m[2], +m[3], m[4] ? +m[4] : 1);
}
function composite(fg, base) {
	if (fg.alpha >= 1) return fg.rgb;
	return fg.rgb.map((c, i) => Math.round(c * fg.alpha + base[i] * (1 - fg.alpha)));
}
function lum(rgb) {
	const [r, g, b] = rgb.map((v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
	const l1 = lum(fg), l2 = lum(bg);
	return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const themes = {
	dark: {
		background: "oklch(0.16 0.025 260)",
		foreground: "oklch(0.95 0.01 250)",
		card: "oklch(0.2 0.028 260)",
		mutedForeground: "oklch(0.7 0.02 250)",
		brand: "oklch(0.72 0.15 255)",
		borderStrong: "oklch(0.5 0.035 260)",
		agent: "oklch(0.75 0.17 50)",
		agentForeground: "oklch(0.8 0.15 50)",
		agentMuted: "oklch(0.35 0.1 50 / 0.3)",
		successFg: "oklch(0.82 0.15 150)",
		successMuted: "oklch(0.32 0.08 150 / 0.3)",
		dangerFg: "oklch(0.75 0.17 25)",
		dangerMuted: "oklch(0.35 0.12 25 / 0.3)",
		warningFg: "oklch(0.85 0.13 85)",
		warningMuted: "oklch(0.35 0.08 80 / 0.35)",
		infoFg: "oklch(0.78 0.13 255)",
		infoMuted: "oklch(0.32 0.1 255 / 0.3)",
	},
	light: {
		background: "oklch(0.985 0.006 90)",
		foreground: "oklch(0.22 0.02 260)",
		card: "oklch(0.997 0.003 90)",
		mutedForeground: "oklch(0.5 0.02 260)",
		brand: "oklch(0.55 0.19 255)",
		borderStrong: "oklch(0.655 0.015 250)",
		agent: "oklch(0.575 0.19 45)",
		agentForeground: "oklch(0.55 0.19 45)",
		agentMuted: "oklch(0.95 0.06 55 / 0.4)",
		successFg: "oklch(0.5 0.17 150)",
		successMuted: "oklch(0.95 0.05 150 / 0.55)",
		dangerFg: "oklch(0.55 0.22 25)",
		dangerMuted: "oklch(0.95 0.04 25 / 0.45)",
		warningFg: "oklch(0.55 0.14 75)",
		warningMuted: "oklch(0.94 0.09 85 / 0.3)",
		infoFg: "oklch(0.5 0.19 255)",
		infoMuted: "oklch(0.94 0.04 255 / 0.5)",
	},
};

// Find the lightness (same chroma/hue) that reaches `target` against baseRgb.
function searchL(chroma, hue, baseRgb, startL, dir, target) {
	let L = startL;
	for (let i = 0; i < 400; i++) {
		const rgb = oklchToSrgb(L, chroma, hue).rgb;
		if (ratio(rgb, baseRgb) >= target) return L;
		L += dir * 0.005;
	}
	return L;
}

let failures = 0;
for (const [name, t] of Object.entries(themes)) {
	const bg = parse(t.background).rgb;
	const card = parse(t.card).rgb;
	const checks = [
		["body text on background", parse(t.foreground).rgb, bg, 4.5],
		["body text on card", parse(t.foreground).rgb, card, 4.5],
		["muted text on background", parse(t.mutedForeground).rgb, bg, 4.5],
		["muted text on card", parse(t.mutedForeground).rgb, card, 4.5],
		["brand link on background", parse(t.brand).rgb, bg, 4.5],
		["brand link on card", parse(t.brand).rgb, card, 4.5],
		["agent button text on agent", bg, parse(t.agent).rgb, 4.5],
		["agent chip text on agent-muted", parse(t.agentForeground).rgb, composite(parse(t.agentMuted), card), 4.5],
		["agent number text on background", parse(t.agent).rgb, bg, 4.5],
		["success text on tone", parse(t.successFg).rgb, composite(parse(t.successMuted), card), 4.5],
		["danger text on tone", parse(t.dangerFg).rgb, composite(parse(t.dangerMuted), card), 4.5],
		["warning text on tone", parse(t.warningFg).rgb, composite(parse(t.warningMuted), card), 4.5],
		["info text on tone", parse(t.infoFg).rgb, composite(parse(t.infoMuted), card), 4.5],
		["control edge on background", parse(t.borderStrong).rgb, bg, 3],
		["control edge on card", parse(t.borderStrong).rgb, card, 3],
		["brand control edge on bg", parse(t.brand).rgb, bg, 3],
	];
	console.log(`\n=== ${name} theme ===`);
	for (const [label, fg, bgc, min] of checks) {
		const r = ratio(fg, bgc);
		const pass = r >= min;
		if (!pass) failures++;
		console.log(`${pass ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1 (min ${min})  ${label}`);
	}
	const bs = name === "dark" ? { c: 0.035, h: 260, l: 0.38, dir: 1 } : { c: 0.015, h: 250, l: 0.86, dir: -1 };
	const hardBase = name === "dark" ? card : bg;
	const targetL = searchL(bs.c, bs.h, hardBase, bs.l, bs.dir, 3);
	const targetRgb = oklchToSrgb(targetL, bs.c, bs.h).rgb;
	console.log(`  border-strong target 3:1: oklch(${targetL.toFixed(3)} ${bs.c} ${bs.h}) -> ${ratio(targetRgb, card).toFixed(2)}:1 vs card, ${ratio(targetRgb, bg).toFixed(2)}:1 vs bg`);
	if (name === "light") {
		const agentL = searchL(0.19, 45, bg, 0.62, -1, 4.5);
		const agentRgb = oklchToSrgb(agentL, 0.19, 45).rgb;
		console.log(`  agent target 4.5:1 on bg: oklch(${agentL.toFixed(3)} 0.19 45) -> ${ratio(agentRgb, bg).toFixed(2)}:1 (also white-on-agent button)`);
	}
}
console.log(`\n${failures === 0 ? "ALL PASS" : failures + " FAILURES"}`);
process.exit(failures === 0 ? 0 : 1);