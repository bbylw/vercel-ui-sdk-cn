import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";
import { CopyCommand } from "@/demos/CopyCommand";
import { ArchitectureDemo } from "@/demos/ArchitectureDemo";
import { BehaviorDemos } from "@/demos/BehaviorDemos";
import { FrameworkTabs } from "@/demos/FrameworkTabs";
import { ComponentCatalog } from "@/demos/ComponentCatalog";
import { Playground } from "@/demos/Playground";

afterEach(() => {
	cleanup();
});

describe("CopyCommand", () => {
	test("switches package manager command on toggle", async () => {
		const user = userEvent.setup();
		render(<CopyCommand />);

		expect(screen.getByText("bun add @ui-sdk/react @ui-sdk/core")).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "npm" }));
		expect(screen.getByText("npm install @ui-sdk/react @ui-sdk/core")).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "pnpm" }));
		expect(screen.getByText("pnpm add @ui-sdk/react @ui-sdk/core")).toBeTruthy();
	});
});

describe("FrameworkTabs", () => {
	test("switches framework code panels", async () => {
		const user = userEvent.setup();
		render(<FrameworkTabs />);

		expect(screen.getByText("bookmark.tsx")).toBeTruthy();

		await user.click(screen.getByRole("tab", { name: "Vue" }));
		expect(screen.getByText("Bookmark.vue")).toBeTruthy();

		await user.click(screen.getByRole("tab", { name: "Web Components" }));
		expect(screen.getByText("index.html")).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "复制 Web Components 代码" }));
		expect(screen.getAllByText("已复制").length).toBeGreaterThan(0);
	});
});

describe("ComponentCatalog", () => {
	test("renders component categories and links", () => {
		render(<ComponentCatalog />);

		expect(screen.getByRole("link", { name: /^按钮button$/ }).getAttribute("href")).toBe(
			"/docs/components/button",
		);
		expect(screen.getByRole("link", { name: /^对话框dialog$/ }).getAttribute("href")).toBe(
			"/docs/components/dialog",
		);
	});
});

describe("Playground", () => {
	test("renders interactive settings and agent snapshot panel", async () => {
		const user = userEvent.setup();
		render(<Playground />);

		expect(screen.getByText("启用通知")).toBeTruthy();
		expect(screen.getByText("通知渠道")).toBeTruthy();
		expect(screen.getByText("智能体快照")).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "JSON" }));
		expect(screen.getByRole("button", { name: "表格" })).toBeTruthy();
	});
});

describe("ArchitectureDemo", () => {
	test("switches layers and toggles unstyled vs styled view", async () => {
		const user = userEvent.setup();
		render(<ArchitectureDemo />);

		const layerBtn = screen.getByRole("button", { name: /2\. 轻量框架绑定层/ });
		await user.click(layerBtn);
		expect(layerBtn.getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByText(/同一原语映射为框架部件/)).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "裸行为层" }));
		expect(screen.getByText(/Unstyled · 原生 DOM 与 ARIA/)).toBeTruthy();

		await user.click(screen.getByRole("button", { name: "+ 你的样式" }));
		expect(screen.getByText(/Styled · Tailwind \+ data-\*/)).toBeTruthy();
	});
});

describe("BehaviorDemos", () => {
	test("toggles toolbar buttons with aria-pressed state", async () => {
		const user = userEvent.setup();
		render(<BehaviorDemos />);

		const bold = screen.getByRole("button", { name: "加粗" });
		const italic = screen.getByRole("button", { name: "斜体" });

		expect(bold.getAttribute("aria-pressed")).toBe("true");
		expect(italic.getAttribute("aria-pressed")).toBe("false");

		await user.click(italic);
		expect(italic.getAttribute("aria-pressed")).toBe("true");
		expect(screen.getByText("加粗 · 斜体")).toBeTruthy();
	});
});
