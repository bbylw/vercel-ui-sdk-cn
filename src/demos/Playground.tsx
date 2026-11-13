import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import {
	Slider,
	SliderControl,
	SliderIndicator,
	SliderThumb,
	SliderTrack,
	SliderValue,
} from "@ui-sdk/react/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@ui-sdk/react/select";
import { toast } from "@ui-sdk/react/toast";
import { agent } from "./agent";
import { Check, ChevronDown, DemoButton, cx, item, popup, selectTrigger } from "./ui";

type Entry = ReturnType<typeof agent.snapshot>[number];

const CHANNELS = [
	{ value: "email", label: "邮件" },
	{ value: "push", label: "推送" },
	{ value: "sms", label: "短信" },
];

const SETTINGS = ["启用通知", "提示音", "音量", "通知渠道"];

const AGENT_STEPS: Array<{ ref: string; action: string; args: unknown[]; say: string }> = [
	{ ref: "启用通知", action: "setChecked", args: [true], say: "打开「启用通知」" },
	{ ref: "提示音", action: "setValue", args: [["strong"]], say: "把提示音设为「强」" },
	{ ref: "音量", action: "setValue", args: [80], say: "把音量调到 80" },
	{ ref: "通知渠道", action: "setValue", args: ["email"], say: "把渠道切到「邮件」" },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DEFAULT_STATUS = "试着调节左侧控件，或交由右侧智能体执行。";

function valueOf(entry: Entry): string {
	if ("checked" in entry && typeof entry.checked === "boolean") return entry.checked ? "开" : "关";
	if ("value" in entry) {
		const v = entry.value;
		if (entry.component === "select") return CHANNELS.find((c) => c.value === v)?.label ?? String(v);
		if (entry.component === "toggle") return { none: "无", light: "轻", strong: "强" }[String(v)] ?? String(v);
		return String(v);
	}
	return "—";
}

function PlayIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M4.5 3.3a.7.7 0 0 1 1.05-.6l7.2 4.4a.7.7 0 0 1 0 1.2l-7.2 4.4a.7.7 0 0 1-1.05-.6V3.3Z" />
		</svg>
	);
}

