import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// nimbus-docs spawns `pagefind.cmd` on Windows, but bun only emits `.exe`/`.bunx`
// shims in node_modules/.bin. Recreate the npm-style .cmd so search indexing runs.
if (process.platform === "win32") {
	const root = join(dirname(fileURLToPath(import.meta.url)), "..");
	const runner = join(root, "node_modules", "pagefind", "lib", "runner", "bin.cjs");
	const cmd = join(root, "node_modules", ".bin", "pagefind.cmd");
	if (existsSync(runner) && !existsSync(cmd)) {
		writeFileSync(cmd, `@ECHO off\r\nnode "%~dp0..\\pagefind\\lib\\runner\\bin.cjs" %*\r\n`);
	}
}