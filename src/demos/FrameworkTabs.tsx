import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { cx } from "./ui";

const FRAMEWORKS = [
	{
		value: "react",
		label: "React",
		file: "bookmark.tsx",
		code: `import { Toggle } from "@ui-sdk/react/toggle"

export function Bookmark() {
  return <Toggle>书签</Toggle>
}`,
	},
	{
		value: "vue",
		label: "Vue",
		file: "Bookmark.vue",
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
		code: `<script>
  import { Toggle } from "@ui-sdk/svelte/toggle"
</script>

<Toggle>书签</Toggle>`,
	},
	{
		value: "solid",
		label: "Solid",
		file: "bookmark.tsx",
		code: `import { Toggle } from "@ui-sdk/solid/toggle"

export function Bookmark() {
  return <Toggle>书签</Toggle>
}`,
	},
	{
		value: "web",
		label: "Web Components",
		file: "index.html",
		code: `<script type="module" src="https://ui-sdk.dev/web.js"></script>
<link rel="stylesheet" href="https://ui-sdk.dev/web.css" />

<ui-toggle><button>书签</button></ui-toggle>`,
	},
];

export function FrameworkTabs() {
	return (
		<Tabs defaultValue="react" className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
			<div className="border-b border-border bg-muted/40 px-3 pt-3">
				<TabsList aria-label="选择框架" className="gap-1">
					<TabsIndicator />
					{FRAMEWORKS.map((f) => (
						<TabsTab
							key={f.value}
							value={f.value}
							className="rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground data-[selected]:text-foreground"
						>
							{f.label}
						</TabsTab>
					))}
				</TabsList>
			</div>
			{FRAMEWORKS.map((f) => (
				<TabsPanel key={f.value} value={f.value} className="focus-visible:outline-none">
					<div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
						<span className="flex gap-1.5" aria-hidden="true">
							<span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
							<span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
							<span className="h-2.5 w-2.5 rounded-full bg-success/70" />
						</span>
						<span className="ms-2 font-mono text-xs text-muted-foreground">{f.file}</span>
					</div>
					<pre className={cx("overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed text-foreground")}>
						<code>{f.code}</code>
					</pre>
				</TabsPanel>
			))}
		</Tabs>
	);
}