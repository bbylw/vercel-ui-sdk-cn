import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { Toggle, ToggleGroup } from "@ui-sdk/react/toggle";
import { Slider, SliderControl, SliderTrack, SliderIndicator, SliderThumb, SliderValue } from "@ui-sdk/react/slider";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui-sdk/react/select";
import { expect, test } from "vitest";

test("probe snapshot", async () => {
	const agent = createAgent();
	render(
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
			<Slider defaultValue={60} aria-label="音量">
				<SliderValue />
				<SliderControl>
					<SliderTrack>
						<SliderIndicator />
						<SliderThumb aria-label="音量" />
					</SliderTrack>
				</SliderControl>
			</Slider>
			<Select defaultValue="push" items={[{ value: "email", label: "邮件" }, { value: "push", label: "推送" }, { value: "sms", label: "短信" }]}>
				<SelectLabel>通知渠道</SelectLabel>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="email">邮件</SelectItem>
					<SelectItem value="push">推送</SelectItem>
					<SelectItem value="sms">短信</SelectItem>
				</SelectContent>
			</Select>
		</div>,
	);
	await new Promise((r) => setTimeout(r, 50));
	const snap = agent.snapshot();
	console.log(JSON.stringify(snap, null, 2));
	expect(snap.length).toBeGreaterThan(0);
});