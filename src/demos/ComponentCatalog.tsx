import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxLabel,
	ComboboxList,
	ComboboxTrigger,
} from "@ui-sdk/react/combobox";
import { Check, ChevronDown, SearchIcon, cx, item, popup } from "./ui";

type Component = { value: string; label: string; en: string };
type Category = { id: string; label: string; accent: string; items: Component[] };

const c = (value: string, label: string): Component => ({ value, label, en: value });

export const CATEGORIES: Category[] = [
	{
		id: "basics",
		label: "基础",
		accent: "var(--color-brand)",
		items: [c("button", "按钮"), c("separator", "分隔线")],
	},
	{
		id: "forms",
		label: "表单与输入",
		accent: "var(--color-agent)",
		items: [
			c("autocomplete", "自动完成"),
			c("checkbox", "复选框"),
			c("color-picker", "颜色选择器"),
			c("combobox", "组合框"),
			c("date-input", "日期输入"),
			c("date-picker", "日期选择器"),
			c("field", "字段"),
			c("file-input", "文件输入"),
			c("image-cropper", "图片裁剪"),
			c("input", "输入框"),
			c("label", "标签"),
			c("listbox", "列表框"),
			c("number-input", "数字输入"),
			c("otp-input", "验证码输入"),
			c("password-input", "密码输入"),
			c("radio", "单选框"),
			c("rating", "评分"),
			c("select", "选择器"),
			c("slider", "滑块"),
			c("switch", "开关"),
			c("textarea", "多行文本"),
			c("time-input", "时间输入"),
			c("token-input", "令牌输入"),
			c("toggle", "切换按钮"),
		],
	},
	{
		id: "overlays",
		label: "弹出层",
		accent: "var(--color-success)",
		items: [
			c("alert-dialog", "警告对话框"),
			c("command", "命令面板"),
			c("dialog", "对话框"),
			c("drawer", "抽屉"),
			c("hover-card", "悬停卡片"),
			c("menu", "菜单"),
			c("menubar", "菜单栏"),
			c("popover", "弹出框"),
			c("toast", "轻提示"),
			c("tooltip", "文字提示"),
			c("trigger-menu", "触发菜单"),
		],
	},
	{
		id: "navigation",
		label: "导航与结构",
		accent: "var(--color-warning)",
		items: [
			c("accordion", "折叠面板"),
			c("carousel", "轮播"),
			c("collapsible", "可折叠区域"),
			c("navigation-menu", "导航菜单"),
			c("pagination", "分页"),
			c("resizable", "可调整大小"),
			c("scroll-area", "滚动区域"),
			c("segmented-control", "分段控件"),
			c("tabs", "标签页"),
			c("toolbar", "工具栏"),
			c("tree", "树形视图"),
		],
	},
	{
		id: "data",
		label: "数据展示",
		accent: "var(--color-danger)",
		items: [
			c("avatar", "头像"),
			c("calendar", "日历"),
			c("meter", "计量条"),
			c("preferences", "偏好设置"),
			c("progress", "进度条"),
			c("timeline", "时间线"),
			c("waterfall", "瀑布流"),
		],
	},
];

const ALL = CATEGORIES.flatMap((cat) => cat.items);

// The grid links are the navigation targets: picking a result clicks the
// matching card so Astro's client router intercepts it like any other link.
function jump(slug: string) {
	document.querySelector<HTMLAnchorElement>(`[data-component="${slug}"]`)?.click();
}

export function ComponentCatalog() {
	return (
		<div className="flex flex-col gap-8">
			<div className="mx-auto w-full max-w-xl">
				<Combobox autoHighlight onValueChange={(value) => value && jump(String(value))}>
					<ComboboxLabel className="sr-only">搜索组件</ComboboxLabel>
					<div className="relative flex items-center">
						<span className="pointer-events-none absolute start-3.5 text-muted-foreground">
							<SearchIcon className="h-4 w-4" />
						</span>
						<ComboboxInput
							placeholder="搜索 55 个组件…  试试「选择器」或 select"
							className="h-12 w-full rounded-xl border border-border-strong bg-card ps-10 pe-11 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground hover:border-brand focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring"
						/>
						<ComboboxTrigger
							aria-label="展开组件列表"
							className="absolute end-2 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						>
							<ChevronDown />
						</ComboboxTrigger>
					</div>
					<ComboboxContent className={cx(popup, "max-h-80 w-(--anchor-width) overflow-y-auto")}>
						<ComboboxEmpty className="px-2.5 py-6 text-center text-sm text-muted-foreground">
							没有匹配的组件。
						</ComboboxEmpty>
						<ComboboxList>
							{CATEGORIES.map((cat) => (
								<ComboboxGroup key={cat.id}>
									<ComboboxGroupLabel className="flex items-center gap-2 px-2.5 py-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">
										<span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.accent }} />
										{cat.label}
									</ComboboxGroupLabel>
									{cat.items.map((comp) => (
										<ComboboxItem key={comp.value} value={comp.value} label={`${comp.label} ${comp.en}`} keywords={[comp.en, comp.value]} className={item}>
											<span className="flex-1 text-foreground">{comp.label}</span>
											<span className="font-mono text-xs text-muted-foreground">{comp.en}</span>
											<ComboboxItemIndicator className="text-brand">
												<Check className="h-3.5 w-3.5" />
											</ComboboxItemIndicator>
										</ComboboxItem>
									))}
								</ComboboxGroup>
							))}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</div>

			<div className="flex flex-col gap-7">
				{CATEGORIES.map((cat) => (
					<section key={cat.id} aria-label={cat.label}>
						<div className="mb-3 flex items-baseline gap-2.5">
							<span className="h-2 w-2 shrink-0 translate-y-[-1px] rounded-full" style={{ background: cat.accent }} />
							<h3 className="text-sm font-semibold text-foreground">
								{cat.label}
							</h3>
							<span className="font-mono text-xs text-muted-foreground">{cat.items.length}</span>
						</div>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
							{cat.items.map((comp) => (
								<a
									key={comp.value}
									href={`/docs/components/${comp.value}`}
									data-component={comp.value}
									className="group flex flex-col gap-0.5 rounded-lg border border-border bg-card px-3 py-2.5 no-underline transition-colors hover:border-border-strong hover:bg-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
								>
									<span className="text-[0.8125rem] font-medium text-foreground transition-colors group-hover:text-brand">
										{comp.label}
									</span>
									<span className="truncate font-mono text-[0.6875rem] text-muted-foreground">{comp.en}</span>
								</a>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

export const COMPONENT_COUNT = ALL.length;