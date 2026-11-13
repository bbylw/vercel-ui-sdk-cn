import { useState } from "react";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu";
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { Toggle } from "@ui-sdk/react/toggle";
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
import { ChevronDown, DemoButton, Field, btn, cx, input, item, popup } from "./ui";

function DemoCard({
	name,
	label,
	note,
	className,
	children,
}: {
	name: string;
	label: string;
	note?: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cx(
				"flex flex-col rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-border-strong",
				className,
			)}
		>
			<div className="mb-3 flex items-baseline justify-between gap-2">
				<span className="text-[0.8125rem] font-medium text-foreground">{label}</span>
				<span className="font-mono text-[0.6875rem] text-muted-foreground">{name}</span>
			</div>
			{note && <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{note}</p>}
			<div className="mt-auto flex flex-col items-start justify-center">{children}</div>
		</div>
	);
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TOOLS = [
	{
		id: "bold",
		label: "加粗",
		shortcut: "mod+b",
		icon: <span className="text-sm font-bold">B</span>,
	},
	{
		id: "italic",
		label: "斜体",
		shortcut: "mod+i",
		icon: <span className="font-serif text-sm italic">I</span>,
	},
	{
		id: "link",
		label: "插入链接",
		shortcut: "mod+k",
		icon: (
			<svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" {...stroke}>
				<path d="M6.5 9.5 9.5 6.5M7 4.5l1.5-1.5a2.5 2.5 0 0 1 3.5 3.5L10.5 8M9 11.5 7.5 13a2.5 2.5 0 0 1-3.5-3.5L5.5 8" />
			</svg>
		),
	},
	{
		id: "code",
		label: "代码",
		shortcut: "mod+e",
		icon: (
			<svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" {...stroke}>
				<path d="m5.5 5-3 3 3 3M10.5 5l3 3-3 3" />
			</svg>
		),
	},
	{
		id: "star",
		label: "收藏",
		shortcut: "mod+d",
		icon: (
			<svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true" {...stroke}>
				<path d="m8 2.5 1.7 3.5 3.8.5-2.8 2.7.7 3.8L8 11.2 4.6 13l.7-3.8L2.5 6.5l3.8-.5z" />
			</svg>
		),
	},
] as const;

const MENU_LABELS: Record<string, string> = {
	rename: "重命名",
	duplicate: "创建副本",
	archive: "归档",
	delete: "删除",
};

