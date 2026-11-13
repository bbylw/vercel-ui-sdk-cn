import { useState } from "react";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Toggle } from "@ui-sdk/react/toggle";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
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
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxList,
} from "@ui-sdk/react/combobox";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu";
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/react/tooltip";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverTitle,
	PopoverTrigger,
} from "@ui-sdk/react/popover";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@ui-sdk/react/dialog";
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog";
import { toast } from "@ui-sdk/react/toast";
import { Check, ChevronDown, DemoButton, Field, cx, input, item, popup } from "./ui";

function Frame({ children }: { children: React.ReactNode }) {
	return <div className="rounded-xl border border-border bg-card p-5">{children}</div>;
}

const CHANNELS = [
	{ value: "email", label: "邮件" },
	{ value: "push", label: "推送" },
	{ value: "sms", label: "短信" },
];

export function SelectDemo() {
	const [channel, setChannel] = useState("push");
	return (
		<Frame>
			<Select value={channel} onValueChange={(v) => setChannel(String(v))} items={CHANNELS}>
				<SelectLabel className="text-[0.8125rem] font-medium text-foreground">通知渠道</SelectLabel>
				<SelectTrigger className={cx(input, "mt-1.5 flex items-center justify-between")}>
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
			<p className="mt-3 text-xs text-muted-foreground">当前值：{channel}</p>
		</Frame>
	);
}

export function TabsDemo() {
	return (
		<Frame>
			<Tabs defaultValue="overview">
				<TabsList aria-label="项目" className="inline-flex gap-1 rounded-lg border border-border bg-muted p-1">
					{[
						{ value: "overview", label: "概览" },
						{ value: "members", label: "成员" },
						{ value: "settings", label: "设置" },
					].map((t) => (
						<TabsTab
							key={t.value}
							value={t.value}
							className="rounded-md px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground data-[selected]:bg-card data-[selected]:text-brand data-[selected]:shadow-sm"
						>
							{t.label}
						</TabsTab>
					))}
				</TabsList>
				<TabsPanel value="overview" className="mt-3 text-sm text-muted-foreground">
					项目概览：部署状态与最近活动。
				</TabsPanel>
				<TabsPanel value="members" className="mt-3 text-sm text-muted-foreground">
					成员：管理谁可以访问这个项目。
				</TabsPanel>
				<TabsPanel value="settings" className="mt-3 text-sm text-muted-foreground">
					设置：名称、域名与构建选项。
				</TabsPanel>
			</Tabs>
		</Frame>
	);
}

const FRAMEWORKS = ["React", "Vue", "Svelte", "Solid", "Web Components"];