export function Playground() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [running, setRunning] = useState(false);
	const [activeStep, setActiveStep] = useState<string | null>(null);
	const [stepNum, setStepNum] = useState<number>(0);
	const [lastSource, setLastSource] = useState<"human" | "agent" | null>(null);
	const [status, setStatus] = useState(DEFAULT_STATUS);
	const [showJson, setShowJson] = useState(false);
	const [resetKey, setResetKey] = useState(0);
	const raf = useRef(0);
	const runningRef = useRef(false);
	const notifyLabelId = useId();
	const notifyDescId = useId();

	const refresh = useCallback(() => {
		cancelAnimationFrame(raf.current);
		raf.current = requestAnimationFrame(() => {
			setEntries(agent.snapshot().filter((e) => SETTINGS.includes(e.label ?? "")));
		});
	}, []);

	const onHumanChange = useCallback(() => {
		if (!runningRef.current) {
			setLastSource("human");
			setStatus("已通过界面交互更新状态（source: human）。");
		}
		refresh();
	}, [refresh]);

	useEffect(() => {
		refresh();
		return () => cancelAnimationFrame(raf.current);
	}, [refresh, resetKey]);

	async function runAgent() {
		if (runningRef.current) return;
		runningRef.current = true;
		setRunning(true);
		setLastSource("agent");
		try {
			for (let i = 0; i < AGENT_STEPS.length; i++) {
				const step = AGENT_STEPS[i];
				setStepNum(i + 1);
				setActiveStep(step.ref);
				setStatus(`[${i + 1}/${AGENT_STEPS.length}] 正在${step.say}…`);
				const result = await agent.act({ steps: [{ ref: step.ref, action: step.action, args: step.args }] });
				if (!result.ok) {
					setStatus(`操作失败：${result.error?.message ?? "未知错误"}`);
					return;
				}
				refresh();
				await wait(520);
			}
			setStatus("完成：4 步操作经由组件 API 执行。");
			toast.success("智能体已完成设置", { description: "4 步 · 1 次 act 调用 · 来源 source: agent" });
		} finally {
			setActiveStep(null);
			setStepNum(0);
			runningRef.current = false;
			setRunning(false);
			refresh();
		}
	}

	function reset() {
		setResetKey((k) => k + 1);
		setLastSource(null);
		setStatus("已重置为初始默认状态。");
	}

	const settings = SETTINGS.map((label) => entries.find((e) => e.label === label)).filter(Boolean) as Entry[];

	const rowClass = (label: string) =>
		cx(
			"-mx-2 rounded-lg px-2 py-1.5 transition-[background-color,box-shadow] duration-300",
			activeStep === label && "bg-agent-muted/45 ring-1 ring-agent/35",
		);

	return (
		<div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
			<div className="flex items-center justify-between gap-3 border-b border-border bg-muted/35 px-5 py-3">
				<div className="flex items-center gap-2 min-w-0">
					<span className="relative flex h-2 w-2 shrink-0">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
					</span>
					<span className="truncate text-[0.8125rem] font-medium text-foreground">实时演示 · 通知设置</span>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					{lastSource && (
						<span
							className={cx(
								"rounded-md px-2 py-0.5 font-mono text-[0.625rem] font-medium transition-colors",
								lastSource === "agent"
									? "bg-agent-muted text-agent-foreground"
									: "bg-brand-wash text-brand",
							)}
						>
							source: {lastSource}
						</span>
					)}
					<span className="hidden font-mono text-[0.6875rem] uppercase tracking-wide text-muted-foreground sm:inline">
						ui-sdk · react
					</span>
				</div>
			</div>

			<div className="grid gap-0 md:grid-cols-2">
				{/* The live interface */}
				<div key={resetKey} className="flex flex-col gap-3.5 p-5">
					<div className={cx("flex items-center justify-between gap-4", rowClass("启用通知"))}>
						<span className="flex flex-col">
							<span id={notifyLabelId} className="text-sm font-medium text-foreground">启用通知</span>
							<span id={notifyDescId} className="text-xs text-muted-foreground">立即生效的设置</span>
						</span>
						<Switch
							aria-labelledby={notifyLabelId}
							aria-describedby={notifyDescId}
							defaultChecked
							onCheckedChange={onHumanChange}
						>
							<SwitchThumb />
						</Switch>
					</div>

					<div className={cx("flex flex-col gap-2", rowClass("提示音"))}>
						<span className="text-[0.8125rem] font-medium text-foreground">提示音</span>
						<ToggleGroup
							defaultValue={["light"]}
							aria-label="提示音"
							onValueChange={onHumanChange}
							className="inline-flex gap-1 rounded-lg border border-border bg-muted p-1"
						>
							{[
								{ value: "none", label: "无" },
								{ value: "light", label: "轻" },
								{ value: "strong", label: "强" },
							].map((t) => (
								<Toggle
									key={t.value}
									value={t.value}
									className="flex-1 rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground data-[pressed]:bg-card data-[pressed]:text-brand data-[pressed]:shadow-sm"
								>
									{t.label}
								</Toggle>
							))}
						</ToggleGroup>
					</div>

					<div className={rowClass("音量")}>
						<Slider defaultValue={60} min={0} max={100} aria-label="音量" onValueChange={onHumanChange}>
							<div className="flex items-center justify-between">
								<span className="text-[0.8125rem] font-medium text-foreground">音量</span>
								<SliderValue />
							</div>
							<SliderControl>
								<SliderTrack>
									<SliderIndicator />
									<SliderThumb aria-label="音量" />
								</SliderTrack>
							</SliderControl>
						</Slider>
					</div>

					<div className={rowClass("通知渠道")}>
						<Select defaultValue="push" items={CHANNELS} onValueChange={onHumanChange}>
							<SelectLabel className="text-[0.8125rem] font-medium text-foreground">通知渠道</SelectLabel>
							<SelectTrigger className={cx(selectTrigger, "mt-1.5")}>
								<SelectValue />
								<ChevronDown />
							</SelectTrigger>
							<SelectContent className={popup}>
								{CHANNELS.map((c) => (
									<SelectItem key={c.value} value={c.value} className={item}>
										<span className="flex-1">{c.label}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* The agent's view of the same interface */}
				<div className="flex flex-col border-t border-border bg-muted/40 md:border-s md:border-t-0">
					<div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
						<span className="flex items-center gap-2 text-[0.8125rem] font-medium text-foreground">
							<span className="h-1.5 w-1.5 rounded-full bg-agent" />
							智能体快照
						</span>
						<button
							type="button"
							onClick={() => setShowJson((v) => !v)}
							className="rounded px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						>
							{showJson ? "表格" : "JSON"}
						</button>
					</div>

					<div className="min-h-44 flex-1 px-5 py-4">
						{showJson ? (
							<pre className="max-h-56 overflow-auto font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
								{JSON.stringify(settings, null, 2)}
							</pre>
						) : (
							<ul className="flex flex-col gap-2">
								{settings.map((e) => (
									<li
										key={e.ref}
										className={cx(
											"-mx-2 flex items-center gap-2 rounded-md px-2 py-1 text-[0.8125rem] transition-colors duration-300",
											activeStep === e.label && "bg-agent-muted/45",
										)}
									>
										<span className="w-16 shrink-0 truncate text-muted-foreground">{e.label}</span>
										<span className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
											{e.component}
										</span>
										<span className="ms-auto font-mono text-foreground">{valueOf(e)}</span>
									</li>
								))}
								{settings.length === 0 && (
									<li className="text-[0.8125rem] text-muted-foreground">正在读取组件状态…</li>
								)}
							</ul>
						)}
					</div>

					<div className="border-t border-border px-5 py-4">
						<div className="flex items-center gap-2">
							<DemoButton variant="agent" onClick={runAgent} disabled={running} className="h-9 flex-1 px-3 text-[0.8125rem]">
								<PlayIcon className="h-3.5 w-3.5" />
								{running ? `执行步骤 ${stepNum}/4…` : "模拟智能体操作"}
							</DemoButton>
							<DemoButton variant="small" onClick={reset} disabled={running} aria-label="重置演示">
								重置
							</DemoButton>
						</div>
						<p className="mt-2.5 flex items-start gap-1.5 text-pretty text-xs leading-relaxed text-muted-foreground" role="status" aria-live="polite">
							{status.startsWith("完成") && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />}
							<span>{status}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
