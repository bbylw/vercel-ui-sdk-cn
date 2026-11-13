import { useState } from "react";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { toast } from "@ui-sdk/react/toast";
import { Check, CopyIcon, cx } from "./ui";

const COMMANDS: Record<string, string> = {
	bun: "bun add @ui-sdk/react @ui-sdk/core",
	npm: "npm install @ui-sdk/react @ui-sdk/core",
	pnpm: "pnpm add @ui-sdk/react @ui-sdk/core",
};

export function CopyCommand() {
	const [pm, setPm] = useState("bun");
	const [copied, setCopied] = useState(false);
	const command = COMMANDS[pm];

	async function copy() {
		try {
			await navigator.clipboard?.writeText(command);
		} catch {
			/* Clipboard may be unavailable; the toast still confirms the demo. */
		}
		setCopied(true);
		toast.success("已复制安装命令", { description: command });
		setTimeout(() => setCopied(false), 1600);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
			<div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-2">
				<ToggleGroup
					value={[pm]}
					deselectable={false}
					onValueChange={(v) => v[0] && setPm(v[0])}
					aria-label="包管理器"
					className="inline-flex gap-1"
				>
					{Object.keys(COMMANDS).map((k) => (
						<Toggle
							key={k}
							value={k}
							className="rounded-md px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground data-[pressed]:bg-card data-[pressed]:text-brand data-[pressed]:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						>
							{k}
						</Toggle>
					))}
				</ToggleGroup>
				<span className="font-mono text-[0.6875rem] uppercase tracking-wide text-muted-foreground">terminal</span>
			</div>
			<div className="flex items-center gap-3 px-4 py-4">
				<span className="select-none font-mono text-sm text-agent" aria-hidden="true">$</span>
				<code className="flex-1 select-all overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground scrollbar-none [&::-webkit-scrollbar]:hidden">
					{command}
				</code>
				<button
					type="button"
					onClick={copy}
					aria-label="复制安装命令"
					className={cx(
						"inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 font-mono text-xs text-muted-foreground transition-[color,border-color,transform] duration-200 active:scale-[0.97] hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
						copied && "border-success text-success-foreground",
					)}
				>
					{copied ? <Check className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
					<span className="hidden sm:inline">{copied ? "已复制" : "复制"}</span>
				</button>
			</div>
		</div>
	);
}