export function ComboboxDemo() {
	const [framework, setFramework] = useState("");
	return (
		<Frame>
			<Combobox onValueChange={(v) => setFramework(String(v ?? ""))}>
				<ComboboxInput
					aria-label="框架"
					placeholder="输入以筛选框架…"
					className={cx(input, "h-10")}
				/>
				<ComboboxContent className={cx(popup, "max-h-60 w-(--anchor-width) overflow-y-auto")}>
					<ComboboxEmpty className="px-2.5 py-4 text-center text-sm text-muted-foreground">
						没有匹配的框架。
					</ComboboxEmpty>
					<ComboboxList>
						{FRAMEWORKS.map((f) => (
							<ComboboxItem key={f} value={f} label={f} className={item}>
								<span className="flex-1">{f}</span>
								<ComboboxItemIndicator className="text-brand">
									<Check className="h-3.5 w-3.5" />
								</ComboboxItemIndicator>
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			<p className="mt-3 text-xs text-muted-foreground">已选：{framework || "（无）"}</p>
		</Frame>
	);
}

export function SwitchDemo() {
	const [on, setOn] = useState(true);
	return (
		<Frame>
			<div className="flex items-center justify-between gap-4">
				<span className="text-sm font-medium text-foreground">启用通知</span>
				<Switch checked={on} onCheckedChange={setOn} aria-label="启用通知">
					<SwitchThumb />
				</Switch>
			</div>
			<p className="mt-3 text-xs text-muted-foreground">状态：{on ? "开" : "关"}</p>
		</Frame>
	);
}

export function SliderDemo() {
	const [volume, setVolume] = useState(60);
	return (
		<Frame>
			<Slider value={volume} min={0} max={100} onValueChange={(v) => setVolume(Number(v))} aria-label="音量">
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
		</Frame>
	);
}

export function ToggleDemo() {
	const [pressed, setPressed] = useState(false);
	return (
		<Frame>
			<Toggle
				pressed={pressed}
				onPressedChange={setPressed}
				className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand data-[pressed]:border-brand data-[pressed]:bg-brand-wash data-[pressed]:text-brand"
			>
				收藏
			</Toggle>
			<p className="mt-3 text-xs text-muted-foreground">状态：{pressed ? "已收藏" : "未收藏"}</p>
		</Frame>
	);
}

export function ToastDemo() {
	return (
		<Frame>
			<div className="flex flex-wrap gap-2">
				<DemoButton variant="small" onClick={() => toast.success("更改已保存", { description: "所有更改已同步。" })}>
					成功
				</DemoButton>
				<DemoButton variant="small" onClick={() => toast.info("有新版本可用", { description: "v0.2 已发布。" })}>
					信息
				</DemoButton>
				<DemoButton variant="small" onClick={() => toast.warning("存储空间将满", { description: "已使用 92%。" })}>
					警告
				</DemoButton>
				<DemoButton
					variant="small"
					onClick={() =>
						toast.error("保存失败", {
							description: "请检查网络后重试。",
							action: { label: "重试", onAction: () => toast.success("已重新保存") },
						})
					}
				>
					错误
				</DemoButton>
			</div>
		</Frame>
	);
}

export function DialogDemo() {
	const [name, setName] = useState("");
	return (
		<Frame>
			<Dialog>
				<DialogTrigger className={cx(input, "flex h-10 items-center justify-center font-medium")}>
					新建项目
				</DialogTrigger>
				<DialogContent>
					<DialogTitle className="text-base font-semibold text-foreground">新建项目</DialogTitle>
					<DialogDescription className="mt-1 text-sm text-muted-foreground">
						给项目起个名字，稍后可以修改。
					</DialogDescription>
					<form
						method="dialog"
						className="mt-4 flex flex-col gap-4"
						onSubmit={() => toast.success("项目已创建", { description: name.trim() || "未命名项目" })}
					>
						<Field label="项目名称" htmlFor="doc-project-name">
							<input
								id="doc-project-name"
								className={input}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="例如：设计系统"
							/>
						</Field>
						<div className="flex justify-end gap-2">
							<DialogClose className={cx(input, "h-9 w-auto px-3 text-[0.8125rem]")}>取消</DialogClose>
							<button
								type="submit"
								className="h-9 rounded-lg bg-brand px-3 text-[0.8125rem] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
							>
								创建
							</button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</Frame>
	);
}

export function AlertDialogDemo() {
	return (
		<Frame>
			<AlertDialog
				onOpenChange={(open, details) => {
					if (!open && details.returnValue === "confirm")
						toast.success("项目已删除", { description: "演示操作，未真正删除。" });
				}}
			>
				<AlertDialogTrigger className={cx(input, "flex h-10 items-center justify-center font-medium text-danger-foreground hover:border-danger")}>
					删除项目
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogTitle className="text-base font-semibold text-foreground">删除这个项目？</AlertDialogTitle>
					<AlertDialogDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">
						项目及其全部部署将被永久移除，此操作无法撤销。
					</AlertDialogDescription>
					<div className="mt-5 flex justify-end gap-2">
						<AlertDialogClose className={cx(input, "h-9 w-auto px-3 text-[0.8125rem]")}>取消</AlertDialogClose>
						<AlertDialogClose
							value="confirm"
							className="h-9 rounded-lg bg-danger px-3 text-[0.8125rem] font-medium text-white transition-colors hover:brightness-110"
						>
							删除
						</AlertDialogClose>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</Frame>
	);
}

export function MenuDemo() {
	return (
		<Frame>
			<Menu
				onAction={(value) => {
					const labels: Record<string, string> = { rename: "重命名", duplicate: "创建副本", archive: "归档", delete: "删除" };
					const label = labels[String(value)] ?? String(value);
					if (value === "delete") toast.error(`已${label}`, { description: "演示操作，未真正删除。" });
					else toast.success(`已${label}`, { description: "演示操作。" });
				}}
			>
				<MenuTrigger className={cx(input, "flex h-10 items-center justify-between font-medium")}>
					操作
					<ChevronDown />
				</MenuTrigger>
				<MenuContent className={popup}>
					<MenuItem value="rename" className={item}>重命名</MenuItem>
					<MenuItem value="duplicate" className={item}>创建副本</MenuItem>
					<MenuItem value="archive" className={item}>归档</MenuItem>
					<MenuSeparator className="my-1 h-px bg-border" />
					<MenuItem value="delete" className={cx(item, "text-danger-foreground data-[highlighted]:bg-danger-muted")}>
						删除
					</MenuItem>
				</MenuContent>
			</Menu>
		</Frame>
	);
}

export function PopoverDemo() {
	return (
		<Frame>
			<Popover>
				<PopoverTrigger className={cx(input, "flex h-10 items-center justify-center font-medium")}>分享</PopoverTrigger>
				<PopoverContent className={cx(popup, "w-80 p-4")}>
					<PopoverTitle className="text-sm font-semibold text-foreground">分享文档</PopoverTitle>
					<PopoverDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
						任何拥有链接的人都可以查看。
					</PopoverDescription>
					<div className="mt-3 flex gap-2">
						<input readOnly value="https://ui-sdk.dev/docs" aria-label="分享链接" className={cx(input, "h-9 font-mono text-xs")} />
						<DemoButton
							variant="small"
							className="shrink-0"
							onClick={() => toast.success("链接已复制", { description: "https://ui-sdk.dev/docs" })}
						>
							复制
						</DemoButton>
					</div>
					<div className="mt-3 flex justify-end">
						<PopoverClose className={cx(input, "h-8 w-auto px-3 text-[0.8125rem]")}>完成</PopoverClose>
					</div>
				</PopoverContent>
			</Popover>
		</Frame>
	);
}

export function TooltipDemo() {
	return (
		<Frame>
			<div className="flex items-center gap-1">
				<Tooltip shortcut="mod+b">
					<TooltipTrigger
						aria-label="加粗"
						className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm font-bold text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
					>
						B
					</TooltipTrigger>
					<TooltipContent className="demo-popup flex items-center gap-2">
						加粗
						<TooltipShortcut className="font-mono text-[0.625rem] opacity-70" />
					</TooltipContent>
				</Tooltip>
				<Tooltip shortcut="mod+i">
					<TooltipTrigger
						aria-label="斜体"
						className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent font-serif text-sm italic text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-foreground"
					>
						I
					</TooltipTrigger>
					<TooltipContent className="demo-popup flex items-center gap-2">
						斜体
						<TooltipShortcut className="font-mono text-[0.625rem] opacity-70" />
					</TooltipContent>
				</Tooltip>
				<span className="ms-2 text-xs text-muted-foreground">悬停或聚焦查看提示与快捷键</span>
			</div>
		</Frame>
	);
}