export function BehaviorDemos() {
	const [name, setName] = useState("");
	const [copied, setCopied] = useState(false);
	const [activeTools, setActiveTools] = useState<string[]>(["bold"]);

	function toggleTool(id: string, pressed: boolean) {
		setActiveTools((prev) => (pressed ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((t) => t !== id)));
	}

	async function copyLink() {
		try {
			await navigator.clipboard?.writeText("https://ui-sdk.dev/docs");
		} catch {
			/* Clipboard may be unavailable; the toast still confirms the demo. */
		}
		setCopied(true);
		toast.success("链接已复制", { description: "https://ui-sdk.dev/docs" });
		setTimeout(() => setCopied(false), 1600);
	}

	return (
		<div className="grid gap-3 lg:grid-cols-6">
			<DemoCard name="Menu" label="菜单" note="支持方向键导航、键入检索与 Esc 关闭。" className="lg:col-span-2">
				<Menu
					onAction={(value) => {
						const label = MENU_LABELS[String(value)] ?? String(value);
						if (value === "delete") toast.error(`已${label}`, { description: "演示操作，未真正删除。" });
						else toast.success(`已${label}`, { description: "演示操作。" });
					}}
				>
					<MenuTrigger className={btn.outline}>
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
			</DemoCard>

			<DemoCard name="Popover" label="弹出框" note="基于锚点定位，点击外部或按 Esc 轻关闭。" className="lg:col-span-2">
				<Popover>
					<PopoverTrigger className={btn.outline}>分享</PopoverTrigger>
					<PopoverContent className={cx(popup, "w-80 p-4")}>
						<PopoverTitle className="text-sm font-semibold text-foreground">分享文档</PopoverTitle>
						<PopoverDescription className="mt-1 text-xs leading-relaxed text-muted-foreground">
							任何拥有链接的人都可以查看。
						</PopoverDescription>
						<div className="mt-3 flex gap-2">
							<input readOnly value="https://ui-sdk.dev/docs" aria-label="分享链接" className={cx(input, "h-9 font-mono text-xs")} />
							<DemoButton variant="small" onClick={copyLink} className="shrink-0">
								{copied ? "已复制" : "复制"}
							</DemoButton>
						</div>
						<div className="mt-3 flex justify-end">
							<PopoverClose className={btn.small}>完成</PopoverClose>
						</div>
					</PopoverContent>
				</Popover>
			</DemoCard>

			<DemoCard name="Toast" label="轻提示" note="堆叠队列管理，支持悬停展开、滑动清除与撤销。" className="lg:col-span-2">
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
			</DemoCard>

			<DemoCard name="Dialog" label="对话框" note="进入浏览器顶层渲染，打开锁定焦点、关闭自动还原。" className="lg:col-span-3">
				<Dialog>
					<DialogTrigger className={btn.outline}>新建项目</DialogTrigger>
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
							<Field label="项目名称" htmlFor="demo-project-name">
								<input
									id="demo-project-name"
									className={input}
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="例如：设计系统"
								/>
							</Field>
							<div className="flex justify-end gap-2">
								<DialogClose className={btn.small}>取消</DialogClose>
								<button type="submit" className={cx(btn.small, "border-brand bg-brand text-primary-foreground hover:bg-primary-hover")}>
									创建
								</button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</DemoCard>

			<DemoCard name="AlertDialog" label="警告对话框" note="高风险操作显式确认，禁用外部点击误关闭。" className="lg:col-span-3">
				<AlertDialog
					onOpenChange={(open, details) => {
						if (!open && details.returnValue === "confirm")
							toast.success("项目已删除", { description: "演示操作，未真正删除。" });
					}}
				>
					<AlertDialogTrigger className={cx(btn.outline, "hover:border-danger hover:text-danger-foreground")}>
						删除项目
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogTitle className="text-base font-semibold text-foreground">删除这个项目？</AlertDialogTitle>
						<AlertDialogDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">
							项目及其全部部署将被永久移除，此操作无法撤销。
						</AlertDialogDescription>
						<div className="mt-5 flex justify-end gap-2">
							<AlertDialogClose className={btn.small}>取消</AlertDialogClose>
							<AlertDialogClose value="confirm" className={cx(btn.small, "border-danger bg-danger text-white hover:brightness-110")}>
								删除
							</AlertDialogClose>
						</div>
					</AlertDialogContent>
				</AlertDialog>
			</DemoCard>

			<DemoCard name="Tooltip + Toggle" label="文字提示 · 交互工具栏" className="lg:col-span-6">
				<div className="flex w-full flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
						{TOOLS.map((t) => {
							const isPressed = activeTools.includes(t.id);
							return (
								<Tooltip key={t.label} shortcut={t.shortcut}>
									<TooltipTrigger
										render={(triggerProps) => (
											<Toggle
												{...triggerProps}
												pressed={isPressed}
												onPressedChange={(p) => toggleTool(t.id, p)}
												aria-label={t.label}
												className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.95] hover:bg-accent hover:text-foreground data-[pressed]:border-brand/40 data-[pressed]:bg-brand-wash data-[pressed]:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
											>
												{t.icon}
											</Toggle>
										)}
									/>
									<TooltipContent className="demo-popup flex items-center gap-2">
										{t.label}
										<TooltipShortcut className="font-mono text-[0.625rem] opacity-70" />
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
					<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span>悬停查看快捷键，点击切换激活状态：</span>
						<span className="font-mono text-foreground">
							{activeTools.length > 0
								? activeTools.map((id) => TOOLS.find((t) => t.id === id)?.label).join(" · ")
								: "未激活"}
						</span>
					</div>
				</div>
			</DemoCard>
		</div>
	);
}
