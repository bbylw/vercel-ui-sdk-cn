import { useState, type ReactNode } from "react";
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { toast } from "@ui-sdk/react/toast";
import { Check, CopyIcon, cx } from "./ui";

export const FRAMEWORKS = [
	{
		value: "react",
		label: "React",
		file: "bookmark.tsx",
		lang: "tsx" as const,
		code: `import { Toggle } from "@ui-sdk/react/toggle"

export function Bookmark() {
  return <Toggle>书签</Toggle>
}`,
	},
	{
		value: "vue",
		label: "Vue",
		file: "Bookmark.vue",
		lang: "vue" as const,
		code: `<script setup>
import { Toggle } from "@ui-sdk/vue/toggle"
</script>

<template>
  <Toggle>书签</Toggle>
</template>`,
	},
	{
		value: "svelte",
		label: "Svelte",
		file: "Bookmark.svelte",
		lang: "svelte" as const,
		code: `<script>
  import { Toggle } from "@ui-sdk/svelte/toggle"
</script>

<Toggle>书签</Toggle>`,
	},
	{
		value: "solid",
		label: "Solid",
		file: "bookmark.tsx",
		lang: "tsx" as const,
		code: `import { Toggle } from "@ui-sdk/solid/toggle"

export function Bookmark() {
  return <Toggle>书签</Toggle>
}`,
	},
	{
		value: "web",
		label: "Web Components",
		file: "index.html",
		lang: "html" as const,
		code: `<script type="module" src="https://ui-sdk.dev/web.js"></script>
<link rel="stylesheet" href="https://ui-sdk.dev/web.css" />

<ui-toggle><button>书签</button></ui-toggle>`,
	},
];

type FrameworkSlots = {
	react?: ReactNode;
	vue?: ReactNode;
	svelte?: ReactNode;
	solid?: ReactNode;
	web?: ReactNode;
};

export function FrameworkTabs(slots: FrameworkSlots) {
	const [copiedFile, setCopiedFile] = useState<string | null>(null);

	async function copyCode(file: string, code: string) {
		try {
			await navigator.clipboard?.writeText(code);
		} catch {
			/* Clipboard may be unavailable; toast still confirms interaction. */
		}
		setCopiedFile(file);
		toast.success("已复制示例代码", { description: file });
		setTimeout(() => setCopiedFile((prev) => (prev === file ? null : prev)), 1600);
	}

	return (
		<Tabs defaultValue="react" className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
			<div className="border-b border-border bg-muted/40 px-3 pt-3 pb-1.5">
				<TabsList
					aria-label="选择框架"
					className="max-w-full gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<TabsIndicator />
					{FRAMEWORKS.map((f) => (
						<TabsTab
							key={f.value}
							value={f.value}
							className="shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground data-[selected]:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						>
							{f.label}
						</TabsTab>
					))}
				</TabsList>
			</div>
			{FRAMEWORKS.map((f) => {
				const isCopied = copiedFile === f.value;
				const slotNode = slots[f.value as keyof FrameworkSlots];
				return (
					<TabsPanel key={f.value} value={f.value} className="focus-visible:outline-none">
						<div className="flex items-center justify-between gap-2 border-b border-border px-5 py-2.5">
							<div className="flex min-w-0 items-center gap-2">
								<span className="flex shrink-0 gap-1.5" aria-hidden="true">
									<span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
									<span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
									<span className="h-2.5 w-2.5 rounded-full bg-success/70" />
								</span>
								<span className="ms-2 truncate font-mono text-xs text-muted-foreground">{f.file}</span>
							</div>
							<button
								type="button"
								onClick={() => copyCode(f.value, f.code)}
								aria-label={`复制 ${f.label} 代码`}
								className={cx(
									"inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-1 font-mono text-[0.6875rem] text-muted-foreground transition-[color,border-color,transform] duration-200 active:scale-[0.97] hover:border-border-strong hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
									isCopied && "border-success text-success-foreground",
								)}
							>
								{isCopied ? <Check className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
								<span>{isCopied ? "已复制" : "复制"}</span>
							</button>
						</div>
						{slotNode ?? (
							<pre className={cx("overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed text-foreground")}>
								<code>{f.code}</code>
							</pre>
						)}
					</TabsPanel>
				);
			})}
		</Tabs>
	);
}
