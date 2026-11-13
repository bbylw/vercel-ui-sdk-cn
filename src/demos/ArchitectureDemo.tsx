import { useState } from "react";
import { Toggle } from "@ui-sdk/react/toggle";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-sdk/react/select";
import { Check, ChevronDown, cx, item, popup, selectTrigger } from "./ui";

const LAYERS = [
	{
		id: "core",
		tag: "@ui-sdk/core",
		title: "1. 行为原语与状态机",
		desc: "封装焦点管理、键盘模型、弹出层顶层定位、选择逻辑与 ARIA 属性，完全独立于 UI 框架与 CSS。",
		meta: "definePrimitive · createSelection · createPopup",
	},
	{
		id: "adapter",
		tag: "@ui-sdk/<framework>",
		title: "2. 轻量框架绑定层",
		desc: "通过 createParts 将同一套原语映射为 React、Vue、Svelte、Solid 或 Web Components 部件。",
		meta: "React · Vue · Svelte · Solid · Web",
	},
	{
		id: "style",
		tag: "你的设计系统",
		title: "3. 零耦合外观样式",
		desc: "组件仅输出 data-open、data-pressed、data-highlighted 等状态属性，样式由 Tailwind 或任意 CSS 决定。",
		meta: "data-pressed · data-open · data-highlighted",
	},
] as const;

const REGIONS = [
	{ value: "hnd", label: "东京 · hnd1" },
	{ value: "sin", label: "新加坡 · sin1" },
	{ value: "iad", label: "美东 · iad1" },
];

