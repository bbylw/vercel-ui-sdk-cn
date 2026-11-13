import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import {
	Slider,
	SliderControl,
	SliderTrack,
	SliderIndicator,
	SliderThumb,
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
import { describe, expect, test } from "vitest";

const CHANNELS = [
	{ value: "email", label: "邮件" },
	{ value: "push", label: "推送" },
	{ value: "sms", label: "短信" },
];

const settle = () => new Promise((r) => setTimeout(r, 50));

function renderSettings() {
	return render(
		<div>
			<label>
				启用通知
				<Switch defaultChecked>
					<SwitchThumb />
				</Switch>
			</label>
			<ToggleGroup defaultValue={["light"]} aria-label="提示音">
				<Toggle value="none">无</Toggle>
				<Toggle value="light">轻</Toggle>
				<Toggle value="strong">强</Toggle>
			</ToggleGroup>
			<Slider defaultValue={60} min={0} max={100} aria-label="音量">
				<SliderValue />
				<SliderControl>
					<SliderTrack>
						<SliderIndicator />
						<SliderThumb aria-label="音量" />
					</SliderTrack>
				</SliderControl>
			</Slider>
			<Select defaultValue="push" items={CHANNELS}>
				<SelectLabel>通知渠道</SelectLabel>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{CHANNELS.map((c) => (
						<SelectItem key={c.value} value={c.value}>
							{c.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>,
	);
}

const byLabel = (snap: ReturnType<ReturnType<typeof createAgent>["snapshot"]>, label: string) =>
	snap.find((e) => e.label === label);

describe("agent bridge over the notification settings", () => {
	test("snapshot exposes each setting with its component, state and actions", async () => {
		const agent = createAgent();
		renderSettings();
		await settle();
		const snap = agent.snapshot();

		const notify = byLabel(snap, "启用通知");
		expect(notify?.component).toBe("switch");
		expect(notify?.checked).toBe(true);
		expect(notify?.actions).toContain("setChecked");

		const tone = byLabel(snap, "提示音");
		expect(tone?.component).toBe("toggle");
		expect(tone?.value).toEqual(["light"]);
		expect(tone?.actions).toContain("setValue");

		const volume = byLabel(snap, "音量");
		expect(volume?.component).toBe("slider");
		expect(volume?.value).toBe(60);
		expect(volume?.min).toBe(0);
		expect(volume?.max).toBe(100);

		const channel = byLabel(snap, "通知渠道");
		expect(channel?.component).toBe("select");
		expect(channel?.value).toBe("push");
		expect(channel?.actions).toContain("setValue");
	});

	test("act drives all four settings through the component API as source agent", async () => {
		const agent = createAgent();
		const changes: { component: string; key: string; value: unknown; source: string }[] = [];
		agent.subscribe((c) => changes.push(c));
		renderSettings();
		await settle();

		const result = await agent.act({
			steps: [
				{ ref: "启用通知", action: "setChecked", args: [true] },
				{ ref: "提示音", action: "setValue", args: [["strong"]] },
				{ ref: "音量", action: "setValue", args: [80] },
				{ ref: "通知渠道", action: "setValue", args: ["email"] },
			],
		});

		expect(result.ok).toBe(true);
		expect(result.error).toBeUndefined();
		expect(result.steps).toHaveLength(4);

		const snap = agent.snapshot();
		expect(byLabel(snap, "启用通知")?.checked).toBe(true);
		expect(byLabel(snap, "提示音")?.value).toEqual(["strong"]);
		expect(byLabel(snap, "音量")?.value).toBe(80);
		expect(byLabel(snap, "通知渠道")?.value).toBe("email");

		expect(changes.some((c) => c.source === "agent")).toBe(true);
		expect(changes.some((c) => c.component === "slider" && c.value === 80)).toBe(true);
		expect(changes.some((c) => c.component === "select" && c.value === "email")).toBe(true);
	});

	test("query finds a control by name and a select's items without opening it", async () => {
		const agent = createAgent();
		renderSettings();
		await settle();

		const found = await agent.query({ text: "通知渠道", kind: "select" });
		expect(Array.isArray(found)).toBe(true);
		const select = (found as { label?: string; items?: { value: string }[] }[]).find(
			(e) => e.label === "通知渠道",
		);
		expect(select).toBeDefined();

		const within = await agent.query({ within: "通知渠道" });
		const items = (within as { items?: { value: string }[] }[]).flatMap((e) => e.items ?? []);
		expect(items.map((i) => i.value)).toEqual(expect.arrayContaining(["email", "push", "sms"]));
	});

	test("allow refuses a step before it runs and leaves the value untouched", async () => {
		const agent = createAgent({ allow: (step) => step.action !== "setValue" });
		renderSettings();
		await settle();

		const result = await agent.act({
			steps: [{ ref: "音量", action: "setValue", args: [80] }],
		});

		expect(result.ok).toBe(false);
		expect(result.error).toBeDefined();
		expect(byLabel(agent.snapshot(), "音量")?.value).toBe(60);
	});
});