import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test } from "vitest";
import { CopyCommand } from "@/demos/CopyCommand";
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