export function ArchitectureDemo() {
	const [activeLayer, setActiveLayer] = useState<(typeof LAYERS)[number]["id"]>("core");
	const [styled, setStyled] = useState(true);
	const [autoDeploy, setAutoDeploy] = useState(true);
	const [region, setRegion] = useState("sin");

	const regionLabel = REGIONS.find((r) => r.value === region)?.label ?? region;

	const inspectorCode =
		activeLayer === "core"
			? `// @ui-sdk/core — 行为与状态输出（不依赖样式或框架）
<Toggle aria-pressed="${autoDeploy}" ${autoDeploy ? 'data-pressed=""' : ""} />
<Select value="${region}" label="${regionLabel}" />`
			: activeLayer === "adapter"
				? `// @ui-sdk/react — 同一原语映射为框架部件
import { Toggle } from "@ui-sdk/react/toggle"
import { Select } from "@ui-sdk/react/select"`
				: `/* 你的样式层 — 直接根据 data-* 状态属性着墨 */
[data-slot="toggle"][data-pressed] { background: var(--color-brand); }
[data-slot="select-item"][data-highlighted] { background: var(--color-accent); }`;

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_1.08fr] lg:items-stretch">
			{/* Left: 3 interactive architecture layers */}
			<div className="flex flex-col gap-3">
				{LAYERS.map((layer) => {
					const active = activeLayer === layer.id;
					return (
						<button
							key={layer.id}
							type="button"
							onClick={() => setActiveLayer(layer.id)}
							aria-pressed={active}
							className={cx(
								"group flex flex-col items-start rounded-xl border p-4 text-start transition-[border-color,background-color,box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
								active
									? "border-brand bg-card shadow-md ring-1 ring-brand/25"
									: "border-border bg-card/70 hover:border-border-strong hover:bg-card",
							)}
						>
							<div className="flex w-full items-center justify-between gap-2">
								<span
									className={cx(
										"rounded-md px-2 py-0.5 font-mono text-[0.6875rem] font-medium transition-colors",
										active ? "bg-brand-wash text-brand" : "bg-muted text-muted-foreground",
									)}
								>
									{layer.tag}
								</span>
								<span
									className={cx(
										"h-2 w-2 rounded-full transition-colors",
										active ? "bg-brand" : "bg-border-strong",
									)}
									aria-hidden="true"
								/>
							</div>
							<h3 className="mt-3 text-sm font-semibold text-foreground">{layer.title}</h3>
							<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{layer.desc}</p>
							<p className="mt-3 font-mono text-[0.6875rem] text-muted-foreground/90">{layer.meta}</p>
						</button>
					);
				})}
			</div>

			{/* Right: Live "Headless vs Styled" comparator */}
			<div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/35 px-5 py-3">
					<div className="flex items-center gap-2">
						<span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
						<span className="text-[0.8125rem] font-medium text-foreground">样式剥离对照</span>
					</div>
					<div
						role="group"
						aria-label="切换样式层"
						className="inline-flex rounded-lg border border-border bg-muted p-0.5"
					>
						<button
							type="button"
							onClick={() => setStyled(false)}
							aria-pressed={!styled}
							className={cx(
								"rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
								!styled ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
							)}
						>
							裸行为层
						</button>
						<button
							type="button"
							onClick={() => setStyled(true)}
							aria-pressed={styled}
							className={cx(
								"rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
								styled ? "bg-card text-brand shadow-sm" : "text-muted-foreground hover:text-foreground",
							)}
						>
							+ 你的样式
						</button>
					</div>
				</div>

				<div className="flex flex-1 flex-col justify-between gap-5 p-5">
					<div
						className={cx(
							"rounded-xl border p-4 transition-colors duration-300",
							styled ? "border-border bg-muted/25" : "border-dashed border-border-strong bg-transparent",
						)}
					>
						<div className="mb-3.5 flex items-center justify-between gap-2">
							<span className="font-mono text-[0.6875rem] uppercase tracking-wide text-muted-foreground">
								{styled ? "Styled · Tailwind + data-*" : "Unstyled · 原生 DOM 与 ARIA"}
							</span>
							<span className="font-mono text-[0.6875rem] text-muted-foreground">同一组状态</span>
						</div>

						{styled ? (
							<div className="flex flex-col gap-4">
								<div className="flex items-center justify-between gap-4">
									<div className="flex flex-col">
										<span className="text-sm font-medium text-foreground">自动部署</span>
										<span className="text-xs text-muted-foreground">推送主分支后自动触发</span>
									</div>
									<Toggle
										pressed={autoDeploy}
										onPressedChange={setAutoDeploy}
										className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-strong bg-card px-3 text-xs font-medium text-muted-foreground transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98] hover:text-foreground data-[pressed]:border-brand data-[pressed]:bg-brand data-[pressed]:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
									>
										<span>{autoDeploy ? "已启用" : "已关闭"}</span>
									</Toggle>
								</div>

								<Select value={region} onValueChange={(v) => v && setRegion(v)} items={REGIONS}>
									<SelectLabel className="text-[0.8125rem] font-medium text-foreground">部署区域</SelectLabel>
									<SelectTrigger className={cx(selectTrigger, "mt-1.5")}>
										<SelectValue />
										<ChevronDown />
									</SelectTrigger>
									<SelectContent className={popup}>
										{REGIONS.map((r) => (
											<SelectItem key={r.value} value={r.value} className={item}>
												<span className="flex-1">{r.label}</span>
												{region === r.value && <Check className="h-3.5 w-3.5 text-brand" />}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						) : (
							<div className="flex flex-col gap-3.5 text-sm text-foreground">
								<div className="flex flex-wrap items-center gap-2.5">
									<Toggle
										pressed={autoDeploy}
										onPressedChange={setAutoDeploy}
										className="border border-border-strong bg-muted px-2.5 py-1 text-xs text-foreground"
									>
										自动部署：{autoDeploy ? "已启用" : "已关闭"}
									</Toggle>
									<span className="font-mono text-xs text-muted-foreground">aria-pressed="{String(autoDeploy)}"</span>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<Select value={region} onValueChange={(v) => v && setRegion(v)} items={REGIONS}>
										<SelectLabel className="text-xs text-muted-foreground">部署区域：</SelectLabel>
										<SelectTrigger className="border border-border-strong bg-muted px-2.5 py-1 text-xs text-foreground">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="border border-border-strong bg-card p-1 text-xs text-foreground shadow-md">
											{REGIONS.map((r) => (
												<SelectItem key={r.value} value={r.value} className="px-2 py-1 data-[highlighted]:bg-accent">
													{r.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<span className="font-mono text-xs text-muted-foreground">Top-Layer + 方向键选择</span>
								</div>
							</div>
						)}
					</div>

					{/* Live inspector */}
					<div className="rounded-xl border border-border bg-muted/40 p-4">
						<div className="mb-2 flex items-center justify-between gap-2">
							<span className="font-mono text-[0.6875rem] font-medium text-muted-foreground">实时输出透视</span>
							<span className="font-mono text-[0.6875rem] text-brand">{LAYERS.find((l) => l.id === activeLayer)?.tag}</span>
						</div>
						<pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground">
							<code>{inspectorCode}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
